import { motion } from 'framer-motion'
import type { EventsProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function Events(props: EventsProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? "02 • L'opportunité"}</div>
      <h2 className="h-display text-[54px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[17px] text-navy-200 max-w-[900px]">{props.subtitle}</p>}

      <div className="mt-8 grid grid-cols-3 gap-6 flex-1">
        {/* Key facts */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
          variants={stagger}
          className="rounded-2xl bg-white/[0.03] border border-white/5 p-6"
        >
          <div className="text-[11px] tracking-[0.3em] uppercase text-gold-500">Infos clés</div>
          <div className="mt-4 space-y-5">
            {props.keyFacts.map((k, i) => (
              <motion.div key={k.label} custom={i} variants={fadeUp}>
                <div className="h-display text-[44px] leading-none text-white">{k.value}</div>
                <div className="mt-1 text-[12px] uppercase tracking-widest text-accent-soft">{k.label}</div>
                {k.caption && <div className="mt-1 text-[13px] text-navy-200">{k.caption}</div>}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Program */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
          variants={stagger}
          className="rounded-2xl bg-white/[0.03] border border-white/5 p-6"
        >
          <div className="text-[11px] tracking-[0.3em] uppercase text-gold-500">Programme type</div>
          <div className="mt-1 text-[16px] text-white">Une soirée GM IDF</div>
          <ol className="mt-4 relative border-l border-white/10 pl-5 space-y-3">
            {props.program.map((step, i) => (
              <motion.li key={step.time} custom={i} variants={fadeUp} className="relative">
                <span className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-gold-500 ring-4 ring-gold-500/15" />
                <div className="text-[14px] font-semibold text-white tabular-nums">{step.time}</div>
                <div className="text-[13px] text-navy-200">{step.label}</div>
              </motion.li>
            ))}
          </ol>
        </motion.div>

        {/* Themes */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
          variants={stagger}
          className="rounded-2xl bg-white/[0.03] border border-white/5 p-6 space-y-4"
        >
          <div className="text-[11px] tracking-[0.3em] uppercase text-gold-500">Thèmes & formats</div>
          {props.themes.map((t, i) => (
            <motion.div key={t.title} custom={i} variants={fadeUp} className="rounded-xl border border-white/5 bg-navy-800/40 p-4">
              <div className="text-[11px] uppercase tracking-widest text-accent-soft">{t.title}</div>
              <div className="mt-1 text-[14px] text-white">{t.body}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
