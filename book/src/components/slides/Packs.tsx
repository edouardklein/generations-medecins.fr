import { motion } from 'framer-motion'
import type { PacksProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function Packs(props: PacksProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? '05 • Comment nous accompagner'}</div>
      <h2 className="h-display text-[56px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[17px] text-navy-200 max-w-[1000px]">{props.subtitle}</p>}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-7 grid gap-5 flex-1 min-h-0"
        style={{ gridTemplateColumns: `repeat(${props.packs.length}, minmax(0, 1fr))` }}
      >
        {props.packs.map((p, i) => (
          <motion.div
            key={p.name}
            custom={i}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className={`relative rounded-2xl p-7 flex flex-col overflow-hidden border ${
              p.premium ? 'border-gold-500/60' : 'border-white/10'
            }`}
            style={{
              background: p.premium
                ? 'linear-gradient(160deg,#1a2e54 0%,#0a1730 55%,#3a2a14 100%)'
                : 'linear-gradient(160deg,#10203e 0%,#0a1730 100%)',
              boxShadow: p.premium
                ? '0 30px 60px -20px rgba(196,149,61,0.55)'
                : '0 18px 40px -20px rgba(2,8,20,0.6)',
            }}
          >
            {p.premium && (
              <div className="absolute top-4 right-4 text-[10px] tracking-[0.3em] text-navy-950 bg-gold-500 px-3 py-1 rounded-full">
                PREMIUM
              </div>
            )}
            <div className="text-[12px] tracking-[0.3em] uppercase text-white/70">Pack</div>
            <div className="mt-2 h-display text-[44px] leading-none text-white">{p.name}</div>
            {p.tagline && (
              <div className="mt-2 text-[13px] italic text-navy-100">{p.tagline}</div>
            )}
            <div className="mt-5 flex items-baseline gap-2">
              <span className="h-display text-[48px] leading-none text-gold-500">{p.price}</span>
              <span className="text-[12px] uppercase tracking-widest text-navy-200">HT / an</span>
            </div>

            <div className="mt-5 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            <ul className="mt-5 space-y-2.5 flex-1">
              {p.features.map((f, k) => (
                <li key={k} className="flex items-start gap-3 text-[14px] text-white/95 leading-snug">
                  <span
                    className="mt-0.5 flex-none w-5 h-5 rounded-full grid place-items-center text-navy-950 text-[11px] font-bold"
                    style={{ background: 'linear-gradient(135deg,#c4953d,#d6ad58)' }}
                  >
                    ✓
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      {props.note && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-5 rounded-2xl bg-gold-500/10 border border-gold-500/40 px-6 py-4 flex items-center gap-4"
        >
          <span className="text-3xl">🔒</span>
          <div className="text-[16px] text-white">{props.note}</div>
        </motion.div>
      )}
    </div>
  )
}
