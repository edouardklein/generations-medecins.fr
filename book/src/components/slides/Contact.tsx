import { motion } from 'framer-motion'
import type { ContactProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function Contact(props: ContactProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center relative">
      <div className="eyebrow">{props.eyebrow ?? 'Contact'}</div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 0.6 }}
        className="h-display text-[64px] leading-[1.05] mt-5 text-white max-w-[1100px]"
      >
        {props.title}
      </motion.h2>

      {props.body && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-5 text-[18px] text-navy-200 max-w-[820px]"
        >
          {props.body}
        </motion.p>
      )}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-12 grid grid-cols-3 gap-8 w-full max-w-[1100px]"
      >
        {props.channels.map((c, i) => (
          <motion.div
            key={c.label}
            custom={i}
            variants={fadeUp}
            className="rounded-2xl bg-white/[0.04] border border-white/5 px-6 py-7 flex flex-col items-center hover:-translate-y-1 hover:bg-white/[0.08] transition"
          >
            <div className="w-14 h-14 rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-500 flex items-center justify-center text-2xl">
              {c.glyph}
            </div>
            <div className="mt-4 text-[11px] tracking-[0.3em] uppercase text-accent-soft">{c.label}</div>
            <div className="mt-2 text-[16px] text-white">{c.value}</div>
          </motion.div>
        ))}
      </motion.div>

      {props.footer && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="absolute bottom-[64px] left-0 right-0 text-[12px] tracking-[0.3em] text-navy-300"
        >
          {props.footer}
        </motion.div>
      )}
    </div>
  )
}
