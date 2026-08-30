---
translation_locale: ja
translation_source: /reference/genesis.md
translation_source_hash: 1312e80d9e662cc3e8cf4d0668ff4bb9e6ce3f74a60bb5287205aeeb5afd5de8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 創世記のリファレンス {#genesis-reference}

現在では Iroha 3 ワークフロー、 `genesis.json` マニフェストは最初のことを説明します
ネットワークの開始時に適用されるトランザクションとパラメータ。

ピアに配布される署名付きアーティファクトは、 Norito-エンコードされた `.nrt` ファイル
によって制作された `kagami genesis sign`.

## 主要分野 {#main-fields}

Genesis マニフェストでは以下を定義できます。

- `chain` チェーン識別子の場合
- `executor` オプションのエグゼキュータ アップグレード バイトコード パスの場合
- `ivm_dir` のために IVM トリガーとアップグレードで使用されるライブラリ
- `consensus_mode` マニフェストによって通知される初期モードの場合
- `transactions` 順序付けられたパラメーターの更新、命令、トリガー、およびトポロジー用
- `crypto` 初期暗号スナップショット用

内で `transactions`, トポロジ エントリはピア ID と PoPs 一緒に：

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## マニフェストを生成する {#generate-a-manifest}

使用 Kagami テンプレートを生成するには:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

一般向け SORA Nexus データスペース、 `npos` は予想されるコンセンサスモードです。
他の Iroha 3 デプロイメントでは、ターゲットに応じて許可付きまたは NPoS を使用する場合があります
プロフィール。

## マニフェストに署名する {#sign-the-manifest}

編集して検証した後、 JSON, デプロイ可能ファイルにサインインします `.nrt` ブロック：

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` マニフェストからジェネシス公開キーを読み取り、使用します
所有者が保持する単一リンクの通常ファイルから秘密キーを取得して、
デプロイ可能な署名付きブロック。ファイルには正規の秘密キーが 1 つ含まれている必要があります
マルチハッシュの後に改行が続きます。 Kagami シンボリックリンクとその他のモードを拒否します
よりも `0600`. 生の秘密キーはコマンド ラインでは受け入れられません。結果
ピアが設定から参照する必要があるファイルです。

## 設定する `iroha3d` {#configure-iroha3d}

デーモンが署名されたジェネシス ブロックを指すようにします。

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

ジェネレーターの実装とコマンドの詳細については、
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
