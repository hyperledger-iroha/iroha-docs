---
translation_locale: am
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: bing-translator-llm
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

ለመተግበሪያዎ መንገዱን ያስተካክሉ። የአሁኑን `examples/ios/ConnectMinimalApp` መንገድ እንዳለ አይገለብጡ; ያ ቴክኒካዊ አንጸባራቂ `../../IrohaSwift` ወደ `examples/IrohaSwift` ይፈታል።

ጥቅሉን ከመፍታትዎ በፊት ድልድዩ በስራ ቦታ ሥር ላይ መኖሩን ያረጋግጡ -

```bash
cd /path/to/iroha
make bridge-xcframework
```

ይህ `dist/NoritoBridge.xcframework` ያመነጫል; `IrohaSwift/Package.swift` እንደ `../dist/NoritoBridge.xcframework` ይጠቅሳል።

## CocoaPods {#cocoapods}

የኮድ ቤዝ `IrohaSwift/IrohaSwift.podspec` ይዟል። `IrohaSwift` ፖድ፣ Swift 5.9 እና iOS 15 ያውጃል። ፖድስፔክ Swift ምንጮችን ከዋናው ማከማቻ ይጎትታል; ቤተኛ ድልድይ አሁንም ለግብይት ኢንኮዲንግ፣ Ed25519 ላልሆነ ፊርማ እና ክሪፕቶፕን ለማገናኘት መገኘት እና መገናኘት አለበት።

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

## ይሞክሩ Taira ተነባቢ-ብቻ {#try-taira-read-only}

መሳሪያው ወይም አስመሳዩ ለህዝብ Taira API የመጨረሻ ነጥብ መድረስ መቻሉን ለማረጋገጥ በግልጽ HTTP ምርመራ ይጀምሩ -

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

`TransferRequest`፣ `MintRequest`፣ `BurnRequest`፣ `ShieldRequest` እና `UnshieldRequest` ከመፈረም በፊት ካኖኒካል የመለያ IDs እና ቅድመ-ቅጥያ የሌላቸው ካኖኒካል Base58 የንብረት-ፍቺ IDs ያረጋግጣሉ።

## ቤተኛ Escrow {#native-escrow}

Swift የገበያ ቦታ እና ስም-አልባ የዋስትና መመሪያዎችን እንደ Norito JSON ጭነቶች `NativeEscrowInstructionBuilders` ወይም ተመጣጣኝ `IrohaSDK.build*Escrow*` ረዳቶችን በመጠቀም ይገነባል። ለምሳሌዎች፣ ማንነታቸው ያልታወቁ የማረጋገጫ መስኮች እና የክርክር ፈቺ ፍቃድ ቶከን [ቤተኛ ንብረት Escrow](/am/blockchain/escrow.md#swift-and-ios)ን ይመልከቱ።

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

let session = ConnectSession(sessionID: sessionID, client: client)
let keyPair = try ConnectCrypto.generateKeyPair()
```

`ConnectSession` ክፍት እና መዝጊያ መቆጣጠሪያዎችን፣ የተመሰጠሩ የውሂብ መያዣ ንባቦችን፣ የአቅጣጫ ቁልፎችን፣ የፍሰት መቆጣጠሪያን፣ የክስተት ዥረቶችን፣ የቀሪ ሒሳብ ዥረቶችን እና የምርመራ መጽሔቶችን ያስተናግዳል።

## የአሁኑ ሽፋን {#current-coverage}

የ Swift ምንጭ በአሁኑ ጊዜ የሚከተሉትን ያጠቃልላል -

- `ToriiClient` HTTP ለመለያዎች፣ ንብረቶች፣ ተለዋጭ ስሞች፣ አሳሽ ገጾች፣ RWA፣ ኮንትራቶች፣ መልቲሲግ፣ አስተዳደር፣ የደንበኝነት ምዝገባዎች፣ የውሂብ ተገኝነት ረዳቶች፣ ሚስጥራዊ ንብረቶች፣ የኖድ/የአሂድ ጊዜ ሁኔታ፣ ጤና፣ መለኪያዎች እና SSE ዥረቶች
- `IrohaSDK` የግብይት ገንቢዎች እና ለማስተላለፍ፣ ለማውጣት፣ ለማጥፋት፣ ለጋሻ፣ ለጋሻ ለማራገፍ፣ ZK ማስተላለፍ፣ ZK የንብረት ምዝገባ፣ ሜታዳታ፣ መለያ የይገባኛል ጥያቄዎች፣ ባለብዙ ሲጂ ምዝገባ እና የአስተዳደር መመሪያዎች
- በ`PendingTransactionQueue` እና `FilePendingTransactionQueue` በኩል በመጠባበቅ ላይ ያለ የግብይት ወረፋ ድጋፍ
- የመለያ-አድራሻ እና I105 ረዳቶች በ `AccountAddress` እና `AccountId` በኩል
- Ed25519፣ secp256k1፣ ML-DSA፣ BLS፣ GOST እና SM2 ፊርማ ቦታዎች፣ አስፈላጊ ሆኖ ሲገኝ ቤተኛ ድልድይ ድጋፍ
- ቤተኛ escrow መመሪያ ጭነት ግንበኞች ለገበያ ቦታ እና ስም-አልባ escrow
- WebSocket፣ ፍሬም፣ ክሪፕቶ፣ ክፍለ ጊዜ፣ ወረፋ፣ ድጋሚ ማጫወት እና የምርመራ አጋዥዎችን ያገናኙ
- የካጌሙሻ ዝግጁነት፣ የተተየበ መሙላት እና መቤዠት፣ የክወና ሁኔታ፣ ማስታወሻ፣ የአውታረ መረብ አቻ ጥቅል፣ የደረሰኝ እና QR የዥረት ሞዴሎች
- SoraFS፣ የውሂብ ተገኝነት እና ማረጋገጫ-አባሪ ረዳቶች

## API ምሳሌዎች {#api-examples}

ለህዝብ ትግበራ `IrohaSwift/Sources/IrohaSwift` እና `IrohaSwift/Tests/IrohaSwiftTests` ለተሞከረ የአጠቃቀም ምሳሌዎች ከተመሳሳይ ምንጭ ክለሳ ይጠቀሙ።

## የምንጭ ማጣቀሻዎች {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
