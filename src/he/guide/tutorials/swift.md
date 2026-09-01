---
translation_locale: he
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift ו-iOS {#swift-and-ios}

ה- Swift SDK שנשלח על ידי חלל העבודה העליון הוא החבילה `IrohaSwift` Swift תחת `IrohaSwift/`. מוניפסט החבילה שלו מגדיר שלושה מוצרי ספריה `IrohaSwift`, `IrohaSwiftMobileTransports`, ו `IrohaSwiftTransferUI`, ומטרת ל- iOS 15+ ו- macOS 12+ עם כלים של Swift 5.9.

החבילה תלויה ביעד הבינארי המובנה `NoritoBridge`. פתרון התלויות של החבילה מאמת את `../dist/NoritoBridge.xcframework` לפני הבנייה, ונתיבי ההצפנה של עסקאות או Connect זורקים שגיאות bridge-unavailable כאשר הסמלים המובנים אינם טעונים.

## Swift מנהל חבילה {#swift-package-manager}

כאשר מתפתחים נגד חלל עבודה שנבדק, ציינו SwiftPM בתיאוריה המקומית של החבילה `IrohaSwift/`. זהות החבילה המשמשת על ידי `Package.swift` היא `IrohaSwift`:

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

התאימו את הנתיב ליישום שלכם. אל תעתיקו את הנתיב הנוכחי `examples/ios/ConnectMinimalApp` כמות שהוא; מניפסט זה פותר את `../../IrohaSwift` אל `examples/IrohaSwift`.

לפני פתרון החבילה, ודא שהגשר קיים בשורש חלל העבודה:

```bash
cd /path/to/iroha
make bridge-xcframework
```

זה מייצר `dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift` מתייחס אליו כ `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

בסיס הקוד כולל גם `IrohaSwift/IrohaSwift.podspec`. הוא מכריז על `IrohaSwift` קופסה, Swift 5.9, ו-iOS 15. הפודספיק מושך Swift מקורות מאגף הראשי; הגשר המקומי עדיין חייב להיות נוכח וקשורים לקוד העסקאות, חתימה שאינה Ed25519, וConnect crypto.

## התחלה מהירה {#quickstart}

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

## נסה Taira לקרוא בלבד {#try-taira-read-only}

התחל עם סונדה פשוטה HTTP כדי לאשר כי המכשיר או הסימולטור יכולים להגיע לנקודה הסופית Taira הציבורית:

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

השתמש באותו צ'ק `URLSession` עבור `https://taira.sora.org/v1/assets/definitions?limit=5` בזמן שאתה בונה UI ולנסות מחדש את התנהגותך. לעבור ל `IrohaSDK` לשלוח עוזרים רק לאחר שהיישום משאיר חומר חתימה מאחסון בטוח והחשבונך מיומן על Taira.

כדי לבנות ולשלוח עסקאות, השתמשו בעוזרי `IrohaSDK`. הם קוראים לקודר העסקות המקומי בעלת תמיכה בשר:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest` ו `UnshieldRequest` מסכימים את החשבון הקנוני IDs והגדרת נכס Base58 הלא מקובלת קנונית IDs לפני חתימה.

## משכנתא מקומי {#native-escrow}

Swift בונה הוראות שוק ושל אבטחה אנונימית כצריכים מועילים של Norito JSON באמצעות `NativeEscrowInstructionBuilders` או עוזרים הוותיקים `IrohaSDK.build*Escrow*`. ראה [ אבטחת נכסים מקומיים ](/he/blockchain/escrow.md#swift-and-ios) לדוגמאות, שדות הוכחה אנונימיים, ואת סימן רשות פתרון מחלוקת.

## חתימה {#signing}

`Keypair` הוא הנוחות של Ed25519 API. עבור אלגוריתמים אחרים, תבנה `IrohaSDK` עם `defaultSigningAlgorithm` ותשתמש ב `generateSigningKey()` או `signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

ה- `SigningAlgorithm` enum כולל כיום את Ed25519, secp256k1, BLS גרסאות נורמליות וקטנות, ML-DSA, GOST R 34.10-2012 קבוצות פרמטרים, ו SM2. תמיכה גשר מקומית נדרשת מחוץ למסלול הנוחות של Ed25519.

## חיבור {#connect}

לקלינט Connect מתבצע במקור Swift, עם קודקים קריפטו ומסגרת תומכים ב- `NoritoBridge`:

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

`ConnectSession` מטפל בפיקוחים פתוחים וסגורים, קריאת קספת מוצפנת, מפתחות כיוון, בקרת זרימה, זרמי אירועים, זרמים של יתרה, וכתבי דיאגנוסטיקה.

## הכיסוי הנוכחי {#current-coverage}

מקור Swift כולל כיום:

- `ToriiClient` HTTP עוזרים לחשבונות, נכסים, שם כינוי, דפים של חוקר, RWA, חוזים, מלטסיג, ממשל, מחברות, זמינות נתונים, נכסים סודיים, מצב הערך/זמן הפעלה, בריאות, מדידות, וזרמים SSE
- `IrohaSDK` בונים עסקאות ועוזרים להגיש/הצבעה עבור העברה, הנפקה, שריפה, כיסוי, ללא כיסוי. ZK העברה, ZK רישום נכסים, מטא-מנתונים, דרישות מזהה, רישום רב סיג, הוראות לניהול.
- תמיכה בשורה של עסקאות בהמתנה דרך `PendingTransactionQueue` ו `FilePendingTransactionQueue`
- כתובת חשבון ועוזרי I105 באמצעות `AccountAddress` ו `AccountId`
- גבי חתימה Ed25519, secp256k1, ML-DSA, BLS, GOST ו SM2, עם תמיכה בישר מקומית, כאשר זה נחוץ.
- הוראות אבטחה מקומית לבניית מטען נתונים לשוק ואבטחה אנונימית
- חיבור WebSocket, מסגרת, קריפטו, ישיבה, בתור, חזרה, ועוזרי דיאגנסטיקה
- הכנות של Kagemusha, תוספת וחיסוי טייפ, מצב הפעולה, פתק, חבילת צמתים, קבלה ומודלים של זרם QR
- SoraFS, סיועי זמינות הנתונים וחיבורת ראיות

## API דוגמא {#api-examples}

השתמש `IrohaSwift/Sources/IrohaSwift` ליישום ציבורי ו `IrohaSwift/Tests/IrohaSwiftTests` לדוגמאות השימוש שנבדקו מאותו תיקון מקורות.

## מקורות ראיות {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
