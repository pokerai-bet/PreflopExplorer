# Preflop Explorer design

方案 A（Native Workbench）是第一版的视觉基线。页面应看起来属于 `pokerai.bet` 产品站，同时保持 Luna Preflop 浏览器的高信息密度和既有交互。

## 原则

- 复用产品站的顶部导航、完整页脚、1180px 内容宽度、深色网格背景和绿色品牌强调色。
- `Ranges` 是当前导航项；全局导航不增加 `Preflop Explorer`。
- 行动树、双 range grid、combo 详情及其 DOM/数据行为继续以 Luna Preflop 实现为准。
- 桌面端优先展示完整工作台；窄屏隐藏全局导航链接，range grid 在自身容器内横向滚动，不让页面整体溢出。
- 登录状态、用户 JWT 与 presolved quota 规则属于业务约束，不因视觉实现改变。

## Tokens

| Role | Value |
| --- | --- |
| Background | `#060806` |
| Panel | `#0c120f` |
| Raised panel | `#101812` |
| Border | `#203229` |
| Text | `#edf7f0` |
| Muted text | `#91a499` |
| Brand accent | `#2be28f` |
| Raise / Call / Fold | `#ef553f` / `#2da86b` / `#3f78d0` |
| Product font | `Sora`, `IBM Plex Sans`, `Source Sans 3` |
| Data font | `JetBrains Mono`, `IBM Plex Mono` |

Implementation source of truth: [`index.html`](index.html) and [`src/styles.css`](src/styles.css).
