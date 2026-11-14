---
translation_locale: hy
translation_source: /reference/instructions.md
translation_source_hash: bbd8f9544aa863cd273d1b2089f39aff3d484ee0378fa5bcc7b565795a0671c6
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Iroha Հատուկ հրահանգներ {#iroha-special-instructions}

Ներկա տվյալների մոդելը բացահայտում է այս ներկառուցված հրահանգային ընտանիքները.

|Ուսուցում |Փոփոխություններ |
| --- | --- |
| [`RegisterBox`](/hy/blockchain/instructions.md#un-register) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Role`, `Trigger`, `RegisterPeerWithPop` |
| [`UnregisterBox`](/hy/blockchain/instructions.md#un-register) | `Peer`, `Domain`, `Account`, `AssetDefinition`, `Nft`, `Role`, `Trigger` |
| [`MintBox`](/hy/blockchain/instructions.md#mint-burn) |թվային `Asset`, կրկնումների առաջացման |
| [`BurnBox`](/hy/blockchain/instructions.md#mint-burn) |թվային `Asset`, կրկնումների առաջացման |
| [`TransferBox`](/hy/blockchain/instructions.md#transfer) |`Domain`, `AssetDefinition`, թվային `Asset`, `Nft` |
| [`SetKeyValueBox`](/hy/blockchain/instructions.md#setkeyvalue-removekeyvalue) |`Domain`, `Account`, `AssetDefinition`, `Nft`, `Trigger` մետադատները |
| [`RemoveKeyValueBox`](/hy/blockchain/instructions.md#setkeyvalue-removekeyvalue) |`Domain`, `Account`, `AssetDefinition`, `Nft`, `Trigger` մետադատները |
| [`GrantBox`](/hy/blockchain/instructions.md#grant-revoke) |`Permission` (`Grant<Permission, Account>`), `Role` (`Grant<RoleId, Account>`), `RolePermission` (`Grant<Permission, Role>`) |
| [`RevokeBox`](/hy/blockchain/instructions.md#grant-revoke) |`Permission` (`Revoke<Permission, Account>`), `Role` (`Revoke<RoleId, Account>`), `RolePermission` (`Revoke<Permission, Role>`) |
| [`SetParameter`](/hy/blockchain/instructions.md#setparameter) |շղթայի պարամետրերի թարմացում |
| [`ExecuteTrigger`](/hy/blockchain/instructions.md#executetrigger) |գործարկում |
| [`Upgrade`](/hy/blockchain/instructions.md#other-instructions) |իրականացնող վերանորոգում |
| [`Log`](/hy/blockchain/instructions.md#other-instructions) |իրականացնող օրագրի մուտք |
| [`CustomInstruction`](/hy/blockchain/instructions.md#other-instructions) |իրականացնողին հատուկ JSON շահագործման բեռ |
| [Բնական ակտիվների պահպանումը](/hy/blockchain/escrow.md) | `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, `ResolveEscrowDispute` |
| [Գնացական ակտիվների փակիչներ](/hy/blockchain/escrow.md#generic-asset-locks) |`OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, `ExpireAssetLock` |
| [Ատոմային մասնավոր հաշվարկ](/hy/blockchain/instructions.md#atomic-private-settlement) | `ActivatePrivateSettlementPoolV1`, `RotatePrivateSettlementPoolPolicyV1`, `FinalizeAtomicPrivateSettlementV1`, `AbortAtomicPrivateSettlementV1` |

Iroha 3 լրացուցիչ մոդուլները կարող են գրանցել տիրույթի հատուկ հրահանգների տեսակներ հրահանգների ռեգիստրիի միջոցով: Հանգույցի տրամադրած սխեմայի և այն պահպանելու համար օգտագործվող հրամանի համար տես [Տվյալների մոդելի սխեման](./data-model-schema.md):

::: details Սցենար. Հիմնական ուսուցման ընտանիքներ

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
    OpenConditionalEscrow
    ResolveEscrowDispute
}

InstructionBox --> RegisterBox
InstructionBox --> TransferBox
InstructionBox --> MetadataBoxes
InstructionBox --> NativeEscrowInstructions
```

:::
