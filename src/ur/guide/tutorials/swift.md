---
translation_locale: ur
translation_source: /guide/tutorials/swift.md
translation_source_hash: 85cc94399b9892984615bf8a0821a1f30395eb87ec164592ca98fbd9903ef834
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift اور iOS {#swift-and-ios}

انگریزی میں Swift SDK اوپر بہاؤ کام کی جگہ کی طرف سے بھیجا جاتا ہے `IrohaSwift` Swift پیکج کے تحت `IrohaSwift/`. اس کے پیکج مینوفیس میں تین لائبریری مصنوعات کی وضاحت کی گئی ہے`IrohaSwift`, `IrohaSwiftMobileTransports`, اور `IrohaSwiftTransferUI`اور iOS 15+ اور macOS 12+ کو نشانہ بناتا ہے Swift اوزار 5.9۔

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

اپنی ایپ کے لئے راستہ ایڈجسٹ کریں۔ موجودہ `examples/ios/ConnectMinimalApp` راستے کی نقل نہ کریں جیسا کہ یہ ہے؛ اس دستاویز کا حل `../../IrohaSwift` سے `examples/IrohaSwift` تک ہے۔

پیکج کو حل کرنے سے پہلے، اس بات کا یقین کریں کہ پل کام کی جگہ کی جڑ پر موجود ہے:

```bash
cd /path/to/iroha
make bridge-xcframework
```

اس سے `dist/NoritoBridge.xcframework` پیدا ہوتا ہے۔ `IrohaSwift/Package.swift` اس کا حوالہ دیتا ہے `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

کوڈ بیس میں بھی شامل ہے `IrohaSwift/IrohaSwift.podspec`. یہ اعلان کرتا ہے کہ `IrohaSwift` پوڈ، Swift 5.9، اور iOS 15. پوڈ سپیک کھینچتا ہے Swift مرکزی مخزن سے ذرائع؛ مقامی پل اب بھی موجود ہونا ضروری ہے اور ٹرانزیکشن کوڈنگ کے لئے منسلک کیا جانا چاہئے، غیر ایڈی25519 دستخط، اور کنیکٹ کرپٹو.

## فوری آغاز {#quickstart}

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

## کوشش کریں Taira صرف پڑھنا {#try-taira-read-only}

یہ یقینی بنانے کے لئے کہ آلہ یا سمیلیٹر پبلک Taira اختتامی نقطہ تک پہنچ سکتا ہے، ایک سادہ HTTP پروب سے شروع کریں:

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

ایک ہی استعمال کریں `URLSession` چیک کریں `https://taira.sora.org/v1/assets/definitions?limit=5` جب تم تعمیر کر رہے ہو UI اور دوبارہ رویے کی کوشش کریں. `IrohaSDK` ایپ کو محفوظ اسٹوریج سے دستخط کرنے والے مواد کو لوڈ کرنے کے بعد ہی مددگار بھیجیں اور اکاؤنٹ پر فنڈنگ کی جاتی ہے Taira.

ٹرانزیکشن بنانے اور جمع کرانے کے لئے، `IrohaSDK` مددگاروں کا استعمال کریں. یہ مقامی پل کی حمایت شدہ ٹرانزیکtion کوڈر کہتے ہیں:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, اور `UnshieldRequest` کینونیکل اکاؤنٹ کی توثیق IDs اور کینونیکل غیر مقررہ Base58 اثاثے کی تعریف IDs دستخط کرنے سے پہلے.

## مقامی ایسکرو {#native-escrow}

Swift مارکیٹ پلیس اور گمنام ایسکرو ہدایات کی تعمیر کرتا ہے جو Norito JSON کے ذریعہ `NativeEscrowInstructionBuilders` یا مساوی `IrohaSDK.build*Escrow*` معاونین کے ذریعہ مفید بوجھ ہیں۔ مثالوں ، گمنام ثبوت فیلڈز اور تنازعہ حل کرنے والے اجازت ٹوکن کے لئے [ نیشنل اثاثہ ایسکرو](/ur/blockchain/escrow.md#swift-and-ios) دیکھیں۔

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

let session = ConnectSession(sessionID: sessionID, client: client)
let keyPair = try ConnectCrypto.generateKeyPair()
```

`ConnectSession` کھولنے اور بند کرنے کے کنٹرولز، خفیہ لفافے پڑھتا ہے، سمت کی چابیاں، بہاؤ کنٹرول، واقعہ بہاؤ، توازن بہاؤ، اور تشخیصی جرنل ہینڈل.

## موجودہ کوریج {#current-coverage}

Swift ذریعہ میں فی الحال شامل ہیں:

- `ToriiClient` HTTP اکاؤنٹس، اثاثوں، عرفی ناموں، تلاش کرنے والے صفحات، RWA، معاہدوں، ملٹی سیگ، گورننس، سبسکرپشنز، ڈیٹا کی دستیابی، خفیہ اثاثے، نوڈ / رن ٹائم کی حیثیت، صحت، میٹرکس، اور SSE سلسلہ
- `IrohaSDK` ٹرانزیکشن بلڈرز اور منتقلی، منٹ، جلن، شیلڈ، غیر شیلڈ ، ZK منتقلی ، ZK اثاثہ رجسٹریشن ، میٹا ڈیٹا ، شناختی دعوے ، ملٹی سگ رجسٹریشن اور گورننس ہدایات کے لئے جمع کرانے / پولنگ معاونین۔
- `PendingTransactionQueue` اور `FilePendingTransactionQueue` کے ذریعے ٹرانزیکشن کی قطار میں معاونت کا انتظار کرنا
- `AccountAddress` اور `AccountId` کے ذریعے اکاؤنٹ ایڈریس اور I105 معاونین
- Ed25519، secp256k1، ML-DSA، BLS، GOST، اور SM2 پر دستخط کرنے والی سطحیں، جہاں ضروری ہو مقامی پل کی حمایت کے ساتھ
- مارکیٹ پلیس اور گمنام اسرو کے لئے مقامی سپلائی ہدایات کی مفید بوجھ بنانے والے
- WebSocket ، فریم، کرپٹو، سیشن، قطار، دوبارہ چلائیں، اور تشخیص کے مددگاروں کو مربوط کریں
- Kagemusha کی تیاری، ٹائپ کردہ بھرنے اور واپسی، آپریشن کی حیثیت، نوٹ، ہم مرتبہ بنڈل، رسید، اور QR سٹریم ماڈلز
- SoraFS ، اعداد و شمار کی دستیابی اور ثبوت منسلک کرنے میں مدد

## API مثالیں {#api-examples}

استعمال کریں `IrohaSwift/Sources/IrohaSwift` عوامی نفاذ کے لئے اور `IrohaSwift/Tests/IrohaSwiftTests` ایک ہی ماخذ کی نظر ثانی سے ٹیسٹ شدہ استعمال کے مثالوں کے لئے.

## ذرائع کے حوالہ جات {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
