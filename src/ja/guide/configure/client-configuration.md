---
translation_locale: ja
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# クライアント設定 {#client-configuration}

Iroha、CLI、および SDK のクライアントは TOML 構成を使用します。リポジトリは`defaults/client.toml`で現在のデフォルトを提供します。生成されたローカルネットワークも、自分の出力ディレクトリに一致する`client.toml`を書き込みます。

::: details クライアント構成テンプレート

<<< @/snippets/client.template.toml

:::

## コアフィールド {#core-fields}

最小限で、クライアント設定はチェーン、Torii API エンドポイント、および署名アカウントを識別します:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain`は、送信された取引が属するチェーンを選択します。
- `torii_url` がネットワークピア Torii HTTP API を指しています。
- `[account].domain` は CLI のショートカットおよびアドレスセレクタのエンコーディングに使用されます。標準的な `AccountId` 自体にはドメインはありません。
- `[account].public_key` と `[account].private_key` が取引に署名します。

アカウントはすでにオンチェーン上に存在している必要があります。デフォルトのローカルネットワークでは、これはバンドルされたブロックチェーンジェネシス技術マニフェストによって処理されます。

::: info 大文字と小文字の区別

Iroha の名前は、正規パースの後、大文字と小文字が区別されます。例えば、`wonderland.universal`、`Wonderland.universal`、および `looking_glass.universal` はそれぞれ異なるドメインリテラルです。

:::

## ベーシック認証 {#basic-authentication}

オプションの`[basic_auth]`セクションは、クライアントリクエストに HTTP`Authorization`ヘッダーを追加します。Iroha ネットワークピアはこれらの資格情報を直接解釈しません；Torii がNginxのようなリバースプロキシの背後にある場合に使用してください。

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## 取引設定 {#transaction-settings}

トランザクションの動作は、`[transaction]` セクションで構成されます。

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` はトランザクションの寿命（ミリ秒単位）です。
- `status_timeout_ms` はクライアントがトランザクションのステータスを待つ時間を制御します。
- `nonce = true` は、クライアントに暗号化ノンス値を含めるよう依頼し、同じ取引が繰り返されても異なる暗号ハッシュが生成されるようにします。

## キュー設定を接続 {#connect-queue-settings}

現在の Iroha クライアントは、ローカルキューの状態のためにオプションの `[connect]` セクションも使用できます:

```toml
[connect]
queue_root = "./queue"
```

ワークフローに耐久性のあるクライアント側キューのストレージが必要なときにこれを使用します。

## 構成の生成 {#generating-configurations}

使い捨てのローカルネットワークには、Kagami を使用することを推奨します。なぜなら、それは一致する Iroha 3 の設定、ブロックチェーンジェネシス、スクリプト、そして README を書き込むからです。

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

CLI と一緒に生成された`./localnet/client.toml`を使用してください：

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
