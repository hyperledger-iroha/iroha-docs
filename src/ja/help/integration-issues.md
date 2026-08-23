---
translation_locale: ja
translation_source: /help/integration-issues.md
translation_source_hash: c5f169e423806fa2a9e9d198971588d1aa0b199a28d64e8b089b9f81727550a5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 統合問題解決 {#troubleshooting-integration-issues}

このセクションでは, Iroha 3 統合に関するトラブルシューティングのヒントを提供しています.あなたが経験している問題はここで説明されていない場合は, [テレグラム](https://t.me/hyperledgeriroha) を介して連絡してください.

## クライアントは接続できない {#client-cannot-connect}

クライアントの設定が同級者の Torii アドレスを指すかどうかを確認する:

```toml
torii_url = "http://127.0.0.1:8080/"
```

CLI のチェックについては,同じファイルを明示的に渡す.

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Docker またはKubernetesで peer が実行されている場合,クライアントプロセスからアクセス可能なホストまたはサービスアドレスを使用します. コンテナ内の `127.0.0.1` はホストマシンではありません.

公的な Taira 試験では,署名されていないエンドポイント探査機から開始します.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

この命令が失敗した場合 `502`, TLS, DNS, ネットワークのアクセシビリティを修正したり,公衆に待機したりする口座鍵やトランザクションの有用な負荷をデバッグする前にテストネットエンドポイント

## 取引は拒否される {#transactions-are-rejected}

ほとんどのトランザクションの失敗は,アイデンティティや権限不一致によって引き起こされます.

- クライアント設定のアカウント公開鍵は署名に使用されたプライベート鍵と一致しない.
- 口座は,先行または以前の取引で登録されていない
- アカウントには,実行時間の検証器が要求する許可トークンまたは役割がない.
- ID ドメインは, `domain.dataspace`などのデータスペース資格が欠けている

CLI コマンドをデバッグする際に `--output-format text` を使用して,エラーが読みやすくします.

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## 查询で空き結果が返されます {#queries-return-empty-results}

空きクエリ結果は,常にクエリが失敗したという意味ではありません.チェック:

- 対象を創造すべき取引が行われた.
- 尋問されたドメイン,資産定義,またはアカウント ID は法定である.
- ページ化やフィルターは期待された行を排除していない
- クライアントは他のローカルネットではなく,意図されたネットワークに接続されている.

ドメインチェックでは,最も広いクエリから始めます:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## イベントまたはブロックストリームが早めに停止します {#event-or-block-streams-stop-early}

ブロックとイベントストリーム例では, Torii ストリーミングエンドポイントに依存します.ピアがまだ実行されていることを確認し,タイムアウトでテストします:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

HTTP 統合については,エンドポイントの経路を現在の [Torii エンドポイント参照](/ja/reference/torii-endpoints.md) と比較してください.
