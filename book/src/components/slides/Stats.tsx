import { motion } from 'framer-motion'
import type { StatsProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'
import CountUp from '../CountUp'

export default function Stats(props: StatsProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? "L'impact de notre réseau"}</div>
      <h2 className="h-display text-[64px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-4 text-[18px] text-navy-200 max-w-[680px]">{props.subtitle}</p>}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-10 grid grid-cols-4 gap-6"
      >
        {props.stats.map((s, i) => (
          <motion.div
            key={s.label}
            custom={i}
            variants={fadeUp}
            className="relative rounded-2xl border border-white/5 bg-white/[0.03] p-7 ring-thin overflow-hidden"
          >
            <div className="text-[12px] uppercase tracking-[0.22em] text-accent-soft">{s.label}</div>
            <div className="mt-4 h-display text-[88px] leading-none text-white tracking-tight">
              {s.prefix}
              <CountUp to={s.value} format={(n) => formatNumber(n)} />
              {s.suffix}
            </div>
            <div className="mt-5 text-[14px] text-navy-200">{s.caption}</div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-gold-500/10 blur-2xl" />
          </motion.div>
        ))}
      </motion.div>

      {props.quote && (
        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 relative bg-white/[0.05] border-l-[3px] border-gold-500 px-8 py-6 rounded-r-xl"
        >
          <span className="absolute top-3 left-3 text-gold-500 text-4xl leading-none font-serif">“</span>
          <p className="italic text-[20px] text-white pl-6 max-w-[1100px]">{props.quote}</p>
        </motion.blockquote>
      )}
    </div>
  )
}

function formatNumber(n: number) {
  if (n >= 1000) {
    const k = Math.floor(n / 1000)
    const rest = n - k * 1000
    return `${k} ${String(rest).padStart(3, '0')}`
  }
  return String(n)
}
