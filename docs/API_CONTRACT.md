# Explorer API contract

第一版严格复用 Pokerai 私有后台现有的 Preflop 库浏览流程。`meta`、`tree`、`strategy`
的请求与响应保留现有 `/auth/admin/preflop/*` 语义，只改变鉴权、公开路由和配额处理。

浏览器使用 Pokerai 登录流程在运行期保存的用户 JWT；本项目不分发或要求用户输入 API key。
下列接口均要求 `Authorization: Bearer <user JWT>`。

## `POST /v1/apps/preflop-explorer/meta`

请求 `{}`，返回现有的 `{status, versions}`。不消耗配额。

## `POST /v1/apps/preflop-explorer/tree`

请求 `{"version":"6max"}`，返回现有的 `{status,version,root,nodes}` prefix trie。节点继续使用
`toAct`、`acts` 和可选 `decision: {hero,situation,ctx}`。不消耗配额。

## `POST /v1/apps/preflop-explorer/strategy`

请求形状保持现有实现：

```json
{
  "version": "6max",
  "position": "MP",
  "situation": "Raise",
  "context": "UTG:Raise"
}
```

成功响应保留现有策略字段，并追加该用户的配额结果：

```json
{
  "status": "success",
  "version": "6max",
  "position": "MP",
  "situation": "Raise",
  "context": "UTG:Raise",
  "actions": ["raise", "call", "fold"],
  "grid": { "AA": { "raise": 1, "call": 0, "fold": 0, "combos": 6 } },
  "combos": {},
  "quota": { "used": 7, "limit": 100 }
}
```

平台必须先用现有 Preflop 库确认策略查询成功，再原子消耗该 JWT 用户自己的 1 次 presolved
quota，最后才向浏览器返回策略。鉴权失败、输入无效、无策略、上游错误均不扣配额。并发请求由
现有 entitlement 原子更新阻止超扣。标准错误为 `401 authentication_required`、
`404 no_solution` 和 `429 quota_exceeded`。
