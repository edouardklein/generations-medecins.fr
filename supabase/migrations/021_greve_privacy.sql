-- ============================================================
-- Migration 021 — Anonymisation des déclarations de grève
-- Remplace le RPPS brut par une empreinte SHA-256 irréversible.
-- Supprime email/tel/consentement_info/attestation_envoyee de la
-- table greve_declarations (coordonnées non persistées en base).
-- Idempotente.
-- ============================================================

-- 1. Ajouter rpps_hash si absent
ALTER TABLE greve_declarations ADD COLUMN IF NOT EXISTS
  rpps_hash TEXT CHECK (rpps_hash IS NULL OR rpps_hash ~ '^[a-f0-9]{64}$');

-- 2. Si l'ancienne colonne rpps existe encore : migrer + supprimer
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='greve_declarations' AND column_name='rpps'
  ) THEN
    -- On ne peut pas recalculer le hash sans la clé (campagne_id) → on met NULL
    -- pour les lignes existantes ; le compteur reste intact via declaration_count.
    UPDATE greve_declarations SET rpps_hash = NULL WHERE rpps_hash IS NULL;
    ALTER TABLE greve_declarations DROP COLUMN rpps;
  END IF;
END $$;

-- 3. Supprimer les colonnes de coordonnées (non persistées désormais)
ALTER TABLE greve_declarations DROP COLUMN IF EXISTS email;
ALTER TABLE greve_declarations DROP COLUMN IF EXISTS tel;
ALTER TABLE greve_declarations DROP COLUMN IF EXISTS consentement_info;
ALTER TABLE greve_declarations DROP COLUMN IF EXISTS attestation_envoyee;

-- 4. Remplacer la contrainte d'unicité RPPS/campagne par rpps_hash/campagne
DO $$ BEGIN
  ALTER TABLE greve_declarations DROP CONSTRAINT IF EXISTS unique_rpps_campagne;
EXCEPTION WHEN undefined_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE greve_declarations ADD CONSTRAINT unique_rpps_hash_campagne
    UNIQUE (rpps_hash, campagne_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 5. Index
CREATE INDEX IF NOT EXISTS idx_gd_rpps_hash ON greve_declarations(rpps_hash);

-- 6. Ajouter colonne gs_optin à greve_campagnes si nécessaire pour stats admin
-- (compte les déclarations ayant consenti — maintenant compté côté Brevo, on garde
--  un simple compteur pour le dashboard)
ALTER TABLE greve_campagnes ADD COLUMN IF NOT EXISTS optin_count INTEGER DEFAULT 0;

SELECT pg_notify('pgrst', 'reload schema');
