import { motion } from 'framer-motion'
import type { ManifestoProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function Manifesto(props: ManifestoProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? '01 • Qui sommes-nous'}</div>
      <h2 className="h-display text-[60px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-4 text-[18px] text-navy-200 max-w-[760px]">{props.subtitle}</p>}

      <div className="mt-10 grid grid-cols-12 gap-10 flex-1">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
          variants={stagger}
          className="col-span-6 flex flex-col justify-center"
        >
          <div className="text-[11px] tracking-[0.3em] text-gold-500 uppercase">Notre manifesto</div>
          <div className="mt-4 space-y-1">
            {props.verbs.map((v, i) => (
              <motion.div
                key={v}
                custom={i}
                variants={fadeUp}
                className="h-display text-[68px] leading-[1.02] text-white"
              >
                {v}
              </motion.div>
            ))}
          </div>
          <motion.p variants={fadeUp} custom={props.verbs.length} className="mt-6 text-[17px] text-navy-200 max-w-[520px] leading-relaxed">
            {props.body}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
          variants={stagger}
          className="col-span-6 flex flex-col justify-center gap-5"
        >
          {props.pillars.map((p, i) => (
            <motion.div
              key={p.num}
              custom={i}
              variants={fadeUp}
              className="group relative rounded-2xl bg-white/[0.04] border border-white/5 p-6 hover:translate-x-1 transition"
            >
              <div className="flex items-start gap-5">
                <div className="h-display text-[40px] text-gold-500 leading-none">{p.num}</div>
                <div>
                  <div className="text-[20px] font-medium text-white">{p.title}</div>
                  <div className="mt-2 text-[15px] text-navy-200">{p.text}</div>
                </div>
              </div>
              <span className="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-gold-500/30 transition" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
