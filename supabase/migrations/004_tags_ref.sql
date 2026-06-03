-- Migration 004 — Taxonomie des tags décrypteurs
-- À coller dans Supabase SQL Editor → New query → Run

CREATE TABLE IF NOT EXISTS tags_ref (
  slug  text PRIMARY KEY,
  label text NOT NULL,
  type  text NOT NULL CHECK (type IN ('region','specialite','theme'))
);

-- Régions
INSERT INTO tags_ref (slug, label, type) VALUES
  ('ile-de-france',              'Île-de-France',               'region'),
  ('auvergne-rhone-alpes',       'Auvergne-Rhône-Alpes',        'region'),
  ('bourgogne-franche-comte',    'Bourgogne-Franche-Comté',     'region'),
  ('bretagne',                   'Bretagne',                    'region'),
  ('centre-val-de-loire',        'Centre-Val de Loire',         'region'),
  ('corse',                      'Corse',                       'region'),
  ('grand-est',                  'Grand Est',                   'region'),
  ('hauts-de-france',            'Hauts-de-France',             'region'),
  ('normandie',                  'Normandie',                   'region'),
  ('nouvelle-aquitaine',         'Nouvelle-Aquitaine',          'region'),
  ('occitanie',                  'Occitanie',                   'region'),
  ('pays-de-la-loire',           'Pays de la Loire',            'region'),
  ('provence-alpes-cote-dazur',  'Provence-Alpes-Côte d''Azur','region'),
  ('guadeloupe',                 'Guadeloupe',                  'region'),
  ('martinique',                 'Martinique',                  'region'),
  ('guyane',                     'Guyane',                      'region'),
  ('la-reunion',                 'La Réunion',                  'region'),
  ('mayotte',                    'Mayotte',                     'region')
ON CONFLICT (slug) DO NOTHING;

-- Spécialités
INSERT INTO tags_ref (slug, label, type) VALUES
  ('allergologie',                          'Allergologie',                           'specialite'),
  ('anatomie-cytologie-pathologique',       'Anatomie et cytologie pathologique',     'specialite'),
  ('anesthesie-reanimation',                'Anesthésie-réanimation',                 'specialite'),
  ('cardiologie',                           'Cardiologie',                            'specialite'),
  ('dermatologie',                          'Dermatologie',                           'specialite'),
  ('endocrinologie-nutrition',              'Endocrinologie - Nutrition',             'specialite'),
  ('genetique-medicale',                    'Génétique médicale',                     'specialite'),
  ('geriatrie',                             'Gériatrie',                              'specialite'),
  ('gynecologie-medicale',                  'Gynécologie médicale',                   'specialite'),
  ('hematologie',                           'Hématologie',                            'specialite'),
  ('hepato-gastro-enterologie',             'Hépato-gastro-entérologie',              'specialite'),
  ('maladies-infectieuses-tropicales',      'Maladies infectieuses et tropicales',    'specialite'),
  ('medecine-du-travail',                   'Médecine du travail',                    'specialite'),
  ('medecine-generale',                     'Médecine générale',                      'specialite'),
  ('medecine-interne',                      'Médecine interne',                       'specialite'),
  ('medecine-nucleaire',                    'Médecine nucléaire',                     'specialite'),
  ('medecine-physique-readaptation',        'Médecine physique et réadaptation',      'specialite'),
  ('medecine-urgence',                      'Médecine d''urgence',                    'specialite'),
  ('nephrologie',                           'Néphrologie',                            'specialite'),
  ('neurologie',                            'Neurologie',                             'specialite'),
  ('oncologie',                             'Oncologie',                              'specialite'),
  ('pediatrie',                             'Pédiatrie',                              'specialite'),
  ('pneumologie',                           'Pneumologie',                            'specialite'),
  ('psychiatrie',                           'Psychiatrie',                            'specialite'),
  ('radiologie',                            'Radiologie',                             'specialite'),
  ('reanimation-medicale',                  'Réanimation médicale',                   'specialite'),
  ('rhumatologie',                          'Rhumatologie',                           'specialite'),
  ('sante-publique',                        'Santé publique',                         'specialite'),
  ('chirurgie-esthetique-plastique',        'Chirurgie esthétique, plastique',        'specialite'),
  ('chirurgie-maxillo-faciale-stomato',     'Chirurgie maxillo-faciale et stomato.',  'specialite'),
  ('chirurgie-pediatrique',                 'Chirurgie pédiatrique',                  'specialite'),
  ('chirurgie-thoracique-cardiovasculaire', 'Chirurgie thoracique et cardiovasculaire','specialite'),
  ('chirurgie-vasculaire',                  'Chirurgie vasculaire',                   'specialite'),
  ('chirurgie-viscerale-digestive',         'Chirurgie viscérale et digestive',       'specialite'),
  ('gynecologie-obstetrique',               'Gynécologie-obstétrique',                'specialite'),
  ('medecine-legale-expertise',             'Médecine légale et expertise',           'specialite'),
  ('neurochirurgie',                        'Neurochirurgie',                         'specialite'),
  ('ophtalmologie',                         'Ophtalmologie',                          'specialite'),
  ('orl-chirurgie-cervico-faciale',         'ORL et chirurgie cervico-faciale',       'specialite'),
  ('orthopedie-traumatologie',              'Orthopédie-traumatologie',               'specialite'),
  ('urologie',                              'Urologie',                               'specialite'),
  ('biologie-medicale',                     'Biologie médicale',                      'specialite')
