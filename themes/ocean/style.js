import { siteConfig } from '@/lib/config'
import CONFIG from './config'
import sceneStyles from './sceneStyles'

const styles = `
#theme-ocean { min-height:100vh; background:var(--ocean-bg); color:var(--ocean-text); font-family:'Avenir Next','Segoe UI','PingFang SC','Microsoft YaHei',sans-serif; }
#theme-ocean *, #theme-ocean *::before, #theme-ocean *::after { box-sizing:border-box; }
#theme-ocean a { color:inherit; text-decoration:none; }
#theme-ocean button, #theme-ocean input { font:inherit; }
#theme-ocean button, #theme-ocean a { -webkit-tap-highlight-color:transparent; }
#theme-ocean button { cursor:pointer; }
#theme-ocean a:focus-visible, #theme-ocean button:focus-visible, #theme-ocean summary:focus-visible, #theme-ocean input:focus-visible { outline:2px solid var(--ocean-primary); outline-offset:5px; }
#theme-ocean .ocean-viewport { position:fixed; inset:0; z-index:0; height:100svh; min-height:100vh; overflow:hidden; color:#05233d; pointer-events:none; }
#theme-ocean .ocean-viewport::before { background-image:var(--ocean-poster); }
#theme-ocean .hero__title, #theme-ocean .hero__description { white-space:pre-line; }
#theme-ocean .hero__content { max-width:calc(100vw - var(--hero-left) - 24px); }
#theme-ocean .scene-ui a, #theme-ocean .scene-ui summary { pointer-events:auto; }
#theme-ocean .scene-ui .ocean-header { pointer-events:auto; }
#theme-ocean .ocean-header { position:relative; display:flex; align-items:center; justify-content:space-between; min-height:88px; padding:20px 4%; gap:24px; z-index:10; border-bottom:1px solid var(--ocean-border); background:var(--ocean-card); }
#theme-ocean .ocean-header-scene { position:absolute; top:0; left:0; right:0; background:transparent; border:0; }
#theme-ocean .ocean-brand { display:flex; align-items:center; gap:12px; flex-shrink:0; }
#theme-ocean .ocean-brand svg { width:62px; }
#theme-ocean .ocean-brand span { font-size:15px; font-weight:600; letter-spacing:.18em; max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
#theme-ocean .ocean-desktop-nav { display:flex; align-items:center; gap:24px; font-size:14px; }
#theme-ocean .ocean-desktop-nav > a { padding:8px 0; border-bottom:1px solid transparent; }
#theme-ocean .ocean-desktop-nav > a:hover { border-bottom-color:currentColor; }
#theme-ocean .ocean-header-actions { display:flex; align-items:center; gap:14px; }
#theme-ocean .ocean-mode-button { border:0; background:transparent; width:34px; height:34px; font-size:23px; }
#theme-ocean .ocean-explore-link { display:inline-flex; align-items:center; justify-content:center; gap:16px; padding:10px 20px; border:1px solid currentColor; border-radius:999px; font-size:13px; white-space:nowrap; }
#theme-ocean button.ocean-explore-link { background:transparent; }
#theme-ocean .ocean-return-list { display:inline-flex; padding:12px 20px; margin-bottom:24px; background:var(--ocean-card); color:var(--ocean-text); border:1px solid var(--ocean-border); border-radius:999px; font-size:13px; }
#theme-ocean .ocean-menu-button { display:none; border:1px solid currentColor; background:transparent; border-radius:999px; padding:10px 14px; font-size:12px; }
#theme-ocean .ocean-dropdown { position:relative; }
#theme-ocean .ocean-dropdown summary { cursor:pointer; list-style:none; display:flex; gap:8px; align-items:center; padding:8px 0; }
#theme-ocean .ocean-dropdown summary::-webkit-details-marker { display:none; }
#theme-ocean .ocean-chevron { flex-shrink:0; display:block; transition:transform .2s ease; }
#theme-ocean .ocean-dropdown[open] > summary > .ocean-chevron { transform:rotate(180deg); }
#theme-ocean .ocean-dropdown-items { position:absolute; left:0; top:100%; min-width:180px; padding:12px; display:flex; flex-direction:column; gap:10px; background:var(--ocean-card); color:var(--ocean-text); border:1px solid var(--ocean-border); border-radius:14px; box-shadow:0 12px 32px rgb(0 24 40 / 12%); }
#theme-ocean .ocean-mobile-nav { position:absolute; top:100%; left:4%; right:4%; display:flex; flex-direction:column; gap:12px; padding:20px; border-radius:18px; background:var(--ocean-card); color:var(--ocean-text); box-shadow:0 12px 32px rgb(0 24 40 / 12%); border:1px solid var(--ocean-border); }
#theme-ocean .ocean-mobile-nav .ocean-dropdown-items { position:static; box-shadow:none; }
#theme-ocean .ocean-content { position:relative; max-width:1320px; margin:0 auto; padding:72px 5% 96px; min-height:calc(100vh - 240px); scroll-margin-top:24px; }
#theme-ocean .ocean-content-home { padding-top:96px; }
#theme-ocean #ocean-posts { scroll-margin-top:112px; }
#theme-ocean .ocean-page-heading { margin-bottom:48px; }
#theme-ocean .ocean-page-heading h1, #theme-ocean .ocean-page-heading h2 { font-family:'Didot','Bodoni MT','Songti SC',Georgia,serif; font-size:clamp(32px,4vw,52px); font-weight:400; margin:12px 0 0; line-height:1.25; letter-spacing:-.025em; }
#theme-ocean .ocean-kicker { color:var(--ocean-secondary); font-size:10px; letter-spacing:.22em; line-height:1.6; font-weight:600; margin:0; }
#theme-ocean .ocean-content-grid { display:grid; grid-template-columns:minmax(0,1fr) 260px; align-items:start; gap:40px; }
#theme-ocean .ocean-content-wide { grid-template-columns:minmax(0,1fr); }
#theme-ocean .ocean-content-main { min-width:0; }
#theme-ocean .ocean-panel { background:var(--ocean-card); border:1px solid var(--ocean-border); border-radius:18px; padding:28px; }
#theme-ocean .ocean-panel h2 { font-size:18px; font-weight:500; margin:0 0 18px; }
#theme-ocean .ocean-panel p { color:var(--ocean-secondary); font-size:14px; line-height:1.8; }
#theme-ocean .ocean-sidebar { display:flex; flex-direction:column; gap:24px; }
#theme-ocean .ocean-sidebar .ocean-panel { padding:24px; }
#theme-ocean .ocean-sidebar .ocean-kicker { font-size:9px; margin:0 0 20px; }
#theme-ocean .ocean-stats { display:flex; justify-content:space-between; gap:12px; border-top:1px solid var(--ocean-border); padding-top:20px; margin-top:24px; }
#theme-ocean .ocean-stats > span { font-size:22px; }
#theme-ocean .ocean-stats small { display:block; font-size:10px; color:var(--ocean-secondary); margin-top:6px; }
#theme-ocean .ocean-sidebar-links { display:flex; flex-direction:column; gap:16px; }
#theme-ocean .ocean-sidebar-links a { display:flex; justify-content:space-between; align-items:baseline; gap:12px; font-size:13px; line-height:1.6; }
#theme-ocean .ocean-sidebar-links a:hover { color:var(--ocean-primary); }
#theme-ocean .ocean-sidebar-links a > span { flex-shrink:0; font-size:11px; color:var(--ocean-secondary); }
#theme-ocean .ocean-toc { position:static; }
#theme-ocean .ocean-toc nav { max-height:40vh; overflow:auto; display:flex; flex-direction:column; flex-wrap:nowrap; gap:14px; font-size:13px; line-height:1.6; }
#theme-ocean .ocean-toc a { flex-shrink:0; overflow-wrap:anywhere; }
#theme-ocean .ocean-post-grid { display:grid; grid-template-columns:minmax(0,1fr); gap:18px; }
#theme-ocean .ocean-post-card { display:flex; align-items:center; gap:24px; padding:26px; border:1px solid var(--ocean-border); border-radius:20px; background:var(--ocean-card); min-width:0; }
#theme-ocean .ocean-post-cover { display:block; order:2; flex:0 0 140px; width:140px; height:104px; overflow:hidden; border-radius:12px; background:var(--ocean-border); }
#theme-ocean .ocean-post-cover img { width:100%; height:100%; object-fit:cover; transition:transform .45s ease; }
#theme-ocean .ocean-post-cover:hover img { transform:scale(1.035); }
#theme-ocean .ocean-post-copy { flex:1; min-width:0; }
#theme-ocean .ocean-post-meta { display:flex; flex-wrap:wrap; gap:12px; align-items:center; font-size:11px; color:var(--ocean-secondary); line-height:1.6; }
#theme-ocean .ocean-post-meta a { color:var(--ocean-primary); }
#theme-ocean .ocean-post-card h2 { font-size:22px; line-height:1.45; font-weight:500; margin:10px 0; overflow-wrap:anywhere; }
#theme-ocean .ocean-post-copy > p { color:var(--ocean-secondary); font-size:14px; line-height:1.8; margin:0 0 20px; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
#theme-ocean .ocean-read-link { display:inline-flex; align-items:center; gap:20px; color:var(--ocean-primary); font-size:12px; }
#theme-ocean .ocean-read-link:hover { gap:28px; }
#theme-ocean .ocean-button { display:inline-flex; align-items:center; justify-content:center; padding:13px 24px; border:1px solid var(--ocean-primary); border-radius:999px; background:var(--ocean-primary); color:var(--ocean-card); font-size:13px; }
#theme-ocean .ocean-pagination { display:flex; align-items:center; justify-content:space-between; gap:20px; margin-top:48px; font-size:13px; }
#theme-ocean .ocean-pagination > span { color:var(--ocean-secondary); }
#theme-ocean .ocean-load-more { display:flex; margin:40px auto 0; }
#theme-ocean .ocean-empty { padding:64px 32px; text-align:center; line-height:1.8; }
#theme-ocean .ocean-empty h1 { font-weight:400; font-size:clamp(24px,3vw,36px); margin:24px 0; }
#theme-ocean .ocean-notice { margin-bottom:32px; }
#theme-ocean .ocean-notice h3 { font-size:16px; margin:0 0 14px; }
#theme-ocean .ocean-tags { display:flex; flex-wrap:wrap; gap:8px; }
#theme-ocean .ocean-tags a { display:inline-flex; gap:12px; border:1px solid var(--ocean-border); border-radius:999px; padding:6px 12px; font-size:11px; color:var(--ocean-secondary); }
#theme-ocean .ocean-tags a:hover { border-color:var(--ocean-primary); color:var(--ocean-primary); }
#theme-ocean .ocean-tag-index { padding:32px; }
#theme-ocean .ocean-tag-index a { padding:12px 22px; font-size:14px; }
#theme-ocean .ocean-category-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:20px; }
#theme-ocean .ocean-category-grid a { display:flex; flex-direction:column; gap:24px; }
#theme-ocean .ocean-category-grid a > span { font-size:24px; font-family:Georgia,'Songti SC',serif; }
#theme-ocean .ocean-category-grid small { color:var(--ocean-secondary); }
#theme-ocean .ocean-archive > section + section { margin-top:36px; }
#theme-ocean .ocean-archive a { display:flex; align-items:baseline; gap:18px; padding:18px 0; border-bottom:1px solid var(--ocean-border); font-size:14px; }
#theme-ocean .ocean-archive time { font-size:11px; color:var(--ocean-secondary); min-width:72px; }
#theme-ocean .ocean-archive a > span:last-child { margin-left:auto; }
#theme-ocean .ocean-search { display:flex; gap:12px; margin-bottom:40px; }
#theme-ocean input { background:var(--ocean-card); color:var(--ocean-text); border:1px solid var(--ocean-border); border-radius:12px; padding:14px 18px; min-width:0; }
#theme-ocean .ocean-search input { flex:1; }
#theme-ocean .ocean-password { display:flex; flex-direction:column; gap:20px; max-width:500px; margin:40px auto; }
#theme-ocean .ocean-password h1 { font-weight:400; font-size:28px; }
#theme-ocean .ocean-password label { font-size:13px; }
#theme-ocean .ocean-article { padding:0; overflow:hidden; }
#theme-ocean .ocean-article-cover { aspect-ratio:2.1; background:var(--ocean-border); overflow:hidden; }
#theme-ocean .ocean-article-cover img { width:100%; height:100%; object-fit:cover; }
#theme-ocean .ocean-article-body { padding:40px; }
#theme-ocean .ocean-article-body > h1 { font-size:clamp(28px,3.4vw,42px); font-family:Georgia,'Songti SC',serif; font-weight:400; line-height:1.3; margin:18px 0; overflow-wrap:anywhere; }
#theme-ocean .ocean-article-body > .ocean-tags { margin-bottom:28px; }
#theme-ocean .ocean-copyright { border-left:2px solid var(--ocean-primary); margin:32px 0; padding:8px 20px; font-size:13px; }
#theme-ocean .notion { color:var(--ocean-text); }
#theme-ocean .notion-text { line-height:1.85; }
#theme-ocean .notion-page { padding:0; width:100%; }
#theme-ocean .notion-h { scroll-margin-top:24px; }
#theme-ocean .ocean-article-placeholder { min-height:70vh; padding:40px; color:var(--ocean-secondary); }
#theme-ocean .ocean-adjacent { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:20px; margin:28px 0; }
#theme-ocean .ocean-adjacent a { display:flex; flex-direction:column; gap:12px; }
#theme-ocean .ocean-adjacent small { color:var(--ocean-secondary); font-size:11px; }
#theme-ocean .ocean-related { margin:40px 0; }
#theme-ocean .ocean-related > h2 { font-size:24px; font-weight:400; margin-bottom:24px; }
#theme-ocean #ocean-comments { margin-top:36px; scroll-margin-top:24px; min-height:140px; }
#theme-ocean .ocean-site-footer { display:flex; justify-content:space-between; gap:24px; padding:40px 5%; border-top:1px solid var(--ocean-border); font-size:12px; color:var(--ocean-secondary); }
#theme-ocean .ocean-site-footer p { font-family:Georgia,serif; font-style:italic; font-size:17px; margin:12px 0 0; }
#theme-ocean .ocean-site-footer > div:last-child { display:flex; flex-direction:column; align-items:flex-end; gap:12px; }
#theme-ocean .ocean-floating-tools { position:fixed; right:20px; bottom:24px; z-index:20; display:flex; flex-direction:column; gap:8px; }
#theme-ocean .ocean-floating-tools > * { width:36px; height:36px; border:1px solid var(--ocean-border); border-radius:50%; display:grid; place-items:center; background:var(--ocean-card); color:var(--ocean-text); box-shadow:0 2px 10px rgb(0 24 40 / 8%); }
@media(max-width:1100px) {
  #theme-ocean .ocean-desktop-nav { gap:16px; }
  #theme-ocean .ocean-content-grid { gap:28px; grid-template-columns:minmax(0,1fr) 230px; }
  #theme-ocean .ocean-content-wide { grid-template-columns:minmax(0,1fr); }
  #theme-ocean .ocean-header { gap:16px; }
  #theme-ocean .ocean-brand span { max-width:110px; }
}
@media(max-width:900px) {
  #theme-ocean .ocean-desktop-nav { display:none; }
  #theme-ocean .ocean-menu-button { display:block; }
  #theme-ocean .ocean-content-grid { grid-template-columns:minmax(0,1fr); }
  #theme-ocean .ocean-sidebar { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); }
  #theme-ocean .ocean-toc { position:static; }
}
@media(max-width:760px) {
  #theme-ocean .ocean-header { min-height:76px; padding:16px 7%; gap:12px; }
  #theme-ocean .ocean-header-scene { top:0; }
  #theme-ocean #ocean-posts { scroll-margin-top:100px; }
  #theme-ocean .ocean-brand { gap:8px; }
  #theme-ocean .ocean-brand svg { width:42px; }
  #theme-ocean .ocean-brand span { max-width:110px; font-size:12px; }
  #theme-ocean .ocean-header-actions { gap:7px; }
  #theme-ocean .ocean-explore-link { display:none; }
  #theme-ocean .ocean-content { padding:48px 7% 64px; }
  #theme-ocean .ocean-content-home { padding-top:64px; }
  #theme-ocean .ocean-page-heading { margin-bottom:32px; }
  #theme-ocean .ocean-post-grid, #theme-ocean .ocean-category-grid, #theme-ocean .ocean-sidebar { grid-template-columns:minmax(0,1fr); }
  #theme-ocean .ocean-post-card { padding:20px; gap:16px; align-items:flex-start; }
  #theme-ocean .ocean-post-cover { flex-basis:64px; width:64px; height:64px; margin-top:28px; border-radius:10px; }
  #theme-ocean .ocean-post-card h2 { font-size:18px; }
  #theme-ocean .ocean-post-copy > p { font-size:13px; -webkit-line-clamp:2; margin-bottom:14px; }
  #theme-ocean .ocean-article-body { padding:24px; }
  #theme-ocean .ocean-search { flex-wrap:wrap; }
  #theme-ocean .ocean-search input { min-width:160px; }
  #theme-ocean .ocean-search .ocean-button { padding:12px 20px; }
  #theme-ocean .ocean-adjacent { gap:12px; }
  #theme-ocean .ocean-adjacent .ocean-panel { padding:18px; }
  #theme-ocean .ocean-site-footer { flex-direction:column; padding:32px 7%; }
  #theme-ocean .ocean-site-footer > div:last-child { align-items:flex-start; }
  #theme-ocean .ocean-floating-tools { right:10px; bottom:16px; }
}
#theme-ocean.ocean-theme-underwater {
  background:#071d2b; isolation:isolate;
  --ocean-text:#f0f8fa; --ocean-secondary:#bed2dc; --ocean-primary:#cce7ec;
  --ocean-card:rgb(4 26 40 / 82%); --ocean-border:rgb(220 242 247 / 24%); --ocean-bg:transparent;
  color:var(--ocean-text);
}
#theme-ocean > main, #theme-ocean > .ocean-site-footer { position:relative; z-index:1; }
#theme-ocean .ocean-background { position:fixed; inset:0; z-index:0; pointer-events:none; }
#theme-ocean .ocean-background[data-ready='true'] .ocean-canvas { opacity:1; }
#theme-ocean .ocean-experience {
  height:auto; min-height:100vh; padding-top:calc((var(--ocean-journal-start) + .4) * 100svh); color:var(--ocean-text);
  --hero-opacity:1; --journal-opacity:0;
  --ocean-text:#f0f8fa; --ocean-secondary:#bed2dc; --ocean-primary:#cce7ec;
  --ocean-card:rgb(4 26 40 / 82%); --ocean-border:rgb(220 242 247 / 24%); --ocean-bg:transparent;
}
#theme-ocean .ocean-experience .scene-ui { position:fixed; inset:0; z-index:2; color:#05233d; }
#theme-ocean .ocean-experience .hero-visual,
#theme-ocean .ocean-experience .hero-interaction,
#theme-ocean .ocean-experience .depth-marker,
#theme-ocean .ocean-experience .below-caption,
#theme-ocean .ocean-experience .scroll-cue { opacity:var(--hero-opacity); }
#theme-ocean .ocean-experience[data-reading='true'] .hero-visual,
#theme-ocean .ocean-experience[data-reading='true'] .hero-interaction,
#theme-ocean .ocean-experience[data-reading='true'] .depth-marker,
#theme-ocean .ocean-experience[data-reading='true'] .below-caption,
#theme-ocean .ocean-experience[data-reading='true'] .scroll-cue { visibility:hidden; }
#theme-ocean .ocean-journal-layer { position:relative; z-index:1; opacity:var(--journal-opacity); }
#theme-ocean .ocean-journal-layer:focus-within { opacity:1; }
#theme-ocean .ocean-experience .ocean-content-home { padding-top:112px; }
@media(max-width:760px) {
  #theme-ocean .ocean-experience .ocean-content-home { padding-top:100px; }
}
#theme-ocean.ocean-theme-underwater .ocean-page-heading { width:fit-content; max-width:100%; padding:16px 24px; border:1px solid var(--ocean-border); border-radius:18px; background:var(--ocean-card); backdrop-filter:blur(12px); margin-bottom:24px; }
#theme-ocean .ocean-experience .ocean-post-card { background:var(--ocean-card); overflow:hidden; backdrop-filter:blur(12px); }
#theme-ocean .ocean-experience .ocean-post-card:hover { border-color:rgb(220 242 247 / 40%); }
#theme-ocean.ocean-theme-underwater .ocean-panel,
#theme-ocean.ocean-theme-underwater .ocean-dropdown-items,
#theme-ocean.ocean-theme-underwater .ocean-mobile-nav { backdrop-filter:blur(16px); }
#theme-ocean .ocean-experience .ocean-notice { margin-top:36px; }
#theme-ocean.ocean-theme-underwater .ocean-site-footer { background:var(--ocean-card); backdrop-filter:blur(12px); }
#theme-ocean .ocean-experience .ocean-site-footer { padding-bottom:120px; }
#theme-ocean .ocean-experience[data-reading='true'] .ocean-header-scene { background:var(--ocean-card); backdrop-filter:blur(16px); color:var(--ocean-text); }
#theme-ocean .ocean-experience[data-reading='true'] .announcement,
#theme-ocean .ocean-experience[data-reading='true'] .playback { color:var(--ocean-text); }
#theme-ocean .ocean-experience[data-reading='true'] .announcement { background:var(--ocean-card); }
#theme-ocean .ocean-experience[data-reading='true'] .playback { padding:8px 14px 8px 8px; border:1px solid var(--ocean-border); border-radius:999px; background:var(--ocean-card); backdrop-filter:blur(12px); }
#theme-ocean .ocean-experience[data-reading='true'] .water-aware,
#theme-ocean .ocean-experience[data-reading='true'] .announcement { transform:none; filter:none; text-shadow:none; }
#theme-ocean .ocean-experience .scene-loading { position:fixed; }
#theme-ocean.ocean-theme-underwater .notion {
  --fg-color:var(--ocean-text); --fg-color-3:var(--ocean-secondary); --fg-color-4:var(--ocean-text); --fg-color-6:var(--ocean-text);
  --fg-color-0:rgb(240 248 250 / 12%); --fg-color-1:rgb(240 248 250 / 18%); --fg-color-2:rgb(240 248 250 / 40%);
  --bg-color:transparent; --bg-color-1:#102a3a; --bg-color-2:rgb(142 185 209 / 15%);
  --notion-red:#ffabab; --notion-pink:#f5b3d9; --notion-blue:#9bcfff; --notion-purple:#d8b5ff;
  --notion-teal:#8ce3d2; --notion-yellow:#f2d27d; --notion-orange:#ffbb90; --notion-brown:#debba8; --notion-gray:#c1d0db;
  --notion-red_background:rgb(224 62 62 / 18%); --notion-pink_background:rgb(173 26 114 / 18%); --notion-blue_background:rgb(11 110 153 / 18%);
  --notion-purple_background:rgb(105 64 165 / 18%); --notion-teal_background:rgb(15 123 108 / 18%); --notion-yellow_background:rgb(223 171 1 / 18%);
  --notion-orange_background:rgb(217 115 13 / 18%); --notion-brown_background:rgb(100 71 58 / 18%); --notion-gray_background:rgb(155 154 151 / 18%);
  --notion-default_background_co:rgb(142 185 209 / 12%);
}
#theme-ocean.ocean-theme-underwater .notion-quote,
#theme-ocean.ocean-theme-underwater .notion-callout { color:var(--ocean-text); border-color:var(--ocean-border); background:rgb(142 185 209 / 12%); }
#theme-ocean.ocean-theme-underwater .notion-link { color:#bbdfff; }
#theme-ocean.ocean-theme-underwater .notion-code { background:#102a3a; color:var(--ocean-text); }
`

export function Style() {
  const tokens = ['PRIMARY', 'BG', 'CARD', 'TEXT', 'TEXT_SECONDARY', 'BORDER']
  const variables = tokens
    .flatMap(token =>
      ['', '_DARK'].map(mode => {
        const key = `OCEAN_COLOR_${token}${mode}`
        return `--ocean-color-${token.toLowerCase().replace(/_/g, '-')}${mode ? '-dark' : ''}:${siteConfig(key, CONFIG[key], CONFIG)};`
      })
    )
    .join('\n')
  const active = dark =>
    tokens
      .map(token => {
        const name =
          token === 'TEXT_SECONDARY' ? 'secondary' : token.toLowerCase()
        return `--ocean-${name}:var(--ocean-color-${token.toLowerCase().replace(/_/g, '-')}${dark ? '-dark' : ''});`
      })
      .join('\n')
  return (
    <style>{`${sceneStyles}\n#theme-ocean {${variables}${active(false)}}\n.dark #theme-ocean {${active(true)}}\n${styles}`}</style>
  )
}
