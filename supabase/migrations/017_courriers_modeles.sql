-- ============================================================
-- Migration 017 — Bibliothèque de modèles de courriers
-- Idempotent : ON CONFLICT (slug) DO NOTHING
-- Étend aussi l'enum categorie_courrier
-- ============================================================

-- Nouveaux types de catégories
ALTER TYPE categorie_courrier ADD VALUE IF NOT EXISTS 'urssaf';
ALTER TYPE categorie_courrier ADD VALUE IF NOT EXISTS 'confreres';
ALTER TYPE categorie_courrier ADD VALUE IF NOT EXISTS 'organismes';
ALTER TYPE categorie_courrier ADD VALUE IF NOT EXISTS 'defense';

-- ============================================================
-- PATIENTS — Honoraires & Relation
-- ============================================================
INSERT INTO courriers (titre, slug, description, categorie, contenu_template, variables_requises, acces) VALUES

(
    'Rappel d''honoraires impayés (1re relance)',
    'rappel-honoraires-impayes',
    'Première relance amiable pour des honoraires restés impayés après consultation.',
    'patients',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\n\nÀ l''attention de\n{{nom_patient}}\n\n**Objet : Rappel de règlement — consultation du {{date_consultation}}**\n\nMadame, Monsieur,\n\nSauf erreur de ma part, la somme de {{montant_du}} € correspondant à votre consultation du {{date_consultation}} n''a pas encore été réglée à ce jour.\n\nJe vous rappelle que les honoraires médicaux sont payables à la consultation. Je vous serais reconnaissant(e) de bien vouloir régulariser cette situation dans les meilleurs délais.\n\nSi ce règlement a été effectué après l''envoi de ce courrier, veuillez ne pas en tenir compte.\n\nCordialement,\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'nom_patient', 'date_consultation', 'montant_du'],
    'gratuit'
),

(
    'Mise en demeure — honoraires impayés',
    'mise-en-demeure-honoraires',
    'Deuxième relance formelle avant recours à une procédure de recouvrement.',
    'patients',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\n\nÀ l''attention de\n{{nom_patient}}\n\n**Objet : Mise en demeure de payer — honoraires impayés**\n\nMadame, Monsieur,\n\nMalgré mon précédent rappel resté sans réponse, la somme de {{montant_du}} €, due au titre de la (des) consultation(s) du {{date_consultation}}, n''a toujours pas été réglée.\n\nPar le présent courrier, je vous mets en demeure de procéder au règlement de cette somme dans un délai de **8 jours** à compter de la réception de ce courrier.\n\nÀ défaut, je me verrai contraint(e) d''engager une procédure de recouvrement judiciaire, dont les frais seront à votre charge.\n\nDans l''attente de votre règlement, je vous adresse mes salutations.\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'nom_patient', 'date_consultation', 'montant_du'],
    'gratuit'
),

(
    'Fin de relation thérapeutique',
    'fin-relation-therapeutique',
    'Mettre fin au suivi d''un patient de manière formelle et légale.',
    'patients',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\n\nÀ l''attention de\nM./Mme {{nom_patient}}\n\n**Objet : Fin de la relation thérapeutique**\n\nMadame, Monsieur,\n\nJe vous informe par le présent courrier que je ne suis plus en mesure d''assurer votre suivi médical à compter du {{date_fin}}.\n\nConformément à mes obligations déontologiques (art. 47 du Code de déontologie médicale), je vous transmets les éléments nécessaires à la continuité de vos soins et je reste disponible pour tout renseignement urgent jusqu''à cette date.\n\nJe vous invite à consulter votre médecin traitant ou à en désigner un nouveau auprès de votre caisse d''assurance maladie.\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'nom_patient', 'date_fin'],
    'gratuit'
),

