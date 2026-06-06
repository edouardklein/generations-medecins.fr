import { motion } from 'framer-motion'
import type { PlansCompareProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function PlansCompare(props: PlansCompareProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? '04 • Forfaits & investissement'}</div>
      <h2 className="h-display text-[56px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[17px] text-navy-200 max-w-[820px]">{props.subtitle}</p>}

      <div className="mt-8 rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden flex-1">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-6 pt-6 pb-4">
          <div className="col-span-6" />
          {props.tiers.map((t) => (
            <div key={t.name} className="col-span-2 text-center relative">
              {t.premium && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-navy-900 bg-gold-500 px-3 py-0.5 rounded-full">
                  PREMIUM
                </div>
              )}
              <div className="h-display text-[28px] text-white">{t.name}</div>
              <div className="text-gold-500 mt-1 text-[18px] font-semibold">{t.price}</div>
            </div>
          ))}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
          variants={stagger}
          className="px-6 py-4"
        >
          {props.features.map((feat, row) => (
            <motion.div
              key={feat}
              custom={row}
              variants={fadeUp}
              className="grid grid-cols-12 gap-2 items-center py-3 border-b border-white/5 last:border-b-0 hover:bg-white/[0.03] rounded-md transition"
            >
              <div className="col-span-6 text-[15px] text-white/90">{feat}</div>
              {props.tiers.map((_t, col) => (
                <div key={col} className="col-span-2 flex justify-center">
                  {props.matrix[row]?.[col] ? (
                    <span className="w-7 h-7 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center text-sm font-bold">
                      ✓
                    </span>
                  ) : (
                    <span className="w-7 h-7 rounded-full border border-white/15 text-navy-300 flex items-center justify-center">
                      —
                    </span>
                  )}
                </div>
              ))}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
