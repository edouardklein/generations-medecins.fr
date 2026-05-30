import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LogoGrid from '../components/LogoGrid'
import PasswordGate from '../components/PasswordGate'
import { listPartners, unlockBook } from '../lib/api'
import type { BookEnvelope, PublicPartner } from '../lib/types'

export default function LandingPage() {
  const navigate = useNavigate()
  const [partners, setPartners] = useState<PublicPartner[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<PublicPartner | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    listPartners().then((rows) => {
      setPartners(rows)
      setLoading(false)
    })
  }, [])

  async function handleUnlock(password: string) {
    if (!active) return
    setSubmitting(true)
    setError(null)
    const result = await unlockBook(active.slug, password)
    setSubmitting(false)
    if ('error' in result) {
      setError(result.error === 'invalid' ? 'Mot de passe incorrect.' : 'Erreur réseau, réessayez.')
      return
    }
    sessionStorage.setItem(`gm-book:${active.slug}`, JSON.stringify(result satisfies BookEnvelope))
    navigate(`/p/${active.slug}`)
  }

  return (
    <main className="min-h-screen flex flex-col">
      <header className="px-8 pt-10 pb-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-baseline justify-between"
        >
          <div>
            <div className="eyebrow">Partenariat • 2026</div>
            <h1 className="h-display text-3xl md:text-5xl mt-3 text-white leading-tight">
              Générations Médecins <span className="text-gold-500">Île-de-France</span>
            </h1>
            <p className="mt-3 text-navy-200 max-w-xl">
              Espace partenaires — sélectionnez votre logo pour accéder à votre book sur-mesure.
            </p>
          </div>
          <div className="hidden md:block text-right text-navy-300 text-sm">
            <div>BOOK PARTENAIRES</div>
            <div className="text-gold-500 tracking-widest">ÉDITION 2026</div>
          </div>
        </motion.div>
      </header>

      <section className="flex-1 px-6 md:px-16 py-12">
        <LogoGrid
          partners={partners}
          loading={loading}
          onPick={(p) => {
            setError(null)
            setActive(p)
          }}
        />
      </section>

      <footer className="px-8 md:px-16 py-6 text-navy-300 text-xs flex items-center justify-between border-t border-white/5">
        <div>© Générations Médecins IDF — Espace partenaires</div>
        <div className="opacity-70">Accès réservé aux partenaires invités</div>
      </footer>

      {active && (
        <PasswordGate
          partner={active}
          onClose={() => {
            setActive(null)
            setError(null)
          }}
          onSubmit={handleUnlock}
          submitting={submitting}
          error={error}
        />
      )}
    </main>
  )
}
