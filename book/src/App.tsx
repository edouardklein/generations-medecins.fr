import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BookPage from './pages/BookPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/p/:slug" element={<BookPage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  )
}
