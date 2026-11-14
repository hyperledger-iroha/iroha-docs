---
translation_locale: ar
translation_source: /guide/tutorials/swift.md
translation_source_hash: 753ce1b5e0de4eae56b38e77962566b23fee56d4662a432a7bbe6ea807261422
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
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

اضبط المسار لتطبيقك. يعرض `examples/ios/ConnectMinimalApp/Package.swift` الاعتمادية نفسها بالمسار النسبي `../../../IrohaSwift`.

قبل حل الحزمة، ابنِ الجسر الأصلي الحالي. للتطوير والاختبارات المحلية، شغّل هذا من جذر مساحة العمل:

```bash
cd /path/to/iroha
python3.12 scripts/test_swift_local.py
```

تُنتج إصدارات النشر `dist/NoritoBridge.xcframework` باستخدام `make bridge-xcframework`، الذي يتطلب `SOURCE_DATE_EPOCH` و`NORITO_BRIDGE_OUT_DIR` و`NORITO_BRIDGE_BUILD_DIR` و`NORITO_BRIDGE_ARCHIVE_OUTPUT` و`MOBILE_SDK_CARGO_LOCKFILE`. ويشير `IrohaSwift/Package.swift` إلى الجسر باسم `../dist/NoritoBridge.xcframework`.

## البدء السريع {#quickstart}

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

## حاول Taira للقراءة فقط {#try-taira-read-only}

ابدأ بفحص HTTP بسيط للتأكد من أن الجهاز أو المحاكي يستطيع الوصول إلى نقطة نهاية Taira العامة:

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

تتحقق `TransferRequest` و`MintRequest` و`BurnRequest` من صحة معرفات الحسابات القياسية ومعرفات تعريف الأصول القياسية بصيغة Base58 دون بادئة قبل التوقيع.

## الضمان المحلي {#native-escrow}

يبني Swift تعليمات ضمان السوق كحمولات Norito JSON عبر `NativeEscrowInstructionBuilders` أو المساعدات المكافئة `IrohaSDK.build*Escrow*`. انظر [ضمان الأصل الأصلي](/ar/blockchain/escrow.md#swift-and-ios) للأمثلة ورمز إذن محكّم النزاع.

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

let keyPair = try ConnectCrypto.generateKeyPair()
let session = try ConnectSession(
    networkID: try NetworkId(literal: "<exact-network-id>"),
    appPublicKey: keyPair.publicKey,
    nonce: nonce,
    relayToken: "<token>",
    client: client
)
```

`ConnectSession` يتعامل مع عناصر التحكم في الفتح والإغلاق، وقراءات حاوية البيانات المشفرة، ومفاتيح الاتجاه، والتحكم في التدفق، وتدفقات الأحداث، وتدفقات الرصيد، وسجلات التشخيص.

## التغطية الحالية {#current-coverage}

مصدر Swift يشمل حالياً:

- `ToriiClient` HTTP مساعدين للحسابات، الأصول، الأسماء المستعارة، صفحات المستكشف، RWA، العقود، التوقيعات المتعددة، الحوكمة، الاشتراكات، توفر البيانات، الأصول السرية، حالة العقد/الخادم، الصحة، المقاييس، و SSE التدفقات
- منشئو المعاملات في `IrohaSDK` ومساعدو الإرسال/الاستطلاع للتحويل، والإصدار، والحرق، وتسجيل أصول ZK، والبيانات الوصفية، ومطالبات المعرفات، وتسجيل التوقيعات المتعددة، ونشر العقود، وبطاقات اقتراع الحوكمة
- دعم قائمة انتظار المعاملات المعلقة عبر `PendingTransactionQueue` و `FilePendingTransactionQueue`
- عنوان الحساب و I105 المساعدين من خلال `AccountAddress` و`AccountId`
- أسطح التوقيع Ed25519 وsecp256k1 و ML-DSA و BLS و GOST و SM2، مع دعم جسر أصلي حيثما كان مطلوبًا
- بناة حمولة تعليمات الاحتجاز الأصلي للسوق والاحتجاز المجهول
- الاتصال بـ WebSocket، الإطار، التشفير، الجلسة، الطابور، الإعادة، وأدوات التشخيص
- أدوات تنسيق النقل المساعدة لـKAGEMUSHA V1 ومحوّل منصة iPhone لمزوّد Advance الأصلي للمحفظة، والتسجيل والاسترداد واستدعاءات التبادل المقبولة
- SoraFS، توافر البيانات، ومساعدو إرفاق الأدلة

## API أمثلة {#api-examples}

استخدم `IrohaSwift/Sources/IrohaSwift` للتنفيذ العام و`IrohaSwift/Tests/IrohaSwiftTests` لأمثلة الاستخدام المختبرة من نفس مراجعة المصدر.

## المراجع المصدرية {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
