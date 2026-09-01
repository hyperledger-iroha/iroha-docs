---
translation_locale: ja
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 8d6fd7101094ba21cfc2c5fb9a89d2acd7e67f13ff47b9f8c8e01bbbd7bf2836
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# 権限と役割 {#permissions-and-roles}

## 結果 {#outcome}

あるアカウントが特定のアカウントのメタデータを更新する権限を付与するロールを作成し、それを代理人に割り当て、委任された書き込みを証明し、対応する型付きの Rust 指示を示します。

## 前提条件 {#prerequisites}

- 資金提供された Taira クライアントと[Taira に接続する](./connect-to-taira.md)からの手数料メタデータ。
- `TARGET_ACCOUNT` と `DELEGATE_ACCOUNT` が正規の I105 アカウントID に設定されました。
- 署名アカウントは、対象の権限およびロールを管理できるようにする必要があります。Taira では、これは権限が制限された管理操作です。スコープ付き権限を付与するために必要な `CanManageRoles` および認可プリンシパルを取得するか、生成されたローカルネットワーク上でレシピを実行してください。

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

書き込みを証明する際には、委任者用に別のクライアント構成を使用してください:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## ステップ {#steps}

### 1. 空の役割を登録する {#_1-register-an-empty-role}

すべての状態を変更する CLI コマンドは、手数料の支払者を明示的に指定します。メタデータファイルには、テストネットの資金提供サービスの応答から派生した現在の Taira 手数料資産が含まれています。

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. 対象アカウントにスコープされた権限を追加する {#_2-add-a-permission-scoped-to-the-target-account}

権限トークンは JSON 型のオブジェクトです。`payload` 内のアカウントは I105 ID として保持してください；この厳密なフィールドではエイリアスは有効ではありません。

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. 役割を代表者に割り当てる {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

ロールとその付与は期限切れになりません。アクセスが不要になったら明示的に取り消してください。

### 4. 委任された権限を行使する {#_4-exercise-the-delegated-permission}

書き込みには、デリゲートの暗号署名者と手数料残高を使用します。JSON の値は標準入力から読み取られます。

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

同じモデルは Rust のクライアントにも利用可能です。ここで`client`が`registrar_account`として署名し、CLI のフローと同様に、そのロールの初期所有者となります。3つのアカウント変数はすでに`AccountId`の値として解析されています：

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

課題の両面をリストアップし、次に代表者が書いた正確な値を読みなさい：

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

許可リストには `CanModifyAccountMetadata` が `TARGET_ACCOUNT` にスコープされて含まれている必要があり、代理人の役割リストには `ROLE_ID` が含まれている必要があり、メタデータの読み取りは `"delegated"` を返す必要があります。

## トラブルシューティング {#troubleshooting}

- `Not permitted` を登録、編集、または役割を割り当てる際には、暗号署名者が必要な Taira 認可プリンシパルを持っていないことを意味します。スコープ付きトークンをグローバルなものに置き換えないでください。正確な権限を要求するか、localnet を使用してください。
- ペイロード解析エラーは通常、`account` が `payload` の横に置かれた、エイリアスが I105 ID の代わりに供給された、または JSON の値が二重に引用符で囲まれたことを意味します。
- 料金の拒否は、そのステップを提出する暗号署名者に属します。マネージャーに資金を提供し、独立して委任し、フォーセットから得られた料金資産のメタデータを保持してください。
- 成功したロールの付与は、そのトークンにエンコードされたスコープを上書きすることはありません。このロールは、権限ペイロードに名前が記載されたアカウントのみを変更できます。
- クリーンアップするには、まず `ledger account role revoke` を実行し、次に `ledger role permission revoke` を実行し、最後に `ledger role unregister` を実行してください。各操作は別々の書き込みで、`--fee-payer authority` と手数料のメタデータを含める必要があります。

## ソースおよび関連文書 {#source-and-related-docs}

- [固定されたソースコードのリビジョンでの役割統合テスト](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [固定されたソースコードのリビジョンでの権限統合テスト](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [ピン留めされたソースコードのリビジョンにおける組み込みの権限データモデル](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [権限と役割](/ja/blockchain/permissions.md)
- [許可トークンの参照](/ja/reference/permissions.md)
- [メタデータ](./metadata.md)
