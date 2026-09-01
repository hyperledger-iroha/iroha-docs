---
translation_locale: ja
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 37a2c29dccf3d2abacbbba16869d65b70b93545875a122470601194231c2263b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# プライベートデータスペースのスポンサー料金 {#sponsor-fees-for-a-private-dataspace}

手数料スポンサーシップにより、ユーザーは XOR を保有していなくてもプライベートデータスペースの取引を送信できます。ユーザーは依然として取引に署名します。取引メタデータはスポンサーアカウントを指し、ソフトウェアランタイムはネットワーク手数料のためにスポンサーの XOR 残高を引き落とします。

その統合には三つの可動部分があります。

1. そのノードは手数料のスポンサーシップを可能にします
2. スポンサーアカウントは存在し、XOR を持っています
3. 各ユーザーはそのスポンサーに対して`CanUseFeeSponsor`を持っています

その後、すべてのスポンサー付きユーザーのトランザクションには、このメタデータだけが必要です:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

このページには、2つの一般的なパターンが表示されています。

- 無料ユーザーは次のように書きます: スポンサーが XOR を支払い、ユーザーは何も支払いません。
- ローカルトークンの手数料: ユーザーはアプリのトークンでスポンサーに支払い、スポンサーはネットワークに XOR で支払います。

まず Taira またはプライベートテストネットワークを使用してください。新しいプライベートデータスペースはオペレーターおよびガバナンスの変更であり、クライアントの設定によって作成されるものではありません。

## 例の値 {#example-values}

以下のコマンドはこれらのプレースホルダーを使用します：

```bash
export DATASPACE="team"
export USER="<USER_ACCOUNT_I105>"
export SPONSOR="<SPONSOR_ACCOUNT_I105>"
export TREASURY="<TREASURY_ACCOUNT_I105>"
export XOR_ASSET="xor#universal"
export BILLING_DOMAIN="billing.team"
export LOCAL_FEE_ASSET="usage#billing.team"
export LOCAL_FEE_ASSET_ID="<LOCAL_FEE_ASSET_DEFINITION_BASE58>"
export USER_ALIAS="alice@team"
export PHONE_POLICY="phone#team"
export EMAIL_POLICY="email#team"
export POLICY_OWNER="<IDENTIFIER_POLICY_OWNER_ACCOUNT_I105>"
```

デプロイメントで同じアカウントに対して有効なアカウントエイリアスがある場合を除き、標準の I105 アカウントID を使用してください。

## 1. データスペースを準備する {#_1-prepare-the-dataspace}

[SORA Nexus データスペースに接続する](/ja/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace)で説明されているプライベートデータスペースカタログとルーティングの作業から始めます。オペレーター向けのフラグメントは次のようになります:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "team-private"
description = "Private team lane"
dataspace = "team"
visibility = "private"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "team"
id = 42
description = "Private team dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "team"
[nexus.routing_policy.rules.matcher]
account_prefix = "team."
description = "Route team domains to the private dataspace"
```

ユーザー取引に移る前に、次のことを確認してください:

- プライベート実行レーンはノード `/status` の応答に表示されます
- ユーザーアカウントは、あなたのプライベートなオンボーディングフローによって承認されます
- スポンサーアカウントが存在します
- ネットワーク上で XOR 手数料資産および手数料シンクアカウントは有効です

## 2. データスペースに資産を登録する {#_2-register-assets-in-the-dataspace}

ユーザーがプライベートデータスペース内で保持する資産定義を、アプリケーションロジックに組み込む前に登録してください。ローカルトークン料金パターンの場合、チュートリアルでは `usage#billing.team` を使用します:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

まず、ドメインと資産ネームスペースを所有する SNS リースを設定します。`$BILLING_DOMAIN`のために、秘密なしの`AliasSetupPlanRequestV1`インテントを作成し、数値の`team`データスペースID、標準的な所有者、リース期間、および現在の見積もりガードを含めます:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

次に、資産定義を登録します。標準の `--id` はネットワークレベルの資産定義IDです。エイリアスは、開発者やエンドユーザーがデータスペースコードで使用すべきものです：

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

オンボーディング中にユーザーにローカルトークンを発行または転送する:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

ユーザーの残高を確認してください：

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

データスペース内のアプリケーション資産にも同じパターンを使用してください。トークンごとに1つの資産定義を登録し、それぞれにデータスペースのエイリアスを付け、正規資産定義IDをハードコーディングする代わりに SDK コードからそのエイリアスを参照してください。

