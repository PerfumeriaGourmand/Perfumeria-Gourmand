"""
Scraper de notas olfativas desde Fragrantica usando Playwright (headless browser).
Guarda los resultados en products.notes_top/heart/base via upsert.

Uso:
    pip install playwright beautifulsoup4 supabase python-dotenv
    playwright install chromium
    python scripts/scrape_notes.py

Variables de entorno requeridas (en .env.local o .env):
    NEXT_PUBLIC_SUPABASE_URL
    SUPABASE_SERVICE_ROLE_KEY
"""

import os
import re
import time
import random
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout
from playwright_stealth import Stealth

# ── Env ───────────────────────────────────────────────────────────────────────
for env_file in [".env.local", ".env"]:
    path = Path(__file__).parent.parent / env_file
    if path.exists():
        load_dotenv(path)
        break

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(
        "Faltan variables: NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY"
    )

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

FRAGRANTICA_BASE = "https://www.fragrantica.com"


# ── Parser de notas ───────────────────────────────────────────────────────────
def parse_notes(html: str) -> dict:
    """
    Extrae top, heart y base notes del HTML de una página de perfume en Fragrantica.
    Estrategia: encabezados <span> con texto "Top Notes" / "Heart Notes" / "Base Notes"
    seguidos de links <a href="/notes/..."> con el nombre de cada nota.
    """
    soup = BeautifulSoup(html, "html.parser")
    notes = {"top": [], "heart": [], "base": []}

    mapping = {
        "top notes": "top",
        "heart notes": "heart",
        "middle notes": "heart",
        "base notes": "base",
    }

    # Fragrantica usa spans con texto "Top Notes", "Heart Notes", "Base Notes"
    # Los links de notas individuales tienen href que contiene /notes/
    current = None

    for tag in soup.find_all(["span", "a"]):
        text = tag.get_text(strip=True).lower()

        # Detectar categoría por el span de encabezado
        if tag.name == "span":
            for keyword, category in mapping.items():
                if text == keyword:
                    current = category
                    break

        # Extraer nota individual de links /notes/
        if tag.name == "a" and current:
            href = tag.get("href", "")
            if "/notes/" in href:
                note_name = tag.get_text(strip=True)
                if note_name and note_name not in notes[current]:
                    notes[current].append(note_name)

    return notes


def verify_product_page(html: str, name: str, brand: str) -> bool:
    """Verifica que la página cargada corresponde al perfume correcto."""
    soup = BeautifulSoup(html, "html.parser")
    title = soup.title.string if soup.title else ""
    page_text = (title + " " + soup.get_text()[:500]).lower()

    # Verificar que al menos el nombre o la marca aparecen en la página
    name_words = [w.lower() for w in name.split() if len(w) > 3]
    matches = sum(1 for w in name_words if w in page_text)
    return matches >= max(1, len(name_words) // 2)


# ── Scraping con Playwright ───────────────────────────────────────────────────
def get_notes_for_product(page, name: str, brand: str) -> dict | None:
    """Busca en Fragrantica y extrae las notas del primer resultado."""
    query = f"{name} {brand}".replace(" ", "+")
    search_url = f"{FRAGRANTICA_BASE}/search/?query={query}"

    try:
        page.goto(search_url, wait_until="domcontentloaded", timeout=20000)
        # Esperar a que el JS renderice los resultados
        time.sleep(3)
    except PlaywrightTimeout:
        print(f"    [TIMEOUT] search: {search_url}")
        return None
    except Exception as e:
        print(f"    [ERROR search] {e}")
        return None

    # Buscar el primer link a un perfume con ID numérico
    html = page.content()
    soup = BeautifulSoup(html, "html.parser")

    perfume_url = None
    for a in soup.select("a[href*='/perfume/']"):
        href = a.get("href", "")
        if re.search(r"/perfume/[^/]+/[^/]+-\d+\.html", href):
            perfume_url = href if href.startswith("http") else FRAGRANTICA_BASE + href
            break

    if not perfume_url:
        print(f"    [NO URL] no se encontro link de perfume en la busqueda")
        return None
    print(f"    [URL] {perfume_url}")

    # Navegar a la página del perfume
    try:
        page.goto(perfume_url, wait_until="domcontentloaded", timeout=20000)
        time.sleep(3)
    except PlaywrightTimeout:
        print(f"    [TIMEOUT] perfume: {perfume_url}")
    except Exception as e:
        print(f"    [ERROR perfume] {e}")
        return None

    html = page.content()
    notes = parse_notes(html)

    # Descartar si no se encontró nada
    if not any(notes.values()):
        return None

    return notes


def save_notes(product_id: str, notes: dict) -> None:
    """Actualiza notes_top/heart/base directamente en products."""
    supabase.table("products").update({
        "notes_top":   notes["top"],
        "notes_heart": notes["heart"],
        "notes_base":  notes["base"],
    }).eq("id", product_id).execute()


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    result = supabase.table("products").select("id, name, brand").eq("is_active", True).execute()
    products = result.data
    total = len(products)

    print(f"\n[INICIO] {total} productos encontrados. Iniciando scraping con Playwright...\n")

    found = []
    not_found = []

    with sync_playwright() as p:
        # headless=False necesario para pasar el Cloudflare de Fragrantica
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/125.0.0.0 Safari/537.36"
            ),
            locale="es-AR",
        )
        page = context.new_page()
        Stealth().use_sync(page)  # evita deteccion de Cloudflare

        for i, product in enumerate(products, start=1):
            pid   = product["id"]
            name  = product["name"]
            brand = product["brand"]
            label = f"[{i:02d}/{total}] {name} - {brand}"

            notes = get_notes_for_product(page, name, brand)

            if notes:
                save_notes(pid, notes)
                top_preview = ", ".join(notes["top"][:3]) or "-"
                print(f"  [OK] {label}  |  Salida: {top_preview}")
                found.append(f"{name} - {brand}")
            else:
                print(f"  [--] {label} -> NO ENCONTRADO")
                not_found.append(f"{name} - {brand}")

            # Espera aleatoria para no ser bloqueado
            if i < total:
                time.sleep(random.uniform(2.5, 4.0))

        browser.close()

    print("\n" + "=" * 60)
    print(f"RESUMEN: {len(found)}/{total} encontrados, {len(not_found)} no encontrados")
    print("=" * 60)

    if not_found:
        print("\nNO ENCONTRADOS:")
        for item in not_found:
            print(f"   - {item}")

    print()


if __name__ == "__main__":
    main()
