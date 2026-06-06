-- Migration 003 — Nouveaux champs membres
-- À coller dans Supabase SQL Editor → New query → Run

-- Téléphone
ALTER TABLE membres ADD COLUMN IF NOT EXISTS telephone text;

-- Code postal d'exercice
ALTER TABLE membres ADD COLUMN IF NOT EXISTS code_postal text;

-- Indicateur interne / faisant fonction
ALTER TABLE membres ADD COLUMN IF NOT EXISTS est_interne boolean NOT NULL DEFAULT false;

-- Mode d'exercice passe en text (plusieurs valeurs séparées par virgule)
-- Ex : "liberal_seul,salarie"
ALTER TABLE membres ALTER COLUMN mode_exercice TYPE text USING mode_exercice::text;
