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
        className="mt-10 grid grid-cols-3 gap-6 flex-1"
      >
        {props.pillars.map((p, i) => (
          <motion.div
            key={p.num}
            custom={i}
            variants={fadeUp}
            className="group relative flex flex-col rounded-2xl bg-white/[0.03] border border-white/5 p-8 overflow-hidden hover:-translate-y-2 transition duration-500"
          >
            {/* Big number watermark */}
            <div className="absolute -bottom-6 -right-2 h-display text-[160px] leading-none text-white/[0.04] select-none">
              {p.num}
            </div>

            <div className="text-[14px] tracking-[0.22em] uppercase text-gold-500">{p.num}</div>
            <div className="mt-3 h-display text-[30px] leading-tight text-white">{p.title}</div>
            <p className="mt-4 text-[15px] text-navy-200 leading-relaxed flex-1">{p.body}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="text-[12px] px-3 py-1 rounded-full border border-gold-500/40 text-gold-400 bg-gold-500/5"
                >
                  → {t}
                </span>
              ))}
            </div>

            <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-0 group-hover:opacity-100 transition" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
