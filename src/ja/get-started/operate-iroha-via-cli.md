---
translation_locale: ja
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 9391bab95aa0ee20c7f036cc175f3a6d3a8852e6ea90b09d9ebf1a838973c765
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 動作する Iroha 3 経由 CLI {#operate-iroha-3-via-cli}

`iroha`バイナリは, Iroha 3 のコマンドライン クライアントです.それを使ってレジャー状態を查询し,トランザクションを送信し,オペレーターエンドポイントをチェックします.

## 1. 必須条件 {#_1-prerequisites}

まずローカルネットワークを起動します

- [打ち上げ Iroha 3](./launch-iroha.md)

以下の例では, [Launch Iroha 3](./launch-iroha.md)で作成されたローカルネットから生成されたクライアント構成を想定します.

```bash
./localnet/client.toml
```

## 2. 基本の CLI 設定 {#_2-basic-cli-setup}

最高級の支援を

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI は,次の最高レベルのコマンドグループに分かれています.

- `account` - 口座向けショートカット
- `tx` 取引レベルの援助者
- `ledger` 帳簿の読み書きのための
- `ops` オペレーターの診断
- `app` アプリ API 支援者
- `contract` 契約部署と通話
- `tools` 診断および開発施設
- `taira` に関する Taira そして Nexus- 方向性的な作業流程

`ledger`グループには, `ledger transaction`などのドメイン特有の取引支援者も含まれています.

人に読み取れるオペレーターの出力のために `--output-format text` と,厳格な自動化モードのために `--machine` を使用します.

## 3. 公衆のテストネット Taira を 試す {#_3-try-the-public-taira-testnet}

読みだけ試す Taira ローカルピアを実行したり,サインを作成する前にチェックします. Torii JSON 経路とテストネットを費やさない XOR.

Taira 健康チェック:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

`universal`データスペースの公開ドメインをリストする.

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

資産の定義と現在の供給をいくつか挙げてください

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

現在の `iroha`バイナリがある場合は, Taira 診断ヘルパーを実行してください.

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

作成する `taira.client.toml` 署名された命令をテストする準備ができている時だけ [接続する SORA Nexus データベース](/ja/get-started/sora-nexus-dataspaces.md) コンフィギュア, faucet,およびカナリーフローのために. Taira 口座は faucet fee資産で資金提供されるまで.

料金を支払う場合 Taira CLI 例えば,水槽のヘルパーを [テストネットを入手 XOR について Taira](/ja/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) のように `taira_faucet_claim.py`, その後,請求テストネット XOR まず:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

ポンプパズルまたはクレーム経路が `502` を返信した場合,待って再試してください.これは公開テストネットの利用性の問題であり,アカウントキーを再生するための信号ではありません.

余分が表示された後,手数料資産のメタデータを添付して次のように記述します:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. 基本のレジャーコマンド {#_4-basic-ledger-commands}

すべてのドメインをリスト:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

通常のドメイン作成では,宣言名プランナーを使用します. `ledger domain` コマンドには`register`サブコマンドはありません. `docs.universal` に対する秘密フリー `AliasSetupPlanRequestV1` 意図を SDK またはオンボードサービスで準備し,それを計画して適用してください.

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

意図パインは,データスペース ID,カノニカルオーナーのアカウント,リース期限,現在の引用保護.プランナーがライブ状態を確認し,提出する正確な原子計画 `EnsureAlias` を返します.他のネットワークから守備値を手書きコピーしないでください.

シンプルなピン取引を送信する

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

最近のブロックを読み取ったり,ブロックイベントを登録したりします.

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. 操作者のコマンド {#_5-operator-commands}

合意の状況:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

段階間遅延スナップショット

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

入手可能性,収集者, RBC バックログ,および VRF スナップショット:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

チェーン上のコンセンサスパラメータ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. 次 に どこ へ 行ける か {#_6-where-to-go-next}

- [SDK チュートリアル](/ja/guide/tutorials/)
- [Torii エンドポイント](/ja/reference/torii-endpoints.md)
- [Iroha バイナリ](/ja/reference/binaries.md)で作業する
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

ソースのチェックアウトから完全なマークダウンヘルプスナップショットを再生するには:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
