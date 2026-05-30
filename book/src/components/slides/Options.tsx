import { motion } from 'framer-motion'
import type { OptionsProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function Options(props: OptionsProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? '04 • Forfaits & investissement'}</div>
      <h2 className="h-display text-[56px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[17px] text-navy-200 max-w-[860px]">{props.subtitle}</p>}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-9 grid grid-cols-3 gap-5 flex-1"
      >
        {props.options.map((o, i) => (
          <motion.div
            key={o.name}
            custom={i}
            variants={fadeUp}
            className="group relative rounded-2xl bg-white/[0.04] border border-white/5 p-6 hover:bg-white/[0.08] transition"
          >
            <div className="flex items-start gap-3">
              <div className="text-gold-500 text-[28px] leading-none">★</div>
              <div className="text-[18px] font-semibold text-white leading-tight">{o.name}</div>
            </div>
            <p className="mt-3 text-[14px] text-navy-200 leading-relaxed">{o.body}</p>
          </motion.div>
        ))}
      </motion.div>

      {props.footnote && (
        <div className="mt-6 text-[14px] tracking-wide text-gold-400">{props.footnote}</div>
      )}
    </div>
  )
}
