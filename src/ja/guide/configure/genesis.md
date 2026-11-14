---
translation_locale: ja
translation_source: /guide/configure/genesis.md
translation_source_hash: 91be089c82a76991e35a43e1541f9e069fdf70d3fb5de2492b985c06c78a2372
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta+reviewed-first-release-source-amendment
---
# ブロックチェーンのジェネシス {#genesis}

ブロックチェーンのジェネシスは初期のチェーン状態を定義します。編集可能なソースは JSON 技術マニフェストであり、Iroha 3 ノードは署名済みの Norito トランザクションファイルを消費します。

::: details デフォルトのブロックチェーンジェネシス技術マニフェスト

<<< @/snippets/genesis.json

:::

## ファイル {#files}

上流リポジトリには、デフォルトのソーステンプレート `defaults/genesis.template.json` が含まれます。テンプレートは不完全であり、`kagami genesis materialize` でマニフェストに変換するまで、検証、署名、ノードでの使用はできません。Kagami が生成するネットワークでは、固有のマニフェストと署名済みトランザクションを出力ディレクトリに書き込みます。

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

そのディレクトリに生成された`README.md`は、選択されたプロファイルの正確なファイルと起動コマンドを記録します。

## ネットワークピアの設定 {#peer-configuration}

ピアは `config.toml` の `[genesis]` セクションで署名済みジェネシストランザクションを指定し、その期待ハッシュを別のファイルで固定します。

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
expected_hash_file = "./genesis.expected_hash"
```

ネットワーク内のすべてのピアで、署名済みジェネシストランザクションとジェネシス公開鍵が一致する必要があります。期待ハッシュのファイルは新規起動時にも再起動時にも必要であり、`kagami genesis sign --expected-hash-out` がこのファイルを書き出します。

## ブロックチェーンのジェネシスに署名する {#signing-genesis}

技術的なマニフェストを手動で編集する場合は、ネットワークピアを起動する前に、検証して署名してください:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt \
  --expected-hash-out ./genesis.expected_hash
```

`GENESIS_PRIVATE_KEY_FILE` は、所有者保持モード-`0600` の単一リンク通常ファイルであり、1 つの正規のプライベートキー多重ハッシュと最終改行を含む必要があります。Kagami はシンボリックリンクを拒否し、コマンドライン上で生のブロックチェーンのジェネシスプライベートキーを決して受け入れません。

NPoS または SORA Nexus のプロファイルでは、生成されたプロファイルが要求するトポロジーと BLS の所有証明を含めてください。Kagami の `localnet generate`、`wizard`、`sora-network generate` コマンドがこれらを自動的に処理します。

## ブロックチェーンのジェネシスを再コミットする {#recommitting-genesis}

新しいネットワークは、署名済みジェネシスから起動します。使い捨てのローカルネットで別のジェネシスを試すには、ピアを停止し、生成された状態ディレクトリを削除して、新しい署名済みジェネシスから起動します。稼働中のネットワークで、アップグレードの手段としてジェネシスを置き換えてはいけません。プロトコル定義の変更には、ガバナンスに基づく選択の遷移と、選択する定義および履行義務に対する適格性の検証が必要です。
