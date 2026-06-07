-- ============================================================
-- Migration 023 — Écosystème multi-professions
--
-- organisations  : chaque "univers" professionnel (médecins, pharmaciens, infirmiers…)
-- org_membres    : admins et viewers rattachés à une organisation
-- greve_campagnes + greve_declarations : org_id nullable (NULL = GM médecins, rétrocompatible)
-- ============================================================

-- ── Table organisations ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS organisations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,           -- ex: "medecins", "pharmaciens", "infirmiers"
  nom           TEXT NOT NULL,                  -- ex: "Médecins en Grève"
  profession    TEXT NOT NULL,                  -- label court affiché sur le hub
  description   TEXT,
  couleur       TEXT DEFAULT '#1a3a8a',         -- couleur primaire CSS (hex)
  couleur2      TEXT DEFAULT '#2563eb',         -- dégradé secondaire
  emoji         TEXT DEFAULT '✊',
  logo_url      TEXT,
  id_type       TEXT DEFAULT 'RPPS'             -- 'RPPS' | 'ADELI' | 'FINESS' | 'SIRET'
                CHECK (id_type IN ('RPPS','ADELI','FINESS','SIRET','none')),
  actif         BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Seed : organisation GM médecins (slug = 'medecins', rétrocompat avec NULL org_id)
INSERT INTO organisations (slug, nom, profession, description, couleur, couleur2, emoji, id_type)
VALUES (
  'medecins',
  'Médecins en Grève',
  'Médecins',
  'Mobilisation des médecins libéraux portée par Générations Médecins Île-de-France.',
  '#1a3a8a',
  '#2563eb',
  '✊',
  'RPPS'
)
ON CONFLICT (slug) DO NOTHING;

-- Seed : pharmaciens (dormant)
INSERT INTO organisations (slug, nom, profession, description, couleur, couleur2, emoji, id_type, actif)
VALUES (
  'pharmaciens',
  'Pharmaciens en Action',
  'Pharmaciens',
  'Espace de mobilisation pour les pharmaciens d''officine.',
  '#0f766e',
  '#14b8a6',
  '💊',
  'FINESS',
  false
)
ON CONFLICT (slug) DO NOTHING;

-- Seed : infirmiers (dormant)
INSERT INTO organisations (slug, nom, profession, description, couleur, couleur2, emoji, id_type, actif)
VALUES (
  'infirmiers',
  'Infirmiers Mobilisés',
  'Infirmiers',
  'Espace de mobilisation pour les infirmiers libéraux (IDEL).',
  '#7c3aed',
  '#a855f7',
  '🩺',
  'ADELI',
  false
)
ON CONFLICT (slug) DO NOTHING;

-- Seed : kinés (dormant)
INSERT INTO organisations (slug, nom, profession, description, couleur, couleur2, emoji, id_type, actif)
VALUES (
  'kines',
  'Kinés en Grève',
  'Kinésithérapeutes',
  'Espace de mobilisation pour les kinésithérapeutes libéraux.',
  '#b45309',
  '#f59e0b',
  '🏃',
  'ADELI',
  false
)
ON CONFLICT (slug) DO NOTHING;

-- ── Table org_membres (admins / viewers par organisation) ────────────────────
CREATE TABLE IF NOT EXISTS org_membres (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT,                           -- invitation avant création de compte
  role          TEXT NOT NULL DEFAULT 'viewer'
                CHECK (role IN ('admin','viewer')),
  invite_token  TEXT UNIQUE,                    -- token temporaire pour onboarding
  accepted_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE (org_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_org_membres_org   ON org_membres(org_id);
CREATE INDEX IF NOT EXISTS idx_org_membres_user  ON org_membres(user_id);

-- ── Ajout org_id sur les tables existantes (nullable = rétrocompat) ───────────
ALTER TABLE greve_campagnes   ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organisations(id);
ALTER TABLE greve_declarations ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organisations(id);

CREATE INDEX IF NOT EXISTS idx_gc_org  ON greve_campagnes(org_id);
CREATE INDEX IF NOT EXISTS idx_gd_org  ON greve_declarations(org_id);

-- ── RLS ──────────────────────────────────────────────────────────────────────

-- organisations : lecture publique pour les organisations actives
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS orgs_public_read ON organisations;
CREATE POLICY orgs_public_read ON organisations
  FOR SELECT USING (actif = true);

-- org_membres : seuls les admins GM et les membres eux-mêmes peuvent lire
ALTER TABLE org_membres ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS org_membres_self_read ON org_membres;
CREATE POLICY org_membres_self_read ON org_membres
  FOR SELECT USING (user_id = auth.uid());

SELECT pg_notify('pgrst', 'reload schema');
