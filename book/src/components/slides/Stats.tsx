import { motion } from 'framer-motion'
import type { StatsProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'
import CountUp from '../CountUp'

export default function Stats(props: StatsProps) {
  const top = props.stats.slice(0, 3)
  const bottom = props.stats.slice(3)

  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? 'Notre audience'}</div>
      <h2 className="h-display text-[64px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-4 text-[18px] text-navy-200 max-w-[680px]">{props.subtitle}</p>}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-8 space-y-5"
      >
        {/* Top row: 3 stats */}
        <div className="grid grid-cols-3 gap-5">
          {top.map((s, i) => (
            <StatCard key={s.label} stat={s} index={i} />
          ))}
        </div>

        {/* Bottom row: 2 stats, centred and narrower */}
        {bottom.length > 0 && (
          <div className="grid grid-cols-2 gap-5 mx-auto" style={{ maxWidth: '70%' }}>
            {bottom.map((s, i) => (
              <StatCard key={s.label} stat={s} index={top.length + i} />
            ))}
          </div>
        )}
      </motion.div>

      {props.quote && (
        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-auto pt-8 relative"
        >
          <div className="relative bg-white/[0.05] border-l-[4px] border-gold-500 px-10 py-6 rounded-r-2xl">
            <span className="absolute -top-2 left-4 text-gold-500 text-6xl leading-none font-serif">“</span>
            <p className="italic text-[24px] leading-snug text-white pl-6">{props.quote}</p>
          </div>
        </motion.blockquote>
      )}
    </div>
  )
}

function StatCard({ stat: s, index: i }: { stat: StatsProps['stats'][number]; index: number }) {
  return (
    <motion.div
      custom={i}
      variants={fadeUp}
      className="relative rounded-2xl border border-white/5 bg-white/[0.03] p-6 ring-thin overflow-hidden"
    >
      <div className="text-[12px] uppercase tracking-[0.22em] text-accent-soft">{s.label}</div>
      <div className="mt-3 h-display text-[72px] leading-none text-white tracking-tight">
        {s.prefix}
        <CountUp to={s.value} format={(n) => formatNumber(n)} />
        {s.suffix}
      </div>
      <div className="mt-3 text-[13px] text-navy-200">{s.caption}</div>
      <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-gold-500/10 blur-2xl" />
    </motion.div>
  )
}

function formatNumber(n: number) {
  if (n >= 1000) {
    const k = Math.floor(n / 1000)
    const rest = n - k * 1000
    return `${k} ${String(rest).padStart(3, '0')}`
  }
  return String(n)
}
