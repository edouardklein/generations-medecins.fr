import { motion } from 'framer-motion'
import type { BigEventProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function BigEvent(props: BigEventProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? '02 • Le grand rendez-vous'}</div>
      <div className="mt-3 flex items-baseline gap-5">
        <h2 className="h-display text-[56px] leading-none text-white">{props.title}</h2>
        {props.subtitle && (
          <span className="text-[14px] tracking-[0.3em] uppercase text-gold-500">{props.subtitle}</span>
        )}
      </div>
      <div className="gold-bar mt-3" />

      {/* Meta row */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-5 grid grid-cols-4 gap-4"
      >
        {props.meta.map((m, i) => (
          <motion.div
            key={m.label}
            custom={i}
            variants={fadeUp}
            className="rounded-xl bg-white/[0.04] border border-white/5 px-4 py-3"
          >
            <div className="text-[11px] tracking-[0.3em] uppercase text-accent-soft">{m.label}</div>
            <div className="mt-1 text-[18px] text-white font-medium leading-tight">{m.value}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tracks */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-5 grid grid-cols-3 gap-4 flex-1 min-h-0"
      >
        {props.tracks.map((t, i) => (
          <motion.div
            key={t.num}
            custom={i}
            variants={fadeUp}
            className="relative rounded-2xl bg-white/[0.04] border border-white/5 p-5 overflow-hidden"
          >
            <div className="absolute -bottom-4 -right-2 h-display text-[120px] leading-none text-white/[0.04] select-none">
              {t.num}
            </div>
            <div className="text-[12px] tracking-[0.3em] uppercase text-gold-500">Parcours {t.num}</div>
            <div className="mt-2 h-display text-[22px] leading-tight text-white">{t.title}</div>
            {t.audience && <div className="mt-1 text-[12px] italic text-navy-200">{t.audience}</div>}
            <ul className="mt-3 space-y-1.5">
              {t.topics.map((topic, k) => (
                <li key={k} className="text-[13px] text-navy-100 flex gap-2">
                  <span className="text-gold-500 flex-none">▸</span>
                  <span className="leading-snug">{topic}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      {/* Common topics */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT_ONCE}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-4 rounded-2xl bg-gold-500/5 border border-gold-500/20 px-5 py-3"
      >
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-[11px] tracking-[0.3em] uppercase text-gold-500 flex-none">
            {props.commonTitle ?? 'Thèmes communs'}
          </span>
          <span className="text-[12px] text-navy-100 leading-snug">
            {props.commonTopics.join(' • ')}
          </span>
        </div>
        {props.guest && (
          <div className="mt-2 text-[12px] text-navy-200">
            <span className="text-gold-400">Guest :</span> {props.guest}
          </div>
        )}
      </motion.div>
    </div>
  )
}
