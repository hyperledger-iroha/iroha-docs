---
translation_locale: ja
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` は Iroha 3 ピアデモン を起動します.

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- タイプ:ファイルパス
- 名前: `-c`

[設定ファイル](/ja/reference/peer-config/index.md)へのパス.

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- タイプ:ファイルパス

JSON ファイルへのオプションパス.デプロイメントが Kagami によって生成されたマニフェストに対して起動を検証するときにこれを使用します.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

コンフィギュレーション読み取りと解析の追跡ログを有効にする.コンフィギュレーショントラブルシューティングに役立つかもしれない.

- タイプ:旗
- ENV: `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- タイプ: ブール製, `--terminal-colors=false` または `--terminal-colors=true`
- デフォルト:自動検出端末のサポート
- ENV: `TERMINAL_COLORS`

ANSI 色の出力を有効にするかどうか.

デフォルトでは, Iroha は,端末がカラー輸出をサポートするか否かを決定します.

明らかに色を無効にする:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- 文字列

デイモンメッセージに使われるシステム言語を覆す.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- タイプ:旗

SoraFS の Sora Nexus 機能プロフィール, SoraNet 手握り,および多レーンコンセンサスフローを有効にする.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- タイプ: `auto`, `cpu`,または `gpu`

FASTPQ プロバー実行モードを覆す.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- タイプ: `auto`, `cpu`,または `gpu`

FASTPQ ポセイドンパイプラインモードを覆す

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- 文字列

FASTPQ テレメトリデバイスクラスのラベルを覆す.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- 文字列

FASTPQ テレメトリチップファミリーラベルを覆す.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- 文字列

FASTPQ テレメトリya GPU タイプのラベルを覆す.

```shell
irohad --fastpq-gpu-kind integrated
```
