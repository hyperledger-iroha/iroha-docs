---
translation_locale: ja
translation_source: /guide/configure/client-configuration.md
translation_source_hash: b3cfc8d8bf51a43b88cefb5ac7fe641717b347f7c89d983bf4c2de80944f1bb8
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# クライアント設定 {#client-configuration}

Iroha、CLI、および SDK のクライアントは TOML 構成を使用します。リポジトリは`defaults/client.toml`で現在のデフォルトを提供します。生成されたローカルネットワークも、自分の出力ディレクトリに一致する`client.toml`を書き込みます。

::: details クライアント構成テンプレート

<<< @/snippets/client.template.toml

:::

## コアフィールド {#core-fields}

クライアント設定では、少なくともチェーン、そのネットワーク識別子、Torii のエンドポイント、アカウントのネットワークコンテキスト、署名鍵を指定します。

```toml
chain = "00000000-0000-0000-0000-000000000000"
network_id = "hash:32C903E5B3497E34C2B844EBFE8A39C19E6CF8F95D44C1FFB8BA9DCB42F91149#A2F0"
torii_url = "http://127.0.0.1:8080/"

[account]
chain_discriminant = 753
public_key = "ed0120..."
private_key = "802620..."
```

- `chain`は、送信された取引が属するチェーンを選択します。
- `network_id` はジェネシスから導出されるネットワーク識別子であり、すべての署名付きリクエストがこの識別子に結び付けられます。`network_id` と `network_id_file` のどちらか一方だけを設定してください。ノードは `GET /v1/accounts/capabilities` でこの値を公開します。
- `torii_url` がネットワークピア Torii HTTP API を指しています。
- `[account].chain_discriminant` は、そのネットワークの I105 アカウント接頭辞を選択します。公開ネットワークでは、代わりに `[account].profile = "taira"` または `"minamoto"` を指定できます。接頭辞の選択にはこの二つの方法のどちらかが必要です。正規の `AccountId` 自体はドメインを含みません。
- `[account].public_key` と `[account].private_key` は、トランザクション署名に使う鍵ペアを指定します。`private_key` の代わりに `private_key_file` を使用できます。

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

`iroha` CLI は、ローカルのキュー状態を設定する任意の `[connect]` セクションも読み取ります。再利用可能な SDK の設定は、このセクションを受け付けません。

```toml
[connect]
queue_root = "./queue"
```

クライアント側のキューを永続化する必要がある手順で使用します。`connect.queue_root` のデフォルトは `~/.iroha/connect` です。相対パスは、クライアントの TOML ファイルがあるディレクトリを基準に解決されます。

## 構成の生成 {#generating-configurations}

使い捨てのローカルネットワークには、Kagami を使用することを推奨します。なぜなら、それは一致する Iroha 3 の設定、ブロックチェーンジェネシス、スクリプト、そして README を書き込むからです。

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

CLI と一緒に生成された`./localnet/client.toml`を使用してください：

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```
