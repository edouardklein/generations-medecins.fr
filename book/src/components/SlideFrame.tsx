import { type ReactNode, forwardRef } from 'react'

type Props = {
  children: ReactNode
  variant?: 'dark' | 'light'
  index: number
  total: number
  className?: string
}

/**
 * Fixed-size 1600x900 internal slide.
 * The SlideViewport wrapper scales it visually; capture is done at native size.
 */
const SlideFrame = forwardRef<HTMLDivElement, Props>(function SlideFrame(
  { children, variant = 'dark', index, total, className = '' },
  ref,
) {
  const isLight = variant === 'light'
  return (
    <div
      ref={ref}
      data-slide-index={index}
      className={`slide-canvas relative ${isLight ? 'text-navy-900' : 'text-navy-50'} ${className}`}
      style={{
        background: isLight
          ? 'linear-gradient(180deg,#f3f6fb 0%, #e9eff7 100%)'
          : 'linear-gradient(135deg,#06101f 0%, #0e1c39 60%, #1a2e54 100%)',
      }}
    >
      {/* Top accent bar */}
      <div
        className="absolute left-0 right-0 top-0 h-[5px]"
        style={{
          background: isLight
            ? 'linear-gradient(90deg,#2f6dff 0%, #5f8dff 100%)'
            : 'linear-gradient(90deg,#c4953d 0%, #d6ad58 100%)',
        }}
      />
      <div className="absolute inset-0 px-[80px] py-[64px]">{children}</div>

      {/* Page chrome */}
      <div
        className={`absolute bottom-[24px] left-[80px] right-[80px] flex justify-between text-[14px] ${
          isLight ? 'text-navy-400' : 'text-navy-300'
        }`}
      >
        <span>GM IDF • Book Partenaires 2026</span>
        <span>
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
})

export default SlideFrame
