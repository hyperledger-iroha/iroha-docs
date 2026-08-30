---
translation_locale: ja
translation_source: /reference/instructions.md
translation_source_hash: 9ba8e06d10f0896169feddbdad32f4fed7a8d46effa2293c64df578c197c970e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 特別指示 {#iroha-special-instructions}

現在のデータモデルは,これらの内蔵の指示ファミリーを暴露しています.

|指示|変異型|
| --- | --- |
| [`RegisterBox`](/ja/blockchain/instructions.md#un-register) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Role`, `Trigger`, `RegisterPeerWithPop` |
| [`UnregisterBox`](/ja/blockchain/instructions.md#un-register) | `Peer`, `Domain`, `Account`, `AssetDefinition`, `Nft`, `Role`, `Trigger` |
| [`MintBox`](/ja/blockchain/instructions.md#mint-burn) |番号 `Asset`,触発重複|
| [`BurnBox`](/ja/blockchain/instructions.md#mint-burn) |番号 `Asset`,触発重複|
| [`TransferBox`](/ja/blockchain/instructions.md#transfer) |`Domain`, `AssetDefinition`,数値 `Asset`, `Nft` |
| [`SetKeyValueBox`](/ja/blockchain/instructions.md#setkeyvalue-removekeyvalue) |`Domain`,`Account`, `AssetDefinition`, `Nft`, `Trigger` メタデータ |
| [`RemoveKeyValueBox`](/ja/blockchain/instructions.md#setkeyvalue-removekeyvalue) |`Domain`,`Account`, `AssetDefinition`, `Nft`, `Trigger` メタデータ |
| [`GrantBox`](/ja/blockchain/instructions.md#grant-revoke) | `Permission` (`Grant<Permission, Account>`), `Role` (`Grant<RoleId, Account>`), `RolePermission` (`Grant<Permission, Role>`) |
| [`RevokeBox`](/ja/blockchain/instructions.md#grant-revoke) | `Permission` (`Revoke<Permission, Account>`), `Role` (`Revoke<RoleId, Account>`), `RolePermission` (`Revoke<Permission, Role>`) |
| [`SetParameter`](/ja/blockchain/instructions.md#setparameter) |チェーンパラメータの更新|
| [`ExecuteTrigger`](/ja/blockchain/instructions.md#executetrigger) |実行を誘発する|
| [`Upgrade`](/ja/blockchain/instructions.md#other-instructions) |実行器のアップグレード|
| [`Log`](/ja/blockchain/instructions.md#other-instructions) |執行者ログ入力|
| [`CustomInstruction`](/ja/blockchain/instructions.md#other-instructions) |JSON 実行業者専用用荷物|
| [国産資産のエスクロー](/ja/blockchain/escrow.md) | `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, `ResolveEscrowDispute` |
| [一般的な資産ロック](/ja/blockchain/escrow.md#generic-asset-locks) |`OpenAssetLock`, `DrawdownAssetLock`,`CancelAssetLock`, `ExpireAssetLock` |
| [匿名資産保証人](/ja/blockchain/escrow.md#anonymous-escrow) | `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, `ResolveAnonymousEscrowDispute` |
| [アトミック・プライベート決済](/ja/blockchain/instructions.md#atomic-private-settlement) | `ActivatePrivateSettlementPoolV1`, `RotatePrivateSettlementPoolPolicyV1`, `FinalizeAtomicPrivateSettlementV1`, `AbortAtomicPrivateSettlementV1` |

追加の Iroha 3 モジュールは,指示レジストリを通じてドメイン特定の命令タイプを登録することができる.現在のソースツリーから生成されたスケーマレベルリストについては, [データモデルスケーマ](./data-model-schema.md)を参照してください.

::: details 図: 家庭 の 主要 教訓

```mermaid
classDiagram
direction LR

class InstructionBox {
    RegisterBox
    UnregisterBox
    MintBox
    BurnBox
    TransferBox
    SetKeyValueBox
    RemoveKeyValueBox
    GrantBox
    RevokeBox
    SetParameter
    ExecuteTrigger
    Upgrade
    Log
    CustomInstruction
    NativeEscrowInstructions
}

class RegisterBox {
    Domain
    Account
    AssetDefinition
    Nft
    Role
    Trigger
    RegisterPeerWithPop
}

class TransferBox {
    Domain
    AssetDefinition
    Asset
    Nft
}

class MetadataBoxes {
    Domain
    Account
    AssetDefinition
    Nft
    Trigger
}

class NativeEscrowInstructions {
    OpenAssetEscrow
    OpenAssetLock
    OpenAnonymousAssetEscrow
    ResolveEscrowDispute
}

InstructionBox --> RegisterBox
InstructionBox --> TransferBox
InstructionBox --> MetadataBoxes
InstructionBox --> NativeEscrowInstructions
```

:::