(
    'Information sur les dépassements d''honoraires',
    'information-depassements-honoraires',
    'Informer un patient de vos tarifs et de la pratique du dépassement d''honoraires.',
    'patients',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\n\nÀ l''attention de\nM./Mme {{nom_patient}}\n\n**Objet : Information tarifaire préalable**\n\nMadame, Monsieur,\n\nConformément à l''arrêté du 2 octobre 2012 relatif au contrat d''accès aux soins et à l''article D. 162-1-7 du Code de la sécurité sociale, je vous informe des éléments tarifaires suivants :\n\n- Tarif de la consultation : {{tarif_consultation}} €\n- Tarif de remboursement Assurance Maladie : {{tarif_remboursement}} €\n- Dépassement d''honoraires : {{montant_depassement}} €\n\nCe dépassement est lié à {{motif_depassement}}.\n\nJe reste à votre disposition pour tout renseignement complémentaire.\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'nom_patient', 'tarif_consultation', 'tarif_remboursement', 'montant_depassement', 'motif_depassement'],
    'gratuit'
)

ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- CPAM — Contrôles & Réclamations
-- ============================================================
INSERT INTO courriers (titre, slug, description, categorie, contenu_template, variables_requises, acces) VALUES

(
    'Réclamation suite à contrôle CPAM',
    'reclamation-controle-cpam',
    'Contester les conclusions d''un contrôle ou d''un audit de la CPAM.',
    'cpam',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\nN° RPPS : {{rpps}}\n\nÀ l''attention de\nMme/M. le Médecin-conseil\nCPAM de {{departement}}\n\n**Objet : Réclamation suite au contrôle du {{date_controle}}**\n\nMadame, Monsieur le Médecin-conseil,\n\nPar courrier du {{date_controle}}, vous m''avez notifié les conclusions d''un contrôle portant sur {{objet_controle}}.\n\nJe conteste ces conclusions pour les raisons suivantes :\n\n{{motifs_contestation}}\n\nJe sollicite en conséquence une révision de votre décision et, le cas échéant, la tenue d''une réunion de conciliation.\n\nJe vous prie de croire, Madame, Monsieur le Médecin-conseil, en l''expression de mes sentiments distingués.\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'rpps', 'departement', 'date_controle', 'objet_controle', 'motifs_contestation'],
    'gratuit'
),

(
    'Contestation d''un reversement réclamé par la CPAM',
    'contestation-reversement-cpam',
    'S''opposer formellement à une demande de reversement d''honoraires de la CPAM.',
    'cpam',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\nN° RPPS : {{rpps}}\n\nÀ l''attention de\nMme/M. le Directeur\nCPAM de {{departement}}\n\n**Objet : Contestation de la demande de reversement du {{date_notification}} — {{montant_reclame}} €**\n\nMadame, Monsieur le Directeur,\n\nPar courrier en date du {{date_notification}}, vous m''avez réclamé le reversement de la somme de {{montant_reclame}} € au titre de {{motif_reversement}}.\n\nJe conteste formellement cette demande pour les motifs suivants :\n\n{{arguments}}\n\nJe vous demande en conséquence de bien vouloir renoncer à cette réclamation et de m''en accuser réception.\n\nÀ défaut de réponse dans un délai de 30 jours, je me réserve le droit de saisir la Commission de recours amiable.\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'rpps', 'departement', 'date_notification', 'montant_reclame', 'motif_reversement', 'arguments'],
    'gratuit'
),

(
    'Demande de conciliation CPAM',
    'demande-conciliation-cpam',
    'Demander une réunion de conciliation avec la CPAM avant tout recours contentieux.',
    'cpam',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\nN° RPPS : {{rpps}}\n\nÀ l''attention de\nMme/M. le Directeur\nCPAM de {{departement}}\n\n**Objet : Demande de réunion de conciliation**\n\nMadame, Monsieur le Directeur,\n\nSuite à votre notification du {{date_notification}} concernant {{objet_litige}}, et avant tout recours contentieux, je sollicite la tenue d''une réunion de conciliation conformément à l''article L. 162-1-14-1 du Code de la sécurité sociale.\n\nJe suis disponible aux dates suivantes : {{disponibilites}}.\n\nJe vous remercie de bien vouloir me confirmer votre accord et les modalités de cette rencontre.\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'rpps', 'departement', 'date_notification', 'objet_litige', 'disponibilites'],
    'gratuit'
)

ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- URSSAF — Cotisations & Fiscalité
-- ============================================================
INSERT INTO courriers (titre, slug, description, categorie, contenu_template, variables_requises, acces) VALUES

