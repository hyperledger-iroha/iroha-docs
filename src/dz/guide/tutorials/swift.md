---
translation_locale: dz
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: human-reviewed
---
# Swift དང་ iOS {#swift-and-ios}

Swift SDK འདི་ཡར་ཐུག་ལུ་ལཱ་འབད་སའི་ས་ཁོངས་ནང་ལས་བཏང་ཡོདཔ་ཨིན། འདི་གིས་ `IrohaSwift` Swift ཆ་ཚན་འདི་ `IrohaSwift/` གི་འོག་ལུ་ཨིན། ཁོ་གི་སྦ་སྒོའི་ཁ་བྱང་འདི་གིས་ དཔེ་མཛོད་ཁང་གི་ཐོན་སྐྱེད་གསུམ་ལུ་ ངོས་འཛིན་འབདཝ་ཨིན། `IrohaSwift`, `IrohaSwiftMobileTransports` དང་ `IrohaSwiftTransferUI`  དེ་ལས་ iOS 15+དང་ macOS 12+ ལུ་ དམིགས་གཏད་འབད་དོ་ཡོདཔ་ད་ ལག་ཆས་ཚུ་གིས་ Swift 5.9 ཡིན།

ཐུམ་སྒྲིལ་འདི་ `NoritoBridge` གཉིས་ལྡན་དམིགས་གཏད་ལུ་རག་ལསཔ་ཨིན། ཐུམ་སྒྲིལ་ཐག་གཅོད་འདི་གིས་ བཟོ་བསྐྲུན་མ་འབད་བའི་ཧེ་མ་ `../dist/NoritoBridge.xcframework` བདེན་དཔྱད་འབདཝ་ཨིནམ་དང་ ཚོང་འབྲེལ་ཡང་ན་ ཀིརིཔ་ཊོ་འགྲུལ་ལམ་ཚུ་མཐུད་དེ་ ས་གནས་ཀྱི་བརྡ་མཚོན་ཚུ་མངོན་གསལ་མ་འབད་བའི་སྐབས་ ཟམ་-འཐོབ་མ་ཚུགས་པའི་འཛོལ་བ་ཚུ་བཀོག་བཞགཔ་ཨིན།

## Swift སྦ་སྒོའི་འཛིན་སྐྱོང་པ་ {#swift-package-manager}

བརྟག་ཞིབ་འབད་ཡོད་པའི་ལཱ་གི་ས་སྒོ་ཅིག་གི་རྒྱབ་འགལ་ལུ་གོང་འཕེལ་གཏང་པའི་སྐབས་ ཉེ་གནས་`IrohaSwift/` ཐུམ་སྒྲིལ་སྣོད་ཐོ་ལུ་ SwiftPM འདི་སྟོན། `Package.swift` གིས་ལག་ལེན་འཐབ་མི་ ཐུམ་སྒྲིལ་ངོ་རྟགས་འདི་ `IrohaSwift`: ཨིན།

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

ཁྱོད་རའི་གློག་རིམ་གྱི་དོན་ལུ་འགྲུལ་ལམ་བདེ་སྒྲིག་འབད། ད་ལྟོའི་`examples/ios/ConnectMinimalApp` འགྲུལ་ལམ་འདི་ ག་དེ་སྦེ་ཡོདཔ་ཨིན་ན་ འདྲ་བཤུས་མ་རྐྱབ། དེ་གིས་ `../../IrohaSwift` འདི་ `examples/IrohaSwift` ལུ་སེལ་འཐུ་འབདཝ་ཨིན།

ཐུམ་སྒྲིལ་འདི་སེལ་འཐུ་མ་འབད་བའི་ཧེ་མ་ ཟམ་འདི་ལཱ་གི་ས་སྒོ་རྩ་བ་ལུ་ཡོདཔ་ངེས་གཏན་བཟོ།

```bash
cd /path/to/iroha
make bridge-xcframework
```

འདི་གིས་ `dist/NoritoBridge.xcframework` ཐོན་སྐྱེད་འབདཝ་ཨིན། `IrohaSwift/Package.swift` གིས་ `../dist/NoritoBridge.xcframework` སྦེ་གཞི་བསྟུན་འབདཝ་ཨིན།

