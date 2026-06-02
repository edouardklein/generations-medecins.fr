import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

type Credential = {
  slug: string
  name: string
  logo_url: string
  password_plain: string
  display_order: number
}

export default function AdminVault({ onClose }: { onClose: () => void }) {
  const [pin, setPin] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [creds, setCreds] = useState<Credential[] | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function submit() {
    if (!pin) return
    setSubmitting(true)
    setError(null)
    try {
      if (!supabase) {
        setError('Supabase non configuré — coffre indisponible en mode démo.')
        return
      }
      const { data, error: e } = await supabase.rpc('admin_list_credentials', { p_pin: pin })
      if (e) {
        setError(e.message)
        return
      }
      if (!data || (Array.isArray(data) && data.length === 0)) {
        setError('PIN incorrect.')
        return
      }
      setCreds(data as Credential[])
    } finally {
      setSubmitting(false)
    }
  }

  function copy(value: string, label: string) {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(label)
        setTimeout(() => setCopied(null), 1200)
      })
      .catch(() => {
        /* ignore */
      })
  }

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-navy-950/85 backdrop-blur-md flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[80vh] flex flex-col rounded-2xl border border-white/10 bg-navy-900/95 shadow-slide overflow-hidden"
        >
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-3 right-3 w-9 h-9 rounded-full text-navy-200 hover:bg-white/5 z-10"
          >
            ✕
          </button>

          {!creds ? (
            <div className="p-8">
              <div className="eyebrow">Console admin</div>
              <h2 className="h-display text-2xl mt-2 text-white">Coffre des mots de passe</h2>
              <p className="text-navy-200 text-sm mt-2">
                Saisissez le PIN admin pour accéder à la liste des mots de passe de tous les partenaires.
              </p>
              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!submitting) submit()
                }}
              >
                <div>
                  <label className="text-xs uppercase tracking-widest text-navy-300">PIN admin</label>
                  <input
                    ref={inputRef}
                    type="password"
                    inputMode="numeric"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    autoComplete="off"
                    className="mt-2 w-full rounded-lg bg-navy-800/80 border border-white/10 px-4 py-3 text-white placeholder:text-navy-300 focus:outline-none focus:ring-2 focus:ring-gold-500/60 tracking-[0.4em] text-lg"
                    placeholder="••••"
                  />
                </div>
                {error && (
                  <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting || !pin}
                  className="w-full rounded-lg bg-gold-500 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed text-navy-950 font-semibold py-3 transition"
                >
                  {submitting ? 'Vérification…' : 'Déverrouiller'}
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="px-8 pt-7 pb-4 border-b border-white/5">
                <div className="eyebrow">Console admin</div>
                <h2 className="h-display text-2xl mt-2 text-white">
                  Mots de passe partenaires
                </h2>
                <p className="text-[13px] text-navy-200 mt-1">
                  {creds.length} partenaires actifs. Clic sur une ligne pour copier.
                </p>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-3">
                <ul className="space-y-1.5">
                  {creds.map((c) => (
                    <li
                      key={c.slug}
                      className="group flex items-center gap-3 rounded-xl px-4 py-3 border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] transition cursor-pointer"
                      onClick={() => copy(c.password_plain, c.slug)}
                      title="Copier le mot de passe"
                    >
                      <div className="flex-none w-9 h-9 rounded bg-white grid place-items-center overflow-hidden">
                        <img
                          src={c.logo_url}
                          alt=""
                          className="max-w-[80%] max-h-[80%] object-contain"
                          draggable={false}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] text-white font-medium truncate">{c.name}</div>
                        <div className="text-[11px] text-navy-300 truncate">{c.slug}</div>
                      </div>
                      <code
                        className={`text-[13px] font-mono px-3 py-1.5 rounded-md border border-white/10 ${
                          c.password_plain.startsWith('—')
                            ? 'text-navy-300 bg-white/[0.02]'
                            : 'text-gold-300 bg-gold-500/10'
                        }`}
                      >
                        {c.password_plain}
                      </code>
                      <span className="text-[11px] w-14 text-right">
                        {copied === c.slug ? (
                          <span className="text-green-400">Copié!</span>
                        ) : (
                          <span className="text-navy-400 opacity-0 group-hover:opacity-100 transition">
                            Copier →
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-6 py-3 border-t border-white/5 text-[11px] text-navy-300 text-center">
                Ferme cette fenêtre quand tu as fini.
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
