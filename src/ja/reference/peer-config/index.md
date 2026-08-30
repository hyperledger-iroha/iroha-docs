---
translation_locale: ja
translation_source: /reference/peer-config/index.md
translation_source_hash: dd44f8f12cc456d6f37e1ceb3e82cf4a979e80115c75e28dcb1fe4f29469aaf4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha を構成する {#configuring-iroha}

TOML ファイルでローカルピア構成が設定されている.これは,[`SetParameter`](/ja/blockchain/instructions.md#setparameter)指示によって変更されたオンチェーン構成とは異なります.生産行動は構成ファイルまたはオンチェーンパラメータで表示されなければならない.環境変数は機能ゲートではありません.

設定ファイルへの経路を指定するには [`--config`](../iroha3d-cli#arg-config)CLI アレグメントを使用します.

## テンプレート {#template}

各パラメータの詳細な記述については, [パラメーター](./params.md)参照を参照してください.

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## 構成ファイルを作成する {#composing-configuration-files}

TOML コンフィギュレーションファイルには,他の TOML ファイルを指す追加的な `extends` フィールドがあります.これは単行パスまたは複数のパスである可能性があります.

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha は, `extends` で指定されたすべてのファイルをリクシブ的に読み取り,レイヤーに分類し,後者はパラメータレベルで前のファイルを重書きします.例えば, `config.toml` を読み上げると:

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

構成は, `chain` から `a.toml`, `max_content_len` から `b.toml`, そして `torii.address` から `config.toml` (上記書) `b.toml`).

## 問題を解く {#troubleshooting}

[`--trace-config`](../iroha3d-cli#arg-trace-config)CLI フラグをパスして,構成が読み取られ解析される方法の痕跡を見ることができます.
