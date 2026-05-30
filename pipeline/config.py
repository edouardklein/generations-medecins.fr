"""
Taxonomie complète des tags — source de vérité unique.
Le LLM reçoit cette liste et ne peut attribuer que des slugs connus.
"""

TAGS_REGIONS = [
    "ile-de-france", "auvergne-rhone-alpes", "bourgogne-franche-comte",
    "bretagne", "centre-val-de-loire", "corse", "grand-est",
    "hauts-de-france", "normandie", "nouvelle-aquitaine", "occitanie",
    "pays-de-la-loire", "provence-alpes-cote-dazur",
    "guadeloupe", "martinique", "guyane", "la-reunion", "mayotte",
]

TAGS_SPECIALITES = [
    "allergologie", "anatomie-cytologie-pathologique", "anesthesie-reanimation",
    "cardiologie", "dermatologie", "endocrinologie-nutrition", "genetique-medicale",
    "geriatrie", "gynecologie-medicale", "hematologie", "hepato-gastro-enterologie",
    "maladies-infectieuses-tropicales", "medecine-du-travail", "medecine-generale",
    "medecine-interne", "medecine-nucleaire", "medecine-physique-readaptation",
    "medecine-urgence", "nephrologie", "neurologie", "oncologie", "pediatrie",
    "pneumologie", "psychiatrie", "radiologie", "reanimation-medicale",
    "rhumatologie", "sante-publique",
    "chirurgie-esthetique-plastique", "chirurgie-maxillo-faciale-stomato",
    "chirurgie-pediatrique", "chirurgie-thoracique-cardiovasculaire",
    "chirurgie-vasculaire", "chirurgie-viscerale-digestive",
    "gynecologie-obstetrique", "medecine-legale-expertise", "neurochirurgie",
    "ophtalmologie", "orl-chirurgie-cervico-faciale", "orthopedie-traumatologie",
    "urologie", "biologie-medicale",
]

TAGS_THEMES = [
    "convention-medicale", "negociations-conventionnelles", "tarifs-honoraires",
    "tiers-payant", "secteurs-conventionnels", "plfss-lfss", "deserts-medicaux",
    "demographie-medicale", "numerus-apertus", "installation-liberale",
    "medecine-liberale", "msp-exercice-groupe", "hopital-public", "urgences",
    "permanence-des-soins", "telemedecine", "numerique-sante",
    "donnees-de-sante-rgpd", "retraite-carmf", "urssaf-cotisations",
    "urps-representativite", "ordre-des-medecins", "syndicats",
    "internes-formation", "reforme-etudes-medicales", "assurance-maladie-cnam",
    "ministere-sante", "greve-mobilisation", "medicaments-remboursement",
    "responsabilite-medicale",
]

ALL_TAGS = TAGS_REGIONS + TAGS_SPECIALITES + TAGS_THEMES

# Catégories décrypteurs (valeurs enum en base)
CATEGORIES = ["avenant", "plfss", "decret", "jurisprudence", "urssaf", "numerique"]

# Flux RSS à surveiller
RSS_SOURCES = [
    {
        "name": "Egora",
        "url": "https://www.egora.fr/rss.xml",
        "categorie_defaut": "avenant",
    },
    {
        "name": "Le Quotidien du Médecin",
        "url": "https://www.lequotidiendumedecin.fr/feed",
        "categorie_defaut": "avenant",
    },
    {
        "name": "JIM",
        "url": "https://www.jim.fr/rss/actualites.xml",
        "categorie_defaut": "decret",
    },
    {
        "name": "Medscape France",
        "url": "https://francais.medscape.com/rss/actualites",
        "categorie_defaut": "decret",
    },
]

# Google News RSS — mots-clés ciblés santé / syndicats
GOOGLE_NEWS_QUERIES = [
    "convention médicale médecins",
    "PLFSS médecins libéraux",
    "syndicat médecin négociation CNAM",
    "déserts médicaux installation médecin",
    "URPS médecins représentativité",
    "honoraires médecins secteur",
    "numerus apertus médecine",
    "garde médecin permanence soins",
    "médecin libéral retraite CARMF",
]

GOOGLE_NEWS_BASE = "https://news.google.com/rss/search?q={query}&hl=fr&gl=FR&ceid=FR:fr"
