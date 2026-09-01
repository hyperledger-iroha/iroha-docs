---
translation_locale: ja
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: bing-translator-llm

aside: false
pageClass: torii-api-console-page
---

# Torii API コンソール {#torii-api-console}

実行中の Torii API エンドポイントからライブの OpenAPI ドキュメントを使用して、ルートを確認し、テストリクエストを送信し、curl コマンドをコピーし、クライアントコードを生成します。

<ToriiApiConsole />

## 要件 {#requirements}

- Torii API エンドポイントは `/openapi.json` を公開する必要があります。
- ブラウザのテストには、このドキュメントのオリジンを許可するために CORS が必要です。
- ブラウザは、API エンドポイントに直接アクセスできる必要があります。
- コード生成には Node.js、pnpm、および OpenAPI ジェネレーター用の Java ソフトウェアランタイムが必要です。

コンソールはデフォルトで `https://taira.sora.org` になります。ローカル開発では、通常、マシンで Torii を実行するときに `http://127.0.0.1:8080` が使用されます。

## まず Taira を試してください {#try-taira-first}

クライアントを生成する前に、あなたのマシンから公開されている OpenAPI ドキュメントにアクセスできることを確認してください:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

次に、`https://taira.sora.org/openapi.json` をコンソールに貼り付け、`GET /status`、`GET /v1/domains`、または `GET /v1/assets/definitions` のような読み取り専用ルートを試してください。署名済みトランザクションや秘密鍵のフローは、ソフトウェア実行環境から秘密情報を読み込む SDK または CLI クライアント用に保存してください。

## 生成されたクライアント {#generated-clients}

ジェネレーターコマンドは、コンソールが読み込むのと同じライブの OpenAPI ドキュメントを使用します。これは JSON オペレーター、エクスプローラー、アプリ、テレメトリルートに便利です。

署名付きブロックチェーン台帳取引、署名付きクエリ、および Norito ネイティブペイロードの場合、公式の Iroha SDKs を使用することを推奨します。OpenAPI クライアントは署名を組み立てたり、アカウントキーを管理したり、Norito 取引本文をエンコードしたりしません。

OpenAPI ジェネレーターがサポートするすべてのジェネレーターを確認するには、次を実行してください:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
