---
translation_locale: ja
translation_source: /blockchain/domains.md
translation_source_hash: 26e8efe6c728d0f819b12e7d8257777d3d4ea272f42fabf8aec727467146500f
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# ドメイン {#domains}

ドメインは `World` に登録される名前付きの名前空間です。現在の Iroha 3 のデータモデルでは、ドメイン名を親データスペース名で修飾するため、正規の識別子は次の形になります。

```text
domain.dataspace
```

例えば、`payments.universal` は `universal` データスペース内の `payments` ドメインを表します。

## 構造 {#structure}

登録された`Domain`には以下が含まれます:

- `id`: データスペース名で修飾された `DomainId`
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

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

このインテントは、`payments.universal`、そのデータスペースの数値識別子、正規の I105 形式の所有者、リース取得期間、現在のポリシーと支払い見積もりを検証するガードを指定します。プランナーのエンドポイントは `POST /v1/aliases/setup/plan` です。返されるプランは、チェーン、権限主体、状態、有効期限に結び付けられます。ドメインの削除には引き続き[`Unregister`](/ja/blockchain/instructions.md#un-register)を使います。

ドメインを作成または削除するには、適切なドメイン管理が必要です アクティブなソフトウェアランタイムバリデータの下での許可。ドメインメタデータは以下で更新できます [`SetKeyValue` そして `RemoveKeyValue`](/ja/blockchain/instructions.md#setkeyvalue-removekeyvalue) 認可主体がそのドメインを変更する権限を持っているとき。

## Taira でこのワークフローを実行してください {#try-it-on-taira}

現在パブリック Taira テストネットで表示されているドメインを一覧にしてください:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

公開レーンのカタログをデータスペースのエイリアスに対応付けます。

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

アプリでドメインの存在を確認する場合は、最初のコマンドを使ってください。レーンカタログでは、データスペースに関連付けられたレーンを調べ、各レーンの可視性が公開か制限付きか、およびコアレーンに対する同期状態を確認できます。

ドメインの設定は、手数料が発生する書き込み操作です。Taira で試す前に、[Taira でテストネット XOR を取得する](/ja/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)に記載された、事前準備を伴うフォーセットの手順で署名者に資金を供給します。その後、手数料の支払者を明示してプランを適用します。CLI は署名前に正確な手数料を見積もります。

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
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
