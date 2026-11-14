---
translation_locale: ja
translation_source: /reference/genesis.md
translation_source_hash: 340921f59a6f8788f559190d520f046ea2473d65154f57a1c54212840c027bc0
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
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 > genesis.json
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
