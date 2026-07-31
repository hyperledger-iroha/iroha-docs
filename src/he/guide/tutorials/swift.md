---
translation_locale: he
translation_source: /guide/tutorials/swift.md
translation_source_hash: 85cc94399b9892984615bf8a0821a1f30395eb87ec164592ca98fbd9903ef834
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift ו-iOS {#swift-and-ios}

ה- Swift SDK הנשלח על ידי החלל העבודה העליון הוא `IrohaSwift` Swift
חבילה תחת `IrohaSwift/`. מסמך החבילה שלו מגדיר שלוש ספרות
מוצרים`IrohaSwift`, `IrohaSwiftMobileTransports`, ו
`IrohaSwiftTransferUI`ולכו למטרות iOS 15+ ו-macOS 12+ עם Swift כלים 5.9.

החבילה תלויה במקור `NoritoBridge` מטרה דונית.
אישור החלטה `../dist/NoritoBridge.xcframework` לפני בנייה, ו
העסקה או קישור כריפטו דרכים לזרוק גשר לא זמינים טעויות כאשר
סמלים מקומיים לא טעון.

## Swift מנהל החבילה {#swift-package-manager}

כאשר מתפתחים נגד חלל עבודה מסודר, נקודה SwiftPM בבית הספר המקומי
`IrohaSwift/` תיק המשלוח. זהות המשלוח המשמשת על ידי
`Package.swift` הוא `IrohaSwift`:

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

תעדור את הנתיב עבור האפליקציה שלך. אל תיקפו את הזרם
`examples/ios/ConnectMinimalApp` דרך כפי שהיא; כי מופע פותר
`../../IrohaSwift` ל `examples/IrohaSwift`.

לפני פתרון החבילה, לוודא שהגשר קיים בשורש חלל העבודה:

```bash
cd /path/to/iroha
make bridge-xcframework
```

זה מייצר `dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift`
מתייחסת לזה כ `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

בסיס הקוד כולל גם `IrohaSwift/IrohaSwift.podspec`. הוא מכריז על
`IrohaSwift` קופסה, Swift 5.9, ו-iOS 15. Swift מקורות
האספנה הראשית; הגשר המקומי עדיין חייב להיות נוכח וקשור ל
קודי עסקה, חתימה שאינה ED25519, וConnect crypto.

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

## נסה. Taira רק קריאה {#try-taira-read-only}

תתחילו עם רמה. HTTP סופדה כדי לאשר את המכשיר או סימולטור יכול להגיע
ציבורי Taira נקודת סוף:

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

השתמשו באותה `URLSession` בדקה
`https://taira.sora.org/v1/assets/definitions?limit=5` בזמן שאתה בונה
UI ולנסות שוב את ההתנהגות. `IrohaSDK` להגיש עוזרים רק לאחר
האפליקציה מצלמת חומרי החותמים מאחסון בטוח והחשבון ממומן
Taira.

כדי לבנות ולגיש עסקאות, השתמשו `IrohaSDK` עוזרים. אלה קוראים
קודר עסקה מקורי, בעלת תמיכה בברג:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, ו
`UnshieldRequest` אישור חשבון קנוני IDs ובלתי מקובל קנוני
הגדרה של נכס Base58 IDs לפני החתימה.

## חוב משכנתא מקומי {#native-escrow}

Swift בונה את השוק והנחיות הבנקאות אנונימיות Norito JSON
מטענים שימושיים דרך `NativeEscrowInstructionBuilders` או שווה ערך
`IrohaSDK.build*Escrow*` עוזרים.
[אסיטום נטיב](/he/blockchain/escrow.md#swift-and-ios) לדוגמאות,
שדות הוכחה אנונימיים, ואת סימן רשות פתרון מחלוקת.

## חתימה {#signing}

`Keypair` האם הנוחות של Ed25519 API. עבור אלגוריתמים אחרים, לבנות
`IrohaSDK` עם `defaultSigningAlgorithm` ושימוש `generateSigningKey()` או
`signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

ה- `SigningAlgorithm` enum כולל כיום Ed25519, secp256k1, BLS נורמלי
וצרכים קטנים, ML-DSA, GOST R 34.10-2012 קבוצות פרמטרים, ו SM2. ילידי
תמיכה בגשר נדרשת מחוץ למסלול הנוחות Ed25519.

## חיבור {#connect}

הלקוח Connect מיועד ב Swift מקור, עם קודקים קריפטו וקרם
תמיכה `NoritoBridge`:

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

`ConnectSession` מחזיקים פותחים וסגורים, קוויטציה של מעטפה מוצפנת,
מפתחות כיוון, בקרת זרימה, זרמי אירועים, זרמי איזון ודיאגנסטיקה
עיתונים.

## כיסוי הנוכחי {#current-coverage}

ה- Swift המקור כולל כיום:

- `ToriiClient` HTTP עוזרים לחשבונות, נכסים, כינויים, דפים של חוקרים,
  RWA, חוזים, מרובות סיג', ממשל, חתימות, זמינות נתונים,
  נכסים סודיים, מצב הערך/זמן ההפעלה, בריאות, מדידות, ו SSE זרימים
- `IrohaSDK` בונים עסקאות ועוזרים להגיש/הצבעה עבור העברה, מנטה,
  כווית, מגן, ללא מגן, ZK העברה, ZK רישום נכסים, מטא-נתונים,
  דרישות לזהות, רישום רב סיג ומנחיות לניהול
- תמיכה בשורה של עסקאות מחופשת `PendingTransactionQueue` ו
  `FilePendingTransactionQueue`
- כתובת החשבון I105 עוזרים דרך `AccountAddress` ו `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST, ו SM2 שטחי חתימה, עם ילידים
  תמיכה בגשר, אם זה נחוץ
- נתיב הוראות סקרו בונה משאית עבור שוק ומוגוון
  סכום כספי
- חיבור WebSocket, קישור, קריפטו, ישיבה, בתור, שידור ושוב ודיאגנסטיקה
  עוזרים
- הכנות של Kagemusha, תוספת וחיסוי טייפ, מצב הפעולה, הערה,
  חבילה משותפת, קבלה ו QR דוגמאות זרם
- SoraFS, אמצעי סיוע לקיבלת נתונים, וחיבור ראיות

## API דוגמאות {#api-examples}

שימוש `IrohaSwift/Sources/IrohaSwift` לממשלת הציבור ו
`IrohaSwift/Tests/IrohaSwiftTests` לדוגמאות השימוש שנבדקו מאותו
תיקון מקור.

## ראיות מקור {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
