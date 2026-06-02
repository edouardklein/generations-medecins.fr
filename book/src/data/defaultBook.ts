import type { Book } from '../lib/types'

const partnerLogoBySlug = (slug: string) => `/logos/${slug}`

// Real partners shown on the "Nos partenaires" slide (logos sit in book/public/logos)
const knownPartners = [
  { name: 'Crédit Agricole', logo: partnerLogoBySlug('CA.png') },
  { name: 'La Médicale', logo: partnerLogoBySlug('LM.png') },
  { name: 'One Gestion Privée', logo: partnerLogoBySlug('OGP.png') },
  { name: 'Hack Your Care', logo: partnerLogoBySlug('HYC.png') },
  { name: 'NeuroStim', logo: partnerLogoBySlug('NST.png') },
  { name: 'Celene', logo: partnerLogoBySlug('CLN.jpg') },
  { name: 'Amarsi', logo: partnerLogoBySlug('AMA.png') },
  { name: 'Club Privé des Médecins', logo: partnerLogoBySlug('CPM.png') },
  { name: 'Clariane', logo: partnerLogoBySlug('CLA.png') },
  { name: 'Nebimage', logo: partnerLogoBySlug('NEB.png') },
  { name: 'Novo Nordisk', logo: partnerLogoBySlug('NOV.png') },
]

