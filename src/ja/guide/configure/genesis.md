---
translation_locale: ja
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ブロックチェーンのジェネシス {#genesis}

ブロックチェーンのジェネシスは初期のチェーン状態を定義します。編集可能なソースは JSON 技術マニフェストであり、Iroha 3 ノードは署名済みの Norito トランザクションファイルを消費します。

::: details デフォルトのブロックチェーンジェネシス技術マニフェスト

<<< @/snippets/genesis.json

:::

## ファイル {#files}

上流のリポジトリは `defaults/genesis.json` でデフォルトの技術マニフェストを提供します。Kagami によって生成されたネットワークは、それぞれ独自の技術マニフェストと署名付きトランザクションを出力ディレクトリに書き込みます:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

そのディレクトリに生成された`README.md`は、選択されたプロファイルの正確なファイルと起動コマンドを記録します。

## ネットワークピアの設定 {#peer-configuration}

ネットワークのピアは、`config.toml` の `[genesis]` セクションにある署名済みブロックチェーンジェネシストランザクションを指します:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

ネットワーク内のすべてのピアは、署名されたブロックチェーンの創世トランザクションとブロックチェーンの創世公開鍵に同意しなければなりません。

## ブロックチェーンのジェネシスに署名する {#signing-genesis}

技術的なマニフェストを手動で編集する場合は、ネットワークピアを起動する前に、検証して署名してください:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` は、所有者保持モード-`0600` の単一リンク通常ファイルであり、1 つの正規のプライベートキー多重ハッシュと最終改行を含む必要があります。Kagami はシンボリックリンクを拒否し、コマンドライン上で生のブロックチェーンのジェネシスプライベートキーを決して受け入れません。

NPoS または Nexus プロファイルの場合、生成されたプロファイルで必要なトポロジーおよび BLS 所有権証明を含めてください。Kagami `localnet`、`wizard`、およびプロファイル生成コマンドはこれらの詳細を自動的に処理します。

## ブロックチェーンのジェネシスを再コミットする {#recommitting-genesis}

ピアはストレージが空の場合にのみジェネシストランザクションを確定します。使い捨てのローカルネットで新しいジェネシスをテストするには、ピアを停止し、生成済みの状態ディレクトリを削除して、新しい署名済みジェネシスから起動します。すべてのバリデーターが同じ移行を協調して実施している場合を除き、稼働中のネットワークでジェネシスを置き換えないでください。
