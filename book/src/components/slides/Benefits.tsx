import { motion } from 'framer-motion'
import type { BenefitsProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function Benefits(props: BenefitsProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? "02 • L'opportunité"}</div>
      <h2 className="h-display text-[50px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[16px] text-navy-200 max-w-[920px]">{props.subtitle}</p>}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-6 grid grid-cols-2 gap-5 flex-1 min-h-0"
      >
        {props.benefits.map((b, i) => (
          <motion.div
            key={b.num}
            custom={i}
            variants={fadeUp}
            className="group relative rounded-2xl bg-white/[0.04] border border-white/5 p-6 overflow-hidden hover:bg-white/[0.07] transition flex"
          >
            <div className="flex items-start gap-5 w-full">
              <div className="h-display text-[52px] leading-none text-gold-500/80 group-hover:text-gold-500 transition flex-none">
                {b.num}
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="text-[21px] font-semibold text-white leading-tight">{b.title}</div>
                <p className="mt-3 text-[16px] leading-snug text-white/95">{b.body}</p>
                {b.items && b.items.length > 0 && (
                  <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {b.items.map((it, k) => (
                      <li key={k} className="text-[14px] text-navy-100 leading-snug flex gap-1.5">
                        <span className="text-gold-500 flex-none">•</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto pt-4 flex items-start gap-2 text-[15px] text-gold-400 leading-snug font-medium">
                  <span className="inline-block w-5 h-px mt-2.5 bg-gold-500 flex-none" />
                  <span>{b.arrow}</span>
                </div>
              </div>
            </div>
            <span className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-accent/10 blur-3xl opacity-0 group-hover:opacity-100 transition" />
          </motion.div>
        ))}
      </motion.div>

      {props.closing && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-4 rounded-2xl bg-gold-500/10 border border-gold-500/40 px-6 py-4"
        >
          <p className="text-[17px] text-white leading-snug font-medium">{props.closing}</p>
        </motion.div>
      )}
    </div>
  )
}
