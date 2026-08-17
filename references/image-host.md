# 图床：上传图片换公网直链

把本地图片（或任何你手上的图片字节）上传到 Reelflow 图床（阿里云 OSS），返回**稳定的公网直链**，可直接用于 Markdown 外链、网页、小红书/公众号发布素材等。图片同时登记进用户的 Reelflow 资产库。

- 端点：`POST /images/host`（Base：`https://api.reelflowai.app/v1`）
- 计费：**1 积分/次**，仅成功计费
- 限制：单张 ≤20MB；格式 png / jpg / webp / gif / avif（按文件魔数识别，SVG 不收）；**不支持远程 URL 转存**——请先把远程图下载到本地再上传

## 两种提交方式

**方式一：multipart 直传文件（推荐，省 1/3 体积）**

```bash
curl -X POST https://api.reelflowai.app/v1/images/host \
  -H "Authorization: Bearer $REELFLOW_API_KEY" \
  -F "file=@./cover.png"
```

**方式二：JSON base64**（`image` 支持 dataURI 或裸 base64；`filename` 选填，资产库展示用）

```bash
node -e '
const fs = require("fs");
const b64 = fs.readFileSync(process.argv[1]).toString("base64");
fetch("https://api.reelflowai.app/v1/images/host", {
  method: "POST",
  headers: { authorization: `Bearer ${process.env.REELFLOW_API_KEY}`, "content-type": "application/json" },
  body: JSON.stringify({ image: b64, filename: process.argv[1].split(/[\\/]/).pop() }),
}).then(r => r.json()).then(j => console.log(JSON.stringify(j, null, 2)));
' ./cover.png
```

装了 CLI 的话一行搞定：`reelflow host ./cover.png`

## 返回

```json
{
  "url": "https://reelflow.oss-cn-hangzhou.aliyuncs.com/reelflow/images/<uuid>.png",
  "key": "reelflow/images/<uuid>.png",
  "mime": "image/png",
  "size": 34567,
  "assetId": "…"
}
```

`url` 即公网直链（不过期，无防盗链）。`assetId` 是资产库记录，用户可在 reelflowai.app 站内查看与管理。

## 常见错误

| 状态 | 含义 | 处理 |
|---|---|---|
| 400 `invalid_input` | 没给图：multipart 缺 `file` 字段 / JSON 缺 `image` | 检查提交形态 |
| 413 `payload_too_large` | 超 20MB | 压缩后再传 |
| 415 `unsupported_media_type` | 魔数不是支持的图片格式 | 确认文件确实是 png/jpg/webp/gif/avif |
| 402 | 积分不足 | 告诉用户去充值，**不要重试** |

## 典型组合用法

- **生图 → 图床**：`/images/generations` 传 `response_format: "url"` 已经直接返回托管直链，无需再过图床。图床用于**你自己已有的图**（本地文件、其他工具产物）。
- **图床 → 小红书发布**：先 `POST /images/host` 拿直链，再把直链填进 `/rednote/publish` 的 `images` 数组（该端点要求图片 URL 公网可访问，图床直链正好满足）。
