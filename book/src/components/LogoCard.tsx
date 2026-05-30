import { useRef, useState } from 'react'
import type { PublicPartner } from '../lib/types'

type Props = {
  partner: PublicPartner
  onClick: () => void
}

export default function LogoCard({ partner, onClick }: Props) {
  const ref = useRef<HTMLButtonElement | null>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50, lift: 0 })
  const [hovering, setHovering] = useState(false)

  function handleMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    setTilt({
      rx: (0.5 - py) * 12,
      ry: (px - 0.5) * 16,
      mx: px * 100,
      my: py * 100,
      lift: 12,
    })
  }

  function reset() {
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50, lift: 0 })
    setHovering(false)
  }

  const [imgError, setImgError] = useState(false)

  return (
    <button
      ref={ref}
      onMouseEnter={() => setHovering(true)}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
      className="group relative w-full aspect-[4/3] rounded-2xl bg-white overflow-hidden tilt-card focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
      style={{
        transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(${tilt.lift}px)`,
        boxShadow: hovering
          ? '0 30px 60px -20px rgba(6,16,31,0.55), 0 12px 24px -10px rgba(196,149,61,0.35), inset 0 0 0 1px rgba(196,149,61,0.35)'
          : '0 14px 28px -14px rgba(6,16,31,0.5), inset 0 0 0 1px rgba(15,32,62,0.08)',
      }}
      aria-label={`Accéder au book de ${partner.name}`}
    >
      {/* Specular highlight that tracks the cursor — sells the 3D feel */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(420px circle at ${tilt.mx}% ${tilt.my}%, rgba(255,255,255,0.85), transparent 45%)`,
          mixBlendMode: 'overlay',
          opacity: hovering ? 1 : 0,
        }}
      />
      {/* Gold cursor halo */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(380px circle at ${tilt.mx}% ${tilt.my}%, rgba(196,149,61,0.18), transparent 55%)`,
          opacity: hovering ? 1 : 0,
        }}
      />

      {/* Logo (or initials fallback) */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        {!imgError ? (
          <img
            src={partner.logo_url}
            alt={partner.name}
            onError={() => setImgError(true)}
            className="max-h-[72%] max-w-[72%] object-contain transition-transform duration-500 group-hover:scale-[1.06]"
            style={{
              filter: hovering
                ? 'drop-shadow(0 10px 18px rgba(6,16,31,0.18))'
                : 'drop-shadow(0 4px 10px rgba(6,16,31,0.1))',
            }}
            draggable={false}
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center text-center">
            <div className="font-serif text-4xl text-navy-900">
              {partner.name
                .split(' ')
                .slice(0, 2)
                .map((w) => w[0])
                .join('')}
            </div>
            <div className="mt-2 text-xs uppercase tracking-widest text-navy-400">{partner.name}</div>
          </div>
        )}
      </div>

      {/* Hover footer band */}
      <div className="absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-navy-950/95 via-navy-950/70 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition">
        <div className="flex items-center justify-between">
          <div className="text-sm text-white font-medium truncate">{partner.name}</div>
          <div className="text-xs text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity">
            Ouvrir →
          </div>
        </div>
      </div>
    </button>
  )
}
