from bs4 import BeautifulSoup

with open("scripts/debug_perfume.html", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")
notes = {"top": [], "heart": [], "base": []}
mapping = {
    "top notes": "top",
    "heart notes": "heart",
    "middle notes": "heart",
    "base notes": "base",
}
current = None

for tag in soup.find_all(["span", "a"]):
    text = tag.get_text(strip=True).lower()
    if tag.name == "span":
        for keyword, category in mapping.items():
            if text == keyword:
                current = category
                print(f"CATEGORIA: {keyword}")
                break
    if tag.name == "a" and current:
        href = tag.get("href", "")
        if "/notes/" in href:
            note_name = tag.get_text(strip=True)
            if note_name:
                notes[current].append(note_name)
                print(f"  ({current}): {note_name}")

print()
print("RESULTADO:", notes)
print("Alguna nota encontrada:", any(notes.values()))
