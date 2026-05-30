import { motion } from 'framer-motion'
import type { BenefitsProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function Benefits(props: BenefitsProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? "02 • L'opportunité"}</div>
      <h2 className="h-display text-[58px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-4 text-[18px] text-navy-200 max-w-[820px]">{props.subtitle}</p>}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-8 grid grid-cols-2 gap-6 flex-1 min-h-0"
      >
        {props.benefits.map((b, i) => (
          <motion.div
            key={b.num}
            custom={i}
            variants={fadeUp}
            className="group relative rounded-2xl bg-white/[0.04] border border-white/5 p-7 overflow-hidden hover:bg-white/[0.07] transition"
          >
            <div className="flex items-start gap-6">
              <div className="h-display text-[64px] leading-none text-gold-500/80 group-hover:text-gold-500 transition">
                {b.num}
              </div>
              <div className="flex-1">
                <div className="text-[24px] font-semibold text-white">{b.title}</div>
                <p className="mt-3 text-[15px] leading-relaxed text-navy-200">{b.body}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-[13px] text-gold-400">
                  <span className="inline-block w-6 h-px bg-gold-500" />
                  {b.arrow}
                </div>
              </div>
            </div>
            {/* Decorative corner glow */}
            <span className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-accent/10 blur-3xl opacity-0 group-hover:opacity-100 transition" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
