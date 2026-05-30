import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

type Props = {
  to: number
  duration?: number
  className?: string
  format?: (n: number) => string
}

export default function CountUp({ to, duration = 1.6, className, format }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf = 0
    const start = performance.now()
    const total = Math.max(0, duration * 1000)
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / total)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(to * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])

  const display = format ? format(value) : value.toLocaleString('fr-FR')
  return <span ref={ref} className={className}>{display}</span>
}
