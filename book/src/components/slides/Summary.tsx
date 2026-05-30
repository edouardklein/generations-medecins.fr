import { motion } from 'framer-motion'
import type { SummaryProps } from '../../lib/types'
import { stagger, fadeUp, VIEWPORT_ONCE } from './_anim'

export default function Summary(props: SummaryProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? 'Sommaire'}</div>
      <h2 className="h-display text-[64px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />

      <motion.ol
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-10 grid grid-cols-1 gap-5"
      >
        {props.items.map((it, i) => (
          <motion.li
            key={it.chapter}
            custom={i}
            variants={fadeUp}
            className="group relative grid grid-cols-12 gap-6 items-center px-6 py-5 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] transition"
          >
            <div className="col-span-1 h-display text-[34px] text-gold-500">{it.chapter}</div>
            <div className="col-span-7">
              <div className="text-[22px] font-medium text-white">{it.title}</div>
              <div className="text-[14px] text-navy-200 mt-1">{it.description}</div>
            </div>
            <div className="col-span-4 text-right text-[13px] tracking-widest text-navy-200">
              {it.range}
            </div>
            <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl bg-gradient-to-b from-gold-500 to-accent opacity-0 group-hover:opacity-100 transition" />
          </motion.li>
        ))}
      </motion.ol>
    </div>
  )
}
