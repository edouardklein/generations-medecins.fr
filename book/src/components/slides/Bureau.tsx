import { motion } from 'framer-motion'
import type { BureauProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function Bureau(props: BureauProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? '01 • Qui sommes-nous'}</div>
      <h2 className="h-display text-[60px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-4 text-[18px] text-navy-200 max-w-[820px]">{props.subtitle}</p>}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-8 grid grid-cols-4 gap-5"
      >
        {props.members.map((m, i) => (
          <motion.div
            key={m.name}
            custom={i}
            variants={fadeUp}
            className="group relative rounded-2xl bg-white/[0.04] border border-white/5 p-5 flex flex-col items-center text-center hover:bg-white/[0.07] hover:-translate-y-1 transition"
          >
            <div className="relative w-[96px] h-[96px] rounded-full flex items-center justify-center ring-1 ring-gold-500/30"
              style={{ background: 'linear-gradient(135deg,#1a2e54,#0a1730)' }}
            >
              <div className="absolute inset-0 rounded-full bg-gold-500/0 group-hover:bg-gold-500/10 transition" />
              <div className="h-display text-[30px] text-gold-500">{m.initials}</div>
            </div>
            <div className="mt-4 font-medium text-white text-[16px] leading-tight">{m.name}</div>
            <div className="mt-1 text-[12px] text-navy-200 uppercase tracking-wider">{m.role}</div>
            <span className="absolute inset-x-6 bottom-3 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
          </motion.div>
        ))}
      </motion.div>

      {props.footnote && (
        <div className="mt-7 text-[15px] text-navy-200">{props.footnote}</div>
      )}
    </div>
  )
}