(
    'Contestation d''un redressement URSSAF',
    'contestation-redressement-urssaf',
    'S''opposer aux conclusions d''un redressement URSSAF et en demander la révision.',
    'urssaf',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\n\nÀ l''attention de\nMme/M. le Directeur\nURSSAF de {{departement}}\n\n**Objet : Contestation du redressement notifié le {{date_notification}} — {{montant_conteste}} €**\n\nMadame, Monsieur le Directeur,\n\nPar lettre d''observations du {{date_notification}}, votre service m''a notifié un redressement de cotisations sociales d''un montant de {{montant_conteste}} € portant sur la période {{periode}}.\n\nJe conteste ce redressement pour les motifs suivants :\n\n{{motifs}}\n\nJe vous demande en conséquence de bien vouloir revoir votre position et de m''en informer dans un délai de 30 jours.\n\nConformément à l''article R. 243-59 du Code de la sécurité sociale, je me réserve le droit de saisir la Commission de recours amiable.\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'departement', 'date_notification', 'montant_conteste', 'periode', 'motifs'],
    'adherents'
),

(
    'Demande d''échelonnement des cotisations URSSAF',
    'echelonnement-cotisations-urssaf',
    'Obtenir un délai de paiement ou un échéancier auprès de l''URSSAF.',
    'urssaf',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\n\nÀ l''attention de\nMme/M. le Directeur\nURSSAF de {{departement}}\n\n**Objet : Demande d''échelonnement — cotisations {{annee}} — {{montant_total}} €**\n\nMadame, Monsieur le Directeur,\n\nJe me permets de vous contacter au sujet du règlement de mes cotisations sociales pour l''année {{annee}}, d''un montant total de {{montant_total}} €.\n\nEn raison de {{motif_difficulte}}, je rencontre actuellement des difficultés temporaires de trésorerie qui ne me permettent pas d''honorer ce règlement en une seule fois.\n\nJe vous sollicite donc afin d''obtenir un échéancier de paiement en {{nombre_mensualites}} mensualités, à compter du {{date_debut}}.\n\nJe reste à votre disposition pour convenir des modalités de cet arrangement.\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'departement', 'annee', 'montant_total', 'motif_difficulte', 'nombre_mensualites', 'date_debut'],
    'gratuit'
)

ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- CABINET — Bail & Propriétaire
-- ============================================================
INSERT INTO courriers (titre, slug, description, categorie, contenu_template, variables_requises, acces) VALUES

(
    'Demande de travaux d''adaptation du cabinet',
    'demande-travaux-cabinet',
    'Demander au propriétaire des travaux de mise aux normes ou d''adaptation du local.',
    'cabinet',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\n\nÀ l''attention de\n{{nom_proprietaire}}\n{{adresse_proprietaire}}\n\n**Objet : Demande de réalisation de travaux — local sis {{adresse_cabinet}}**\n\nMadame, Monsieur,\n\nJe suis locataire du local professionnel sis {{adresse_cabinet}} en vertu du bail professionnel signé le {{date_bail}}.\n\nDans le cadre de l''exercice de mon activité médicale, des travaux d''adaptation sont nécessaires :\n\n{{description_travaux}}\n\nCes travaux sont justifiés par {{justification}} et sont nécessaires pour {{finalite}}.\n\nJe vous remercie de bien vouloir me confirmer votre accord pour la réalisation de ces travaux dans un délai de {{delai_souhaite}}, et de m''indiquer si vous souhaitez les prendre en charge ou si je dois les effectuer à mes frais.\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'nom_proprietaire', 'adresse_proprietaire', 'date_bail', 'description_travaux', 'justification', 'finalite', 'delai_souhaite'],
    'gratuit'
),

