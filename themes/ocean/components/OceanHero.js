import { useCallback, useEffect, useRef, useState } from 'react'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import { readingPhase } from '../sceneProgress'
import { useRouter } from 'next/router'
import { getListRestoration } from '../navigationState'
import Header from './Header'
import OceanCanvas from './OceanCanvas'

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

function Arrow({ down = false, className = '' }) {
  return (
    <svg
      className={className}
      width='21'
      height='21'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <path d={down ? 'M12 3v17m-7-7 7 7 7-7' : 'M4 12h15m-6-6 6 6-6 6'} />
    </svg>
  )
}

function HeroTypography({ title, eyebrow, description }) {
  return (
    <>
      <p className='hero__eyebrow'>{eyebrow}</p>
      <div className='hero__title'>{title}</div>
      <p className='hero__description'>{description}</p>
    </>
  )
}

export default function OceanHero(props) {
  const router = useRouter()
  const [restoration] = useState(() => getListRestoration(router.asPath))
  const rootRef = useRef(null)
  const dryRef = useRef(null)
  const wetRef = useRef(null)
  const progressRef = useRef(restoration?.progress || 0)
  const waterAwareRef = useRef([])
  const distortionRef = useRef(null)
  const animation = siteConfig('OCEAN_ANIMATION_ENABLE', true, CONFIG)
  const initialPaused = siteConfig('OCEAN_ANIMATION_PAUSED', false, CONFIG)
  const journalStart = clamp(
    Number(siteConfig('OCEAN_JOURNAL_START', 0.6, CONFIG)) || 0.6,
    0.25,
    0.85
  )
  const [paused, setPaused] = useState(restoration?.paused ?? initialPaused)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const typography = {
    title: String(
      siteConfig('OCEAN_HERO_TITLE', CONFIG.OCEAN_HERO_TITLE, CONFIG)
    ).replace(/\\n/g, '\n'),
    eyebrow: siteConfig(
      'OCEAN_HERO_EYEBROW',
      CONFIG.OCEAN_HERO_EYEBROW,
      CONFIG
    ),
    description: String(
      siteConfig(
        'OCEAN_HERO_DESCRIPTION',
        CONFIG.OCEAN_HERO_DESCRIPTION,
        CONFIG
      )
    ).replace(/\\n/g, '\n')
  }

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPaused(
      initialPaused ||
        restoration?.paused ||
        preference.matches ||
        new URLSearchParams(window.location.search).get('paused') === '1'
    )
    const onPreference = event => {
      if (event.matches) setPaused(true)
    }
    const measureComponents = () => {
      waterAwareRef.current = Array.from(
        rootRef.current?.querySelectorAll('[data-water-aware]') || [],
        element => {
          const rect = element.getBoundingClientRect()
          return {
            element,
            x: clamp((rect.left + rect.width / 2) / window.innerWidth),
            y: (rect.top + rect.height / 2) / window.innerHeight,
            amount: Number(element.dataset.waterAware) || 1
          }
        }
      )
    }
    measureComponents()
    distortionRef.current = rootRef.current?.querySelector('feTurbulence')
    const resizeObserver = new ResizeObserver(measureComponents)
    resizeObserver.observe(rootRef.current)
    const onKey = event => {
      if (
        event.code !== 'Space' ||
        event.target !== document.body ||
        !animation
      )
        return
      const rect = rootRef.current?.getBoundingClientRect()
      if (!rect || rect.bottom <= 0 || rect.top >= window.innerHeight) return
      event.preventDefault()
      setPaused(value => !value)
    }
    preference.addEventListener('change', onPreference)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', measureComponents)
    return () => {
      preference.removeEventListener('change', onPreference)
      resizeObserver.disconnect()
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', measureComponents)
    }
  }, [initialPaused, animation, restoration])

  const scrollTo = useCallback(progress => {
    const root = rootRef.current
    if (!root) return
    const top =
      window.scrollY +
      root.getBoundingClientRect().top +
      window.innerHeight * progress
    window.scrollTo({
      top,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth'
    })
  }, [])

  const handleFrame = useCallback(
    frame => {
      const root = rootRef.current
      if (!root) return
      const {
        progress = 0,
        time = 0,
        immersion = 0,
        drift = {},
        waterline = []
      } = frame
      progressRef.current = progress
      const phase = readingPhase(progress, journalStart)
      root.style.setProperty('--hero-opacity', phase.heroOpacity)
      root.style.setProperty('--journal-opacity', phase.journalOpacity)
      root.dataset.reading = String(phase.reading)
      root.style.setProperty('--progress', progress.toFixed(4))
      root.style.setProperty('--immersion', immersion.toFixed(4))
      root.style.setProperty('--drift-x', `${drift.x || 0}px`)
      root.style.setProperty('--drift-y', `${drift.y || 0}px`)
      root.style.setProperty('--drift-rotation', `${drift.rotation || 0}deg`)
      root.dataset.deep = String(progress > 0.73)
      root.dataset.return = String(progress > 0.88)
      if (waterline.length > 1) {
        const points = Array.from(
          waterline,
          (height, index) =>
            `${((index / (waterline.length - 1)) * 100).toFixed(3)}% ${(clamp(height) * 100).toFixed(3)}%`
        )
        if (dryRef.current)
          dryRef.current.style.clipPath = `polygon(0% 0%, 100% 0%, ${points.slice().reverse().join(', ')})`
        if (wetRef.current)
          wetRef.current.style.clipPath = `polygon(${points.join(', ')}, 100% 100%, 0% 100%)`
        for (const { element, x, y, amount } of waterAwareRef.current) {
          const index = Math.min(
            waterline.length - 1,
            Math.round(x * (waterline.length - 1))
          )
          const wet = clamp((y - waterline[index] + 0.025) / 0.05)
          element.style.setProperty(
            '--local-x',
            `${(drift.x || 0) * wet * amount}px`
          )
          element.style.setProperty(
            '--local-y',
            `${(drift.y || 0) * wet * amount}px`
          )
          element.style.setProperty(
            '--local-rotation',
            `${(drift.rotation || 0) * wet * amount}deg`
          )
          element.dataset.wet = String(wet > 0.5)
        }
      }
      distortionRef.current?.setAttribute(
        'baseFrequency',
        `${(0.0075 + Math.sin(time * 0.32) * 0.0009).toFixed(5)} ${(0.026 + Math.cos(time * 0.27) * 0.0017).toFixed(5)}`
      )
    },
    [journalStart]
  )
  const dive = () => scrollTo(progressRef.current > 0.88 ? 0 : 1)
  const staticScene = !animation || Boolean(error)

  useEffect(() => {
    if (
      restoration ||
      (!ready && !staticScene) ||
      window.location.hash !== '#ocean-posts'
    )
      return
    // The server may render the Notion-configured theme before Ocean hydrates.
    // Resolve incoming journal hashes once this theme's heading exists.
    const frame = window.requestAnimationFrame(() => {
      rootRef.current
        ?.querySelector('#ocean-posts')
        ?.scrollIntoView({ block: 'start', behavior: 'instant' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [ready, staticScene, restoration])

  useEffect(() => {
    if (!staticScene) return
    let pending
    const update = () => {
      pending = undefined
      const root = rootRef.current
      if (!root) return
      handleFrame({
        progress: clamp(
          -root.getBoundingClientRect().top / Math.max(1, window.innerHeight)
        )
      })
    }
    const schedule = () => {
      if (pending === undefined) pending = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (pending !== undefined) window.cancelAnimationFrame(pending)
    }
  }, [staticScene, handleFrame])

  return (
    <section
      className={`ocean-experience ${staticScene ? 'ocean-experience-static' : ''}`}
      ref={rootRef}
      data-ready={ready}
      data-fallback={Boolean(error)}
      data-deep={restoration?.progress > 0.73}
      data-return={restoration?.progress > 0.88}
      data-reading={
        readingPhase(restoration?.progress || 0, journalStart).reading
      }
      style={{
        '--ocean-journal-start': journalStart,
        '--hero-opacity': readingPhase(restoration?.progress || 0, journalStart)
          .heroOpacity,
        '--journal-opacity': readingPhase(
          restoration?.progress || 0,
          journalStart
        ).journalOpacity
      }}
    >
      <div
        className='ocean-viewport'
        style={{
          '--ocean-poster': `url("${restoration?.progress >= journalStart ? '/themes/ocean/underwater.jpg' : siteConfig('OCEAN_HERO_POSTER', CONFIG.OCEAN_HERO_POSTER, CONFIG)}")`
        }}
      >
        {animation && !error && (
          <OceanCanvas
            rootRef={rootRef}
            paused={paused}
            initialProgress={restoration?.progress}
            initialTime={restoration?.time}
            onFrame={handleFrame}
            onReady={() => setReady(true)}
            onError={message => {
              setError(message)
              setReady(true)
            }}
            skyUrl={siteConfig(
              'OCEAN_SKY_IMAGE',
              CONFIG.OCEAN_SKY_IMAGE,
              CONFIG
            )}
            speed={
              Number(siteConfig('OCEAN_ANIMATION_SPEED', 0.5, CONFIG)) || 0
            }
            quality={siteConfig('OCEAN_QUALITY', 'auto', CONFIG)}
          />
        )}
        <svg
          className='filter-definitions'
          aria-hidden='true'
          width='0'
          height='0'
        >
          <defs>
            <filter
              id='ocean-underwater-refraction'
              x='-8%'
              y='-12%'
              width='116%'
              height='124%'
              colorInterpolationFilters='sRGB'
            >
              <feTurbulence
                type='fractalNoise'
                baseFrequency='0.008 0.027'
                numOctaves='2'
                seed='11'
                result='ripple'
              />
              <feDisplacementMap
                in='SourceGraphic'
                in2='ripple'
                scale='7'
                xChannelSelector='R'
                yChannelSelector='G'
              />
            </filter>
          </defs>
        </svg>
      </div>
      <div className='scene-ui'>
        <a className='skip-link' href='#ocean-posts'>
          跳过海洋体验，阅读文章
        </a>
        <Header {...props} scene />
        <div
          className='hero-visual hero-visual--dry'
          ref={dryRef}
          aria-hidden='true'
        >
          <div className='hero__content'>
            <HeroTypography {...typography} />
          </div>
        </div>
        <div
          className='hero-visual hero-visual--wet'
          ref={wetRef}
          aria-hidden='true'
        >
          <div className='hero__content'>
            <HeroTypography {...typography} />
          </div>
        </div>
        <div className='hero-interaction'>
          <h1 className='sr-only'>{typography.title}</h1>
          <p className='sr-only'>
            {typography.description} 向下滚动，经过海面进入水下。
          </p>
          <div className='hero__content'>
            <div className='hero__layout-spacer' aria-hidden='true'>
              <HeroTypography {...typography} />
            </div>
            <div className='hero__actions water-aware' data-water-aware='0.72'>
              <button
                className='primary-action'
                type='button'
                onClick={
                  staticScene
                    ? () =>
                        document.getElementById('ocean-posts')?.scrollIntoView({
                          behavior: window.matchMedia(
                            '(prefers-reduced-motion: reduce)'
                          ).matches
                            ? 'auto'
                            : 'smooth'
                        })
                    : dive
                }
              >
                <span className='action-dive'>
                  {staticScene ? '阅读文章' : 'Explore the ocean'}
                </span>
                <span className='action-return'>Return to the surface</span>
                <Arrow />
              </button>
              <span className='hero__invitation'>
                {siteConfig(
                  'OCEAN_HERO_INVITATION',
                  CONFIG.OCEAN_HERO_INVITATION,
                  CONFIG
                )}
              </span>
            </div>
          </div>
        </div>
        <div className='depth-marker' aria-hidden='true'>
          <span>01</span>
          <div className='depth-marker__track'>
            <i />
          </div>
          <span>02</span>
        </div>
        <div
          className='below-caption water-aware'
          data-water-aware='0.65'
          aria-hidden='true'
        >
          BELOW THE SURFACE
        </div>
        <div className='scene-footer' id='ocean-controls'>
          <div className='playback water-aware' data-water-aware='0.35'>
            {animation && !error && (
              <button
                className='playback__toggle'
                type='button'
                aria-label={paused ? '播放海洋动画' : '暂停海洋动画'}
                aria-pressed={paused}
                onClick={() => setPaused(value => !value)}
              >
                <svg
                  width='22'
                  height='22'
                  viewBox='0 0 24 24'
                  fill='none'
                  aria-hidden='true'
                >
                  {paused ? (
                    <path d='m9 6 9 6-9 6V6Z' fill='currentColor' />
                  ) : (
                    <path
                      d='M9 6v12m6-12v12'
                      stroke='currentColor'
                      strokeWidth='1.8'
                    />
                  )}
                </svg>
              </button>
            )}
            <span>
              {error
                ? '静态海洋 · 动画暂不可用'
                : staticScene || paused
                  ? 'A MOMENT OF STILLNESS'
                  : 'LIVE AT SEA'}
            </span>
          </div>
          <a
            className='scroll-cue water-aware'
            data-water-aware='0.35'
            href='#ocean-posts'
          >
            <span>READ THE JOURNAL</span>
            <Arrow down className='scroll-cue__arrow' />
          </a>
        </div>
      </div>
      {animation && !ready && (
        <div className='scene-loading' role='status'>
          <span>A moment by the ocean</span>
          <i />
        </div>
      )}
      <div className='ocean-journal-layer'>{props.children}</div>
    </section>
  )
}
