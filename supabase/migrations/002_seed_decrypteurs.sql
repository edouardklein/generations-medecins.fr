-- ============================================================
-- Migration 002 — Seed décrypteurs initiaux
-- ============================================================

INSERT INTO decrypteurs (titre, slug, extrait, categorie, tags, publie, publie_le) VALUES
(
    'Avenant n°9 : ce qui change concrètement selon votre profil',
    'avenant-9-ce-qui-change',
    'Généraliste S1, spécialiste S2, interne, remplaçant — impact réel pour chaque situation avec chiffres à l''appui.',
    'avenant',
    ARRAY['generaliste', 'specialiste', 'remplacant', 'S1', 'S2'],
    TRUE,
    '2025-05-26T08:00:00Z'
),
(
    'PLFSS 2026 : les 3 mesures qui vont impacter votre cabinet',
    'plfss-2026-3-mesures',
    'Analyse des impacts sur la T2A, la permanence de soins et les dépassements d''honoraires. En cours de validation.',
    'plfss',
    ARRAY['T2A', 'PDSA', 'liberaux'],
    TRUE,
    '2025-05-18T08:00:00Z'
),
(
    'Téléconsultation : nouvelles obligations avant le 1er septembre',
    'teleconsultation-obligations-septembre',
    'Ce que vous devez faire maintenant. Checklist complète et modèle de consentement patient à télécharger.',
    'decret',
    ARRAY['teleconsultation', 'numerique', 'consentement'],
    TRUE,
    '2025-05-10T08:00:00Z'
),
(
    'Refus de tiers payant : vos droits après l''arrêt du Conseil d''État',
    'refus-tiers-payant-conseil-etat',
    'Ce que vous pouvez refuser, dans quels cas, et comment vous protéger. Modèle de courrier inclus.',
    'jurisprudence',
    ARRAY['tiers-payant', 'droits', 'CPAM'],
    TRUE,
    '2025-05-02T08:00:00Z'
),
(
    'Cotisations URSSAF 2025 : nouveaux taux pour les libéraux',
    'urssaf-2025-nouveaux-taux',
    'Tableau comparatif par tranche de revenus. Ce qui change réellement dans votre fiche de calcul annuelle.',
    'urssaf',
    ARRAY['URSSAF', 'cotisations', 'liberal'],
    TRUE,
    '2025-04-28T08:00:00Z'
),
(
    'Mon Espace Santé : ce qui est maintenant obligatoire pour votre cabinet',
    'mon-espace-sante-obligations',
    'Nouvelles obligations de partage de documents, délais, et sanctions prévues en cas de non-conformité.',
    'numerique',
    ARRAY['Mon-Espace-Sante', 'numerique', 'conformite'],
    TRUE,
    '2025-04-15T08:00:00Z'
);
