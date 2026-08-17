---
name: reelflow
description: 用 Reelflow 开放 API（reelflowai.app）做 AI 生图与平台封面图、图床托管（上传图片换公网直链），以及查小红书/抖音等平台数据（搜索/笔记/评论/用户/热榜/蒲公英）。当用户要 生成图片/做封面图/传图床拿外链/查小红书或抖音数据、或提到 Reelflow API 时使用。需要 REELFLOW_API_KEY。
---

# Reelflow — AI 生图与平台数据（Agent 接口）

Reelflow 把「AI 生图/封面 + 新媒体平台数据」开放为统一 API。图由 Reelflow 出，数据由 Reelflow 供，都按量消耗用户工作区积分。

## 必读要点

- **鉴权**：所有请求 `Authorization: Bearer $REELFLOW_API_KEY`。Base URL：`https://api.reelflowai.app/v1`。未配置 key → 先读 `references/getting-started.md`。
- **计费**（用户工作区积分）：数据查询 **2 积分/次**；生图/封面 **按模型单价 × 张数**（默认 3 积分/张，响应里有确切 `creditsTotal`）；**失败不扣费**。`GET /credits` 查余额；`402` = 余额不足，直接告诉用户去充值，**不要重试**。
- **生图一次可出 1–4 张**：同一提示词并行生成，让用户挑。批量里失败的那张不计费。
- **参数细节以 OpenAPI 为准**：`GET https://api.reelflowai.app/v1/openapi` 有全部端点的参数 schema。本 skill 只写高频用法。
- `scripts/api.mjs` 是零依赖调用助手（Node ≥ 18）：`node scripts/api.mjs GET /credits`。也可以直接 curl。
- **也可用 MCP 接入**（Claude Code/Cursor/Codex 原生）：`claude mcp add --transport http reelflow https://api.reelflowai.app/mcp --header "Authorization: Bearer $REELFLOW_API_KEY"`，工具 `list_endpoints`/`call_endpoint`/`generate_image`/`host_image`。本 skill 与 MCP 同源同计费，任选其一。

## 按任务读参考

| 用户要做… | 读 |
|---|---|
| 配置 API key / 首次使用 / 401 排查 | `references/getting-started.md` |
| 生图 / 做封面（3:4 竖版、9:16 短视频、2.35:1 横版等） | `references/image-cover.md` |
| 图床：上传本地/生成的图片，换可外链的公网直链 | `references/image-host.md` |
| 查小红书数据（搜笔记/热榜/评论/用户/话题/蒲公英博主） | `references/xhs-data.md` |
| 查抖音 / TikTok / YouTube 数据 | 直接查 `GET /api/v1/openapi`，用法与小红书数据同构 |

**定位参考文件**：以上路径相对于本 SKILL.md 所在目录。若你的 agent 未提供 skill 目录（安装位置随工具而异，如 Claude Code 的 `~/.claude/skills`、Codex 的 `~/.codex/skills`），先定位：`find ~/.claude ~/.codex .claude .codex -name SKILL.md -path '*reelflow*' 2>/dev/null`。

## 已下线的能力（不要再调）

以下端点曾经存在，现已随产品收敛下线，调用会返回 `not_found`：

- `/reelflow/xhs_publish`（小红书扫码发布中转页）
- `/reelflow/lvshu_publish`、`/reelflow/mp_accounts`（小绿书/公众号图文直发）

小红书**数据**查询不受影响，仍然可用。
