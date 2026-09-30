import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import Sidebar from './Sidebar'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { getListRestoration, useRestoreListPosition } from '../navigationState'

export default function PageFrame({
  children,
  title,
  eyebrow = 'THE OCEAN JOURNAL',
  home = false,
  immersive = false,
  ...props
}) {
  const { fullWidth } = useGlobal()
  const router = useRouter()
  const [restoration] = useState(() => getListRestoration(router.asPath))
  useRestoreListPosition(router, restoration)
  const sidebar = !fullWidth && siteConfig('OCEAN_SIDEBAR', true, CONFIG)
  const notice = home &&
    siteConfig('OCEAN_NOTICE_ENABLE', true, CONFIG) &&
    props.notice?.blockMap && (
      <section className='ocean-panel ocean-notice'>
        <h3>{props.notice.title || '公告'}</h3>
        <NotionPage post={props.notice} />
      </section>
    )
  return (
    <section className={`ocean-content ${home ? 'ocean-content-home' : ''}`}>
      {title && (
        <div
          id={home ? 'ocean-posts' : undefined}
          className='ocean-page-heading'
        >
          <p className='ocean-kicker'>{eyebrow}</p>
          {home ? <h2>{title}</h2> : <h1>{title}</h1>}
        </div>
      )}
      <div
        className={`ocean-content-grid ${sidebar ? '' : 'ocean-content-wide'}`}
      >
        <div className='ocean-content-main'>
          {!immersive && notice}
          {props.slotTop}
          {children}
          {immersive && notice}
          {!sidebar && props.rightAreaSlot}
        </div>
        {sidebar && <Sidebar {...props} />}
      </div>
    </section>
  )
}
