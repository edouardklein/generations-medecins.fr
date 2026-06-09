-- ============================================================
-- Migration 025 — RLS : acceptation d'invitation admin délégué
--
-- Permet à un utilisateur authentifié de :
--   1. Lire sa propre invitation via le token (même non encore acceptée)
--   2. Accepter l'invitation (associer user_id + accepted_at au token)
--
-- Le token (UUID v4) est le seul "secret" — il doit être gardé privé.
-- ============================================================

-- ── 1. Lecture d'une invitation en attente par son token ──────────────────────
-- Nécessaire pour que l'écran d'onboarding puisse charger les infos de l'invite
-- (le super-admin et les admins org peuvent déjà tout lire via migration 024)
DROP POLICY IF EXISTS org_membres_read_pending_invite ON org_membres;
CREATE POLICY org_membres_read_pending_invite ON org_membres
  FOR SELECT USING (
    invite_token IS NOT NULL
    AND accepted_at IS NULL
    AND invite_token = current_setting('request.jwt.claims', true)::jsonb->>'invite_token'
  );
-- Note : ce setting n'existe pas nativement ; on utilise une policy plus simple ci-dessous.
-- La policy ci-dessus est un placeholder — on utilise plutôt la Netlify function.

DROP POLICY IF EXISTS org_membres_read_pending_invite ON org_membres;
CREATE POLICY org_membres_read_pending_invite ON org_membres
  FOR SELECT USING (
    -- Permet à un utilisateur authentifié de voir les invites en attente pour son email
    -- (Supabase Auth stocke l'email dans auth.jwt() -> email)
    invite_token IS NOT NULL
    AND accepted_at IS NULL
    AND (
      email = (SELECT email FROM auth.users WHERE id = auth.uid())
      OR user_id = auth.uid()
    )
  );

-- ── 2. Acceptation d'une invitation ──────────────────────────────────────────
-- Un utilisateur authentifié peut accepter une invitation non encore acceptée
-- en y associant son user_id. Il ne peut mettre que son propre user_id.
DROP POLICY IF EXISTS org_membres_accept_invite ON org_membres;
CREATE POLICY org_membres_accept_invite ON org_membres
  FOR UPDATE
  USING (
    invite_token IS NOT NULL
    AND accepted_at IS NULL
    AND (
      email = (SELECT email FROM auth.users WHERE id = auth.uid())
      OR user_id IS NULL
    )
  )
  WITH CHECK (
    user_id = auth.uid()
  );

SELECT pg_notify('pgrst', 'reload schema');
