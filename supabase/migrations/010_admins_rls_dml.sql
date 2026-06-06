-- Migration 010 — RLS admins : autoriser le super-admin à gérer les sous-admins
-- La policy SELECT existante (user_id = auth.uid()) reste.
-- On ajoute INSERT + UPDATE + DELETE pour les admins authentifiés (is_admin()).

CREATE POLICY "admins: admin peut insérer"
    ON admins FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "admins: admin peut modifier"
    ON admins FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "admins: admin peut supprimer"
    ON admins FOR DELETE USING (is_admin());
