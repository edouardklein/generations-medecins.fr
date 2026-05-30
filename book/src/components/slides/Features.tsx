import { motion } from 'framer-motion'
import type { FeaturesProps } from '../../lib/types'
import { VIEWPORT_ONCE } from './_anim'

export default function Features(props: FeaturesProps) {
  const top = props.features.slice(0, 3)
  const rest = props.features.slice(3)

  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? '04 • Notre plateforme'}</div>
      <h2 className="h-display text-[58px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[17px] text-navy-200 max-w-[1000px]">{props.subtitle}</p>}

      {/* 3 cards side-by-side, each FULLY VISIBLE. The static tilt/lift lives
          on an outer wrapper so Framer Motion's animate transforms don't
          clobber it the way they did in the previous "stack" attempt. */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
        className="mt-7 grid grid-cols-3 gap-6"
      >
        {top.map((f, i) => {
          const tilt = i === 0 ? -2.5 : i === 2 ? 2.5 : 0
          const lift = i === 1 ? -10 : 0
          return (
            <div
              key={f.title}
              style={{ transform: `translateY(${lift}px) rotate(${tilt}deg)` }}
              className="will-change-transform"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] } },
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group rounded-2xl bg-navy-900/95 border border-white/10 shadow-slide overflow-hidden"
              >
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                  <div className="ml-3 flex-1 rounded-md bg-white/5 border border-white/5 px-3 py-1 text-[11px] text-navy-300 truncate">
                    generations-medecins.fr / {slugify(f.title)}
                  </div>
                </div>
                {/* Body */}
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex-none w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-500 flex items-center justify-center text-2xl">
                      {f.glyph}
                    </div>
                    <div className="min-w-0 flex-1">
                      {f.tag && (
                        <div className="text-[10px] tracking-[0.3em] uppercase text-accent-soft">{f.tag}</div>
                      )}
                      <div className="h-display text-[22px] leading-tight text-white">{f.title}</div>
                    </div>
                  </div>
                  <p className="mt-3 text-[14px] text-navy-100 leading-snug">{f.body}</p>
                  <div className="mt-4 grid grid-cols-3 gap-1.5">
                    {[0, 1, 2].map((k) => (
                      <div key={k} className="h-8 rounded-md bg-white/[0.04] border border-white/5" />
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="h-1.5 w-1/3 rounded bg-white/10" />
                    <span className="text-[12px] text-gold-400 group-hover:translate-x-1 transition">
                      Voir →
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          )
        })}
      </motion.div>

      {/* The rest — horizontal pills under the cards */}
      {rest.length > 0 && (
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } } }}
          className="mt-auto pt-5 grid grid-cols-2 gap-3"
        >
          {rest.map((f) => (
            <motion.div
              key={f.title}
              variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}
              className="flex items-center gap-4 rounded-xl bg-white/[0.04] border border-white/5 px-4 py-3 hover:bg-white/[0.07] transition"
            >
              <div className="flex-none w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-500 flex items-center justify-center text-lg">
                {f.glyph}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-semibold text-white leading-tight">{f.title}</div>
                <div className="text-[12px] text-navy-200 leading-snug line-clamp-1">{f.body}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

function slugify(s: string) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
