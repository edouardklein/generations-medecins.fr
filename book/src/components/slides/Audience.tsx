import { motion } from 'framer-motion'
import type { AudienceProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function Audience(props: AudienceProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? "02 • L'opportunité"}</div>
      <h2 className="h-display text-[58px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[18px] text-navy-200 max-w-[820px]">{props.subtitle}</p>}

      <div className="mt-7 grid grid-cols-2 gap-10 flex-1">
        {/* Segments */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
          variants={stagger}
          className="rounded-2xl bg-white/[0.03] border border-white/5 p-7"
        >
          <div className="text-[11px] tracking-[0.3em] uppercase text-gold-500">Segmentation</div>
          <div className="mt-2 text-[20px] text-white">Une audience médicale qualifiée</div>
          <div className="mt-5 space-y-4">
            {props.segments.map((s, i) => (
              <motion.div key={s.label} custom={i} variants={fadeUp}>
                <div className="flex items-baseline justify-between">
                  <div className="text-[16px] text-white">{s.label}</div>
                  <div className="text-[18px] font-semibold text-gold-500">{s.share}%</div>
                </div>
                <div className="text-[13px] text-navy-200 mt-0.5">{s.description}</div>
                <div className="mt-2 h-[6px] rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.share}%` }}
                    viewport={VIEWPORT_ONCE}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.1, ease: [0.2, 0.7, 0.2, 1] }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg,#c4953d,#d6ad58)' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Channels */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
          variants={stagger}
          className="rounded-2xl bg-white/[0.03] border border-white/5 p-7"
        >
          <div className="text-[11px] tracking-[0.3em] uppercase text-gold-500">Reach par canal</div>
          <div className="mt-2 text-[20px] text-white">Là où votre marque s'expose</div>
          <div className="mt-5 grid grid-cols-2 gap-4">
            {props.channels.map((c, i) => (
              <motion.div
                key={c.label}
                custom={i}
                variants={fadeUp}
                className="rounded-xl bg-navy-800/40 border border-white/5 px-5 py-4"
              >
                <div className="text-[13px] uppercase tracking-widest text-accent-soft">{c.label}</div>
                <div className="mt-2 h-display text-[40px] leading-none text-white">{c.value}</div>
                <div className="mt-1 text-[12px] text-navy-200">{c.caption}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
