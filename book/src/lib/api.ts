import { supabase } from './supabase'
import type { Book, BookEnvelope, PublicPartner } from './types'
import { defaultBook } from '../data/defaultBook'
import { demoPartners } from '../data/demoPartners'

export async function listPartners(): Promise<PublicPartner[]> {
  if (!supabase) {
    console.info('[gm-book] Supabase not configured — using demo partners')
    return demoPartners
  }
  try {
    const { data, error } = await supabase.rpc('list_active_partners')
    if (error) {
      console.warn('[gm-book] list_active_partners RPC error, falling back to demo:', error.message)
      return demoPartners
    }
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('[gm-book] Supabase returned 0 partners — falling back to demo data')
      return demoPartners
    }
    return data as PublicPartner[]
  } catch (e) {
    console.error('[gm-book] Supabase request threw — falling back to demo:', e)
    return demoPartners
  }
}

export async function unlockBook(
  slug: string,
  password: string,
): Promise<BookEnvelope | { error: 'invalid' | 'network' }> {
  const demoUnlock = (): BookEnvelope | { error: 'invalid' } => {
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

  if (!supabase) return demoUnlock()

  try {
    const { data, error } = await supabase.rpc('verify_partner_book', {
      p_slug: slug,
      p_password: password,
    })
    if (error) {
      console.error('[gm-book] verify_partner_book error', error)
      // If the RPC is missing entirely (schema not migrated yet),
      // let the demo path serve so the user can still test the flow.
      if (error.code === 'PGRST202' || /function .*verify_partner_book/i.test(error.message ?? '')) {
        console.warn('[gm-book] RPC missing — using demo unlock')
        return demoUnlock()
      }
      return { error: 'network' }
    }
    if (!data) return { error: 'invalid' }
    return data as BookEnvelope
  } catch (e) {
    console.error('[gm-book] Supabase unlock threw', e)
    return { error: 'network' }
  }
}
