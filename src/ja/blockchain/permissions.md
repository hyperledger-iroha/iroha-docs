---
translation_locale: ja
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 許可 {#permissions}

口座にはブロックチェーン上の様々な行動,例えば資産を鋳造したり燃やしたりするための許可トークンが必要です.

公開区块链とプライベート区块链はユーザーに与えられた許可の点で違いがあります.公共区块链では,ほとんどのアカウントには同じ一連の許可があります.民間ブロックチェーンでは,関連する許可が明示的に与えられていない限り,ほとんどのアカウントは与えられた権限の外に何もできないと仮定されます.

何かを実行する許可を持つことは,アカウントに対応する `Permission` を持つことを意味します.許可は直接または [`Role`](#permission-groups-roles)を通じて授与できます.これは一連の許可をグループ化します.許可は `Grant`指示で授与されます.`Revoke`の指示で削除する.

## 許可トークン {#permission-tokens}

許可トークンは,アクティブ実行者が定義したタイプされたオブジェクトである. `CanManagePeers`など,一部のトークンはグローバルであり,他のものは,アカウント,資産,資産定義,ドメイン, NFT,役割,またはトリガーなどの特定のレジャーオブジェクトに限定されています.

以下は,さまざまな許可トークンに使用されるパラメータのいくつかの例です:

- 特定のアカウントのメタデータを変更する許可を与えるトークンには `account`フィールドがあります:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- 特定の資産定義のために資産転送を許可するトークンには `asset_definition`フィールドがある.

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- `CanManagePeers`のようなグローバルトークンには,フィールドがない.

  ```json
  {}
  ```

### 初期設定の許可トークン {#pre-configured-permission-tokens}

[Reference](/ja/reference/permissions)章では,事前に設定された許可トークンのリストを見つけることができます.

## 許可のグループ (役割) {#permission-groups-roles}

許可の集合はロールと呼ばれる.許可トークンと同様に, `Grant` の指示を使用して役割が与えられ, `Revoke` の指示を使用して撤回される可能性があります.

口座に役割を与えられる前に,その役割は最初に登録されるべきである.

役割は,複数のアカウントが同じ許可のセットを受け取る場合有用である.役割を一度登録し,その役割に権限を与え,その後個々のアカウントに役割を与えるか撤回する.

### 新しい役割を登録する {#register-a-new-role}

マウスのアカウントの [メタデータ](/ja/blockchain/metadata.md)へのアクセスを許可する新しい役割を登録しましょう:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### 役を任せ {#grant-a-role}

役が登録された後 マウスはアリスに授けます

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## 許可認証器 {#permission-validators}

許可は存在するため,必要な許可トークンを持つアカウントのみが保護されたアクションを実行できます.デフォルト実行者は命令,クエリ,表現の実行中に許可をチェックします.

デフォルトの検証器表面は,レジャーエリアによってグループ化されます.

- 同級管理
- ドメインとアカウント
- 資産, NFTs,および保証書
- トリガー
- 役割と許可
- SORA/Nexus モジュールの実行器/実行時間,証明,橋梁

正確なトークンリストは [Permission Tokens参照](/ja/reference/permissions.md)でソースバックアップされています.

### 実行時間検証機 {#runtime-validators}

許可のチェックはアクティブエグゼクタによって実行されます.デフォルトエグゼッターは内蔵された権限認証器とトークン定義を提供します.ネットワークが使用する実行プログラムをアップグレードすることによってポリシーを変更できます.

検証者は検証判決を返します.検証者は操作を許可したり,理由をもって拒否したり,その検証者の範囲外にある場合も省略することができます.選択された裁判官は指示や質問または表現が進められるかどうかを決定するためにそれらの判断を組み合わせます.

## サポートされた質問 {#supported-queries}

許可トークンとロールを問い合わせることができます.

役割に関する質問:

- [`FindRoles`](/ja/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/ja/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/ja/reference/queries.md#accounts-and-permissions)

許可トークンに関する質問:

- [`FindPermissionsByAccountId`](/ja/reference/queries.md#accounts-and-permissions)
