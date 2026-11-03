---
translation_locale: ja
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 40fe8b19344d8eff66b178dc8576e2e049fef50bd3212fbddc5c0d5f7f37fa03
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# 権限と役割 {#permissions-and-roles}

## 結果 {#outcome}

あるアカウントが特定のアカウントのメタデータを更新する権限を付与するロールを作成し、それを代理人に割り当て、委任された書き込みを証明し、対応する型付きの Rust 指示を示します。

## 前提条件 {#prerequisites}

- [Taira に接続する](./connect-to-taira.md) で用意した、資金提供済みの Taira クライアント。
- `TARGET_ACCOUNT` と `DELEGATE_ACCOUNT` が正規の I105 アカウントID に設定されました。
- 署名アカウントは `CanManageRoles` を保持し、かつスコープ付き権限を委任できる必要があります。つまり、`TARGET_ACCOUNT` 自身であるか、そのアカウントに対する `CanModifyAccountMetadata` をすでに保持している必要があります。Taira では、これは権限が制限された管理操作です。生成されたローカルネットのクライアントは `CanManageRoles` を保持していないため、このレシピにはジェネシスでそれを付与するネットワークが必要です。

```bash
CONFIG=./taira.client.toml
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

すべての状態を変更する CLI コマンドは、手数料の支払者を明示的に指定します。CLI は署名前に、Taira の手数料資産で表した正確な手数料の見積もりを提示します。

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  ledger role register --id "$ROLE_ID"
```

### 2. 対象アカウントにスコープされた権限を追加する {#_2-add-a-permission-scoped-to-the-target-account}

権限トークンは JSON 型のオブジェクトです。`payload` 内のアカウントは I105 ID として保持してください；この厳密なフィールドではエイリアスは有効ではありません。

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. 役割を代表者に割り当てる {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  account role grant \
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
    account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

同じモデルは Rust のクライアントにも利用可能です。ここで `client` は `registrar_account` として署名する `iroha::blocking::Client` です。CLI のフローと同様に、このアカウントがロールの初期所有者となります。3つのアカウント変数はすでに`AccountId`の値として解析されています：

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};
use iroha_executor_data_model::permission::account::CanModifyAccountMetadata;

let role_id: RoleId = "cookbook_metadata_editors".parse()?;
let role = Role::new(role_id.clone(), registrar_account).add_permission(
    CanModifyAccountMetadata {
        account: target_account.clone(),
    },
);

client.submit_all::<InstructionBox>(
    [
        Register::role(role).into(),
        Grant::account_role(role_id, delegate_account).into(),
    ],
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## 確認する {#verify}

ロールによる付与を含む代理人の実効権限を読み取り、次に代理人が書いた正確な値を読み取ってください：

```bash
iroha --config "$CONFIG" --machine account permission list \
  --id "$DELEGATE_ACCOUNT" --all \
  | jq -e --arg account "$TARGET_ACCOUNT" \
    '.items | any(.name == "CanModifyAccountMetadata"
      and .payload.account == $account)'

iroha --config "$CONFIG" account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

代理人の実効権限には `TARGET_ACCOUNT` にスコープされた `CanModifyAccountMetadata` が含まれている必要があり、メタデータの読み取りは `"delegated"` を返す必要があります。Torii は署名付きクエリによるロール一覧の取得を拒否するため、実効権限の一覧が割り当ての確認になります。

## トラブルシューティング {#troubleshooting}

- ロールの登録、編集、または割り当て時の `Not permitted` は、暗号署名者が必要な Taira 認可プリンシパルを持っていないことを意味します。スコープ付きトークンをグローバルなものに置き換えないでください。正確な権限の付与を要求してください。
- ペイロード解析エラーは通常、`account` が `payload` の横に置かれた、エイリアスが I105 ID の代わりに供給された、または JSON の値が二重に引用符で囲まれたことを意味します。
- 手数料の拒否は、そのステップを提出する暗号署名者に属します。マネージャーと代理人には、それぞれの手数料見積もりで示された手数料資産で、個別に資金を提供してください。
- 成功したロールの付与は、そのトークンにエンコードされたスコープを上書きすることはありません。このロールは、権限ペイロードに名前が記載されたアカウントのみを変更できます。
- クリーンアップするには、まず `account role revoke` を実行し、次に `ledger role permission revoke` を実行し、最後に `ledger role unregister` を実行してください。各操作は別々の書き込みで、`--fee-payer authority` を含める必要があります。

## ソースおよび関連文書 {#source-and-related-docs}

- [固定されたソースコードのリビジョンでの役割統合テスト](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/roles.rs)
- [固定されたソースコードのリビジョンでの権限統合テスト](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/permissions.rs)
- [ピン留めされたソースコードのリビジョンにおける組み込みの権限データモデル](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/permission.rs)
- [権限と役割](/ja/blockchain/permissions.md)
- [許可トークンの参照](/ja/reference/permissions.md)
- [メタデータ](./metadata.md)
