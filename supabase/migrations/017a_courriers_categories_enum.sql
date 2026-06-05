-- ============================================================
-- Migration 017a — Étendre l'enum categorie_courrier
-- À EXÉCUTER EN PREMIER, puis 017b dans un second run.
-- ⚠️ PostgreSQL exige que les nouvelles valeurs d'enum soient
--    committées avant d'être utilisables dans un INSERT.
-- Idempotent : IF NOT EXISTS.
-- ============================================================

ALTER TYPE categorie_courrier ADD VALUE IF NOT EXISTS 'urssaf';
ALTER TYPE categorie_courrier ADD VALUE IF NOT EXISTS 'confreres';
ALTER TYPE categorie_courrier ADD VALUE IF NOT EXISTS 'organismes';
ALTER TYPE categorie_courrier ADD VALUE IF NOT EXISTS 'defense';