export const defaultBook: Book = {
  title: 'GM IDF • Book Partenaires 2026',
  slides: [
    {
      type: 'cover',
      props: {
        eyebrow: 'PARTENARIAT • 2026',
        brand: 'GÉNÉRATIONS MÉDECINS IDF',
        titleLines: ['Devenez', "l'allié privilégié", 'des médecins', 'franciliens.'],
        subtitle:
          'Un réseau de 2 000 médecins en Île-de-France. Une communauté engagée. Un parcours partenaire pensé pour votre impact.',
        footer: 'BOOK PARTENAIRES • ÉDITION 2026',
      },
    },
    {
      type: 'summary',
      props: {
        title: 'Sommaire',
        items: [
          { chapter: '01', title: 'Qui sommes-nous ?', description: 'Manifesto, bureau & KOLs', range: 'Slides 03 – 05' },
          { chapter: '02', title: "L'opportunité partenaire", description: 'Bénéfices, audience, leviers d\'activation', range: 'Slides 06 – 08' },
          { chapter: '03', title: 'Nos rendez-vous', description: 'Events mensuels et The Big Event', range: 'Slides 09 – 10' },
          { chapter: '04', title: 'Plateforme & partenaires', description: 'Nos outils et notre communauté', range: 'Slides 11 – 12' },
          { chapter: '05', title: 'Besoins & engagement', description: 'Budget, charte et contact', range: 'Slides 13 – 15' },
        ],
      },
    },
    {
      type: 'stats',
      props: {
        eyebrow: 'Notre audience',
        title: 'Une audience importante',
        subtitle: 'Générations Médecins Île-de-France en chiffres.',
        stats: [
          { label: 'Adhérents IDF', value: 2000, caption: 'médecins en Île-de-France' },
          { label: 'Abonnés LinkedIn', value: 17000, caption: 'Président GM IDF — LinkedIn' },
          { label: 'Contacts', value: 12000, caption: 'Base Médecins en Grève' },
          { label: 'Événements / an', value: 12, caption: 'soirées networking qualifiées' },
        ],
        quote:
          "Un partenariat avec GM IDF, c'est un accès direct à un terrain qualifié, une audience engagée et une crédibilité scientifique sans équivalent.",
      },
    },
    {
      type: 'manifesto',
      props: {
        eyebrow: '01 • Qui sommes-nous',
        title: 'Une organisation au service des médecins',
        subtitle: 'Générations Médecins Île-de-France accompagne et défend les médecins franciliens.',
        verbs: ['Informer.', 'Fédérer.', 'Accompagner.'],
        body:
          "Nous accompagnons les médecins franciliens tout au long de leur carrière, de l'installation aux nouveaux modèles d'exercice. Une communauté active, des contenus utiles et des événements qui rapprochent ville et hôpital.",
        pillars: [
          { num: '1', title: 'Impact & terrain', text: "Services et contenus à forte valeur pour l'installation, l'exercice et la carrière." },
          { num: '2', title: 'Projets structurants', text: 'Plateformes, événements, baromètres pour la communauté médicale.' },
          { num: '3', title: 'Communauté active', text: 'Newsletter, réseaux sociaux, rencontres et networking qualifié.' },
        ],
      },
    },
    {
      type: 'bureau',
      props: {
        eyebrow: '01 • Qui sommes-nous',
        title: 'Le bureau & nos KOLs',
        subtitle: "Un bureau composé de médecins reconnus, leaders d'opinion sur leurs thématiques.",
        members: [
          {
            initials: 'AB',
            name: 'Dr. Alexis BOURLA',
            role: 'Président',
            specialty: 'Psychiatre',
            details: 'Direction médicale — Clariane, NeuroStim, Cline Research, Masterclass Médicale',
          },
          {
            initials: 'MT',
            name: 'Dr. Minh-Hanh TA',
            role: 'Secrétaire générale',
            specialty: 'Onco-radiothérapeute',
          },
          {
            initials: 'PH',
            name: 'Dr. Pierre HAMANN',
            role: 'Vice-président',
            specialty: 'Dermatologue',
            details: 'Chef de Service Dermatologie — Kremlin-Bicêtre',
          },
          {
            initials: 'CC',
            name: 'Dr. Cherifa CHEURFA',
            role: 'Vice-présidente',
            specialty: 'Anesthésiste-réanimateur',
          },
          {
            initials: 'LK',
            name: 'Dr. Louise-Anne KLEIN',
            role: 'Vice-présidente',
            specialty: 'Gynécologue obstétricienne',
          },
          {
            initials: 'FV',
            name: 'Pr. Franck VERDONK',
            role: 'Trésorier',
            specialty: 'Anesthésiste-réanimateur',
            details: 'Chef de Service de Réanimation — Saint-Antoine',
          },
          { initials: 'RB', name: 'R. Bendrihem', role: 'Chargée de mission', small: true },
          { initials: 'SH', name: 'S. Hugain', role: 'Chargée de mission', small: true },
        ],
        footnote:
          'Plusieurs KOL au sein du bureau • Plusieurs Vice-présidents de la FMF ou de syndicats verticaux • Plusieurs Chefs de Service • Multidisciplinarité forte.',
      },
    },
    {
      type: 'benefits',
      props: {
        eyebrow: "02 • L'opportunité",
        title: 'Ce que nous vous apportons',
        subtitle: 'Quatre raisons concrètes de nouer un partenariat pluriannuel avec GM IDF.',
        benefits: [
          {
            num: '01',
            title: 'Toucher les médecins au moment de leurs plus grandes décisions financières',
            body: 'Installation, remplacement, achat immobilier, création de société, prévoyance, retraite, RCP, emprunteur, gestion patrimoniale.',
            arrow:
              'Nos adhérents sont précisément dans la période de vie où ils souscrivent le plus de contrats et changent le plus de prestataires.',
          },
          {
            num: '02',
            title: "Une audience ultra-ciblée et difficile à toucher autrement",
            body: "Les médecins sont l'une des populations professionnelles les plus difficiles à atteindre :",
            items: [
              'Peu de temps disponible',
              'Forte sollicitation commerciale',
              'Faible efficacité des canaux publicitaires',
            ],
            arrow:
              "Nos partenaires bénéficient d'un accès direct à une communauté déjà engagée et identifiée.",
          },
          {
            num: '03',
            title: "Une recommandation vaut plus qu'une publicité",
            body:
              "Un partenariat avec Générations Médecins place votre marque dans un environnement de confiance plutôt qu'une logique publicitaire.",
            arrow:
              "Taux de conversion significativement supérieurs lorsque la mise en relation passe par une organisation professionnelle reconnue.",
          },
          {
            num: '04',
            title: 'Des dispositifs générateurs de leads',
            body: 'Nous pouvons mettre en place :',
            items: [
              'Webinaires thématiques',
              'Guides pratiques',
              'Ateliers installation',
              'Événements régionaux',
              'Newsletters ciblées',
              'Campagnes digitales',
              'Prises de RDV qualifiées',
            ],
            arrow:
              "L'objectif n'est pas la visibilité mais la génération de contacts et de nouveaux clients.",
          },
        ],
        closing:
          "Nous ne proposons pas que de la visibilité. Nous proposons un accès privilégié à plusieurs centaines de jeunes médecins au moment précis où ils choisissent leur banque, leur assureur, leur prévoyance et leurs partenaires professionnels.",
      },
    },
    {
      type: 'audience',
      props: {
        eyebrow: "02 • L'opportunité",
        title: 'Notre audience en détail',
        subtitle: 'Une communauté médicale francilienne segmentée et activable.',
        segments: [
          { label: 'Spécialistes', share: 70, description: 'Cœur de cible — spé > MG' },
          { label: '< 10 ans depuis le DES', share: 90, description: 'Jeunes médecins en installation' },
          { label: 'Internes', share: 15, description: 'Futurs prescripteurs et décideurs' },
        ],
        channels: [
          { label: 'Mailing', value: '12 000', caption: 'membres actifs (base sondages)' },
          { label: 'LinkedIn', value: '17 000', caption: 'abonnés (Président GM IDF)' },
          { label: 'Events mensuels', value: '360 / an', caption: '30 participants × 12 soirées' },
          { label: 'Big Event annuel', value: '200', caption: 'participants qualifiés' },
        ],
      },
    },
    {
      type: 'pillars',
      props: {
        eyebrow: "02 • L'opportunité",
        title: "Nos 3 piliers d'activation",
        subtitle: "Trois leviers d'engagement à activer selon vos objectifs partenariat.",
        pillars: [
          {
            num: '01',
            title: 'Newsletter récurrente',
            body:
              "Petites annonces, décryptages d'actualité, contenus pratiques pour la vie professionnelle des médecins franciliens.",
            tags: ['12 000 destinataires', 'Hebdomadaire'],
          },
          {
            num: '02',
            title: 'Events mensuels',
            body:
              "Soirées en petit comité, format afterwork qualitatif, vraie proximité — les médecins viennent, échangent, se reconnaissent.",
            tags: ['12 / an', '30 participants'],
          },
          {
            num: '03',
            title: 'Plateforme & contenus',
            body:
              "Mobilisation, lanceurs d'alerte, SOS juridique, outils d'aide à l'installation, consultation des adhérents.",
            tags: ['Plateforme membre', 'Mise à jour continue'],
          },
        ],
      },
    },
    {
      type: 'events',
      props: {
        eyebrow: '03 • Nos rendez-vous',
        title: 'Events Mensuels avec nos partenaires',
        subtitle: 'Hack Your Care, Celene, NeuroStim, Clariane — formats afterwork qualitatifs.',
        keyFacts: [
          { value: '12', label: 'Événements / an', caption: 'un par mois, hors été' },
          { value: '20–35', label: 'Participants', caption: 'cabinets, salles partenaires, locaux HYC' },
          { value: '4', label: 'Thèmes phares', caption: 'innovation, exercice, entrepreneuriat, formats' },
        ],
        program: [
          { time: '19h00', label: 'Accueil & verre de bienvenue' },
          { time: '19h30', label: "Mots d'introduction" },
          { time: '19h40', label: 'Intervention / Témoignage / Atelier' },
          { time: '20h40', label: 'Networking / Cocktail' },
          { time: '22h00', label: 'Fin' },
        ],
        themes: [
          { title: 'Innovation', body: 'Médecine & IA, outils au cabinet' },
          { title: 'Exercice', body: "Centres de santé, s'installer sans s'isoler" },
          { title: 'Entrepreneuriat', body: 'Gestion, finances, développement' },
          { title: 'Formats', body: 'Tables rondes • Interventions • Ateliers • Intervenant extérieur' },
        ],
      },
    },
    {
      type: 'bigEvent',
      props: {
        eyebrow: '03 • Nos rendez-vous',
        title: 'The Big Event',
        subtitle: 'Le grand rendez-vous annuel — peut-être deux à terme',
        meta: [
          { label: 'Public', value: '200 personnes' },
          { label: 'Intervenants', value: 'Partenaires, URPS, ARS, FAF, etc.' },
          { label: 'Format', value: '½ journée + soirée festive' },
          { label: 'Hôte soirée', value: 'House Clinics' },
        ],
        tracks: [
          {
            num: '1',
            title: 'Assistants, CCA, jeunes libéraux',
            audience: '14h30 – 16h30, pause 17h15',
            topics: [
              'Préparer sa carrière : libérale / hospitalière / mixte',
              'Connaître ses droits et statuts : congés, formations, etc.',
            ],
          },
          {
            num: '2',
            title: 'Hospitaliers (PH, PHU, PU-PH)',
            topics: [
              'Connaître ses droits et statuts : congés, formations, etc.',
              "Optimisation fiscale, finance, le libéral à l'hôpital",
            ],
          },
          {
            num: '3',
            title: 'Internes',
            audience: 'En rapprochement avec l\'ISNI',
            topics: [
              "Mécanismes d'achat, pied à terre",
              'Fiscalité, prêt préférentiel CA',
            ],
          },
        ],
        commonTitle: 'Thèmes communs',
        commonTopics: [
          'Parentalité',
          'Arrêt maladie',
          'Prévoyance',
          'Épuisement professionnel',
          'Santé mentale',
          'Dermascan',
          'IPA',
          'IA en médecine',
          'ESS',
          'Gérer ses salariés',
          'Faire du réseau',
          'Lutter contre l\'isolement',
          'Repenser le syndicalisme',
          'Financiarisation',
          'Euthanasie',
          'Directives anticipées',
          'Consentement',
          'Examen clinique au 21e',
          'Plaintes',
          'Religion en médecine',
          'Refuser la CMU',
          'Cotations',
          'Sexologie',
          'Influenceurs médicaux',
        ],
        guest: 'Soirée chez House Clinics',
      },
    },
    {
      type: 'features',
      props: {
        eyebrow: '04 • Plateforme',
        title: 'Notre plateforme membre',
        subtitle: 'Des outils concrets construits par et pour la communauté médicale francilienne.',
        features: [
          {
            glyph: '⚖️',
            tag: 'Juridique',
            title: 'SOS juridique',
            body:
              "Une IA juridique + un avocat de garde : plus rapide, plus accessible et plus à jour qu'un juriste classique. Réponses concrètes, contextualisées au droit médical.",
          },
          {
            glyph: '🏥',
            tag: 'Carrière',
            title: "Aide à l'installation",
            body:
              "Parcours pas-à-pas : choix du statut, cotations, démarches CPAM, montage de société, fiscalité. Mis à jour en continu par le bureau.",
          },
          {
            glyph: '🗳️',
            tag: 'Démocratie',
            title: 'Consultation des adhérents',
            body:
              'Sondages thématiques, baromètres, votes — chaque adhérent pèse dans les positions du syndicat.',
          },
          {
            glyph: '📢',
            tag: 'Engagement',
            title: 'Mobilisation & lanceurs d\'alerte',
            body:
              'Espace sécurisé pour signaler des dérives, alimenter le plaidoyer, et coordonner les actions de terrain.',
          },
          {
            glyph: '🧠',
            tag: 'Contenus',
            title: 'Décryptages d\'actualité',
            body:
              'Newsletter hebdo et fiches courtes : on traduit les évolutions réglementaires et conventionnelles en actions concrètes.',
          },
        ],
      },
    },
    {
      type: 'partnersLogos',
      props: {
        eyebrow: '04 • Nos partenaires',
        title: 'Nos partenaires',
        subtitle:
          "Une communauté de partenaires fidèles. Cette présentation est faite pour vous séduire — votre place est avec nous.",
        partners: knownPartners,
      },
    },
    {
      type: 'budget',
      props: {
        eyebrow: '05 • Investissement',
        title: 'Nos besoins pour mener nos actions',
        subtitle:
          "Budget annuel global pour déployer l'ensemble du programme 2026 — événements, plateforme, communication.",
        items: [
          { label: 'Events mensuels', detail: '2 750 € × 12 événements', amount: 33000 },
          { label: 'Développement des modules', detail: 'Plateforme membre, SOS juridique, outils', amount: 50000 },
          { label: 'Budget communication', detail: 'Production, réseaux, newsletter, design', amount: 25000 },
          { label: 'Big Event annuel', detail: '200 participants — ½ journée + soirée', amount: 30000 },
        ],
        totalLabel: 'Total annuel',
      },
    },
    {
      type: 'charter',
      props: {
        eyebrow: '06 • Engagement',
        title: 'Notre charte de partenariat',
        subtitle: 'Une relation transparente, encadrée et bénéfique pour tous.',
        pillars: [
          { glyph: '§', title: 'Éthique & déontologie', body: "Conformité à l'éthique professionnelle, aux réglementations applicables et à la déontologie médicale." },
          { glyph: '○', title: 'Indépendance', body: "Respect absolu de l'indépendance scientifique et éditoriale de Générations Médecins IDF." },
          { glyph: '◆', title: 'Transparence', body: 'Engagement de transparence sur les actions menées, leurs résultats et le reporting trimestriel.' },
          { glyph: '✚', title: 'Co-création', body: 'Co-construction des projets bénéficiant aux médecins, patients et système de santé.' },
        ],
      },
    },
    {
      type: 'contact',
      props: {
        eyebrow: 'Contact',
        title: 'Construisons ensemble un partenariat utile et visible.',
        body: "Échangeons sur vos objectifs et co-construisons l'activation qui vous ressemble.",
        channels: [
          { glyph: '@', label: 'Email', value: 'idf@generations-medecins.fr' },
          { glyph: '⌂', label: 'Site web', value: 'generations-medecins.fr' },
          { glyph: '▣', label: 'Réseaux', value: 'Insta • LinkedIn • X • Facebook' },
        ],
        footer: 'GÉNÉRATIONS MÉDECINS ÎLE-DE-FRANCE • BOOK PARTENAIRES 2026',
      },
    },
  ],
}
