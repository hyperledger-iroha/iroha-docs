---
translation_locale: dz
translation_source: /reference/instructions.md
translation_source_hash: 9999816502505026fb35d2ddaf4033f54768be697ca5b03550e1cf5949ada36c
translation_status: machine-validated
translation_engine: human-reviewed
---
# Iroha ཁྱད་ཆོས་ཀྱི་བསླབ་བྱ་ཚུ་ {#iroha-special-instructions}

ད་ལྟོའི་གནད་སྡུད་དཔེ་ཚད་འདི་གིས་ ནང་འཁོད་བཀོད་རྒྱ་བཟའ་ཚང་འདི་ཚུ་ གསལ་སྟོན་འབདཝ་ཨིན།

| བཀའ་སློབ། | འགྱུར་ཅན་ཚུ་ |
| --- | --- |
| [`RegisterBox`](/dz/blockchain/instructions.md#un-register) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Role`, `Trigger`, `RegisterPeerWithPop` |
| [`UnregisterBox`](/dz/blockchain/instructions.md#un-register) | `Peer`, `Domain`, `Account`, `AssetDefinition`, `Nft`, `Role`, `Trigger` |
| [`MintBox`](/dz/blockchain/instructions.md#mint-burn) |ཨང་གྲངས་ `Asset`, སླར་ལོག་འབད་ནི་ འགོ་བཙུགས་ |
| [`BurnBox`](/dz/blockchain/instructions.md#mint-burn) |ཨང་གྲངས་ `Asset`, སླར་ལོག་འབད་ནི་ འགོ་བཙུགས་ |
| [`TransferBox`](/dz/blockchain/instructions.md#transfer) |`Domain`, `AssetDefinition`, གྱངས་ཁ་ཐོ་བཀོད་ `Asset`, `Nft`|
| [`SetKeyValueBox`](/dz/blockchain/instructions.md#setkeyvalue-removekeyvalue) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Trigger` ཟུར་གནས་གནད་སྡུད |
| [`RemoveKeyValueBox`](/dz/blockchain/instructions.md#setkeyvalue-removekeyvalue) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Trigger` ཟུར་གནས་གནད་སྡུད |
| [`GrantBox`](/dz/blockchain/instructions.md#grant-revoke) | `Permission` (`Grant<Permission, Account>`), `Role` (`Grant<RoleId, Account>`), `RolePermission` (`Grant<Permission, Role>`) |
| [`RevokeBox`](/dz/blockchain/instructions.md#grant-revoke) | `Permission` (`Revoke<Permission, Account>`), `Role` (`Revoke<RoleId, Account>`), `RolePermission` (`Revoke<Permission, Role>`) |
| [`SetParameter`](/dz/blockchain/instructions.md#setparameter) |ལྕགས་ཀྱུའི་བརྡ་དོན་ཚུ་ ད་ལྟོའི་བར་ན་ཡང་ |
| [`ExecuteTrigger`](/dz/blockchain/instructions.md#executetrigger) |འགོ་བཙུགས་ཐངས་ |
| [`Upgrade`](/dz/blockchain/instructions.md#other-instructions) |ལག་ལེན་པ་ཡར་དྲག་གཏང་ནི་ |
| [`Log`](/dz/blockchain/instructions.md#other-instructions) | ལག་བསྟར་པའི་དྲན་ཐོའི་ནང་ཐོ་བཀོད་ |
| [`CustomInstruction`](/dz/blockchain/instructions.md#other-instructions) |ལག་བསྟར་སྤྱོད་འབད་མི་ལུ་ ཁྱད་དུ་འཕགས་པའི་ JSON ནང་དོན་གནད་སྡུད་གྱི་འགན་ཁུར་ |
| [རང་བཞིན་གྱི་རྒྱུ་དངོས་གི་གཏའ་མ་ ](/dz/blockchain/escrow.md) | `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, `ResolveEscrowDispute` |
| [སྤྱིར་བཏང་གི་ རྒྱུ་དངོས་ཀྱི་བཀག་སྡོམ་ཚུ་ ](/dz/blockchain/escrow.md#generic-asset-locks) |`OpenAssetLock`,`DrawdownAssetLock`, `CancelAssetLock`, `ExpireAssetLock` |
| [དངུལ་རྐྱང་གི་མིང་མ་ཤེསཔ་](/dz/blockchain/escrow.md#anonymous-escrow) | `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, `ResolveAnonymousEscrowDispute` |
| [རང་རྐྱང་གི་བར་ནའི་མཐུན་རྐྱེན་ཚུ་](/dz/blockchain/instructions.md#atomic-private-settlement) | `ActivatePrivateSettlementPoolV1`, `RotatePrivateSettlementPoolPolicyV1`, `FinalizeAtomicPrivateSettlementV1`, `AbortAtomicPrivateSettlementV1` |

Iroha 3 ཚད་གཞིའི་ཆ་ཤས་གཞན་ཚུ་གིས་ བརྡ་བཀོད་ཡིག་ཚང་ནང་ལུ་ མངའ་ཁོངས་དམིགས་བསལ བཀོད་རྒྱ དབྱེ་བ ཐོ་བཀོད་འབད་ཚུགས། མཐུད་མཚམས གིས་བྱིན་མི་ གཞི་བཀོད དང་ དེ་ཉར་ཚགས་འབད་ནིའི་ བཀའ་རྒྱ གི་དོན་ལུ་ [གནས་སྡུད་དཔེ་རྣམ་སྒྲོམ་གཞི](./data-model-schema.md) ལུ་བལྟ་དགོ།

::: details རྩིག་ཁྲམ་: བཟའ་ཚང་ཚུ་གི་དོན་ལུ་ གཞི་རྟེན་བསླབ་བྱ་

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
