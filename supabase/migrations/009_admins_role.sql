-- Migration 009 — Rôles admin (super_admin vs admin)
ALTER TABLE admins ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'admin'
  CHECK (role IN ('super_admin', 'admin'));

-- Définir le super-admin
UPDATE admins SET role = 'super_admin'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'alexis.bourla@gmail.com');
