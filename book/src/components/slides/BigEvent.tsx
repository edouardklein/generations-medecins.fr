import { motion } from 'framer-motion'
import type { BigEventProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function BigEvent(props: BigEventProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? '03 • Nos rendez-vous'}</div>
      <div className="mt-3 flex items-baseline gap-6 flex-wrap">
        <h2 className="h-display text-[64px] leading-none text-white">{props.title}</h2>
        {props.subtitle && (
          <span className="text-[15px] tracking-[0.25em] uppercase text-gold-500">{props.subtitle}</span>
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
            className="rounded-xl bg-white/[0.04] border border-white/5 px-5 py-4"
          >
            <div className="text-[12px] tracking-[0.3em] uppercase text-accent-soft">{m.label}</div>
            <div className="mt-1.5 text-[20px] text-white font-medium leading-tight">{m.value}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tracks */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-5 grid grid-cols-3 gap-5"
      >
        {props.tracks.map((t, i) => (
          <motion.div
            key={t.num}
            custom={i}
            variants={fadeUp}
            className="relative rounded-2xl bg-white/[0.04] border border-white/5 p-6 overflow-hidden"
          >
            <div className="absolute -bottom-6 -right-3 h-display text-[140px] leading-none text-white/[0.05] select-none">
              {t.num}
            </div>
            <div className="text-[13px] tracking-[0.3em] uppercase text-gold-500">Parcours {t.num}</div>
            <div className="mt-2 h-display text-[24px] leading-tight text-white">{t.title}</div>
            {t.audience && <div className="mt-1.5 text-[13px] italic text-navy-200">{t.audience}</div>}
            <ul className="mt-4 space-y-2 relative z-10">
              {t.topics.map((topic, k) => (
                <li key={k} className="text-[15px] text-white/95 flex gap-2 leading-snug">
                  <span className="text-gold-500 flex-none mt-0.5">▸</span>
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      {/* Common topics — generous, grid of chips so the strip feels rich */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT_ONCE}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-auto pt-4 rounded-2xl bg-gold-500/8 border border-gold-500/30 px-6 py-5"
      >
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <div className="text-[13px] tracking-[0.3em] uppercase text-gold-500">
            {props.commonTitle ?? 'Thèmes communs'}
          </div>
          {props.guest && (
            <div className="text-[13px] text-navy-100">
              <span className="text-gold-400 uppercase tracking-widest text-[11px] mr-2">Guest</span>
              {props.guest}
            </div>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {props.commonTopics.map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={VIEWPORT_ONCE}
              transition={{ delay: 0.35 + i * 0.015, duration: 0.3 }}
              className="text-[12px] px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.05] text-white/95 leading-none"
            >
              {t}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
