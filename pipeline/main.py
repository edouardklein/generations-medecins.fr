"""
main.py — Point d'entrée du pipeline de veille.
Appelé par GitHub Actions chaque lundi matin.
"""
import os
import sys

import httpx

from scraper import collect_all, fetch_full_text
from processor import process

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]  # service_role — bypass RLS

HEADERS = {
    "apikey":        SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "return=minimal",
}


def get_existing_slugs() -> set[str]:
    """Récupère tous les slugs déjà en base pour éviter les doublons."""
    r = httpx.get(
        f"{SUPABASE_URL}/rest/v1/decrypteurs?select=slug",
        headers=HEADERS,
        timeout=15,
    )
    r.raise_for_status()
    return {row["slug"] for row in r.json()}


def insert_article(article: dict) -> bool:
    r = httpx.post(
        f"{SUPABASE_URL}/rest/v1/decrypteurs",
        headers=HEADERS,
        json=article,
        timeout=15,
    )
    if r.status_code in (200, 201):
        return True
    print(f"  ✗ INSERT échoué ({r.status_code}): {r.text[:200]}")
    return False


def run():
    print("═══ Veille Générations Médecins ═══")

    # 1. Collecte
    articles = collect_all()

    # 2. Dédup Supabase
    existing = get_existing_slugs()
    nouveaux = [a for a in articles if a["slug"] not in existing]
    print(f"→ {len(nouveaux)} nouveaux articles à traiter (sur {len(articles)})")

    if not nouveaux:
        print("Rien de nouveau cette semaine.")
        return

    # 3. Traitement LLM + insertion
    inseres = 0
    rejetes = 0
    for art in nouveaux:
        print(f"\n▸ {art['titre'][:70]}")
        texte = fetch_full_text(art["url"]) or ""
        enrichi = process(art, texte)
        if enrichi is None:
            rejetes += 1
            continue
        if insert_article(enrichi):
            print(f"  ✓ inséré | tags: {enrichi['tags']}")
            inseres += 1
        else:
            rejetes += 1

    print(f"\n═══ Terminé : {inseres} insérés, {rejetes} rejetés ═══")

    if inseres == 0 and len(nouveaux) > 0:
        # Sortir avec code erreur pour alerter dans GitHub Actions
        sys.exit(1)


if __name__ == "__main__":
    run()
