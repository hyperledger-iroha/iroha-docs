---
translation_locale: ja
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# プライベートデータスペースのスポンサー料金は {#sponsor-fees-for-a-private-dataspace}

料金のスポンサーシップは,ユーザーが XOR を保有せずにプライベートデータスペースのトランザクションを提出することを可能にします.ユーザーは依然として取引に署名します.トランザクションのメタデータはスポンサーのアカウントに点付けられ,ランタイムはネットワーク料金のためにスポンサーの余分 XOR を借入します.

統合には3つの動く部分がある.

1. ノードは料金のスポンサーを許可する
2. スポンサーの口座は存在し, XOR
3. 各ユーザーは,そのスポンサーのために `CanUseFeeSponsor` を有する.

その後,すべてのスポンサーのユーザートランザクションには このメタデータのみが必要です:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

このページには2つの一般的なパターンが示されています

- フリーユーザは,スポンサーが XOR を支払っているが,ユーザーは何も払わないと書いている.
- ローカルトークン料金:ユーザはアプリトークンでスポンサーに支払い,スポンサーは XOR でネットワークに支払います.

Taira またはプライベートテストネットワークを最初に使用する.新しいプライベートデータスペスはオペレーターとガバナンス変更であり,クライアントの構成によって作成されません.

## 例値 {#example-values}

下のコマンドでは,これらの位置保持者が使用されます:

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

I105 アカウント IDs を使用する.同じアカウントのアクティブ アカウント・アライスがある場合を除き.

## 1. データ スペース を 準備 する {#_1-prepare-the-dataspace}

[で説明されているプライベートデータスペースのカタログとルーティング作業から開始. SORA Nexus データスペス](/ja/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace)に接続する.オペレーター面向したフラグメントは次のように見えます:

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

ユーザートランザクションに移る前に,次のことを確認してください.

- プライベートレーンは `/status` ノードで表示されます.
- ユーザーアカウントは,あなたのプライベートオンボードフローによって受信されます
- スポンサーアカウントが存在します.
- XOR 手数料資産と手数料消し口座は,ネットワーク上で有効である

## 2. データの領域における資産を登録する {#_2-register-assets-in-the-dataspace}

ユーザが個人データ領域内に保持する資産定義をアプリケーション論理に転送する前に登録します. ローカルトークン料金パターンについては,教程は `usage#billing.team` を使用します.

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

まずドメインを設定し SNS 資産名前の空間を所有するリース契約. `AliasSetupPlanRequestV1` 目的 `$BILLING_DOMAIN`, 番号を含む `team` データの空間 ID, キャノン所有者,賃貸期限,現在の引用保証人:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

その後,資産定義を登録します. 規則的な `--id` はネットワークレベルの資産定義 ID です.開発者やエンドユーザがデータスペースコードで使うべきニックネームは:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

オンボード中にローカルトークンをユーザーに転送する

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

ユーザのバランスをチェック:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

データスペースにおけるアプリケーション資産については同じパターンを使用します.トークンごとに1つの資産定義を登録し,それぞれにデータスペア・アライスを与え,ハードコードのカノニカルアセット定義 IDs の代わりに SDK コードからのアライスを参照します.

## 3. ユーザー・アライアスを登録する {#_3-register-user-aliases}

記録はまだ法典的な I105 口座 IDs. ユーザ面の名前とはアカウントの偽名であり,偽名は不敏感なハンドルであるべきです `alice@team` または `alice@members.team`. 電話番号やメールアドレスを偽名として使用しないでください.これらは次のセクションのプライベート識別子フローに含まれる.

アライアス設定はドメイン設定と同じ宣言式プランナーを使用します. SDK またはオンボードサービスが秘密のない `AliasSetupPlanRequestV1` 意図を作成させてください,そのアカウント-アライアスエントリーターゲット `$USER` は,主要な役割を選択し,数値データスペース ID をピンで,現在の賃貸配当保護者を運びます.計画して 1 つの原子トランザクションとして適用します

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

ユーザが XOR を支払わない場合は,承認されたスポンサーの認識のあるオンボードサービスを使用して設定取引を構成し提出する.リーズ買収と偽称を独立したアプリケーション取引に分割しないでください.

CLI から確認する

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

新しいアカウントを作成するには,構築するオンボードサービスを好みます `NewAccount` スタイルの `uaid` 必要な場合,最初の `label`. シンプルな `ledger account register --id` コマンドはカノニカル・アカウントのみを登録する ID.

