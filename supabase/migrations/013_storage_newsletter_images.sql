-- Migration 013 — RLS pour le bucket Supabase Storage "newsletter-images"
--
-- PRÉREQUIS : créer d'abord le bucket dans Supabase Dashboard
--   Storage → New bucket → Name: newsletter-images → Public: OUI
--
-- Ensuite exécuter ce fichier dans l'éditeur SQL Supabase.

-- Admins peuvent uploader
CREATE POLICY "admins peuvent uploader newsletter-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'newsletter-images' AND is_admin());

-- Admins peuvent supprimer
CREATE POLICY "admins peuvent supprimer newsletter-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'newsletter-images' AND is_admin());

-- Lecture publique (nécessaire pour que les images soient visibles dans les emails)
CREATE POLICY "lecture publique newsletter-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'newsletter-images');
