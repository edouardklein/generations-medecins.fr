import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Wraps a 1600x900 SlideFrame and scales it so it fills the available area
 * while keeping a 16:9 aspect ratio. The inner canvas keeps its native pixels —
 * critical so html2canvas captures crisp slides regardless of viewport size.
 *
 * The outer container respects BOTH the available width and height (via
 * `min(W, H*16/9)`), so the slide never overflows its host on short screens.
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
    <div
      ref={ref}
      className="mx-auto"
      style={{
        // Width is whichever is smaller: 100% of host, native 1600px, or the
        // height-constrained width that keeps 16:9 within the available height.
        // The host (.book-slide-host) caps vertical room via its padding, so
        // `100vh - 200px` matches the worst-case top+bottom padding budget.
        width: 'min(100%, 1600px, calc((100vh - 130px) * 16 / 9))',
        aspectRatio: '16 / 9',
      }}
    >
      <div
        className="origin-top-left"
        style={{ transform: `scale(${scale})`, width: 1600, height: 900 }}
      >
        {children}
      </div>
    </div>
  )
}
