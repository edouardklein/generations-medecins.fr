import { motion } from 'framer-motion'
import type { BudgetProps } from '../../lib/types'
import { fadeUp, stagger, VIEWPORT_ONCE } from './_anim'
import CountUp from '../CountUp'

export default function Budget(props: BudgetProps) {
  const currency = props.currency ?? '€'
  const total = props.items.reduce((s, it) => s + it.amount, 0)
  const securedTotal = props.items.reduce(
    (s, it) => s + Math.round(it.amount * ((it.secured ?? 0) / 100)),
    0,
  )

  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? '04 • Investissement'}</div>
      <h2 className="h-display text-[58px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[17px] text-navy-200 max-w-[860px]">{props.subtitle}</p>}

      <div className="mt-8 grid grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Items list */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT_ONCE}
          variants={stagger}
          className="col-span-8 flex flex-col gap-3 justify-center"
        >
          {props.items.map((it, i) => {
            const secured = Math.min(100, Math.max(0, it.secured ?? 0))
            const securedAmount = Math.round(it.amount * (secured / 100))
            return (
              <motion.div
                key={it.label}
                custom={i}
                variants={fadeUp}
                className="group rounded-2xl bg-white/[0.04] border border-white/5 px-5 py-3.5 hover:bg-white/[0.07] transition"
              >
                <div className="flex items-baseline justify-between gap-6">
                  <div className="min-w-0 flex-1">
                    <div className="text-[18px] font-semibold text-white leading-tight">{it.label}</div>
                    {it.detail && (
                      <div className="mt-0.5 text-[13px] text-navy-200 leading-snug">{it.detail}</div>
                    )}
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <div className="h-display text-[28px] leading-none text-gold-500">
                      <CountUp to={it.amount} /> {currency}
                    </div>
                    {secured > 0 && (
                      <div className="mt-0.5 text-[11px] tracking-wide text-gold-400/80">
                        {securedAmount.toLocaleString('fr-FR')} {currency} sécurisés
                      </div>
                    )}
                  </div>
                </div>
                {/* Two-layered bar: muted background = total, gold filled = secured */}
                <div className="mt-2.5 h-[6px] rounded-full bg-white/[0.06] border border-white/5 overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${secured}%` }}
                    viewport={VIEWPORT_ONCE}
                    transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: [0.2, 0.7, 0.2, 1] }}
                    className="h-full"
                    style={{ background: 'linear-gradient(90deg,#c4953d,#d6ad58)' }}
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Total card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="col-span-4 relative rounded-3xl p-7 flex flex-col justify-between overflow-hidden"
          style={{
            background: 'linear-gradient(160deg,#1a2e54 0%,#0a1730 60%,#3a2a14 100%)',
            boxShadow: '0 30px 60px -20px rgba(196,149,61,0.45)',
          }}
        >
          <div>
            <div className="text-[11px] tracking-[0.3em] uppercase text-gold-400">
              {props.totalLabel ?? 'Total annuel'}
            </div>
            <div className="mt-3 gold-bar" />
          </div>
          <div>
            <div className="h-display text-[76px] leading-none text-gold-500">
              <CountUp to={total} /> {currency}
            </div>
            <div className="mt-4 text-[14px] text-navy-200 leading-relaxed">
              Investissement global nécessaire pour déployer le programme 2026
              de Générations Médecins.
            </div>

            {securedTotal > 0 && (
              <div className="mt-5 rounded-xl border border-gold-500/40 bg-gold-500/10 px-4 py-3">
                <div className="text-[10px] tracking-[0.3em] uppercase text-gold-400">
                  {props.securedLabel ?? 'Déjà sécurisé'}
                </div>
                <div className="mt-1.5 h-display text-[36px] leading-none text-white">
                  {securedTotal.toLocaleString('fr-FR')} {currency}
                </div>
                <div className="mt-2 h-[4px] rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.round((securedTotal / total) * 100)}%`,
                      background: 'linear-gradient(90deg,#c4953d,#d6ad58)',
                    }}
                  />
                </div>
                <div className="mt-1.5 text-[11px] text-navy-200">
                  via nos partenaires institutionnels — reste {(total - securedTotal).toLocaleString('fr-FR')} {currency} à mobiliser
                </div>
              </div>
            )}
          </div>

          <span className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full bg-gold-500/15 blur-2xl pointer-events-none" />
        </motion.div>
      </div>
    </div>
  )
}
