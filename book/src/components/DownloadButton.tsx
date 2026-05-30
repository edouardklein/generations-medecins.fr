import { useState } from 'react'
import { motion } from 'framer-motion'

type Props = {
  onClick: () => Promise<void>
  fileName: string
}

export default function DownloadButton({ onClick, fileName }: Props) {
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      disabled={busy}
      onClick={async () => {
        setBusy(true)
        setProgress({ current: 0, total: 1 })
        // expose progress hook via custom event so pdfExport can update us
        const handler = (e: Event) => {
          const ce = e as CustomEvent<{ current: number; total: number }>
          setProgress(ce.detail)
        }
        window.addEventListener('gm-book-pdf-progress', handler as EventListener)
        try {
          await onClick()
        } finally {
          window.removeEventListener('gm-book-pdf-progress', handler as EventListener)
          setBusy(false)
          setProgress(null)
        }
      }}
      title={`Télécharger ${fileName}`}
      className="group inline-flex items-center gap-3 rounded-full bg-gold-500 hover:bg-gold-400 disabled:opacity-70 text-navy-950 font-semibold pl-5 pr-5 py-3 shadow-glow transition"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
      <span>
        {busy
          ? progress
            ? `Export… ${progress.current}/${progress.total}`
            : 'Préparation…'
          : 'Télécharger en PDF'}
      </span>
    </motion.button>
  )
}
