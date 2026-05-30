import type { PublicPartner } from '../lib/types'

// Used when Supabase is not configured (local preview / demo).
// Password for every demo partner is "demo".
export const demoPartners: PublicPartner[] = [
  { id: '1', slug: 'partenaire-arches', name: 'Partenaire Arches', logo_url: '/logos/sample-arches.svg', display_order: 1 },
  { id: '2', slug: 'hack-your-care', name: 'Hack Your Care', logo_url: '/logos/placeholder-2.svg', display_order: 2 },
  { id: '3', slug: 'one-gestion', name: 'One Gestion', logo_url: '/logos/placeholder-3.svg', display_order: 3 },
  { id: '4', slug: 'guillot-sanchez', name: 'Guillot-Sanchez', logo_url: '/logos/placeholder-4.svg', display_order: 4 },
  { id: '5', slug: 'club-prive', name: 'Club privé des médecins', logo_url: '/logos/placeholder-5.svg', display_order: 5 },
  { id: '6', slug: 'partenaire-6', name: 'Partenaire 6', logo_url: '/logos/placeholder-6.svg', display_order: 6 },
  { id: '7', slug: 'partenaire-7', name: 'Partenaire 7', logo_url: '/logos/placeholder-7.svg', display_order: 7 },
  { id: '8', slug: 'partenaire-8', name: 'Partenaire 8', logo_url: '/logos/placeholder-8.svg', display_order: 8 },
]
