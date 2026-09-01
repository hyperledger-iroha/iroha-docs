---
translation_locale: ja
translation_source: /reference/genesis.md
translation_source_hash: ac6bad693ed382dede0818132b8649fe14726283508da897a32eea417e5bbb28
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ブロックチェーン ジェネシス リファレンス {#genesis-reference}

現在の Iroha 3 ワークフローでは、`genesis.json`技術マニフェストが、ネットワーク開始時に適用される最初のトランザクションとパラメータを記述します。

ネットワークのピアに配布される署名付きアーティファクトは、`kagami genesis sign`によって生成された`.nrt`ファイルで、Norito でエンコードされています。

## 主な分野 {#main-fields}

ブロックチェーンのジェネシス技術マニフェストは以下を定義することができる：

- チェーン識別子のための`chain`
- `executor` オプションの実行者アップグレードバイトコードパス用
- IVM のトリガーおよびアップグレードで使用される `ivm_dir` ライブラリ
- `consensus_mode` 技術マニフェストで宣伝されている初期モード用
- `transactions` は、順序付けられたパラメータ更新、指示、トリガー、およびトポロジー用です
- `crypto` 初期の暗号データスナップショット用

`transactions` 内で、トポロジーエントリはネットワークピアIDと PoPs をペアにします:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## 技術的なマニフェストを生成する {#generate-a-manifest}

Kagami を使用してテンプレートを生成する：

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

公共の SORA Nexus データスペースでは、`npos` が期待されるコンセンサスモードです。他の Iroha 3 の展開では、対象プロファイルに応じてパーミッション型または NPoS を使用する場合があります。

## 技術的マニフェストに署名する {#sign-the-manifest}

編集して検証した後 JSON, それをデプロイ可能なものに署名する `.nrt` ブロック：

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign`は、技術マニフェストからブロックチェーンのジェネシス公開鍵を読み取り、所有者が保持する単一リンクの通常ファイルからプライベート鍵を使用して、デプロイ可能な署名付きブロックを生成します。ファイルには、1つの正規のプライベートキー多重ハッシュが1行で含まれている必要があります。Kagami はシンボリックリンクおよび`0600`以外のモードを拒否します。コマンドラインで生のプライベートキーは受け付けられません。結果として得られるのは、ネットワークピアが自分の設定から参照すべきファイルです。

## `iroha3d` を設定する {#configure-iroha3d}

デーモンを署名済みブロックチェーンのジェネシスブロックに向ける:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## 関連ツール {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

ジェネレーターの実装およびコマンドの詳細については、[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md)を参照してください。
