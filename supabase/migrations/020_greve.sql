-- ============================================================
-- Migration 020 — Module Médecins en Grève
-- Tables : greve_campagnes, greve_declarations
-- RLS : campagnes publiques en lecture, déclarations en insertion publique
-- Idempotente.
-- ============================================================

-- ── Table campagnes ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS greve_campagnes (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    titre           TEXT        NOT NULL DEFAULT 'Grève des médecins libéraux',
    accroche        TEXT        DEFAULT 'Rejoignez le mouvement et déclarez votre intention de grève.',
    date_debut      DATE,
    date_fin        DATE,
    objectif        INTEGER     DEFAULT 10000,
    declaration_count INTEGER   DEFAULT 0,
    motifs          JSONB       DEFAULT '[]',
    faq             JSONB       DEFAULT '[]',
    liens           JSONB       DEFAULT '[]',
    actif           BOOLEAN     DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE greve_campagnes ADD COLUMN IF NOT EXISTS titre             TEXT NOT NULL DEFAULT 'Grève des médecins libéraux';
ALTER TABLE greve_campagnes ADD COLUMN IF NOT EXISTS accroche          TEXT;
ALTER TABLE greve_campagnes ADD COLUMN IF NOT EXISTS date_debut        DATE;
ALTER TABLE greve_campagnes ADD COLUMN IF NOT EXISTS date_fin          DATE;
ALTER TABLE greve_campagnes ADD COLUMN IF NOT EXISTS objectif          INTEGER DEFAULT 10000;
ALTER TABLE greve_campagnes ADD COLUMN IF NOT EXISTS declaration_count INTEGER DEFAULT 0;
ALTER TABLE greve_campagnes ADD COLUMN IF NOT EXISTS motifs            JSONB DEFAULT '[]';
ALTER TABLE greve_campagnes ADD COLUMN IF NOT EXISTS faq               JSONB DEFAULT '[]';
ALTER TABLE greve_campagnes ADD COLUMN IF NOT EXISTS liens             JSONB DEFAULT '[]';
ALTER TABLE greve_campagnes ADD COLUMN IF NOT EXISTS actif             BOOLEAN DEFAULT false;
ALTER TABLE greve_campagnes ADD COLUMN IF NOT EXISTS created_at        TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE greve_campagnes ADD COLUMN IF NOT EXISTS updated_at        TIMESTAMPTZ DEFAULT NOW();

DROP TRIGGER IF EXISTS trg_gc_upd ON greve_campagnes;
CREATE TRIGGER trg_gc_upd BEFORE UPDATE ON greve_campagnes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Table déclarations ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS greve_declarations (
    id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    campagne_id         UUID        NOT NULL REFERENCES greve_campagnes(id) ON DELETE CASCADE,
    ref                 TEXT        UNIQUE NOT NULL,
    rpps                TEXT,
    specialite          TEXT,
    cp                  TEXT,
    mode_exercice       TEXT,
    motifs              JSONB       DEFAULT '[]',
    email               TEXT,
    tel                 TEXT,
    consentement_info   BOOLEAN     DEFAULT false,
    attestation_envoyee BOOLEAN     DEFAULT false,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE greve_declarations ADD COLUMN IF NOT EXISTS campagne_id         UUID REFERENCES greve_campagnes(id) ON DELETE CASCADE;
ALTER TABLE greve_declarations ADD COLUMN IF NOT EXISTS ref                 TEXT;
ALTER TABLE greve_declarations ADD COLUMN IF NOT EXISTS rpps                TEXT;
ALTER TABLE greve_declarations ADD COLUMN IF NOT EXISTS specialite          TEXT;
ALTER TABLE greve_declarations ADD COLUMN IF NOT EXISTS cp                  TEXT;
ALTER TABLE greve_declarations ADD COLUMN IF NOT EXISTS mode_exercice       TEXT;
ALTER TABLE greve_declarations ADD COLUMN IF NOT EXISTS motifs              JSONB DEFAULT '[]';
ALTER TABLE greve_declarations ADD COLUMN IF NOT EXISTS email               TEXT;
ALTER TABLE greve_declarations ADD COLUMN IF NOT EXISTS tel                 TEXT;
ALTER TABLE greve_declarations ADD COLUMN IF NOT EXISTS consentement_info   BOOLEAN DEFAULT false;
ALTER TABLE greve_declarations ADD COLUMN IF NOT EXISTS attestation_envoyee BOOLEAN DEFAULT false;
ALTER TABLE greve_declarations ADD COLUMN IF NOT EXISTS created_at          TIMESTAMPTZ DEFAULT NOW();

-- Anti-doublon : 1 RPPS par campagne
DO $$ BEGIN
    ALTER TABLE greve_declarations ADD CONSTRAINT unique_rpps_campagne
        UNIQUE (rpps, campagne_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_gd_campagne ON greve_declarations(campagne_id);
CREATE INDEX IF NOT EXISTS idx_gd_created  ON greve_declarations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gc_actif    ON greve_campagnes(actif);

-- ── Trigger : incrémente le compteur de la campagne à chaque déclaration ──────
CREATE OR REPLACE FUNCTION greve_increment_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE greve_campagnes
    SET declaration_count = declaration_count + 1
    WHERE id = NEW.campagne_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_gd_count ON greve_declarations;
CREATE TRIGGER trg_gd_count AFTER INSERT ON greve_declarations
    FOR EACH ROW EXECUTE FUNCTION greve_increment_count();

-- ── Fonction publique : stats par jour (sans données personnelles) ─────────────
CREATE OR REPLACE FUNCTION greve_par_jour(p_campagne_id UUID)
RETURNS TABLE(jour DATE, total BIGINT)
LANGUAGE sql SECURITY DEFINER STABLE AS $$
    SELECT created_at::DATE, COUNT(*)
    FROM greve_declarations
    WHERE campagne_id = p_campagne_id
    GROUP BY created_at::DATE
    ORDER BY created_at::DATE ASC;
$$;

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE greve_campagnes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "gc: lecture publique"  ON greve_campagnes;
CREATE POLICY "gc: lecture publique"
    ON greve_campagnes FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "gc: admin write" ON greve_campagnes;
CREATE POLICY "gc: admin write"
    ON greve_campagnes FOR ALL USING (is_admin());

ALTER TABLE greve_declarations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "gd: insertion publique" ON greve_declarations;
CREATE POLICY "gd: insertion publique"
    ON greve_declarations FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "gd: admin lecture"  ON greve_declarations;
CREATE POLICY "gd: admin lecture"
    ON greve_declarations FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "gd: admin update"   ON greve_declarations;
CREATE POLICY "gd: admin update"
    ON greve_declarations FOR UPDATE USING (is_admin());

-- ── Seed : première campagne (inactif par défaut, à activer dans l'admin) ──────
INSERT INTO greve_campagnes (titre, accroche, date_debut, date_fin, objectif, actif, motifs, faq)
SELECT
  'Grève des médecins libéraux 2026',
  'Le système de santé libéral est en danger. Rejoignez le mouvement pour exprimer votre refus de la médecine administrée et défendre vos conditions d''exercice.',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  15000,
  false,
  '[
    {"id":"financement","label":"Financement insuffisant de la médecine libérale"},
    {"id":"honoraires","label":"Gel des tarifs d''honoraires depuis des années"},
    {"id":"administratif","label":"Surcharge administrative et perte d''autonomie"},
    {"id":"desertification","label":"Désertification médicale et manque d''attractivité"},
    {"id":"retraites","label":"Retraites inéquitables par rapport aux autres professions"},
    {"id":"acces","label":"Menace sur l''accès aux soins de qualité"},
    {"id":"numerus","label":"Numerus clausus passé — conséquences durables sur l''offre de soins"}
  ]'::jsonb,
  '[
    {"q":"Pourquoi la grève ?","r":"Parce que continuer à exercer comme si de rien n''était revient à entériner une médecine sous-financée, administrée par des tableurs, où le temps médical, la complexité clinique et l''autonomie professionnelle deviennent des variables d''ajustement."},
    {"q":"Suis-je obligé d''arrêter de travailler ?","r":"Non. La grève des médecins libéraux est symbolique : vous déclarez votre intention mais organisez votre continuité de soins. Aucune obligation d''arrêter les consultations."},
    {"q":"Dois-je prévenir mon ordre ou ma CPAM ?","r":"Non. La grève libérale ne nécessite aucune déclaration préalable obligatoire. L''attestation est un document militant, pas réglementaire."},
    {"q":"Que fait Générations Médecins avec mes données ?","r":"Votre email est utilisé uniquement pour vous envoyer votre attestation et, si vous l''avez accepté, pour vous tenir informé des actions du mouvement. Vous pouvez vous désinscrire à tout moment."}
  ]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM greve_campagnes LIMIT 1);

SELECT pg_notify('pgrst', 'reload schema');
