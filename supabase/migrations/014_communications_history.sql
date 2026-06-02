-- Migration 014 — Historique des communications (newsletters + communiqués)

CREATE TABLE IF NOT EXISTS communications (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  type           TEXT        NOT NULL CHECK (type IN ('newsletter', 'communique')),
  subject        TEXT        NOT NULL,
  brevo_campaign_id INTEGER,
  recipient_list_id INTEGER,
  blocks         JSONB,
  html_content   TEXT,
  status         TEXT        NOT NULL DEFAULT 'sent',
  sent_by        UUID        REFERENCES auth.users(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins gèrent les communications"
  ON communications FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());
