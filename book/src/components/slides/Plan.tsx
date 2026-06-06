import { motion } from 'framer-motion'
import type { PlanProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

const tierTone: Record<PlanProps['tier'], { from: string; to: string; ring: string; bg: string; text: string }> = {
  BRONZE: {
    from: '#a87d2d',
    to: '#c4953d',
    ring: 'rgba(196,149,61,0.6)',
    bg: 'linear-gradient(160deg,#1a2e54 0%,#0a1730 100%)',
    text: '#d6ad58',
  },
  ARGENT: {
    from: '#a4afc1',
    to: '#cfd8e3',
    ring: 'rgba(207,216,227,0.5)',
    bg: 'linear-gradient(160deg,#243d6e 0%,#10203e 100%)',
    text: '#e3eaf3',
  },
  OR: {
    from: '#c4953d',
    to: '#f4d27f',
    ring: 'rgba(244,210,127,0.7)',
    bg: 'linear-gradient(160deg,#0e1c39 0%,#1a2e54 60%,#3a2a14 100%)',
    text: '#f4d27f',
  },
}

export default function Plan(props: PlanProps) {
  const tone = tierTone[props.tier]
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? '04 • Forfaits & investissement'}</div>
      <h2 className="h-display text-[58px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[17px] text-navy-200 max-w-[860px]">{props.subtitle}</p>}

      <div className="mt-8 grid grid-cols-12 gap-6 flex-1">
        {/* Hero tier card */}
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: -1 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="col-span-5 relative rounded-2xl p-8 overflow-hidden ring-1"
          style={{ background: tone.bg, boxShadow: `0 30px 60px -20px ${tone.ring}` }}
        >
          {props.premium && (
            <div className="absolute top-5 right-5 text-[10px] tracking-[0.3em] text-navy-900 bg-gold-500 px-3 py-1 rounded-full">
              PREMIUM
            </div>
          )}
          <div className="text-[12px] tracking-[0.3em] uppercase text-white/80">Forfait</div>
          <div className="mt-3 h-display text-[88px] leading-none" style={{ color: tone.text }}>
            {props.tier}
          </div>
          <div className="mt-4 h-[2px] w-20" style={{ background: `linear-gradient(90deg, ${tone.from}, ${tone.to})` }} />
          <div className="mt-8 text-[14px] uppercase tracking-widest text-white/70">Investissement</div>
          <div className="mt-2 h-display text-[68px] leading-none" style={{ color: tone.text }}>
            {props.price}
          </div>
          <div className="mt-3 text-[14px] uppercase tracking-widest text-white/70">{props.priceCaption}</div>

          {/* Decorative streaks */}
          <span className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full"
            style={{ background: `radial-gradient(circle, ${tone.ring}, transparent 70%)` }}
          />
        </motion.div>

        {/* Features */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
          variants={stagger}
          className="col-span-7 rounded-2xl bg-white/[0.04] border border-white/5 p-8"
        >
          <div className="text-[12px] tracking-[0.3em] uppercase text-accent-soft">Prestations incluses</div>
          <div className="mt-2 gold-bar" />
          <ul className="mt-6 space-y-4">
            {props.features.map((f, i) => (
              <motion.li
                key={i}
                custom={i}
                variants={fadeUp}
                className="flex items-start gap-4 text-[17px] text-white/95"
              >
                <span
                  className="mt-1 flex-none w-7 h-7 rounded-full flex items-center justify-center text-navy-950 text-sm font-bold"
                  style={{ background: `linear-gradient(135deg, ${tone.from}, ${tone.to})` }}
                >
                  ✓
                </span>
                <span>{f}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
