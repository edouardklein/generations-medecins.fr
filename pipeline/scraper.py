"""
scraper.py — Collecte les articles depuis RSS + Google News.
Retourne une liste d'articles bruts dédupliqués.
"""
import hashlib
import re
import urllib.parse
from datetime import datetime, timezone
from typing import Optional

import feedparser
import httpx

from config import RSS_SOURCES, GOOGLE_NEWS_QUERIES, GOOGLE_NEWS_BASE


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[àâä]", "a", text)
    text = re.sub(r"[éèêë]", "e", text)
    text = re.sub(r"[îï]", "i", text)
    text = re.sub(r"[ôö]", "o", text)
    text = re.sub(r"[ùûü]", "u", text)
    text = re.sub(r"[ç]", "c", text)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = text.strip("-")
    return text[:80]


def url_to_slug(url: str, title: str) -> str:
    """Slug stable basé sur l'URL (dédup fiable)."""
    h = hashlib.md5(url.encode()).hexdigest()[:8]
    return f"{slugify(title)}-{h}"


def parse_date(entry) -> str:
    """Retourne une date ISO depuis un entry feedparser."""
    if hasattr(entry, "published_parsed") and entry.published_parsed:
        return datetime(*entry.published_parsed[:6], tzinfo=timezone.utc).isoformat()
    return datetime.now(timezone.utc).isoformat()


def fetch_rss(source: dict) -> list[dict]:
    articles = []
    try:
        feed = feedparser.parse(source["url"])
        for entry in feed.entries[:20]:  # max 20 par source
            title = getattr(entry, "title", "").strip()
            link  = getattr(entry, "link",  "").strip()
            desc  = getattr(entry, "summary", "") or getattr(entry, "description", "")
            if not title or not link:
                continue
            articles.append({
                "titre":      title,
                "url":        link,
                "slug":       url_to_slug(link, title),
                "extrait":    re.sub(r"<[^>]+>", "", desc).strip()[:500],
                "source":     source["name"],
                "publie_le":  parse_date(entry),
                "categorie_hint": source["categorie_defaut"],
            })
    except Exception as e:
        print(f"⚠ RSS {source['name']}: {e}")
    return articles


def fetch_google_news(query: str) -> list[dict]:
    articles = []
    url = GOOGLE_NEWS_BASE.format(query=urllib.parse.quote(query))
    try:
        feed = feedparser.parse(url)
        for entry in feed.entries[:10]:
            title = getattr(entry, "title", "").strip()
            link  = getattr(entry, "link",  "").strip()
            if not title or not link:
                continue
            articles.append({
                "titre":      title,
                "url":        link,
                "slug":       url_to_slug(link, title),
                "extrait":    "",
                "source":     "Google News",
                "publie_le":  parse_date(entry),
                "categorie_hint": "avenant",
            })
    except Exception as e:
        print(f"⚠ Google News '{query}': {e}")
    return articles


def fetch_full_text(url: str, timeout: int = 10) -> Optional[str]:
    """Tente de récupérer le texte brut de la page (best-effort)."""
    try:
        r = httpx.get(url, timeout=timeout, follow_redirects=True,
                      headers={"User-Agent": "Mozilla/5.0 (compatible; GMveille/1.0)"})
        if r.status_code != 200:
            return None
        # Extraction naïve : on vire les balises HTML
        text = re.sub(r"<script[^>]*>.*?</script>", " ", r.text, flags=re.DOTALL)
        text = re.sub(r"<style[^>]*>.*?</style>",  " ", text, flags=re.DOTALL)
        text = re.sub(r"<[^>]+>", " ", text)
        text = re.sub(r"\s+", " ", text).strip()
        return text[:3000]  # 3 000 chars suffisent pour résumer
    except Exception:
        return None


def collect_all() -> list[dict]:
    seen_slugs: set[str] = set()
    articles: list[dict] = []

    # RSS sources
    for source in RSS_SOURCES:
        for art in fetch_rss(source):
            if art["slug"] not in seen_slugs:
                seen_slugs.add(art["slug"])
                articles.append(art)

    # Google News
    for query in GOOGLE_NEWS_QUERIES:
        for art in fetch_google_news(query):
            if art["slug"] not in seen_slugs:
                seen_slugs.add(art["slug"])
                articles.append(art)

    print(f"→ {len(articles)} articles collectés avant dédup Supabase")
    return articles
