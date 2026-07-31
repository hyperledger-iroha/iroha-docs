---
translation_locale: zh-hant
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API 控制台 {#torii-api-console}

請使用直播 OpenAPI 來自運行文件 Torii 檢查路線的終點,
發送測試要求,複製 curl 並生成客戶端代碼.

<ToriiApiConsole />

## 要求 {#requirements}

- 其他國家 Torii 終點必須暴露 `/openapi.json`.
- 需要進行覽器測試 CORS 這份文件的起源.
- 覽器必須能夠直接到達終點.
- 代碼生成需要 Node.js, pnpm, 並使用Java執行時間 OpenAPI
  發電機.

預設的控制台為 `https://taira.sora.org`. 地方發展通常
工作與 `http://127.0.0.1:8080` 當你跑時 Torii 在您的機器上.

## 請試下 Taira 首先, {#try-taira-first}

在建立客戶之前, OpenAPI 文件可取得
在您的機器上:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

接著貼起來 `https://taira.sora.org/openapi.json` 在台灣,
只有閱讀的路線,例如 `GET /status`, `GET /v1/domains`, 或是
`GET /v1/assets/definitions`. 保存已簽署的交易和私密鍵流程
其他國家 SDK 或是 CLI 這位客戶將您的運行時間環境加上秘密.

## 產生的客戶 {#generated-clients}

發電器使用相同的直播命令 OpenAPI 文件顯示控制台
這樣對 JSON 該項目的目標是:

在簽名帳號交易,簽名查詢, Norito-原住民的用荷物,
喜歡官員 Iroha SDKs. OpenAPI 客戶不收集簽名,
管理帳戶關鍵或編碼 Norito 這項交易對你來說是很重要的.

檢查所有由 OpenAPI 發電機,運行:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
