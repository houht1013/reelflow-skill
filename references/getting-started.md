# 首次使用 / 配置

## 拿 API Key

1. 登录 https://reelflowai.app → 左侧「API 服务」→ 新建 Key（可设有效期）。
2. Key 创建后可在列表「查看」里复看明文。

## 配置

把 key 放进环境变量（推荐写入 shell profile 或项目 `.env`，**不要**提交进 git）：

```bash
export REELFLOW_API_KEY="rf_xxx..."
```

验证连通 + 查余额：

```bash
curl -sS -H "Authorization: Bearer $REELFLOW_API_KEY" https://api.reelflowai.app/v1/credits
# → {"workspaceId":"…","balance":1017.73,…}
```

或用本 skill 的助手脚本：`node scripts/api.mjs GET /credits`

## 错误对照

| 状态 | 含义 | 你该做什么 |
|---|---|---|
| 401 | key 缺失/无效/过期 | 让用户到「API 服务」页重建 key |
| 402 | 积分不足 | 告诉用户余额与本次所需，引导充值；**不要重试** |
| 429 | 限流（按用户默认 10 次/秒，跨该用户所有 key 共享） | 稍等再试或降低并发 |
| 400 | 参数错误 | 读响应里的 message，对照 `GET /api/v1/openapi` 修参数 |
| 502 | 上游/生成失败（未扣费） | 可重试一次；再失败则报告用户 |

## 计费速查

- 数据 API（`/xiaohongshu/*` 等）：2 积分/次，成功才扣。
- 生图/封面（`/reelflow/image`、`/reelflow/cover`）：按模型单价×张数（默认高质量 ≈3 积分/张），响应 `creditsTotal` 是确切值。
- 生图一次可出 1–4 张，批量里失败的那张不计费。
- 幂等：POST 可带 `Idempotency-Key` 头，同 key 重放返回缓存结果不重复扣费。
