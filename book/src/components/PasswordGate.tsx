import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { PublicPartner } from '../lib/types'

type Props = {
  partner: PublicPartner
  onClose: () => void
  onSubmit: (password: string) => void
  submitting: boolean
  error: string | null
}

export default function PasswordGate({ partner, onClose, onSubmit, submitting, error }: Props) {
  const [password, setPassword] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80)
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-2xl border border-white/10 bg-navy-900/95 p-8 shadow-slide"
        >
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-3 right-3 w-9 h-9 rounded-full text-navy-200 hover:bg-white/5"
          >
            ✕
          </button>

          <div className="eyebrow">Espace partenaire</div>
          <h2 className="h-display text-2xl mt-2 text-white">{partner.name}</h2>
          <p className="text-navy-200 text-sm mt-2">
            Saisissez votre mot de passe pour accéder à votre book personnalisé.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (!submitting && password) onSubmit(password)
            }}
          >
            <div>
              <label className="text-xs uppercase tracking-widest text-navy-300">Mot de passe</label>
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="mt-2 w-full rounded-lg bg-navy-800/80 border border-white/10 px-4 py-3 text-white placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-gold-500/60"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting || !password}
              className="w-full rounded-lg bg-gold-500 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed text-navy-950 font-semibold py-3 transition"
            >
              {submitting ? 'Vérification…' : 'Accéder au book'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
