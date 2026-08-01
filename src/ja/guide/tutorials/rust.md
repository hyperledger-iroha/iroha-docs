---
translation_locale: ja
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

Rust 実装は主要な作業空間に存在し,Iroha 3 コードベースで働く最も直接的な方法であり続けています.

## あなた は 何 を 得 ます か {#what-you-get}

アウトストリームリポジトリは,現在以下を明らかにしている.

- `iroha` Rust クライアントボックス
- `iroha` CLI は最も完全な参照クライアントとして
- SDK 層で使用される共有データモデル,暗号,および Norito 箱

## 推奨する出発点 {#recommended-starting-point}

プロジェクトの現在の状態については,参照 CLI と作業空間そのものを入力して開始します.

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

チェックインしたデフォルトクライアント設定で参照クライアントを実行する:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Taira 試聴する {#try-taira-read-only}

同じワークスペースのチェックアウトから,公衆の診断補助人 Taira を試してみてください.

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

経路レベルチェックでは,直接 Torii の JSON API を使用してください.

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

`taira.client.toml` を作成した後,同じバイナリーは Taira に対して署名されたカナリーコマンドを実行できます. 普通のユニットテストから切り離してください. それは faucet 資金によるアカウントとライブテストネットの利用が必要だからです.

## Rust クライアントキャストを使用する {#using-the-rust-client-crate}

ネットワークが使用している Iroha Git の修正をピンします:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Rust 表面が実用的にどのように使用されているかについての最も完全な例を要する場合は,次のことを確認してください.

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

本書管理のエスクローワークフローについては, [ネイティブ・アセット・エスクロー](/ja/blockchain/escrow.md#rust-sdk)を参照してください. Rust データモデルは現在,市場エスクロー,一般的な資産ロック,匿名のエスクロ,查询,イベントに関する最も完全なタイプカバーを持っています.

ローカル CLI のヘルプスナップショットを再生できます:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## 記号 {#notes}

- CLI は現在,自立カートドックよりもより良いカバーを提供します.
- オペレーター様式の流れについては, CLI のドキュメントが最も最新の情報源である.
