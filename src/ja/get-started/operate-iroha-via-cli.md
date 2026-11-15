---
translation_locale: ja
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 40714a6cd124d4b0342b0f6ecf321f286e714c0e236afd6fd7834c0cf0ad1165
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# CLI を介して Iroha 3 を操作する {#operate-iroha-3-via-cli}

`iroha` バイナリは Iroha 3 のコマンドラインクライアントです。これを使用してブロックチェーンの台帳状態を照会し、トランザクションを送信し、オペレーターの エンドポイントを検査します。

## 1. 前提条件 {#_1-prerequisites}

ドキュメントに記載されたソースリビジョンの Iroha チェックアウトから、4 ピアのローカルネットを生成して起動します：

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
./localnet/start.sh
```

以下の例では、生成されたクライアント設定 `./localnet/client.toml` を使用します。

## 2. 基本 CLI 設定 {#_2-basic-cli-setup}

最上位のヘルプを表示する:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI は、これらの最上位の指揮グループに編成されています:

- `account`: アカウントの読み取りと変更
- `explorer`: 共通のフィルターとページ分割を使ったエクスプローラーのフィード
- `tx`: トランザクションの状態と補助機能
- `ledger` ブロックチェーン台帳の読み書き用
- `trigger`: トリガーの読み取り、書き込み、実行
- `ops` オペレーター診断用
- API アプリの `app` ヘルパー
- `contract`: コントラクトの呼び出し、ビュー、ローカルでのデバッグ。デプロイには `kagami contract deploy` または `musubi deploy` を使用
- `tools` は診断および開発者用ユーティリティ向けです
- `dataspace`: データスペース定義の計画、適用、確認
- `taira`: Taira の診断とアカウントの利用開始手続き
- `offline`: オフラインのエンコーダー、レポート、診断
- `soracloud`: Soracloud アプリプラットフォームの補助機能
- `sccp`: SORA クロスチェーンプロトコルの読み取り、移転、証明

トランザクションを送信するすべてのコマンドには、`--fee-payer authority` などで手数料支払者を明示する必要があります。CLI は署名前に正確な手数料を見積もります。

人間が読みやすいオペレーター出力には`--output-format text`を使用し、厳密な自動化モードには`--machine`を使用してください。

## 3. パブリック Taira テストネットを試す {#_3-try-the-public-taira-testnet}

ローカルネットワークピアを実行したり、暗号署名者を作成したりする前に、読み取り専用の Taira チェックを試すことができます。これらのコマンドは公開の Torii JSON ルートを使用し、テストネットの XOR を消費しません。

Taira のステータスを確認してください:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

認証されていない読み手に見えるドメインを一覧表示します：

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

署名付きコマンドを試す準備が整ってから `taira.client.toml` を作成してください。設定、フォーセット、スモークテストの手順は、[SORA Nexus のデータスペースに接続する](/ja/get-started/sora-nexus-dataspaces.md)を参照してください。フォーセットから手数料資産を受け取るまでは、Taira に書き込むコマンドを実行しないでください。

手数料が発生する Taira CLI の例を試すには、[Taira でテストネット XOR を取得する](/ja/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)に記載された、事前準備を伴うフォーセットの手順で署名者に資金を供給し、残高を確認してください。

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

フォーセットの経路が `502` を返した場合は、しばらく待って再試行してください。これは公開テストネットの可用性の問題であり、アカウントの鍵を再生成すべきという意味ではありません。

残高が表示されたら、`--fee-payer authority` を指定して書き込みを送信します。CLI は署名前に、Taira の手数料資産で正確な手数料を見積もります。

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "hello from faucet-funded taira"
```

## 4. 基本的なブロックチェーン台帳コマンド {#_4-basic-ledger-commands}

すべてのドメインをリストする:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

通常のドメイン作成は宣言的エイリアスプランナーを使用します。`ledger domain` コマンドには `register` サブコマンドはありません。`AliasSetupPlanRequestV1` を `docs.universal` 用に、SDK またはオンボーディングサービスでシークレットなしのインテントを準備し、それから計画して適用してください。

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

インテントは、データスペース ID、正規の所有者アカウント、リース期間、現在の見積もりを検証するガードを固定します。プランナーは稼働中の状態を検証し、送信すべきアトミックな `EnsureAlias` の正確なプランを返します。別のネットワークのガード値を手作業でコピーしないでください。

シンプルなピングトランザクションを送信します:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority tx ping --msg "hello from iroha"
```

最近のブロックを読み取るか、ブロックイベントを購読してください:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. オペレーターコマンド {#_5-operator-commands}

合意形成の運用コマンドには、許可リストに登録されたランタイム鍵が必要です。鍵を `client.toml` に含めず、所有者だけがアクセスできるファイルを絶対パスで指定してください。

```bash
# The generated localnet writes its allow-listed operator key here.
: "${OPERATOR_KEY_FILE:=$PWD/localnet/runtime/operator-signer.key}"

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

コミット済みの合意形成レーンと、このノードのインスタンスの状態を確認します。

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi lanes
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
- [Torii エンドポイント](/ja/reference/torii-endpoints.md)
- [Iroha バイナリを扱う](/ja/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)

チェックアウトしたソースから、Markdown 形式のヘルプ全体のスナップショットを出力するには、次を実行します。

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > iroha-cli-help.md
```
