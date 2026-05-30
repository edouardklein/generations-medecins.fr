import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const SLIDE_W = 1600
const SLIDE_H = 900

export async function exportBookToPdf(opts: {
  slides: HTMLElement[]
  fileName: string
  onProgress?: (current: number, total: number) => void
}): Promise<void> {
  const { slides, fileName, onProgress } = opts
  if (slides.length === 0) return

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [SLIDE_W, SLIDE_H],
    compress: true,
  })

  for (let i = 0; i < slides.length; i++) {
    onProgress?.(i + 1, slides.length)
    const node = slides[i]
    // Render at native 1600x900 to maximize fidelity regardless of viewport scale.
    const canvas = await html2canvas(node, {
      backgroundColor: null,
      scale: 2,
      width: SLIDE_W,
      height: SLIDE_H,
      windowWidth: SLIDE_W,
      windowHeight: SLIDE_H,
      useCORS: true,
      logging: false,
    })
    const img = canvas.toDataURL('image/jpeg', 0.92)
    if (i > 0) pdf.addPage([SLIDE_W, SLIDE_H], 'landscape')
    pdf.addImage(img, 'JPEG', 0, 0, SLIDE_W, SLIDE_H, undefined, 'FAST')
  }

  pdf.save(fileName)
}
