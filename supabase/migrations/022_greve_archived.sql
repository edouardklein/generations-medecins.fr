-- ============================================================
-- Migration 022 — Séparation actif / archived sur greve_campagnes
--
-- actif    = les déclarations publiques sont ouvertes (toggle open/fermé)
-- archived = campagne clôturée définitivement, lecture seule dans l'admin
--
-- Idempotente.
-- ============================================================

ALTER TABLE greve_campagnes ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;

-- Toutes les campagnes existantes restent non-archivées par défaut
UPDATE greve_campagnes SET archived = false WHERE archived IS NULL;

CREATE INDEX IF NOT EXISTS idx_gc_archived ON greve_campagnes(archived);

-- Mise à jour de la politique lecture publique (inchangée — la colonne actif
-- déjà présente contrôle l'acceptation des déclarations côté front)

SELECT pg_notify('pgrst', 'reload schema');
