---
translation_locale: uz
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift va iOS {#swift-and-ios}

Yuqori oqimdagi ish maydoni taqdim etadigan Swift SDK — `IrohaSwift/` ichidagi `IrohaSwift` Swift paketi. Uning paket manifesti uchta kutubxona mahsulotini — `IrohaSwift`, `IrohaSwiftMobileTransports` va `IrohaSwiftTransferUI` — belgilaydi hamda Swift 5.9 vositalari bilan iOS 15+ va macOS 12+ ni nishonga oladi.

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

Kod bazasida `IrohaSwift/IrohaSwift.podspec` ham bor. `IrohaSwift` podi Swift 5.9 va iOS 15-ni maqsad qiladi. Podspec Swift manbalarini asosiy repozitoriydan oladi; tranzaksiya kodlash, Ed25519-dan tashqari imzolash va Connect kriptografiyasi uchun native bridge baribir mavjud va bog'langan bo'lishi kerak.

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
    var request = URLRequest(url: url)
    request.setValue("application/json", forHTTPHeaderField: "Accept")
    let (data, response) = try await URLSession.shared.data(for: request)

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

## Mahalliy eskrou {#native-escrow}

Swift bozor va anonim eskrov ko'rsatmalarini Norito JSON yordamchilari orqali `NativeEscrowInstructionBuilders` yoki ekvivalent `IrohaSDK.build*Escrow*` yordamchilari sifatida yaratadi. Misollar uchun [Mahalliy aktiv eskrousi](/uz/blockchain/escrow.md#swift-and-ios), anonim dalillar maydonlari va nizolarni hal qilish ruxsatnomasi tokenini ko'ring.

## Imzolash {#signing}

`Keypair` - bu Ed25519 qulayligi API. Boshqa algoritmlar uchun `IrohaSDK` ni `defaultSigningAlgorithm` bilan quring va `generateSigningKey()` yoki `signingKey(fromSeed:)` dan foydalaning:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

`SigningAlgorithm` enum hozir Ed25519, secp256k1, BLS normal va small variantlari, ML-DSA, GOST R 34.10-2012 parametr to'plamlari hamda SM2-ni o'z ichiga oladi. Ed25519 qulaylik yo'lidan tashqarida native bridge yordami talab qilinadi.

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

`ConnectSession` ochish va yopish boshqaruvlarini, shifrlangan konvertlarni o‘qishni, yo‘nalish kalitlarini, oqim boshqaruvini, hodisa oqimlarini, balans oqimlarini va diagnostika jurnallarini boshqaradi.

## Joriy qamrov {#current-coverage}

Swift manbai hozirda quyidagilarni o'z ichiga oladi:

- `ToriiClient` hisoblar, aktivlar, taxalluslar, kuzatuvchi sahifalari, RWA, shartnomalar, ko‘p imzo, boshqaruv, obunalar, ma’lumotlar mavjudligi, maxfiy aktivlar, tugun va bajarish muhiti holati, sog‘lomlik, ko‘rsatkichlar hamda SSE oqimlari uchun HTTP yordamchilarini taqdim etadi
- `IrohaSDK` tranzaksiya quruvchilari va transfer, mint, yoqish, shield, shieldsiz o'tkazish, ZK transfer, ZK aktivlarni ro'yxatga olish, metadatalar, identifikator talablari, multisig ro'yxatdan o'tkazish va boshqaruv yo'l-yo'riqlariga ko'maklashuvchilar
- `PendingTransactionQueue` va `FilePendingTransactionQueue` orqali amalga oshirilayotgan operatsiyalar safida qo'llab-quvvatlash
- `AccountAddress` va `AccountId` orqali hisob-kitob manzili va I105 yordamchilari
- Ed25519, secp256k1, ML-DSA, BLS, GOST va SM2 imzolash yuzalari, agar kerak bo'lsa, mahalliy ko'prikni qo'llab-quvvatlash
- bozor va anonim depozit uchun mahalliy eskrov yo'l-yo'riqlari yordamchi yukni qurishchilar
- WebSocket, ramka, kripto, seans, navbat, takrorlash va tashxis yordamchilari bilan bog'laning
- Kagemusha tayyorligi, tiklangan to'ldirish va to'lov, operatsion holat, yozuv, tugunlar to'plami, rasvot va QR oqim modeli
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