ON CONFLICT (slug) DO NOTHING;

-- Thèmes
INSERT INTO tags_ref (slug, label, type) VALUES
  ('convention-medicale',          'Convention médicale',                  'theme'),
  ('negociations-conventionnelles','Négociations conventionnelles',        'theme'),
  ('tarifs-honoraires',            'Tarifs et honoraires',                 'theme'),
  ('tiers-payant',                 'Tiers payant',                         'theme'),
  ('secteurs-conventionnels',      'Secteurs conventionnels',              'theme'),
  ('plfss-lfss',                   'PLFSS / LFSS',                         'theme'),
  ('deserts-medicaux',             'Déserts médicaux',                     'theme'),
  ('demographie-medicale',         'Démographie médicale',                 'theme'),
  ('numerus-apertus',              'Numerus apertus',                      'theme'),
  ('installation-liberale',        'Installation libérale',                'theme'),
  ('medecine-liberale',            'Médecine libérale',                    'theme'),
  ('msp-exercice-groupe',          'MSP / Exercice en groupe',             'theme'),
  ('hopital-public',               'Hôpital public',                       'theme'),
  ('urgences',                     'Urgences',                             'theme'),
  ('permanence-des-soins',         'Permanence des soins (PDSA)',          'theme'),
  ('telemedecine',                 'Télémédecine / Téléexpertise',         'theme'),
  ('numerique-sante',              'Numérique en santé',                   'theme'),
  ('donnees-de-sante-rgpd',        'Données de santé / RGPD',             'theme'),
  ('retraite-carmf',               'Retraite CARMF',                       'theme'),
  ('urssaf-cotisations',           'URSSAF / Cotisations sociales',        'theme'),
  ('urps-representativite',        'URPS / Représentativité syndicale',    'theme'),
  ('ordre-des-medecins',           'Ordre des médecins',                   'theme'),
  ('syndicats',                    'Syndicats médicaux',                   'theme'),
  ('internes-formation',           'Internes / Formation médicale',        'theme'),
  ('reforme-etudes-medicales',     'Réforme études médicales',             'theme'),
  ('assurance-maladie-cnam',       'Assurance maladie / CNAM',             'theme'),
  ('ministere-sante',              'Ministère de la Santé',                'theme'),
  ('greve-mobilisation',           'Grève / Mobilisation',                 'theme'),
  ('medicaments-remboursement',    'Médicaments / Remboursement',          'theme'),
  ('responsabilite-medicale',      'Responsabilité médicale',              'theme')
ON CONFLICT (slug) DO NOTHING;

-- RLS : lecture publique
ALTER TABLE tags_ref ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tags_ref: lecture publique" ON tags_ref FOR SELECT USING (true);
