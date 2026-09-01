---
translation_locale: ja
translation_source: /blockchain/domains.md
translation_source_hash: 5e52579436a181d76c83fa549991e56064ae57349b7109d5c41ec7953e5cbb2e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ドメイン {#domains}

ドメインは、`World` に登録された名前空間です。現在の Iroha 3 データモデルでは、ドメインはその親データスペースによって識別されるため、標準的な識別子は次の通りです:

```text
domain.dataspace
```

例えば、`payments.universal` は `universal` データスペース内の `payments` ドメインの名前を付けます。

## 構造 {#structure}

登録された`Domain`には以下が含まれます:

- `id`：データスペース修飾された `DomainId`
- `logo`：ドメインロゴ用のオプションの`SoraFS`URI
- `metadata`：任意のキーと値のメタデータ
- `owned_by`：ドメインを所有しているアカウント、通常はそれを登録したアカウント

ドメインを具現化するために使用されるブートストラップペイロードは`NewDomain`です。これは`id`、オプションの`logo`、および初期の`metadata`を運びます。ソフトウェアランタイムは`owned_by`を認可プリンシパルから埋めます。通常のクライアントはこのペイロードを直接送信しません。

## 登録 {#registration}

通常のドメイン作成は、宣言型のエイリアス設定フローを使用します。これにより、SNS リース、所有者の権限、料金・価格の検証ガード、およびドメイン行を一つの原子的な `EnsureAlias` トランザクションに保持します。 `Register::Domain` は依然としてジェネシス／ブートストラップのサーフェスであり、`ledger domain` コマンドには `register` サブコマンドがありません。

シークレットなしの `AliasSetupPlanRequestV1` インテントを SDK またはオンボーディングサービスで作成し、その後 CLI に実際の状態に対してそれを計画させ、正確な計画を提出させます:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

インテントは識別します `payments.universal`, それの数値データ空間、標準 I105 所有者、賃貸取得期間、そして現在のポリシー／支払い料金の価格確認ガード。プランナー API エンドポイントは `POST /v1/aliases/setup/plan`; 返されたプランはチェーンにバインドされ、トランザクションの承認が行われます アイデンティティ、ブロックチェーン台帳の状態、および期限。ドメインの削除は引き続き使用されます [`Unregister`](/ja/blockchain/instructions.md#un-register).

ドメインを作成または削除するには、適切なドメイン管理が必要です アクティブなソフトウェアランタイムバリデータの下での許可。ドメインメタデータは以下で更新できます [`SetKeyValue` そして `RemoveKeyValue`](/ja/blockchain/instructions.md#setkeyvalue-removekeyvalue) 認可主体がそのドメインを変更する権限を持っているとき。

## Taira でこのワークフローを実行してください {#try-it-on-taira}

現在パブリック Taira テストネットで表示されているドメインを一覧にしてください:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

公開処刑レーンのカタログをデータスペースのエイリアスに戻す:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

アプリがドメインの存在を確認する必要がある場合は、最初のコマンドを使用してください。データスペースが公開されているか、制限されているか、コア実行レーンに遅れているかを確認する必要がある場合は、実行レーンカタログを使用してください。

ドメイン設定は有料の書き込みです。Taira で試す前に、テストネット資金提供サービスヘルパーを[Taira でテストネット XOR を入手する](/ja/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)から`taira_faucet_claim.py`として保存し、公開テストネット資金提供サービスを通じて暗号署名者に資金を供給し、手数料メタデータを添付してください:

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

繰り返しのテストネット実行でユニークなドメイン名の意図を構築し、Taira の現在のポリシーと手数料資産の手数料価格検証ガードを使用してください。ローカルネットや Minamoto で作成された計画を再利用しないでください。

## 他の実体との関係 {#relationship-to-other-entities}

ドメインはブロックチェーン台帳のオブジェクトをグループ化し、ドメインスコープのデータに名前空間を提供します。資産定義はドメイン修飾識別子を使用し、クエリはドメインを列挙することができます、またはドメインにスコープされたオブジェクトを見つけます。アカウント自体は現在のデータモデルではドメインを持ちませんが、アカウントはドメインを所有でき、ドメインの下に定義がある資産を保持することができます。

参照：

- [世界](/ja/blockchain/world.md)
- [資産](/ja/blockchain/assets.md)
- [メタデータ](/ja/blockchain/metadata.md)
- [命名規則](/ja/reference/naming.md)
