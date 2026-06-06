import { motion } from 'framer-motion'
import type { CharterProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function Charter(props: CharterProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? '05 • Engagement'}</div>
      <h2 className="h-display text-[58px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[17px] text-navy-200 max-w-[820px]">{props.subtitle}</p>}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-10 grid grid-cols-2 gap-6 flex-1"
      >
        {props.pillars.map((p, i) => (
          <motion.div
            key={p.title}
            custom={i}
            variants={fadeUp}
            className="group relative rounded-2xl bg-white/[0.04] border border-white/5 p-7 flex gap-6 items-start hover:bg-white/[0.08] transition"
          >
            <div className="flex-none w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-500 text-3xl">
              {p.glyph}
            </div>
            <div>
              <div className="text-[22px] font-semibold text-white">{p.title}</div>
              <p className="mt-2 text-[15px] text-navy-200 leading-relaxed">{p.body}</p>
            </div>
            <span className="absolute inset-y-3 right-0 w-[3px] rounded-l-full bg-gradient-to-b from-gold-500 to-accent opacity-0 group-hover:opacity-100 transition" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
