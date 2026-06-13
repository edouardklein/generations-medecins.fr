-- ============================================================
-- Migration 026 — RLS hardening
--
-- T1. greve_declarations INSERT : limiter aux campagnes actives
--     Remplace WITH CHECK (TRUE) par une vérification que
--     la campagne référencée est active et non archivée.
--
-- T4. membres UPDATE : empêcher l'auto-escalade de privilèges
--     Trigger BEFORE UPDATE qui réinitialise statut et
--     rpps_verifie à leurs valeurs OLD si l'appelant n'est
--     pas admin — plus fiable qu'un WITH CHECK sans OLD.
-- ============================================================

-- ── T1 : greve_declarations — insertion limitée aux campagnes actives ─────────
DROP POLICY IF EXISTS "gd: insertion publique" ON greve_declarations;
CREATE POLICY "gd: insertion publique"
  ON greve_declarations FOR INSERT
  WITH CHECK (
    campagne_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM greve_campagnes
      WHERE id = campagne_id
        AND actif = TRUE
        AND archived = FALSE
        AND CURRENT_DATE BETWEEN date_debut AND date_fin
    )
  );

-- ── T4 : membres — trigger anti-escalade ──────────────────────────────────────
CREATE OR REPLACE FUNCTION guard_membres_sensitive_fields()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Un non-admin ne peut pas modifier statut ni rpps_verifie
  IF NOT is_admin() THEN
    NEW.statut       := OLD.statut;
    NEW.rpps_verifie := OLD.rpps_verifie;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_membres_guard_sensitive ON membres;
CREATE TRIGGER trg_membres_guard_sensitive
  BEFORE UPDATE ON membres
  FOR EACH ROW EXECUTE FUNCTION guard_membres_sensitive_fields();

SELECT pg_notify('pgrst', 'reload schema');
