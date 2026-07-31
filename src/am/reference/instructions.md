---
translation_locale: am
translation_source: /reference/instructions.md
translation_source_hash: 8dc894a05141040826067dc483319f213b007648f32354bb36f899259db9c5ac
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha ልዩ መመሪያዎች {#iroha-special-instructions}

የአሁኑ የውሂብ ሞዴል እነዚህን ውስጣዊ የመማሪያ ቤተሰቦች ያጋልጣል:

| መመሪያ | የተለያዩ ዓይነቶች |
| --- | --- |
| [`RegisterBox`](/am/blockchain/instructions.md#un-register) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Role`, `Trigger`, `RegisterPeerWithPop` |
| [`UnregisterBox`](/am/blockchain/instructions.md#un-register) | `Peer`, `Domain`, `Account`, `AssetDefinition`, `Nft`, `Role`, `Trigger` |
| [`MintBox`](/am/blockchain/instructions.md#mint-burn) | ቁጥር `Asset`, የመነሻ መድገም |
| [`BurnBox`](/am/blockchain/instructions.md#mint-burn) | ቁጥር `Asset`, የመነሻ መድገም |
| [`TransferBox`](/am/blockchain/instructions.md#transfer) | `Domain`, `AssetDefinition`, ቁጥር `Asset`, `Nft` |
| [`SetKeyValueBox`](/am/blockchain/instructions.md#setkeyvalue-removekeyvalue) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Trigger` ሜታዳታ |
| [`RemoveKeyValueBox`](/am/blockchain/instructions.md#setkeyvalue-removekeyvalue) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Trigger` ሜታዳታ |
| [`GrantBox`](/am/blockchain/instructions.md#grant-revoke) | የመለያ ፈቃድ፣ የሂሳብ ሚና፣ የመለያ ፈቃድ |
| [`RevokeBox`](/am/blockchain/instructions.md#grant-revoke) | ከሂሳብ ፈቃድ፣ ከሂሳብ ድርሻ፣ ከድርሻ ፈቃድ |
| [`SetParameter`](/am/blockchain/instructions.md#setparameter) | ሰንሰለት መለኪያዎች ዝመና |
| [`ExecuteTrigger`](/am/blockchain/instructions.md#executetrigger) | ማስነሻ አፈጻጸም |
| [`Upgrade`](/am/blockchain/instructions.md#other-instructions) | አስፈፃሚ ማሻሻያ |
| [`Log`](/am/blockchain/instructions.md#other-instructions) | አስፈፃሚ መዝገብ መግቢያ |
| [`CustomInstruction`](/am/blockchain/instructions.md#other-instructions) | ለሥራ አስፈፃሚው የተወሰነ JSON የዋጋ ጭነት |
| [የአገሬው ነዋሪ ንብረት ማስከበሪያ](/am/blockchain/escrow.md) | `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, `ResolveEscrowDispute` |
| [አጠቃላይ የንብረት መቆለፊያዎች](/am/blockchain/escrow.md#generic-asset-locks) | `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, `ExpireAssetLock` |
| [የማይታወቁ ንብረቶች ዋስትና](/am/blockchain/escrow.md#anonymous-escrow) | `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, `ResolveAnonymousEscrowDispute` |

ተጨማሪ Iroha 3 ሞጁሎች ለጎራ የተወሰኑ የትምህርት ዓይነቶችን መመዝገብ ይችላሉ
በሂደቱ ላይ የተቀመጠውን የሥርዓት ደረጃ ዝርዝር
የአሁኑ ምንጭ ዛፍ፣ ተመልከት [የመረጃ ሞዴል መርሃግብር](./data-model-schema.md).

::: details ሰንጠረዥ፦ መሠረታዊ መመሪያ ቤተሰቦች

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
