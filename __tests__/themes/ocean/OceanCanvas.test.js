import { act, render, waitFor } from '@testing-library/react'
import OceanCanvas from '@/themes/ocean/components/OceanCanvas'
import { createOceanRenderer } from '@/themes/ocean/engine/OceanRenderer'

jest.mock('@/themes/ocean/engine/OceanRenderer', () => ({
  createOceanRenderer: jest.fn()
}))

describe('Ocean renderer lifecycle', () => {
  let onIntersection
  let observer
  let originalObserver
  let renderer
  const props = {
    paused: false,
    rootRef: { current: null },
    skyUrl: '/themes/ocean/sky-panorama.jpg',
    speed: 0.5,
    quality: 'auto'
  }

  beforeEach(() => {
    originalObserver = global.IntersectionObserver
    observer = { observe: jest.fn(), disconnect: jest.fn() }
    global.IntersectionObserver = jest.fn(callback => {
      onIntersection = callback
      return observer
    })
    renderer = { setPaused: jest.fn(), dispose: jest.fn() }
    createOceanRenderer.mockResolvedValue(renderer)
  })

  afterEach(() => {
    global.IntersectionObserver = originalObserver
    delete window.__ocean
  })

  it('stops rendering when the canvas only touches the viewport edge', async () => {
    const { unmount } = render(<OceanCanvas {...props} />)
    await waitFor(() => expect(createOceanRenderer).toHaveBeenCalled())
    const options = createOceanRenderer.mock.calls[0][1]
    onIntersection([
      { isIntersecting: true, intersectionRect: { width: 100, height: 100 } }
    ])
    expect(options.isVisible()).toBe(true)
    onIntersection([
      { isIntersecting: true, intersectionRect: { width: 100, height: 0 } }
    ])
    expect(options.isVisible()).toBe(false)
    expect(global.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: [0, 0.001] }
    )
    unmount()
    expect(options.isVisible()).toBe(false)
    expect(observer.disconnect).toHaveBeenCalledTimes(1)
    expect(renderer.dispose).toHaveBeenCalledTimes(1)
  })

  it('disposes a renderer that finishes initializing after navigation', async () => {
    let resolveRenderer
    createOceanRenderer.mockReturnValue(
      new Promise(resolve => {
        resolveRenderer = resolve
      })
    )
    const onReady = jest.fn()
    const { unmount } = render(<OceanCanvas {...props} onReady={onReady} />)
    await waitFor(() => expect(createOceanRenderer).toHaveBeenCalled())
    const options = createOceanRenderer.mock.calls[0][1]
    unmount()
    const activeScene = { state: { ready: true } }
    window.__ocean = activeScene
    await act(async () => {
      options.onReady()
      resolveRenderer(renderer)
      await Promise.resolve()
    })
    expect(onReady).not.toHaveBeenCalled()
    expect(renderer.dispose).toHaveBeenCalledTimes(1)
    expect(window.__ocean).toBe(activeScene)
  })

  it('uses the latest pause state when asynchronous initialization completes', async () => {
    let resolveRenderer
    createOceanRenderer.mockReturnValue(
      new Promise(resolve => {
        resolveRenderer = resolve
      })
    )
    const { rerender } = render(<OceanCanvas {...props} />)
    await waitFor(() => expect(createOceanRenderer).toHaveBeenCalled())
    rerender(<OceanCanvas {...props} paused />)
    await act(async () => {
      resolveRenderer(renderer)
      await Promise.resolve()
    })
    expect(renderer.setPaused).toHaveBeenLastCalledWith(true)
    rerender(<OceanCanvas {...props} />)
    expect(renderer.setPaused).toHaveBeenLastCalledWith(false)
  })

  it('keeps dive progress independent of the number of articles', async () => {
    const root = {
      getBoundingClientRect: () => ({ top: -window.innerHeight * 0.6 }),
      offsetHeight: 8000
    }
    render(<OceanCanvas {...props} rootRef={{ current: root }} />)
    await waitFor(() => expect(createOceanRenderer).toHaveBeenCalled())
    const options = createOceanRenderer.mock.calls[0][1]
    expect(options.getProgress()).toBeCloseTo(0.6)
    root.offsetHeight = 16000
    expect(options.getProgress()).toBeCloseTo(0.6)
  })

  it('keeps reading pages at full depth without a scroll container', async () => {
    render(<OceanCanvas {...props} rootRef={undefined} fixedProgress={1} />)
    await waitFor(() => expect(createOceanRenderer).toHaveBeenCalled())
    const options = createOceanRenderer.mock.calls[0][1]
    expect(options.fixedProgress).toBe(1)
    expect(options.getProgress()).toBe(1)
  })

  it('starts a returning scene with the saved camera and wave time', async () => {
    render(<OceanCanvas {...props} initialProgress={1} initialTime={38} />)
    await waitFor(() => expect(createOceanRenderer).toHaveBeenCalled())
    const options = createOceanRenderer.mock.calls[0][1]
    expect(options.initialProgress).toBe(1)
    expect(options.initialTime).toBe(38)
  })
})
