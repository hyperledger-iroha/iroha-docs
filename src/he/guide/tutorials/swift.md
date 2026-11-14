---
translation_locale: he
translation_source: /guide/tutorials/swift.md
translation_source_hash: 753ce1b5e0de4eae56b38e77962566b23fee56d4662a432a7bbe6ea807261422
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
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

התאימו את הנתיב ליישום שלכם. ‏`examples/ios/ConnectMinimalApp/Package.swift` מציג את אותה תלות עם הנתיב היחסי `../../../IrohaSwift`.

לפני פתרון החבילה, בנו את הגשר המקורי הנוכחי. לפיתוח ולבדיקות מקומיים, הריצו את הפקודה הזו משורש סביבת העבודה:

```bash
cd /path/to/iroha
python3.12 scripts/test_swift_local.py
```

בניות שחרור מפיקות את `dist/NoritoBridge.xcframework` באמצעות `make bridge-xcframework`, הדורשת את `SOURCE_DATE_EPOCH`, ‏`NORITO_BRIDGE_OUT_DIR`, ‏`NORITO_BRIDGE_BUILD_DIR`, ‏`NORITO_BRIDGE_ARCHIVE_OUTPUT` ו־`MOBILE_SDK_CARGO_LOCKFILE`. ‏`IrohaSwift/Package.swift` מפנה אל הגשר בתור `../dist/NoritoBridge.xcframework`.

## התחלה מהירה {#quickstart}

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

`TransferRequest`, ‏`MintRequest` ו־`BurnRequest` מאמתים מזהי חשבון קנוניים ומזהי הגדרות נכסים קנוניים בקידוד Base58 ללא קידומת לפני החתימה.

## משכנתא מקומי {#native-escrow}

Swift בונה הוראות נאמנות שוק כמטעני Norito JSON באמצעות `NativeEscrowInstructionBuilders` או עזרי `IrohaSDK.build*Escrow*` המקבילים. ראו [נאמנות נכסים מובנית](/he/blockchain/escrow.md#swift-and-ios) לדוגמאות ולאסימון ההרשאה לפתרון מחלוקות.

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

let keyPair = try ConnectCrypto.generateKeyPair()
let session = try ConnectSession(
    networkID: try NetworkId(literal: "<exact-network-id>"),
    appPublicKey: keyPair.publicKey,
    nonce: nonce,
    relayToken: "<token>",
    client: client
)
```

`ConnectSession` מטפל בפיקוחים פתוחים וסגורים, קריאת קספת מוצפנת, מפתחות כיוון, בקרת זרימה, זרמי אירועים, זרמים של יתרה, וכתבי דיאגנוסטיקה.

## הכיסוי הנוכחי {#current-coverage}

מקור Swift כולל כיום:

- `ToriiClient` HTTP עוזרים לחשבונות, נכסים, שם כינוי, דפים של חוקר, RWA, חוזים, מלטסיג, ממשל, מחברות, זמינות נתונים, נכסים סודיים, מצב הערך/זמן הפעלה, בריאות, מדידות, וזרמים SSE
- בוני עסקאות של `IrohaSDK` ועזרי הגשה ובדיקת מצב חוזרת עבור העברה, הנפקה, שריפה, רישום נכסי ZK, מטא־נתונים, תביעות מזהים, רישום ריבוי חתימות, פריסת חוזים והצבעות ממשל
- תמיכה בשורה של עסקאות בהמתנה דרך `PendingTransactionQueue` ו `FilePendingTransactionQueue`
- כתובת חשבון ועוזרי I105 באמצעות `AccountAddress` ו `AccountId`
- גבי חתימה Ed25519, secp256k1, ML-DSA, BLS, GOST ו SM2, עם תמיכה בישר מקומית, כאשר זה נחוץ.
- הוראות אבטחה מקומית לבניית מטען נתונים לשוק ואבטחה אנונימית
- חיבור WebSocket, מסגרת, קריפטו, ישיבה, בתור, חזרה, ועוזרי דיאגנסטיקה
- כלי עזר לפורמט התעבורה KAGEMUSHA V1 ומתאם פלטפורמת iPhone לספק Advance של הארנק הניטיבי, להרשמה, להתאוששות ולקריאות החלפה שאושרו לקבלה
- SoraFS, סיועי זמינות הנתונים וחיבורת ראיות

## API דוגמא {#api-examples}

השתמש `IrohaSwift/Sources/IrohaSwift` ליישום ציבורי ו `IrohaSwift/Tests/IrohaSwiftTests` לדוגמאות השימוש שנבדקו מאותו תיקון מקורות.

## מקורות ראיות {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
