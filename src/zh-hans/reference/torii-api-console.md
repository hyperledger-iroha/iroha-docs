---
translation_locale: zh-hans
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API 控制台 {#torii-api-console}

使用从运行 Torii 端点的直播 OpenAPI 文档来检查路线,发送测试请求,复制 curl 指令并生成客户端代码.

<ToriiApiConsole />

## 要求 {#requirements}

- Torii 端点必须暴露`/openapi.json`.
- 浏览器测试需要 CORS 才能允许此文档的来源.
- 浏览器必须能够直接到达端点.
- 代码生成需要 Node.js, pnpm,以及 OpenAPI 发电机的Java运行时.

默认的控制台为 `https://taira.sora.org`. 地方发展通常与 `http://127.0.0.1:8080` 当你跑步时 Torii 在你的机器上.

## 首先试看 Taira {#try-taira-first}

在生成客户端之前,请检查公开 OpenAPI 文件是否可以从您的机器中访问:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

然后将 `https://taira.sora.org/openapi.json` 粘贴到控制台中,然后尝试阅读式路线,如`GET /status`, `GET /v1/domains`或 `GET /v1/assets/definitions`.为您的运行环境中的秘密加载的 SDK 或 CLI 客户端保存签署的交易和私钥流动.

## 产生的客户 {#generated-clients}

生成器命令使用控制台加载的同一个直播 OpenAPI 文档.这对于 JSON 操作员,探索者,应用程序和远程测量路线来说有用.

对于签署的账本交易,签署的查询和 Norito-原生有效载荷,更喜欢官方的 Iroha SDKs. OpenAPI 客户端不为您组装签名,管理帐户密钥或编码 Norito 交易机构.

要检查每个由 OpenAPI 发电机支持的发电器,运行:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
