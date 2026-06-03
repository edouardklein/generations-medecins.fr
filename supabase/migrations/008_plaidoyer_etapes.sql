-- Migration 008 — Étapes des dossiers plaidoyer
CREATE TABLE IF NOT EXISTS plaidoyer_etapes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dossier_id  UUID NOT NULL REFERENCES plaidoyer_dossiers(id) ON DELETE CASCADE,
    texte       TEXT NOT NULL,
    pourcentage INTEGER DEFAULT 0 CHECK (pourcentage BETWEEN 0 AND 100),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE plaidoyer_etapes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plaidoyer_etapes: lecture publique"
    ON plaidoyer_etapes FOR SELECT USING (true);

CREATE POLICY "plaidoyer_etapes: admin seulement"
    ON plaidoyer_etapes FOR ALL USING (is_admin());
