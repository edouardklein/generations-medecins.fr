import { motion } from 'framer-motion'
import type { ProjectsProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function Projects(props: ProjectsProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? "02 • L'opportunité"}</div>
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
        {props.cards.map((c, i) => (
          <motion.div
            key={c.title}
            custom={i}
            variants={fadeUp}
            className="group relative rounded-2xl bg-white/[0.04] border border-white/5 p-7 hover:bg-white/[0.08] transition overflow-hidden"
            whileHover={{ rotate: -0.3, scale: 1.01 }}
          >
            <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-gold-500 to-accent" />
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-[12px] uppercase tracking-[0.3em] text-gold-500">{c.tag}</div>
                <div className="mt-2 h-display text-[32px] leading-tight text-white">{c.title}</div>
              </div>
              <div className="text-[13px] tracking-widest text-accent-soft mt-1 whitespace-nowrap">→ {c.arrow}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {props.footnote && (
        <div className="mt-6 self-start inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/40">
          <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
          <span className="text-[13px] tracking-widest text-gold-400">→ {props.footnote}</span>
        </div>
      )}
    </div>
  )
}
