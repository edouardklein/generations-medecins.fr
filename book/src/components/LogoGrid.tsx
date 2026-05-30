import { motion } from 'framer-motion'
import LogoCard from './LogoCard'
import type { PublicPartner } from '../lib/types'

type Props = {
  partners: PublicPartner[]
  loading: boolean
  onPick: (p: PublicPartner) => void
}

export default function LogoGrid({ partners, loading, onPick }: Props) {
  const skeletons = Array.from({ length: 8 }, (_, i) => i)

  if (!loading && partners.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <div className="inline-block rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-10">
          <div className="h-display text-3xl text-white">Aucun partenaire actif</div>
          <p className="mt-3 text-navy-200">
            Provisionne au moins un partenaire dans la table <code className="text-gold-400">partners</code> via Supabase pour qu'il apparaisse ici.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
        }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6"
      >
        {loading
          ? skeletons.map((i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                className="aspect-[4/3] rounded-2xl bg-white/[0.08] border border-white/10 shimmer"
              />
            ))
          : partners.map((p) => (
              <motion.div key={p.id} variants={cardVariants}>
                <LogoCard partner={p} onClick={() => onPick(p)} />
              </motion.div>
            ))}
      </motion.div>
    </div>
  )
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] } },
}
