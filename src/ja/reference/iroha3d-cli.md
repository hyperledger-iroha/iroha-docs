---
translation_locale: ja
translation_source: /reference/iroha3d-cli.md
translation_source_hash: 846370e45fe0e0d605016d6722b1d50c39981f954c7d9040b87fc385eb12ac68
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` は標準の Iroha 3 ネットワークピアデーモンです。Cargo パッケージは `irohad` と名前が付けられているので、ソースコードの作業コピーからバイナリを呼び出してください:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

パブリック Taira テストネットでは、リリースイメージは`iroha3d_taira`を使用します。同じ CLI を受け入れますが、さらに標準の Taira チェーン、バリデータ、ストレージ、およびランタイム署名者プロファイルを強制します。ソフトウェアランタイム資格情報を開かずに Taira 構成を検証するには、次のようにします:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

標準的な Taira プロファイルのオペレーターがレンダリングした形式を使用してください。チェックインされたテンプレートにはまだデプロイメントのプレースホルダーが含まれています。Taira に対してテストする際に、汎用の SORA Nexus や本番の SoraFS 設定を置き換えないでください。

## `--config` {#arg-config}

- 種類：ファイルパス
- 別名: `-c`

[ネットワークピアの設定](/ja/reference/peer-config/index.md)への道。

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- 種類：ファイルパス

コンセンサス検証に使用されるオプショナルなブロックチェーンジェネシス技術マニフェスト JSON。

## `--check-config` {#arg-check-config}

解決された設定と利用可能なブロックチェーンのジェネシス資料を検証し、その後、ネットワークソケットをバインドせずに終了します。

## `--json` {#arg-json}

- **型:** フラグ
- **必須の併用オプション:** `--check-config`

`Ready` または `Pending` の行に代えて、このビルドと設定の互換性に関する値を、一つの Norito JSON オブジェクトとして出力します。

## `--check-storage` {#arg-check-storage}

- **型:** フラグ
- **同時に指定できないオプション:** `--check-config`

停止中ノードの Kura ストアと最新のスナップショットを、このビルドのデコーダーで読み取り専用で検査し、結果を一つの Norito JSON オブジェクトとして出力します。失敗時の終了コードはゼロ以外です。検査では Kura ストアのルートロックを取得するため、稼働中のノードが所有するストアは拒否します。ストアを変更せず、実行時専用の秘密情報を開くこともありません。

## `--check-replay` {#arg-check-replay}

- **型:** フラグ
- **同時に指定できないオプション:** `--check-config`, `--check-storage`

停止中ノードのストアのコピーをこのビルドでリプレイし、結果を一つの Norito JSON オブジェクトとして出力します。コマンドはブロックを一時ディレクトリにコピーし、そこで最新のスナップショットを復元するか、署名済みジェネシスを再実行した後、それ以降のすべてのブロックを再実行します。ブロックが証明済みの結果を再現しない場合や、必要なブロック本体が欠落している場合は、ゼロ以外で終了します。元のストアに書き込むことも、実行時専用の秘密情報を開くこともありません。

## `--require-genesis-inrou-deployment-authority` {#arg-require-genesis-inrou-deployment-authority}

- **型:** アカウント ID
- **必須の併用オプション:** `--check-config`

オフライン検証時に、対象の署名済みジェネシスを実行した後も、指定された登録済みアカウントが SoraCloud のデプロイ権限を保持していることを要求します。

## `--sumeragi-assert-fresh-key` {#arg-sumeragi-assert-fresh-key}

- **型:** フラグ

今回の起動に限り、ノードの合意形成用の鍵が、このチェーンで過去に一度も署名していないことを表明します。Sumeragi は鍵ごとに安全性記録を保持し、その記録がない場合は、記録の紛失ではないという証拠を得るまで署名しません。このフラグは新しい鍵での初回起動時に一度だけ指定し、データを失った後には決して使用しないでください。

## `--trace-config` {#arg-trace-config}

- タイプ: フラッグ
- 環境: `TRACE_CONFIG`

設定レイヤーが読み込まれ解析される間、トレースログを有効にする。

## `--config-blake3` {#arg-config-blake3}

- 種類: 64桁の16進数 BLAKE3 暗号学的ダイジェスト値
- 必要: `--config`

構成ファイルのバイトが、提供された暗号学的ダイジェスト値と一致することを要求します。完全性が保証されたファイルは平坦化されている必要があり、`extends` を含むことはできません。

## `--terminal-colors` {#arg-terminal-colors}

- 型: ブール値、`--terminal-colors=true` または `--terminal-colors=false` として渡されます
- デフォルト：端末機能検出
- 環境: `TERMINAL_COLORS`

ANSI 色の出力を制御する。

## `--language` {#arg-language}

- 型: 文字列

デーモンメッセージに使用されるシステム言語を上書きします。

## `--sora` {#arg-sora}

- 種類: 旗
- 環境: `IROHA_SORA_PROFILE`

SoraFS、SoraNet のハンドシェイク、複数レーンの合意形成で使う SORA Nexus プロファイルを有効にします。Taira のランチャーは常にこのフラグ付きで呼び出されます。

## FastPQ の上書き {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` と `--fastpq-poseidon-mode <MODE>` は `cpu` または `gpu` のみを受け入れます。残りのオプションはテレメトリラベルを上書きします:

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

例えば：

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## 生成されたヘルプ {#generated-help}

上記のオプション一覧は、固定した Iroha コミットの `iroha3d` 引数定義に基づきます。チェックアウトしたコードの正確なヘルプを確認するには、次を実行してください。

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
