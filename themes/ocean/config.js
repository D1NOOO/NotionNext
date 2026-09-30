const CONFIG = {
  OCEAN_HERO_ENABLE: true, // 首页显示海洋首屏
  OCEAN_JOURNAL_START: 0.6, // 下潜到此进度时开始展示文章，范围 0.25～0.85
  OCEAN_ANIMATION_ENABLE: true, // WebGL 海洋动画；关闭后使用静态海报
  OCEAN_ANIMATION_PAUSED: false, // 默认暂停海浪
  OCEAN_ANIMATION_SPEED: 0.45, // 海浪时间倍率
  OCEAN_QUALITY: 'auto', // auto 自动调整分辨率；high 提高画质
  OCEAN_HERO_EYEBROW: 'FEEL THE WORLD SLOW DOWN',
  OCEAN_HERO_TITLE: 'Closer to\nthe ocean.', // 换行用 \n
  OCEAN_HERO_DESCRIPTION: '', // 留空时保留原有两行占位
  OCEAN_HERO_POSTER: '/themes/ocean/poster.jpg', // 动画加载或不可用时的海报
  OCEAN_SKY_IMAGE: '/themes/ocean/sky-panorama.jpg', // 全景天空贴图
  OCEAN_MENU_ARCHIVE: true,
  OCEAN_MENU_CATEGORY: true,
  OCEAN_MENU_TAG: true,
  OCEAN_MENU_SEARCH: true,
  OCEAN_NOTICE_ENABLE: true,
  OCEAN_SIDEBAR: true,
  OCEAN_POST_LIST_COVER: true,
  OCEAN_ARTICLE_TOC: true,
  OCEAN_ARTICLE_SHARE: true,
  OCEAN_ARTICLE_COPYRIGHT: 'custom', // custom 跟随文章版权字段；true 全部显示；false 关闭
  OCEAN_ARTICLE_COMMENT: true,
  OCEAN_ARTICLE_ADJACENT: true,
  OCEAN_ARTICLE_RECOMMEND: true,
  OCEAN_COLOR_PRIMARY: '#00213e',
  OCEAN_COLOR_BG: '#edf5f6',
  OCEAN_COLOR_CARD: '#ffffff',
  OCEAN_COLOR_TEXT: '#05233d',
  OCEAN_COLOR_TEXT_SECONDARY: '#527080',
  OCEAN_COLOR_BORDER: '#cfdee3',
  OCEAN_COLOR_PRIMARY_DARK: '#b1dbe3',
  OCEAN_COLOR_BG_DARK: '#071d2b',
  OCEAN_COLOR_CARD_DARK: '#102c3c',
  OCEAN_COLOR_TEXT_DARK: '#e4f2f4',
  OCEAN_COLOR_TEXT_SECONDARY_DARK: '#9cbac5',
  OCEAN_COLOR_BORDER_DARK: '#284958'
}

export default CONFIG
