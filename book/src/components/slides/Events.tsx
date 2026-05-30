import { motion } from 'framer-motion'
import type { EventsProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function Events(props: EventsProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? "02 • L'opportunité"}</div>
      <h2 className="h-display text-[52px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[17px] text-navy-200 max-w-[1000px]">{props.subtitle}</p>}

      <div className="mt-8 grid grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Key facts */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
          variants={stagger}
          className="rounded-2xl bg-white/[0.04] border border-white/5 p-7 flex flex-col"
        >
          <div className="text-[12px] tracking-[0.3em] uppercase text-gold-500">Infos clés</div>
          <div className="mt-5 space-y-7 flex-1 flex flex-col justify-around">
            {props.keyFacts.map((k, i) => (
              <motion.div key={k.label} custom={i} variants={fadeUp}>
                <div className="h-display text-[68px] leading-none text-white">{k.value}</div>
                <div className="mt-2 text-[14px] uppercase tracking-widest text-accent-soft">{k.label}</div>
                {k.caption && <div className="mt-1 text-[15px] text-navy-200 leading-snug">{k.caption}</div>}
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
          className="rounded-2xl bg-white/[0.04] border border-white/5 p-7 flex flex-col"
        >
          <div className="text-[12px] tracking-[0.3em] uppercase text-gold-500">Programme type</div>
          <div className="mt-1 text-[18px] text-white">Une soirée GM IDF</div>
          <ol className="mt-6 relative border-l-2 border-white/10 pl-6 space-y-5 flex-1">
            {props.program.map((step, i) => (
              <motion.li key={step.time} custom={i} variants={fadeUp} className="relative">
                <span className="absolute -left-[34px] top-2 w-4 h-4 rounded-full bg-gold-500 ring-4 ring-gold-500/15" />
                <div className="text-[20px] font-semibold text-white tabular-nums leading-none">{step.time}</div>
                <div className="text-[15px] text-navy-100 mt-1 leading-snug">{step.label}</div>
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
          className="rounded-2xl bg-white/[0.04] border border-white/5 p-7 flex flex-col"
        >
          <div className="text-[12px] tracking-[0.3em] uppercase text-gold-500">Thèmes & formats</div>
          <div className="mt-5 space-y-3 flex-1 flex flex-col justify-around">
            {props.themes.map((t, i) => (
              <motion.div
                key={t.title}
                custom={i}
                variants={fadeUp}
                className="rounded-xl border border-white/5 bg-navy-800/40 p-4"
              >
                <div className="text-[13px] uppercase tracking-widest text-accent-soft">{t.title}</div>
                <div className="mt-1.5 text-[16px] text-white leading-snug">{t.body}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
