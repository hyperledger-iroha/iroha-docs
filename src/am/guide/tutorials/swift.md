---
translation_locale: am
translation_source: /guide/tutorials/swift.md
translation_source_hash: 85cc94399b9892984615bf8a0821a1f30395eb87ec164592ca98fbd9903ef834
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift እና iOS {#swift-and-ios}

የ Swift SDK ወደ ኋላ የስራ ቦታ ተልኳል ነው `IrohaSwift` Swift
የታሸገ `IrohaSwift/`. የፓኬጅ ማኒፌስት ሶስት ቤተ መጻሕፍትን ይገልጻል
ምርቶች`IrohaSwift`, `IrohaSwiftMobileTransports`, እና
`IrohaSwiftTransferUI`እና iOS 15+ እና macOS 12+ ላይ ያተኮረ ነው Swift 9

ጥቅሉ በአካባቢው የሚገኘው `NoritoBridge` የሁለትዮሽ ዒላማ።
የቅደም ተከተል ማረጋገጫ `../dist/NoritoBridge.xcframework` ከመገንባቱ በፊት እና
ግብይት ወይም አገናኝ crypto መንገዶች ድልድይ-የማይገኝ ስህተቶች ጣል ጊዜ
የአገሬው ተወላጅ ምልክቶች አልተጫኑም።

## Swift የፓኬጅ አስተዳዳሪ {#swift-package-manager}

በቼክ-out የሥራ ቦታ ላይ በማዘጋጀት ጊዜ, ነጥብ SwiftPM በአካባቢው
`IrohaSwift/` የፓኬጅ ማውጫ
`Package.swift` ነው `IrohaSwift`:

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

የመተግበሪያህን መንገድ ማስተካከል
`examples/ios/ConnectMinimalApp` መንገድ እንደ-የሆነ; ይህ ግልጽ መፍትሄ
`../../IrohaSwift` ወደ `examples/IrohaSwift`.

ጥቅሉን ከመፍታትዎ በፊት ድልድዩ በስራ ቦታ ሥር ላይ እንዳለ ያረጋግጡ:

```bash
cd /path/to/iroha
make bridge-xcframework
```

ይህ ያመነጫል `dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift`
" ብሎ ይጠቅሳል `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

የኮድ መሰረት ደግሞ ያካትታል `IrohaSwift/IrohaSwift.podspec`. ይህ ይገልጻል
`IrohaSwift` ካፕል፣ Swift 9 እና iOS 15. የ podspec ይጎትታል Swift ምንጮች
ዋናው ማከማቻ; የአገር ውስጥ ድልድይ አሁንም መቅረብ አለበት
የግብይት ኢንኮዲንግ፣ ኤድ 25519 ያልሆነ ፊርማ እና Connect crypto.

## ፈጣን ጅምር {#quickstart}

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

## ይሞክሩ Taira የንባብ ብቻ {#try-taira-read-only}

ከቀላል ይጀምሩ HTTP መሣሪያው ወይም ሲሚዩተር ወደ
የሕዝብ Taira የመጨረሻ ነጥብ:

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

ተመሳሳይ ይጠቀሙ `URLSession` ለ
`https://taira.sora.org/v1/assets/definitions?limit=5` እናንተ ግንባታ እያደረጋችሁ ሳለ
UI እና እንደገና ባህሪ ይሞክሩ. `IrohaSDK` ረዳቶችን ማቅረብ የሚችሉት
መተግበሪያው የተረጋገጠ ማከማቻ ከ ፊርማ ቁሳቁስ ይጫናል እና ሂሳቡ በ
Taira.

አንድ ግብይት ለመገንባት እና ለማቅረብ, `IrohaSDK` ረዳቶች፣ እነዚህም
የተቋቋመ ድልድይ-ተደገፈ የግብይት ኮደር

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, እና
`UnshieldRequest` የካኖኒክ ሂሳብ ማረጋገጫ IDs እና ቀኖናዊ ያልሆነ
Base58 የአክሲዮን ትርጉም IDs ከመፈረምዎ በፊት።

## የአገር ውስጥ የዋስትና ገንዘብ {#native-escrow}

Swift የገበያ ቦታ እና ስም አልባ የኤስሮ መመሪያዎችን እንደ Norito JSON
በጠቅላላ ጭነት `NativeEscrowInstructionBuilders` ወይም ተመጣጣኝ
`IrohaSDK.build*Escrow*` ረዳቶች።
[የአገር ውስጥ ንብረት ማስከበሪያ](/am/blockchain/escrow.md#swift-and-ios) ለምሳሌ ያህል፣
የማይታወቁ ማስረጃ መስኮች፣ እና የግጭት መፍቻ ፈቃድ ምልክት።

## ፊርማ {#signing}

`Keypair` የ Ed25519 ምቾት ነው API. ለሌሎች ስልተ ቀመሮች, አንድ መገንባት
`IrohaSDK` ጋር `defaultSigningAlgorithm` እና አጠቃቀም `generateSigningKey()` ወይም
`signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

የ `SigningAlgorithm` enum በአሁኑ ጊዜ Ed25519፣ secp256k1ን ያካትታል፤ BLS መደበኛ
እና ትናንሽ ቅይረቶች፣ ML-DSA, GOST R 34.10-2012 የፓራሜትር ስብስቦች, እና SM2. ተወላጅ
ከኤድ 25519 ምቾት መንገድ ውጭ የድልድይ ድጋፍ ያስፈልጋል ።

## አገናኝ {#connect}

የ "Connect" ደንበኛ በ Swift ምንጭ ፣ ከ ‹crypto› እና ከ ‹frames› ኮዴኮች ጋር
የተደገፈ `NoritoBridge`:

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

`ConnectSession` ክፍት እና የቅርብ መቆጣጠሪያዎች, የተመሰጠረ ፖስታን ያነባል,
አቅጣጫ ቁልፎች, ፍሰት ቁጥጥር, ክስተት ዥረቶች, ሚዛን ዥረቶችን, እና ምርመራ
መጽሔቶች።

## ወቅታዊ ሽፋን {#current-coverage}

የ Swift ምንጭ በአሁኑ ጊዜ የሚከተሉትን ያካትታል:

- `ToriiClient` HTTP ለሂሳቦች፣ ንብረቶች፣ ስያሜዎች፣ የስለላ ገጾች፣
  RWA, ውል፣ ባለብዙ ስምምነት፣ አስተዳደር፣ ምዝገባዎች፣ የመረጃ ተደራሽነት
  ሚስጥራዊ ሀብቶች፣ የአገናኝ/የስራ ሰዓት ሁኔታ፣ ጤና፣ መለኪያዎች እና SSE ወንዞች
- `IrohaSDK` የግብይት ገንቢዎች እና ለሽያጭ የሚያቀርቡ/የሚመረጡ ረዳቶች፣
  እሳት፣ ጋሻ፣ ጋሻ የሌለው፣ ZK ማስተላለፍ፣ ZK የአክሲዮን ምዝገባ፣ ሜታዳታ፣
  የመለየት ጥያቄ፣ ባለብዙ ምልክት ምዝገባ እና የአስተዳደር መመሪያ
- በመተላለፍ ላይ ያለው የግብይት ረድፍ ድጋፍ `PendingTransactionQueue` እና
  `FilePendingTransactionQueue`
- የሂሳብ አድራሻ እና I105 ረዳቶች `AccountAddress` እና `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST, እና SM2 የምስክር ወረቀቶች
  አስፈላጊ ከሆነ ድልድይ ድጋፍ
- ለገበያ ቦታ እና ስም አልባ የሚሆን የአገር ውስጥ የኤስኮር መመሪያ ጥቅማጥቅሞች ገንቢዎች
  የዋስትና ማረጋገጫ
- አገናኝ WebSocket, ክፈፍ ፣ ምስጠራ ፣ ክፍለ ጊዜ ፣ ረድፍ ፣ መልሶ ማጫወት እና ምርመራ
  ረዳቶች
- ካጌሙሻ ዝግጁነት, የተጻፈ ማሟያ እና ማስመለስ, የአሠራር ሁኔታ, ማስታወሻ,
  የእኩዮች ጥቅል ፣ ደረሰኝ እና QR የዥረት ሞዴሎች
- SoraFS, የመረጃ ተደራሽነት እና የማረጋገጫ አገናኝ ረዳቶች

## API ምሳሌዎች {#api-examples}

አጠቃቀም `IrohaSwift/Sources/IrohaSwift` ለሕዝብ አተገባበር እና
`IrohaSwift/Tests/IrohaSwiftTests` ለታተሙ የአጠቃቀም ምሳሌዎች ተመሳሳይ
ምንጭ ማሻሻያ።

## የመረጃ ምንጮች {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
