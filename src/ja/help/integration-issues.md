---
translation_locale: ja
translation_source: /help/integration-issues.md
translation_source_hash: c5f169e423806fa2a9e9d198971588d1aa0b199a28d64e8b089b9f81727550a5
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# 統合の問題のトラブルシューティング {#troubleshooting-integration-issues}

このセクションでは、Iroha 3 統合のトラブルシューティングのヒントを提供します。ここに記載されていない問題が発生した場合は、[テレグラム](https://t.me/hyperledgeriroha)を通じてお問い合わせください。

## クライアントが接続できません {#client-cannot-connect}

クライアントの設定がネットワークピアの Torii アドレスを指していることを確認してください:

```toml
torii_url = "http://127.0.0.1:8080/"
```

CLI チェックの場合、同じファイルを明示的に渡してください:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

ネットワークピアが Docker または Kubernetes で実行されている場合、クライアントプロセスから到達可能なホストまたはサービスのアドレスを使用してください。コンテナ内の `127.0.0.1` はホストマシンではありません。

公開用の Taira テストの場合、署名されていない API エンドポイントプローブから始めてください:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

これらのコマンドが `502`、TLS、DNS、またはタイムアウトエラーで失敗する場合は、ネットワークの到達可能性を修正するか、アカウントキーやトランザクションペイロードをデバッグする前にパブリックテストネットの API エンドポイントを待ってください。

## 取引は拒否されます {#transactions-are-rejected}

ほとんどの取引の失敗は、本人確認または認証の不一致によって引き起こされます：

- クライアント設定のアカウント公開鍵が、署名に使用された秘密鍵と一致しません
- そのアカウントはブロックチェーンのジェネシスまたは以前のトランザクションによって登録されていません
- そのアカウントには、ソフトウェアランタイムバリデーターが必要とする権限トークンまたは役割がありません
- ドメインIDにデータスペースの指定がありません。例えば `domain.dataspace` のような形式です。

エラーを読みやすくするために、CLI コマンドをデバッグする際は `--output-format text` を使用してください:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## クエリは空の結果を返します {#queries-return-empty-results}

空のクエリ結果は、クエリが失敗したことを必ずしも意味するわけではありません。確認してください:

- オブジェクトを作成すべき取引が完了した
- 照会されたドメイン、資産定義、またはアカウントIDは正準です
- ページネーションやフィルターが、期待される行を除外していません
- クライアントは別のローカルネットではなく、意図したネットワークに接続されています

ドメインチェックの場合は、最も広いクエリから始めます:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## イベントまたはブロックストリームが早期に停止する {#event-or-block-streams-stop-early}

ブロックとイベントストリームの例は、Torii のストリーミング API エンドポイントを使用します。ピアが引き続き稼働していることを確認してから、タイムアウトを指定してテストします:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

HTTP 統合については、現在の [Torii API エンドポイント参照](/ja/reference/torii-endpoints.md) と API エンドポイントパスを比較してください。
