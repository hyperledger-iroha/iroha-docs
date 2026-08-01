---
translation_locale: ja
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# クライアントの設定 {#client-configuration}

Iroha CLI および SDK クライアントは, TOML 構成を使用する.リポジトリは現在のデフォルトを `defaults/client.toml` に送信する.生成されたローカルネットワークはまた,出力ディレクトリに匹配する `client.toml` を書き込む.

::: details クライアントの設定テンプレート

<<< @/snippets/client.template.toml

:::

## 核心フィールド {#core-fields}

顧客設定では,少なくともチェーン, Torii エンドポイント,署名アカウントを識別する.

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain`は,提出された取引が属するチェーンを選択します.
- `torii_url`ポイントは,同級者 Torii HTTP API.
- `[account].domain` は CLI ショートカットとアドレスセレクターコードで使用され,カノニカル `AccountId` はドメインレスです.
- `[account].public_key`と `[account].private_key`の署名取引.

口座は既に存在しているはずデフォルトローカルネットワークでは,この処理はbundled genesis manifestによって行われます.

::: info ケース敏感性

Iroha の名前は,カノニカル解析後にケースに敏感である.例えば,`wonderland.universal`,`Wonderland.universal`,および `looking_glass.universal`は異なるドメイン文字です.

:::

## 基本的な認証 {#basic-authentication}

オプション上の `[basic_auth]` セクションは,クライアントの要求に HTTP `Authorization` ヘッダーを追加します. Iroha 同級者はこれらの認証情報を直接解釈しません. Torii が Nginx などのリバースプロキシの後ろにいるときに使用します.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## 取引設定 {#transaction-settings}

取引行動は `[transaction]`セクションで設定されます.

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms`は,ミリ秒で取引寿命です.
- `status_timeout_ms`は,クライアントが取引状態を待機する時間を制御します.
- `nonce = true`はクライアントに,繰り返し取引が異なるハッシュを生成するため,ノンスを含むことを要求します.

## 列設定を接続する {#connect-queue-settings}

現在の Iroha クライアントは,ローカルキュー状態のオプション `[connect]` セクションを使用することもできます.

```toml
[connect]
queue_root = "./queue"
```

これは,ワークフローがクライアント側で耐久的なキューストレージを必要とする場合に使用します.

## 設定を生成する {#generating-configurations}

使い捨てローカルネットワークでは, Kagami を好みます. それは,一致する Iroha 3 コンフィギューム,ジェネス,スクリプト,および README を記述しているため:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

生成された `./localnet/client.toml` を, CLI と使用する.

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
