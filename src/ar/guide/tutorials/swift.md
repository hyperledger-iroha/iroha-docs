---
translation_locale: ar
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift و iOS {#swift-and-ios}

(الـ) Swift SDK يتم إرسالها من قبل مساحة العمل الصعودية هي `IrohaSwift` Swift حزمة تحت `IrohaSwift/`. يحدد قائمة الحزمة ثلاثة منتجات المكتبة`IrohaSwift`, `IrohaSwiftMobileTransports`, و `IrohaSwiftTransferUI`ويهدف إلى iOS 15+ و macOS 12+ مع Swift الأدوات 5.9.

تعتمد الحزمة على الهدف الثنائي الأصلي `NoritoBridge`. تصحيح قرار الحزمة `../dist/NoritoBridge.xcframework` قبل البناء ، وتلقي مسارات المعاملات أو الاتصال بالعملات الرقمية أخطاء غير متوفرة عند عدم تحميل رموز الأصلية.

## Swift مدير الحزمة {#swift-package-manager}

عند التطوير ضد مساحة عمل تم تسجيلها ، اشرح SwiftPM في دليل الحزمة المحلي `IrohaSwift/`. هوية الحزمة المستخدمة من قبل `Package.swift` هي `IrohaSwift`:

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

قم بتعديل المسار لتطبيقك. لا تنسخ مسار `examples/ios/ConnectMinimalApp` الحالي كما هو؛ هذا المخطط يحل `../../IrohaSwift` إلى `examples/IrohaSwift`.

قبل حل الحزمة، تأكد من وجود الجسر في جذور مساحة العمل:

```bash
cd /path/to/iroha
make bridge-xcframework
```

هذا ينتج `dist/NoritoBridge.xcframework`؛ `IrohaSwift/Package.swift` يشير إليها باسم `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

يحتوي قاعدة الشفرة أيضًا على `IrohaSwift/IrohaSwift.podspec`. فإنه يعلن عن القنبلة `IrohaSwift` ، Swift 5.9 و iOS 15. سحب القنبلة المصادر Swift من المستودع الرئيسي. لا يزال يجب أن يكون الجسر الأصلي موجودًا ومرتبطًا لتشفير المعاملات وتوقيع غير Ed25519، وكريبتو Connect.

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

## جرب Taira القراءة فقط {#try-taira-read-only}

البدء بمساحة HTTP بسيطة للتأكد من أن الجهاز أو المحاكاة يمكن أن تصل إلى نقطة نهاية عامة Taira:

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

استخدم نفس الشيك `URLSession` لـ `https://taira.sora.org/v1/assets/definitions?limit=5` أثناء بناء UI وإعادة محاولة السلوك. الانتقال إلى `IrohaSDK` إرسال المساعدين فقط بعد أن يقوم التطبيق بتحميل مواد توقيع من مخزن آمن وتتم تمويل الحساب على Taira.

لإنشاء وتقديم المعاملة، استخدم المساعدين `IrohaSDK`. هؤلاء يطلقون على رمز المعاملات المحلي المدعوم بالجسر:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, و `UnshieldRequest` تأكيد الحساب الكنسي IDs وتعريف الأصول القائمة على قاعدة58 غير المحددة IDs قبل التوقيع

## الخصم الأصلي {#native-escrow}

Swift يقوم بإنشاء مساحة السوق وتعليمات الاحتفاظ بالأمانة المجهولة Norito JSON الحمولة المفيدة من خلال `NativeEscrowInstructionBuilders` أو ما يعادلها `IrohaSDK.build*Escrow*` المساعدين. [الاحتفاظ بالأصول الأصلية](/ar/blockchain/escrow.md#swift-and-ios) على سبيل المثال، حقول إثبات مجهولة، و رمز إذن حل النزاع.

## التوقيع {#signing}

`Keypair` هو الراحة Ed25519 API. بالنسبة إلى خوارزميات أخرى، قم ببناء `IrohaSDK` باستخدام `defaultSigningAlgorithm` واستخدم `generateSigningKey()` أو `signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

يحتوي `SigningAlgorithm` enum حاليًا على Ed25519, secp256k1, BLS المتغيرات الطبيعية والصغيرة، ML-DSA، GOST مجموعات المعلمات R 34.10-2012, و SM2. مطلوب دعم الجسر الأصلي خارج مسار الراحة ED25519.

## التواصل {#connect}

يتم تنفيذ عميل Connect في مصدر Swift ، مع كوديكات العملات الرقمية والإطار المدعومة من قبل `NoritoBridge`:

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

`ConnectSession` يتعامل مع التحكمات المفتوحة والغلقة، قراءة الغلاف المشفرة، مفاتيح الاتجاه، تحكم التدفق، تدفق الأحداث، تدفق التوازن، ومجلات التشخيص.

## التغطية الحالية {#current-coverage}

المصدر Swift يشمل حالياً:

- `ToriiClient` HTTP مساعدي الحسابات، الأصول، الأسماء المستعارة، صفحات المستكشفين، RWA، العقود، multisig، الحوكمة، الاشتراكات، توافر البيانات، أصول سرية، وضع العقدة/وقت التشغيل، الصحة، المعايير، وتدفقات SSE.
- `IrohaSDK` صانعي المعاملات ومساعدين في تقديم/إجراء الاستطلاعات للتحويل والعقاقير والحرق والدرع وعدم الحماية ZK التحويل، ZK تسجيل الأصول، البيانات المعدنية، المطالبة بالتعرف، تسجيل متعددة العلامات والإرشادات الحوكمة.
- دعم صف المعاملات المنتظر من خلال `PendingTransactionQueue` و `FilePendingTransactionQueue`
- عنوان الحساب ومساعدين I105 عبر `AccountAddress` و `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST, و SM2 سطحات التوقيع، مع دعم جسر محلي عند الضرورة.
- إرشادات الاحتفاظ بالأمانة الأصلية مُبني الحمولة المفيدة للسوق والاحتفاظ بالميانة المجهولة
- ربط WebSocket ، الإطار، العملات الرقمية، الجلسة، الصف، إعادة التشغيل، ومساعدات التشخيص.
- إعداد كاغيموشا ، وتكملات المخطوطة والتكييف ، وحالة التشغيل ، والملاحظة ، ومجموعة الأقران ، والحصول ، ونماذج سلسلة QR
- SoraFS ، مساعدة في توفير البيانات، ومساعدة في إصدار الدليل.

## API مثال {#api-examples}

استخدام `IrohaSwift/Sources/IrohaSwift` للتنفيذ العام و `IrohaSwift/Tests/IrohaSwiftTests` لمثال الاستخدام المختبر من نفس إصدار المصدر.

## إشارات مصدر {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
