# PreflopExplorer 实施规划

## 目标

`PreflopExplorer` 是 Pokerai API 的公开示例项目：已登录的 Pokerai 用户可以交互式构建 6-max preflop 行动线，并查看对应的完整 13×13 GTO mixed-strategy range。每次成功查询使用该用户自己的 presolved quota；未登录用户不能读取任何策略结果。

本仓库只公开可运行的客户端示例和公开 API 合约，不公开策略源数据、采集管线、内部服务实现或任何凭据。

## 已验证的基础

| 项目 | 已有能力 | 本项目的用法 |
| --- | --- | --- |
| Pokerai preflop library | `POST /v1/gto/preflop/range` 返回某个 spot 的完整 13×13 range | 唯一的策略数据来源 |
| 版本发现 | `GET /v1/gto/preflop/versions` 返回可选 chart set | 首屏加载版本选择器，不硬编码版本列表 |
| 用户登录 | Pokerai 已签发用户 Bearer JWT | Explorer 登录态的唯一身份来源 |
| 用户配额 | presolved quota 已按用户维护 | 每次成功 range 查询只扣 1 次该用户配额 |
| Luna Preflop 源 | 包含 RangeConverter/DeepSolver 采集、下载、解析脚本 | 仅作产品行为参考，不复制到公开仓库 |

## 架构决策

### 决策：使用受控的登录用户 API，而不是浏览器 API key

新增 Pokerai 平台接口：

```http
POST /v1/apps/preflop-explorer/range
Authorization: Bearer <Pokerai user JWT>
Content-Type: application/json

{
  "table_size": "6max",
  "preflop_version": "6max",
  "positions": { "hero": "UTG" },
  "preflop_actions": [
    { "position": "SB", "action": "small blind", "amount": 0.5 },
    { "position": "BB", "action": "big blind", "amount": 1 }
  ]
}
```

响应：

```ts
type ExplorerRangeResponse = {
  range: Record<string, { fold: number; call: number; raise: number }>;
  quota: { used: number; limit: number };
};
```

该接口必须：

1. 验证 Pokerai 用户 JWT；缺失或无效时返回 `401 authentication_required`。
2. 从 JWT 获得用户身份，复用现有 entitlement 的原子 presolved quota 扣减逻辑。
3. 仅当范围查询成功时消耗 1 次 quota；验证错误、未授权和无结果不消耗。
4. 对配额耗尽返回统一的 `429 quota_exceeded`（或平台最终选定的等价标准码），对无库记录返回 `404 no_solution`。
5. 针对用户和 IP 限流，并将 CORS Origin 限为生产 Explorer 域名与本地开发地址。
6. 不接受匿名调用，不提供共享 demo key，也不把长期 API key 交给浏览器。

这是本项目的前置条件。仅靠前端隐藏 key、环境变量或用户手工复制 key，都不能保证“登录用户自己的配额”这一要求。

## 公开仓库边界

### 可以公开

- React/TypeScript 前端、样式、交互状态机与测试。
- 公开 API 请求/响应的类型和脱敏示例。
- `VITE_POKERAI_API_BASE_URL` 等无密配置的 `.env.example`。
- 开发、贡献、安全报告和 RTA 合规说明。

### 绝不公开

- 任何 API key、JWT、Cookie、第三方访问令牌、生产数据库连接串、私有域名或后台账号。
- RangeConverter/DeepSolver 的采集/下载/绕过逻辑、第三方请求头或会话状态。
- 从第三方数据源获得的原始文件、缓存、策略 JSON、训练数据和再分发权未经确认的衍生数据。
- Pokerai 内部配额实现、服务拓扑、运营脚本和管理页面。

### 发布前强制安全动作

1. 已发现于 Luna Preflop 源中的第三方 Token/Cookie 必须在原服务中吊销或轮换；不在本仓库或公开 issue 中复述其值。
2. 审计源仓库完整 Git 历史、CI 日志、部署变量和本地环境文件；仅从全新的 Git 历史初始化本仓库。
3. 添加 `.gitignore`、`.env.example`、`SECURITY.md`，启用 GitHub secret scanning、push protection、Dependabot 与 PR CI。
4. 在发布前对工作树、提交历史、Actions 日志和构建产物执行 secret scan。
5. 由法务/产品负责人确认策略数据的来源、许可与展示方式不侵犯第三方条款或品牌权益。

## 前端范围与结构

选择 React + TypeScript + Vite，保持单页应用、无应用自建后端、无数据库。

```text
src/
  api/                 # Explorer API 与版本发现请求
  auth/                # 登录态检查、登录跳转、登出
  domain/              # 位置、盲注、行动序列、合法性与 13×13 映射
  features/explorer/   # explorer 状态、查询、配额、错误与结果
  components/          # action rail、seat control、range grid、quota badge
  styles/              # Pokerai 产品站视觉 token 与组件皮肤
  test/                # 单元和组件测试
```

