-- Migration 005 — Colonnes manquantes pour le pipeline de veille
-- À coller dans Supabase SQL Editor → New query → Run

ALTER TABLE decrypteurs ADD COLUMN IF NOT EXISTS resume  text;
ALTER TABLE decrypteurs ADD COLUMN IF NOT EXISTS source  text;
ALTER TABLE decrypteurs ADD COLUMN IF NOT EXISTS url     text;
ALTER TABLE decrypteurs ADD COLUMN IF NOT EXISTS auteur  text;
ALTER TABLE decrypteurs ADD COLUMN IF NOT EXISTS acces   text DEFAULT 'public';