## 4. FHE で電話・メールを個人的に登録する {#_4-register-phone-and-email-privately-with-fhe}

電話番号とメールアドレスを 公共の偽名ではなく 個人識別子として使用する.FHE サポートされたフローは,アカウントの偽名,トランザクションメタデータ,および世界状態から原始識別子を保持します:

1. 事業者は電話および電子メールのために [RAM-LFE/FHE プログラムポリシー](/ja/blockchain/ram-lfe.md)を登録します.
2. 事業者は, `phone#team` と `email#team` のようなアクティブ識別子ポリシーを登録する.
3. 財布は電話やメールを本地的に正常化します
4. 財布は暗号化された値を解析器に送信します.
5. 解析機は `IdentifierResolutionReceipt` を返します
6. 利用者は `ClaimIdentifier` を領収書とともに提出する.
7. チェーンは不透明な識別子と領収書ハッシュを保存し,原始電話または電子メール値ではない.

操作者側のポリシー設定は SDK またはサービスタスクです. 各識別子タイプに対して,これらの指示ペアを作成して提出します:

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

メールで繰り返す:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

オンボード中に,財布またはバックエンドは本地的に正常化する必要があります.

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

ステップ8でスポンサーのメタデータファイルが作成された後,そのメタデータとともにユーザーに署名した請求指示を提出する:

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

現在の CLI は,これらの識別指示のための入力されたコマンドを暴露しません. SDK でシリアル化された `InstructionBox` 値を生成し,それらを `ledger transaction stdin` を介して送信します:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

このガードレーンを オンボードサービスに保管する

- アカウントの偽名は,人間に読めるハンドルのみです.
- 原始電話および電子メール値は,偽名,メタデータ,ログ,またはトランザクション用荷物に決して表示されません.
- 口座には `uaid` が存在し,個人識別子を請求する前に
- 領収は `policy_id`, `opaque_id`,`uaid`, `account_id`に結合し,期限切れである
- 解決鍵と隠されたプログラムのコミットメントはガバナンスによって制御されます

## 5. ノードでスポンサーを有効にする {#_5-enable-sponsorship-on-the-node}

料金のスポンサーはノード/ランタイムポリシーです. Nexus 料金の設定で有効化します:

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

`fee_asset_id`はネットワーク料金資産である. SORA Nexus に対して,これは XOR である.あなたのネットワークが暴露したアクティブ XOR のニックネームまたはカノニカル XOR の資産定義 ID を使用する.

`sponsor_max_fee = "0"` は,トランザクションごとにスポンサーの制限がないことを意味します. データスペース取引の通常のサイズとガスのプロフィールを知った後に生産のためにゼロ以外の制限を設定します.

このコンフィギュレーションを正常な操作プロセスで 再起動またはロールします.

## 6. スポンサー を 創り,資金提供 する {#_6-create-and-fund-the-sponsor}

必要に応じてスポンサーキーペアを生成する

```bash
kagami keys --algorithm ed25519 --json
```

公钥をネットワークのアカウントフォーマットに変換する:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

プライベートオンボードフローでスポンサーアカウントを登録する

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

XOR でスポンサーを財務金,請求口座,または他の資金調達口座から資金提供:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

について Taira 排水器の助手から [テストネットを入手 XOR について Taira](/ja/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) のように `taira_faucet_claim.py`, その後,財務金移転ではなく公的な faucetでスポンサーを資金提供します.

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

