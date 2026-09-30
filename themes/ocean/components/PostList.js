import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CONFIG from '../config'
import { getListRestoration } from '../navigationState'

export const postHref = post => post.href || `/${post.slug || post.id}`
export const postDate = post =>
  post.publishDay || post.date?.start_date || post.lastEditedDay || ''

export function PostCard({ post }) {
  const cover =
    siteConfig('OCEAN_POST_LIST_COVER', true, CONFIG) &&
    (post.pageCoverThumbnail || post.pageCover)
  return (
    <article className='ocean-post-card'>
      {cover && (
        <SmartLink
          href={postHref(post)}
          className='ocean-post-cover'
          aria-label={post.title}
        >
          <LazyImage src={cover} alt={post.title} width={160} height={120} />
        </SmartLink>
      )}
      <div className='ocean-post-copy'>
        <div className='ocean-post-meta'>
          {post.category && (
            <SmartLink href={`/category/${encodeURIComponent(post.category)}`}>
              {post.category}
            </SmartLink>
          )}
          {postDate(post) && <time>{postDate(post)}</time>}
        </div>
        <h2>
          <SmartLink href={postHref(post)}>{post.title}</SmartLink>
        </h2>
        {post.summary && <p>{post.summary}</p>}
        <SmartLink href={postHref(post)} className='ocean-read-link'>
          继续阅读 <span aria-hidden='true'>↗</span>
        </SmartLink>
      </div>
    </article>
  )
}

export default function PostList({
  posts = [],
  postCount = posts.length,
  page = 1,
  category,
  tag,
  keyword
}) {
  const router = useRouter()
  const { locale } = useGlobal()
  const [restoration] = useState(() => getListRestoration(router.asPath))
  const [visiblePages, setVisiblePages] = useState(
    restoration?.visiblePages || 1
  )
  useEffect(
    () => setVisiblePages(getListRestoration(router.asPath)?.visiblePages || 1),
    [category, tag, keyword, router.asPath]
  )
  const pageSize = Math.max(1, Number(siteConfig('POSTS_PER_PAGE', 12)) || 12)
  const scrolling = siteConfig('POST_LIST_STYLE') === 'scroll'
  const currentPage = Math.max(1, Number(page) || 1)
  const totalPages = Math.ceil(postCount / pageSize)
  const visiblePosts = scrolling
    ? posts.slice(0, visiblePages * pageSize)
    : posts
  const basePath = router.asPath
    .split('?')[0]
    .replace(/\/page\/\d+\/?$/, '')
    .replace(/\/$/, '')
    .replace(/\.html$/, '')
  const hrefFor = number => ({
    pathname: number === 1 ? `${basePath}/` : `${basePath}/page/${number}`,
    query: router.query.s ? { s: router.query.s } : {}
  })

  return (
    <div id='posts-wrapper' data-visible-pages={visiblePages}>
      {visiblePosts.length ? (
        <div className='ocean-post-grid'>
          {visiblePosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className='ocean-empty'>暂时没有文章。去海边走走，稍后再来。</div>
      )}
      {scrolling
        ? visiblePosts.length < posts.length && (
            <button
              type='button'
              className='ocean-button ocean-load-more'
              onClick={() => setVisiblePages(value => value + 1)}
            >
              {locale?.COMMON?.MORE || '加载更多'}
            </button>
          )
        : totalPages > 1 && (
            <nav className='ocean-pagination' aria-label='文章分页'>
              {currentPage > 1 ? (
                <SmartLink href={hrefFor(currentPage - 1)}>
                  ← {locale?.PAGINATION?.PREV || '上一页'}
                </SmartLink>
              ) : (
                <span />
              )}
              <span>
                {currentPage} / {totalPages}
              </span>
              {currentPage < totalPages ? (
                <SmartLink href={hrefFor(currentPage + 1)}>
                  {locale?.PAGINATION?.NEXT || '下一页'} →
                </SmartLink>
              ) : (
                <span />
              )}
            </nav>
          )}
    </div>
  )
}
