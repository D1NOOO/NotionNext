import SmartLink from '@/components/SmartLink'
import WWAds from '@/components/WWAds'
import { AdSlot } from '@/components/GoogleAdsense'
import { siteConfig } from '@/lib/config'
import { uuidToId } from 'notion-utils'
import CONFIG from '../config'
import { postHref } from './PostList'

export default function Sidebar({
  post,
  lock,
  latestPosts = [],
  categoryOptions = [],
  tagOptions = [],
  postCount = 0,
  rightAreaSlot
}) {
  const toc =
    !lock && siteConfig('OCEAN_ARTICLE_TOC', true, CONFIG) && post?.toc
  return (
    <aside className='ocean-sidebar'>
      {toc?.length > 0 && (
        <section className='ocean-panel ocean-toc'>
          <h2>文章目录</h2>
          <nav aria-label='文章目录'>
            {toc.map(item => (
              <a
                key={item.id}
                href={`#${uuidToId(item.id)}`}
                style={{ paddingLeft: `${(item.indentLevel || 0) * 12}px` }}
              >
                {item.text}
              </a>
            ))}
          </nav>
        </section>
      )}
      <section className='ocean-panel'>
        <p className='ocean-kicker'>A NOTE FROM THE SHORE</p>
        <h2>{siteConfig('AUTHOR')}</h2>
        <p>{siteConfig('BIO')}</p>
        <div className='ocean-stats'>
          <span>
            {postCount}
            <small>文章</small>
          </span>
          <span>
            {categoryOptions.length}
            <small>分类</small>
          </span>
          <span>
            {tagOptions.length}
            <small>标签</small>
          </span>
        </div>
      </section>
      {latestPosts.length > 0 && (
        <section className='ocean-panel'>
          <h2>最新文章</h2>
          <div className='ocean-sidebar-links'>
            {latestPosts.slice(0, 5).map(item => (
              <SmartLink key={item.id} href={postHref(item)}>
                {item.title}
                <span aria-hidden='true'>↗</span>
              </SmartLink>
            ))}
          </div>
        </section>
      )}
      {categoryOptions.length > 0 && (
        <section className='ocean-panel'>
          <h2>分类</h2>
          <div className='ocean-sidebar-links'>
            {categoryOptions.map(item => (
              <SmartLink
                key={item.name}
                href={`/category/${encodeURIComponent(item.name)}`}
              >
                {item.name}
                <span>{item.count}</span>
              </SmartLink>
            ))}
          </div>
        </section>
      )}
      {tagOptions.length > 0 && (
        <section className='ocean-panel'>
          <h2>标签</h2>
          <div className='ocean-tags'>
            {tagOptions.map(item => (
              <SmartLink
                key={item.name}
                href={`/tag/${encodeURIComponent(item.name)}`}
              >
                {item.name}
              </SmartLink>
            ))}
          </div>
        </section>
      )}
      {rightAreaSlot}
      <WWAds className='ocean-panel' />
      <AdSlot />
    </aside>
  )
}