## 3. ユーザーの別名を登録する {#_3-register-user-aliases}

アカウントは依然として正規の I105 アカウントIDです。ユーザー向けの名前はアカウントの別名であり、別名は `alice@team` や `alice@members.team` のような機密性の低いハンドルであるべきです。電話番号やメールアドレスを別名として使用しないでください。これらは次のセクションのプライベート識別子フローに含まれます。

エイリアス設定は、ドメイン設定と同じ宣言型プランナーを使用します。SDK またはオンボーディングサービスに、アカウントエイリアスエントリが対象となるシークレットなしの `AliasSetupPlanRequestV1` インテントを作成させてください`$USER`は、主要な役割を選択し、数値データスペースIDを固定し、現在のリース料-価格検証ガードを保持します。その後、それを1つのアトミックトランザクションとして計画し適用します:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

もしユーザーが XOR を支払うべきでない場合は、承認されたスポンサー対応のオンボーディングサービスを使用して、セットアップトランザクションを構築および送信してください。リース取得とエイリアスバインディングを独立したアプリケーショントランザクションに分割しないでください。

エイリアスがバインドされたら、CLI で確認してください。

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

新しいアカウントを作成する場合は、安定した`uaid`で`NewAccount`を構築し、必要に応じて初期の`label`を作成するオンボーディングサービスを利用してください。単純な`ledger account register --id`コマンドは、正規のアカウントIDのみを登録します。

## 4. FHE で電話とメールを非公開で登録する {#_4-register-phone-and-email-privately-with-fhe}

電話番号やメールアドレスは、公開エイリアスではなく、プライベート識別子のクレームとして使用してください。FHE に対応したフローは、生の識別子がアカウントエイリアス、取引メタデータ、ワールドステートに入らないようにします：

1. オペレーターは電話とメールのために[RAM-LFE/FHE プログラム方針](/ja/blockchain/ram-lfe.md)を登録します
2. オペレーターは、`phone#team` や `email#team` のようなアクティブな識別子ポリシーを登録します
3. そのウォレットは電話番号やメールをローカルで正規化します
4. ウォレットは暗号化された値をリゾルバーに送信します
5. リゾルバーは`IdentifierResolutionReceipt`を返します
6. ユーザーはプロトコル結果記録と共に `ClaimIdentifier` を提出します
7. チェーンは生の電話番号やメールアドレスの値ではなく、オペーク識別子とプロトコル結果のレコードの暗号ハッシュを保存します

オペレーター側のポリシー設定は SDK またはサービスタスクです。各識別子タイプごとにこれらの指示ペアを作成して提出してください。

```text
RegisterRamLfeProgramPolicy(
  program_id = "phone_team",
  owner = "$POLICY_OWNER",
  backend = "bfv-programmed-sha3-256-v1",
  verification_mode = "signed",
  commitment = "<HIDDEN_PROGRAM_POLICY_COMMITMENT>",
  resolver_public_key = "<RESOLVER_PUBLIC_KEY>"
)
ActivateRamLfeProgramPolicy(program_id = "phone_team")

RegisterIdentifierPolicy(
  id = "$PHONE_POLICY",
  owner = "$POLICY_OWNER",
  normalization = "PhoneE164",
  program_id = "phone_team",
  note = "Private phone registration for team dataspace"
)
ActivateIdentifierPolicy(policy_id = "$PHONE_POLICY")
```

それをメールに対して繰り返してください:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

オンボーディング中、ウォレットやバックエンドはローカルで正規化する必要があります:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

ステップ8でスポンサーのメタデータファイルが作成された後、そのメタデータを含むユーザー署名済みの請求指示を提出してください:

```text
ClaimIdentifier(
  account = "$USER",
  receipt = IdentifierResolutionReceipt {
    payload: {
      policy_id: "$PHONE_POLICY",
      opaque_id: "<OPAQUE_ACCOUNT_ID>",
      uaid: "<USER_UAID>",
      account_id: "$USER",
      ...
    },
    attestation: "<RESOLVER_SIGNATURE_OR_PROOF>"
  }
)
```

現在の CLI は、これらのアイデンティティ命令に対して型指定されたコマンドを公開していません。SDK を使用してシリアル化された`InstructionBox`値を生成し、それを`ledger transaction stdin`を通じて送信してください：

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

