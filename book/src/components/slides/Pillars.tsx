import { motion } from 'framer-motion'
import type { PillarsProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function Pillars(props: PillarsProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? "02 • L'opportunité"}</div>
      <h2 className="h-display text-[58px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[18px] text-navy-200 max-w-[820px]">{props.subtitle}</p>}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-8 grid grid-cols-3 gap-6 flex-1 min-h-0"
      >
        {props.pillars.map((p, i) => (
          <motion.div
            key={p.num}
            custom={i}
            variants={fadeUp}
            className="group relative flex flex-col rounded-2xl bg-white/[0.04] border border-white/5 p-8 overflow-hidden hover:-translate-y-2 transition duration-500"
          >
            {/* Big number watermark */}
            <div className="absolute -bottom-8 -right-4 h-display text-[200px] leading-none text-white/[0.05] select-none">
              {p.num}
            </div>

            <div className="text-[14px] tracking-[0.22em] uppercase text-gold-500">{p.num}</div>
            <div className="mt-3 h-display text-[34px] leading-tight text-white">{p.title}</div>
            <p className="mt-5 text-[18px] text-white/90 leading-relaxed flex-1 relative z-10">{p.body}</p>

            {p.tags && p.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2 relative z-10">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[13px] px-3 py-1.5 rounded-full border border-gold-500/40 text-gold-400 bg-gold-500/5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-0 group-hover:opacity-100 transition" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
