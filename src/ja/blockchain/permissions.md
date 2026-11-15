---
translation_locale: ja
translation_source: /blockchain/permissions.md
translation_source_hash: 7993d14839218fd3394d52dbcce264bffea32394f54e25dd261cd060c54f1fe1
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# 権限 {#permissions}

アカウントは、ブロックチェーン上でさまざまなアクションを行うための許可トークンを必要とします。例えば、資産を発行したり破壊したりする場合です。

ユーザーに付与される権限の点で、パブリックブロックチェーンとプライベートブロックチェーンには違いがあります。パブリックブロックチェーンでは、ほとんどのアカウントが同じ権限を持っています。プライベートブロックチェーンでは、ほとんどのアカウントは、明示的に関連する権限が付与されない限り、自分に付与された認可権限の範囲外で何かを行うことはできないと想定されます。

何かをする権限を持っているということは、そのアカウントが対応する権限を持っていることを意味します `Permission`. 権限は直接付与することも、経由して付与することもできます [`Role`](#permission-groups-roles), 一連の権限をグループ化するものです。権限は次のもので付与されます `Grant` 指示。権限と役割は期限切れになりません；それらを削除するには `Revoke` 指示。

## 許可トークン {#permission-tokens}

権限トークンは、アクティブな実行者によって定義される型付きオブジェクトです。いくつかのトークンはグローバルであり、例えば `CanManagePeers` がそうです。一方、他のトークンは特定のブロックチェーン台帳オブジェクトにスコープされており、例えばアカウント、資産、資産定義、ドメイン、NFT、ロール、またはトリガーがあります。

以下は、さまざまな権限トークンに使用されるパラメータのいくつかの例です。

- 特定のアカウントのメタデータを変更する権限を付与するトークンには、`account` フィールドが含まれます:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- 特定の資産定義の資産を転送する権限を付与するトークンには、`asset_definition` フィールドが含まれます:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- グローバルトークンである `CanManagePeers` にはフィールドがありません:

  ```json
  {}
  ```

### 事前設定された許可トークン {#pre-configured-permission-tokens}

事前に設定された権限トークンの一覧は、[参照](/ja/reference/permissions)章で確認できます。

## 権限グループ（役割） {#permission-groups-roles}

権限のセットはロールと呼ばれます。権限トークンと同様に、ロールは`Grant`命令を使用して付与され、`Revoke`命令を使用して取り消すことができます。

アカウントに役割を付与する前に、まずその役割を登録する必要があります。

複数のアカウントが同じ権限セットを受け取る必要がある場合、ロールは便利です。ロールを一度登録し、ロールに権限を付与してから、個々のアカウントにロールを付与または削除します。

### 新しい役割を登録する {#register-a-new-role}

新しい役割を登録しましょう。この役割が付与されると、別のアカウントが Mouse のアカウント内の [メタデータ](/ja/blockchain/metadata.md) にアクセスできるようになります。

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### 役割を付与する {#grant-a-role}

役割が登録された後、Mouse はそれを Alice に付与できます：

```rust
let grant_role = Grant::account_role(role_id, alice_id);
// `network_id` is the target network's `NetworkId`; the fee intent is bound
// into the signature (use the intent returned by a fee quote).
let grant_role_tx = TransactionBuilder::new(
    network_id,
    mouse_id,
    FeePaymentIntent::authority(Vec::new(), None),
)
.with_instructions([grant_role])
.sign(&mouse_private_key);
```

## 権限バリデーター {#permission-validators}

アクセス許可は、必要な権限トークンを持つアカウントだけが保護された操作を実行できるように存在します。デフォルトの実行者は、トランザクションと命令の実行中、およびクエリの検証時にアクセス許可を確認します。

デフォルトのバリデーターのサーフェスは、ブロックチェーン台帳のエリアごとにグループ化されています：

- ネットワークピア管理
- ドメインとアカウント
- 資産、NFTs、およびエスクロー
- トリガー
- 役割と権限
- エグゼキューター／ランタイム、証明、ブリッジ、SORA Nexus モジュール

正確なトークンリストは[許可トークンの参照](/ja/reference/permissions.md)でソースに基づいています。

### ソフトウェアランタイムバリデーター {#runtime-validators}

権限チェックはアクティブな実行者によって施行されます。デフォルトの実行者は組み込みの権限バリデータとトークン定義を提供し、ネットワークは使用する実行者をアップグレードすることでポリシーを変更できます。

実行者は操作を許可するか、`ValidationFail` の理由を付けて拒否します。拒否された命令はそのトランザクションを拒否させ、拒否されたクエリは呼び出し元にエラーを返します。

## サポートされているクエリ {#supported-queries}

権限トークンと役割は照会できます。

役割に関する問い合わせ:

- [`FindRoles`](/ja/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/ja/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/ja/reference/queries.md#accounts-and-permissions)

許可トークンに関するクエリ:

- [`FindPermissionsByAccountId`](/ja/reference/queries.md#accounts-and-permissions)