オンボーディングサービスでは、これらのガードレールを守ってください:

- アカウントの別名は、人間が読めるハンドルに過ぎません
- 生の電話番号やメールアドレスの値は、エイリアス、メタデータ、ログ、トランザクションのペイロードに表示されることはありません
- そのアカウントは、プライベート識別子を主張する前に`uaid`があります
- プロトコル結果の記録は `policy_id`、`opaque_id`、`uaid`、`account_id` にバインドされ、期限切れ
- リゾルバーキーと隠されたプログラムの暗号コミットメント値はガバナンスによって管理されます

## 5. ノードでスポンサーシップを有効にする {#_5-enable-sponsorship-on-the-node}

手数料のスポンサーシップはノード/ランタイムのポリシーです。Nexus の手数料設定で有効にしてください:

```toml
[nexus.fees]
fee_asset_id = "xor#universal"
fee_sink_account_id = "<FEE_SINK_ACCOUNT_I105_OR_ALIAS>"
base_fee = "0"
per_byte_fee = "0"
per_instruction_fee = "0.001"
per_gas_unit_fee = "0.00005"
sponsorship_enabled = true
sponsor_max_fee = "0"
```

`fee_asset_id` はネットワーク手数料の資産です。SORA Nexus に関してはこれは XOR です。ネットワークによって公開されているアクティブな XOR エイリアスまたは標準的な XOR 資産定義IDを使用してください。

`sponsor_max_fee = "0"` は、1 回のトランザクションあたりのスポンサー上限がないことを意味します。運用環境では、データスペーストランザクションの通常のサイズとトランザクション実行コストのプロファイルが分かった後に、0 以外の上限を設定してください。

この設定を再起動するか、通常のオペレーターの手順で適用してください。

## 6. スポンサーを作成して資金を提供する {#_6-create-and-fund-the-sponsor}

必要に応じてスポンサーキー ペアを生成します:

```bash
kagami keys --algorithm ed25519 --out-dir ./fee-sponsor-key
```

パブリックキーをネットワーク用のアカウント形式に変換してください：

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

プライベートオンボーディングフローを通じてスポンサーアカウントを登録してください:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

スポンサーに、金庫、請求アカウント、または他の資金提供済みアカウントから XOR を資金提供してください:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

リハーサル用の Taira では、[Taira でテストネット XOR を入手](/ja/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)からテストネット資金提供サービスのヘルパーを`taira_faucet_claim.py`として保存し、その後、財務省の送金ではなく、公開テストネット資金提供サービスでスポンサーに資金を提供します：

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

