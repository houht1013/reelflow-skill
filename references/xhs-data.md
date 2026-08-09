# 小红书数据 API（36 端点 · 2 积分/次）

Base：`https://reelflowai.app/api/v1`，全部 `Authorization: Bearer $REELFLOW_API_KEY`。
参数 schema 以 `GET /api/v1/openapi` 为准；下面是高频用法。

## Web 端（GET，query 传参）

| 端点 | 用途 | 关键参数 |
|---|---|---|
| `/xiaohongshu/web_v3/fetch_hot_list` | 热榜（选题灵感） | 无 |
| `/xiaohongshu/web_v3/fetch_search_suggest` | 搜索联想词（挖长尾） | `keyword` |
| `/xiaohongshu/web_v3/fetch_homefeed` | 首页推荐流 | 见 openapi |
| `/xiaohongshu/web_v3/fetch_note_detail` | 笔记详情 | 见 openapi（note_id + xsec_token） |
| `/xiaohongshu/web_v3/fetch_user_info` | 用户信息 | 见 openapi |

## App 端（GET，query 传参）

| 端点 | 用途 | 关键参数 |
|---|---|---|
| `/xiaohongshu/app_v2/search_notes` | **搜笔记（最常用：对标研究）** | `keyword`, `page`, `sort`(general/hot/time), `noteType`(_0全部/_1视频/_2图文) |
| `/xiaohongshu/app_v2/search_users` | 搜用户 | `keyword`, `page` |
| `/xiaohongshu/app_v2/get_note_comments` | 笔记评论（挖用户语言/痛点） | `note_id` |
| `/xiaohongshu/app_v2/get_note_sub_comments` | 楼中楼 | `note_id`, `root_comment_id` |
| `/xiaohongshu/app_v2/get_image_note_detail` / `get_video_note_detail` | 图文/视频笔记详情 | `note_id` |
| `/xiaohongshu/app_v2/get_user_info` / `get_user_posted_notes` / `get_user_faved_notes` | 用户画像/作品/收藏 | `user_id` |
| `/xiaohongshu/app_v2/get_topic_info` / `get_topic_feed` | 话题热度/话题流（选标签） | 见 openapi |
| `/xiaohongshu/app_v2/get_creator_hot_inspiration_feed` / `get_creator_inspiration_feed` | 创作灵感（官方选题库） | 见 openapi |
| `/xiaohongshu/app_v2/search_products` / `get_product_detail` / `get_product_reviews` … | 电商商品/评价 | 见 openapi |

## 蒲公英（POST，JSON body；博主商单数据/选号）

`/xiaohongshu/pgy/get_blogger_list`（选号列表）、`get_blogger_detail`、`get_blogger_notes`、`get_blogger_notes_rate`（转化率）、`get_blogger_core_data`、`get_blogger_data_summary`、`get_blogger_fans_summary` / `get_blogger_fans_profile`（粉丝画像）/ `get_blogger_fans_history`、`get_note_detail`。多数需要 `brand_user_id` 等业务参数（见 openapi）。

## 示例

```bash
# 对标研究：搜「手冲咖啡」爆款图文
curl -sS -H "Authorization: Bearer $REELFLOW_API_KEY" \
  "https://reelflowai.app/api/v1/xiaohongshu/app_v2/search_notes?keyword=%E6%89%8B%E5%86%B2%E5%92%96%E5%95%A1&page=1&sort=hot&noteType=_2"
```

响应外层是 TikHub 信封：`{code, data, …}`，业务数据在 `data` 里。
