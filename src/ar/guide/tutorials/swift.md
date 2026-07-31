---
translation_locale: ar
translation_source: /guide/tutorials/swift.md
translation_source_hash: 85cc94399b9892984615bf8a0821a1f30395eb87ec164592ca98fbd9903ef834
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift و (iOS) {#swift-and-ios}

(الـ) Swift SDK يتم شحنها من قبل مساحة العمل الصعودية هي `IrohaSwift` Swift
حزمة تحت `IrohaSwift/`. ويقوم برسالة الحزمة بتعريف ثلاث مكتبات
المنتجات`IrohaSwift`, `IrohaSwiftMobileTransports`, و
`IrohaSwiftTransferUI`ويهدف إلى iOS 15+ و macOS 12+ مع Swift الأدوات 5.9.

الحزمة تعتمد على الأصلي `NoritoBridge` الهدف الثنائي
تصحيح القرار `../dist/NoritoBridge.xcframework` قبل البناء، و
المعاملة أو الاتصال مسارات العملات الرقمية رمي الجسر غير متوفر الأخطاء عندما
الرموز الأصلية ليست محملة.

## Swift مدير الحزمة {#swift-package-manager}

عند التطوير ضد مساحة عمل خارجية، نقطة SwiftPM في المحلية
`IrohaSwift/` دليل الحزمة. هوية الحزمة المستخدمة من قبل
`Package.swift` هو `IrohaSwift`:

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

قم بتعديل المسار لتطبيقك. لا تنسخ الحالي
`examples/ios/ConnectMinimalApp` المسار كما هو، وهذا المظهر يحل
`../../IrohaSwift` إلى `examples/IrohaSwift`.

قبل حل الحزمة، تأكد من وجود الجسر في جذور مساحة العمل:

```bash
cd /path/to/iroha
make bridge-xcframework
```

هذا ينتج `dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift`
يشار إليها `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

يحتوي قاعدة الشفرة أيضاً على `IrohaSwift/IrohaSwift.podspec`. يعلن
`IrohaSwift` القنبلة، Swift 5.9 و iOS 15. Swift مصادر من
المخزن الرئيسي، يجب أن يكون الجسر الأصلي موجوداً وربطاً
تشفير المعاملات، توقيع غير Ed25519، و Connect crypto.

## بداية سريعة {#quickstart}

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

## حاولي Taira القراءة فقط {#try-taira-read-only}

ابدأ بـ " سادي " HTTP المسح للتأكد من أن الجهاز أو المحاكي يمكن أن يصل إلى
العامة Taira النقطة النهائية:

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

استخدم نفسها `URLSession` تحقق من
`https://taira.sora.org/v1/assets/definitions?limit=5` بينما تبني
UI وأحاول مجدداً السلوك `IrohaSDK` لا تقدم المساعدين إلا بعد
التطبيق يحمل مواد الموقعين من مخزن آمن ويتم تمويل الحساب
Taira.

لإنشاء وتقديم المعاملة، استخدم `IrohaSDK` المساعدون، هؤلاء يدعون
رمز المعاملات المحلي المدعوم بالجسر:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, و
`UnshieldRequest` تأكيد الحساب الكنسي IDs و القنوني غير المثبتة
تعريف الأصول Base58 IDs قبل التوقيع

## الاحتفاظ بالأموال {#native-escrow}

Swift يقوم ببناء مساحة السوق وتعليمات الاحتفاظ بالشرف المجهول Norito JSON
الحمولات المفيدة عبر `NativeEscrowInstructionBuilders` أو ما يعادلها
`IrohaSDK.build*Escrow*` المساعدين
[الاحتفاظ بالأصول الأصلية](/ar/blockchain/escrow.md#swift-and-ios) على سبيل المثال،
حقل إثبات مجهول، و رمز تصريح حل النزاع.

## التوقيع {#signing}

`Keypair` هو إد25519 الراحة API. بالنسبة إلى الخوارزميات الأخرى، قم ببناء
`IrohaSDK` مع `defaultSigningAlgorithm` واستخدامها `generateSigningKey()` أو
`signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

(الـ) `SigningAlgorithm` enum حاليا يشمل Ed25519, secp256k1, BLS طبيعي
والإختلافات الصغيرة، ML-DSA, GOST R 34.10-2012 مجموعات المعايير، و SM2. المحلي
مطلوب دعم للجسر خارج مسار الراحة Ed25519.

## التواصل {#connect}

يتم تنفيذ العميل Connect في Swift المصدر، مع كريبتو ومدونات الإطار
مدعومة `NoritoBridge`:

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

`ConnectSession` معدات التحكم المفتوحة والغلقة، وقراءة الغلاف المشفر
المفاتيح التوجهية، وتحكم التدفق، وتدفقات الأحداث، وتدريبات التوازن، والتشخيص
المجلات.

## التغطية الحالية {#current-coverage}

(الـ) Swift يشتمل المصدر حالياً على:

- `ToriiClient` HTTP المساعدون في حسابات، وأصول، أسماء مستعار، صفحة المستكشفين
  RWA, العقود، متعددة الأطراف، الحوكمة، الاشتراكات، توافر البيانات
  الأصول السرية، وضع العقد/وقت التشغيل، الصحة، المقاييس، و SSE التيارات
- `IrohaSDK` بناء المعاملات ومساعدين في تقديم/مساعدة على التحويل، النقود،
  الحرق، الدروع، غير الدروع، ZK التحويل ZK تسجيل الأصول، البيانات المعدنية
  المطالبة بالتحديد، والتسجيل متعددة الألواح، وإرشادات الحوكمة
- دعم صف المعاملات المنتظر من خلال `PendingTransactionQueue` و
  `FilePendingTransactionQueue`
- عنوان الحساب و I105 المساعدين من خلال `AccountAddress` و `AccountId`
- إد25519، secp256k1 ML-DSA, BLS, GOST, و SM2 السطحات الموقعة، مع الأصلية
  دعم الجسر عند الضرورة
- إرشادات الاحتفاظ الأصلية بناء الحمولة المفيدة للسوق والجهالة
  الاحتفاظ
- التواصل WebSocket, الإطار، العملات الرقمية، الجلسة، الصفوف، إعادة التشغيل، والتشخيص
  المساعدين
- جاهزية كاغيموشا، إضافة المخطوطات والتكييف، حالة العملية، ملاحظة،
  حزمة الأقران والإيصالات QR نماذج التدفق
- SoraFS, إمكانية توفير البيانات، ومساعدون في إضافة الدليل

## API أمثلة {#api-examples}

الاستخدام `IrohaSwift/Sources/IrohaSwift` للتنفيذ العام
`IrohaSwift/Tests/IrohaSwiftTests` لتحديد النتائج المختبرة
مراجعة المصدر.

## إشارات مصدر {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
