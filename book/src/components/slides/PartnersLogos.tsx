import { motion } from 'framer-motion'
import type { PartnersLogosProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

const norm = (s: string | undefined | null) =>
  (s ?? '').normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim()

export default function PartnersLogos(props: PartnersLogosProps) {
  const target = norm(props.highlightName)
  const others = target ? props.partners.filter((p) => norm(p.name) !== target) : props.partners
  const highlighted = target ? props.partners.find((p) => norm(p.name) === target) : undefined

  if (typeof window !== 'undefined') {
    // Help diagnose mismatches between Supabase partner.name and the slide JSON.
    console.info(
      `[gm-book] PartnersLogos: highlight="${props.highlightName}" → ${
        highlighted ? `found "${highlighted.name}"` : 'NO MATCH (logo will stay in main grid)'
      }`,
    )
  }

  // Layout the OTHER partners in a clean grid, leaving the last visual slot
  // for the highlighted "VOUS" card. We pick a 4-column grid so 9 others fit
  // in 3 rows minus the last slot, then the spotlight takes that last slot.
  const cols = 4
  const slotsForOthers = others.length

  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? '04 • Nos partenaires'}</div>
      <h2 className="h-display text-[58px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[17px] text-navy-200 max-w-[1000px]">{props.subtitle}</p>}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-8 grid gap-5 flex-1 min-h-0"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {others.map((p, i) => (
          <motion.div
            key={p.name}
            custom={i}
            variants={fadeUp}
            className="relative rounded-2xl bg-white border border-white/10 p-5 flex items-center justify-center aspect-[5/3] overflow-hidden hover:-translate-y-1 transition"
          >
            <img
              src={p.logo}
              alt={p.name}
              className="max-h-[78%] max-w-[78%] object-contain"
              draggable={false}
            />
          </motion.div>
        ))}

        {highlighted && (
          <motion.div
            custom={slotsForOthers}
            variants={fadeUp}
            whileHover={{ scale: 1.04 }}
            className="relative rounded-2xl bg-white p-5 flex items-center justify-center aspect-[5/3] overflow-visible"
            style={{
              boxShadow:
                '0 0 0 3px rgba(196,149,61,0.85), 0 0 0 8px rgba(196,149,61,0.2), 0 30px 100px -10px rgba(196,149,61,0.7), 0 0 120px 0 rgba(196,149,61,0.55)',
            }}
          >
            {/* Dashed inner border to scream "this is YOUR slot" */}
            <span
              className="absolute inset-2 rounded-xl pointer-events-none"
              style={{
                border: '2px dashed rgba(196,149,61,0.8)',
              }}
            />

            {/* Strong pulsing halo */}
            <motion.span
              className="absolute -inset-6 rounded-3xl pointer-events-none"
              animate={{ opacity: [0.35, 0.9, 0.35], scale: [1, 1.04, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background:
                  'radial-gradient(circle at center, rgba(196,149,61,0.45), transparent 65%)',
              }}
            />

            <img
              src={highlighted.logo}
              alt={highlighted.name}
              className="max-h-[72%] max-w-[72%] object-contain relative z-10"
              draggable={false}
            />

            {/* HUGE "?" pastille top-right */}
            <motion.span
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-5 -right-5 w-16 h-16 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center text-4xl font-bold z-20 shadow-glow"
              style={{ boxShadow: '0 10px 30px -5px rgba(196,149,61,0.8)' }}
            >
              ?
            </motion.span>

            {/* "VOUS" tag bottom */}
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.4em] uppercase text-navy-950 bg-gold-500 px-4 py-1 rounded-full font-semibold z-20">
              Vous
            </span>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
