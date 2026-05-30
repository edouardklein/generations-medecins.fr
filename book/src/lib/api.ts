import { supabase } from './supabase'
import type { Book, BookEnvelope, PublicPartner } from './types'
import { defaultBook } from '../data/defaultBook'
import { demoPartners } from '../data/demoPartners'

export async function listPartners(): Promise<PublicPartner[]> {
  if (!supabase) return demoPartners
  const { data, error } = await supabase.rpc('list_active_partners')
  if (error || !data) {
    console.warn('list_active_partners failed, falling back to demo data', error)
    return demoPartners
  }
  return data as PublicPartner[]
}

export async function unlockBook(
  slug: string,
  password: string,
): Promise<BookEnvelope | { error: 'invalid' | 'network' }> {
  if (!supabase) {
    // Demo mode: any password "demo" unlocks the demo book
    const partner = demoPartners.find((p) => p.slug === slug) ?? null
    if (password === 'demo') {
      const book: Book = {
        ...defaultBook,
        partnerName: partner?.name,
        partnerLogoUrl: partner?.logo_url,
      }
      return { book, partner }
    }
    return { error: 'invalid' }
  }

  const { data, error } = await supabase.rpc('verify_partner_book', {
    p_slug: slug,
    p_password: password,
  })

  if (error) {
    console.error(error)
    return { error: 'network' }
  }
  if (!data) return { error: 'invalid' }
  return data as BookEnvelope
}