(
    'Résiliation du bail professionnel',
    'resiliation-bail-professionnel',
    'Donner congé au propriétaire pour mettre fin au bail du cabinet médical.',
    'cabinet',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\n\nÀ l''attention de\n{{nom_proprietaire}}\n{{adresse_proprietaire}}\n\n**Objet : Congé — bail professionnel du {{adresse_cabinet}} — Préavis {{preavis_mois}} mois**\n\nMadame, Monsieur,\n\nPar le présent courrier, je vous notifie ma décision de ne pas renouveler le bail professionnel portant sur les locaux sis {{adresse_cabinet}}, et ce conformément aux dispositions de notre contrat.\n\nJe vous donne congé avec un préavis de {{preavis_mois}} mois à compter de la réception du présent courrier, soit une libération des locaux au plus tard le {{date_fin_souhaitee}}.\n\nJe reste à votre disposition pour organiser un état des lieux de sortie.\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'nom_proprietaire', 'adresse_proprietaire', 'preavis_mois', 'date_fin_souhaitee'],
    'gratuit'
),

(
    'Contestation d''une augmentation de loyer',
    'contestation-augmentation-loyer',
    'Contester une augmentation de loyer jugée abusive ou non conforme au bail.',
    'cabinet',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\n\nÀ l''attention de\n{{nom_proprietaire}}\n{{adresse_proprietaire}}\n\n**Objet : Contestation de l''augmentation de loyer notifiée le {{date_notification}}**\n\nMadame, Monsieur,\n\nPar votre courrier du {{date_notification}}, vous m''avez informé d''une augmentation de mon loyer mensuel de {{loyer_actuel}} € à {{loyer_nouveau}} €, soit une hausse de {{pourcentage_hausse}} %.\n\nJe conteste cette augmentation pour les motifs suivants :\n\n{{motifs_contestation}}\n\nJe vous invite à reconsidérer cette décision. À défaut d''accord dans un délai de 15 jours, je me verrai contraint(e) de saisir la commission de conciliation compétente.\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'nom_proprietaire', 'adresse_proprietaire', 'date_notification', 'loyer_actuel', 'loyer_nouveau', 'pourcentage_hausse', 'motifs_contestation'],
    'adherents'
)

ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- CONFRÈRES — Collaboration & Remplacement
-- ============================================================
INSERT INTO courriers (titre, slug, description, categorie, contenu_template, variables_requises, acces) VALUES

(
    'Proposition de collaboration libérale',
    'proposition-collaboration-liberale',
    'Proposer à un confrère une collaboration libérale dans le cadre d''un cabinet de groupe.',
    'confreres',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\n\nÀ l''attention du\nDr {{nom_confrere}}\n{{adresse_confrere}}\n\n**Objet : Proposition de collaboration libérale**\n\nChère Consœur, Cher Confrère,\n\nJe me permets de vous adresser ce courrier afin de vous soumettre une proposition de collaboration libérale au sein de mon cabinet sis {{adresse_cabinet}}.\n\nCette collaboration porterait sur les conditions suivantes :\n\n{{conditions_proposees}}\n\nJe serais ravi(e) de vous rencontrer pour échanger sur ce projet. Je reste à votre disposition pour toute question complémentaire.\n\nConfrèrement,\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'nom_confrere', 'adresse_confrere', 'conditions_proposees'],
    'adherents'
),

(
    'Résiliation d''un contrat de collaboration',
    'resiliation-contrat-collaboration',
    'Mettre fin à un contrat de collaboration libérale en respectant le préavis.',
    'confreres',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\n\nÀ l''attention du\nDr {{nom_confrere}}\n{{adresse_confrere}}\n\n**Objet : Résiliation du contrat de collaboration signé le {{date_contrat}}**\n\nChère Consœur, Cher Confrère,\n\nJe vous notifie par le présent courrier ma décision de mettre fin à notre contrat de collaboration libérale signé le {{date_contrat}}, et ce conformément à l''article {{article_resiliation}} dudit contrat.\n\nJe respecterai le préavis convenu de {{preavis_semaines}} semaines, notre collaboration prenant fin le {{date_fin}}.\n\nJe reste disponible pour assurer une transition ordonnée de nos activités communes.\n\nConfrèrement,\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'nom_confrere', 'adresse_confrere', 'date_contrat', 'article_resiliation', 'preavis_semaines', 'date_fin'],
    'adherents'
)

ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- RGPD & NUMÉRIQUE
-- ============================================================
INSERT INTO courriers (titre, slug, description, categorie, contenu_template, variables_requises, acces) VALUES

