import { useEffect, useLayoutEffect } from 'react'

const entries = new Map()
let pending = null
let lastOrigin = null
const useBeforePaint =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

function read(key) {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(window.sessionStorage.getItem(key))
  } catch {
    return null
  }
}
function write(key, value) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* In-memory navigation still works without storage. */
  }
}
function currentUrl() {
  return (
    window.location.pathname + window.location.search + window.location.hash
  )
}
function entryKey() {
  return window.history.state?.key || currentUrl()
}
function routeUrl(locales, value) {
  const url = new URL(value, window.location.origin)
  const localePrefix = (locales || []).find(
    locale =>
      url.pathname === `/${locale}` || url.pathname.startsWith(`/${locale}/`)
  )
  if (localePrefix)
    url.pathname = url.pathname.slice(localePrefix.length + 1) || '/'
  return url.pathname + url.search + url.hash
}
function validSnapshot(value) {
  return (
    value &&
    typeof value.url === 'string' &&
    value.url.startsWith('/') &&
    !value.url.startsWith('//') &&
    Number.isFinite(value.y) &&
    value.y >= 0
  )
}
function origin() {
  lastOrigin ||= read('ocean:list-origin')
  return validSnapshot(lastOrigin) ? lastOrigin : null
}
export function getListRestoration(url) {
  return pending?.url === url ? pending : null
}

// Only history traversal or the explicit return button requests restoration.
// A fresh visit to the homepage still starts at the surface.
export function useOceanNavigation(router) {
  useEffect(() => {
    const key = entryKey()
    const url = router.asPath
    let fromList = false
    const start = value => {
      const target = routeUrl(router.locales, value)
      const isList =
        document.querySelector(
          '#theme-ocean #posts-wrapper, #theme-ocean .ocean-archive'
        ) && !document.querySelector('#theme-ocean .ocean-article')
      fromList = Boolean(isList)
      if (isList) {
        const scene = window.__ocean
        const snapshot = {
          url,
          key,
          y: window.scrollY,
          progress: scene?.state.progress ?? 1,
          time: scene?.state.time ?? 12,
          paused: scene?.paused ?? false,
          visiblePages:
            Number(
              document.getElementById('posts-wrapper')?.dataset.visiblePages
            ) || 1,
          articleUrl: target
        }
        entries.set(key, snapshot)
        write(`ocean:list:${key}`, snapshot)
        lastOrigin = snapshot
        write('ocean:list-origin', snapshot)
      } else if (document.querySelector('#theme-ocean .ocean-article')) {
        const source = origin()
        if (source?.articleUrl === url) {
          lastOrigin = { ...source, articleUrl: target, articleKey: null }
          write('ocean:list-origin', lastOrigin)
        }
      }
      if (pending?.url !== target) pending = null
    }
    const complete = value => {
      const target = routeUrl(router.locales, value)
      if (fromList && origin()?.articleUrl === target) {
        lastOrigin = { ...origin(), articleKey: entryKey() }
        write('ocean:list-origin', lastOrigin)
      }
    }
    const pop = event => {
      const snapshot =
        entries.get(event.state?.key) || read(`ocean:list:${event.state?.key}`)
      pending =
        validSnapshot(snapshot) &&
        snapshot.url === routeUrl(router.locales, currentUrl())
          ? snapshot
          : null
    }
    window.addEventListener('popstate', pop, true)
    router.events.on('routeChangeStart', start)
    router.events.on('routeChangeComplete', complete)
    return () => {
      window.removeEventListener('popstate', pop, true)
      router.events.off('routeChangeStart', start)
      router.events.off('routeChangeComplete', complete)
    }
  }, [router.events, router.asPath, router.locales])
}

export function useRestoreListPosition(router, snapshot) {
  useBeforePaint(() => {
    if (!snapshot || snapshot.url !== router.asPath) return
    // Next's route handler and AppContainer both apply hash scrolling after
    // layout effects. Keep the journal anchor unavailable until the first paint
    // so those handlers cannot replace the saved card position with its title.
    const anchor = document.getElementById('ocean-posts')
    anchor?.removeAttribute('id')
    const restoreAnchor = () => {
      if (anchor?.isConnected) anchor.id = 'ocean-posts'
    }
    const restore = () =>
      window.scrollTo({ top: snapshot.y, behavior: 'instant' })
    restore()
    let frame = window.requestAnimationFrame(() => {
      restoreAnchor()
      restore()
    })
    const complete = () => {
      // Next applies hash scrolling after routeChangeComplete. Restore before paint.
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        restoreAnchor()
        restore()
      })
    }
    router.events.on('routeChangeComplete', complete)
    return () => {
      window.cancelAnimationFrame(frame)
      restoreAnchor()
      router.events.off('routeChangeComplete', complete)
      if (pending === snapshot) pending = null
    }
  }, [router.events, router.asPath, snapshot])
}

export function returnToList(router) {
  const source = origin()
  if (source?.articleUrl === router.asPath) {
    pending = source
    if (source.articleKey && source.articleKey === entryKey()) {
      router.back()
      return
    }
    router.push(source.url, undefined, { scroll: false })
    return
  }
  const params = new URLSearchParams(window.location.search)
  params.set('theme', 'ocean')
  const url = `/?${params.toString()}#ocean-posts`
  pending = {
    url,
    y: window.innerHeight,
    progress: 1,
    time: window.__ocean?.state.time ?? 12,
    visiblePages: 1
  }
  router.push(url, undefined, { scroll: false })
}
