import PoweredBy from '@/components/PoweredBy'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'

export default function Footer() {
  return (
    <footer className='ocean-site-footer'>
      <div>
        <span>
          © {new Date().getFullYear()} {siteConfig('AUTHOR')}
        </span>
        <p>A little closer to the ocean.</p>
      </div>
      <div className='ocean-footer-links'>
        <SmartLink href='/archive'>所有文章 ↗</SmartLink>
        <PoweredBy />
        {siteConfig('BEI_AN') && (
          <a href={siteConfig('BEI_AN_LINK')} target='_blank' rel='noreferrer'>
            {siteConfig('BEI_AN')}
          </a>
        )}
      </div>
    </footer>
  )
}