(
    'Résiliation du contrat Doctolib',
    'resiliation-contrat-doctolib',
    'Résilier le contrat d''abonnement à la plateforme Doctolib en respectant le préavis.',
    'rgpd',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\n\nÀ l''attention du Service Résiliation\nDoctolib SAS\n54-56, avenue Hoche\n75008 Paris\n\n**Objet : Résiliation du contrat n° {{numero_contrat}} — Praticien {{prenom_nom}}**\n\nMadame, Monsieur,\n\nJe vous notifie par le présent courrier ma décision de résilier mon contrat d''abonnement à la plateforme Doctolib, référencé sous le n° {{numero_contrat}}.\n\nConformément aux conditions générales de vente, je vous adresse ce préavis de résiliation avec effet au {{date_resiliation_souhaitee}}.\n\nJe vous demande de :\n- Confirmer la prise en compte de cette résiliation par email\n- M''assurer la portabilité de mes données (historique des rendez-vous, données patients) au format CSV ou équivalent\n- Supprimer l''ensemble de mes données personnelles à l''issue du contrat, conformément au RGPD (art. 17)\n\nCordialement,\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'numero_contrat', 'date_resiliation_souhaitee'],
    'gratuit'
),

(
    'Demande d''export des données patients à un prestataire',
    'demande-export-donnees-patients',
    'Obtenir l''export de ses données patients auprès d''un éditeur de logiciel médical.',
    'rgpd',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\nN° RPPS : {{rpps}}\n\nÀ l''attention du DPO / Service Juridique\n{{nom_prestataire}}\n\n**Objet : Demande de portabilité et d''export des données — Art. 20 RGPD**\n\nMadame, Monsieur,\n\nEn qualité de responsable du traitement des données de mes patients, je vous adresse une demande formelle d''export de l''intégralité des données hébergées sur votre plateforme {{nom_prestataire}}, conformément à l''article 20 du RGPD relatif à la portabilité des données.\n\nJe souhaite recevoir ces données dans le format {{format_souhaite}} (de préférence interopérable), incluant notamment les dossiers patients, les historiques de rendez-vous et toute donnée associée à mon compte.\n\nConformément au RGPD, je vous demande de satisfaire à cette demande dans un délai d''un mois à compter de la réception du présent courrier.\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'rpps', 'nom_prestataire', 'format_souhaite'],
    'gratuit'
),

(
    'Opposition au traitement de données par un logiciel médical',
    'opposition-traitement-donnees-logiciel',
    'Demander à un éditeur de logiciel de cesser tout traitement non consenti des données.',
    'rgpd',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\nN° RPPS : {{rpps}}\n\nÀ l''attention du DPO\n{{nom_logiciel}}\n\n**Objet : Droit d''opposition au traitement de données — Art. 21 RGPD**\n\nMadame, Monsieur,\n\nJe suis titulaire d''un compte {{nom_logiciel}} et responsable du traitement des données de santé de mes patients.\n\nJ''ai constaté que votre société procède au traitement suivant sans base légale suffisante : {{type_traitement}}.\n\nEn application de l''article 21 du RGPD, je m''oppose formellement à ce traitement et vous demande d''y mettre fin immédiatement.\n\nÀ défaut de réponse satisfaisante sous 30 jours, je saisirai la CNIL.\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'rpps', 'nom_logiciel', 'type_traitement'],
    'adherents'
)

ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- DÉFENSE PROFESSIONNELLE
-- ============================================================
INSERT INTO courriers (titre, slug, description, categorie, contenu_template, variables_requises, acces) VALUES

(
    'Signalement de menaces ou violences d''un patient',
    'signalement-violences-patient',
    'Documenter et signaler formellement un acte de violence ou de menace émanant d''un patient.',
    'defense',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\n\nÀ l''attention de\nM. le Procureur de la République\nTribunal judiciaire de {{tribunal}}\n\n**Objet : Dépôt de plainte pour violences / menaces**\n\nMonsieur le Procureur,\n\nJe soussigné(e), Dr {{prenom_nom}}, médecin exerçant à {{adresse_cabinet}}, vous demande de bien vouloir enregistrer la présente plainte pour les faits suivants.\n\nLe {{date_incident}}, {{description_incident}}.\n\n{{temoins}}\n\nCes faits sont constitutifs des infractions prévues aux articles {{references_legales}} du Code pénal.\n\nJe reste à la disposition de vos services pour tout complément d''information.\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'tribunal', 'date_incident', 'description_incident', 'temoins', 'references_legales'],
    'adherents'
),

