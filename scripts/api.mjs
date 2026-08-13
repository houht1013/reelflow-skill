#!/usr/bin/env node
// Reelflow API 零依赖调用助手（Node ≥ 18）。
// 用法:
//   node api.mjs GET  /credits
//   node api.mjs GET  "/xiaohongshu/app_v2/search_notes?keyword=咖啡&page=1"
//   node api.mjs POST /reelflow/cover '{"platform":"xhs","subject":"手冲咖啡","title":"3步冲出好咖啡"}'
// 环境变量: REELFLOW_API_KEY(必填), REELFLOW_BASE(默认 https://api.reelflowai.app/v1)

const [method, path, body] = process.argv.slice(2)
const key = process.env.REELFLOW_API_KEY
const base = (process.env.REELFLOW_BASE || 'https://api.reelflowai.app/v1').replace(/\/$/, '')

if (!key) { console.error('缺少 REELFLOW_API_KEY 环境变量（见 references/getting-started.md）'); process.exit(2) }
if (!method || !path) { console.error('用法: node api.mjs <GET|POST> <path> [json-body]'); process.exit(2) }

const url = path.startsWith('http') ? path : base + (path.startsWith('/') ? path : '/' + path)
const ctrl = new AbortController()
const t = setTimeout(() => ctrl.abort(), 60_000) // 生图较慢，给足超时
const init = { method: method.toUpperCase(), headers: { Authorization: `Bearer ${key}` }, signal: ctrl.signal }
if (body) { init.headers['Content-Type'] = 'application/json'; init.body = body }

let res
try { res = await fetch(url, init) } catch (e) { console.error(e.name === 'AbortError' ? '请求超时（60s）' : `网络错误：${e.message}`); process.exit(1) } finally { clearTimeout(t) }
const text = await res.text()
try { console.log(JSON.stringify(JSON.parse(text), null, 2)) } catch { console.log(text) }
if (!res.ok) {
  const hint = res.status === 402 ? '（积分不足，去 reelflowai.app 充值，勿重试）'
    : res.status === 429 ? '（触发限流，稍等再试）'
    : res.status === 401 ? '（Key 无效/过期，重建 Key）' : ''
  console.error(`\nHTTP ${res.status} ${hint}`); process.exit(1)
}