スポンサーの XOR 残高を確認してください:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. ユーザーにスポンサーへのアクセス権を付与する {#_7-grant-a-user-access-to-the-sponsor}

スポンサーは各ユーザーに対して料金を請求する権限を付与しなければなりません。この付与が、ユーザーが任意のスポンサーアカウントを指定することを防ぎます。

これをスポンサーアカウントとして、またはソフトウェア実行ポリシーで許可されている運用アカウントとして実行してください:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission grant --id "$USER"
```

オンボーディングサービスの場合、これを通常のアカウントプロビジョニング手順とし、ログを記録してください:

- ユーザーアカウント
- スポンサーアカウント
- データスペースまたはアプリケーション
- 承認チケットまたはガバナンス決定

ユーザーの権限を確認するには:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. スポンサーのメタデータを添付する {#_8-attach-sponsor-metadata}

再利用可能なメタデータファイルを作成します:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

このメタデータで提出されたすべての書き込みはスポンサーに請求されます：

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

〜のために SDKs, 署名済みトランザクションに同じトランザクションメタデータオブジェクトを添付します。ユーザーはユーザーのキーでトランザクションに署名します。 スポンサーは事前のため、すべてのユーザー取引に署名するわけではありません `CanUseFeeSponsor` 許可は承認です。

## パターン1：ユーザーは料金を支払わない {#pattern-1-users-pay-no-fees}

アプリケーションやオペレーターがすべてのネットワーク手数料を負担する場合にこれを使用します。

開発者チェックリスト:

1. ユーザーの通常の取引ペイロードを変更しないでください。
2. `fee_sponsor`でトランザクションのメタデータを追加します。
3. ユーザーとしてサインインしてください。
4. プライベートデータスペース経由で提出してください。

ユーザーアカウントは XOR の残高を必要としません。スポンサーアカウントは、設定された Nexus 手数料をカバーするのに十分な XOR を保持する必要があります。

## パターン2：ユーザーはローカルトークンを支払う {#pattern-2-users-pay-a-local-token}

ユーザーが XOR を保持すべきでない場合にこれを使用しますが、データスペースは依然として内部アプリ料金、クレジット支出、またはクォータトークンを必要とします。

このパターンでは、ローカルトークンはアプリケーションの支払いです。それはネットワーク手数料の資産ではありません。スポンサーは依然としてネットワーク手数料を XOR で支払います。

例えば、プライベートデータスペースでローカルトークンを使用します：

```text
usage#billing.team
```

オンボーディング、サブスクリプション更新、またはクォータ割り当ての際に、`usage#billing.team`でユーザーに資金を提供します。その後、ユーザーのトランザクションをアトミックにします:

1. ユーザーからスポンサーへのローカルトークンの転送
2. 要求されたアプリ操作を実行する
3. `fee_sponsor` のメタデータを含め、スポンサーが XOR を支払うようにする

最小限の CLI スモークテストは、XOR がスポンサーするローカルトークンの転送だけです:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

本物のアプリの場合、ローカルトークンの支払いを別のベストエフォート取引として送信しないでください。支払いとビジネス命令の両方を含む署名済みの取引を1つ作成するか、ビジネス操作を適用する前にローカルトークンを収集するコントラクトのエントリポイントを公開してください。

アプリや契約書に換算ポリシーを記載してください:

- どの操作が何ローカルトークン単位の費用か
- ローカルトークンの流入がスポンサー XOR のチャージにどのように対応するか
- ユーザーの残高が低すぎると何が起こるか
- スポンサー XOR の残高が低すぎるとどうなりますか

::: warning

使用しないでください `gas_asset_id` スポンサーに請求されることを望まない限り、「ローカルトークン手数料」パターン用 その取引実行コスト資産も。その現在のソフトウェアの実行環境では、 `fee_sponsor` また、スポンサーを設定されたパイプラインガス資産の借方の支払者にします。 ローカルトークンのユーザーフィーについては、転送または契約ルールでトークンを明示的に収集してください。

:::

## スポンサー付き取引のデバッグに失敗しました {#debug-failed-sponsored-transactions}

一般的な却下の理由は、通常、1つの設定手順が欠けていることを示しています:

|エラーテキスト|確認すること|
| --- | --- |
| `fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` はまだノード上で `false` です。 |
| `fee sponsor is not authorized` |ユーザーはこのスポンサーに対して`CanUseFeeSponsor`を持っていません。|
| `fee asset ... is missing` |スポンサーは設定された XOR 料金資産を保有していません。|
| `fee balance ... is insufficient` |スポンサーの XOR 残高をチャージしてください。|
| `fee exceeds sponsor_max_fee` |`sponsor_max_fee`を上げるか、取引サイズ/ガスを減らしてください。|
| `invalid nexus fee asset id` |`nexus.fees.fee_asset_id` または XOR のアセットエイリアスを修正してください。|

パターン2をデバッグする際は、両方の残高を確認してください：

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"

iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

## スポンサーを操作する {#operate-the-sponsor}

スポンサーを財務口座として扱う:

- テストネット、ステージング、メインネット用のスポンサーキーを分けて保持する
- スポンサー XOR の残高が入場限度に達する前に警告する
- トラフィックが特定されたら、ゼロでない `sponsor_max_fee` 上限を設定する
- アプリケーションまたはゲートウェイでのスポンサード書き込みのレート制限
- ユーザーがデータスペースを離れるときに `CanUseFeeSponsor` を取り消す
- ユーザー取引の暗号ハッシュ、ローカルトークンの支払い、およびスポンサー XOR の引き落としを照合する

ユーザーのスポンサーシップを取り消す：

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission revoke --id "$USER"
```

## 関連ページ {#related-pages}

- [SORA Nexus データスペースに接続](/ja/get-started/sora-nexus-dataspaces.md)
- [CLI を介して Iroha 3 を操作する](/ja/get-started/operate-iroha-via-cli.md)
- [資産](/ja/blockchain/assets.md)
- [権限](/ja/blockchain/permissions.md)
- [許可トークン](/ja/reference/permissions.md)
