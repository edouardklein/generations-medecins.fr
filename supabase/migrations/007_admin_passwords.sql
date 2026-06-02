-- ============================================================================
-- 007_admin_passwords.sql — admin-only credentials vault
-- ============================================================================
-- Adds a hidden "show me everyone's password" surface for the operator:
--   - partner_admin(partner_id, password_plain) holds the plaintext for each
--     partner. RLS denies all anon access.
--   - set_partner_password(slug, password) updates BOTH the bcrypt hash on
--     `partners` and the plaintext on `partner_admin`. Use this from now on
--     instead of writing partner_hash directly.
--   - admin_list_credentials(pin) returns the credential list ONLY if the
--     master PIN matches. The PIN is hardcoded in the function body; change
--     it by re-creating the function.
-- ============================================================================

create table if not exists public.partner_admin (
  partner_id     uuid primary key references public.partners(id) on delete cascade,
  password_plain text not null,
  updated_at     timestamptz not null default now()
);

alter table public.partner_admin enable row level security;
-- No anon/auth policies — only SECURITY DEFINER RPCs touch this table.

-- ----------------------------------------------------------------------------
-- set_partner_password(slug, password)
--   Stores the plaintext in partner_admin AND rotates the bcrypt hash on
--   partners. Call this whenever a partner password changes.
-- ----------------------------------------------------------------------------
create or replace function public.set_partner_password(p_slug text, p_password text)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_partner_id uuid;
begin
  update public.partners
     set password_hash = crypt(p_password, gen_salt('bf', 10)),
         updated_at = now()
   where slug = p_slug
  returning id into v_partner_id;

  if v_partner_id is null then
    raise exception 'No partner with slug %', p_slug;
  end if;

  insert into public.partner_admin (partner_id, password_plain)
  values (v_partner_id, p_password)
  on conflict (partner_id)
  do update set password_plain = excluded.password_plain, updated_at = now();

  return v_partner_id;
end;
$$;

revoke all on function public.set_partner_password(text, text) from public;
-- service_role only — do not grant to anon.

-- ----------------------------------------------------------------------------
-- admin_list_credentials(pin)
--   Returns slug / name / password_plain / display_order for every active
--   partner — only if the PIN matches. The PIN is hardcoded below; to change
--   it, re-create this function with a new literal.
-- ----------------------------------------------------------------------------
create or replace function public.admin_list_credentials(p_pin text)
returns table (
  slug           text,
  name           text,
  logo_url       text,
  password_plain text,
  display_order  int
)
language plpgsql
security definer
set search_path = public, extensions
stable
as $$
begin
  -- Change '1234' to whatever master PIN you want for the operator console.
  if p_pin is null or p_pin <> '1234' then
    return;
  end if;

  return query
    select p.slug,
           p.name,
           p.logo_url,
           coalesce(pa.password_plain, '— non enregistré —'),
           p.display_order
    from public.partners p
    left join public.partner_admin pa on pa.partner_id = p.id
    where p.active = true
    order by p.display_order asc;
end;
$$;

revoke all on function public.admin_list_credentials(text) from public;
grant execute on function public.admin_list_credentials(text) to anon, authenticated;
