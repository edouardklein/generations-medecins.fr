-- Migration 011 — Renommer progression → avancement_pct + ajouter description_courte
ALTER TABLE plaidoyer_dossiers RENAME COLUMN progression TO avancement_pct;
ALTER TABLE plaidoyer_dossiers ADD COLUMN IF NOT EXISTS description_courte TEXT;
