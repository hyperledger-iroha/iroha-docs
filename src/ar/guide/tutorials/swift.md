---
translation_locale: ar
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Swift ونظام iOS {#swift-and-ios}

تم شحن Swift SDK من مساحة العمل العليا وهو حزمة `IrohaSwift` Swift تحت `IrohaSwift/`. يحدد بيان الحزمة الفني الخاص بها ثلاثة منتجات مكتبية — `IrohaSwift` و`IrohaSwiftMobileTransports` و`IrohaSwiftTransferUI` — ويستهدف iOS 15+ و macOS 12+ باستخدام أدوات Swift 5.9.

تعتمد الحزمة على الهدف الثنائي المحلي `NoritoBridge`. تتحقق عملية حل الحزمة من `../dist/NoritoBridge.xcframework` قبل البناء، وتؤدي مسارات المعاملات أو الاتصال المشفر إلى الأخطاء bridge-unavailable عندما لا يتم تحميل الرموز المحلية.

## Swift مدير الحزم {#swift-package-manager}

عند التطوير ضد مساحة عمل تم سحبها، وجه SwiftPM إلى دليل حزمة `IrohaSwift/` المحلي. هوية الحزمة المستخدمة بواسطة `Package.swift` هي `IrohaSwift`:

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

قم بضبط المسار لتطبيقك. لا تنسخ المسار الحالي `examples/ios/ConnectMinimalApp` كما هو؛ هذا البيان الفني يحل `../../IrohaSwift` إلى `examples/IrohaSwift`.

قبل حل الحزمة، تأكد من أن الجسر موجود في جذر مساحة العمل:

```bash
cd /path/to/iroha
make bridge-xcframework
```

هذا ينتج `dist/NoritoBridge.xcframework`؛ `IrohaSwift/Package.swift` يشير إليه باعتباره `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

يحتوي قاعدة الشيفرة أيضًا على `IrohaSwift/IrohaSwift.podspec`. يعلن عن البود `IrohaSwift`، Swift 5.9، وiOS 15. يقوم ملف البودسبيك بسحب المصادر Swift من المستودع الرئيسي؛ لا يزال من الضروري وجود الجسر الأصلي وربطه لترميز المعاملات، والتوقيع غير Ed25519، والتشفير باستخدام Connect.

## البدء السريع {#quickstart}

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

## حاول Taira للقراءة فقط {#try-taira-read-only}

ابدأ بمسبار عادي HTTP لتأكيد أن الجهاز أو المحاكي يمكنه الوصول إلى نقطة النهاية العامة Taira API:

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

استخدم نفس فحص `URLSession` لـ `https://taira.sora.org/v1/assets/definitions?limit=5` أثناء بناء UI وسلوك إعادة المحاولة. انتقل إلى مساعدي الإرسال `IrohaSDK` فقط بعد أن يقوم التطبيق بتحميل مواد توقيع التشفير من التخزين الآمن ويتم تمويل الحساب على Taira.

لبناء معاملة وإرسالها، استخدم المساعدين `IrohaSDK`. هذه تستدعي مشفر المعاملة المدعوم بالجسر الأصلي:

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

`TransferRequest` و `MintRequest` و `BurnRequest` و `ShieldRequest` و `UnshieldRequest` تتحقق من صحة معرفات الحساب القياسية ومعرفات تعريف الأصول Base58 غير المسبوقة القياسية قبل التوقيع.

## الضمان المحلي {#native-escrow}

Swift يقوم ببناء السوق وتعليمات الضمان المجهول الهوية كحزم Norito JSON عبر `NativeEscrowInstructionBuilders` أو المساعدين المعادلين `IrohaSDK.build*Escrow*`. انظر [ضمان الأصل الأصلي](/ar/blockchain/escrow.md#swift-and-ios) للأمثلة وحقول الإثبات المجهول وهوية رمز إذن محل النزاع.

## التوقيع {#signing}

`Keypair` هو ملحق الراحة لـ Ed25519 API. بالنسبة للخوارزميات الأخرى، قم بإنشاء `IrohaSDK` باستخدام `defaultSigningAlgorithm` واستخدم `generateSigningKey()` أو `signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

تشمل تعداد `SigningAlgorithm` حاليًا Ed25519، secp256k1، المتغيرات العادية والصغيرة BLS، ML-DSA، مجموعات المعلمات R 34.10-2012 GOST، و SM2. يتطلب الدعم الأصلي للجسر خارج مسار الراحة Ed25519.

## اتصل {#connect}

تم تنفيذ عميل Connect في مصدر Swift، مع تشفير وبرمجيات ترميز الإطارات مدعومة من `NoritoBridge`:

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

`ConnectSession` يتعامل مع عناصر التحكم في الفتح والإغلاق، وقراءات حاوية البيانات المشفرة، ومفاتيح الاتجاه، والتحكم في التدفق، وتدفقات الأحداث، وتدفقات الرصيد، وسجلات التشخيص.

## التغطية الحالية {#current-coverage}

مصدر Swift يشمل حالياً:

- `ToriiClient` HTTP مساعدين للحسابات، الأصول، الأسماء المستعارة، صفحات المستكشف، RWA، العقود، التوقيعات المتعددة، الحوكمة، الاشتراكات، توفر البيانات، الأصول السرية، حالة العقد/الخادم، الصحة، المقاييس، و SSE التدفقات
- `IrohaSDK` منشئو المعاملات ومساعدو الإرسال/الاستطلاع للتحويل، الإصدار، الحرق، التشفير، فك التشفير، ZK التحويل، ZK تسجيل الأصول، البيانات الوصفية، مطالبات المعرف، تسجيل التوقيعات المتعددة، وتعليمات الحوكمة
- دعم قائمة انتظار المعاملات المعلقة عبر `PendingTransactionQueue` و `FilePendingTransactionQueue`
- عنوان الحساب و I105 المساعدين من خلال `AccountAddress` و`AccountId`
- أسطح التوقيع Ed25519 وsecp256k1 و ML-DSA و BLS و GOST و SM2، مع دعم جسر أصلي حيثما كان مطلوبًا
- بناة حمولة تعليمات الاحتجاز الأصلي للسوق والاحتجاز المجهول
- الاتصال بـ WebSocket، الإطار، التشفير، الجلسة، الطابور، الإعادة، وأدوات التشخيص
- استعداد كاجيموشا، تعبئة ورقية واسترداد، حالة العملية، ملاحظة، حزمة النظراء في الشبكة، سجل نتائج البروتوكول، ونماذج التدفق QR
- SoraFS، توافر البيانات، ومساعدو إرفاق الأدلة

## API أمثلة {#api-examples}

استخدم `IrohaSwift/Sources/IrohaSwift` للتنفيذ العام و`IrohaSwift/Tests/IrohaSwiftTests` لأمثلة الاستخدام المختبرة من نفس مراجعة المصدر.

## المراجع المصدرية {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
