---
translation_locale: ur
translation_source: /reference/instructions.md
translation_source_hash: 8dc894a05141040826067dc483319f213b007648f32354bb36f899259db9c5ac
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha خصوصی ہدایات {#iroha-special-instructions}

موجودہ ڈیٹا ماڈل ان بلٹ میں ہدایات کے خاندانوں کو بے نقاب کرتا ہے:

|تعلیم |متغیرات |
| --- | --- |
| [`RegisterBox`](/ur/blockchain/instructions.md#un-register) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Role`, `Trigger`, `RegisterPeerWithPop` |
| [`UnregisterBox`](/ur/blockchain/instructions.md#un-register) | `Peer`, `Domain`, `Account`, `AssetDefinition`, `Nft`, `Role`, `Trigger` |
| [`MintBox`](/ur/blockchain/instructions.md#mint-burn) |عددی `Asset` ، ٹرگر تکرار |
| [`BurnBox`](/ur/blockchain/instructions.md#mint-burn) |عددی `Asset` ، ٹرگر تکرار |
| [`TransferBox`](/ur/blockchain/instructions.md#transfer) |`Domain` ، `AssetDefinition`، عددی طور پر `Asset`، `Nft`|
| [`SetKeyValueBox`](/ur/blockchain/instructions.md#setkeyvalue-removekeyvalue) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Trigger` میٹا ڈیٹا |
| [`RemoveKeyValueBox`](/ur/blockchain/instructions.md#setkeyvalue-removekeyvalue) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Trigger` میٹا ڈیٹا |
| [`GrantBox`](/ur/blockchain/instructions.md#grant-revoke) |اکاؤنٹنگ کا اجازت نامہ، اکاؤنٹ میں کردار، کردار میں اجازت نامہ |
| [`RevokeBox`](/ur/blockchain/instructions.md#grant-revoke) |اکاؤنٹ سے اجازت، اکاؤنٹ سے کردار، کردار سے اجازت |
| [`SetParameter`](/ur/blockchain/instructions.md#setparameter) |سلسلہ پیرامیٹر اپ ڈیٹ |
| [`ExecuteTrigger`](/ur/blockchain/instructions.md#executetrigger) |عملدرآمد کو متحرک کریں |
| [`Upgrade`](/ur/blockchain/instructions.md#other-instructions) |عملدرآمد اپ گریڈ |
| [`Log`](/ur/blockchain/instructions.md#other-instructions) |عملدرآمد لاگ اندراج |
| [`CustomInstruction`](/ur/blockchain/instructions.md#other-instructions) |عملدرآمد کنندہ کے لئے مخصوص JSON مفید بوجھ |
| [مقامی اثاثہ جات کی ضمانت ](/ur/blockchain/escrow.md) | `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, `ResolveEscrowDispute` |
| [عام اثاثوں کے تالے](/ur/blockchain/escrow.md#generic-asset-locks) |`OpenAssetLock` ، `DrawdownAssetLock`، `CancelAssetLock`، `ExpireAssetLock`|
| [گمنام اثاثوں کا ضامن](/ur/blockchain/escrow.md#anonymous-escrow) | `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, `ResolveAnonymousEscrowDispute` |

اضافی Iroha 3 ماڈیول ڈومین مخصوص ہدایات کی اقسام کو ہدایات کے رجسٹری کے ذریعے درج کرسکتے ہیں۔ موجودہ ماخذ درخت سے پیدا کردہ شیما سطح کی فہرست کے لئے ، دیکھیں [ ڈیٹا ماڈل اسکیم](./data-model-schema.md)۔

::: details خاکہ: بنیادی ہدایات خاندان

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
