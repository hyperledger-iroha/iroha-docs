---
translation_locale: am
translation_source: /reference/instructions.md
translation_source_hash: bbd8f9544aa863cd273d1b2089f39aff3d484ee0378fa5bcc7b565795a0671c6
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Iroha የመመሪያ ክዋኔዎች {#iroha-special-instructions}

አሁን ያለው የውሂብ ሞዴል እነዚህን አብሮገነብ የማስተማሪያ ቤተሰቦች ያጋልጣል -

|መመሪያ|ተለዋጮች|
| --- | --- |
| [`RegisterBox`](/am/blockchain/instructions.md#un-register) |`Domain`፣ `Account`፣ `AssetDefinition`፣ `Nft`፣ `Role`፣ `Trigger`፣ `RegisterPeerWithPop`|
| [`UnregisterBox`](/am/blockchain/instructions.md#un-register) |`Peer`፣ `Domain`፣ `Account`፣ `AssetDefinition`፣ `Nft`፣ `Role`፣ `Trigger`|
| [`MintBox`](/am/blockchain/instructions.md#mint-burn) |ቁጥር `Asset`፣ ድግግሞሽ ቀስቅሴ|
| [`BurnBox`](/am/blockchain/instructions.md#mint-burn) |ቁጥር `Asset`፣ ድግግሞሽ ቀስቅሴ|
| [`TransferBox`](/am/blockchain/instructions.md#transfer) |`Domain`፣ `AssetDefinition`፣ ቁጥር `Asset`፣ `Nft`|
| [`SetKeyValueBox`](/am/blockchain/instructions.md#setkeyvalue-removekeyvalue) |`Domain`፣ `Account`፣ `AssetDefinition`፣ `Nft`፣ `Trigger` ሜታዳታ|
| [`RemoveKeyValueBox`](/am/blockchain/instructions.md#setkeyvalue-removekeyvalue) |`Domain`፣ `Account`፣ `AssetDefinition`፣ `Nft`፣ `Trigger` ሜታዳታ|
| [`GrantBox`](/am/blockchain/instructions.md#grant-revoke) |`Permission` (`Grant<Permission, Account>`)፣ `Role` (`Grant<RoleId, Account>`)፣ `RolePermission` (`Grant<Permission, Role>`)|
| [`RevokeBox`](/am/blockchain/instructions.md#grant-revoke) |`Permission` (`Revoke<Permission, Account>`)፣ `Role` (`Revoke<RoleId, Account>`)፣ `RolePermission` (`Revoke<Permission, Role>`)|
| [`SetParameter`](/am/blockchain/instructions.md#setparameter) |ሰንሰለት መለኪያ ዝመና|
| [`ExecuteTrigger`](/am/blockchain/instructions.md#executetrigger) |ቀስቅሴ አፈፃፀም|
| [`Upgrade`](/am/blockchain/instructions.md#other-instructions) |አስፈፃሚ ማሻሻል|
| [`Log`](/am/blockchain/instructions.md#other-instructions) |አስፈፃሚ ምዝግብ ማስታወሻ|
| [`CustomInstruction`](/am/blockchain/instructions.md#other-instructions) |አስፈፃሚ-ተኮር JSON ጭነት|
|[ቤተኛ የንብረት escrow](/am/blockchain/escrow.md)|`OpenAssetEscrow`፣ `AcceptAssetEscrow`፣ `MarkEscrowPaymentSent`፣ `ReleaseAssetEscrow`፣ `CancelAssetEscrow`፣ `OpenEscrowDispute`፣ `ResolveEscrowDispute`|
|[አጠቃላይ የንብረት መቆለፊያዎች](/am/blockchain/escrow.md#generic-asset-locks)|`OpenAssetLock`፣ `DrawdownAssetLock`፣ `CancelAssetLock`፣ `ExpireAssetLock`|
|[የአቶሚክ የግል የፋይናንስ ግብይት ስምምነት](/am/blockchain/instructions.md#atomic-private-settlement)|`ActivatePrivateSettlementPoolV1`፣ `RotatePrivateSettlementPoolPolicyV1`፣ `FinalizeAtomicPrivateSettlementV1`፣ `AbortAtomicPrivateSettlementV1`|

ተጨማሪ Iroha 3 ሞጁሎች ጎራ-ተኮር የመመሪያ ዓይነቶችን በመመሪያው መዝገብ በኩል ሊመዘግቡ ይችላሉ። ለኖድ ስልጣን ያለው መርሃግብር እና እሱን ለሚይዘው ትእዛዝ፣ [የውሂብ ሞዴል ንድፍ](./data-model-schema.md) ይመልከቱ።

::: details ሥዕላዊ መግለጫ ዋና ትምህርት ቤተሰቦች

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
