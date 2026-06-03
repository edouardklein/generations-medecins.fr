-- Migration 015 — Colonnes veille automatisée sur la table decrypteurs

ALTER TABLE decrypteurs ADD COLUMN IF NOT EXISTS auto_import   BOOLEAN  DEFAULT false;
ALTER TABLE decrypteurs ADD COLUMN IF NOT EXISTS veille_statut TEXT     DEFAULT 'publie'
  CHECK (veille_statut IN ('publie', 'rejete'));
ALTER TABLE decrypteurs ADD COLUMN IF NOT EXISTS tags          TEXT[]   DEFAULT '{}';
