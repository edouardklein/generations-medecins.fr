-- ============================================================
-- Générations Médecins IDF — Schéma initial
-- Migration 001 — À coller dans Supabase SQL Editor
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- recherche full-text

-- ============================================================
-- TYPES ÉNUMÉRÉS
-- ============================================================

CREATE TYPE statut_membre      AS ENUM ('en_attente', 'actif', 'suspendu');
CREATE TYPE mode_exercice       AS ENUM ('liberal_seul', 'liberal_groupe', 'salarie', 'mixte', 'remplacant', 'interne');
CREATE TYPE secteur_conv        AS ENUM ('S1', 'S2', 'S3', 'non_conventionne', 'non_applicable');
CREATE TYPE statut_dossier      AS ENUM ('actif', 'en_cours', 'veille', 'obtenu', 'suspendu', 'abandonne');
CREATE TYPE categorie_courrier  AS ENUM ('cpam', 'rgpd', 'patients', 'cabinet', 'contentieux');
CREATE TYPE acces_ressource     AS ENUM ('gratuit', 'adherents');
CREATE TYPE type_annonce        AS ENUM ('remplacement', 'installation', 'cession', 'association', 'autre');
CREATE TYPE statut_sos          AS ENUM ('nouveau', 'en_analyse', 'oriente', 'cloture');

-- ============================================================
-- TABLE : admins
-- Simple liste d'user_id autorisés à administrer
-- ============================================================

CREATE TABLE admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fonction utilitaire : is_admin()
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid());
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- TABLE : membres
-- Un membre = un médecin inscrit, lié à auth.users
-- ============================================================

