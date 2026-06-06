-- ============================================================
-- Migration 018 — Consultations juridiques via Doctrine
-- À coller dans Supabase SQL Editor → New query → Run
-- Idempotent : peut être ré-exécutée sans danger.
-- ============================================================

-- Table : consultations_juridiques
CREATE TABLE IF NOT EXISTS consultations_juridiques (
    id                   UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    membre_id            UUID        REFERENCES membres(id) ON DELETE CASCADE,
    question             TEXT        NOT NULL,
    question_reformulee  TEXT,
    documents            JSONB       DEFAULT '[]',
    reponse_doctrine     TEXT,
    synthese             TEXT,
    pdf_url              TEXT,
    statut               TEXT        DEFAULT 'recue',
    note_operateur       TEXT,
    created_at           TIMESTAMPTZ DEFAULT NOW(),
    updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Toutes les colonnes en ALTER, pour rattraper une éventuelle table partielle
-- (le CREATE TABLE IF NOT EXISTS saute silencieusement si la table existe déjà)
ALTER TABLE consultations_juridiques ADD COLUMN IF NOT EXISTS membre_id            UUID        REFERENCES membres(id) ON DELETE CASCADE;
ALTER TABLE consultations_juridiques ADD COLUMN IF NOT EXISTS question             TEXT;
ALTER TABLE consultations_juridiques ADD COLUMN IF NOT EXISTS question_reformulee  TEXT;
ALTER TABLE consultations_juridiques ADD COLUMN IF NOT EXISTS documents            JSONB       DEFAULT '[]';
ALTER TABLE consultations_juridiques ADD COLUMN IF NOT EXISTS reponse_doctrine     TEXT;
ALTER TABLE consultations_juridiques ADD COLUMN IF NOT EXISTS synthese             TEXT;
ALTER TABLE consultations_juridiques ADD COLUMN IF NOT EXISTS pdf_url              TEXT;
ALTER TABLE consultations_juridiques ADD COLUMN IF NOT EXISTS statut               TEXT        DEFAULT 'recue';
ALTER TABLE consultations_juridiques ADD COLUMN IF NOT EXISTS note_operateur       TEXT;
ALTER TABLE consultations_juridiques ADD COLUMN IF NOT EXISTS created_at           TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE consultations_juridiques ADD COLUMN IF NOT EXISTS updated_at           TIMESTAMPTZ DEFAULT NOW();

-- Contrainte de statut
DO $$ BEGIN
    ALTER TABLE consultations_juridiques ADD CONSTRAINT cj_statut_check
        CHECK (statut IN ('recue', 'prete', 'en_cours', 'doctrine_repondu', 'terminee', 'archivee'));
EXCEPTION WHEN duplicate_object THEN NULL; WHEN duplicate_table THEN NULL; END $$;

-- Index
CREATE INDEX IF NOT EXISTS idx_cj_membre     ON consultations_juridiques(membre_id);
CREATE INDEX IF NOT EXISTS idx_cj_statut     ON consultations_juridiques(statut);
CREATE INDEX IF NOT EXISTS idx_cj_created    ON consultations_juridiques(created_at DESC);

-- updated_at automatique
DROP TRIGGER IF EXISTS trg_cj_upd ON consultations_juridiques;
CREATE TRIGGER trg_cj_upd BEFORE UPDATE ON consultations_juridiques
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE consultations_juridiques ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cj: lecture membre" ON consultations_juridiques;
CREATE POLICY "cj: lecture membre"
    ON consultations_juridiques FOR SELECT
    USING (membre_id = mon_membre_id());

DROP POLICY IF EXISTS "cj: lecture admin" ON consultations_juridiques;
CREATE POLICY "cj: lecture admin"
    ON consultations_juridiques FOR SELECT
    USING (is_admin());

DROP POLICY IF EXISTS "cj: creation" ON consultations_juridiques;
CREATE POLICY "cj: creation"
    ON consultations_juridiques FOR INSERT
    WITH CHECK (membre_id = mon_membre_id());

DROP POLICY IF EXISTS "cj: mise a jour admin" ON consultations_juridiques;
CREATE POLICY "cj: mise a jour admin"
    ON consultations_juridiques FOR UPDATE
    USING (is_admin());

-- Force le rechargement du cache de schéma PostgREST
SELECT pg_notify('pgrst', 'reload schema');
