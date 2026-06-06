import { motion } from 'framer-motion'
import type { MediaProps, MediaTile } from '../../lib/types'
import { VIEWPORT_ONCE } from './_anim'

export default function Media(props: MediaProps) {
  // Cap at two big tiles, as requested — quality over quantity.
  const tiles = props.tiles.slice(0, 2)

  return (
    <div className="h-full w-full flex flex-col">
      <div className="eyebrow">{props.eyebrow ?? '01 • Présence dans les médias'}</div>
      <h2 className="h-display text-[58px] leading-tight mt-3 text-white">{props.title}</h2>
      <div className="gold-bar mt-3" />
      {props.subtitle && <p className="mt-3 text-[17px] text-navy-200 max-w-[1000px]">{props.subtitle}</p>}

      <div className="mt-7 grid grid-cols-2 gap-6 flex-1 min-h-0">
        {tiles.map((tile, i) => (
          <Tile key={tile.name} tile={tile} index={i} />
        ))}
      </div>

      {props.footnote && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-5 rounded-2xl bg-gold-500/10 border border-gold-500/40 px-6 py-4 text-[15px] text-white/95"
        >
          {props.footnote}
        </motion.div>
      )}
    </div>
  )
}

function Tile({ tile, index }: { tile: MediaTile; index: number }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.7, delay: 0.12 + index * 0.12, ease: [0.2, 0.7, 0.2, 1] }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative rounded-2xl overflow-hidden border border-white/10 shadow-slide bg-navy-900"
    >
      <img
        src={tile.image}
        alt={tile.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        draggable={false}
      />
      {/* Bottom gradient overlay with the caption */}
      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-navy-950 via-navy-950/85 to-transparent">
        {tile.kicker && (
          <div className="text-[11px] tracking-[0.3em] uppercase text-gold-400 mb-2">{tile.kicker}</div>
        )}
        <div className="h-display text-[26px] leading-tight text-white">{tile.name}</div>
        {tile.caption && <div className="mt-1 text-[14px] text-navy-100">{tile.caption}</div>}
      </div>
      {/* Subtle gold corner accent */}
      <span className="absolute top-3 right-3 text-[10px] tracking-[0.3em] uppercase text-gold-400/90 bg-navy-950/60 border border-gold-500/30 rounded-full px-3 py-1">
        Média
      </span>
    </motion.figure>
  )
}
