-- ============================================================
-- Migration 016 — Générateur de courriers personnalisés
-- À coller dans Supabase SQL Editor → New query → Run
-- Idempotent : peut être ré-exécutée sans danger.
-- ============================================================

-- Table : courriers_generes
CREATE TABLE IF NOT EXISTS courriers_generes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    membre_id       UUID REFERENCES membres(id) ON DELETE CASCADE,
    modele_id       UUID REFERENCES courriers(id) ON DELETE SET NULL,
    titre           TEXT NOT NULL DEFAULT 'Courrier sans titre',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Toutes les autres colonnes en ALTER, pour rattraper une éventuelle table partielle
ALTER TABLE courriers_generes ADD COLUMN IF NOT EXISTS expediteur       JSONB   DEFAULT '{}'::jsonb;
ALTER TABLE courriers_generes ADD COLUMN IF NOT EXISTS destinataire     JSONB   DEFAULT '{}'::jsonb;
ALTER TABLE courriers_generes ADD COLUMN IF NOT EXISTS contenu          TEXT    DEFAULT '';
ALTER TABLE courriers_generes ADD COLUMN IF NOT EXISTS objet            TEXT    DEFAULT '';
ALTER TABLE courriers_generes ADD COLUMN IF NOT EXISTS statut           TEXT    DEFAULT 'brouillon';
ALTER TABLE courriers_generes ADD COLUMN IF NOT EXISTS signataire_nom   TEXT;
ALTER TABLE courriers_generes ADD COLUMN IF NOT EXISTS signature_token  TEXT;
ALTER TABLE courriers_generes ADD COLUMN IF NOT EXISTS signe_le         TIMESTAMPTZ;
ALTER TABLE courriers_generes ADD COLUMN IF NOT EXISTS signe_par        TEXT;
ALTER TABLE courriers_generes ADD COLUMN IF NOT EXISTS mass_mailing     BOOLEAN DEFAULT false;
ALTER TABLE courriers_generes ADD COLUMN IF NOT EXISTS mass_mailing_le  TIMESTAMPTZ;
ALTER TABLE courriers_generes ADD COLUMN IF NOT EXISTS partage_public   BOOLEAN DEFAULT false;
ALTER TABLE courriers_generes ADD COLUMN IF NOT EXISTS partage_token    TEXT;

-- Contraintes
DO $$ BEGIN
    ALTER TABLE courriers_generes ADD CONSTRAINT cg_statut_check
        CHECK (statut IN ('brouillon', 'signe', 'envoye'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE courriers_generes ADD CONSTRAINT cg_signature_token_unique UNIQUE (signature_token);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE courriers_generes ADD CONSTRAINT cg_partage_token_unique UNIQUE (partage_token);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Index
CREATE INDEX IF NOT EXISTS idx_cg_membre        ON courriers_generes(membre_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_cg_modele        ON courriers_generes(modele_id);
CREATE INDEX IF NOT EXISTS idx_cg_mass_mailing  ON courriers_generes(mass_mailing, modele_id) WHERE mass_mailing = true;
CREATE INDEX IF NOT EXISTS idx_cg_partage       ON courriers_generes(partage_token) WHERE partage_token IS NOT NULL;

-- updated_at automatique
DROP TRIGGER IF EXISTS trg_cg_upd ON courriers_generes;
CREATE TRIGGER trg_cg_upd BEFORE UPDATE ON courriers_generes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE courriers_generes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cg: lecture" ON courriers_generes;
CREATE POLICY "cg: lecture"
    ON courriers_generes FOR SELECT
    USING (membre_id = mon_membre_id() OR partage_public = TRUE OR is_admin());

DROP POLICY IF EXISTS "cg: creation" ON courriers_generes;
CREATE POLICY "cg: creation"
    ON courriers_generes FOR INSERT
    WITH CHECK (membre_id = mon_membre_id());

DROP POLICY IF EXISTS "cg: modification" ON courriers_generes;
CREATE POLICY "cg: modification"
    ON courriers_generes FOR UPDATE
    USING (membre_id = mon_membre_id() OR is_admin());

DROP POLICY IF EXISTS "cg: suppression" ON courriers_generes;
CREATE POLICY "cg: suppression"
    ON courriers_generes FOR DELETE
    USING (membre_id = mon_membre_id() OR is_admin());

-- ============================================================
-- Vue agrégée pour le mass-mailing
-- ============================================================
CREATE OR REPLACE VIEW mass_mailing_stats AS
    SELECT
        modele_id,
        COUNT(*)                          AS total,
        MIN(mass_mailing_le)              AS premier,
        MAX(mass_mailing_le)              AS dernier
    FROM courriers_generes
    WHERE mass_mailing = TRUE
    GROUP BY modele_id;
