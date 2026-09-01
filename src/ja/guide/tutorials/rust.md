---
translation_locale: ja
translation_source: /guide/tutorials/rust.md
translation_source_hash: 98b0c3a193c6dfe8b266bcc498d7016426cf2f838a7bf7ebfbef145ffdcc7944
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Rust {#rust}

Rust の実装はメインワークスペースに存在し、Iroha 3 コードベースを扱う最も直接的な方法のままです。

## あなたが得るもの {#what-you-get}

上流のリポジトリは現在、次のものを公開しています:

- `iroha` Rust クライアントソフトウェアパッケージ
- 最も完全なリファレンスクライアントとしての`iroha` CLI
- 共有データモデル、暗号、および Norito ソフトウェアパッケージは SDK レイヤーで使用されます

## 推奨開始地点 {#recommended-starting-point}

プロジェクトの現状については、参照 CLI と作業スペース自体から始めてください:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

チェックインされたデフォルトクライアント設定でリファレンスクライアントを実行します:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## 試す Taira 読み取り専用 {#try-taira-read-only}

同じワークスペースのチェックアウトから、公開されている Taira 診断ヘルパーを試してください:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

ルートレベルのチェックには、Torii の JSON API を直接使用してください:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

`taira.client.toml` を作成した後、同じバイナリは署名付きカナリアコマンドを Taira に対して実行できます。これらは普通のユニットテストとは別にしておいてください。なぜなら、テストネット資金があるアカウントと実際のテストネットの利用可能性が必要だからです。

## Rust クライアントソフトウェアパッケージを使用する {#using-the-rust-client-crate}

ネットワークで使用される Iroha Git リビジョンを固定する:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

もし、Rust サーフェスが実際にどのように使用されているかの最も完全な例が必要な場合は、次を確認してください:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

ブロックチェーン台帳エスクローのワークフローによって管理されるものについては、[ネイティブ資産エスクロー](/ja/blockchain/escrow.md#rust-sdk) を参照してください。Rust データモデルは、現在、マーケットプレイスエスクロー、汎用資産ロック、匿名エスクロー、クエリ、およびイベントに対して最も完全な型付きカバレッジを提供しています。

次の方法でローカルの CLI ヘルプデータのスナップショットを再生成できます:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## ノート {#notes}

- 現在、CLI は単独のソフトウェアパッケージのドキュメントよりも優れたカバレッジを提供しています。
- オペレーター形式のフローの場合、CLI のドキュメントが最も最新の情報源です。
