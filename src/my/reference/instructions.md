---
translation_locale: my
translation_source: /reference/instructions.md
translation_source_hash: 9ba8e06d10f0896169feddbdad32f4fed7a8d46effa2293c64df578c197c970e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha အထူးညွှန်ကြားချက်များ {#iroha-special-instructions}

လက်ရှိ ဒေတာမော်ဒယ်က ဒီတည်ဆောက်ထားတဲ့ ညွှန်ကြားမှု မိသားစုတွေကို ဖေါ်ပြတယ်။

|ညွှန်ကြားချက်|အမျိုးအစားများ |
| --- | --- |
| [`RegisterBox`](/my/blockchain/instructions.md#un-register) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Role`, `Trigger`, `RegisterPeerWithPop` |
| [`UnregisterBox`](/my/blockchain/instructions.md#un-register) | `Peer`, `Domain`, `Account`, `AssetDefinition`, `Nft`, `Role`, `Trigger` |
| [`MintBox`](/my/blockchain/instructions.md#mint-burn) |ကိန်းဂဏန်း `Asset`, trigger ထပ်ကျော့ခြင်း |
| [`BurnBox`](/my/blockchain/instructions.md#mint-burn) |ကိန်းဂဏန်း `Asset`, trigger ထပ်ကျော့ခြင်း |
| [`TransferBox`](/my/blockchain/instructions.md#transfer) |`Domain`, `AssetDefinition`, နံပါတ်များ `Asset`, `Nft` |
| [`SetKeyValueBox`](/my/blockchain/instructions.md#setkeyvalue-removekeyvalue) |`Domain`, `Account`, `AssetDefinition`, `Nft`, `Trigger` မီတာဒေတာများ |
| [`RemoveKeyValueBox`](/my/blockchain/instructions.md#setkeyvalue-removekeyvalue) |`Domain`, `Account`, `AssetDefinition`, `Nft`, `Trigger` မီတာဒေတာများ |
| [`GrantBox`](/my/blockchain/instructions.md#grant-revoke) | `Permission` (`Grant<Permission, Account>`), `Role` (`Grant<RoleId, Account>`), `RolePermission` (`Grant<Permission, Role>`) |
| [`RevokeBox`](/my/blockchain/instructions.md#grant-revoke) | `Permission` (`Revoke<Permission, Account>`), `Role` (`Revoke<RoleId, Account>`), `RolePermission` (`Revoke<Permission, Role>`) |
| [`SetParameter`](/my/blockchain/instructions.md#setparameter) |Chain parameter ကို update လုပ်ပေးပါ |
| [`ExecuteTrigger`](/my/blockchain/instructions.md#executetrigger) |trigger execution ကို|
| [`Upgrade`](/my/blockchain/instructions.md#other-instructions) |အကောင်အထည်ဖော်သူ အဆင့်မြှင့်တင်ခြင်း |
| [`Log`](/my/blockchain/instructions.md#other-instructions) |အကောင်အထည်ဖော်ရေး မှတ်တမ်းဝင်မှု |
| [`CustomInstruction`](/my/blockchain/instructions.md#other-instructions) | အကောင်အထည်ဖော်သူအတွက် သီးသန့် JSON အသုံးဝင် ဝန်ဆောင်မှု |
| [တိုင်းရင်းသား အရင်းအမြစ်များအတွက် ကန့်သတ်ချက် ](/my/blockchain/escrow.md) | `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, `ResolveEscrowDispute` |
| [အထွေထွေအရင်းအမြစ်ပိတ်ခြင်းများ ](/my/blockchain/escrow.md#generic-asset-locks) |`OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`၊ `ExpireAssetLock` |
| [အမည်မသိ အရင်းအမြစ်အထောက်အထား ](/my/blockchain/escrow.md#anonymous-escrow) | `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, `ResolveAnonymousEscrowDispute` |
| [အက်တမ်မစ် သီးသန့် စာရင်းရှင်းလင်းမှု](/my/blockchain/instructions.md#atomic-private-settlement) | `ActivatePrivateSettlementPoolV1`, `RotatePrivateSettlementPoolPolicyV1`, `FinalizeAtomicPrivateSettlementV1`, `AbortAtomicPrivateSettlementV1` |

နောက်ထပ် Iroha 3 မော်ဂျူးများသည် ညွှန်ကြားချက်စာရင်းမှတစ်ဆင့် ဒိုမင်သတ်မှတ်ထားသော ညွှန်ပြမှုအမျိုးအစားများကို မှတ်ပုံတင်နိုင်သည်။ လက်ရှိအရင်းအမြစ်ပင်မှထုတ်လုပ်သည့် စကေးမားအဆင့် စာရင်းအတွက် [Data Model Schema](./data-model-schema.md) ကိုကြည့်ပါ။

::: details ပြက္ခဒိန်: အခြေခံညွှန်ကြားချက် မိသားစုများ

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
