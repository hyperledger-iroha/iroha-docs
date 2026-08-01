---
translation_locale: ja
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 734437b8530ad0efb9ddd83b24cb90c30dc29843a03753babd8dca5e86a3f91d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 許可と役割 {#permissions-and-roles}

## 成果 {#outcome}

特定のアカウントのメタデータを更新する1つのアカウントに許可を与える役割を作成し,デレガートに割り当て,委託された書き込みを証明し,対応した Rust の入力指示を示します.

## 必須条件 {#prerequisites}

- 資金調達された Taira クライアントと料金メタデータは, [から Taira](./connect-to-taira.md)へ接続する.
- `TARGET_ACCOUNT` そして `DELEGATE_ACCOUNT` カノニカルに設定 I105 口座 IDs.
- 署名アカウントはターゲット許可と役割を管理できるようにする必要があります. Taira では,許可を指定した管理操作である.`CanManageRoles` を取得し,対象許諾を許可するために必要な権限を取得するか,生成されたローカルネットワークでレシピを実行する.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

書き込みを証明する際に,デレゲート用の2番目のクライアント設定を使用します:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## ステップ {#steps}

### 1. 空っぽの役割を登録する {#_1-register-an-empty-role}

各状態変化する CLI コマンドは,料金支払者を明示的に指定します.メタデータファイルには, faucet応答から得られた現在の Taira 料金の資産が含まれます.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. 対象アカウントに制限された許可を追加する {#_2-add-a-permission-scoped-to-the-target-account}

許可トークンは JSON オブジェクトにタイプされます.アカウントを `payload` の内部で I105 ID として保持してください.この厳格なフィールドでは,仮名は有効ではありません.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. 代表 に 役割 を 委ね {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

役割とその補助金は終了しない.アクセスがもはや必要でないとき,それらを明示的に取り消す.

### 4. 委託された許可を行使する {#_4-exercise-the-delegated-permission}

JSON 値は標準入力から読み取られる.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

同じモデルが Rust クライアントに利用可能である.ここで `client` は `registrar_account` として記入し,その役割の初期所有者となり,それは CLI ストリームと同様に行われます.すべての3つのアカウント変数は既に解析されている `AccountId` 値:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};
use iroha_executor_data_model::permission::account::CanModifyAccountMetadata;

let role_id: RoleId = "cookbook_metadata_editors".parse()?;
let role = Role::new(role_id.clone(), registrar_account).add_permission(
    CanModifyAccountMetadata {
        account: target_account.clone(),
    },
);

client.submit_all_blocking::<InstructionBox>(
    [
        Register::role(role).into(),
        Grant::account_role(role_id, delegate_account).into(),
    ],
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## 確認する {#verify}

任務 の 両面 を 列挙 し,その 後 に 代表 者 が 書い た 正確 な 値 を 読ん でください.

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

許可リストには `CanModifyAccountMetadata` を含め,その範囲は `TARGET_ACCOUNT` に及び,代表の役割リストには `ROLE_ID` が含まれ,読み取られたメタデータには `"delegated"` が返さなければなりません.

## 問題を解く {#troubleshooting}

- `Not permitted`を登録したり,編集したり,役割を割り当てるときには,署名者が要求される Taira 権限がないことを意味します. 対象トークンをグローバルトークンに置き換えてはならない;正確な授与を要求するか,ローカルネットを使用しないでください.
- 役に立たない負荷解析エラーは,通常 `account` が `payload` の隣に置かれたり, I105 ID の代わりに偽名が提供されたり,または JSON の値が2回引用されたりする.
- 料金拒否は,そのステップを提出する署名者に属します.管理者を資金提供し,独立に委任し, faucet-derived fee assetのメタデータを保持します.
- 成功した役割授予は,そのトークンにコードされている範囲を覆いません.この役割は許可用荷重で指定されたアカウントのみを変更できます.
- クリアするには `ledger account role revoke`,その後 `ledger role permission revoke`,そして最後に`ledger role unregister`を実行します.それぞれは別々の書き込みであり, `--fee-payer authority`と料金のメタデータを含む必要があります.

## ソースおよび関連文書 {#source-and-related-docs}

- [](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/roles.rs) 固定されたコミットでの役割統合テスト
- [固定 commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/permissions.rs)での許可統合テスト
- [固定された commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_executor_data_model/src/permission.rs) の内蔵許可データモデル
- [許可と役割](/ja/blockchain/permissions.md)
- [許可証参照](/ja/reference/permissions.md)
- [メタデータ](./metadata.md)
