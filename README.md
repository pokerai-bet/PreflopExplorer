# PreflopExplorer

公开的 Pokerai API Preflop range explorer 示例项目。它只调用受 JWT 保护的 Pokerai Explorer API；本仓库不包含策略数据、API key、固定 JWT 或第三方凭据。

项目规划见 [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)，视觉基线见 [DESIGN.md](DESIGN.md)。策略查询始终由 Pokerai 平台服务端完成，本仓库不包含策略库或数据。

## 本地开发

需要 Node.js 22+。复制 `.env.example` 为 `.env.local`，仅填写公开的 API 基址；不要在任何 `VITE_` 变量中放入密钥或 token。

```sh
npm install
npm run dev
```

验证命令：`npm run lint`、`npm run typecheck`、`npm test`、`npm run build`。

第一版生产部署应位于 `pokerai.bet` 同源路径下，以直接复用现有登录流程保存的 `gto_token`。若部署到独立域名，仅配置 CORS 仍无法跨源读取登录态，必须另行设计安全的登录回跳/Token exchange；本项目不会通过 URL、构建变量或手工复制传递 JWT。

## API 前置条件

应用将向 `/v1/apps/preflop-explorer/{meta,tree,strategy}` 发送登录用户的运行期 Bearer JWT。第一版的行动导航、策略聚合、range grid 与 combo 详情严格复用现有私有后台 Preflop 库浏览代码，只调整鉴权和公开页面样式。Pokerai 平台必须负责 JWT 验证、仅在策略查询成功后原子消耗该用户自己的 presolved quota、以及 CORS 与限流。未登录调用必须返回 `401 authentication_required`；详细契约见 [Explorer API contract](docs/API_CONTRACT.md)。
