-- Migration 007 — Correction RLS table admins
-- Problème : la policy utilisait is_admin() qui lit admins → deadlock circulaire
-- Fix : un utilisateur peut lire sa propre ligne (user_id = auth.uid())

DROP POLICY IF EXISTS "admins: lecture admin seulement" ON admins;

CREATE POLICY "admins: lecture sa propre ligne"
    ON admins FOR SELECT USING (user_id = auth.uid());
