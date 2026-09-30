import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { resolveArticleCopyrightText } from '@/lib/utils/articleCopyright'
import CONFIG from '../config'

export default function ArticleCopyright({ post }) {
  const { locale } = useGlobal()
  const text = resolveArticleCopyrightText({
    post,
    locale,
    mode: siteConfig('OCEAN_ARTICLE_COPYRIGHT', 'custom', CONFIG)
  })
  if (!text) return null
  return (
    <section className='ocean-copyright'>
      <strong>{siteConfig('AUTHOR')}</strong>
      <p>{text}</p>
    </section>
  )
}
