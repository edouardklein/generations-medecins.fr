import { motion } from 'framer-motion'
import type { ModulesProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function Modules(props: ModulesProps) {
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
        {props.modules.map((m, i) => (
          <motion.div
            key={m.name}
            custom={i}
            variants={fadeUp}
            whileHover={{ y: -6, rotateZ: -0.4 }}
            className="group relative rounded-2xl bg-white/[0.04] border border-white/5 p-6 overflow-hidden transition"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-60 group-hover:opacity-100 transition" />
            <div className="h-display text-[26px] text-white leading-tight">{m.name}</div>
            <div className="mt-3 h-display text-[40px] leading-none text-gold-500">{m.price}</div>
            <p className="mt-4 text-[14px] text-navy-200 leading-relaxed">{m.body}</p>
          </motion.div>
        ))}
      </motion.div>

      {props.footnote && (
        <div className="mt-6 text-[14px] tracking-wide text-gold-400">{props.footnote}</div>
      )}
    </div>
  )
}
