import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BookViewer from '../components/BookViewer'
import type { BookEnvelope } from '../lib/types'

export default function BookPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [envelope, setEnvelope] = useState<BookEnvelope | null>(null)

  useEffect(() => {
    if (!slug) {
      navigate('/', { replace: true })
      return
    }
    const cached = sessionStorage.getItem(`gm-book:${slug}`)
    if (!cached) {
      navigate('/', { replace: true })
      return
    }
    try {
      setEnvelope(JSON.parse(cached) as BookEnvelope)
    } catch {
      navigate('/', { replace: true })
    }
  }, [slug, navigate])

  if (!envelope) {
    return (
      <div className="min-h-screen flex items-center justify-center text-navy-200">
        <div className="animate-pulse">Chargement…</div>
      </div>
    )
  }

  return <BookViewer envelope={envelope} />
}