CREATE TABLE membres (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email       TEXT UNIQUE NOT NULL,
    prenom      TEXT NOT NULL,
    nom         TEXT NOT NULL,
    rpps        TEXT UNIQUE,                      -- Numéro RPPS (11 chiffres)
    rpps_verifie BOOLEAN DEFAULT FALSE,
    specialite  TEXT,
    mode_exercice mode_exercice,
    secteur     secteur_conv,
    ville       TEXT,
    code_postal TEXT,
    statut      statut_membre DEFAULT 'en_attente',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE : adhesions
-- Trace chaque adhésion (gratuite pour l'instant, HelloAsso demain)
-- ============================================================

CREATE TABLE adhesions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    membre_id           UUID NOT NULL REFERENCES membres(id) ON DELETE CASCADE,
    date_debut          DATE NOT NULL DEFAULT CURRENT_DATE,
    date_fin            DATE,                          -- NULL = durée indéterminée
    statut              TEXT DEFAULT 'active',
    source              TEXT DEFAULT 'inscription',    -- 'helloasso', 'manuel', 'inscription'
    reference_paiement  TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE : decrypteurs
-- Articles d'analyse réglementaire
-- ============================================================

CREATE TABLE decrypteurs (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titre       TEXT NOT NULL,
    slug        TEXT UNIQUE NOT NULL,
    extrait     TEXT,
    contenu     TEXT,                  -- Markdown
    categorie   TEXT,                  -- 'avenant', 'plfss', 'observatoire', 'urgence'
    tags        TEXT[],               -- ['generaliste', 'S1', 'libéral']
    auteur_id   UUID REFERENCES membres(id),
    publie      BOOLEAN DEFAULT FALSE,
    publie_le   TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE : courriers
-- Bibliothèque de modèles de courriers
-- ============================================================

CREATE TABLE courriers (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titre               TEXT NOT NULL,
    slug                TEXT UNIQUE NOT NULL,
    description         TEXT,
    categorie           categorie_courrier NOT NULL,
    contenu_template    TEXT NOT NULL,             -- Markdown avec {{variables}}
    variables_requises  TEXT[],                    -- ['nom_medecin', 'adresse_cpam']
    acces               acces_ressource DEFAULT 'gratuit',
    publie              BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE : plaidoyer_dossiers
-- Roadmap publique des dossiers portés
-- ============================================================

CREATE TABLE plaidoyer_dossiers (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titre       TEXT NOT NULL,
    description TEXT,
    statut      statut_dossier DEFAULT 'en_cours',
    progression INTEGER DEFAULT 0 CHECK (progression BETWEEN 0 AND 100),
    trimestre   TEXT,                  -- 'T2 2025'
    meta        TEXT,                  -- Info courte affichée sous la barre
    ordre       INTEGER DEFAULT 0,     -- Ordre d'affichage
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE : campagnes_mobilisation
-- Pétitions / mobilisations ponctuelles
-- ============================================================

CREATE TABLE campagnes_mobilisation (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titre       TEXT NOT NULL,
    description TEXT,
    objectif    INTEGER DEFAULT 1000,
    actif       BOOLEAN DEFAULT FALSE,
    date_fin    TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE signatures_mobilisation (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campagne_id UUID NOT NULL REFERENCES campagnes_mobilisation(id) ON DELETE CASCADE,
    membre_id   UUID NOT NULL REFERENCES membres(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (campagne_id, membre_id)
);

-- Vue publique : comptage sans exposer les identités
CREATE VIEW signatures_count AS
    SELECT campagne_id, COUNT(*) AS total
    FROM signatures_mobilisation
    GROUP BY campagne_id;

-- ============================================================
-- TABLE : petites_annonces
-- Réservé aux adhérents actifs
-- ============================================================

CREATE TABLE petites_annonces (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    membre_id   UUID NOT NULL REFERENCES membres(id) ON DELETE CASCADE,
    type        type_annonce NOT NULL,
    titre       TEXT NOT NULL,
    description TEXT,
    localisation TEXT,
    actif       BOOLEAN DEFAULT TRUE,
    expires_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE : sos_juridique
-- Demandes d'orientation juridique (LLM + avocat partenaire)
-- ============================================================

CREATE TABLE sos_juridique (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    membre_id       UUID NOT NULL REFERENCES membres(id) ON DELETE CASCADE,
    description     TEXT NOT NULL,
    analyse_llm     TEXT,              -- Réponse générée par l'IA
    statut          statut_sos DEFAULT 'nouveau',
    assignee        TEXT,              -- Avocat partenaire affecté
    reponse         TEXT,              -- Réponse finale transmise au membre
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRIGGER : updated_at automatique
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_membres_upd       BEFORE UPDATE ON membres              FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_decrypteurs_upd   BEFORE UPDATE ON decrypteurs           FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_courriers_upd     BEFORE UPDATE ON courriers             FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_plaidoyer_upd     BEFORE UPDATE ON plaidoyer_dossiers    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_annonces_upd      BEFORE UPDATE ON petites_annonces      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_sos_upd           BEFORE UPDATE ON sos_juridique         FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- INDEX
-- ============================================================

CREATE INDEX idx_membres_statut        ON membres(statut);
CREATE INDEX idx_membres_rpps          ON membres(rpps);
CREATE INDEX idx_decrypteurs_publie    ON decrypteurs(publie, publie_le DESC);
CREATE INDEX idx_decrypteurs_slug      ON decrypteurs(slug);
CREATE INDEX idx_courriers_categorie   ON courriers(categorie, acces);
CREATE INDEX idx_annonces_actif        ON petites_annonces(actif, type);
CREATE INDEX idx_dossiers_statut       ON plaidoyer_dossiers(statut, ordre);

-- ============================================================
-- RLS (Row Level Security)
-- Principe : défensif par défaut, on ouvre ce qui doit l'être
-- ============================================================

ALTER TABLE admins                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE membres                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE adhesions               ENABLE ROW LEVEL SECURITY;
ALTER TABLE decrypteurs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE courriers               ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaidoyer_dossiers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE campagnes_mobilisation  ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures_mobilisation ENABLE ROW LEVEL SECURITY;
ALTER TABLE petites_annonces        ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_juridique           ENABLE ROW LEVEL SECURITY;

-- Fonction : le membre est-il actif ?
CREATE OR REPLACE FUNCTION is_membre_actif()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM membres
        WHERE user_id = auth.uid()
        AND statut = 'actif'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Fonction : récupérer l'id membre depuis auth.uid()
CREATE OR REPLACE FUNCTION mon_membre_id()
RETURNS UUID AS $$
    SELECT id FROM membres WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── admins ──────────────────────────────────────────────────
CREATE POLICY "admins: lecture admin seulement"
    ON admins FOR SELECT USING (is_admin());

-- ── membres ─────────────────────────────────────────────────
CREATE POLICY "membres: voir son propre profil"
    ON membres FOR SELECT USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "membres: créer son profil"
    ON membres FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "membres: modifier son profil"
    ON membres FOR UPDATE USING (user_id = auth.uid() OR is_admin());

-- ── adhesions ────────────────────────────────────────────────
CREATE POLICY "adhesions: voir les siennes"
    ON adhesions FOR SELECT USING (membre_id = mon_membre_id() OR is_admin());

CREATE POLICY "adhesions: admin insert"
    ON adhesions FOR INSERT WITH CHECK (is_admin());

-- ── decrypteurs ──────────────────────────────────────────────
CREATE POLICY "decrypteurs: publics lisibles par tous"
    ON decrypteurs FOR SELECT USING (publie = TRUE OR is_admin());

CREATE POLICY "decrypteurs: admin write"
    ON decrypteurs FOR ALL USING (is_admin());

-- ── courriers ────────────────────────────────────────────────
CREATE POLICY "courriers: gratuits lisibles par tous"
    ON courriers FOR SELECT
    USING (
        (publie = TRUE AND acces = 'gratuit')
        OR (publie = TRUE AND acces = 'adherents' AND is_membre_actif())
        OR is_admin()
    );

CREATE POLICY "courriers: admin write"
    ON courriers FOR ALL USING (is_admin());

-- ── plaidoyer_dossiers ───────────────────────────────────────
CREATE POLICY "plaidoyer: lecture publique"
    ON plaidoyer_dossiers FOR SELECT USING (TRUE);

CREATE POLICY "plaidoyer: admin write"
    ON plaidoyer_dossiers FOR ALL USING (is_admin());

-- ── campagnes_mobilisation ───────────────────────────────────
CREATE POLICY "campagnes: lecture publique"
    ON campagnes_mobilisation FOR SELECT USING (TRUE);

CREATE POLICY "campagnes: admin write"
    ON campagnes_mobilisation FOR ALL USING (is_admin());

-- ── signatures_mobilisation ──────────────────────────────────
CREATE POLICY "signatures: adhérents actifs peuvent signer"
    ON signatures_mobilisation FOR INSERT
    WITH CHECK (membre_id = mon_membre_id() AND is_membre_actif());

CREATE POLICY "signatures: voir les siennes"
    ON signatures_mobilisation FOR SELECT
    USING (membre_id = mon_membre_id() OR is_admin());

-- ── petites_annonces ─────────────────────────────────────────
CREATE POLICY "annonces: adhérents actifs peuvent lire"
    ON petites_annonces FOR SELECT
    USING (actif = TRUE AND (is_membre_actif() OR is_admin()));

CREATE POLICY "annonces: adhérents actifs peuvent publier"
    ON petites_annonces FOR INSERT
    WITH CHECK (membre_id = mon_membre_id() AND is_membre_actif());

CREATE POLICY "annonces: modifier la sienne"
    ON petites_annonces FOR UPDATE
    USING (membre_id = mon_membre_id() OR is_admin());

-- ── sos_juridique ────────────────────────────────────────────
CREATE POLICY "sos: voir les siennes"
    ON sos_juridique FOR SELECT
    USING (membre_id = mon_membre_id() OR is_admin());

CREATE POLICY "sos: adhérents actifs peuvent soumettre"
    ON sos_juridique FOR INSERT
    WITH CHECK (membre_id = mon_membre_id() AND is_membre_actif());

CREATE POLICY "sos: admin write"
    ON sos_juridique FOR UPDATE USING (is_admin());

-- ============================================================
-- DONNÉES INITIALES — Plaidoyer (depuis le mockup)
-- ============================================================

INSERT INTO plaidoyer_dossiers (titre, description, statut, progression, trimestre, meta, ordre) VALUES
(
    'Revalorisation des gardes hospitalières',
    'Courrier envoyé au Ministère le 12 mai. Réponse attendue avant le 15 juin. Pétition lancée.',
    'actif', 72, 'T2 2025',
    'Dossier déposé · 1 240 signatures · Réponse attendue 15 juin', 1
),
(
    'Accès au DMP pour les médecins remplaçants',
    'Rencontre planifiée avec la DSS le 3 juin. Préparation du dossier technique en cours. Soutien de 4 autres organisations obtenu.',
    'en_cours', 40, 'T2 2025',
    'Rencontre DSS · 3 juin · Soutien de 4 autres organisations', 2
),
(
    'Représentativité URPS — accès aux négociations conventionnelles',
    'Contestation du seuil de 10% qui exclut les jeunes organisations des négociations CNAM. Dossier porté avec 3 autres collectifs.',
    'en_cours', 45, 'T2 2025',
    'Audition HCAAM · juillet 2025 · Dossier porté avec 3 collectifs', 3
),
(
    'Simplification des obligations RGPD en cabinet libéral',
    'Veille législative active. Proposition de simplification en cours de rédaction.',
    'veille', 20, 'T2 2025',
    'Phase de veille et rédaction', 4
),
(
    'Forfait structure — revalorisation cabinets de groupe',
    'Revalorisation de 15% du forfait structure pour les MSP et cabinets de groupe. Obtenu dans l'avenant n°9.',
    'obtenu', 100, 'T1 2025',
    'Obtenu — Avenant n°9 — mars 2025', 5
),
(
    'Publication des données d''activité CPAM par département',
    'Demande d''open data sur les données de remboursement agrégées. Accord de principe obtenu de la CNAM.',
    'obtenu', 100, 'T1 2025',
    'Accord CNAM obtenu — février 2025', 6
);

-- ============================================================
-- DONNÉES INITIALES — Courriers (quelques modèles de base)
-- ============================================================

INSERT INTO courriers (titre, slug, description, categorie, contenu_template, variables_requises, acces) VALUES
(
    'Contestation de mise sous accord préalable',
    'contestation-mise-sous-accord-prealable',
    'Courrier type pour contester une mise sous accord préalable injustifiée de la CPAM.',
    'cpam',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\nN° RPPS : {{rpps}}\n\nÀ l''attention de\nMme/M. le Directeur\nCPAM de {{departement}}\n\n**Objet : Contestation de la mise sous accord préalable notifiée le {{date_notification}}**\n\nMadame, Monsieur le Directeur,\n\nPar courrier en date du {{date_notification}}, vous m''avez notifié une mise sous accord préalable concernant {{objet_map}}.\n\nJe conteste fermement cette décision pour les motifs suivants :\n\n{{motifs}}\n\nJe vous demande en conséquence de bien vouloir reconsidérer cette décision et de me communiquer les éléments ayant motivé ce contrôle.\n\nDans l''attente de votre réponse, je vous adresse, Madame, Monsieur le Directeur, l''expression de mes salutations distinguées.\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'rpps', 'departement', 'date_notification', 'objet_map', 'motifs'],
    'gratuit'
),
(
    'Demande de suppression fiche Google',
    'demande-suppression-fiche-google',
    'Courrier pour demander la suppression ou la modification d''une fiche Google My Business non sollicitée.',
    'rgpd',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\n\nÀ l''attention du Service Juridique\nGoogle LLC / Google Ireland Limited\n\n**Objet : Demande de suppression d''une fiche Google My Business — Droit d''opposition (RGPD, art. 21)**\n\nMadame, Monsieur,\n\nJe suis médecin exerçant à l''adresse suivante : {{adresse_cabinet}}.\n\nJ''ai constaté l''existence d''une fiche Google My Business me concernant (URL : {{url_fiche}}), que je n''ai pas créée et à laquelle je m''oppose formellement.\n\nEn application de l''article 21 du RGPD et de l''article 56 de la loi Informatique et Libertés, je vous demande la suppression immédiate de cette fiche ou, à défaut, le retrait de toute information permettant de m''identifier.\n\nA défaut de réponse sous 30 jours, je me réserve le droit de saisir la CNIL.\n\nCordialement,\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'url_fiche'],
    'gratuit'
),
(
    'Refus de tiers payant non obligatoire',
    'refus-tiers-payant',
    'Courrier expliquant au patient les raisons du refus de tiers payant dans les cas non couverts par l''obligation légale.',
    'patients',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\n\n**Objet : Information sur les modalités de règlement**\n\nMadame, Monsieur,\n\nSuite à votre demande concernant la pratique du tiers payant, je vous informe que votre situation ne relève pas des cas d''obligation légale de tiers payant (ALD, maternité, accident du travail, CMU-C/ACS).\n\nJe ne pratique donc pas le tiers payant pour votre consultation, conformément à la réglementation en vigueur.\n\nJe vous invite à régler les honoraires lors de la consultation et à transmettre votre feuille de soins à votre caisse d''assurance maladie pour remboursement.\n\nCordialement,\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet'],
    'gratuit'
);
