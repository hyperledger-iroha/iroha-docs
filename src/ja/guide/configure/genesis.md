---
translation_locale: ja
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: google-translate
---

# 創世記 {#genesis}

Genesis はチェーンの初期状態を定義します。編集可能なソースは、 JSON マニフェスト、
そして Iroha 3 ノードは署名付きを消費します Norito トランザクションファイル。

::: details デフォルトのジェネシスマニフェスト

<<< @/snippets/genesis.json

:::

## ファイル {#files}

上流リポジトリにはデフォルトのマニフェストが含まれています。 `defaults/genesis.json`.
Kagami- 生成されたネットワークは、独自のマニフェストと署名済みトランザクションを書き込みます。
出力ディレクトリ:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

生成された `README.md` そのディレクトリに正確なファイルを記録して起動します
選択したプロファイルのコマンド。

## ピア構成 {#peer-configuration}

ピアは、署名されたジェネシス トランザクションを指します。 `[genesis]` のセクション
`config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

ネットワーク内のすべてのピアは、署名されたジェネシス トランザクションと
ジェネシスの公開鍵。

## 創世記に署名する {#signing-genesis}

マニフェストを手動で編集する場合は、ピアを開始する前にマニフェストを検証して署名します。

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` 所有者保持モードである必要があります -`0600`, シングルリンク
1 つの正規秘密キー マルチハッシュと最終的なハッシュを含む通常のファイル
改行。 Kagami シンボリックリンクを拒否し、生のジェネシスプライベートを決して受け入れません
コマンドラインで キーを押します。

NPOS または Nexus プロファイルには、トポロジと BLS 所持証明
生成されたプロファイルで必要となります。 Kagami `localnet`, `wizard`, そしてプロフィール
生成コマンドはこれらの詳細を自動的に処理します。

## ジェネシスの再コミット {#recommitting-genesis}

ピアは、ストレージが空の場合にのみジェネシスをコミットします。新しい起源をテストするために
使い捨てローカルネット、ピアを停止し、生成された状態ディレクトリを削除します。
そして新しい署名されたジェネシスから始めます。実行中にジェネシスを置き換えないでください
すべてのバリデーターが同じ移行を調整していない限り、ネットワークに移行できません。
