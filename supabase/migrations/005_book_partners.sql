-- ============================================================================
-- Book Partenaires 2026 — schema & access RPCs
-- ============================================================================
-- This migration adds two tables (partners, partner_books) plus two RPCs that
-- power the partner book at /book.
--
-- Security model:
--  - `partners.password_hash` is NEVER exposed to anon. RLS denies all anon
--    direct reads on `partners` / `partner_books`.
--  - `list_active_partners()` is `SECURITY DEFINER` and returns only public
--    fields (id, slug, name, logo_url, display_order) for the logo grid.
--  - `verify_partner_book(slug, password)` is `SECURITY DEFINER` and returns
--    the book JSON only when the bcrypt password check succeeds.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- partners
-- ----------------------------------------------------------------------------
create table if not exists public.partners (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  logo_url      text not null,
  password_hash text not null,
  display_order int  not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists partners_active_order_idx
  on public.partners (active, display_order);

-- ----------------------------------------------------------------------------
-- partner_books
-- ----------------------------------------------------------------------------
create table if not exists public.partner_books (
  id          uuid primary key default gen_random_uuid(),
  partner_id  uuid not null references public.partners(id) on delete cascade,
  title       text not null default 'GM IDF • Book Partenaires 2026',
  -- slides: ordered array of { type: string, props: object }
  slides      jsonb not null default '[]'::jsonb,
  -- optional theme overrides (colors, accents) per partner
  theme       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  unique (partner_id)
);

-- ----------------------------------------------------------------------------
-- RLS — lock both tables to authenticated/service_role only.
-- All anonymous access goes through SECURITY DEFINER functions below.
-- ----------------------------------------------------------------------------
alter table public.partners       enable row level security;
alter table public.partner_books  enable row level security;

-- (Intentionally no policies for anon. Functions own the safe surface.)

-- ----------------------------------------------------------------------------
-- list_active_partners(): public grid (no secrets)
-- ----------------------------------------------------------------------------
create or replace function public.list_active_partners()
returns table (
  id             uuid,
  slug           text,
  name           text,
  logo_url       text,
  display_order  int
)
language sql
security definer
set search_path = public
stable
as $$
  select p.id, p.slug, p.name, p.logo_url, p.display_order
  from public.partners p
  where p.active = true
  order by p.display_order asc, p.name asc;
$$;

revoke all on function public.list_active_partners() from public;
grant execute on function public.list_active_partners() to anon, authenticated;

-- ----------------------------------------------------------------------------
-- verify_partner_book(slug, password): returns book payload on success
-- Returns NULL if slug unknown, inactive, or password mismatch.
-- ----------------------------------------------------------------------------
create or replace function public.verify_partner_book(p_slug text, p_password text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_partner public.partners%rowtype;
  v_book    public.partner_books%rowtype;
begin
  select * into v_partner
  from public.partners
  where slug = p_slug and active = true
  limit 1;

  if not found then
    return null;
  end if;

  -- bcrypt verification via pgcrypto.crypt()
  if v_partner.password_hash is null
     or crypt(p_password, v_partner.password_hash) <> v_partner.password_hash then
    return null;
  end if;

  select * into v_book
  from public.partner_books
  where partner_id = v_partner.id
  limit 1;

  return jsonb_build_object(
    'partner', jsonb_build_object(
      'id',            v_partner.id,
      'slug',          v_partner.slug,
      'name',          v_partner.name,
      'logo_url',      v_partner.logo_url,
      'display_order', v_partner.display_order
    ),
    'book', jsonb_build_object(
      'title',           coalesce(v_book.title, 'GM IDF • Book Partenaires 2026'),
      'partnerLogoUrl',  v_partner.logo_url,
      'partnerName',     v_partner.name,
      'slides',          coalesce(v_book.slides, '[]'::jsonb),
      'theme',           coalesce(v_book.theme, '{}'::jsonb)
    )
  );
end;
$$;

revoke all on function public.verify_partner_book(text, text) from public;
grant execute on function public.verify_partner_book(text, text) to anon, authenticated;

-- ----------------------------------------------------------------------------
-- Helper: create_partner(slug, name, logo_url, password, slides)
-- Use this from the SQL editor (service_role) to provision a partner.
-- ----------------------------------------------------------------------------
create or replace function public.create_partner(
  p_slug      text,
  p_name      text,
  p_logo_url  text,
  p_password  text,
  p_slides    jsonb default '[]'::jsonb,
  p_order     int   default 0
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.partners (slug, name, logo_url, password_hash, display_order)
  values (p_slug, p_name, p_logo_url, crypt(p_password, gen_salt('bf', 10)), p_order)
  returning id into v_id;

  insert into public.partner_books (partner_id, slides)
  values (v_id, p_slides);

  return v_id;
end;
$$;

revoke all on function public.create_partner(text, text, text, text, jsonb, int) from public;
-- create_partner is service_role-only; do NOT grant to anon.
