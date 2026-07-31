---
translation_locale: ja
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 創世記 {#genesis}

創世記は初期チェーン状態を定義する.編集可能なソースは JSON マネスティックであり, Iroha 3 ノードは署名された Norito トランザクションファイルを使用します.

::: details デフォルトジェネシス マニフェスト

<<< @/snippets/genesis.json

:::

## ファイル {#files}

上流リポジトリは `defaults/genesis.json` にデフォルトマニストを送信する. Kagami で生成されたネットワークは,出力ディレクトリに自社のマニストと署名したトランザクションを書き込む:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

そのディレクトリに生成された `README.md` は,選択したプロフィールの正確なファイルと起動コマンドを記録します.

## 同級 者 の 構成 {#peer-configuration}

`config.toml` の `[genesis]` セクションで署名されたジェネス取引の先輩は,

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

ネットワーク内のすべての同級者は署名されたジェネス取引とジェネス公開鍵について合意しなければなりません.

## 創世記 の 署名 {#signing-genesis}

マニフェストを手動で編集する場合は,同級者を開始する前に確認し署名します.

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

NPOS または Nexus プロフィールには,トポロジーと BLS 生成されたプロフィールで要求される所有の証明書 Kagami `localnet`, `wizard`, プロフィール生成コマンドは,その詳細を自動的に処理します.

## 創世記 を 再発 する {#recommitting-genesis}

ピアは,保存が空いている場合にのみゲネスを実行する.一次性ローカルネットで新しいゲネスをテストするには,ピアを停止し,生成されたステートディレクトリを取り除いて,新しい署名したゲネスから開始します.すべての検証者が同じ移行を調整していない限り,実行中のネットワーク上のゲネスを置き換えてはいけません.
