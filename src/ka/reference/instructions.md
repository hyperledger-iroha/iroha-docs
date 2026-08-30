---
translation_locale: ka
translation_source: /reference/instructions.md
translation_source_hash: 9ba8e06d10f0896169feddbdad32f4fed7a8d46effa2293c64df578c197c970e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha სპეციალური ინსტრუქციები {#iroha-special-instructions}

ამჟამინდელი მონაცემთა მოდელი ასახავს ამ ჩაშენებულ ინსტრუქციის ოჯახებს:

|ინსტრუქცია |ვარიანტები |
| --- | --- |
| [`RegisterBox`](/ka/blockchain/instructions.md#un-register) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Role`, `Trigger`, `RegisterPeerWithPop` |
| [`UnregisterBox`](/ka/blockchain/instructions.md#un-register) | `Peer`, `Domain`, `Account`, `AssetDefinition`, `Nft`, `Role`, `Trigger` |
| [`MintBox`](/ka/blockchain/instructions.md#mint-burn) |ციფრული `Asset`, განმეორების გამომწვევი |
| [`BurnBox`](/ka/blockchain/instructions.md#mint-burn) |ციფრული `Asset`, განმეორების გამომწვევი |
| [`TransferBox`](/ka/blockchain/instructions.md#transfer) |`Domain`, `AssetDefinition`, ციფრული `Asset`, `Nft` |
| [`SetKeyValueBox`](/ka/blockchain/instructions.md#setkeyvalue-removekeyvalue) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Trigger` მეტა მონაცემები |
| [`RemoveKeyValueBox`](/ka/blockchain/instructions.md#setkeyvalue-removekeyvalue) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Trigger` მეტა მონაცემები |
| [`GrantBox`](/ka/blockchain/instructions.md#grant-revoke) | `Permission` (`Grant<Permission, Account>`), `Role` (`Grant<RoleId, Account>`), `RolePermission` (`Grant<Permission, Role>`) |
| [`RevokeBox`](/ka/blockchain/instructions.md#grant-revoke) | `Permission` (`Revoke<Permission, Account>`), `Role` (`Revoke<RoleId, Account>`), `RolePermission` (`Revoke<Permission, Role>`) |
| [`SetParameter`](/ka/blockchain/instructions.md#setparameter) |ქსელის პარამეტრების განახლება |
| [`ExecuteTrigger`](/ka/blockchain/instructions.md#executetrigger) |განადგურება |
| [`Upgrade`](/ka/blockchain/instructions.md#other-instructions) |აღმასრულებელი განახლება |
| [`Log`](/ka/blockchain/instructions.md#other-instructions) |აღმასრულებელი ლოგის ჩანაწერი |
| [`CustomInstruction`](/ka/blockchain/instructions.md#other-instructions) |აღმასრულებლისთვის სპეციფიური სასარგებლო ტვირთი JSON |
| [ეროვნული აქტივების საფინანსო დაფარვა](/ka/blockchain/escrow.md) | `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, `ResolveEscrowDispute` |
| [გენერული აქტივების ჩაკეტვა](/ka/blockchain/escrow.md#generic-asset-locks) |`OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, `ExpireAssetLock` |
| [ანონიმური აქტივების დაფარვა](/ka/blockchain/escrow.md#anonymous-escrow) | `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, `ResolveAnonymousEscrowDispute` |
| [ატომური კერძო ანგარიშსწორება](/ka/blockchain/instructions.md#atomic-private-settlement) | `ActivatePrivateSettlementPoolV1`, `RotatePrivateSettlementPoolPolicyV1`, `FinalizeAtomicPrivateSettlementV1`, `AbortAtomicPrivateSettlementV1` |

დამატებითი Iroha 3 მოდულები შეიძლება დარეგისტრირდეს დომენის სპეციფიკური ინსტრუქციის ტიპები ინსტრუქციების რეესტრის მეშვეობით. მიმდინარე წყარო ხიდან გენერირებული სქემის დონეზე ჩამონათვალი იხილეთ [ მონაცემთა მოდელი სქემა](./data-model-schema.md) .

::: details დიაგრამა: ძირითადი ინსტრუქციის ოჯახები

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
