import { useEffect, useRef } from 'react'

// The renderer and Three.js are downloaded only when an ocean scene mounts.
let rendererModule

export default function OceanCanvas({
  paused,
  rootRef,
  skyUrl,
  speed,
  quality,
  fixedProgress,
  initialProgress,
  initialTime,
  onFrame,
  onReady,
  onError
}) {
  const canvasRef = useRef(null)
  const rendererRef = useRef(null)
  const callbacksRef = useRef({ onFrame, onReady, onError })
  callbacksRef.current = { onFrame, onReady, onError }
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  useEffect(() => {
    let cancelled = false
    let visible = true
    const canvas = canvasRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible =
          entry.isIntersecting &&
          entry.intersectionRect.width > 0 &&
          entry.intersectionRect.height > 0
      },
      { threshold: [0, 0.001] }
    )
    observer.observe(canvas)
    rendererModule ||= import('../engine/OceanRenderer')
    rendererModule
      .then(({ createOceanRenderer }) => {
        if (cancelled) return null
        return createOceanRenderer(canvas, {
          skyUrl,
          speed,
          quality,
          initialPaused: pausedRef.current,
          fixedProgress,
          initialProgress,
          initialTime,
          getProgress: () => {
            if (fixedProgress !== undefined) return fixedProgress
            const root = rootRef?.current
            if (!root) return 0
            return (
              -root.getBoundingClientRect().top /
              Math.max(1, window.innerHeight)
            )
          },
          isVisible: () => visible && !cancelled,
          onFrame: frame => {
            if (!cancelled) callbacksRef.current.onFrame?.(frame)
          },
          onReady: () => {
            if (!cancelled) callbacksRef.current.onReady?.()
          },
          onError: message => {
            if (!cancelled) callbacksRef.current.onError?.(message)
          }
        })
      })
      .then(renderer => {
        if (!renderer) return
        if (cancelled) {
          renderer.dispose()
          return
        }
        rendererRef.current = renderer
        window.__ocean = renderer
        renderer.setPaused(pausedRef.current)
      })
      .catch(error => {
        if (!cancelled) callbacksRef.current.onError?.(error.message)
      })
    return () => {
      cancelled = true
      observer.disconnect()
      rendererRef.current?.dispose()
      if (window.__ocean === rendererRef.current) delete window.__ocean
      rendererRef.current = null
    }
  }, [
    rootRef,
    skyUrl,
    speed,
    quality,
    fixedProgress,
    initialProgress,
    initialTime
  ])

  useEffect(() => {
    rendererRef.current?.setPaused(paused)
  }, [paused])
  return (
    <canvas
      ref={canvasRef}
      className='ocean-canvas'
      aria-label='海面与水下的实时海洋'
      role='img'
    />
  )
}
