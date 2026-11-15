---
translation_locale: ur
translation_source: /guide/tutorials/swift.md
translation_source_hash: 753ce1b5e0de4eae56b38e77962566b23fee56d4662a432a7bbe6ea807261422
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Swift اور iOS {#swift-and-ios}

اپ اسٹریم workspace کی Swift SDK، ‏`IrohaSwift/` کے تحت `IrohaSwift` Swift package ہے۔ اس کا package مینی فیسٹ تین library products—`IrohaSwift`، ‏`IrohaSwiftMobileTransports` اور `IrohaSwiftTransferUI`—متعین کرتا ہے، اور Swift tools 5.9 کے ساتھ iOS 15+ اور macOS 12+ کو ہدف بناتا ہے۔

پیکیج مقامی `NoritoBridge` بائنری ہدف پر منحصر ہے۔ پیکیج ریزولوشن تعمیر سے پہلے `../dist/NoritoBridge.xcframework` کی توثیق کرتا ہے ، اور جب مقامی علامتیں لوڈ نہیں ہوتی ہیں تو ٹرانزیکشن یا کنیکٹ کرپٹو راستے پل دستیاب غلطیوں کو پھینک دیتے ہیں۔

## Swift پیکج منیجر {#swift-package-manager}

جب کسی چیک آؤٹ ورک اسپیس کے خلاف ترقی کرتے ہو تو ، مقامی `IrohaSwift/` پیکج ڈائرکٹری میں SwiftPM کو نشان زد کریں۔ `Package.swift` کی طرف سے استعمال کردہ پیکیج کی شناخت `IrohaSwift` ہے:

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

اپنی ایپ کے لیے راستہ ایڈجسٹ کریں۔ `examples/ios/ConnectMinimalApp/Package.swift` یہی انحصار نسبتی راستے `../../../IrohaSwift` کے ساتھ دکھاتا ہے۔

پیکیج حل کرنے سے پہلے موجودہ مقامی برج بنائیں۔ مقامی ترقی اور ٹیسٹوں کے لیے اسے ورک اسپیس کی جڑ سے چلائیں:

```bash
cd /path/to/iroha
python3.12 scripts/test_swift_local.py
```

ریلیز بلڈز `make bridge-xcframework` کے ذریعے `dist/NoritoBridge.xcframework` تیار کرتی ہیں، جس کے لیے `SOURCE_DATE_EPOCH`، `NORITO_BRIDGE_OUT_DIR`، `NORITO_BRIDGE_BUILD_DIR`، `NORITO_BRIDGE_ARCHIVE_OUTPUT` اور `MOBILE_SDK_CARGO_LOCKFILE` درکار ہیں۔ `IrohaSwift/Package.swift` برج کا حوالہ `../dist/NoritoBridge.xcframework` کے طور پر دیتا ہے۔

## فوری آغاز {#quickstart}

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

## کوشش کریں Taira صرف پڑھنا {#try-taira-read-only}

یہ یقینی بنانے کے لئے کہ آلہ یا سمیلیٹر پبلک Taira اختتامی نقطہ تک پہنچ سکتا ہے، ایک سادہ HTTP پروب سے شروع کریں:

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

ایک ہی استعمال کریں `URLSession` چیک کریں `https://taira.sora.org/v1/assets/definitions?limit=5` جب تم تعمیر کر رہے ہو UI اور دوبارہ رویے کی کوشش کریں. `IrohaSDK` ایپ کو محفوظ اسٹوریج سے دستخط کرنے والے مواد کو لوڈ کرنے کے بعد ہی مددگار بھیجیں اور اکاؤنٹ پر فنڈنگ کی جاتی ہے Taira.

ٹرانزیکشن بنانے اور جمع کرانے کے لئے، `IrohaSDK` مددگاروں کا استعمال کریں. یہ مقامی پل کی حمایت شدہ ٹرانزیکشن کوڈر کہتے ہیں:

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

`TransferRequest`، `MintRequest` اور `BurnRequest` دستخط سے پہلے کینونیکل اکاؤنٹ IDs اور بغیر سابقے کے کینونیکل Base58 اثاثہ تعریف IDs کی توثیق کرتے ہیں۔

## مقامی ایایسکرو {#native-escrow}

Swift، `NativeEscrowInstructionBuilders` یا مساوی `IrohaSDK.build*Escrow*` معاونین کے ذریعے مارکیٹ پلیس ایسکرو ہدایات کو Norito JSON پے لوڈز کے طور پر بناتا ہے۔ مثالوں اور تنازعہ حل کرنے والے کی اجازت کے ٹوکن کے لیے [مقامی اثاثہ ایسکرو](/ur/blockchain/escrow.md#swift-and-ios) دیکھیں۔

## دستخط {#signing}

`Keypair` کیا ایڈ25519 سہولت ہے؟ API. دیگر الگورتھموں کے لئے، ایک تعمیر کریں `IrohaSDK` کے ساتھ `defaultSigningAlgorithm` اور استعمال `generateSigningKey()` یا `signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

انگریزی میں `SigningAlgorithm` enum فی الحال Ed25519، secp256k1 شامل ہے، BLS معمول اور چھوٹے متغیرات، ML-DSA, GOST R 34.10-2012 پیرامیٹر سیٹ، اور SM2. ایڈ25519 سہولت کے راستے سے باہر مقامی پل کی حمایت کی ضرورت ہے۔

## رابطہ کریں {#connect}

کنیکٹ کلائنٹ کو Swift ماخذ میں نافذ کیا گیا ہے ، جس کے ساتھ کریپٹو اور فریم کوڈکس کی حمایت `NoritoBridge`:

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

`ConnectSession` کھولنے اور بند کرنے کے کنٹرولز، خفیہ لفافے پڑھتا ہے، سمت کی چابیاں، بہاؤ کنٹرول، واقعہ بہاؤ، بیلنس بہاؤ، اور تشخیصی جرنل ہینڈل.

## موجودہ کوریج {#current-coverage}

Swift ذریعہ میں فی الحال شامل ہیں:

- `ToriiClient` HTTP اکاؤنٹس، اثاثوں، عرفی ناموں، تلاش کرنے والے صفحات، RWA، معاہدوں، ملٹی سیگ، گورننس، سبسکرپشنز، ڈیٹا کی دستیابی، خفیہ اثاثے، نوڈ / رن ٹائم کی حیثیت، صحت، میٹرکس، اور SSE سلسلہ
- `IrohaSDK` کے لین دین بلڈرز اور منتقلی، منٹ، برن، ZK اثاثہ رجسٹریشن، میٹا ڈیٹا، شناخت کنندہ کے دعووں، ملٹی سگ رجسٹریشن، معاہدے کی تعیناتی اور گورننس بیلٹس کے لیے جمع/پول معاونین
- `PendingTransactionQueue` اور `FilePendingTransactionQueue` کے ذریعے ٹرانزیکشن کی قطار میں معاونت کا انتظار کرنا
- `AccountAddress` اور `AccountId` کے ذریعے اکاؤنٹ ایڈریس اور I105 معاونین
- Ed25519، secp256k1، ML-DSA، BLS، GOST، اور SM2 پر دستخط کرنے والی سطحیں، جہاں ضروری ہو مقامی پل کی حمایت کے ساتھ
- مارکیٹ پلیس اور گمنام ایسکرو کے لئے مقامی سپلائی ہدایات کی پے لوڈ بنانے والے
- WebSocket ، فریم، کرپٹو، سیشن، قطار، دوبارہ چلائیں، اور تشخیص کے مددگاروں کو مربوط کریں
- KAGEMUSHA V1 وائر معاون افعال اور نَیٹو والیٹ کے Advance فراہم کنندہ، اندراج، بازیابی اور منظور شدہ تبادلے کی کالز کے لیے iPhone پلیٹ فارم اڈاپٹر
- SoraFS ، اعداد و شمار کی دستیابی اور ثبوت منسلک کرنے میں مدد

## API مثالیں {#api-examples}

استعمال کریں `IrohaSwift/Sources/IrohaSwift` عوامی نفاذ کے لئے اور `IrohaSwift/Tests/IrohaSwiftTests` ایک ہی ماخذ کی نظر ثانی سے ٹیسٹ شدہ استعمال کے مثالوں کے لئے.

## ذرائع کے حوالہ جات {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
