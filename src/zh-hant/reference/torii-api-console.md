---
translation_locale: zh-hant
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API 控制檯 {#torii-api-console}

使用從執行 Torii 端點的直播 OpenAPI 文件來檢查路線,傳送測試請求,複製 curl 指令並生成客戶端程式碼.

<ToriiApiConsole />

## 要求 {#requirements}

- Torii 端點必須暴露`/openapi.json`.
- 瀏覽器測試需要 CORS 才能允許此文件的來源.
- 瀏覽器必須能夠直接到達端點.
- 程式碼生成需要 Node.js, pnpm,以及 OpenAPI 發電機的Java執行階段.

預設的控制檯為 `https://taira.sora.org`. 地方發展通常與 `http://127.0.0.1:8080` 當你跑步時 Torii 在你的機器上.

## 首先試看 Taira {#try-taira-first}

在生成客戶端之前,請檢查公開 OpenAPI 檔案是否可以從您的機器中訪問:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

然後將 `https://taira.sora.org/openapi.json` 貼上到控制檯中,然後嘗試閱讀式路線,如`GET /status`, `GET /v1/domains`或 `GET /v1/assets/definitions`.為您的執行環境中的秘密載入的 SDK 或 CLI 客戶端儲存簽署的交易和私鑰流動.

## 產生的客戶 {#generated-clients}

生成器命令使用控制檯載入的同一個直播 OpenAPI 文件.這對於 JSON 操作員,探索者,應用程式和遠端測量路線來說有用.

對於簽署的賬本交易,簽署的查詢和 Norito-原生有效載荷,更喜歡官方的 Iroha SDKs. OpenAPI 客戶端不為您組裝簽名,管理帳戶金鑰或編碼 Norito 交易機構.

要檢查每個由 OpenAPI 發電機支援的發電器,執行:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
