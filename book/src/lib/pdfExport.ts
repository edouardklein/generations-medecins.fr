import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const SLIDE_W = 1600
const SLIDE_H = 900

/**
 * Capture a slide at native 1600x900 by cloning it into an off-screen stage
 * with no parent transform. This avoids html2canvas misinterpreting the
 * SlideViewport's `transform: scale()` and producing the duplicated/squashed
 * text we were seeing in the PDF.
 */
async function captureSlide(srcNode: HTMLElement): Promise<HTMLCanvasElement> {
  const stage = document.createElement('div')
  stage.setAttribute('data-pdf-stage', '')
  stage.style.cssText = [
    'position: fixed',
    'left: 0',
    'top: 0',
    'width: 1600px',
    'height: 900px',
    'overflow: hidden',
    'transform: translate(-20000px, 0)',
    'z-index: -1',
    'pointer-events: none',
  ].join(';')

  const clone = srcNode.cloneNode(true) as HTMLElement
  // Strip the screen-only frame styles so the PDF is a clean rectangle.
  clone.style.transform = 'none'
  clone.style.borderRadius = '0'
  clone.style.boxShadow = 'none'
  clone.style.width = '1600px'
  clone.style.height = '900px'

  stage.appendChild(clone)
  document.body.appendChild(stage)

  try {
    return await html2canvas(clone, {
      backgroundColor: null,
      scale: 2,
      width: SLIDE_W,
      height: SLIDE_H,
      windowWidth: SLIDE_W,
      windowHeight: SLIDE_H,
      useCORS: true,
      logging: false,
    })
  } finally {
    document.body.removeChild(stage)
  }
}

export async function exportBookToPdf(opts: {
  slides: HTMLElement[]
  fileName: string
  onProgress?: (current: number, total: number) => void
}): Promise<void> {
  const { slides, fileName, onProgress } = opts
  if (slides.length === 0) return

  // Make sure every webfont is loaded before we start; otherwise html2canvas
  // can fall back to system fonts mid-capture, which is what was producing
  // the "ghost" doubled text in the previous PDFs.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fonts = (document as any).fonts
  if (fonts?.ready) {
    try {
      await fonts.ready
    } catch {
      /* noop */
    }
  }

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [SLIDE_W, SLIDE_H],
    compress: true,
  })

  for (let i = 0; i < slides.length; i++) {
    onProgress?.(i + 1, slides.length)
    const canvas = await captureSlide(slides[i])
    const img = canvas.toDataURL('image/jpeg', 0.92)
    if (i > 0) pdf.addPage([SLIDE_W, SLIDE_H], 'landscape')
    pdf.addImage(img, 'JPEG', 0, 0, SLIDE_W, SLIDE_H, undefined, 'FAST')
  }

  pdf.save(fileName)
}
