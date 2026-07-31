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

使用现场 OpenAPI 来自一个运行文件 Torii 检查路线的终点,
发送测试请求,复制 curl 命令,并生成客户端代码.

<ToriiApiConsole />

## 要求 {#requirements}

- 其他 Torii 终点必须暴露 `/openapi.json`.
- 浏览器测试需要 CORS 为了允许这些文件的来源.
- 浏览器必须能够直接到达终点.
- 代码生成需要 Node.js, pnpm, 和Java运行时间 OpenAPI
  发电机.

控制台默认为 `https://taira.sora.org`. 地方发展通常
工作 `http://127.0.0.1:8080` 当你跑时 Torii 在你的机器上.

## 试着 Taira 首先 {#try-taira-first}

在创建客户之前,请检查公众 OpenAPI 文件可访问
在您的机器上:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

然后粘贴 `https://taira.sora.org/openapi.json` 在控制台上试一下
仅可阅读的路线,如 `GET /status`, `GET /v1/domains`, 或
`GET /v1/assets/definitions`. 保存签署的交易和私钥流动
一个 SDK 或 CLI 客户端从你的运行时间环境中加载的秘密.

## 产生的客户 {#generated-clients}

发电器命令使用相同的直播 OpenAPI 文件显示控制台
这对 JSON 运营商,探索者,应用程序和远程测量路线.

签署的账本交易,签署的查询, Norito-原生用品,
喜欢官员 Iroha SDKs. OpenAPI 客户不收集签名,
管理帐户密钥或编码 Norito 为您提供交易机构.

为了检查支持的每个发电机 OpenAPI 发电机,运行:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
