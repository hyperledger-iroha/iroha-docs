---
translation_locale: ja
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 創世記 の 参照 {#genesis-reference}

現在の Iroha 3 ワークフローでは, `genesis.json` マネスティックはネットワークが起動するときに適用される最初のトランザクションとパラメータを記述します.

同級者に配布された署名したアーテファクトは, Norito コード化された `.nrt`ファイルで, `kagami genesis sign` によって作成されています.

## 主要分野 {#main-fields}

ジェネス・マニフェストは以下を定義できます

- `chain` チェーン識別子
- `executor` 任意の実行者アップグレードバイトコードパス
- `ivm_dir`は,トリガーおよびアップグレードで使用される IVM ライブラリ
- `consensus_mode` マニセットで広告された最初のモード
- `transactions` 順番のパラメータ更新,指示,トリガー,トポロジー
- `crypto` 初期暗号スナップショット

`transactions`内のトポロジーエントリは,ペアIDと PoPs を組み合わせる:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## 宣言 を 生み出す {#generate-a-manifest}

Kagami を使ってテンプレートを作成する

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

公衆のために SORA Nexus データの空間 `npos` 期待されるコンセンサスモードである. Iroha 3 配備は目標プロフィールに応じて,許可されたまたはNPoSを使用することができる.

## 宣言に署名する {#sign-the-manifest}

JSON を編集して検証した後,展開可能な `.nrt` ブロックに署名する:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` はマニフェストからゲネス公钥を読み,提供されたプライベートキー,シード,アルゴリズムを使用してデプロイできる署名ブロックを作成します. 結果は,同類が設定から参照すべきファイルです.

## 設定 `irohad` {#configure-irohad}

署名されたジェネシスブロックに デイモンを指す

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

発電機の実装とコマンドの詳細については, [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md)を参照してください.
