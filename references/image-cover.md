# 生图与封面（按模型单价×张数计费）

两个端点都是 `POST`、JSON body、返回已托管的公网图 URL（进用户资产库）。
部分成功会返回 `partial: true` + `failures`；全失败 502（不扣费）或 402（积分不足）。

## POST /reelflow/image — 通用生图

```json
{
  "prompt": "生图提示词（必填）",
  "size": "1024x1536",        // 可选：1024x1024 | 1024x1536(竖,默认) | 1536x1024(横)
  "quality": "high",           // 可选：auto|low|medium|high(默认)
  "count": 1,                  // 可选 1-4，每张独立计费
  "referenceImage": "data:..." // 可选：参考图 data URL（图生图）
}
```

响应：`{ images: [{assetId, imageUrl, consumed}], creditsTotal, succeeded, failed, partial }`

## POST /reelflow/cover — 平台封面（服务端组装提示词）

两种用法：**A. 给要素让服务端组装**（推荐，出片稳定）；**B. 直传完整 prompt**。

```json
{
  "platform": "xhs",          // xhs 3:4(默认) | douyin 9:16 | wechat 2.35:1
  "sizeId": "portrait",       // 可选，覆盖 platform：square/portrait/landscape169/landscape43
  "subject": "选题/主体",      // A 用法：subject/title 至少一个
  "title": "封面标题文字",
  "template": "poster",       // 画风：poster大字报(默认)/magazine杂志/tech科技/ins清新/guochao国潮/compare前后对比
  "mood": "明亮清新",          // 可选氛围
  "keyword": "卖点词",         // 可选
  "count": 1
}
```

响应额外含 `prompt`（组装后的完整提示词）——不满意时微调它改走 B 用法直传重试。

## 提示词经验（BYO，你自己写时）

- 中文提示词效果好；明确「画面主体 + 构图 + 风格 + 光线」。
- 图内要有文字时：写「画面醒目位置放大标题文字「XX」，清晰可读、无错别字」；结尾加「避免水印、乱码、多余文字」。
- 小红书封面 = 3:4 竖版（1024x1536）；内页配图同尺寸保持一致观感。
- 生成 2-4 张让用户挑，比 1 张重试更省积分。
