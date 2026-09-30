import LazyImage from '@/components/LazyImage'
import NotionPage from '@/components/NotionPage'
import ShareBar from '@/components/ShareBar'
import SmartLink from '@/components/SmartLink'
import { AdSlot } from '@/components/GoogleAdsense'
import { siteConfig } from '@/lib/config'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import ArticleCopyright from './components/ArticleCopyright'
import OceanHero from './components/OceanHero'
import OceanBackground from './components/OceanBackground'
import ReturnToList from './components/ReturnToList'
import { useOceanNavigation } from './navigationState'
import PageFrame from './components/PageFrame'
import PostList, { PostCard, postDate, postHref } from './components/PostList'
import CONFIG from './config'
import { Style } from './style'

const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
const WaveTuner = dynamic(() => import('./components/WaveTuner'), { ssr: false })
const AlgoliaSearchModal = dynamic(
  () => import('@/components/AlgoliaSearchModal'),
  { ssr: false }
)

const LayoutBase = props => {
  const router = useRouter()
  useOceanNavigation(router)
  const hero =
    router.pathname === '/' && siteConfig('OCEAN_HERO_ENABLE', true, CONFIG)
  return (
    <div
      id='theme-ocean'
      className={`ocean-theme ocean-theme-underwater ${hero ? 'ocean-theme-immersive' : ''}`}
    >
      <Style />
      {!hero && <OceanBackground />}
      {!hero && <Header {...props} />}
      <main>{props.children}</main>
      {!hero && <Footer />}
      <div className='ocean-floating-tools'>
        {props.post && siteConfig('OCEAN_ARTICLE_COMMENT', true, CONFIG) && (
          <a href='#ocean-comments' aria-label='跳到评论区'>
            ☷
          </a>
        )}
        <button
          type='button'
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia('(prefers-reduced-motion: reduce)')
                .matches
                ? 'auto'
                : 'smooth'
            })
          }
          aria-label='回到顶部'
        >
          ↑
        </button>
      </div>
      <AlgoliaSearchModal {...props} />
      {router.query['ocean-tune'] === '1' && <WaveTuner />}
    </div>
  )
}

const LayoutIndex = props => {
  const immersive = siteConfig('OCEAN_HERO_ENABLE', true, CONFIG)
  const journal = (
    <PageFrame {...props} title='岸边的文字' home immersive={immersive}>
      <PostList {...props} />
    </PageFrame>
  )
  return immersive ? (
    <OceanHero {...props}>
      {journal}
      <Footer />
    </OceanHero>
  ) : (
    journal
  )
}

const LayoutPostList = props => (
  <PageFrame
    {...props}
    title={props.category || (props.tag ? `# ${props.tag}` : '所有文章')}
  >
    <PostList {...props} />
  </PageFrame>
)

function SearchForm({ keyword = '' }) {
  const router = useRouter()
  const [value, setValue] = useState(keyword)
  return (
    <form
      className='ocean-search'
      onSubmit={event => {
        event.preventDefault()
        const word = value.trim()
        router.push({
          pathname: word ? `/search/${encodeURIComponent(word)}` : '/search',
          query: router.query.theme ? { theme: router.query.theme } : {}
        })
      }}
    >
      <label htmlFor='ocean-search-input' className='sr-only'>
        搜索文章
      </label>
      <input
        id='ocean-search-input'
        type='search'
        value={value}
        onChange={event => setValue(event.target.value)}
        placeholder='寻找一段文字、一种想法……'
      />
      <button type='submit' className='ocean-button'>
        搜索 ↗
      </button>
    </form>
  )
}

const LayoutSearch = props => (
  <PageFrame
    {...props}
    title={props.keyword ? `搜索：${props.keyword}` : '寻找灵感'}
  >
    <SearchForm key={props.keyword} keyword={props.keyword} />
    <PostList {...props} />
  </PageFrame>
)

function PostLock({ validPassword }) {
  const [password, setPassword] = useState('')
  return (
    <form
      className='ocean-panel ocean-password'
      onSubmit={event => {
        event.preventDefault()
        validPassword?.(password)
      }}
    >
      <h1>这篇文章需要密码</h1>
      <label htmlFor='ocean-password'>文章密码</label>
      <input
        id='ocean-password'
        type='password'
        value={password}
        onChange={event => setPassword(event.target.value)}
        autoComplete='current-password'
        required
      />
      <button type='submit' className='ocean-button'>
        解锁文章 ↗
      </button>
    </form>
  )
}

