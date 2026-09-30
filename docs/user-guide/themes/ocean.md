# Ocean 主题

Ocean 将 `ocean_page` 的实时海洋页面集成为 NotionNext 独立主题。首页保留海面、穿越水线、水下三个连续状态；继续向下滚动即可阅读 Notion 文章。支持文章详情、搜索、归档、分类、标签、密码文章、评论和主题控制台。

## 启用

在部署环境或本地 `.env.local` 中设置：

```dotenv
NOTION_PAGE_ID=你的公开Notion数据库ID
NEXT_PUBLIC_THEME=ocean
```

`NOTION_PAGE_ID` 决定文章、作者和菜单的数据来源。省略时会读取 NotionNext 的官方示例数据库；使用自己的站点数据时，填写线上部署使用的同一个公开数据库 ID。本地配置保存在 `.env.local`，不会进入 Git。

也可在 Notion Config 中设置 `THEME=ocean`，或把 `blog.config.js` 的默认主题改为 `ocean`。配置同时存在时请确认 Notion Config 没有覆盖你的选择。

添加主题后重启开发服务。临时预览使用 `/?theme=ocean`。主题切换面板需要 `NEXT_PUBLIC_THEME_SWITCH=true`，面板中选择 Ocean。

## 首页与文章

- 滚动一屏完成下潜；约 60% 下潜进度时文章列表浮现。列表、公告和页脚都叠在海洋上，滚动到底仍保留实时水下背景。
- 顶部“阅读文章”及底部 `READ THE JOURNAL` 可直接跳到文章列表。
- 文章列表锚点为标题，跳转时会预留导航栏高度；菜单中的首页入口直接进入水下文章列表，站点标志可回到首页海面。
- 文章详情、About、归档、分类和标签等页面默认使用下潜 100% 的实时海洋背景；加载和静态回退时显示同一视角的水下底图。
- 文章详情提供“返回文章列表”按钮；按钮返回和浏览器返回会恢复打开文章前的卡片位置、已加载分页和海洋状态。直接打开文章时，按钮进入水下文章列表。
- 文章目录随页面正常滚动；二级菜单箭头居中，展开时旋转朝上。Ocean 页面隐藏昼夜切换按钮。
- 主按钮下潜或返回海面，左下角按钮暂停或继续动画。页面主体获得焦点时空格键也可切换暂停。
- 首屏标题和简介来自 Ocean 配置；站点名称、作者、头像、菜单、文章等来自 NotionNext。
- 支持 `customNav`、`CUSTOM_MENU + customMenu` 以及二级菜单。
- 文章列表遵循全站 `POST_LIST_STYLE` 和 `POSTS_PER_PAGE`。列表封面使用 Notion 文章封面。
- 文章以单列圆角长条卡片展示，标题和摘要占主体，封面缩为右侧小图；没有封面时文字自动填满卡片。
- 评论、分享和广告同时遵循全站对应配置。版权声明默认遵循文章的版权字段。

## 常用配置

配置默认值在 `themes/ocean/config.js`，可以在 Notion Config 或主题控制台调整。

