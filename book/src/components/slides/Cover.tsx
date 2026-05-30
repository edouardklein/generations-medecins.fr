import { motion } from 'framer-motion'
import type { CoverProps } from '../../lib/types'
import type { SlideContext } from './registry'

export default function Cover({ ctx, ...props }: CoverProps & { ctx: SlideContext }) {
  return (
    <div className="h-full w-full grid grid-cols-12 gap-10 items-stretch">
      {/* Decorative gold ring (top right) */}
      <div className="absolute top-[120px] right-[80px] w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(closest-side, rgba(196,149,61,0.18), transparent 70%)',
        }}
      />

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
        className="col-span-7 flex flex-col justify-center"
      >
        <motion.div variants={lineVariant} className="eyebrow">
          {props.eyebrow ?? 'PARTENARIAT • 2026'}
        </motion.div>
        <motion.div
          variants={lineVariant}
          className="mt-4 text-[14px] tracking-[0.22em] text-navy-200 uppercase"
        >
          {props.brand ?? 'GÉNÉRATIONS MÉDECINS IDF'}
        </motion.div>

        <div className="mt-10 space-y-1">
          {props.titleLines.map((l, i) => (
            <motion.div
              key={i}
              variants={lineVariant}
              className="h-display text-[88px] leading-[0.95] text-white"
              style={i === 1 ? { color: '#ffffff' } : i === 2 ? { color: '#d6ad58' } : undefined}
            >
              {l}
            </motion.div>
          ))}
        </div>

        {props.subtitle && (
          <motion.p
            variants={lineVariant}
            className="mt-10 text-[18px] leading-relaxed text-navy-200 max-w-[640px]"
          >
            {props.subtitle}
          </motion.p>
        )}

        {props.footer && (
          <motion.div
            variants={lineVariant}
            className="mt-12 inline-flex items-center gap-3 text-[12px] tracking-[0.3em] text-navy-300"
          >
            <span className="inline-block w-10 h-px bg-gold-500" />
            {props.footer}
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
        className="col-span-5 relative flex items-center justify-center"
      >
        <div className="relative w-[460px] h-[460px]">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/40 to-accent/0 blur-2xl" />
          <div className="absolute inset-6 rounded-full ring-1 ring-white/10 bg-navy-800/40 backdrop-blur" />
          <div className="absolute inset-0 flex items-center justify-center">
            {ctx.partnerLogoUrl ? (
              <img
                src={ctx.partnerLogoUrl}
                alt={ctx.partnerName ?? ''}
                className="max-w-[60%] max-h-[60%] object-contain drop-shadow-2xl"
              />
            ) : (
              <div className="text-center">
                <div className="h-display text-[56px] text-white">GM</div>
                <div className="mt-2 text-[12px] tracking-[0.3em] text-gold-400">IDF</div>
              </div>
            )}
          </div>
          {/* orbiting dot */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gold-500 shadow-[0_0_18px_4px_rgba(196,149,61,0.6)]" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

const lineVariant = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.7, 0.2, 1] } },
}
