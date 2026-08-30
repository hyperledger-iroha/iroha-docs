---
translation_locale: ar
translation_source: /reference/instructions.md
translation_source_hash: 9ba8e06d10f0896169feddbdad32f4fed7a8d46effa2293c64df578c197c970e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha تعليمات خاصة {#iroha-special-instructions}

نموذج البيانات الحالي يكشف عن هذه العائلات التدريبية المدمجة:

|التعليمات |الإختلافات|
| --- | --- |
| [`RegisterBox`](/ar/blockchain/instructions.md#un-register) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Role`, `Trigger`, `RegisterPeerWithPop` |
| [`UnregisterBox`](/ar/blockchain/instructions.md#un-register) | `Peer`, `Domain`, `Account`, `AssetDefinition`, `Nft`, `Role`, `Trigger` |
| [`MintBox`](/ar/blockchain/instructions.md#mint-burn) |الرقمية `Asset` ، تسبب التكرار |
| [`BurnBox`](/ar/blockchain/instructions.md#mint-burn) |الرقمية `Asset` ، تسبب التكرار |
| [`TransferBox`](/ar/blockchain/instructions.md#transfer) |`Domain`، `AssetDefinition`، العدد `Asset`، `Nft` |
| [`SetKeyValueBox`](/ar/blockchain/instructions.md#setkeyvalue-removekeyvalue) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Trigger` البيانات الأساسية |
| [`RemoveKeyValueBox`](/ar/blockchain/instructions.md#setkeyvalue-removekeyvalue) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Trigger` البيانات الأساسية |
| [`GrantBox`](/ar/blockchain/instructions.md#grant-revoke) | `Permission` (`Grant<Permission, Account>`), `Role` (`Grant<RoleId, Account>`), `RolePermission` (`Grant<Permission, Role>`) |
| [`RevokeBox`](/ar/blockchain/instructions.md#grant-revoke) | `Permission` (`Revoke<Permission, Account>`), `Role` (`Revoke<RoleId, Account>`), `RolePermission` (`Revoke<Permission, Role>`) |
| [`SetParameter`](/ar/blockchain/instructions.md#setparameter) |تحديث معايير سلسلة |
| [`ExecuteTrigger`](/ar/blockchain/instructions.md#executetrigger) |التنفيذ المحفز|
| [`Upgrade`](/ar/blockchain/instructions.md#other-instructions) |تحديث المنفذ |
| [`Log`](/ar/blockchain/instructions.md#other-instructions) |إدخال سجل التنفيذ |
| [`CustomInstruction`](/ar/blockchain/instructions.md#other-instructions) |الحمل المفيد المحدد للجهاز التنفيذي JSON |
| [الاحتفاظ بالأصول الأصلية ](/ar/blockchain/escrow.md) | `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, `ResolveEscrowDispute` |
| [مقفلات الأصول العامة ](/ar/blockchain/escrow.md#generic-asset-locks) |`OpenAssetLock`، `DrawdownAssetLock`، `CancelAssetLock`، `ExpireAssetLock` |
| [الاحتفاظ بالأصول المجهولة ](/ar/blockchain/escrow.md#anonymous-escrow) | `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, `ResolveAnonymousEscrowDispute` |
| [التسوية الخاصة الذرية](/ar/blockchain/instructions.md#atomic-private-settlement) | `ActivatePrivateSettlementPoolV1`, `RotatePrivateSettlementPoolPolicyV1`, `FinalizeAtomicPrivateSettlementV1`, `AbortAtomicPrivateSettlementV1` |

يمكن أن تسجل وحدات Iroha 3 إضافية أنواع تعليمات محددة للمجال من خلال سجل التعليمات. للحصول على قائمة مستوى الخطة التي تم إنشاؤها من شجرة المصدر الحالية ، انظر [نموذج البيانات Schema](./data-model-schema.md).

::: details الرسم البياني: التعليم الأساسي للعائلات

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
