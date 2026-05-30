import { motion } from 'framer-motion'
import type { PartnersLogosProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function PartnersLogos(props: PartnersLogosProps) {
  const target = props.highlightName?.toLowerCase().trim()
  // Move the highlighted partner to the very end so they sit in the
  // "spotlight" slot. Others keep their original order.
  const others = props.partners.filter((p) => p.name.toLowerCase().trim() !== target)
  const highlighted = props.partners.find((p) => p.name.toLowerCase().trim() === target)

  // Decide column count from total visible tiles (others + spotlight).
  const total = others.length + (highlighted ? 1 : 0)
  const cols = total > 9 ? 5 : total > 6 ? 4 : 3

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
        className="mt-9 grid gap-5 flex-1 min-h-0"
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
            custom={others.length}
            variants={fadeUp}
            whileHover={{ scale: 1.03 }}
            className="relative rounded-2xl bg-white border-2 border-dashed border-gold-500 p-5 flex items-center justify-center aspect-[5/3] overflow-hidden"
            style={{
              boxShadow:
                '0 0 0 1px rgba(196,149,61,0.4), 0 30px 80px -20px rgba(196,149,61,0.55), 0 0 80px -10px rgba(196,149,61,0.65)',
            }}
          >
            {/* Pulsing gold halo */}
            <motion.span
              className="absolute inset-0 rounded-2xl pointer-events-none"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background:
                  'radial-gradient(circle at center, rgba(196,149,61,0.25), transparent 65%)',
              }}
            />

            <img
              src={highlighted.logo}
              alt={highlighted.name}
              className="max-h-[78%] max-w-[78%] object-contain relative z-10"
              draggable={false}
            />

            {/* "?" pastille top-right — "votre place, prête à briller" */}
            <span className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center text-xl font-bold shadow-glow z-20">
              ?
            </span>

            {/* "VOUS" label bottom */}
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.4em] uppercase text-gold-600 bg-white px-3 py-0.5 rounded-full border border-gold-500/40 z-20">
              Vous
            </span>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
