-- ============================================================
-- Migration 019 — Bucket privé "consultations" + RLS storage
-- Stocke les documents juridiques (contrats, pièces, PDF de synthèse).
-- ⚠️ Bucket PRIVÉ : accès uniquement via URL signée temporaire.
--    Aucune lecture publique possible.
-- Idempotente.
-- ============================================================

-- 1. Création du bucket en mode privé (public = false)
INSERT INTO storage.buckets (id, name, public)
VALUES ('consultations', 'consultations', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- ============================================================
-- 2. RLS sur storage.objects
-- Convention de chemin : {membre_id}/...  (le 1er dossier = id du membre)
--    → un membre n'accède qu'à ses propres fichiers
--    → un admin accède à tout (traitement Doctrine + dépôt du PDF)
-- ============================================================

-- Lecture (nécessaire pour createSignedUrl)
DROP POLICY IF EXISTS "consult: lecture" ON storage.objects;
CREATE POLICY "consult: lecture"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'consultations'
        AND (
            (storage.foldername(name))[1] = public.mon_membre_id()::text
            OR public.is_admin()
        )
    );

-- Dépôt de fichiers
DROP POLICY IF EXISTS "consult: depot" ON storage.objects;
CREATE POLICY "consult: depot"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'consultations'
        AND (
            (storage.foldername(name))[1] = public.mon_membre_id()::text
            OR public.is_admin()
        )
    );

-- Mise à jour (nécessaire pour upsert du PDF de synthèse)
DROP POLICY IF EXISTS "consult: maj" ON storage.objects;
CREATE POLICY "consult: maj"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'consultations'
        AND (
            (storage.foldername(name))[1] = public.mon_membre_id()::text
            OR public.is_admin()
        )
    );

-- Suppression (membre sur ses fichiers, admin partout)
DROP POLICY IF EXISTS "consult: suppression" ON storage.objects;
CREATE POLICY "consult: suppression"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'consultations'
        AND (
            (storage.foldername(name))[1] = public.mon_membre_id()::text
            OR public.is_admin()
        )
    );
