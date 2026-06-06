import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Build marker — pinned at build time. If the console shows an old value,
// Netlify is serving a stale deploy and a hard refresh / cache clear is needed.
const BUILD_AT = new Date().toISOString()
console.info(`[gm-book] build ${BUILD_AT}`)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
