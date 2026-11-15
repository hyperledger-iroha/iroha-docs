---
translation_locale: ja
translation_source: /reference/genesis.md
translation_source_hash: dda17468f39573a1fcf43474351bd01c4fea38e8b603fd4d8b21780b273c8649
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# ブロックチェーン ジェネシス リファレンス {#genesis-reference}

現在の Iroha 3 ワークフローでは、`genesis.json`技術マニフェストが、ネットワーク開始時に適用される最初のトランザクションとパラメータを記述します。

ネットワークのピアに配布される署名付きアーティファクトは、`kagami genesis sign`によって生成された`.nrt`ファイルで、Norito でエンコードされています。

## 主な分野 {#main-fields}

ブロックチェーンのジェネシス技術マニフェストは以下を定義することができる：

- チェーン識別子のための`chain`
- `chain_discriminant`: マニフェスト内のアカウントリテラルを符号化する際に使う I105 のネットワーク接頭辞
- `executor` オプションの実行者アップグレードバイトコードパス用
- IVM のトリガーおよびアップグレードで使用される `ivm_dir` ライブラリ
- `consensus_mode` 技術マニフェストで宣伝されている初期モード用
- `wire_protocol_version`: 最初のリリースにおけるコンセンサスの通信プロトコルのバージョン
- `consensus_fingerprint`: コンセンサスパラメーターの任意の型付きフィンガープリント。JSON マニフェストではこれを明示的に記述します
- `transactions` は、順序付けられたパラメータ更新、指示、トリガー、およびトポロジー用です
- `sumeragi_context`: 署名付き Sumeragi ブロック高コンテキストのパラメーター
- `crypto_admission_policy`: チェーンで許可する署名アルゴリズムとコントローラーのアルゴリズムを、`allowed_algorithms` に明示的に列挙したもの

`transactions` 内で、トポロジーエントリはネットワークピアIDと PoPs をペアにします:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## 技術的なマニフェストを生成する {#generate-a-manifest}

Kagami を使ってテンプレートを生成します。許可するすべてのアルゴリズムについて、正規の昇順で `--allowed-signing` を繰り返し指定してください。Kagami は省略されたアルゴリズムを補いません。

```bash
cargo run -p iroha_kagami -- genesis generate \
  --chain-id <CHAIN_ID> \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 \
  --allowed-signing bls_normal > genesis.json
```

公共の SORA Nexus データスペースでは、`npos` が期待されるコンセンサスモードです。他の Iroha 3 の展開では、対象プロファイルに応じてパーミッション型または NPoS を使用する場合があります。

## 技術的マニフェストに署名する {#sign-the-manifest}

編集して検証した後 JSON, それをデプロイ可能なものに署名する `.nrt` ブロック：

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt \
  --expected-hash-out genesis.expected_hash
```

`kagami genesis sign` は、所有者が保持する単一リンクの通常ファイル内の秘密鍵からジェネシスの鍵ペアを導出し、デプロイ可能な署名付きブロックを生成します。公開済みのジェネシス公開鍵と一致することを必須にするには、`--expected-public-key` を渡します。ファイルには、1つの正規の秘密鍵マルチハッシュとそれに続く改行が含まれている必要があります。Kagami はシンボリックリンクおよび`0600`以外のモードを拒否します。コマンドラインで生の秘密鍵は受け付けられません。結果として得られるのは、ネットワークピアが自分の設定から参照すべきファイルです。

## `iroha3d` を設定する {#configure-iroha3d}

署名済みのジェネシスブロックと、その期待ハッシュを固定するファイルをデーモンに指定します。`kagami genesis sign --expected-hash-out` がこのファイルを書き出し、ノードは新規起動時にも再起動時にもこのファイルを必要とします。

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
expected_hash_file = "genesis.expected_hash"
```

## 関連ツール {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet generate`
- `cargo xtask kagami-profiles`

ジェネレーターの実装およびコマンドの詳細については、[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami/README.md)を参照してください。