スポンサーの余分 XOR をチェックする.

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. スポンサーへのアクセスを許可する {#_7-grant-a-user-access-to-the-sponsor}

スポンサーは各ユーザーに手数料を請求する許可を与えなければならない. 補助金はユーザが任意のスポンサーアカウントの名前を名付けることを妨げるものです

これをスポンサーアカウントとして,または実行時間のポリシーによって許可されたオペレーティングアカウントとして実行します:

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

オンボードサービスについては,これを通常の口座提供のステップとログにします.

- ユーザーアカウント
- スポンサーの口座
- データの領域またはアプリケーション
- 承認券またはガバナンス決定

ユーザの補助金を検査するために:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. スポンサーのメタデータを添付する {#_8-attach-sponsor-metadata}

再利用可能なメタデータファイルを作成する:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

このメタデータで提出されたすべての書き込みは,スポンサーに課金されます.

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

SDKs の場合,署名された取引に同じトランザクションメタデータオブジェクトを添付する.ユーザはユーザーの鍵でトランザクションをサインします.スポンサーはすべてのユーザートランザクションに署名しません.以前の `CanUseFeeSponsor` 授予は許可であるため.

## パターン1: ユーザー は 無料 に 支払っ て い ます {#pattern-1-users-pay-no-fees}

アプリケーションまたはオペレーターはすべてのネットワーク料金を吸収するとき,これを使用します.

開発者チェックリスト:

1. ユーザの通常のトランザクション用荷が変わらず保持する.
2. `fee_sponsor`で取引メタデータを追加する.
3. ユーザーとしてサインする
4. プライベートデータスペース経路で送信する.

ユーザアカウントには XOR の余分は必要ありません.スポンサーアカウントは,設定された Nexus 料金をカバーするために十分な XOR を保持する必要があります.

## パターン 2: ユーザがローカル・トークンを支払う {#pattern-2-users-pay-a-local-token}

ユーザが XOR を持たない場合,この項目を使用する.しかしデータ空間は依然として内部アプリ料金,クレジット支出,または配当トークンを要求している.

このパターンでは,ローカルトークンはアプリケーションの支払いであり,ネットワーク料金の資産ではない.スポンサーは依然として XOR でネットワーク料金を支払う.

例えば,プライベートデータスペースでローカルトークンを使用します:

```text
usage#billing.team
```

オンボード,サブスクリプション更新,または配給期間中 `usage#billing.team` を保有するユーザーを資金提供します. その後,ユーザー取引を原子化します:

1. ユーザからスポンサーにローカルトークンを転送する
2. 要求されたアプリ操作を実行する
3. `fee_sponsor` メタデータを含むため,スポンサーは XOR を支払う.

最低の CLI 煙検査は, XOR が支援するローカルトークン転送のみである.

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

本物のアプリでは,ローカルトークンによる支払いを別々のベスト・エフェストトランザクションとして提出しないでください. 支払いとビジネスインstrukーションの両方を含む署名されたトランザクションを作成するか,ビジネス操作を適用する前にローカルトーકન収集する契約エントリーポイントを公開してください.

アプリや契約に変換ポリシーを保存します.

- どれだけのローカルトークンユニットがかかるか
- XOR の補充をスポンサーするローカルトークンインフローマップの仕組み
- ユーザのバランスが低すぎるとどうなるか
- スポンサーの場合は XOR バランスは低すぎる

::: 警告

`gas_asset_id` を"ローカル・トークン料"パターンのために使用しないでください. ただし,そのガス資産にもスポンサーが請求されることを望まない場合を除きます.現在の実行時に, `fee_sponsor` はまた,設定されたパイプライン-ガスの資産負債の支払者をスポンサーにします.ローカルトークンユーザー料金は,転送または契約規則で明示的にトークンを収集します.

:::

## 失敗したスポンサー取引のデバッグ {#debug-failed-sponsored-transactions}

一般的な拒絶理由では,通常は1つの設定ステップが欠落していることを示しています.

|エラーテキスト|確認すべきこと|
| --- | --- |
|`fee sponsorship is disabled`|`nexus.fees.sponsorship_enabled` はまだ `false` のノードにあります.|
|`fee sponsor is not authorized`|ユーザーはこのスポンサーのために `CanUseFeeSponsor` を持っていない. |
|`fee asset ... is missing`|スポンサーは設定された XOR 料金の資産を所有していない. |
|`fee balance ... is insufficient`| スポンサーを補充する XOR バランス |
|`fee exceeds sponsor_max_fee`|`sponsor_max_fee`を増やしたり,取引規模/ガス量を減らしたりする. |
|`invalid nexus fee asset id`|`nexus.fees.fee_asset_id`または XOR 資産の別名. |

パターン2をデバッグするときは,両バランスをチェックします.

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

- テストネット,ステージリング,メインネットのスペンサーキーを別々に保持する
- スポンサーの余分 XOR が入場地に到達する前に警告
- トラフィックが特徴付けられた後,ゼロの制限を設定する `sponsor_max_fee`
- 料金制限のスポンサーが申請またはゲートウェイに書いた
- `CanUseFeeSponsor` を削除する
- ユーザトランザクションハッシュ,ローカルトークン決済,およびスポンサーのデビット XOR を調整する

ユーザのスポンサーシップを取り消す:

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

- [SORA Nexus データパース](/ja/get-started/sora-nexus-dataspaces.md)に接続する
- [動作する Iroha 3 経由 CLI](/ja/get-started/operate-iroha-via-cli.md)
- [資産](/ja/blockchain/assets.md)
- [許可](/ja/blockchain/permissions.md)
- [許可トークン](/ja/reference/permissions.md)
