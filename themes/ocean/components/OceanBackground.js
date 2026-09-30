import { useEffect, useState } from 'react'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import OceanCanvas from './OceanCanvas'

export default function OceanBackground() {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(false)
  const [paused, setPaused] = useState(
    siteConfig('OCEAN_ANIMATION_PAUSED', false, CONFIG)
  )
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () =>
      setPaused(
        preference.matches ||
          siteConfig('OCEAN_ANIMATION_PAUSED', false, CONFIG) ||
          new URLSearchParams(window.location.search).get('paused') === '1'
      )
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])
  return (
    <div className='ocean-background' data-ready={ready} data-fallback={error}>
      <div
        className='ocean-viewport'
        style={{ '--ocean-poster': 'url("/themes/ocean/underwater.jpg")' }}
      >
        {siteConfig('OCEAN_ANIMATION_ENABLE', true, CONFIG) && !error && (
          <OceanCanvas
            paused={paused}
            fixedProgress={1}
            skyUrl={siteConfig(
              'OCEAN_SKY_IMAGE',
              CONFIG.OCEAN_SKY_IMAGE,
              CONFIG
            )}
            speed={
              Number(
                siteConfig(
                  'OCEAN_ANIMATION_SPEED',
                  CONFIG.OCEAN_ANIMATION_SPEED,
                  CONFIG
                )
              ) || 0
            }
            quality={siteConfig('OCEAN_QUALITY', 'auto', CONFIG)}
            onReady={() => setReady(true)}
            onError={() => setError(true)}
          />
        )}
      </div>
    </div>
  )
}