| 配置                      | 默认值                           | 用途                                     |
| ------------------------- | -------------------------------- | ---------------------------------------- |
| `OCEAN_HERO_ENABLE`       | `true`                           | 显示首页海洋区                           |
| `OCEAN_ANIMATION_ENABLE`  | `true`                           | 开启实时海洋；关闭后使用静态海报         |
| `OCEAN_ANIMATION_PAUSED`  | `false`                          | 默认暂停海浪                             |
| `OCEAN_ANIMATION_SPEED`   | `0.5`                            | 海浪时间倍率                             |
| `OCEAN_JOURNAL_START`     | `0.6`                            | 文章浮现的下潜进度，范围 `0.25–0.85`     |
| `OCEAN_QUALITY`           | `auto`                           | 自动降分辨率；`high` 提高画质与 GPU 占用 |
| `OCEAN_HERO_TITLE`        | `Closer to\nthe ocean.`          | 首屏标题，支持实际换行和 `\n`            |
| `OCEAN_HERO_EYEBROW`      | `FEEL THE WORLD SLOW DOWN`       | 标题上方短句                             |
| `OCEAN_HERO_DESCRIPTION`  | 原版两行简介                     | 首屏简介                                 |
| `OCEAN_HERO_INVITATION`   | `Take a breath. Dive in.`        | 主按钮旁的文案                           |
| `OCEAN_HERO_POSTER`       | `/themes/ocean/poster.jpg`       | 首帧、静态模式和 WebGL 不可用时的海报    |
| `OCEAN_SKY_IMAGE`         | `/themes/ocean/sky-panorama.jpg` | 海洋渲染的全景天空贴图                   |
| `OCEAN_SIDEBAR`           | `true`                           | 桌面端侧栏                               |
| `OCEAN_NOTICE_ENABLE`     | `true`                           | Notion 公告                              |
| `OCEAN_POST_LIST_COVER`   | `true`                           | 文章卡片封面                             |
| `OCEAN_ARTICLE_TOC`       | `true`                           | 文章目录                                 |
| `OCEAN_ARTICLE_SHARE`     | `true`                           | 分享区                                   |
| `OCEAN_ARTICLE_COMMENT`   | `true`                           | 评论区                                   |
| `OCEAN_ARTICLE_COPYRIGHT` | `custom`                         | 跟随文章版权字段                         |
| `OCEAN_ARTICLE_ADJACENT`  | `true`                           | 上一篇、下一篇                           |
| `OCEAN_ARTICLE_RECOMMEND` | `true`                           | 推荐文章                                 |

`OCEAN_MENU_ARCHIVE`、`OCEAN_MENU_CATEGORY`、`OCEAN_MENU_TAG`、`OCEAN_MENU_SEARCH` 控制默认菜单入口。使用 Notion 自定义菜单时以自定义菜单为准。

主题提供主色、页面背景、卡片背景、文字、次级文字、边框六种基础颜色：`OCEAN_COLOR_PRIMARY`、`BG`、`CARD`、`TEXT`、`TEXT_SECONDARY`、`BORDER`；深色模式使用同名配置加 `_DARK`。海洋上的阅读区域采用浅色文字和半透明深海卡片，优先保证可读性；海洋光照保留原版摄影效果。

## 兼容性与性能

海洋使用 Three.js、WebGL2 和浮点渲染扩展。动画开启时异步加载着色器；初始化期间先显示对应视角的海报。不支持 WebGL 或贴图加载失败时回退到海报，导航和文章仍可使用。海洋不可见或标签页隐藏时不执行渲染；场景卸载时释放 GPU 资源，水下阅读页面之间切换会复用背景场景。

系统开启“减少动态效果”时默认暂停海浪并关闭文字漂动。可点击播放按钮主动恢复海洋。低性能设备可设置 `OCEAN_ANIMATION_ENABLE=false`。

## 文件与来源

- `themes/ocean/index.js`：NotionNext 页面布局。
- `themes/ocean/components/`：首页、文章列表、导航和内容组件。
- `themes/ocean/engine/`：从本地 `ocean_page/src/ocean/` 迁入的波场、镜头、渲染器和着色器。GLSL 以 JavaScript 字符串导出，兼容 Next.js，无需全局 Webpack loader。
- `themes/ocean/sceneStyles.js`：经过主题作用域隔离的原版海洋样式。
- `themes/ocean/style.js`：主题样式和阅读区域配色。
- `public/themes/ocean/`：原项目的天空贴图、首帧海报，以及下潜 100% 视角的水下回退底图。
- `public/images/themes-preview/ocean.png` / `.webp`：主题选择面板预览图。

主题目录由 NotionNext 自动扫描，无需修改路由或 Webpack 配置。全局接入涉及 `conf/themeSwitch.manifest.js`（主题和配置注册）、`conf/themeColorPalette.js`（浅深配色），以及 `package.json` / `yarn.lock`（新增 `three` 依赖）。`tsconfig.json` 的 `target=ES2017` 是 Next.js 自动补齐的编译要求。新增主题不会自动修改站点默认主题；启用方式见上文。

视觉与海洋引擎源自 [Ocean Below the Surface](https://github.com/snychng/ocean-below-the-surface/)，本次以用户提供的本地 `ocean_page` 源码为迁移基准。保留原有波场和光学算法，适配 React 18、NotionNext、局部滚动及异步生命周期。
