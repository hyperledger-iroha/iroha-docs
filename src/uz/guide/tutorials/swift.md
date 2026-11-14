---
translation_locale: uz
translation_source: /guide/tutorials/swift.md
translation_source_hash: 753ce1b5e0de4eae56b38e77962566b23fee56d4662a432a7bbe6ea807261422
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
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

Ilovangiz uchun yo‘lni moslang. `examples/ios/ConnectMinimalApp/Package.swift` xuddi shu bog‘liqlikni `../../../IrohaSwift` nisbiy yo‘li bilan ko‘rsatadi.

Paketni hal qilishdan oldin joriy nativ ko‘prikni yig‘ing. Mahalliy ishlab chiqish va testlar uchun buni ish maydoni ildizidan ishga tushiring:

```bash
cd /path/to/iroha
python3.12 scripts/test_swift_local.py
```

Reliz yig‘malari `dist/NoritoBridge.xcframework` ni `make bridge-xcframework` yordamida hosil qiladi; bu `SOURCE_DATE_EPOCH`, `NORITO_BRIDGE_OUT_DIR`, `NORITO_BRIDGE_BUILD_DIR`, `NORITO_BRIDGE_ARCHIVE_OUTPUT` va `MOBILE_SDK_CARGO_LOCKFILE` ni talab qiladi. `IrohaSwift/Package.swift` ko‘prikka `../dist/NoritoBridge.xcframework` deb murojaat qiladi.

## Tez ishga tushirish {#quickstart}

```swift
import Foundation
import IrohaSwift

let torii = ToriiClient(baseURL: URL(string: "http://127.0.0.1:8080")!)
let sdk = IrohaSDK(baseURL: torii.baseURL)

let keypair = try Keypair.generate()
let accountId = try keypair.accountId()

if #available(iOS 15.0, macOS 12.0, *) {
    let balances = try await torii.accountAssets(of: accountId).page()
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
    networkId: try NetworkId(literal: "<exact-network-id>"),
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
    print(status.status.kind)
}
```

`TransferRequest`, `MintRequest` va `BurnRequest` imzolashdan oldin kanonik hisob identifikatorlarini va prefikssiz kanonik Base58 aktiv ta’rifi identifikatorlarini tekshiradi.

## Mahalliy eskrou {#native-escrow}

Swift bozor eskrousi ko‘rsatmalarini `NativeEscrowInstructionBuilders` yoki ularga teng `IrohaSDK.build*Escrow*` yordamchilari orqali Norito JSON foydali yuklari sifatida yaratadi. Misollar va nizoni hal qiluvchi ruxsat tokeni uchun [Mahalliy aktiv eskrousi](/uz/blockchain/escrow.md#swift-and-ios) bo‘limiga qarang.

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

let keyPair = try ConnectCrypto.generateKeyPair()
let session = try ConnectSession(
    networkID: try NetworkId(literal: "<exact-network-id>"),
    appPublicKey: keyPair.publicKey,
    nonce: nonce,
    relayToken: "<token>",
    client: client
)
```

`ConnectSession` ochish va yopish boshqaruvlarini, shifrlangan konvertlarni o‘qishni, yo‘nalish kalitlarini, oqim boshqaruvini, hodisa oqimlarini, balans oqimlarini va diagnostika jurnallarini boshqaradi.

## Joriy qamrov {#current-coverage}

Swift manbai hozirda quyidagilarni o'z ichiga oladi:

- `ToriiClient` hisoblar, aktivlar, taxalluslar, kuzatuvchi sahifalari, RWA, shartnomalar, ko‘p imzo, boshqaruv, obunalar, ma’lumotlar mavjudligi, maxfiy aktivlar, tugun va bajarish muhiti holati, sog‘lomlik, ko‘rsatkichlar hamda SSE oqimlari uchun HTTP yordamchilarini taqdim etadi
- `IrohaSDK` tranzaksiya quruvchilari hamda o‘tkazma, chiqarish, yoqish, ZK aktivlarni ro‘yxatdan o‘tkazish, metama’lumotlar, identifikator da’volari, multiimzo ro‘yxatdan o‘tkazish, kontraktni joylashtirish va boshqaruv byulletenlari uchun yuborish/holatni so‘rash yordamchilari
- `PendingTransactionQueue` va `FilePendingTransactionQueue` orqali amalga oshirilayotgan operatsiyalar safida qo'llab-quvvatlash
- `AccountAddress` va `AccountId` orqali hisob-kitob manzili va I105 yordamchilari
- Ed25519, secp256k1, ML-DSA, BLS, GOST va SM2 imzolash yuzalari, agar kerak bo'lsa, mahalliy ko'prikni qo'llab-quvvatlash
- bozor va anonim depozit uchun mahalliy eskrov yo'l-yo'riqlari yordamchi yukni qurishchilar
- WebSocket, ramka, kripto, seans, navbat, takrorlash va tashxis yordamchilari bilan bog'laning
- KAGEMUSHA V1 wire yordamchilari va nativ hamyonning Advance provayderi, ro‘yxatdan o‘tish, tiklash hamda ruxsat etilgan almashinuv chaqiruvlari uchun iPhone platforma adapteri
- SoraFS, ma'lumotlar mavjudligi va tasdiqlovchi ilovalar yordamchilari

## API Misollar {#api-examples}

Umumiy amalga oshirish uchun `IrohaSwift/Sources/IrohaSwift` va bir xil manba tekshiruvidan olingan sinovdan o'tgan foydalanish misollari uchun `IrohaSwift/Tests/IrohaSwiftTests` dan foydalaning.

## Ma'lumotlar manbai {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
