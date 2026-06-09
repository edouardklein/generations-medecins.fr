-- ============================================================
-- Migration 025 — RLS : invitations et lecture des déclarations
--
-- 1. Acceptation d'invitation admin délégué :
--    - un utilisateur auth peut accepter une invitation non encore acceptée
--      dont l'email correspond au sien (via auth.email() — JWT, pas auth.users)
--    - il ne peut associer que son propre user_id
--
-- 2. Lecture des déclarations pour les admins délégués :
--    - un org_membre admin peut lire les déclarations de son org
-- ============================================================

-- ── org_membres : accepter sa propre invitation ───────────────────────────────
DROP POLICY IF EXISTS org_membres_accept_invite ON org_membres;
CREATE POLICY org_membres_accept_invite ON org_membres
  FOR UPDATE
  USING (
    invite_token IS NOT NULL
    AND accepted_at IS NULL
    AND (
      email = auth.email()
      OR user_id IS NULL
    )
  )
  WITH CHECK (
    user_id = auth.uid()
  );

-- ── org_membres : lire sa propre invitation en attente ───────────────────────
DROP POLICY IF EXISTS org_membres_read_pending_invite ON org_membres;
CREATE POLICY org_membres_read_pending_invite ON org_membres
  FOR SELECT USING (
    invite_token IS NOT NULL
    AND accepted_at IS NULL
    AND (
      email = auth.email()
      OR user_id IS NULL
    )
  );

-- ── greve_declarations : lecture pour les admins délégués ────────────────────
DROP POLICY IF EXISTS "gd: org admin lecture" ON greve_declarations;
CREATE POLICY "gd: org admin lecture" ON greve_declarations
  FOR SELECT USING (
    org_id IS NOT NULL
    AND is_org_admin(org_id)
  );

SELECT pg_notify('pgrst', 'reload schema');
