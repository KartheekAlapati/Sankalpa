import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App } from './App'
import { AuthBoundary } from './components/AuthBoundary'
import './styles.css'

const client = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30_000, gcTime: 300_000, refetchOnWindowFocus: false } } })
createRoot(document.getElementById('root')!).render(<StrictMode><QueryClientProvider client={client}><BrowserRouter><AuthBoundary><App /></AuthBoundary></BrowserRouter></QueryClientProvider></StrictMode>)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      const cacheLoadedAssets = () => {
        const urls = performance.getEntriesByType('resource').map(entry => entry.name).filter(url => new URL(url).origin === window.location.origin)
        navigator.serviceWorker.controller?.postMessage({ type: 'CACHE_ASSETS', urls })
      }
      const assetObserver = new PerformanceObserver(entries => {
        const urls = entries.getEntries().map(entry => entry.name).filter(url => new URL(url).origin === window.location.origin)
        navigator.serviceWorker.controller?.postMessage({ type: 'CACHE_ASSETS', urls })
      })
      assetObserver.observe({ type: 'resource', buffered: true })
      if (navigator.serviceWorker.controller) cacheLoadedAssets()
      else navigator.serviceWorker.addEventListener('controllerchange', cacheLoadedAssets, { once: true })
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) window.dispatchEvent(new CustomEvent('sankalpa:sw-update', { detail: { registration } }))
        })
      })
    }).catch(() => { /* Online app remains usable if registration fails. */ })
  })
}
