---
translation_locale: am
translation_source: /guide/tutorials/swift.md
translation_source_hash: 85cc94399b9892984615bf8a0821a1f30395eb87ec164592ca98fbd9903ef834
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift እና iOS {#swift-and-ios}

የ Swift SDK በቅድመ-መንገድ የሥራ ቦታ የተላከው `IrohaSwift` Swift ፓኬጅ በ `IrohaSwift/` ስር ነው ። የእሱ ፓኬጅ ማኒፌስት ሶስት የቤተ-መጽሐፍት ምርቶችን ይገልጻል `IrohaSwift` ፣ `IrohaSwiftMobileTransports` እና `IrohaSwiftTransferUI`እና iOS 15+ እና macOS 12+ ን በ Swift መሳሪያዎች 5.

ፓኬጁ በአገሬው `NoritoBridge` በሁለትዮሽ ዒላማ ላይ የተመሠረተ ነው። የፓኬጅ ጥራት ከመገንባቱ በፊት `../dist/NoritoBridge.xcframework` ያረጋግጣል ፣ እና የአገሬው ምልክቶች ባልጫኑበት ጊዜ የግብይት ወይም የግንኙነት ምስጠራ መንገዶች ድልድይ የማይገኙ ስህተቶችን ይጥላሉ ።

## Swift የፓኬጅ አስተዳዳሪ {#swift-package-manager}

ከተሰረዘ የስራ ቦታ ጋር ሲነፃፀር በአካባቢው `IrohaSwift/` ጥቅል ማውጫ ውስጥ SwiftPM ን ያመልክቱ። በ `Package.swift` የተጠቀመው የጥቅሉ መታወቂያ `IrohaSwift` ነው-

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

የመተግበሪያዎን መንገድ ያስተካክሉ የአሁኑን `examples/ios/ConnectMinimalApp` መንገድ እንደነበረው አይኮፒ ያድርጉ፤ ይህ ማኒፌስት `../../IrohaSwift` ወደ `examples/IrohaSwift` ይለወጣል።

ጥቅሉን ከመፍታትዎ በፊት ድልድዩ በስራ ቦታ ሥር ላይ እንዳለ ያረጋግጡ:

```bash
cd /path/to/iroha
make bridge-xcframework
```

ይህ `dist/NoritoBridge.xcframework` ያስገኛል፤ `IrohaSwift/Package.swift` `../dist/NoritoBridge.xcframework` በማለት ይጠቅሳል።

## CocoaPods {#cocoapods}

የኮድ መሰረት ደግሞ ይዟል `IrohaSwift/IrohaSwift.podspec`. ይህ ይገልጻል `IrohaSwift` ካፕል፣ Swift 9 እና iOS 15. የ podspec ይጎትታል Swift ከዋናው የመረጃ ቋት ምንጮች; የአገር ውስጥ ድልድይ አሁንም መኖር አለበት እና ለግብይት ኮዲንግ የተገናኘ መሆን አለበት ፣ ኤድ 25519 ያልሆነ ፊርማ፣ እና ኮንክሪፕት.

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

## Taira ንባብ ብቻ ይሞክሩ {#try-taira-read-only}

መሣሪያው ወይም ሲምዩተሩ ወደ Taira የህዝብ መጨረሻ ነጥብ መድረሱን ለማረጋገጥ ቀላል የሆነ HTTP ምርመራ ይጀምሩ:

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

ተመሳሳይ ይጠቀሙ `URLSession` ፍተሻ `https://taira.sora.org/v1/assets/definitions?limit=5` እናንተ ግንባታ እያደረጋችሁ UI እና እንደገና ባህሪ ይሞክሩ. `IrohaSDK` አፕሊኬሽኑ ፊርማውን ከደህንነት ማከማቻ ከተጫነ በኋላ ብቻ ረዳቶችን ያቅርቡ እና ሂሳቡ በ Taira.

አንድ ግብይት ለመገንባት እና ለማቅረብ, `IrohaSDK` ረዳቶችን ይጠቀሙ. እነዚህ የአገር ውስጥ ድልድይ የተደገፈ የግብይት ኢንኮደር ይጠሩታል:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, እና `UnshieldRequest` የካኖኒክ ሂሳብ ማረጋገጫ IDs እና ካኖኒካዊ ያልተስተካከለ Base58 ንብረቶች ትርጉም IDs ከመፈረምዎ በፊት።

## የአገር ውስጥ ኤስኮር {#native-escrow}

Swift የገበያ ቦታ እና የማይታወቁ ኤስኮር መመሪያዎችን እንደ Norito JSON በጠቅላላ ጭነት `NativeEscrowInstructionBuilders` ወይም ተመጣጣኝ `IrohaSDK.build*Escrow*` ረዳቶች። [የአገር ውስጥ ንብረት ማስከበሪያ](/am/blockchain/escrow.md#swift-and-ios) ለምሳሌ፣ የማይታወቁ ማስረጃ መስኮች፣ እና የክርክር መፍቻ ፈቃድ ምልክት።

## ፊርማ ማድረግ {#signing}

`Keypair` Ed25519 ምቾት ነው API. ለሌሎች ስልተ ቀመሮች `IrohaSDK` ን በ `defaultSigningAlgorithm` ይገንቡ እና `generateSigningKey()` ወይም `signingKey(fromSeed:)` ይጠቀሙ:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

የ `SigningAlgorithm` enum በአሁኑ ጊዜ Ed25519 ፣ secp256k1 ን ያካትታል ፣ BLS መደበኛ እና አነስተኛ ልዩነቶች፣ ML-DSA, GOST R 34.10-2012 የፓራሜትር ስብስቦች, እና SM2. ከኤድ 25519 ምቾት መንገድ ውጭ የአገር ውስጥ ድልድይ ድጋፍ ያስፈልጋል ።

## አገናኝ {#connect}

የ ‹Connect› ደንበኛ በ Swift ምንጭ ውስጥ ተተግብሯል ፣ በ `NoritoBridge` የተደገፉ crypto እና ክፈፍ ኮዴኮች:

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

`ConnectSession` ክፍት እና ዝግ መቆጣጠሪያዎች, የተመሰጠረ ፖስታ ንባቦች, አቅጣጫ ቁልፎች, ፍሰት ቁጥጥር, ክስተቶች ዥረቶች, ሚዛን ዥረቶችን, እና የምርመራ መጽሔቶች ያከናውናል.

## ወቅታዊ ሽፋን {#current-coverage}

Swift ምንጭ በአሁኑ ጊዜ የሚከተሉትን ያካትታል:

- `ToriiClient` HTTP ለሂሳቦች ፣ ንብረቶች ፣ ቅጽል ስሞች ፣ የአሰሳ ገጾች ፣ RWA ፣ ውል ፣ ባለብዙ ስም ፣ አስተዳደር ፣ ምዝገባዎች ፣ የመረጃ ተደራሽነት ፣ ሚስጥራዊ ሀብቶች ፣ ኖድ / የስራ ሰዓት ሁኔታ ፣ ጤና ፣ መለኪያዎች እና SSE ዥረቶች
- `IrohaSDK` የግብይት ገንቢዎች እና ለዝውውር ፣ ለወፍጮ ፣ ለማቃጠል ፣ ለመከላከያ ፣ ለመከላከል የማይችል ፣ ለዝውዋር ፣ ለ ZK ዝውውር ፣ ZK ንብረቶች ምዝገባ ፣ ሜታዳታ ፣ የመለየት ጥያቄዎችን ፣ ባለብዙ ምልክቶች ምዝገባ እና የአስተዳደር መመሪያዎችን የሚያቀርቡ/የሚዘረዙ ረዳቶች
- በ `PendingTransactionQueue` እና `FilePendingTransactionQueue` በኩል የሚደረገውን የግብይት ረድፍ ድጋፍ
- የሂሳብ አድራሻ እና I105 ረዳቶች በ `AccountAddress` እና `AccountId` በኩል
- Ed25519, secp256k1, ML-DSA, BLS, GOST, እና SM2 ፊርማ ወለሎች, አስፈላጊ ከሆነ የአገር ውስጥ ድልድይ ድጋፍ ጋር.
- የገበያ ቦታ እና የማይታወቁ የኤስኮር መመሪያ ተጠቃሚ ጭነት ገንቢዎች
- አገናኝ WebSocket, ክፈፍ, crypto, ክፍለ ጊዜ, ረድፍ, መልሶ ማጫወት, እና የምርመራ ረዳቶች
- የ Kagemusha ዝግጁነት, የተጻፈ ማሟያ እና ማስመለስ, የአሠራር ሁኔታ, ማስታወሻ, የእኩዮች ጥቅል, ደረሰኝ, እና QR ዥረት ሞዴሎች
- SoraFS ፣ የመረጃ ተደራሽነት እና የማረጋገጫ ማያያዝ ረዳቶች

## API ምሳሌዎች {#api-examples}

ለህዝብ ትግበራ `IrohaSwift/Sources/IrohaSwift` እና በተመሳሳይ ምንጭ ማሻሻያ የተደረጉ የሙከራ አጠቃቀም ምሳሌዎች `IrohaSwift/Tests/IrohaSwiftTests` ይጠቀሙ።

## የመረጃ ምንጮች {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
