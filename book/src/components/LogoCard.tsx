import { useRef, useState } from 'react'
import type { PublicPartner } from '../lib/types'

type Props = {
  partner: PublicPartner
  onClick: () => void
}

export default function LogoCard({ partner, onClick }: Props) {
  const ref = useRef<HTMLButtonElement | null>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 })

  function handleMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    setTilt({
      rx: (0.5 - py) * 10,
      ry: (px - 0.5) * 14,
      mx: px * 100,
      my: py * 100,
    })
  }

  function reset() {
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50 })
  }

  const [imgError, setImgError] = useState(false)

  return (
    <button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
      className="group relative w-full aspect-[4/3] rounded-2xl bg-navy-800/40 backdrop-blur border border-white/5 overflow-hidden tilt-card hover:shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
      style={{
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
      }}
      aria-label={`Accéder au book de ${partner.name}`}
    >
      {/* Glow that follows cursor */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(380px circle at ${tilt.mx}% ${tilt.my}%, rgba(196,149,61,0.22), transparent 55%)`,
        }}
      />
      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Logo */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        {!imgError ? (
          <img
            src={partner.logo_url}
            alt={partner.name}
            onError={() => setImgError(true)}
            className="max-h-[70%] max-w-[70%] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-105"
            draggable={false}
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center text-center">
            <div className="font-serif text-3xl text-gold-500">
              {partner.name
                .split(' ')
                .slice(0, 2)
                .map((w) => w[0])
                .join('')}
            </div>
            <div className="mt-2 text-xs uppercase tracking-widest text-navy-200">{partner.name}</div>
          </div>
        )}
      </div>

      {/* Hover footer band */}
      <div className="absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-navy-950/95 via-navy-950/70 to-transparent translate-y-1 group-hover:translate-y-0 transition-transform">
        <div className="flex items-center justify-between">
          <div className="text-sm text-white font-medium truncate">{partner.name}</div>
          <div className="text-xs text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity">
            Ouvrir →
          </div>
        </div>
      </div>

      {/* Animated gold border on hover */}
      <span className="absolute inset-0 rounded-2xl pointer-events-none ring-1 ring-transparent group-hover:ring-gold-500/40 transition" />
    </button>
  )
}