不包含：求解器、离线策略库、采集器、第三方数据导入、Postflop、导出、多人协作或账户管理。

## 用户体验与视觉

### 保留 RangeConverter 的 UX 心智模型

- 用户以座位顺序构建行动线：盲注 → fold/call/raise → 下一节点。
- 当前 Hero/spot 始终可见；不可行动位置与非法动作即时禁用。
- 结果以 13×13 range grid 展示；每格以 fold/call/raise 混合色表达频率，hover/focus 显示精确值。
- 保留“点击格子查看手牌组合/频率细节”的探索节奏，但不使用 RangeConverter 品牌、代码或资产。

### 对齐 Pokerai 产品站的新视觉

- 深色表面、低对比背景、Pokerai 绿色作为主要强调色、紧凑圆角卡片和产品站导航语言。
- 顶部放置 chart version、桌型、stack depth 与账户配额；主区放行动轨道和 range grid。
- 首屏不显示静态策略答案。未登录时只显示锁定态、价值说明与登录 CTA。
- 查询前显示“本次将消耗 1 次 presolved quota”；成功后更新 `used / limit`。
- 所有操作支持键盘、可见 focus、语义标签和窄屏布局。

### 状态与错误

| 状态 | 用户界面 | 行为 |
| --- | --- | --- |
| 未登录 | 锁定 range 区 + 登录 CTA | 禁止查询与策略数据加载 |
| 查询中 | 保留当前结果、显示明确 loading | 禁止重复提交 |
| 成功 | grid + spot 摘要 + 新配额 | 更新内存中的结果与 quota |
| 401 | 登录失效提示 | 清理本地登录态并跳转登录 |
| 429 | 配额耗尽说明与 Dashboard/升级入口 | 保留最后一次成功结果，不重试 |
| 400 | 在行动轨道定位输入错误 | 不扣配额 |
| 404 | 当前版本无此 spot | 不扣配额 |
| 网络错误 | 可重试的离线提示 | 不伪造结果或 quota |

## 实施顺序

1. **平台契约与服务端测试**：交付 JWT 鉴权、用户配额扣减、CORS/限流和错误约定。
2. **脚手架与安全基线**：创建 Vite 项目、CI、依赖锁文件、忽略规则、`SECURITY.md`、README 和 secret scan。
3. **领域模型**：实现 6-max 座位、行动序列、版本发现、输入验证与 API client。
4. **Explorer 核心**：实现登录门禁、行动轨道、range 请求、13×13 grid、quota badge 与错误状态。
5. **视觉与可用性**：按 Pokerai token 重做样式，同时保留 RangeConverter 式探索流程；完成键盘、移动端和暗色对比检查。
6. **验收与公开发布**：完成测试、安全复审、许可确认、README 截图和 GitHub 发布设置。

## 验收标准

1. 匿名用户无法获取策略数据，直接调用受控接口返回 `401`。
2. 已登录用户一次有效查询获得 169 个 hand type，并且只消耗 1 次其 own presolved quota。
3. 用户 A 的查询绝不影响用户 B 的 quota；并发请求不会超扣。
4. 无效请求、未授权请求和 `404 no_solution` 不消耗 quota。
5. 客户端不含 API key、JWT、Cookie、第三方 Token、策略源数据或内部服务实现。
6. chart version 从发现接口读取，新增版本不需要前端发布。
7. 6-max RFI 与 facing-raise 的主要流程可通过键盘和移动屏幕完成。
8. `lint`、`typecheck`、unit、integration、E2E、production build 和 secret scan 在 CI 全部通过。

## 测试计划

| 层级 | 验证内容 |
| --- | --- |
| Unit | 行动合法性、行动线序列化、hand matrix 映射、色块计算、错误映射 |
| API integration | JWT 缺失/过期、原子扣额、额度耗尽、无结果、CORS、限流 |
| Component | 未登录锁定、提交 loading、配额更新、13×13 grid、键盘操作 |
| E2E | 匿名访问 → 登录 → UTG RFI → 查看 range → quota 更新 |
| Security | Git/构建产物/日志 secret scan，依赖审计，响应中无敏感字段 |

## 回滚

- 前端：回滚静态部署或上一个发布版本；不会影响策略库与用户数据。
- 服务端 Explorer 入口：关闭路由/Origin，或回滚该端点；保留审计日志以核对已扣配额。
- 出现计费/配额异常时：立即禁用入口、冻结受影响用户的后续调用、依据原子消费记录修复后再恢复。

## 后续决策

- 生产 Explorer 的正式域名和登录回跳 URL。
- 最终错误状态码采用 `429` 还是与现有套餐语义对齐的 `402`。
- 策略数据展示与截图的许可证/归属确认结果。
- 是否在首版支持多语言；若支持，采用 Pokerai 现有语言集合与文案体系。
