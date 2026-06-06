import { motion } from 'framer-motion'
import type { MediaProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function Media(props: MediaProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? '01 • Présence dans les médias'}</div>
      <h2 className="h-display text-[58px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[17px] text-navy-200 max-w-[1000px]">{props.subtitle}</p>}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-8 grid gap-5 flex-1 min-h-0"
        style={{ gridTemplateColumns: `repeat(${Math.min(props.sections.length, 3)}, minmax(0, 1fr))` }}
      >
        {props.sections.map((section, i) => (
          <motion.div
            key={section.kicker}
            custom={i}
            variants={fadeUp}
            className="relative rounded-2xl bg-white/[0.04] border border-white/5 p-6 flex flex-col"
          >
            <div className="flex items-baseline gap-3">
              {section.glyph && <span className="text-2xl">{section.glyph}</span>}
              <div className="text-[12px] tracking-[0.3em] uppercase text-gold-500">{section.kicker}</div>
            </div>

            <div className="mt-5 space-y-3 flex-1">
              {section.items.map((it, k) => (
                <div
                  key={k}
                  className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3"
                >
                  {it.logo ? (
                    <div className="flex-none w-12 h-10 bg-white rounded grid place-items-center overflow-hidden">
                      <img
                        src={it.logo}
                        alt={it.name}
                        className="max-w-[80%] max-h-[80%] object-contain"
                        draggable={false}
                      />
                    </div>
                  ) : (
                    <div className="flex-none w-12 h-10 rounded bg-gold-500/10 border border-gold-500/30 grid place-items-center text-gold-500 text-xs font-semibold">
                      {it.name.split(' ')[0].slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] text-white font-medium leading-tight truncate">{it.name}</div>
                    {it.caption && <div className="text-[12px] text-navy-200 leading-snug truncate">{it.caption}</div>}
                  </div>
                </div>
              ))}
            </div>

            {section.items.length === 0 && (
              <div className="text-[13px] italic text-navy-300 mt-4">À compléter — drop les visuels dans /public/media/</div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {props.footnote && (
        <div className="mt-5 rounded-xl bg-gold-500/8 border border-gold-500/30 px-5 py-3 text-[14px] text-white/95">
          {props.footnote}
        </div>
      )}
    </div>
  )
}
