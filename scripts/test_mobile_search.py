from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto("http://localhost:3000")
    page.wait_for_load_state("networkidle")

    page.get_by_label("Buscar").click()
    page.wait_for_timeout(400)

    search_input = page.get_by_placeholder("Buscar perfumes, marcas...")
    search_input.fill("dior")
    page.wait_for_timeout(800)

    page.screenshot(path="C:/Users/Usuario/OneDrive/Desktop/Proyectos/Gourmand/Gourmand/scripts/mobile_search_result.png")

    dropdown = page.locator("ul li a").first
    print("dropdown visible:", dropdown.is_visible() if dropdown.count() else "no results found")
    box = dropdown.bounding_box() if dropdown.count() else None
    print("bounding box:", box)
    viewport = page.viewport_size
    print("viewport:", viewport)

    browser.close()
