-- ============================================================
-- Migration 024 — RLS écosystème : accès super-admin
--
-- Permet au super-admin GM (admins.role = 'super_admin') de :
--   - voir et gérer TOUTES les organisations (même inactives)
--   - voir et gérer TOUS les org_membres (affectation des admins délégués)
--
-- Les admins délégués (org_membres.role = 'admin') gardent l'accès
-- à leur propre organisation uniquement.
-- ============================================================

-- Helper : l'utilisateur courant est-il super-admin GM ?
CREATE OR REPLACE FUNCTION is_gm_super_admin()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
$$;

-- Helper : l'utilisateur courant est-il admin (délégué) d'une organisation ?
CREATE OR REPLACE FUNCTION is_org_admin(target_org UUID)
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM org_membres
    WHERE org_id = target_org AND user_id = auth.uid() AND role = 'admin'
  );
$$;

-- ── organisations ─────────────────────────────────────────────────────────────
-- Lecture : public si actif, OU super-admin (voit tout), OU membre de l'org
DROP POLICY IF EXISTS orgs_public_read ON organisations;
CREATE POLICY orgs_read ON organisations
  FOR SELECT USING (
    actif = true
    OR is_gm_super_admin()
    OR EXISTS (SELECT 1 FROM org_membres WHERE org_id = organisations.id AND user_id = auth.uid())
  );

-- Écriture (activation/désactivation, branding) : super-admin uniquement
DROP POLICY IF EXISTS orgs_super_admin_write ON organisations;
CREATE POLICY orgs_super_admin_write ON organisations
  FOR UPDATE USING (is_gm_super_admin()) WITH CHECK (is_gm_super_admin());

DROP POLICY IF EXISTS orgs_super_admin_insert ON organisations;
CREATE POLICY orgs_super_admin_insert ON organisations
  FOR INSERT WITH CHECK (is_gm_super_admin());

-- ── org_membres ───────────────────────────────────────────────────────────────
-- Lecture : soi-même, OU super-admin (tout), OU admin de l'org concernée
DROP POLICY IF EXISTS org_membres_self_read ON org_membres;
CREATE POLICY org_membres_read ON org_membres
  FOR SELECT USING (
    user_id = auth.uid()
    OR is_gm_super_admin()
    OR is_org_admin(org_membres.org_id)
  );

-- Insertion (affecter un admin/lecteur) : super-admin OU admin de l'org
DROP POLICY IF EXISTS org_membres_insert ON org_membres;
CREATE POLICY org_membres_insert ON org_membres
  FOR INSERT WITH CHECK (
    is_gm_super_admin() OR is_org_admin(org_id)
  );

-- Modification (changer un rôle) : super-admin OU admin de l'org
DROP POLICY IF EXISTS org_membres_update ON org_membres;
CREATE POLICY org_membres_update ON org_membres
  FOR UPDATE USING (
    is_gm_super_admin() OR is_org_admin(org_id)
  ) WITH CHECK (
    is_gm_super_admin() OR is_org_admin(org_id)
  );

-- Suppression (révoquer un accès) : super-admin OU admin de l'org
DROP POLICY IF EXISTS org_membres_delete ON org_membres;
CREATE POLICY org_membres_delete ON org_membres
  FOR DELETE USING (
    is_gm_super_admin() OR is_org_admin(org_membres.org_id)
  );

-- ── greve_campagnes : les admins délégués gèrent les campagnes de leur org ─────
-- (la policy existante couvre déjà les médecins/super-admin ; on ajoute les délégués)
DROP POLICY IF EXISTS gc_org_admin_all ON greve_campagnes;
CREATE POLICY gc_org_admin_all ON greve_campagnes
  FOR ALL USING (
    is_gm_super_admin()
    OR (org_id IS NOT NULL AND is_org_admin(org_id))
  ) WITH CHECK (
    is_gm_super_admin()
    OR (org_id IS NOT NULL AND is_org_admin(org_id))
  );

SELECT pg_notify('pgrst', 'reload schema');
