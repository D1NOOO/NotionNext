import { act, renderHook } from '@testing-library/react'
import { EventEmitter } from 'events'
import {
  getListRestoration,
  returnToList,
  useOceanNavigation,
  useRestoreListPosition
} from '@/themes/ocean/navigationState'

describe('Ocean return navigation', () => {
  let fixture
  let router
  beforeEach(() => {
    sessionStorage.clear()
    history.replaceState({ key: 'list-entry' }, '', '/?theme=ocean#ocean-posts')
    fixture = document.createElement('div')
    fixture.id = 'theme-ocean'
    fixture.innerHTML = '<div id="posts-wrapper" data-visible-pages="3"></div>'
    document.body.appendChild(fixture)
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 2100
    })
    window.__ocean = { state: { progress: 1, time: 38 }, paused: true }
    router = {
      asPath: '/?theme=ocean#ocean-posts',
      locales: ['zh-CN', 'en-US'],
      events: new EventEmitter(),
      back: jest.fn(),
      push: jest.fn()
    }
  })
  afterEach(() => {
    fixture.remove()
    delete window.__ocean
  })
  function openArticle() {
    const hook = renderHook(() => useOceanNavigation(router))
    act(() =>
      router.events.emit(
        'routeChangeStart',
        '/zh-CN/article/example?theme=ocean'
      )
    )
    history.replaceState(
      { key: 'article-entry' },
      '',
      '/article/example?theme=ocean'
    )
    act(() =>
      router.events.emit(
        'routeChangeComplete',
        '/zh-CN/article/example?theme=ocean'
      )
    )
    hook.unmount()
    router.asPath = '/article/example?theme=ocean'
    fixture.innerHTML = '<article class="ocean-article"></article>'
    return renderHook(() => useOceanNavigation(router))
  }
  it('returns through history and preserves the selected list position despite locale-prefixed events', () => {
    const hook = openArticle()
    returnToList(router)
    expect(router.back).toHaveBeenCalledTimes(1)
    expect(router.push).not.toHaveBeenCalled()
    expect(getListRestoration('/?theme=ocean#ocean-posts')).toMatchObject({
      y: 2100,
      progress: 1,
      time: 38,
      paused: true,
      visiblePages: 3
    })
    hook.unmount()
  })
  it('captures browser back before routing and restores after Next applies hash scrolling', () => {
    const hook = openArticle()
    history.replaceState({ key: 'list-entry' }, '', '/?theme=ocean#ocean-posts')
    const event = new PopStateEvent('popstate', {
      state: { key: 'list-entry', __N: true, options: { scroll: true } }
    })
    act(() => window.dispatchEvent(event))
    const snapshot = getListRestoration('/?theme=ocean#ocean-posts')
    expect(snapshot?.y).toBe(2100)
    router.asPath = snapshot.url
    fixture.innerHTML = '<div id="ocean-posts"></div>'
    const scroll = jest.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const frames = []
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(fn => {
      frames.push(fn)
      return frames.length
    })
    const listHook = renderHook(() => useRestoreListPosition(router, snapshot))
    expect(document.getElementById('ocean-posts')).toBeNull()
    expect(scroll).toHaveBeenLastCalledWith({ top: 2100, behavior: 'instant' })
    act(() =>
      router.events.emit(
        'routeChangeComplete',
        '/zh-CN/?theme=ocean#ocean-posts'
      )
    )
    act(() => frames.at(-1)())
    expect(document.getElementById('ocean-posts')).not.toBeNull()
    expect(scroll).toHaveBeenCalledTimes(2)
    listHook.unmount()
    hook.unmount()
  })
  it('does not restore an old list on a fresh homepage navigation', () => {
    const hook = openArticle()
    act(() => router.events.emit('routeChangeStart', '/zh-CN/?theme=ocean'))
    expect(getListRestoration('/?theme=ocean')).toBeNull()
    hook.unmount()
  })
})
