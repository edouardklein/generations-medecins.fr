import { motion } from 'framer-motion'
import type { BigEventProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

// Decorative footers per parcours — fills the visual void at the bottom of
// each track card so we don't end up with half-empty boxes.
const trackKickers: Record<string, { icon: string; tagline: string }> = {
  '1': { icon: '🎓', tagline: 'Préparer • Cadrer • Décider' },
  '2': { icon: '🏥', tagline: 'Statuts • Fiscalité • Mixte' },
  '3': { icon: '🧑‍⚕️', tagline: 'Achat • Pied à terre • Prêt' },
}

export default function BigEvent(props: BigEventProps) {
  return (
    <div className="h-full w-full grid" style={{ gridTemplateRows: 'auto auto 1fr auto', rowGap: 20 }}>
      {/* Header */}
      <div>
        <div className="eyebrow">{props.eyebrow ?? '03 • Nos rendez-vous'}</div>
        <div className="mt-3 flex items-baseline gap-6 flex-wrap">
          <h2 className="h-display text-[64px] leading-none text-white">{props.title}</h2>
          {props.subtitle && (
            <span className="text-[15px] tracking-[0.25em] uppercase text-gold-500">{props.subtitle}</span>
          )}
        </div>
        <div className="gold-bar mt-3" />
      </div>

      {/* Meta row */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="grid grid-cols-4 gap-4"
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

      {/* Tracks — flex column so each card stretches to fill the row */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="grid grid-cols-3 gap-5 min-h-0"
      >
        {props.tracks.map((t, i) => {
          const kicker = trackKickers[t.num]
          return (
            <motion.div
              key={t.num}
              custom={i}
              variants={fadeUp}
              className="relative rounded-2xl bg-white/[0.04] border border-white/5 p-6 overflow-hidden flex flex-col"
            >
              <div className="absolute -bottom-6 -right-3 h-display text-[150px] leading-none text-white/[0.06] select-none pointer-events-none">
                {t.num}
              </div>

              <div className="text-[13px] tracking-[0.3em] uppercase text-gold-500">Parcours {t.num}</div>
              <div className="mt-2 h-display text-[24px] leading-tight text-white relative z-10">{t.title}</div>
              {t.audience && (
                <div className="mt-1.5 text-[13px] italic text-navy-200 relative z-10">{t.audience}</div>
              )}

              <ul className="mt-5 space-y-3 relative z-10">
                {t.topics.map((topic, k) => (
                  <li
                    key={k}
                    className="text-[16px] text-white/95 flex gap-3 leading-snug rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2"
                  >
                    <span className="text-gold-500 flex-none mt-0.5">▸</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>

              {/* Decorative footer to fill the lower half of the card */}
              {kicker && (
                <div className="mt-auto pt-5 relative z-10">
                  <div className="flex items-center gap-3 rounded-xl border border-gold-500/30 bg-gold-500/5 px-4 py-3">
                    <span className="text-2xl">{kicker.icon}</span>
                    <span className="text-[12px] tracking-[0.22em] uppercase text-gold-400">
                      {kicker.tagline}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Common topics — flex-wrap chips */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT_ONCE}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="rounded-2xl bg-gold-500/8 border border-gold-500/30 px-6 py-4"
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
              transition={{ delay: 0.35 + i * 0.012, duration: 0.3 }}
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
