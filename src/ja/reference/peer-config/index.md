---
translation_locale: ja
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha を構成する {#configuring-iroha}

TOML ファイルでローカルピア構成が設定されている.これは,[`SetParameter`](/ja/blockchain/instructions.md#setparameter)指示によって変更されたオンチェーン構成とは異なります.生産行動は構成ファイルまたはオンチェーンパラメータで表示されなければならない.環境変数は機能ゲートではありません.

設定ファイルへの経路を指定するには [`--config`](../irohad-cli#arg-config)CLI アレグメントを使用します.

## テンプレート {#template}

各パラメータの詳細な記述については, [パラメーター](./params.md)参照を参照してください.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## 構成ファイルを作成する {#composing-configuration-files}

TOML コンフィギュレーションファイルには,他の TOML ファイルを指す追加的な `extends` フィールドがあります.これは単行パスまたは複数のパスである可能性があります.

::: コードグループ

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha は, `extends` で指定されたすべてのファイルをリクシブ的に読み取り,レイヤーに分類し,後者はパラメータレベルで前のファイルを重書きします.例えば, `config.toml` を読み上げると:

::: コードグループ

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

構成は, `chain` から `a.toml`, `max_content_len` から `b.toml`, そして `torii.address` から `config.toml` (上記書) `b.toml`).

## 問題を解く {#troubleshooting}

[`--trace-config`](../irohad-cli#arg-trace-config)CLI フラグをパスして,構成が読み取られ解析される方法の痕跡を見ることができます.
