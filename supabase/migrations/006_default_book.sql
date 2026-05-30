-- ============================================================================
-- Default book template — applies the full 20-slide GM IDF book to a partner
-- ============================================================================
-- Run once to install the function:
--   psql / SQL Editor → paste this whole file → Run
-- Then attribute the book to any partner with:
--   select public.apply_default_book('la-medicale');
-- ============================================================================

create or replace function public.apply_default_book(p_slug text)
returns int
language plpgsql
security definer
set search_path = public, extensions
as $fn$
declare
  v_partner_id uuid;
  v_slides jsonb := $book$[
  {
    "type": "cover",
    "props": {
      "eyebrow": "PARTENARIAT • 2026",
      "brand": "GÉNÉRATIONS MÉDECINS IDF",
      "titleLines": [
        "Devenez",
        "l'allié privilégié",
        "des médecins",
        "franciliens."
      ],
      "subtitle": "Un réseau de 3 000 médecins. Une communauté engagée.  Un parcours partenaire pensé pour votre impact.",
      "footer": "BOOK PARTENAIRES • ÉDITION 2026"
    }
  },
  {
    "type": "summary",
    "props": {
      "title": "Sommaire",
      "items": [
        {
          "chapter": "01",
          "title": "Qui sommes-nous ?",
          "description": "Présentation, manifesto, gouvernance",
          "range": "Slides 03 – 05"
        },
        {
          "chapter": "02",
          "title": "L'opportunité partenaire",
          "description": "Bénéfices, audience, projets 2026",
          "range": "Slides 06 – 10"
        },
        {
          "chapter": "03",
          "title": "Notre visibilité en action",
          "description": "Partenaires actuels et mockups multicanal",
          "range": "Slides 11 – 12"
        },
        {
          "chapter": "04",
          "title": "Forfaits & investissement",
          "description": "Bronze, Argent, Or et modules cumulables",
          "range": "Slides 13 – 18"
        },
        {
          "chapter": "05",
          "title": "Engagement & contact",
          "description": "Charte de partenariat et points de contact",
          "range": "Slides 19 – 20"
        }
      ]
    }
  },
  {
    "type": "stats",
    "props": {
      "eyebrow": "L'impact de notre réseau",
      "title": "Des chiffres qui parlent",
      "subtitle": "Le réseau Générations Médecins Île-de-France en chiffres.",
      "stats": [
        {
          "label": "Médecins",
          "value": 3000,
          "suffix": "+",
          "caption": "adhérents au Club privé"
        },
        {
          "label": "Abonnés",
          "value": 6000,
          "suffix": "+",
          "caption": "Instagram • LinkedIn • X • Facebook"
        },
        {
          "label": "Contacts",
          "value": 10000,
          "suffix": "+",
          "caption": "newsletter & base sondages"
        },
        {
          "label": "Soirées / an",
          "value": 4,
          "caption": "afterworks networking qualifiés"
        }
      ],
      "quote": "Un partenariat avec GM IDF, c'est un accès direct à un terrain qualifié, une audience engagée et une crédibilité scientifique sans équivalent."
    }
  },
  {
    "type": "manifesto",
    "props": {
      "eyebrow": "01 • Qui sommes-nous",
      "title": "Une organisation au service des médecins",
      "subtitle": "Générations Médecins Île-de-France accompagne et défend les médecins franciliens.",
      "verbs": [
        "Informer.",
        "Fédérer.",
        "Accompagner."
      ],
      "body": "Nous accompagnons les médecins franciliens tout au long de leur carrière, de l'installation aux nouveaux modèles d'exercice. Une communauté active, des contenus utiles et des événements qui rapprochent ville et hôpital.",
      "pillars": [
        {
          "num": "1",
          "title": "Impact & terrain",
          "text": "Services et contenus à forte valeur pour l'installation, l'exercice et la carrière."
        },
        {
          "num": "2",
          "title": "Projets structurants",
          "text": "Plateformes, événements, baromètres pour la communauté médicale."
        },
        {
          "num": "3",
          "title": "Communauté active",
          "text": "Newsletter, réseaux sociaux, rencontres et networking qualifié."
        }
      ]
    }
  },
  {
    "type": "bureau",
    "props": {
      "eyebrow": "01 • Qui sommes-nous",
      "title": "Le bureau & nos KOLs",
      "subtitle": "Un bureau composé de médecins reconnus, leaders d'opinion sur leurs thématiques.",
      "members": [
        {
          "initials": "AB",
          "name": "Alexis BOURLA",
          "role": "Président"
        },
        {
          "initials": "MT",
          "name": "Minh-Hanh TA",
          "role": "Secrétaire générale"
        },
        {
          "initials": "PH",
          "name": "Piérre HAMANN",
          "role": "Vice-président"
        },
        {
          "initials": "LK",
          "name": "L-A. KLEIN",
          "role": "Vice-président"
        },
        {
          "initials": "CC",
          "name": "C. CHEURFA",
          "role": "Vice-président"
        },
        {
          "initials": "FV",
          "name": "Franck VERDONK",
          "role": "Trésorier"
        },
        {
          "initials": "RB",
          "name": "R. BENDRIHEM",
          "role": "Chargée de mission"
        },
        {
          "initials": "SH",
          "name": "S. HUGAIN",
          "role": "Chargée de mission"
        }
      ],
      "footnote": "→ Plusieurs spécialités représentées : formation, installation, exercice, prises de parole — un crédit renforcé pour vos partenariats."
    }
  },
  {
    "type": "benefits",
    "props": {
      "eyebrow": "02 • L'opportunité",
      "title": "Ce que nous vous apportons",
      "subtitle": "Quatre raisons concrètes de nouer un partenariat pluriannuel avec GM IDF.",
      "benefits": [
        {
          "num": "01",
          "title": "Accès aux KOLs",
          "body": "Connectez-vous aux leaders d'opinion de la médecine francilienne — installation, exercice, innovation, IA, entrepreneuriat.",
          "arrow": "Audience qualifiée et engagée."
        },
        {
          "num": "02",
          "title": "Visibilité ciblée",
          "body": "Atteignez 3 000+ médecins via newsletter, réseaux sociaux, événements présentiels et plateformes digitales.",
          "arrow": "Reach mesurable et reporting détaillé."
        },
        {
          "num": "03",
          "title": "Caution scientifique",
          "body": "Associez votre marque à un acteur médical légitime, indépendant et reconnu — crédibilité auprès des prescripteurs.",
          "arrow": "Image et confiance renforcées."
        },
        {
          "num": "04",
          "title": "ROI mesurable",
          "body": "Reporting trimestriel : impressions newsletter, engagement réseaux, inscriptions événements, replays, conversions.",
          "arrow": "Chiffres concrets, pas de promesses floues."
        }
      ]
    }
  },
  {
    "type": "audience",
    "props": {
      "eyebrow": "02 • L'opportunité",
      "title": "Notre audience en détail",
      "subtitle": "Une communauté médicale francilienne segmentée et activable.",
      "segments": [
        {
          "label": "Médecins généralistes",
          "share": 45,
          "description": "Cœur de cible — installation, exercice, gestion"
        },
        {
          "label": "Spécialistes",
          "share": 35,
          "description": "Toutes spécialités confondues, IDF"
        },
        {
          "label": "Internes & jeunes méd.",
          "share": 15,
          "description": "Futurs prescripteurs et décideurs"
        },
        {
          "label": "Cadres & responsables",
          "share": 5,
          "description": "Directions de centres et structures"
        }
      ],
      "channels": [
        {
          "label": "Newsletter hebdo",
          "value": "3 000+",
          "caption": "destinataires actifs"
        },
        {
          "label": "Réseaux sociaux",
          "value": "6 000+",
          "caption": "abonnés cumulés (Insta/LinkedIn/X/FB)"
        },
        {
          "label": "Base sondages",
          "value": "10 000+",
          "caption": "contacts pour études thématiques"
        },
        {
          "label": "Soirées networking",
          "value": "80–140",
          "caption": "participants qualifiés / an"
        }
      ]
    }
  },
  {
    "type": "pillars",
    "props": {
      "eyebrow": "02 • L'opportunité",
      "title": "Nos 3 piliers d'activation",
      "subtitle": "Trois leviers d'engagement à activer selon vos objectifs partenariat.",
      "pillars": [
        {
          "num": "01",
          "title": "Newsletter hebdomadaire",
          "body": "Informer, fédérer et orienter vers des ressources utiles pour les médecins franciliens.",
          "tags": [
            "3 000+ destinataires",
            "Hebdomadaire"
          ]
        },
        {
          "num": "02",
          "title": "Soirées networking",
          "body": "Rencontres terrain, afterworks thématiques, prises de parole et échanges qualitatifs.",
          "tags": [
            "4 événements / an",
            "20–35 participants"
          ]
        },
        {
          "num": "03",
          "title": "Plateformes & contenus",
          "body": "Positionnement innovant : installation, gestion, IA, outils numériques, formats actionnables.",
          "tags": [
            "Replay & e-learning",
            "Mise à jour continue"
          ]
        }
      ]
    }
  },
  {
    "type": "events",
    "props": {
      "eyebrow": "02 • L'opportunité",
      "title": "Soirées événementielles en présentiel",
      "subtitle": "Partenariat Générations Médecins IDF × Hack Your Care — formats afterwork qualitatifs.",
      "keyFacts": [
        {
          "value": "4",
          "label": "Événements / an",
          "caption": "hors été — format afterwork"
        },
        {
          "value": "20–35",
          "label": "Participants",
          "caption": "cabinets, salles partenaires, locaux HYC"
        },
        {
          "value": "3",
          "label": "Thèmes phares",
          "caption": "innovation, exercice, entrepreneuriat"
        }
      ],
      "program": [
        {
          "time": "19h00",
          "label": "Accueil & verre de bienvenue"
        },
        {
          "time": "19h30",
          "label": "Mots d'introduction"
        },
        {
          "time": "19h40",
          "label": "Intervention / Témoignage / Atelier"
        },
        {
          "time": "20h40",
          "label": "Networking / Cocktail"
        },
        {
          "time": "21h30",
          "label": "Fin"
        }
      ],
      "themes": [
        {
          "title": "Innovation",
          "body": "Médecine & IA, outils au cabinet"
        },
        {
          "title": "Exercice",
          "body": "Centres de santé, s'installer sans s'isoler"
        },
        {
          "title": "Entrepreneuriat",
          "body": "Gestion, finances, développement"
        },
        {
          "title": "Formats",
          "body": "Tables rondes • Interventions • Ateliers pratiques • Intervenant extérieur"
        }
      ]
    }
  },
  {
    "type": "projects",
    "props": {
      "eyebrow": "02 • L'opportunité",
      "title": "Projets 2026 — opportunités partenaires",
      "subtitle": "Une feuille de route 2026 riche, à co-construire avec nos partenaires.",
      "cards": [
        {
          "title": "Soirées networking",
          "tag": "Lancement année",
          "arrow": "Innovation • IA"
        },
        {
          "title": "Baromètre GM IDF",
          "tag": "Sondage stratégique",
          "arrow": "10 000+ contacts"
        },
        {
          "title": "Masterclass Médical",
          "tag": "Événement scientifique",
          "arrow": "Spé identifiée"
        },
        {
          "title": "Demi-journée + soirée",
          "tag": "OCTOBRE 2026",
          "arrow": "Temps fort de l'année"
        }
      ],
      "footnote": "CHAQUE PROJET = UNE OPPORTUNITÉ DE PARTENARIAT DÉDIÉ"
    }
  },
  {
    "type": "partnersGrid",
    "props": {
      "eyebrow": "03 • Visibilité",
      "title": "Ils nous font confiance",
      "subtitle": "Une communauté de partenaires fidèles, qui renouvellent leur engagement année après année.",
      "partners": [
        {
          "name": "Crédit Agricole IDF",
          "tagline": "Partenariat reconduit",
          "body": "Accompagnement bancaire, assurances, solutions pro"
        },
        {
          "name": "Club privé des médecins",
          "tagline": "3 000+ adhérents",
          "body": "Remises exclusives pro & perso"
        },
        {
          "name": "Hack Your Care",
          "tagline": "Co-organisation soirées",
          "body": "Webinaires sur l'innovation médicale"
        },
        {
          "name": "One Gestion & Guillot-Sanchez",
          "tagline": "Partenaires spécialisés",
          "body": "Gestion privée & avocats"
        }
      ],
      "quote": "Nous reconduisons notre partenariat avec GM IDF car nous y trouvons un accès qualifié à la communauté médicale francilienne, un engagement réel des équipes et un suivi rigoureux des actions menées."
    }
  },
  {
    "type": "visibility",
    "props": {
      "eyebrow": "03 • Visibilité",
      "title": "Votre visibilité en action",
      "subtitle": "Quatre points de contact stratégiques pour votre marque, tout au long de l’année.",
      "zones": [
        {
          "kicker": "Newsletter hebdomadaire",
          "label": "GM IDF Newsletter",
          "caption": "3 000+ destinataires actifs — mention ou bannière partenaire"
        },
        {
          "kicker": "Stand événement",
          "label": "Soirées GM IDF / Demi-journée",
          "caption": "Visibilité présentielle directe"
        },
        {
          "kicker": "Réseaux sociaux",
          "label": "Instagram, LinkedIn, X, Facebook",
          "caption": "6 000+ abonnés cumulés"
        },
        {
          "kicker": "Site generations-medecins.fr",
          "label": "Bannière page d'accueil",
          "caption": "Visibilité permanente / SEO"
        }
      ],
      "footnote": "→ Discutons des activations sur-mesure pour votre marque"
    }
  },
  {
    "type": "plan",
    "props": {
      "eyebrow": "04 • Forfaits & investissement",
      "title": "Forfait Bronze",
      "subtitle": "Le forfait d'entrée pour amorcer votre visibilité auprès de notre communauté.",
      "tier": "BRONZE",
      "price": "2 000 €",
      "priceCaption": "HT / an",
      "features": [
        "Logo page Partenaires + supports digitaux",
        "Mention Partenaire dans la newsletter (X semaines)",
        "Post / story de mise en avant sur nos réseaux sociaux",
        "Visibilité sur les supports d'événements GM IDF",
        "Accès à un point de contact dédié"
      ]
    }
  },
  {
    "type": "plan",
    "props": {
      "eyebrow": "04 • Forfaits & investissement",
      "title": "Forfait Argent",
      "subtitle": "Inclut le forfait Bronze + activations média et reporting détaillé.",
      "tier": "ARGENT",
      "price": "5 000 €",
      "priceCaption": "HT / an",
      "features": [
        "✦ Inclut l’intégralité du forfait Bronze",
        "Webinaire co-brandé avec inscriptions et replay",
        "Reporting (inscriptions, replay, clics, engagement)",
        "Diffusion étendue sur tous nos canaux digitaux",
        "Tarifs préférentiels sur les options à la carte"
      ]
    }
  },
  {
    "type": "plan",
    "props": {
      "eyebrow": "04 • Forfaits & investissement",
      "title": "Forfait Or",
      "subtitle": "Inclut Argent + visibilité événementielle premium et co-création de contenu.",
      "tier": "OR",
      "price": "10 000 €",
      "priceCaption": "HT / an",
      "premium": true,
      "features": [
        "✦ Inclut l’intégralité du forfait Argent",
        "Visibilité événement GM IDF (présence physique)",
        "Atelier ou prise de parole sponsor",
        "Contenu co-brandé + diffusion multicanal",
        "Accès KOLs et réunion de pilotage annuelle"
      ]
    }
  },
  {
    "type": "plansCompare",
    "props": {
      "eyebrow": "04 • Forfaits & investissement",
      "title": "Comparatif des 3 forfaits",
      "subtitle": "Une vue d'ensemble pour choisir le niveau adapté à vos objectifs.",
      "tiers": [
        {
          "name": "BRONZE",
          "price": "2 000 €"
        },
        {
          "name": "ARGENT",
          "price": "5 000 €"
        },
        {
          "name": "OR",
          "price": "10 000 €",
          "premium": true
        }
      ],
      "features": [
        "Logo page Partenaires / supports digitaux",
        "Mention dans la newsletter",
        "Post / story de mise en avant",
        "Webinaire co-brandé",
        "Reporting (inscriptions, clics, replay)",
        "Visibilité événement GM IDF",
        "Atelier / prise de parole sponsor",
        "Contenu co-brandé + diffusion"
      ],
      "matrix": [
        [
          true,
          true,
          true
        ],
        [
          true,
          true,
          true
        ],
        [
          true,
          true,
          true
        ],
        [
          false,
          true,
          true
        ],
        [
          false,
          true,
          true
        ],
        [
          false,
          false,
          true
        ],
        [
          false,
          false,
          true
        ],
        [
          false,
          false,
          true
        ]
      ]
    }
  },
  {
    "type": "modules",
    "props": {
      "eyebrow": "04 • Forfaits & investissement",
      "title": "Modules cumulables",
      "subtitle": "Cinq modules composables selon vos objectifs — cumulables entre eux et avec les forfaits.",
      "modules": [
        {
          "name": "Starter-Visibilité",
          "price": "2 000 €",
          "body": "Logo partenaires, mention newsletter, post réseaux sociaux, diffusion infos."
        },
        {
          "name": "Media",
          "price": "5 000 €",
          "body": "Webinaire co-brandé, inscriptions, reporting, replay et post dédiés."
        },
        {
          "name": "Événement GM IDF",
          "price": "5 000 €",
          "body": "Logo programme, stand, inscriptions collaborateurs, insertions, mention scène."
        },
        {
          "name": "Soirée",
          "price": "3 500 €",
          "body": "Inscriptions collaborateurs, logo, présentation/animation, insertions."
        },
        {
          "name": "Expert",
          "price": "4 500 €",
          "body": "Contenu co-brandé, consulting panel, sondage + synthèse complète."
        }
      ],
      "footnote": "→ Modules composables selon vos objectifs — tarifs HT / an."
    }
  },
  {
    "type": "options",
    "props": {
      "eyebrow": "04 • Forfaits & investissement",
      "title": "Options à la carte",
      "subtitle": "Des extensions sur-mesure pour amplifier votre partenariat.",
      "options": [
        {
          "name": "Sponsor soirée networking",
          "body": "Naming, animation, goodies — visibilité maximale auprès des participants qualifiés."
        },
        {
          "name": "Sponsoring Baromètre",
          "body": "Questionnaire + synthèse + publication — accès aux insights du marché médical IDF."
        },
        {
          "name": "Pack multi-événements",
          "body": "Engagement annuel sur l'ensemble des événements — tarif préférentiel et visibilité continue."
        },
        {
          "name": "Sponsoring numéraire",
          "body": "Partenariat financier classique — flexibilité d'allocation selon les actions retenues."
        },
        {
          "name": "Sponsoring en nature",
          "body": "Traiteur, locaux, services — apport en valeur pour les événements GM IDF."
        },
        {
          "name": "Billetterie événement",
          "body": "Co-financement des entrées partenaires — adossement marque à l’événement."
        }
      ],
      "footnote": "→ Tarification de chaque option sur devis personnalisé."
    }
  },
  {
    "type": "charter",
    "props": {
      "eyebrow": "05 • Engagement",
      "title": "Notre charte de partenariat",
      "subtitle": "Une relation transparente, encadrée et bénéfique pour tous.",
      "pillars": [
        {
          "glyph": "§",
          "title": "Éthique & déontologie",
          "body": "Conformité à l’éthique professionnelle, aux réglementations applicables et à la déontologie médicale."
        },
        {
          "glyph": "○",
          "title": "Indépendance",
          "body": "Respect absolu de l’indépendance scientifique et éditoriale de Générations Médecins IDF."
        },
        {
          "glyph": "◆",
          "title": "Transparence",
          "body": "Engagement de transparence sur les actions menées, leurs résultats et le reporting trimestriel."
        },
        {
          "glyph": "✚",
          "title": "Co-création",
          "body": "Co-construction des projets bénéficiant aux médecins, patients et système de santé."
        }
      ]
    }
  },
  {
    "type": "contact",
    "props": {
      "eyebrow": "Contact",
      "title": "Construisons ensemble un partenariat utile et visible.",
      "body": "Échangeons sur vos objectifs et co-construisons l’activation qui vous ressemble.",
      "channels": [
        {
          "glyph": "@",
          "label": "Email",
          "value": "idf@generations-medecins.fr"
        },
        {
          "glyph": "⌂",
          "label": "Site web",
          "value": "generations-medecins.fr"
        },
        {
          "glyph": "▣",
          "label": "Réseaux",
          "value": "Insta • LinkedIn • X • Facebook"
        }
      ],
      "footer": "GÉNÉRATIONS MÉDECINS ÎLE-DE-FRANCE • BOOK PARTENAIRES 2026"
    }
  }
]$book$::jsonb;
  v_count int;
begin
  select id into v_partner_id from public.partners where slug = p_slug;
  if v_partner_id is null then
    raise exception 'No partner with slug %', p_slug;
  end if;

  update public.partner_books
     set slides = v_slides, updated_at = now()
   where partner_id = v_partner_id;

  if not found then
    insert into public.partner_books (partner_id, slides)
    values (v_partner_id, v_slides);
  end if;

  v_count := jsonb_array_length(v_slides);
  return v_count;
end;
$fn$;

revoke all on function public.apply_default_book(text) from public;
-- service_role only — do not grant to anon.
