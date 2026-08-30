---
translation_locale: ja
translation_source: /reference/iroha3d-cli.md
translation_source_hash: d621aa09f50cb44cb99af372100f418c44c3714b879a556038e47598949a3a6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` は標準の Iroha 3 ピアデモンです. Cargo パッケージは`irohad` と呼ばれるので,ソースチェックアウトからバイナリを呼び出します.

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

公開 Taira テストネットでは,リリース画像は `iroha3d_taira` を使用します. 同様の CLI を受け入れる. また,カノニカル Taira チェーン,検証器セット,ストレージ設定,ランタイムサインキーも強制する. Taira 設定を実行時の認証を開くことなく検証する.

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

操作者は使用前に,カノニカル Taira プロフィールを表示しなければならない. チェックインされたテンプレートは,例の設定があります. 操作者はすべての例の設定を交換しなければならない. Taira に対して試験する際には,一般的な Nexus または生産の SoraFS 設定を使用しないでください.

## `--config` {#arg-config}

- タイプ:ファイルパス
- 名前: `-c`

[ペア設定](/ja/reference/peer-config/index.md)へのパス.

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- タイプ:ファイルパス

合意の検証のために使用されたオプション生成表記 JSON.

## `--check-config` {#arg-check-config}

解消された構成と利用可能な生成材料を検証し,ネットワークソケットを結びつけずに終了します.

## カゲムシャ資格の封印 {#kagemusha-qualification-seals}

これらのファイルパスオプションは `--check-config` を要求し,法典的な封印を書く前に完全な Kagemusha資格を実行します:

- `--write-kagemusha-catalog-qualification-seal <PATH>`はカタログを認定する.
- `--write-kagemusha-validator-qualification-seal <PATH>`は,設定された署名したプロモーション予約に対してローカルバリダータを資格化します.

封印の2つの選択肢は相互に衝突します

## `--trace-config` {#arg-trace-config}

- タイプ:旗
- 環境: `TRACE_CONFIG`

コンフィギュレーション層が読み取られ,解析される間に追跡ログを有効にします.

## `--config-blake3` {#arg-config-blake3}

- タイプ: 64桁のヘクサデシマルの消化 BLAKE3
- 要求: `--config`

コンフィギュレーションファイルのバイトが提供されたダイジェストに一致するように要求します. 完整性に関するファイルはフラット化する必要があります; `extends` を含むことができません.

## `--terminal-colors` {#arg-terminal-colors}

- タイプ: `--terminal-colors=true`または `--terminal-colors=false`として表記されたブルール
- デフォルト:端末能力を検出する
- 環境: `TERMINAL_COLORS`

ANSI 色の出力を制御する.

## `--language` {#arg-language}

- 文字列の種類

デイモンメッセージに使われるシステム言語を覆す.

## `--sora` {#arg-sora}

- タイプ:旗
- 環境: `IROHA_SORA_PROFILE`

Sora Nexus プロフィールを有効にします. このプロフィールでは SoraFS, SoraNet の握手を設定し,複数のレーンのコンセンサスを設定します. Taira 発射機を この旗で呼び出す.

## FastPQ の優先順位 {#fastpq-overrides}

`--fastpq-execution-mode <MODE>`と`--fastpq-poseidon-mode <MODE>`は, `cpu`または `gpu`だけが受け入れられる.残りのオプションはテレメトリラベルを優先する:

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

例えば:

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## 生成された援助 {#generated-help}

下記の完全な輸出は,固定された Iroha ソースコンビットから生成されます.

<<< @/snippets/iroha3d-help.md
