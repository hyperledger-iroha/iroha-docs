---
translation_locale: uz
translation_source: /guide/tutorials/swift.md
translation_source_hash: 85cc94399b9892984615bf8a0821a1f30395eb87ec164592ca98fbd9903ef834
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift va iOS {#swift-and-ios}

O ' zbekiston Respublikasi Swift SDK yuqori tomonga ish o'rinlari tomonidan jo'natilgan `IrohaSwift` Swift
quyidagi paket `IrohaSwift/`. Uning paket manzili uchta kutubxonani belgilaydi
mahsulotlar`IrohaSwift`, `IrohaSwiftMobileTransports`, va
`IrohaSwiftTransferUI` va iOS 15+ va macOS 12+ ni maqsad qilib qo'ydi Swift asbob-uskunalar 5.9.

Paket mahalliy shaxsga bogʻliq `NoritoBridge` Ikkilamchi maqsad.
rezolyutsiyani tasdiqlaydi `../dist/NoritoBridge.xcframework` qurilishdan oldin va
Transaksiya yoki Connect kripto yo ' nalishlari ko ' priklar mavjud bo ' lmagan xatolarni tashlash
mahalliy belgilar yuklanmagan.

## Swift Paket boshqaruvchisi {#swift-package-manager}

O'rnatilgan ish maydonida rivojlanayotganda, SwiftPM mahalliy
`IrohaSwift/` to'plamlar direktoriyasi.
`Package.swift` bo ' lmoqda `IrohaSwift`:

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

Dastur yo'lini o'zgartiring.
`examples/ios/ConnectMinimalApp` yo'l mavjud bo'lsa; bu manifest
`../../IrohaSwift` to `examples/IrohaSwift`.

Paketni hal qilishdan oldin, ko'prik ish joyining ildizida mavjudligiga ishonch hosil qiling:

```bash
cd /path/to/iroha
make bridge-xcframework
```

Bu hosil qiladi `dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift`
uni `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

Kod bazasida shuningdek `IrohaSwift/IrohaSwift.podspec`. U quyidagilarni tasdiqlaydi:
`IrohaSwift` kapsula, Swift 5.9 va iOS 15. Podspec olib tashlaydi Swift O'zbekiston Respublikasi
asosiy ombor; mahalliy ko'prik hali ham mavjud bo'lishi va u bilan bog'liq bo'lishi kerak
Transaksiya kodlash, Ed25519 bo'lmagan imzolash va Connect kripto.

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

## Sinang . Taira Faqat oʻqish {#try-taira-read-only}

Toʻgʻri rangdan boshlang HTTP qurilma yoki simulyatorning
jamoatchilik Taira yakuniy nuqta:

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

Shunga oʻxshashdan foydalaning `URLSession` tekshirish uchun
`https://taira.sora.org/v1/assets/definitions?limit=5` Oʻzingiz qurayotganingizda
UI va xulq-atvorni qayta sinab ko'ring. `IrohaSDK` yordamchilarni faqat
ilova imzolovchi materialni xavfsiz saqlashdan yuklaydi va hisobvaraq
Taira.

Transaksiyani tuzish va taqdim etish uchun `IrohaSDK` yordamchilar.
nativ ko'prik bilan ta'minlangan tranzaksiya kodlovchi:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, va
`UnshieldRequest` kanonik hisobni tasdiqlash IDs va kanonik prefikssiz
Base58 aktivlar ta'rifi IDs imzolashdan oldin.

## Asosiy depozit {#native-escrow}

Swift bozor va anonim depozit ko'rsatmalarini yaratadi Norito JSON
yordamchi yuklar orqali `NativeEscrowInstructionBuilders` yoki ekvivalenti
`IrohaSDK.build*Escrow*` yordamchilar.
[Asosiy aktivlar eskorovi](/uz/blockchain/escrow.md#swift-and-ios) misollar uchun;
Anonim dalillar maydonlari va nizolarni hal qilish uchun ruxsat berish belgisi.

## Imzolash {#signing}

`Keypair` Ed25519 qulayligi API. Boshqa algoritmlar uchun
`IrohaSDK` bilan `defaultSigningAlgorithm` va foydalanish `generateSigningKey()` yoki
`signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

O ' zbekiston Respublikasi `SigningAlgorithm` enum hozirda Ed25519, secp256k1-ni o'z ichiga oladi, BLS odatiy
Va kichik variantlar, ML-DSA, GOST R 34.10-2012 parametrlar to'plamlari va SM2. Asosiy
Ed25519 qulaylik yo'li tashqarisida ko'prikni qo'llab-quvvatlash zarur.

## Ulanish {#connect}

Connect mijozi Swift manba, kripto va ramka kodeklari bilan
tomonidan qo'llab-quvvatlanadi `NoritoBridge`:

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

`ConnectSession` o'chirish va yopish boshqaruv qismlari, shifrlangan zarfni o'qish;
yo'nalish kalitlari, oqimlarni boshqarish, hodisalar oqimlari, muvozanat oqimlari va tashxis
jurnallar.

## Joriy qamrov {#current-coverage}

O ' zbekiston Respublikasi Swift manbai hozirda quyidagilarni o'z ichiga oladi:

- `ToriiClient` HTTP hisoblar, aktivlar, aliaslar, qidiruv sahifalari yordamchilari;
  RWA, shartnomalar, multisig, boshqaruv, obunalar, ma'lumotlar mavjudligi;
  maxfiy aktivlar, nodlar/ish vaqtining holati, sog'liqni saqlash, ma'lumotlar va SSE oqimlar
- `IrohaSDK` Transaksiyalarni tuzish va o'tkazish uchun taqdim etish/sozlash yordamchilari, mint,
  yondirish, qalqonsiz, qo'riqlamaydigan, ZK o'tkazish, ZK aktivlarni ro'yxatdan o'tkazish, metadotlar;
  identifikator talablari, ko'p belgisi bilan ro'yxatdan o'tish va boshqaruv yo'l-yo'riqlari
- Transaksiyalar navbatini qo'llab-quvvatlash `PendingTransactionQueue` va
  `FilePendingTransactionQueue`
- hisob manzili va I105 yordamchilar orqali `AccountAddress` va `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST, va SM2 imzolash yuzalari, mahalliy
  zarur bo'lganda ko'prikni qo'llab-quvvatlash
- bozor va anonim uchun mahalliy eskrov ko'rsatmalar payload quruvchilar
  garov
- Ulanish WebSocket, ramka, kripto, seans, navbat, takrorlash va tashxis
  yordamchilar
- Kagemusha tayyorligi, tiklangan to'ldirish va to'lov, operatsion holat, yozuv,
  tengdoshlar to'plami, rasvo va QR oqim modellari
- SoraFS, ma'lumotlar mavjudligi va dalillar bilan bog'lanish yordamchilari

## API Misollar {#api-examples}

Foydalanish `IrohaSwift/Sources/IrohaSwift` davlat tomonidan amalga oshirilishi va
`IrohaSwift/Tests/IrohaSwiftTests` sinovdan o'tgan foydalanish namunalari uchun
manbalarni qayta ko'rib chiqish.

## Ilovalar {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
