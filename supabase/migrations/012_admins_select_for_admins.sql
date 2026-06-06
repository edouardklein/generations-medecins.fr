-- Migration 012 — Permettre aux admins de voir toutes les lignes admins
-- (is_admin() est SECURITY DEFINER → pas de récursion RLS)

CREATE POLICY "admins: admin voit toutes les lignes"
    ON admins FOR SELECT USING (is_admin());
