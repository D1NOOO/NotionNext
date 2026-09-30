import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CONFIG from '../config'
import ReturnToList from './ReturnToList'

export function OceanMark() {
  return (
    <svg
      width='73'
      height='30'
      viewBox='0 0 73 30'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M2 19c11 2 18-13 30-10 8 1 15 11 29 8C45 27 38 9 25 14 15 18 10 22 2 19Z'
        fill='currentColor'
      />
      <path
        d='M18 19c11-4 19 7 31 5 9-1 15-5 22-9-8 10-21 16-34 9-6-4-12-7-19-5Z'
        fill='currentColor'
      />
    </svg>
  )
}

function MenuLink({ item, closeMenu }) {
  const title = item.name || item.title
  if (item.subMenus?.length) {
    return (
      <details className='ocean-dropdown'>
        <summary>
          {title}
          <svg
            className='ocean-chevron'
            width='14'
            height='14'
            viewBox='0 0 24 24'
            fill='none'
            aria-hidden='true'
          >
            <path d='m6 9 6 6 6-6' stroke='currentColor' strokeWidth='1.7' />
          </svg>
        </summary>
        <div className='ocean-dropdown-items'>
          {item.href && !['#', '/#'].includes(item.href) && (
            <SmartLink href={item.href} onClick={closeMenu}>
              {title}
            </SmartLink>
          )}
          {item.subMenus.map((child, index) => (
            <MenuLink
              key={child.id || index}
              item={child}
              closeMenu={closeMenu}
            />
          ))}
        </div>
      </details>
    )
  }
  return (
    <SmartLink
      href={item.href === '/' ? '/#ocean-posts' : item.href || item.url || '/'}
      onClick={closeMenu}
    >
      {title}
    </SmartLink>
  )
}

export default function Header({ customNav, customMenu, post, scene = false }) {
  const { locale } = useGlobal()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  useEffect(() => setMobileOpen(false), [router.asPath])
  const defaults = [
    { name: locale?.NAV?.INDEX || '首页', href: '/' },
    {
      name: locale?.NAV?.ARCHIVE || '归档',
      href: '/archive',
      show: siteConfig('OCEAN_MENU_ARCHIVE', true, CONFIG)
    },
    {
      name: locale?.COMMON?.CATEGORY || '分类',
      href: '/category',
      show: siteConfig('OCEAN_MENU_CATEGORY', true, CONFIG)
    },
    {
      name: locale?.COMMON?.TAGS || '标签',
      href: '/tag',
      show: siteConfig('OCEAN_MENU_TAG', true, CONFIG)
    },
    {
      name: locale?.NAV?.SEARCH || '搜索',
      href: '/search',
      show: siteConfig('OCEAN_MENU_SEARCH', true, CONFIG)
    }
  ].filter(item => item.show !== false)
  const links =
    siteConfig('CUSTOM_MENU') && customMenu?.length
      ? customMenu
      : [...defaults, ...(customNav || [])]
  const closeMenu = event => {
    setMobileOpen(false)
    let dropdown = event?.currentTarget?.closest('details')
    while (dropdown) {
      dropdown.removeAttribute('open')
      dropdown = dropdown.parentElement?.closest('details')
    }
  }

  return (
    <header
      className={`ocean-header ${scene ? 'ocean-header-scene water-aware' : ''}`}
      data-water-aware={scene ? '0.27' : undefined}
    >
      <SmartLink
        href='/'
        className='ocean-brand'
        aria-label={`${siteConfig('TITLE')} · 首页`}
      >
        <OceanMark />
        <span>{siteConfig('TITLE') || 'OCEAN'}</span>
      </SmartLink>
      <nav className='ocean-desktop-nav' aria-label='主导航'>
        {links.map((item, index) => (
          <MenuLink key={item.id || index} item={item} />
        ))}
      </nav>
      <div className='ocean-header-actions'>
        {post?.type === 'Post' ? (
          <ReturnToList className='ocean-explore-link' />
        ) : (
          <SmartLink
            href={scene ? '#ocean-posts' : '/'}
            className='ocean-explore-link'
          >
            {scene ? '阅读文章' : '回到海面'} <span aria-hidden='true'>↗</span>
          </SmartLink>
        )}
        <button
          type='button'
          className='ocean-menu-button'
          onClick={() => setMobileOpen(value => !value)}
          aria-expanded={mobileOpen}
          aria-controls={scene ? 'ocean-scene-menu' : 'ocean-menu'}
          aria-label='展开导航'
        >
          {mobileOpen ? '关闭' : '菜单'}
        </button>
      </div>
      {mobileOpen && (
        <nav
          id={scene ? 'ocean-scene-menu' : 'ocean-menu'}
          className='ocean-mobile-nav'
          aria-label='移动端导航'
        >
          {links.map((item, index) => (
            <MenuLink
              key={item.id || index}
              item={item}
              closeMenu={closeMenu}
            />
          ))}
        </nav>
      )}
    </header>
  )
}
