---
translation_locale: ja
translation_source: /reference/peer-config/index.md
translation_source_hash: dd44f8f12cc456d6f37e1ceb3e82cf4a979e80115c75e28dcb1fe4f29469aaf4
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha の設定 {#configuring-iroha}

ローカルネットワークピアの構成は次で設定されます TOML ファイル。これは、チェーン上での構成変更によるものとは異なります [`SetParameter`](/ja/blockchain/instructions.md#setparameter) 指示。生産の動作は設定で表現されなければなりません ファイルまたはオンチェーンのパラメータ; 環境変数は機能ゲートではありません。

使う [`--config`](../iroha3d-cli#arg-config) CLI 設定ファイルへのパスを指定するための引数。

## テンプレート {#template}

各パラメータの詳細な説明については、[パラメータ](./params.md) の参考資料をご参照ください。

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## 設定ファイルの作成 {#composing-configuration-files}

TOML の設定ファイルには、他の TOML ファイルを指す追加の `extends` フィールドがあります。これは単一のパスでも複数のパスでも構いません:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha は `extends` で指定されたすべてのファイルを再帰的に読み取り、それらをレイヤーにまとめます。後のレイヤーはパラメータレベルで前のレイヤーを上書きします。例えば、`config.toml` を読み込む場合:

::: code-group

```toml [config.toml]
extends = ["a.toml", "b.toml"]

[torii]
address = "0.0.0.0:8080"
```

```toml [a.toml]
chain = "whatever"
```

```toml [b.toml]
[torii]
address = "localhost:4000"
max_content_len = 2048
```

:::

生成された構成は、`a.toml` から `chain`、`b.toml` から `max_content_len`、および `config.toml` から `torii.address`（`b.toml` を上書き）になります。

## トラブルシューティング {#troubleshooting}

通過 [`--trace-config`](../iroha3d-cli#arg-trace-config) CLI 構成がどのように読み取られ解析されるかの追跡を表示するフラグ。