## CocoaPods {#cocoapods}

གཞི་རྟེན་ ལས་རིམ་ཨང་ཡིག འདི་ནང་ལུ་ཡང་ཡོདཔ་ཨིན། `IrohaSwift/IrohaSwift.podspec`. འདི་གིས་གསལ་བསྒྲགས་འབདཝ་ཨིན། `IrohaSwift` ཀེ་བ་ཚུ་ Swift ༥.༩ དང་ iOS ༡༥ ཨིན། གློག་རིག་དཔྱད་ཡིག་འདི་ འཐེན Swift གཞི་རྟེན་རྫས་ནང་ལས་འབྱུང་ཁུངས་ཚུ་; རང་ལུགས་ཀྱི་ཟམ་དེ་ ད་ལྟོ་ཡང་ཡོད་དགོཔ་ཨིན། འབྲེལ་མཐུད་འབད་ཡོདཔ་ད་ བརྒྱུད་འཕྲིན་ཨེབ་གཏང་འབད་ནི་དང་ Ed25519མེན་པའི་རྟགས་བཀོད་ དེ་ལས་ མཐུད་སྦྲེལ གསང་བཟོགི་དོན་ལུ་ཨིན།

## མགྱོགས་པ་རང་འགོ་བཙུགས་ {#quickstart}

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

## Taira ཀློག་རྐྱབས་ཅིག་ལུ་ བརྟག་དཔྱད་འབད་ {#try-taira-read-only}

ཁྱོད་ཀྱིས་ HTTP བརྟག་ཞིབ་འདི་འགོ་དང་པ་འབད་ཞིནམ་ལས་ སེལ་འཐུ་འབད། ཡང་ན་ སི་མུལ་ཊར་འདི་གིས་ མི་མང་གི་ Taira མཐའ་མཇུག་ཐིག་ལུ་ལྷོད་ཚུགས་མི་འདི་ ངེས་གཏན་བཟོ་བར་འབདཝ་ཨིན།

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

འདི་བཟུམ་སྦེ་ ལག་ལེན་འཐབ་དགོ། `URLSession` བརྟག་དཔྱད་འབད་ `https://taira.sora.org/v1/assets/definitions?limit=5` དེ་འབདཝ་ད་ ཁྱེད་ཀྱིས་རྐྱབ་པའི་བསྒང་ལས་ UI དེ་ལས་ སྤྱོད་ལམ་འདི་ བསྐྱར་ཞིབ་འབད་ཞིནམ་ལས་ `IrohaSDK` གྲོགས་རམ་འབད་མི་ཚུ་རྐྱངམ་ཅིག་ ཨེཔ་གིས་ ཉེན་སྲུང་ཅན་གྱི་གནས་སྡུད་ནང་ལས་ ཐོ་བཀོད་འབད་ཡོད་པའི་བརྡ་དོན་ཚུ་ བཏོན་ཞིནམ་ལས་ དེ་ལས་རྩིས་ཐོ་དེ་ དངུལ་ཀྲམ་སྤྲོད་ཚར་བའི་ཤུལ་ལས་ འབད། Taira.

ཚོང་འབྲེལ་ཅིག་བཟོ་བསྐྲུན་འབད་ནི་དང་ཕུལ་ནིའི་དོན་ལུ་ `IrohaSDK` གྲོགས་རམ་ཚུ་ལག་ལེན་འཐབ། འདི་ཚུ་གིས་ ས་གནས་ཀྱི་ཟམ་རྒྱབ་སྐྱོར་འབད་ཡོད་པའི་ཚོང་འབྲེལ་ཨེན་ཀོ་ཌར་འདི་འབོཝ་ཨིན།

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, དང་ `UnshieldRequest` གིས་ ཚད་ལྡན་རྩིས་ཐོ་ཨའི་ཌི་ཚུ་དང་ ཚད་ལྡན་སྔོན་སྒྲིག་མེད་པའི་ གཞི་རྟེན་༥༨ རྒྱུ་དངོས་ངེས་ཚིག་ཨའི་ཌི་ཚུ་ མིང་རྟགས་མ་བཀོད་པའི་ཧེ་མ་ བདེན་དཔྱད་འབདཝ་ཨིན།

