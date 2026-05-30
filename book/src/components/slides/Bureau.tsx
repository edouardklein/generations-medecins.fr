import { motion } from 'framer-motion'
import type { BureauProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function Bureau(props: BureauProps) {
  const big = props.members.filter((m) => !m.small)
  const small = props.members.filter((m) => m.small)

  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? '01 • Qui sommes-nous'}</div>
      <h2 className="h-display text-[54px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[16px] text-navy-200 max-w-[920px]">{props.subtitle}</p>}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-6 grid grid-cols-3 gap-4 flex-1 min-h-0"
      >
        {big.map((m, i) => (
          <motion.div
            key={m.name}
            custom={i}
            variants={fadeUp}
            className="group relative rounded-2xl bg-white/[0.04] border border-white/5 p-5 hover:bg-white/[0.07] transition flex flex-col"
          >
            <div className="flex items-start gap-4">
              <div
                className="relative flex-none w-16 h-16 rounded-full flex items-center justify-center ring-1 ring-gold-500/30"
                style={{ background: 'linear-gradient(135deg,#1a2e54,#0a1730)' }}
              >
                <div className="h-display text-[22px] text-gold-500">{m.initials}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[18px] font-semibold text-white leading-tight">{m.name}</div>
                <div className="text-[12px] uppercase tracking-widest text-gold-400 mt-0.5">{m.role}</div>
              </div>
            </div>
            {m.specialty && (
              <div className="mt-3 text-[14px] text-white/90">{m.specialty}</div>
            )}
            {m.details && (
              <div className="mt-1 text-[12px] text-navy-200 leading-snug">{m.details}</div>
            )}
            <span className="absolute inset-x-5 bottom-3 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
          </motion.div>
        ))}
      </motion.div>

      {small.length > 0 && (
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
          variants={stagger}
          className="mt-4 grid gap-3"
          style={{ gridTemplateColumns: `repeat(${Math.max(small.length, 2)}, minmax(0, 1fr))` }}
        >
          {small.map((m, i) => (
            <motion.div
              key={m.name}
              custom={i}
              variants={fadeUp}
              className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3"
            >
              <div
                className="flex-none w-10 h-10 rounded-full flex items-center justify-center ring-1 ring-gold-500/30"
                style={{ background: 'linear-gradient(135deg,#1a2e54,#0a1730)' }}
              >
                <div className="text-[13px] text-gold-500 font-semibold">{m.initials}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] text-white leading-tight">{m.name}</div>
                <div className="text-[11px] uppercase tracking-widest text-gold-400">{m.role}</div>
              </div>
              {m.specialty && (
                <div className="text-[12px] text-navy-200 truncate">{m.specialty}</div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {props.footnote && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-4 rounded-2xl bg-gold-500/5 border border-gold-500/20 px-5 py-3 text-[14px] text-navy-100 leading-snug"
        >
          {props.footnote}
        </motion.div>
      )}
    </div>
  )
}
