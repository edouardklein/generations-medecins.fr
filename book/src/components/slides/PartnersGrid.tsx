import { motion } from 'framer-motion'
import type { PartnersGridProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function PartnersGrid(props: PartnersGridProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? '03 • Visibilité'}</div>
      <h2 className="h-display text-[58px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[17px] text-navy-200 max-w-[860px]">{props.subtitle}</p>}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-8 grid grid-cols-4 gap-5"
      >
        {props.partners.map((p, i) => (
          <motion.div
            key={p.name}
            custom={i}
            variants={fadeUp}
            className="group relative rounded-2xl bg-white/[0.04] border border-white/5 p-5 hover:-translate-y-1 hover:bg-white/[0.08] transition"
          >
            <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 grid place-items-center mb-4 ring-1 ring-white/5">
              <div className="font-serif text-3xl text-gold-500 text-center px-4">
                {p.name
                  .split(/[ \-/]/)
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('')}
              </div>
            </div>
            <div className="font-semibold text-white text-[15px] leading-tight">{p.name}</div>
            <div className="mt-1 text-[12px] uppercase tracking-widest text-gold-400">{p.tagline}</div>
            <div className="mt-2 text-[13px] text-navy-200">{p.body}</div>
          </motion.div>
        ))}
      </motion.div>

      {props.quote && (
        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6 relative bg-white/[0.05] border-l-[3px] border-gold-500 px-7 py-5 rounded-r-xl"
        >
          <span className="absolute top-2 left-3 text-gold-500 text-3xl leading-none font-serif">“</span>
          <p className="italic text-[16px] text-white pl-6">{props.quote}</p>
        </motion.blockquote>
      )}
    </div>
  )
}
