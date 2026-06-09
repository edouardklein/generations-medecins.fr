-- ============================================================
-- Migration 025 — RLS : invitations et lecture des déclarations
--
-- 1. Acceptation d'invitation admin délégué :
--    - un utilisateur auth peut accepter une invitation non encore acceptée
--      dont l'email correspond au sien (ou dont user_id est null)
--    - il ne peut associer que son propre user_id
--
-- 2. Lecture des déclarations pour les admins délégués :
--    - un org_membre admin peut lire les déclarations de son org
--    - les admins GM (is_admin()) gardent leur accès existant
-- ============================================================

-- ── org_membres : accepter sa propre invitation ───────────────────────────────
DROP POLICY IF EXISTS org_membres_accept_invite ON org_membres;
CREATE POLICY org_membres_accept_invite ON org_membres
  FOR UPDATE
  USING (
    -- La ligne est une invitation en attente dont l'email correspond à l'utilisateur
    invite_token IS NOT NULL
    AND accepted_at IS NULL
    AND (
      email = (SELECT email FROM auth.users WHERE id = auth.uid())
      OR user_id IS NULL
    )
  )
  WITH CHECK (
    -- L'utilisateur ne peut mettre que son propre user_id
    user_id = auth.uid()
  );

-- ── org_membres : lire sa propre invitation en attente ───────────────────────
-- Permet à un utilisateur authentifié de voir l'invitation qui lui est destinée
-- (nécessaire pour le contrôle d'accès après acceptation)
DROP POLICY IF EXISTS org_membres_read_pending_invite ON org_membres;
CREATE POLICY org_membres_read_pending_invite ON org_membres
  FOR SELECT USING (
    invite_token IS NOT NULL
    AND accepted_at IS NULL
    AND (
      email = (SELECT email FROM auth.users WHERE id = auth.uid())
      OR user_id IS NULL
    )
  );

-- ── greve_declarations : lecture pour les admins délégués ────────────────────
-- Les admins délégués (org_membres.role = 'admin') peuvent lire les déclarations
-- de leur propre organisation. La policy existante "gd: admin lecture" couvre
-- les admins GM (is_admin()) — les deux s'appliquent en OR.
DROP POLICY IF EXISTS "gd: org admin lecture" ON greve_declarations;
CREATE POLICY "gd: org admin lecture" ON greve_declarations
  FOR SELECT USING (
    org_id IS NOT NULL
    AND is_org_admin(org_id)
  );

SELECT pg_notify('pgrst', 'reload schema');
