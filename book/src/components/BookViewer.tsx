import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SlideFrame from './SlideFrame'
import SlideViewport from './SlideViewport'
import DownloadButton from './DownloadButton'
import { renderSlide } from './slides/registry'
import { exportBookToPdf } from '../lib/pdfExport'
import type { BookEnvelope } from '../lib/types'

type Props = { envelope: BookEnvelope }

export default function BookViewer({ envelope }: Props) {
  const { book, partner } = envelope
  const navigate = useNavigate()
  const slideRefs = useRef<Array<HTMLDivElement | null>>([])
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [current, setCurrent] = useState(0)

  const hasSlides = Array.isArray(book.slides) && book.slides.length > 0

  const slideVariants = useMemo(
    () => book.slides.map(() => 'dark') as Array<'dark' | 'light'>,
    [book.slides],
  )

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const onScroll = () => {
      const hosts = scroller.querySelectorAll<HTMLDivElement>('.book-slide-host')
      const center = scroller.scrollTop + scroller.clientHeight / 2
      let best = 0
      let bestDist = Infinity
      hosts.forEach((h, i) => {
        const mid = h.offsetTop + h.offsetHeight / 2
        const d = Math.abs(mid - center)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      setCurrent(best)
    }
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [])

  function jumpTo(i: number) {
    const host = scrollerRef.current?.querySelectorAll<HTMLDivElement>('.book-slide-host')[i]
    host?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  async function handleExport() {
    const nodes = slideRefs.current.filter(Boolean) as HTMLElement[]
    const fileName = `${(partner?.slug ?? 'gm-idf')}-book-2026.pdf`
    document.documentElement.classList.add('capture-mode')
    try {
      await exportBookToPdf({
        slides: nodes,
        fileName,
        onProgress: (current, total) =>
          window.dispatchEvent(
            new CustomEvent('gm-book-pdf-progress', { detail: { current, total } }),
          ),
      })
    } finally {
      document.documentElement.classList.remove('capture-mode')
    }
  }

  const total = book.slides.length

  if (!hasSlides) {
    return <ComingSoon partnerName={partner?.name} onBack={() => navigate('/')} />
  }

  return (
    <div className="relative min-h-screen">
      {/* Top bar */}
      <div className="fixed top-4 left-4 right-4 z-30 flex items-center justify-between gap-3 pointer-events-none">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-navy-900/70 backdrop-blur border border-white/10 px-4 py-2 text-sm text-navy-100 hover:bg-navy-800"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Espace partenaires
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-auto hidden md:flex items-center gap-3 rounded-full bg-navy-900/70 backdrop-blur border border-white/10 px-4 py-2 text-xs text-navy-200"
        >
          {partner?.name && (
            <>
              <span className="text-gold-400">●</span>
              <span className="font-medium text-white">{partner.name}</span>
              <span className="text-navy-300">•</span>
            </>
          )}
          <span>
            {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </motion.div>

        <div className="pointer-events-auto">
          <DownloadButton onClick={handleExport} fileName="book.pdf" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-40 bg-navy-900/40">
        <motion.div
          className="h-full bg-gold-500"
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 22 }}
        />
      </div>

      {/* Slide vertical dots */}
      <nav className="fixed right-3 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-2">
        {book.slides.map((_, i) => (
          <button
            key={i}
            onClick={() => jumpTo(i)}
            aria-label={`Aller à la slide ${i + 1}`}
            className={`block transition-all ${
              i === current
                ? 'w-2.5 h-6 bg-gold-500 rounded-full'
                : 'w-2.5 h-2.5 bg-navy-300/40 rounded-full hover:bg-navy-200/70'
            }`}
          />
        ))}
      </nav>

      {/* Scroller */}
      <div ref={scrollerRef} className="book-scroller">
        {book.slides.map((s, i) => (
          <div className="book-slide-host" key={i}>
            <SlideViewport>
              <SlideFrame
                ref={(el) => {
                  slideRefs.current[i] = el
                }}
                variant={slideVariants[i]}
                index={i}
                total={total}
              >
                {renderSlide(s, { partnerLogoUrl: book.partnerLogoUrl, partnerName: book.partnerName })}
              </SlideFrame>
            </SlideViewport>
          </div>
        ))}
      </div>
    </div>
  )
}

function ComingSoon({ partnerName, onBack }: { partnerName?: string | null; onBack: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-xl text-center rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur p-12"
      >
        <div className="eyebrow justify-center">Espace partenaire</div>
        <h1 className="h-display text-4xl mt-3 text-white">
          {partnerName ?? 'Votre book'}
        </h1>
        <div className="gold-bar mx-auto mt-4" />
        <p className="mt-6 text-navy-200 leading-relaxed">
          Votre book partenaire est en cours de préparation. Nous vous l'enverrons dès qu'il sera prêt.
          En attendant, l'équipe Générations Médecins IDF reste à votre disposition pour tout échange.
        </p>
        <div className="mt-8 inline-flex items-center gap-3 text-sm text-navy-200">
          <span className="text-gold-400">@</span>
          <a href="mailto:idf@generations-medecins.fr" className="hover:text-white transition">
            idf@generations-medecins.fr
          </a>
        </div>
        <div className="mt-10">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full bg-navy-900/70 border border-white/10 px-5 py-2.5 text-sm text-navy-100 hover:bg-navy-800 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Retour
          </button>
        </div>
      </motion.div>
    </div>
  )
}
