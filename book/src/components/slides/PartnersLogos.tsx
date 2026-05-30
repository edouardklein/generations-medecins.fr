import { motion } from 'framer-motion'
import type { PartnersLogosProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function PartnersLogos(props: PartnersLogosProps) {
  const items = props.partners
  const cols = items.length + (props.inviteSlot ? 1 : 0) > 8 ? 6 : 5

  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? '03 • Nos partenaires'}</div>
      <h2 className="h-display text-[58px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[17px] text-navy-200 max-w-[860px]">{props.subtitle}</p>}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-9 grid gap-5 flex-1 min-h-0"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {items.map((p, i) => {
          const highlighted =
            props.highlightName &&
            p.name.toLowerCase() === props.highlightName.toLowerCase()
          return (
            <motion.div
              key={p.name}
              custom={i}
              variants={fadeUp}
              className={`relative rounded-2xl bg-white border border-white/10 p-5 flex items-center justify-center aspect-[5/3] overflow-hidden ${
                highlighted ? 'shadow-glow' : ''
              }`}
              style={
                highlighted
                  ? {
                      boxShadow:
                        '0 0 0 2px rgba(196,149,61,0.6), 0 30px 60px -20px rgba(196,149,61,0.45), 0 0 60px -10px rgba(196,149,61,0.55)',
                    }
                  : undefined
              }
            >
              {highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-navy-950 bg-gold-500 px-3 py-0.5 rounded-full">
                  VOUS
                </span>
              )}
              <img
                src={p.logo}
                alt={p.name}
                className="max-h-[78%] max-w-[78%] object-contain"
                draggable={false}
              />
              {highlighted && (
                <motion.span
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  animate={{ opacity: [0.35, 0.65, 0.35] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    background:
                      'radial-gradient(circle at center, rgba(196,149,61,0.18), transparent 65%)',
                  }}
                />
              )}
            </motion.div>
          )
        })}

        {props.inviteSlot && (
          <motion.div
            custom={items.length}
            variants={fadeUp}
            whileHover={{ scale: 1.03, rotate: -1 }}
            className="relative rounded-2xl bg-gradient-to-br from-gold-500/15 to-accent/10 border-2 border-dashed border-gold-500/50 p-5 flex flex-col items-center justify-center aspect-[5/3] text-center group"
          >
            <div className="h-display text-[64px] leading-none text-gold-500 group-hover:scale-110 transition">
              ?
            </div>
            <div className="mt-2 text-[12px] tracking-[0.2em] uppercase text-gold-400">
              {props.inviteText ?? 'Votre place ici'}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