const LayoutSlug = props => {
  const { post, lock, validPassword, prev, next, recommendPosts = [] } = props
  if (lock)
    return (
      <PageFrame {...props}>
        <PostLock validPassword={validPassword} />
      </PageFrame>
    )
  if (!post)
    return (
      <PageFrame {...props}>
        <div className='ocean-article-placeholder' role='status'>
          正在读取文章……
        </div>
      </PageFrame>
    )
  return (
    <PageFrame {...props} beforeContent={<ReturnToList />}>
      <article className='ocean-article ocean-panel'>
        {post.pageCover && (
          <div className='ocean-article-cover'>
            <LazyImage
              src={post.pageCover}
              alt={post.title}
              width={1000}
              height={480}
            />
          </div>
        )}
        <div className='ocean-article-body'>
          <div className='ocean-post-meta'>
            {post.category && (
              <SmartLink
                href={`/category/${encodeURIComponent(post.category)}`}
              >
                {post.category}
              </SmartLink>
            )}
            {postDate(post) && <time>{postDate(post)}</time>}
          </div>
          <h1>{post.title}</h1>
          <div className='ocean-tags'>
            {(post.tagItems || []).map(tag => (
              <SmartLink
                key={tag.name}
                href={`/tag/${encodeURIComponent(tag.name)}`}
              >
                {tag.name}
              </SmartLink>
            ))}
          </div>
          <div id='article-wrapper'>
            <NotionPage post={post} />
          </div>
          <ArticleCopyright post={post} />
          {siteConfig('OCEAN_ARTICLE_SHARE', true, CONFIG) && (
            <ShareBar post={post} />
          )}
          <AdSlot type='in-article' />
        </div>
      </article>
      {post.type === 'Post' &&
        siteConfig('OCEAN_ARTICLE_ADJACENT', true, CONFIG) && (
          <nav className='ocean-adjacent' aria-label='相邻文章'>
            {prev ? (
              <SmartLink href={postHref(prev)} className='ocean-panel'>
                <small>← 上一篇</small>
                <span>{prev.title}</span>
              </SmartLink>
            ) : (
              <span />
            )}
            {next ? (
              <SmartLink href={postHref(next)} className='ocean-panel'>
                <small>下一篇 →</small>
                <span>{next.title}</span>
              </SmartLink>
            ) : (
              <span />
            )}
          </nav>
        )}
      {post.type === 'Post' &&
        recommendPosts.length > 0 &&
        siteConfig('OCEAN_ARTICLE_RECOMMEND', true, CONFIG) && (
          <section className='ocean-related'>
            <h2>继续探索</h2>
            <div className='ocean-post-grid'>
              {recommendPosts.slice(0, 2).map(item => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </section>
        )}
      {siteConfig('OCEAN_ARTICLE_COMMENT', true, CONFIG) && (
        <section id='ocean-comments' className='ocean-panel'>
          <h2>岸边的对话</h2>
          <Comment frontMatter={post} />
        </section>
      )}
    </PageFrame>
  )
}

const LayoutArchive = props => (
  <PageFrame {...props} title='时间留下的潮汐' eyebrow='THE ARCHIVE'>
    <div className='ocean-panel ocean-archive'>
      {Object.entries(props.archivePosts || {}).map(([year, posts]) => (
        <section key={year}>
          <h2>{year}</h2>
          {posts.map(post => (
            <SmartLink key={post.id} href={postHref(post)}>
              <time>{postDate(post)}</time>
              <span>{post.title}</span>
              <span aria-hidden='true'>↗</span>
            </SmartLink>
          ))}
        </section>
      ))}
    </div>
  </PageFrame>
)

const LayoutCategoryIndex = props => (
  <PageFrame {...props} title='不同的海岸' eyebrow='CATEGORIES'>
    <div className='ocean-category-grid'>
      {(props.categoryOptions || []).map(item => (
        <SmartLink
          key={item.name}
          href={`/category/${encodeURIComponent(item.name)}`}
          className='ocean-panel'
        >
          <span>{item.name}</span>
          <small>{item.count} 篇文章 ↗</small>
        </SmartLink>
      ))}
    </div>
  </PageFrame>
)

const LayoutTagIndex = props => (
  <PageFrame {...props} title='漂来的灵感' eyebrow='TAGS'>
    <div className='ocean-panel ocean-tags ocean-tag-index'>
      {(props.tagOptions || []).map(item => (
        <SmartLink
          key={item.name}
          href={`/tag/${encodeURIComponent(item.name)}`}
        >
          {item.name}
          <small>{item.count || ''}</small>
        </SmartLink>
      ))}
    </div>
  </PageFrame>
)

const Layout404 = props => (
  <PageFrame {...props}>
    <div className='ocean-panel ocean-empty'>
      <p className='ocean-kicker'>LOST AT SEA · 404</p>
      <h1>这页文字随潮水漂走了。</h1>
      <SmartLink href='/' className='ocean-button'>
        回到海面 ↗
      </SmartLink>
    </div>
  </PageFrame>
)

export {
  LayoutBase,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutArchive,
  LayoutCategoryIndex,
  LayoutTagIndex,
  Layout404,
  CONFIG as THEME_CONFIG
}
