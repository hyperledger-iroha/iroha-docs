---
translation_locale: ja
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: c070c86b715b36079a7b6a47de2e31144187d7ebc6309f294a346be61a372660
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# CLI を介して Iroha 3 を操作する {#operate-iroha-3-via-cli}

`iroha` バイナリは Iroha 3 のコマンドラインクライアントです。これを使用してブロックチェーンの台帳状態を照会し、トランザクションを送信し、オペレーターの API エンドポイントを検査します。

## 1. 前提条件 {#_1-prerequisites}

まずローカルネットワークを始めてください:

- [Iroha 3 を起動](./launch-iroha.md)

以下の例は、[Iroha 3 を起動](./launch-iroha.md)で作成されたローカルネットから生成されたクライアント構成を前提としています。

```bash
./localnet/client.toml
```

## 2. 基本 CLI 設定 {#_2-basic-cli-setup}

最上位のヘルプを表示する:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI は、これらの最上位の指揮グループに編成されています:

- `account` アカウント指向のショートカット用
- `tx` トランザクションレベルのヘルパー用
- `ledger` ブロックチェーン台帳の読み書き用
- `ops` オペレーター診断用
- API アプリの `app` ヘルパー
- 契約展開および技術的呼び出しのための`contract`
- `tools` は診断および開発者用ユーティリティ向けです
- Taira および Nexus 指向のワークフロー向けの`taira`

`ledger` グループには、`ledger transaction` のようなドメイン固有のトランザクションヘルパーも含まれています。

人間が読みやすいオペレーター出力には`--output-format text`を使用し、厳密な自動化モードには`--machine`を使用してください。

## 3. パブリック Taira テストネットを試す {#_3-try-the-public-taira-testnet}

ローカルネットワークピアを実行したり、暗号署名者を作成したりする前に、読み取り専用の Taira チェックを試すことができます。これらのコマンドは公開の Torii JSON ルートを使用し、テストネットの XOR を消費しません。

Taira のステータスを確認してください:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

`universal` データスペースのパブリックドメインを一覧表示してください:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

いくつかの資産の定義と現在の供給量をリストしてください：

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

もし現在の `iroha` バイナリを持っている場合は、Taira 診断ヘルパーを実行してください:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

`taira.client.toml`は、署名付きコマンドをテストする準備ができたときにのみ作成してください。[SORA Nexus データスペースに接続](/ja/get-started/sora-nexus-dataspaces.md)で構成、テストネットの資金提供サービス、およびカナリアフローを確認してください。Taira に対して書き込みコマンドを実行するのは、アカウントがテストネットの資金提供サービスの手数料資産で資金提供されるまで行わないでください。

任意の料金支払い Taira CLI の例について、テストネット資金提供サービスヘルパーを[Taira でテストネット XOR を入手する](/ja/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)から`taira_faucet_claim.py`として保存し、次にテストネット XOR を最初に取得してください:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

テストネットの資金提供サービスのパズルや請求ルートが `502` を返す場合は、待ってから再試行してください。それはアカウントキーを再生成するサインではなく、パブリックテストネットの可用性の問題です。

残高が表示されたら、書き込みに手数料資産のメタデータを添付します:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. 基本的なブロックチェーン台帳コマンド {#_4-basic-ledger-commands}

すべてのドメインをリストする:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

通常のドメイン作成は宣言的エイリアスプランナーを使用します。`ledger domain` コマンドには `register` サブコマンドはありません。`AliasSetupPlanRequestV1` を `docs.universal` 用に、SDK またはオンボーディングサービスでシークレットなしのインテントを準備し、それから計画して適用してください。

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

インテントはデータスペースID、標準オーナーアカウント、リース期間、および現在の料金価格検証ガードを固定します。プランナーはライブ状態を検証し、提出する正確なアトミック`EnsureAlias`プランを返します。他のネットワークからガード値を手でコピーしないでください。

シンプルなピングトランザクションを送信します:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

最近のブロックを読み取るか、ブロックイベントを購読してください:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. オペレーターコマンド {#_5-operator-commands}

コンセンサスオペレーターのコマンドには、許可リストに登録されたソフトウェアランタイムキーが必要です。`client.toml`に入れず、所有者専用ファイルを明示的に渡してください:

```bash
: "${OPERATOR_KEY_FILE:=./secrets/operator.key}"

cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
```

非権威的なキュー、ソフトウェア処理のワークフロー、選挙、および実行レーンの診断：

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
```

最高かつロックされたコンセンサスクォーラム証明書:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi qc
```

オンチェーンのコンセンサスパラメータ：

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi params
```

## 6. 次に行く場所 {#_6-where-to-go-next}

- [SDK チュートリアル](/ja/guide/tutorials/)
- [Torii API エンドポイント](/ja/reference/torii-endpoints.md)
- [Iroha バイナリを扱う](/ja/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/README.md)

ソースの作業ツリーから完全な Markdown ヘルプのスナップショットを再生成するには、次を実行します:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
