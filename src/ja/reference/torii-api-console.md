---
translation_locale: ja
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API コンソール {#torii-api-console}

実行中の Torii エンドポイントからライブ OpenAPI ドキュメントを使用してルートを検査し,テストリクエストを送信し, curl コマンドをコピーし,クライアントコードを作成します.

<ToriiApiConsole />

## 要求 {#requirements}

- Torii エンドポイントは, `/openapi.json`を暴露しなければならない.
- ブラウザテストは CORS を必要とするが,このドキュメントの起源を許可する.
- ブラウザはエンドポイントに直接アクセスできる必要があります.
- コード生成には Node.js, pnpm,および OpenAPI 発電機のJava実行時間が必要です.

コンソールはデフォルトで `https://taira.sora.org` に設定されます. ローカル開発は通常,コンピュータ上で Torii を実行するときに `http://127.0.0.1:8080` と動作します.

## まず Taira を試してみてください {#try-taira-first}

クライアントを生成する前に,公共の OpenAPI 文書があなたのマシンからアクセス可能なかどうかを確認してください.

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

その後,コンソールに `https://taira.sora.org/openapi.json` をペーストし,読み込みのみの経路を試してください. 例えば `GET /status`, `GET /v1/domains`,または `GET /v1/assets/definitions`. 実行時の環境からの秘密をロードする SDK または CLI クライアントのために署名されたトランザクションとプライベートキーフローを保存します.

## 作成されたクライアント {#generated-clients}

生成器コマンドは,コンソールが読み込む同じライブ OpenAPI ドキュメントを使用します.これは JSON オペレーター,エクスプローバー,アプリ,そしてテレメトリルートに有用です.

署名された本簿取引,署名したクエリ,および Norito ネイティブ・ペイルロードの場合,公式の Iroha SDKs を好みます. OpenAPI クライアントはサインを組み立てたり,アカウントキーを管理したり,あなたのために Norito トランザクションボディをコードしたりしません.

OpenAPI ジェネレーターによってサポートされているすべての発電機を検査するには,次の操作を実行します.

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
