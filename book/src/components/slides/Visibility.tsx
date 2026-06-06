import { motion } from 'framer-motion'
import type { VisibilityProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function Visibility(props: VisibilityProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? '03 • Visibilité'}</div>
      <h2 className="h-display text-[58px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[17px] text-navy-200 max-w-[820px]">{props.subtitle}</p>}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-9 grid grid-cols-2 gap-6 flex-1"
      >
        {props.zones.map((z, i) => (
          <motion.div
            key={z.kicker}
            custom={i}
            variants={fadeUp}
            className="group relative rounded-2xl bg-white/[0.04] border border-white/5 p-6 overflow-hidden hover:bg-white/[0.07] transition"
          >
            <div className="text-[11px] tracking-[0.3em] uppercase text-gold-500">{z.kicker}</div>
            <div className="mt-3 h-display text-[26px] leading-tight text-white">{z.label}</div>

            {/* Mockup placeholder */}
            <div className="mt-4 rounded-xl border border-white/10 bg-gradient-to-br from-navy-800 to-navy-900 p-4 h-[120px] flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-2 w-2/3 rounded bg-white/10" />
                <div className="h-2 w-1/2 rounded bg-white/10" />
                <div className="h-2 w-1/3 rounded bg-white/10" />
              </div>
              <div className="ml-4 rounded-md border border-gold-500/40 bg-gold-500/10 px-3 py-2 text-[10px] tracking-widest text-gold-400">
                LOGO
              </div>
            </div>

            <div className="mt-4 text-[13px] text-navy-200">{z.caption}</div>
          </motion.div>
        ))}
      </motion.div>

      {props.footnote && (
        <div className="mt-6 text-[14px] text-gold-400">{props.footnote}</div>
      )}
    </div>
  )
}
