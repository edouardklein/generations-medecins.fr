import { motion } from 'framer-motion'
import type { FeaturesProps } from '../../lib/types'
import { VIEWPORT_ONCE } from './_anim'

export default function Features(props: FeaturesProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? '03 • Notre plateforme'}</div>
      <h2 className="h-display text-[58px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[17px] text-navy-200 max-w-[820px]">{props.subtitle}</p>}

      <div className="mt-8 grid grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Floating browser mockup with stack cards */}
        <div className="col-span-7 relative">
          <BrowserMockup features={props.features} />
        </div>

        {/* Right-side feature list */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          className="col-span-5 flex flex-col gap-3"
        >
          {props.features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={{ hidden: { opacity: 0, x: 16 }, show: { opacity: 1, x: 0 } }}
              className="group rounded-2xl bg-white/[0.04] border border-white/5 px-5 py-4 hover:bg-white/[0.08] hover:translate-x-1 transition"
            >
              <div className="flex items-start gap-4">
                <div className="flex-none w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-500 flex items-center justify-center text-xl">
                  {f.glyph}
                </div>
                <div className="flex-1 min-w-0">
                  {f.tag && (
                    <div className="text-[10px] tracking-[0.3em] uppercase text-accent-soft">{f.tag}</div>
                  )}
                  <div className="text-[18px] font-semibold text-white leading-tight">{f.title}</div>
                  <p className="mt-1 text-[13px] text-navy-200 leading-snug">{f.body}</p>
                </div>
                <div className="flex-none text-gold-400/60 group-hover:text-gold-400 transition">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function BrowserMockup({ features }: { features: FeaturesProps['features'] }) {
  const visible = features.slice(0, 4)
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Glow */}
      <div className="absolute inset-10 rounded-3xl bg-gradient-to-br from-accent/20 via-transparent to-gold-500/20 blur-3xl" />

      {visible.map((f, i) => {
        const offset = (visible.length - 1 - i) * 22
        const scale = 1 - (visible.length - 1 - i) * 0.04
        const z = i + 1
        return (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 + offset }}
            whileInView={{ opacity: 1, y: -offset }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.7, delay: i * 0.12, ease: [0.2, 0.7, 0.2, 1] }}
            whileHover={{ y: -offset - 8, scale: scale + 0.01 }}
            style={{ zIndex: z, transformStyle: 'preserve-3d', position: 'absolute', inset: 0 }}
          >
            <div
              className="absolute inset-x-8 top-0 mx-auto rounded-2xl bg-navy-900/90 border border-white/10 shadow-slide backdrop-blur"
              style={{
                transform: `scale(${scale})`,
                boxShadow: `0 ${30 + offset}px 60px -${20 + offset}px rgba(2,8,20,0.8)`,
              }}
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                <div className="ml-4 flex-1 rounded-md bg-white/5 border border-white/5 px-3 py-1 text-[11px] text-navy-300 truncate">
                  generations-medecins.fr/{slugify(f.title)}
                </div>
              </div>
              {/* Body */}
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-500 flex items-center justify-center text-2xl">
                    {f.glyph}
                  </div>
                  <div>
                    <div className="h-display text-[20px] leading-tight text-white">{f.title}</div>
                    {f.tag && <div className="text-[10px] tracking-[0.3em] uppercase text-accent-soft">{f.tag}</div>}
                  </div>
                </div>
                <p className="mt-4 text-[13px] text-navy-200 leading-relaxed line-clamp-3">{f.body}</p>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((k) => (
                    <div key={k} className="h-12 rounded-md bg-white/[0.04] border border-white/5" />
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="h-2 w-1/3 rounded bg-white/10" />
                  <span className="text-[11px] text-gold-400">Voir →</span>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
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
