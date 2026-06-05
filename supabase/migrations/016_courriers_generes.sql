-- ============================================================
-- Migration 016 — Générateur de courriers personnalisés
-- À coller dans Supabase SQL Editor → New query → Run
-- ============================================================

-- Table : courriers_generes
-- Chaque courrier rédigé/personnalisé par un membre à partir d'un modèle
CREATE TABLE IF NOT EXISTS courriers_generes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    membre_id       UUID REFERENCES membres(id) ON DELETE CASCADE,
    modele_id       UUID REFERENCES courriers(id) ON DELETE SET NULL,

    titre           TEXT NOT NULL DEFAULT 'Courrier sans titre',
    -- Snapshot de l'expéditeur (coordonnées du profil au moment de la création)
    expediteur      JSONB DEFAULT '{}'::jsonb,
    -- Destinataire (vide pour l'instant, annuaire à venir)
    destinataire    JSONB DEFAULT '{}'::jsonb,
    -- Corps du courrier (HTML léger éditable)
    contenu         TEXT DEFAULT '',
    objet           TEXT DEFAULT '',

    -- Cycle de vie : brouillon → signe → envoye
    statut          TEXT DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'signe', 'envoye')),

    -- Signature électronique (double opt-in par email)
    signataire_nom    TEXT,             -- nom tapé dans le bloc signature
    signature_token   TEXT UNIQUE,      -- jeton envoyé par email
    signe_le          TIMESTAMPTZ,      -- date/heure de confirmation
    signe_par         TEXT,             -- email ayant confirmé

    -- Mass-mailing : bascule vers un envoi groupé
    mass_mailing      BOOLEAN DEFAULT false,
    mass_mailing_le   TIMESTAMPTZ,

    -- Partage public
    partage_public  BOOLEAN DEFAULT false,
    partage_token   TEXT UNIQUE,

    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cg_membre        ON courriers_generes(membre_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_cg_modele        ON courriers_generes(modele_id);
CREATE INDEX IF NOT EXISTS idx_cg_mass_mailing  ON courriers_generes(mass_mailing, modele_id) WHERE mass_mailing = true;
CREATE INDEX IF NOT EXISTS idx_cg_partage       ON courriers_generes(partage_token) WHERE partage_token IS NOT NULL;

-- updated_at automatique (réutilise la fonction existante)
DROP TRIGGER IF EXISTS trg_cg_upd ON courriers_generes;
CREATE TRIGGER trg_cg_upd BEFORE UPDATE ON courriers_generes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE courriers_generes ENABLE ROW LEVEL SECURITY;

-- Lecture : le membre voit les siens ; tout le monde voit les courriers partagés ; admin voit tout
DROP POLICY IF EXISTS "cg: lecture" ON courriers_generes;
CREATE POLICY "cg: lecture"
    ON courriers_generes FOR SELECT
    USING (membre_id = mon_membre_id() OR partage_public = TRUE OR is_admin());

-- Création : un membre actif crée ses propres courriers
DROP POLICY IF EXISTS "cg: creation" ON courriers_generes;
CREATE POLICY "cg: creation"
    ON courriers_generes FOR INSERT
    WITH CHECK (membre_id = mon_membre_id());

-- Modification : le membre modifie les siens (ou admin)
DROP POLICY IF EXISTS "cg: modification" ON courriers_generes;
CREATE POLICY "cg: modification"
    ON courriers_generes FOR UPDATE
    USING (membre_id = mon_membre_id() OR is_admin());

-- Suppression : le membre supprime les siens (ou admin)
DROP POLICY IF EXISTS "cg: suppression" ON courriers_generes;
CREATE POLICY "cg: suppression"
    ON courriers_generes FOR DELETE
    USING (membre_id = mon_membre_id() OR is_admin());

-- ============================================================
-- Vue agrégée pour le mass-mailing (admin) : nombre de courriers par modèle
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
