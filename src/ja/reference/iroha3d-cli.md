---
translation_locale: ja
translation_source: /reference/iroha3d-cli.md
translation_source_hash: bf4a63b05a149f0c935190b63cdb838b0a0265e99baedfc9b5bf00a9e621b108
translation_status: machine-validated
translation_engine: bing-translator-llm
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

標準的な Taira プロファイルのオペレーターがレンダリングした形式を使用してください。チェックインされたテンプレートにはまだデプロイメントのプレースホルダーが含まれています。Taira に対してテストする際に、汎用の Nexus や本番の SoraFS 設定を置き換えないでください。

## `--config` {#arg-config}

- 種類：ファイルパス
- 別名: `-c`

[ネットワークピアの設定](/ja/reference/peer-config/index.md)への道。

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- 種類：ファイルパス

コンセンサス検証に使用されるオプショナルなブロックチェーンジェネシス技術マニフェスト JSON。

## `--check-config` {#arg-check-config}

解決された設定と利用可能なブロックチェーンのジェネシス資料を検証し、その後、ネットワークソケットをバインドせずに終了します。

## 影武者資格印 {#kagemusha-qualification-seals}

これらのファイルパスオプションは `--check-config` を必要とし、正規の印章を書き込む前に完全な影武者資格を実行します:

- `--write-kagemusha-catalog-qualification-seal <PATH>` はカタログに適格です。
- `--write-kagemusha-validator-qualification-seal <PATH>` は、構成された署名付きプロモーション予約に対してローカルバリデーターを検証します。

その2つの封印オプションは互いに矛盾しています。

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

SoraFS によって使用される Sora Nexus プロファイル、SoraNet ハンドシェイク、およびマルチレーンコンセンサスを有効にします。Taira ランチャーは常にこのフラグで呼び出されます。

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

上記のオプションの概要は、現在の`iroha3d`引数定義と照合されています。チェックインされた生成済みヘルプデータのスナップショットは、出所ステータスが保留中の間、意図的に表示されません。チェックアウトの正確なヘルプを確認するには、次のコマンドを実行してください:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
