-- ============================================================
-- Migration 027 — Table `news` (articles écrits à la main)
--
-- Les News sont distinctes des décrypteurs : écrites manuellement
-- par les admins, elles alimentent la page /news.html et les
-- 3 dernières apparaissent sur la home. Modèle riche (catégorie +
-- tags + image) avec publication immédiate (statut brouillon via
-- la colonne `publie`).
--
-- Les images sont stockées dans le bucket existant
-- `newsletter-images` (lecture publique + écriture admin déjà en
-- place via migration 013) — aucune création de bucket requise.
-- ============================================================

CREATE TABLE IF NOT EXISTS news (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre       text NOT NULL,
  slug        text UNIQUE NOT NULL,
  resume      text,                       -- chapô / extrait repris dans les cartes
  contenu     text,                       -- corps (Markdown / HTML léger)
  categorie   text,
  tags        text[] DEFAULT '{}',
  image_url   text,                       -- visuel repris dans les cartes
  auteur      text DEFAULT 'Rédaction GM',
  acces       text DEFAULT 'public' CHECK (acces IN ('public','membres')),
  publie      boolean DEFAULT false,      -- false = brouillon
  publie_le   date,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_publie_le ON news (publie_le DESC);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Lecture : articles publiés visibles par tous, brouillons réservés aux admins
DROP POLICY IF EXISTS "news: lecture publique" ON news;
CREATE POLICY "news: lecture publique"
  ON news FOR SELECT
  USING (publie = true OR is_admin());

-- Écriture : admins uniquement (avec WITH CHECK pour bloquer toute insertion non-admin)
DROP POLICY IF EXISTS "news: admin write" ON news;
CREATE POLICY "news: admin write"
  ON news FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

SELECT pg_notify('pgrst', 'reload schema');
