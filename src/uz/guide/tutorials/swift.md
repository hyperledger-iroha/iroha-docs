---
translation_locale: uz
translation_source: /guide/tutorials/swift.md
translation_source_hash: 85cc94399b9892984615bf8a0821a1f30395eb87ec164592ca98fbd9903ef834
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift va iOS {#swift-and-ios}

O ' zbekiston Respublikasining Swift SDK Yuqori oqimdagi ish o'rinlari tomonidan jo'natilgan `IrohaSwift` Swift toʻplam `IrohaSwift/`. Uning paket manifestida uchta kutubxona mahsulotlari aniqlanadi`IrohaSwift`, `IrohaSwiftMobileTransports`, va `IrohaSwiftTransferUI` va iOS 15+ va macOS 12+ ni maqsad qilib qo'ydi Swift asboblar 5.9.

Paket natijali `NoritoBridge` ikkilamchi maqsadga bog'liq. Paket rezolyutsiyasi qurishdan oldin `../dist/NoritoBridge.xcframework` ni tasdiqlaydi, natijali ramzlar yuklanmaganida esa tranzaksiya yoki Connect kripto yo'llari ko'prik mavjud bo'lmagan xatolarni tashlaydi..

## Swift Paket boshqaruvchisi {#swift-package-manager}

O'rnatilgan ish maydonlariga qarshi rivojlanayotganda, SwiftPM mahalliy `IrohaSwift/` to'plamlar direktoriyasi. `Package.swift` bo ' lmoqda `IrohaSwift`:

```swift
dependencies: [
    .package(name: "IrohaSwift", path: "/path/to/iroha/IrohaSwift")
],
targets: [
    .target(
        name: "YourApp",
        dependencies: [
            .product(name: "IrohaSwift", package: "IrohaSwift")
        ]
    )
]
```

Ilova uchun yo'lni o'zgartiring. Joriy `examples/ios/ConnectMinimalApp` yo'lini mavjud bo'lgani kabi nusxa ko'rsatmang; bu manifest `../../IrohaSwift` ni `examples/IrohaSwift` ga aylantiradi.

To'plamni hal qilishdan oldin, ko'prik ish joyining ildizida mavjudligiga ishonch hosil qiling:

```bash
cd /path/to/iroha
make bridge-xcframework
```

Bu `dist/NoritoBridge.xcframework` ni hosil qiladi; `IrohaSwift/Package.swift` uni `../dist/NoritoBridge.xcframework` deb ataydi.

## CocoaPods {#cocoapods}

Kod bazasida shuningdek: `IrohaSwift/IrohaSwift.podspec`. O ' zbekiston Respublikasining `IrohaSwift` kapsula, Swift 5.9 va iOS 15. Podspec olib tashlaydi Swift asosiy ma'muriyatdan olingan manbalar; natijali ko'prik hali ham mavjud bo'lishi va bitim kodlash uchun u bilan bog'lanish kerak, Ed25519 bo'lmagan imzolar va Connect kripto.

## Tez ishga tushirish {#quickstart}

```swift
import Foundation
import IrohaSwift

let torii = ToriiClient(baseURL: URL(string: "http://127.0.0.1:8080")!)
let sdk = IrohaSDK(toriiClient: torii)

let keypair = try Keypair.generate()
let accountId = try keypair.accountId()

if #available(iOS 15.0, macOS 12.0, *) {
    let balances = try await torii.getAssets(accountId: accountId)
    print("balances:", balances)
}
```

## Taira Faqat o'qishga harakat qiling {#try-taira-read-only}

Qurilma yoki simulyator ommaviy Taira oxirgi nuqtasiga yetishi mumkinligini tasdiqlash uchun oddiy HTTP sondasi bilan boshlang:

```swift
import Foundation

if #available(iOS 15.0, macOS 12.0, *) {
    let url = URL(string: "https://taira.sora.org/status")!
    let (data, response) = try await URLSession.shared.data(from: url)

    if let http = response as? HTTPURLResponse {
        print("status:", http.statusCode)
    }
    print(String(decoding: data, as: UTF8.self))
}
```

Shunga oʻxshash foydalanish `URLSession` tekshirish uchun `https://taira.sora.org/v1/assets/definitions?limit=5` Oʻzingiz qurayotganingizda . UI va xulq-atvorni yana sinab ko'ring. `IrohaSDK` qo'llab-quvvatlovchilarni faqat dasturiy ta'minot xavfsiz saqlashdan imzolash materialini yuklaganidan va hisobvaraq moliyalashtirilganidan so'ng yuboradi Taira.

Transaksiyani tuzish va jo'natish uchun `IrohaSDK` yordamchisidan foydalaning. Ular mahalliy ko'prik qo'llab-quvvatlangan tranzaksiya kodlovchiga murojaat qiladilar:

```swift
let transfer = TransferRequest(
    chainId: "00000000-0000-0000-0000-000000000000",
    authority: accountId,
    assetDefinitionId: "66owaQmAQMuHxPzxUN3bqZ6FJfDa",
    quantity: "1",
    destination: accountId,
    description: "demo",
    feePayment: .authority(chargeLimits: [], gasLimit: nil)
)

if #available(iOS 15.0, macOS 12.0, *) {
    let status = try await sdk.submitAndWait(
        transfer: transfer,
        keypair: keypair
    )
    print(status.content.status.kind)
}
```

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, va `UnshieldRequest` kanonik hisobni tasdiqlash IDs va kanonik prefikssiz Base58 aktivlari ta'rifi IDs imzolashdan oldin.

## Native escrow {#native-escrow}

Swift bozor va anonim eskrov ko'rsatmalarini Norito JSON yordamchilari orqali `NativeEscrowInstructionBuilders` yoki ekvivalent `IrohaSDK.build*Escrow*` yordamchilari sifatida yaratadi. Misollar uchun [Native Asset Escrow](/uz/blockchain/escrow.md#swift-and-ios), anonim dalillar maydonlari va nizolarni hal qilish ruxsatnomasi tokenini ko'ring.

## Imzolash {#signing}

`Keypair` - bu Ed25519 qulayligi API. Boshqa algoritmlar uchun `IrohaSDK` ni `defaultSigningAlgorithm` bilan quring va `generateSigningKey()` yoki `signingKey(fromSeed:)` dan foydalaning:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

O ' zbekiston Respublikasining `SigningAlgorithm` enum hozirda Ed25519, secp256k1ni o'z ichiga oladi; BLS Oddiy va kichik variantlar, ML-DSA, GOST R 34.10-2012 parametrlar to'plamlari va SM2. Ed25519 qulaylik yo'li tashqarisida mahalliy ko'prikni qo'llab-quvvatlash talab etiladi.

## Ulanish {#connect}

Connect mijozi Swift manbasida, `NoritoBridge` tomonidan qo'llab-quvvatlanadigan kripto va ramka kodeklari bilan amalga oshiriladi:

```swift
let sessionID = Data(repeating: 0, count: 32) // replace with the session bytes
let sid = "<session-id-from-/v1/connect/session>"
let request = try ConnectClient.makeWebSocketRequest(
    baseURL: URL(string: "https://node.example")!,
    sid: sid,
    role: .app,
    token: "<token>"
)

let client = ConnectClient(request: request)
await client.start()

let session = ConnectSession(sessionID: sessionID, client: client)
let keyPair = try ConnectCrypto.generateKeyPair()
```

`ConnectSession` ochish va yopish nazoratlarini, shifrlangan zarfni o'qish, yo'nalish kalitlari, oqimlarni boshqarish, hodisalar oqimi, muvozanat oqimlari va tashxis jurnallarini boshqaradi.

## Joriy qamrov {#current-coverage}

Swift manbai hozirda quyidagilarni o'z ichiga oladi:

- `ToriiClient` HTTP hisoblar, aktivlar, aliaslar, qidiruv sahifalari, RWA, shartnomalar, multisig, boshqaruv, obunalar, ma'lumotlar mavjudligi, maxfiy aktivlar, node/runtime holati, sog'liqni saqlash, metrikalar va SSE oqimlari yordamchilari
- `IrohaSDK` tranzaksiya quruvchilari va transfer, mint, yoqish, shield, shieldsiz o'tkazish, ZK transfer, ZK aktivlarni ro'yxatga olish, metadatalar, identifikator talablari, multisig ro'yxatdan o'tkazish va boshqaruv yo'l-yo'riqlariga ko'maklashuvchilar
- `PendingTransactionQueue` va `FilePendingTransactionQueue` orqali amalga oshirilayotgan operatsiyalar safida qo'llab-quvvatlash
- `AccountAddress` va `AccountId` orqali hisob-kitob manzili va I105 yordamchilari
- Ed25519, secp256k1, ML-DSA, BLS, GOST va SM2 imzolash yuzalari, agar kerak bo'lsa, mahalliy ko'prikni qo'llab-quvvatlash
- bozor va anonim depozit uchun mahalliy eskrov yo'l-yo'riqlari yordamchi yukni qurishchilar
- WebSocket, ramka, kripto, seans, navbat, takrorlash va tashxis yordamchilari bilan bog'laning
- Kagemusha tayyorligi, tiklangan to'ldirish va to'lov, operatsion holat, yozuv, tengdoshlar to'plami, rasvot va QR oqim modeli
- SoraFS, ma'lumotlar mavjudligi va tasdiqlovchi ilovalar yordamchilari

## API Misollar {#api-examples}

Umumiy amalga oshirish uchun `IrohaSwift/Sources/IrohaSwift` va bir xil manba tekshiruvidan olingan sinovdan o'tgan foydalanish misollari uchun `IrohaSwift/Tests/IrohaSwiftTests` dan foydalaning.

## Ma'lumotlar manbai {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
