---
translation_locale: kk
translation_source: /reference/instructions.md
translation_source_hash: bbd8f9544aa863cd273d1b2089f39aff3d484ee0378fa5bcc7b565795a0671c6
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Iroha Нұсқаулық операциялары {#iroha-special-instructions}

Ағымдағы деректер моделі осы кірістірілген нұсқаулық отбасыларын көрсетеді:

|Нұсқаулық|Варианттар|
| --- | --- |
| [`RegisterBox`](/kk/blockchain/instructions.md#un-register) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Role`, `Trigger`, `RegisterPeerWithPop` |
| [`UnregisterBox`](/kk/blockchain/instructions.md#un-register) | `Peer`, `Domain`, `Account`, `AssetDefinition`, `Nft`, `Role`, `Trigger` |
| [`MintBox`](/kk/blockchain/instructions.md#mint-burn) |сандық `Asset`, қайталануларды іске қосу|
| [`BurnBox`](/kk/blockchain/instructions.md#mint-burn) |сандық `Asset`, қайталануларды іске қосу|
| [`TransferBox`](/kk/blockchain/instructions.md#transfer) | `Domain`, `AssetDefinition`, сандық `Asset`, `Nft` |
| [`SetKeyValueBox`](/kk/blockchain/instructions.md#setkeyvalue-removekeyvalue) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Trigger` метадеректер|
| [`RemoveKeyValueBox`](/kk/blockchain/instructions.md#setkeyvalue-removekeyvalue) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Trigger` метадеректер|
| [`GrantBox`](/kk/blockchain/instructions.md#grant-revoke) | `Permission` (`Grant<Permission, Account>`), `Role` (`Grant<RoleId, Account>`), `RolePermission` (`Grant<Permission, Role>`) |
| [`RevokeBox`](/kk/blockchain/instructions.md#grant-revoke) | `Permission` (`Revoke<Permission, Account>`), `Role` (`Revoke<RoleId, Account>`), `RolePermission` (`Revoke<Permission, Role>`) |
| [`SetParameter`](/kk/blockchain/instructions.md#setparameter) |тізбек параметрін жаңарту|
| [`ExecuteTrigger`](/kk/blockchain/instructions.md#executetrigger) |орындауды іске қосу|
| [`Upgrade`](/kk/blockchain/instructions.md#other-instructions) |орындаушыны жаңарту|
| [`Log`](/kk/blockchain/instructions.md#other-instructions) | орындаушының журнал жазбасы |
| [`CustomInstruction`](/kk/blockchain/instructions.md#other-instructions) |орындаушыға-арналған JSON жүктеме|
| [Табиғи активті эскроу](/kk/blockchain/escrow.md) | `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, `ResolveEscrowDispute` |
| [Жалпы активтерді қамау](/kk/blockchain/escrow.md#generic-asset-locks) | `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, `ExpireAssetLock` |
| [Атомдық жеке қаржылық транзакцияны есептеу](/kk/blockchain/instructions.md#atomic-private-settlement) | `ActivatePrivateSettlementPoolV1`, `RotatePrivateSettlementPoolPolicyV1`, `FinalizeAtomicPrivateSettlementV1`, `AbortAtomicPrivateSettlementV1` |

Қосымша Iroha 3 модульдер нұсқаулық тіркеу арқылы доменге тән нұсқаулық түрлерін тіркей алады. Түйінді-өкілетті схема және оны ұстайтын пәрмен үшін [Деректер моделі схемасы](./data-model-schema.md) қараңыз.

::: details Диаграмма: Негізгі нұсқаулық отбасылары

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
