---
translation_locale: am
translation_source: /guide/tutorials/swift.md
translation_source_hash: 753ce1b5e0de4eae56b38e77962566b23fee56d4662a432a7bbe6ea807261422
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Swift እና iOS {#swift-and-ios}

በላይኛው የስራ ቦታ የተላከው Swift SDK በ`IrohaSwift/` ስር ያለው `IrohaSwift` Swift ጥቅል ነው። የእሱ ጥቅል ቴክኒካል ማኒፌስት ሶስት የቤተ-መጽሐፍት ምርቶችን ይገልፃል - `IrohaSwift`፣ `IrohaSwiftMobileTransports` እና `IrohaSwiftTransferUI` - እና iOS 15+ እና macOS 12+ በ Swift መሳሪያዎች 5.9 ያነጣጠረ ነው።

ጥቅሉ በቤተኛ `NoritoBridge` ሁለትዮሽ ዒላማ ላይ የተመሰረተ ነው. የጥቅል ጥራት ከመገንባቱ በፊት `../dist/NoritoBridge.xcframework` ያረጋግጣል፣ እና ግብይት ወይም የ crypto ዱካዎችን ያገናኙ ቤተኛ ምልክቶች በማይጫኑበት ጊዜ ድልድይ-የማይገኙ ስህተቶችን ይጥላሉ።

## Swift የጥቅል አስተዳዳሪ {#swift-package-manager}

ከተወረደ የሥራ ቦታ ቅጂ ጋር ሲያበለጽጉ፣ SwiftPMን ወደ አካባቢያዊው `IrohaSwift/` የጥቅል ማውጫ ይጠቁሙ። `Package.swift` የሚጠቀመው የጥቅል መለያ `IrohaSwift` ነው፦

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

ለመተግበሪያዎ መንገዱን ያስተካክሉ። `examples/ios/ConnectMinimalApp/Package.swift` ተመሳሳዩን ጥገኝነት ከአንጻራዊ መንገድ `../../../IrohaSwift` ጋር ያሳያል።

ጥቅሉን ከመፍታትዎ በፊት የአሁኑን ቤተኛ ድልድይ ይገንቡ። ለአካባቢያዊ ልማት እና ሙከራዎች ይህንን ከስራ ቦታው ሥር ያሂዱ፦

```bash
cd /path/to/iroha
python3.12 scripts/test_swift_local.py
```

የልቀት ግንባታዎች `dist/NoritoBridge.xcframework`ን በ`make bridge-xcframework` ያመነጫሉ፤ ይህ `SOURCE_DATE_EPOCH`፣ `NORITO_BRIDGE_OUT_DIR`፣ `NORITO_BRIDGE_BUILD_DIR`፣ `NORITO_BRIDGE_ARCHIVE_OUTPUT` እና `MOBILE_SDK_CARGO_LOCKFILE` ይፈልጋል። `IrohaSwift/Package.swift` ድልድዩን እንደ `../dist/NoritoBridge.xcframework` ይጠቅሳል።

## ፈጣን ጅምር {#quickstart}

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

## ይሞክሩ Taira ተነባቢ-ብቻ {#try-taira-read-only}

መሳሪያው ወይም አስመሳዩ ለህዝብ Taira የመጨረሻ ነጥብ መድረስ መቻሉን ለማረጋገጥ በግልጽ HTTP ምርመራ ይጀምሩ -

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

UI በሚገነቡበት ጊዜ ተመሳሳይ `URLSession` ለ`https://taira.sora.org/v1/assets/definitions?limit=5` ያረጋግጡ እና ባህሪን እንደገና ይሞክሩ። ወደ `IrohaSDK` ረዳቶች ያስገቡ መተግበሪያው ምስጠራ ፈራሚ ቁሳቁሶችን ደህንነቱ የተጠበቀ ማከማቻ ከጫነ እና መለያው በ Taira ላይ የገንዘብ ድጋፍ ከተደረገ በኋላ ብቻ ነው።

ግብይትን ለመገንባት እና ለማስገባት `IrohaSDK` ረዳቶችን ይጠቀሙ። እነዚህ ቤተኛ ድልድይ የተደገፈ የግብይት ኢንኮደርን ይጠይቃሉ -

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

`TransferRequest`፣ `MintRequest` እና `BurnRequest` ከመፈረም በፊት ካኖኒካል የመለያ IDs እና ቅድመ-ቅጥያ የሌላቸው ካኖኒካል Base58 የንብረት-ፍቺ IDs ያረጋግጣሉ።

## ቤተኛ Escrow {#native-escrow}

Swift የገበያ ቦታ escrow መመሪያዎችን እንደ Norito JSON ጭነቶች `NativeEscrowInstructionBuilders` ወይም ተመጣጣኝ `IrohaSDK.build*Escrow*` ረዳቶችን በመጠቀም ይገነባል። ለምሳሌዎች እና ለክርክር ፈቺ ፍቃድ ቶከን [ቤተኛ ንብረት Escrow](/am/blockchain/escrow.md#swift-and-ios)ን ይመልከቱ።

## መፈረም {#signing}

`Keypair` የ Ed25519 ምቾት API ነው። ለሌሎች ስልተ ቀመሮች፣ `IrohaSDK`ን በ`defaultSigningAlgorithm` ይገንቡ እና `generateSigningKey()` ወይም `signingKey(fromSeed:)` ይጠቀሙ -

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

የ`SigningAlgorithm` enum በአሁኑ ጊዜ Ed25519፣ secp256k1፣ BLS መደበኛ እና ትናንሽ ልዩነቶችን፣ ML-DSA፣ GOST R 34.10-2012 መለኪያ ስብስቦችን እና SM2 ያካትታል። ቤተኛ ድልድይ ድጋፍ ከEd25519 ምቹ መንገድ ውጭ ያስፈልጋል።

## ይገናኙ {#connect}

የግንኙነት ደንበኛው በ Swift ምንጭ ውስጥ ይተገበራል፣ በ `NoritoBridge` የተደገፉ crypto እና ፍሬም ኮዴኮች -

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

`ConnectSession` ክፍት እና መዝጊያ መቆጣጠሪያዎችን፣ የተመሰጠሩ የውሂብ መያዣ ንባቦችን፣ የአቅጣጫ ቁልፎችን፣ የፍሰት መቆጣጠሪያን፣ የክስተት ዥረቶችን፣ የቀሪ ሒሳብ ዥረቶችን እና የምርመራ መጽሔቶችን ያስተናግዳል።

## የአሁኑ ሽፋን {#current-coverage}

የ Swift ምንጭ በአሁኑ ጊዜ የሚከተሉትን ያጠቃልላል -

- `ToriiClient` HTTP ለመለያዎች፣ ንብረቶች፣ ተለዋጭ ስሞች፣ አሳሽ ገጾች፣ RWA፣ ኮንትራቶች፣ መልቲሲግ፣ አስተዳደር፣ የደንበኝነት ምዝገባዎች፣ የውሂብ ተገኝነት ረዳቶች፣ ሚስጥራዊ ንብረቶች፣ የኖድ/የአሂድ ጊዜ ሁኔታ፣ ጤና፣ መለኪያዎች እና SSE ዥረቶች
- `IrohaSDK` የግብይት ገንቢዎች እና ለማስተላለፍ፣ ለማውጣት፣ ለማጥፋት፣ ለZK የንብረት ምዝገባ፣ ለሜታዳታ፣ ለመለያ የይገባኛል ጥያቄዎች፣ ለባለብዙ ፊርማ ምዝገባ፣ ለኮንትራት ማሰማራት እና ለአስተዳደር የድምጽ መስጫ ወረቀቶች የማስገቢያ/የመከታተያ ረዳቶች
- በ`PendingTransactionQueue` እና `FilePendingTransactionQueue` በኩል በመጠባበቅ ላይ ያለ የግብይት ወረፋ ድጋፍ
- የመለያ-አድራሻ እና I105 ረዳቶች በ `AccountAddress` እና `AccountId` በኩል
- Ed25519፣ secp256k1፣ ML-DSA፣ BLS፣ GOST እና SM2 ፊርማ ቦታዎች፣ አስፈላጊ ሆኖ ሲገኝ ቤተኛ ድልድይ ድጋፍ
- ቤተኛ escrow መመሪያ ጭነት ግንበኞች ለገበያ ቦታ እና ስም-አልባ escrow
- WebSocket፣ ፍሬም፣ ክሪፕቶ፣ ክፍለ ጊዜ፣ ወረፋ፣ ድጋሚ ማጫወት እና የምርመራ አጋዥዎችን ያገናኙ
- የKAGEMUSHA V1 የሽቦ ቅርጽ ረዳቶች እና ለናቲቭ ቦርሳ Advance አቅራቢ፣ ምዝገባ፣ መልሶ ማግኛ እና ለተፈቀዱ የልውውጥ ጥሪዎች የiPhone መድረክ አስማሚ
- SoraFS፣ የውሂብ ተገኝነት እና ማረጋገጫ-አባሪ ረዳቶች

## API ምሳሌዎች {#api-examples}

ለህዝብ ትግበራ `IrohaSwift/Sources/IrohaSwift` እና `IrohaSwift/Tests/IrohaSwiftTests` ለተሞከረ የአጠቃቀም ምሳሌዎች ከተመሳሳይ ምንጭ ክለሳ ይጠቀሙ።

## የምንጭ ማጣቀሻዎች {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
