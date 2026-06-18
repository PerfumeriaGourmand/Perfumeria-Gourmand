"""
Debug: navega directo a la pagina de Sauvage y vuelca el HTML de las notas.
"""
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    context = browser.new_context(
        user_agent=(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/125.0.0.0 Safari/537.36"
        ),
    )
    page = context.new_page()

    # Ir directo a la pagina de Sauvage EDP
    url = "https://www.fragrantica.com/perfume/Dior/Sauvage-Eau-de-Parfum-48100.html"
    print(f"Navegando a: {url}")
    page.goto(url, wait_until="domcontentloaded", timeout=30000)
    time.sleep(5)

    html = page.content()

    # Guardar pagina completa
    with open("scripts/debug_perfume.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("HTML guardado en scripts/debug_perfume.html")

    # Buscar secciones con "note" en el HTML
    soup = BeautifulSoup(html, "html.parser")
    print(f"\nTitulo: {page.title()}")

    # Buscar divs/spans que contengan palabras clave de notas
    print("\n--- Buscando 'Top Notes' en el texto ---")
    for tag in soup.find_all(string=lambda t: t and "Top Notes" in t):
        parent = tag.parent
        print(f"  Tag: <{parent.name}> class={parent.get('class')} | texto: {tag[:80]}")

    print("\n--- Links con /notes/ ---")
    for a in soup.select("a[href*='/notes/']")[:10]:
        print(f"  {a.get('href')} | texto: {a.get_text(strip=True)}")

    print("\n--- Divs con clase que contenga 'accord' ---")
    for div in soup.find_all(class_=lambda c: c and any("accord" in cls for cls in c))[:5]:
        print(f"  <{div.name}> class={div.get('class')}")
        print(f"  texto: {div.get_text(strip=True)[:100]}")

    browser.close()
