-- Migration 006 — Préférences tags membres
-- À coller dans Supabase SQL Editor → New query → Run

ALTER TABLE membres ADD COLUMN IF NOT EXISTS tags_preferences text[] DEFAULT '{}';
