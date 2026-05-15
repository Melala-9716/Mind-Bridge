import { useEffect } from 'react'

export function usePerformanceMonitoring(pageName: string) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const run = () => {
      const perfData = window.performance.timing
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
      const connectTime = perfData.responseEnd - perfData.requestStart
      const renderTime = perfData.domComplete - perfData.domLoading
      const redirectTime = perfData.redirectEnd - perfData.redirectStart

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${pageName}:`, {
          pageLoadTime: `${pageLoadTime}ms`,
          connectTime: `${connectTime}ms`,
          renderTime: `${renderTime}ms`,
          redirectTime: `${redirectTime}ms`,
        })
      }

      if (process.env.NODE_ENV === 'production' && 'fetch' in window) {
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: pageName,
            metrics: { pageLoadTime, connectTime, renderTime },
          }),
        }).catch(() => {})
      }
    }

    if (document.readyState === 'complete') {
      run()
      return
    }

    window.addEventListener('load', run)
    return () => window.removeEventListener('load', run)
  }, [pageName])
}
