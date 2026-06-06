import { useState } from 'react'
import { motion } from 'framer-motion'
import type { BureauMember, BureauProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'

export default function Bureau(props: BureauProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? '01 • Qui sommes-nous'}</div>
      <h2 className="h-display text-[50px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[16px] text-navy-200 max-w-[1000px]">{props.subtitle}</p>}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT_ONCE}
        variants={stagger}
        className="mt-5 grid grid-cols-4 gap-3 flex-1 min-h-0"
      >
        {props.members.map((m, i) => (
          <MemberCard key={m.name} member={m} index={i} />
        ))}
      </motion.div>

      {props.footnote && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-5 rounded-2xl bg-gold-500/8 border border-gold-500/40 px-6 py-4 grid grid-cols-[auto_1fr] items-center gap-5"
        >
          <span className="text-3xl">✶</span>
          <div className="text-[15px] text-white/95 leading-snug">{props.footnote}</div>
        </motion.div>
      )}
    </div>
  )
}

function MemberCard({ member: m, index: i }: { member: BureauMember; index: number }) {
  const [imgFailed, setImgFailed] = useState(false)
  const showPhoto = m.photoUrl && !imgFailed
  return (
    <motion.div
      custom={i}
      variants={fadeUp}
      className="group relative rounded-2xl bg-white/[0.04] border border-white/5 p-4 hover:bg-white/[0.07] transition flex flex-col"
    >
      <div className="flex items-start gap-3">
        {/* Avatar — photo if available, otherwise initials chip */}
        <div
          className="relative flex-none w-14 h-14 rounded-full overflow-hidden ring-1 ring-gold-500/30 grid place-items-center"
          style={{ background: 'linear-gradient(135deg,#1a2e54,#0a1730)' }}
        >
          {showPhoto ? (
            <img
              src={m.photoUrl}
              alt={m.name}
              className="w-full h-full object-cover"
              draggable={false}
              onError={() => setImgFailed(true)}
            />
          ) : (
            <span className="h-display text-[18px] text-gold-500">{m.initials}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-semibold text-white leading-tight">{m.name}</div>
          <div className="text-[11px] uppercase tracking-widest text-gold-400 mt-0.5">{m.role}</div>
        </div>
      </div>

      {m.specialty && (
        <div className="mt-3 text-[13px] text-white/90 leading-snug">{m.specialty}</div>
      )}
      {m.details && (
        <div className="mt-1 text-[12px] text-navy-200 leading-snug">{m.details}</div>
      )}
      {m.highlights && m.highlights.length > 0 && (
        <ul className="mt-2 space-y-1">
          {m.highlights.map((h, k) => (
            <li key={k} className="text-[11px] text-navy-100 leading-snug flex gap-1.5">
              <span className="text-gold-500 flex-none">•</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}
