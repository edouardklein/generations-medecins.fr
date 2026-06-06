import { motion } from 'framer-motion'
import type { TestimonialsProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function Testimonials(props: TestimonialsProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? '04 • Témoignages'}</div>
      <h2 className="h-display text-[58px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[17px] text-navy-200 max-w-[1000px]">{props.subtitle}</p>}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-8 grid grid-cols-2 gap-6 flex-1 min-h-0"
      >
        {props.testimonials.map((t, i) => (
          <motion.figure
            key={`${t.name}-${i}`}
            custom={i}
            variants={fadeUp}
            className="relative rounded-2xl bg-white/[0.04] border border-white/5 p-8 overflow-hidden flex flex-col"
          >
            <span className="absolute top-3 left-4 text-gold-500 text-7xl leading-none font-serif select-none">“</span>
            <blockquote className="relative mt-8 text-[19px] leading-relaxed text-white/95 italic flex-1">
              {t.quote}
            </blockquote>
            <figcaption className="mt-6 pt-5 border-t border-white/10 flex items-center gap-4">
              <div className="flex-none w-12 h-12 rounded-full bg-gold-500/10 ring-1 ring-gold-500/30 grid place-items-center overflow-hidden">
                {t.logo ? (
                  <img src={t.logo} alt={t.company ?? t.name} className="max-w-[70%] max-h-[70%] object-contain" />
                ) : (
                  <span className="h-display text-gold-500 text-[18px]">
                    {(t.name.split(' ').slice(0, 2).map((w) => w[0]).join('') || '').toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-semibold text-white">{t.name}</div>
                <div className="text-[12px] text-gold-400 uppercase tracking-widest">
                  {[t.role, t.company].filter(Boolean).join(' • ')}
                </div>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </div>
  )
}
