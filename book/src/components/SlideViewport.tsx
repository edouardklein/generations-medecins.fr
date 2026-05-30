import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Wraps a 1600x900 SlideFrame and scales it so it fills the available width
 * while keeping a 16:9 aspect ratio. The inner canvas keeps its native pixels —
 * critical so html2canvas captures crisp slides regardless of viewport size.
 */
export default function SlideViewport({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth
      setScale(w / 1600)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={ref} className="w-full max-w-[1600px] mx-auto" style={{ aspectRatio: '16 / 9' }}>
      <div
        className="origin-top-left"
        style={{ transform: `scale(${scale})`, width: 1600, height: 900 }}
      >
        {children}
      </div>
    </div>
  )
}
