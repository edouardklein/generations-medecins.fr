"""
processor.py — Analyse chaque article avec GPT-4o-mini.
3 étapes : pertinence → résumé → tags.
"""
import json
import os
from openai import OpenAI

from config import ALL_TAGS, TAGS_THEMES, CATEGORIES

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

# ── Prompts ─────────────────────────────────────────────────────────────────

SYSTEM_VEILLE = """\
Tu es un assistant de veille pour Générations Médecins IDF, un collectif de médecins \
français. Tu analyses des articles de presse médicale et institutionnelle en français.
Tu ne traites QUE les sujets suivants :
- Politique de santé française (conventions, PLFSS, réformes, tarifs, déserts médicaux…)
- Syndicats et représentation médicale (URPS, négociations CNAM, grèves, représentativité…)
- Conditions d'exercice des médecins (libéral, hôpital, installation, cotisations, retraite…)
Tout autre sujet (clinique, épidémio, recherche fondamentale, international hors impact France) \
est hors périmètre."""

PROMPT_PERTINENCE = """\
Article :
Titre : {titre}
Extrait : {extrait}

Réponds UNIQUEMENT avec un JSON :
{{"score": <entier 0-10>, "raison": "<1 phrase>"}}
score 0-5 = hors périmètre, 6-10 = pertinent pour des médecins libéraux français."""

PROMPT_RESUME = """\
Article :
Titre : {titre}
Texte : {texte}

Rédige un résumé factuel en 2-3 phrases (max 280 caractères) en français, \
destiné à des médecins libéraux. Aucun jargon inutile. Termine par l'impact concret \
si possible ("Impact : …").
Réponds UNIQUEMENT avec le texte du résumé, sans guillemets ni balises."""

PROMPT_TAGS = """\
Article :
Titre : {titre}
Résumé : {resume}

Voici la liste EXHAUSTIVE des slugs autorisés (tu ne peux utiliser QUE ceux-ci) :
RÉGIONS : {regions}
THÈMES : {themes}

Réponds UNIQUEMENT avec un JSON :
{{
  "categorie": "<un parmi : {categories}>",
  "tags": ["slug1", "slug2", ...],  // max 6 slugs, uniquement depuis la liste ci-dessus
  "auteur": "Veille GM"
}}"""


# ── Fonctions ────────────────────────────────────────────────────────────────

def _call(messages: list, temperature: float = 0.2) -> str:
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=temperature,
        max_tokens=400,
    )
    return resp.choices[0].message.content.strip()


def score_pertinence(article: dict) -> tuple[int, str]:
    prompt = PROMPT_PERTINENCE.format(
        titre=article["titre"],
        extrait=article.get("extrait", "")[:600],
    )
    try:
        raw = _call([
            {"role": "system", "content": SYSTEM_VEILLE},
            {"role": "user",   "content": prompt},
        ])
        data = json.loads(raw)
        return int(data.get("score", 0)), data.get("raison", "")
    except Exception as e:
        print(f"  ⚠ pertinence parse error: {e} | raw: {raw[:100]}")
        return 0, "erreur parsing"


def resumer(article: dict, texte_complet: str) -> str:
    texte = texte_complet or article.get("extrait", "") or article["titre"]
    prompt = PROMPT_RESUME.format(titre=article["titre"], texte=texte[:2500])
    try:
        return _call([
            {"role": "system", "content": SYSTEM_VEILLE},
            {"role": "user",   "content": prompt},
        ])
    except Exception as e:
        print(f"  ⚠ résumé error: {e}")
        return article.get("extrait", "")[:280]


def taguer(article: dict, resume: str) -> dict:
    from config import TAGS_REGIONS
    prompt = PROMPT_TAGS.format(
        titre=article["titre"],
        resume=resume,
        regions=", ".join(TAGS_REGIONS),
        themes=", ".join(TAGS_THEMES),
        categories=", ".join(CATEGORIES),
    )
    try:
        raw = _call([
            {"role": "system", "content": SYSTEM_VEILLE},
            {"role": "user",   "content": prompt},
        ])
        data = json.loads(raw)
        # Valider que les tags sont dans la liste autorisée
        tags_valides = [t for t in data.get("tags", []) if t in ALL_TAGS]
        return {
            "categorie": data.get("categorie", article.get("categorie_hint", "avenant")),
            "tags":      tags_valides[:6],
        }
    except Exception as e:
        print(f"  ⚠ tags parse error: {e}")
        return {"categorie": article.get("categorie_hint", "avenant"), "tags": []}


def process(article: dict, texte_complet: str) -> dict | None:
    """
    Retourne l'article enrichi prêt pour Supabase, ou None si hors périmètre.
    """
    score, raison = score_pertinence(article)
    print(f"  score={score} — {article['titre'][:60]}")
    if score < 6:
        print(f"    → rejeté ({raison})")
        return None

    resume  = resumer(article, texte_complet)
    meta    = taguer(article, resume)

    return {
        "titre":     article["titre"],
        "slug":      article["slug"],
        "resume":    resume,
        "categorie": meta["categorie"],
        "tags":      meta["tags"],
        "source":    article["source"],
        "url":       article["url"],
        "publie_le": article["publie_le"],
        "auteur":    "Veille GM",
        "acces":     "public",
        "publie":    True,
    }
