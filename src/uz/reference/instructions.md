---
translation_locale: uz
translation_source: /reference/instructions.md
translation_source_hash: 8dc894a05141040826067dc483319f213b007648f32354bb36f899259db9c5ac
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Maxsus ko'rsatmalar {#iroha-special-instructions}

Joriy ma'lumotlar modeli ushbu o'rnatilgan ta'lim oilalarini aniqlaydi:

| Ta'lim | Variantlar |
| --- | --- |
| [`RegisterBox`](/uz/blockchain/instructions.md#un-register) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Role`, `Trigger`, `RegisterPeerWithPop` |
| [`UnregisterBox`](/uz/blockchain/instructions.md#un-register) | `Peer`, `Domain`, `Account`, `AssetDefinition`, `Nft`, `Role`, `Trigger` |
| [`MintBox`](/uz/blockchain/instructions.md#mint-burn) | raqamli `Asset`, qo'zg'atish takrorlashlari |
| [`BurnBox`](/uz/blockchain/instructions.md#mint-burn) | raqamli `Asset`, qo'zg'atish takrorlashlari |
| [`TransferBox`](/uz/blockchain/instructions.md#transfer) | `Domain`, `AssetDefinition`, raqamli `Asset`, `Nft` |
| [`SetKeyValueBox`](/uz/blockchain/instructions.md#setkeyvalue-removekeyvalue) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Trigger` Metadatalar |
| [`RemoveKeyValueBox`](/uz/blockchain/instructions.md#setkeyvalue-removekeyvalue) | `Domain`, `Account`, `AssetDefinition`, `Nft`, `Trigger` Metadatalar |
| [`GrantBox`](/uz/blockchain/instructions.md#grant-revoke) | hisobot berish uchun ruxsat, hisobda ishtirok etish uchun ruxsat, ro'yxatga olish uchun ruxsat |
| [`RevokeBox`](/uz/blockchain/instructions.md#grant-revoke) | hisobdan ruxsat, hisobdan ro'l, ro'ldan ruxsat |
| [`SetParameter`](/uz/blockchain/instructions.md#setparameter) | zanjir parametrlarini yangilash |
| [`ExecuteTrigger`](/uz/blockchain/instructions.md#executetrigger) | qoʻzgʻatish |
| [`Upgrade`](/uz/blockchain/instructions.md#other-instructions) | ijrochi yangilanishi |
| [`Log`](/uz/blockchain/instructions.md#other-instructions) | ijrochi jurnaliga kirish |
| [`CustomInstruction`](/uz/blockchain/instructions.md#other-instructions) | ijrochiga xos JSON faydali yuk |
| [Asosiy aktivlarning depozitasi](/uz/blockchain/escrow.md) | `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, `ResolveEscrowDispute` |
| [Umumiy aktivlar qulflari](/uz/blockchain/escrow.md#generic-asset-locks) | `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, `ExpireAssetLock` |
| [Anonim aktivlar depozitasi](/uz/blockchain/escrow.md#anonymous-escrow) | `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, `ResolveAnonymousEscrowDispute` |

Qo'shimcha Iroha 3 modullar domenga mos ko'rsatma turlarini qayd etishlari mumkin
Koʻrsatmalar reyestri orqali.
joriy manba daraxti, qarang [Ma'lumotlar modeli sxemasi](./data-model-schema.md).

::: details Diagramma: Oilalarga asosiy ta'lim

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
