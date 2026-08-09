# Reelflow Skill

把 [Reelflow](https://reelflowai.app) 装成 Claude 的技能：**AI 生图 / 平台封面图**，以及**小红书、抖音等平台数据**（搜索 / 笔记 / 评论 / 用户 / 热榜 / 蒲公英）。

Skill 是一份「教程包」（`SKILL.md` + 脚本），教 Claude 何时、如何调用 Reelflow 开放 API。零服务端，装好即用。仅 Claude 系（Claude Code / claude.ai）；跨工具接入请用 [MCP](https://reelflowai.app/docs/api)。

## 安装

```bash
npx skills add houht1013/reelflow-skill
```

或手动放到 skills 目录：

```bash
git clone https://github.com/houht1013/reelflow-skill.git ~/.claude/skills/reelflow
```

项目级安装把目标换成 `.claude/skills/reelflow` 即可。

## 配置

在 [reelflowai.app](https://reelflowai.app/zh-CN/reelflow/api-keys) 创建 API Key，然后：

```bash
export REELFLOW_API_KEY="rf_your_api_key"
# 可选：自建网关时覆盖 Base
# export REELFLOW_BASE="https://reelflowai.app/api/v1"
```

## 使用

直接对 Claude 说：

- 「用 reelflow 生成一张封面图，主题是……」
- 「用 reelflow 查小红书『露营』的热门笔记」
- 「先查一下我的 reelflow 积分余额」

Claude 会读 `SKILL.md` 自行决定何时调用。

## 计费

按工作区积分计：数据查询 2 积分/次；生图 / 封面按模型单价 × 张数（默认 3 积分/张）。**失败不扣费。** `GET /credits` 查余额。

## 目录

| 文件 | 作用 |
|---|---|
| `SKILL.md` | 主入口，Claude 读它决定何时调用 |
| `references/getting-started.md` | 配 key、首次使用、401 排查 |
| `references/image-cover.md` | 生图与封面（尺寸、模型、批量） |
| `references/xhs-data.md` | 小红书数据端点用法 |
| `scripts/api.mjs` | 零依赖调用助手（Node ≥ 18） |

参数细节以 `GET https://reelflowai.app/api/v1/openapi` 为准。

## 许可

MIT
