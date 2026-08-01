---
translation_locale: ja
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ドメイン {#domains}

ドメインは `World` で登録されている名前空間である.現在の Iroha 3 データモデルでは,ドメインが母データスペースによって認定されるため,定例識別子は:

```text
domain.dataspace
```

たとえば, `payments.universal` は `payments` ドメインを `universal` データスペース内に指定します.

## 構造 {#structure}

登録された `Domain` には:

- `id`:データスペースの資格のある `DomainId`
- `logo`:ドメインロゴのオプションは `SoraFS` URI
- `metadata`:任意のキー値メタデータ
- `owned_by`:ドメインを所有するアカウント,通常はそれを登録した口座

ドメインの実現に使用されるブートストラップ用荷物は `NewDomain` である.このドメインは `id`,オプション `logo`,初期 `metadata`を運ぶ.実行時間は当局から填写する`owned_by`です.通常のクライアントはこの用荷を直接送信しません.

## 登録 {#registration}

通常のドメイン作成は,デクランタティブ・アライアスセットアップフローを使用します.これは SNS リース契約,所有者機能,引用保護,およびドメイン行を原子的な `EnsureAlias` トランザクションで保持します. `Register::Domain` はゲネシス/ブートストラップ表面であり, `ledger domain` コマンドには `register` のサブコマンドはありません.

SDK またはオンボードサービスで秘密のない `AliasSetupPlanRequestV1` 意図を作成し,その後 CLI がライブ状態に対して計画を立てて,その正確な計画を提出してください.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

意図は `payments.universal`,その数値データ空間,法典的な I105 所有者,リース取得期限,および現在のポリシー/支払い配当保護者を識別する.プランナーエンドポイントは `POST /v1/aliases/setup/plan`;返済プランはチェーン・権限・州・締め切りの制限である.ドメインの削除は [`Unregister`](/ja/blockchain/instructions.md#un-register)を使用している.

ドメインを作成または削除するには,アクティブランタイム検証器の下で適切なドメイン管理許可が必要です. 当局がそのドメインを変更する権限がある場合,ドメインメタデータは [`SetKeyValue`と `RemoveKeyValue`](/ja/blockchain/instructions.md#setkeyvalue-removekeyvalue)で更新できます.

## Taira で試してみてください {#try-it-on-taira}

公開 Taira テストネットで現在見られるドメインをリストする.

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

パブリック・レーンのカタログをデータスペースの偽名に映し出します:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

アプリケーションがドメインが存在するかどうかを確認するときに最初のコマンドを使用します. データスペースが公開,制限,またはコアレーンの後方に遅れているかどうかを確認する必要がある場合,レーンカタログを使用します.

Taira で試す前に, faucet ヘルパーを[ から保存し,Testnet XOR を Taira ](/ja/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) で `taira_faucet_claim.py` として取得し,公開 faucet で署名者を資金提供し,料金メタデータを添付してください.

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

繰り返しテストネットの実行でユニークなドメイン名への意図を構築し, Taira の現在のポリシーと料金の資産配当保護を使用する. localnet または Minamoto に生成されたプランを再利用しないでください.

## 他の組織との関係 {#relationship-to-other-entities}

ドメインはドメインをグループし,ドメインスケープデータのためのネームスペースを提供します.資産定義ではドメインに適した識別子を使用し,クエリはドメインのリストやドメインにスケープされたオブジェクトを見つけることができます.アカウント自体は現在のデータモデルではドメインレスですが,アカウントはドメインを所有し,その定義がドメインの下で生息する資産を保有することができます.

参照:

- [世界](/ja/blockchain/world.md)
- [資産](/ja/blockchain/assets.md)
- [メタデータ](/ja/blockchain/metadata.md)
- [名前付け規則](/ja/reference/naming.md)