## རང་ལུགས་ཀྱི་ བར་གཏོགས་བདག་ཉར {#native-escrow}

Swift གིས་ཚོང་ཁྲོམ་དང་མིང་མ་ཤེསཔ་གི་རྒྱབ་སྐྱོར་གྱི་བཀོད་རྒྱ་ཚུ་ བཟོ་ནི་ཨིནམ་ད་ Norito JSON ནང་དོན་གནད་སྡུད་ཚུ སྦེ `NativeEscrowInstructionBuilders` ཡང་ན་ དེ་འདྲ་མཉམ་ཨིན་པའི་ `IrohaSDK.build*Escrow*` ཆ་རོགས་ཚུ་གི་ཐོག་ལས་ བཟོ་དོ་ཡོདཔ་ཨིན། དཔེ་འབད་བ་ཅིན་ [ རང་སའི་རྒྱུ་དངོས་བཅོལ་ཉར](/dz/blockchain/escrow.md#swift-and-ios) ལུ་བལྟ་ཚུགས། མིང་མ་ཤེསཔ་ཀྱི་རྒྱབ་སྐྱོར་ ས་སྒོ་ཚུ དང་ རྩོད་གཞི་སེལ་ནིའི་ཆོག་ཐམ་ ཊོ་ཀེན འདི་ཡང་མཐོང་འོང་།

## རྟགས་མཚན་བཀོད་ཐབས། {#signing}

`Keypair`འདི་ Ed25519 གི་ལྕོགས་གྲུབ་ API ཨིན། གཞན་ཨལ་གེ་རི་ཏམ་ཚུ་གི་དོན་ལུ་ `IrohaSDK` བཟོ་ཞིནམ་ལས་ `defaultSigningAlgorithm` དང་གཅིག་ཁར་དང་ `generateSigningKey()` ཡང་ན་ `signingKey(fromSeed:)` ལག་ལེན་འཐབ་དགོ།

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

`SigningAlgorithm` གྲངས་བཀོད་དབྱེ་བ ནང་ད་ལྟོ་ Ed25519, secp256k1, BLS སྤྱིར་བཏང དང་ ཆུང་ཀུ་ དབྱེ་བ་ ML-DSA, GOST R 34.10-2012 ཚད་བཟུང ཆ་ཚན ཚུ་ དེ་ལས་ SM2 ཚུདཔ་ཨིན། Ed25519 གི་སྟབས་བདེའི་ལམ་ལས་ཕར་ ནང་སྐྱེས བར་མཐུད རྒྱབ་སྐྱོར་དགོ།

## འབྲེལ་མཐུད་འབད་ {#connect}

མཐུད་ལམ་མཁོ་སྤྲོད་པ་འདི་ Swift འབྱུང་ཁུངས་ནང་ལུ་ལག་ལེན་འཐབ་ཡོདཔ་དང་ `NoritoBridge` གིས་རྒྱབ་སྐྱོར་འབད་མི་ ཀིརིཔ་ཊོ་དང་གཞི་ཁྲམ་ཀོ་ཌེཀསི་ཚུ་ཡོདཔ་ཨིན།

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

`ConnectSession` གིས་ ཁ་ཕྱེ་ནི་དང་ཁ་བསྡམ་ཚད་འཛིན་ཚུ་ གསང་བཟོས་ཡིག་ཤུབས་ལྷག་ནི་ ཁ་ཕྱོགས་ལྡེ་མིག་ རྒྱུན་འགྲུལ་ཚད་འཛིན་ བྱུང་ལས་རྒྱུན་ལམ་ ཚད་གཞི་རྒྱུན་ལམ་ དེ་ལས་ བརྟག་དཔྱད་དུས་དེབ་ཚུ་ འཛིན་སྐྱོང་འཐབ་ཨིན།

## ད་ལྟོའི་ཁྱབ་ཚད་ {#current-coverage}

Swift ཐོན་ཁུངས་འདི་ ད་ལྟོ་གི་ནང་ཚུགསཔ།

- `ToriiClient` HTTP རྩིས་ཐོ་དང་རྒྱུ་དངོས་ མིང་གཞན་ འཚོལ་ཞིབ་ཤོག་ལེབ་ RWA གན་རྒྱ་ མལ་ཊི་སིག་ གཞུང་སྐྱོང་ མཐུན་རྐྱེན་ གནས་སྡུད་ཐོབ་ཚུགས་མི་ གསང་བའི་རྒྱུ་དངོས་/དུས་ཚོད་མེད་མི་ཚུ་གི་དོན་ལུ་ གྲོགས་རམ་འབད་མི་ཚུ། SSE ཆུ་བོ།
- `IrohaSDK` ཚོང་འབྲེལ་བཟོ་མི་དང་ བཙུགས་/འོས་བསྡུའི་གྲོགས་རམ་འབད་མི་ཚུ་ བརྗེ་སོར་དང་ མིན་ཊི་ མེ་བཏང་མི་ གདོང་ཁེབས་ གདོང་ཁེབས་མེད་མི་ ZK སྤོ་བཤུད་ ZK རྒྱུ་དངོས་ཐོ་བཀོད་ མེ་ཊ་ཌེ་ཊ་ ངོས་འཛིན་ཐོབ་བརྗོད་ མལ་ཊི་སིག་ཐོ་བཀོད་དང་ གཞུང་སྐྱོང་བཀོད་རྒྱ་ཚུ་གི་དོན་ལུ་
- `PendingTransactionQueue`དང་ `FilePendingTransactionQueue`བརྒྱུད་དེ་ ཕྱིར་ཚོང་གི་གྲལ་རིམ་རྒྱབ་སྐྱོར་མ་བྱིན་པར་བཞག་ཡོདཔ་ཨིན།
- རྩིས་ཐོ་-ཁ་བྱང་དང་ `AccountAddress` དང་ `AccountId` བརྒྱུད་དེ་ I105 གྲོགས་རམ་འབད་མི་ཚུ།
- Ed25519, secp256k1, ML-DSA, BLS, GOST, དང་ SM2 མཚན་རྟགས་བཀོད་པའི་ཁ་ཐོག དགོས་མཁོ་ཡོད་སར་ས་གནས་ཀྱི་ཟམ་རྒྱབ་སྐྱོར་དང་མཉམ་དུ།
- ཁྲོམ་ཁར་དང་མིང་མེད་བཀག་སྡོམ་གྱི་དོན་ལུ་ ས་གནས་ཀྱི་བཀག་སྡོམ་བཀོད་རྒྱ་ པེ་ལོཌ་བཟོ་བསྐྲུན་པ་ཚུ།
- མཐུད WebSocket, གཞི་ཁྲམ་, ཀིརིཔ་ཊོ་, ལཱ་ཡུན་, བང་རིམ་, བསྐྱར་རྩེད་, དང་ བརྟག་དཔྱད་རོགས་རམ་པ།
- Kagemusha གྲ་སྒྲིག་འབད་ནི་དང་ ཨེབ་གཏང་འབད་ཡོད་པའི་ལོག་སྣོད་དང་གླར་ལེན་, ལག་ལེན་འཐབ་ནིའི་གནས་གོང་, ཐོ་བཀོད་, མཉམ་འབྲེལ་མཐུན་རྐྱེན་, ངོས་ལེན་ དེ་ལས་ QR རྒྱུན་ལམ་གྱི་རྣམ་ཐར།
- SoraFS ཌའི་ཊ་གི་ཐོབ་ཐངས་དང་ བརྟག་དཔྱད་འབད་ནི་ལུ་ གྲོགས་རམ་འབད་མི་ཚུ་

## API དཔེ་སྟོན་ཚུ་ {#api-examples}

ལག་ལེན་འཐབ་ནི་ `IrohaSwift/Sources/IrohaSwift` སྤྱིར་བཏང་ལག་ལེན་གྱི་དོན་ལུ་དང་ `IrohaSwift/Tests/IrohaSwiftTests` བརྟག་དཔྱད་འབད་ཡོད་པའི་ལག་ལེན་གྱི་དཔེ་སྟོན་ཚུ་གི་དོན་ལུ་ འདྲ་བཤུས་ཀྱི་འགྱུར་བཅོས་ནང་ལས་ཨིན།

## གཞི་རྟེན་ཁ་བྱང་ཚུ་ {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