(
    'Mise en demeure — diffamation en ligne',
    'mise-en-demeure-diffamation-ligne',
    'Mettre en demeure l''auteur d''un avis diffamatoire en ligne de le supprimer.',
    'defense',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\n\nÀ l''attention de\n{{nom_auteur}}\n\n**Objet : Mise en demeure de suppression d''un contenu diffamatoire**\n\nMadame, Monsieur,\n\nJe soussigné(e), Dr {{prenom_nom}}, ai constaté la publication d''un avis ou commentaire vous concernant à l''adresse suivante : {{url_contenu}}, en date du {{date_publication}}, sur la plateforme {{plateforme}}.\n\nCe contenu comporte des allégations mensongères portant atteinte à mon honneur et à ma réputation professionnelle, constitutives de diffamation au sens de la loi du 29 juillet 1881.\n\nJe vous mets en demeure de supprimer ce contenu dans un délai de **48 heures** à compter de la réception du présent courrier.\n\nÀ défaut, je n''hésiterai pas à engager toute action judiciaire appropriée et à vous réclamer des dommages et intérêts.\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'nom_auteur', 'url_contenu', 'date_publication', 'plateforme'],
    'adherents'
)

ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- ORGANISMES — Ordre & ARS
-- ============================================================
INSERT INTO courriers (titre, slug, description, categorie, contenu_template, variables_requises, acces) VALUES

(
    'Notification d''installation à l''ARS',
    'notification-installation-ars',
    'Notifier l''ARS de l''ouverture d''un nouveau cabinet médical.',
    'organismes',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\nN° RPPS : {{rpps}}\n\nÀ l''attention de\nMme/M. le Directeur Général\nARS Île-de-France\n35, rue de la Gare\n75935 Paris Cedex 19\n\n**Objet : Notification d''installation en cabinet libéral**\n\nMadame, Monsieur le Directeur Général,\n\nJ''ai l''honneur de vous informer de mon installation en tant que médecin libéral à compter du {{date_installation}}, à l''adresse suivante : {{adresse_cabinet}}.\n\nSpécialité exercée : {{specialite}}\nN° RPPS : {{rpps}}\nSecteur conventionnel : {{secteur}}\n\nJe reste à votre disposition pour tout renseignement complémentaire.\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'rpps', 'date_installation', 'specialite', 'secteur'],
    'gratuit'
),

(
    'Demande d''autorisation de cabinet secondaire',
    'demande-cabinet-secondaire',
    'Demander l''autorisation d''exercer dans un cabinet secondaire auprès de l''ARS.',
    'organismes',
    E'{{ville}}, le {{date}}\n\nDr {{prenom_nom}}\n{{adresse_cabinet}}\nN° RPPS : {{rpps}}\n\nÀ l''attention de\nMme/M. le Directeur Général\nARS Île-de-France\n35, rue de la Gare\n75935 Paris Cedex 19\n\n**Objet : Demande d''autorisation d''exercice en cabinet secondaire**\n\nMadame, Monsieur le Directeur Général,\n\nJe soussigné(e), Dr {{prenom_nom}}, médecin libéral exerçant à titre principal à l''adresse {{adresse_cabinet}}, sollicite l''autorisation d''exercer en cabinet secondaire à l''adresse suivante : {{adresse_cabinet_secondaire}}.\n\nMotif de la demande : {{motif}}\n\nJe joins à ce courrier les pièces justificatives nécessaires et reste à votre disposition pour tout complément d''information.\n\nDr {{prenom_nom}}',
    ARRAY['ville', 'date', 'prenom_nom', 'adresse_cabinet', 'rpps', 'adresse_cabinet_secondaire', 'motif'],
    'gratuit'
)

ON CONFLICT (slug) DO NOTHING;

-- Rechargement du cache de schéma PostgREST
SELECT pg_notify('pgrst', 'reload schema');
