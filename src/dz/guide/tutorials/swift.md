---
translation_locale: dz
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift དང་ iOS {#swift-and-ios}

Swift SDK འདི་ཡར་ཐུག་ལུ་ལཱ་འབད་སའི་ས་ཁོངས་ནང་ལས་བཏང་ཡོདཔ་ཨིན། འདི་གིས་ `IrohaSwift` Swift སྦ་སྒོར་འདི་ `IrohaSwift/` གི་འོག་ལུ་ཨིན། ཁོ་གི་སྦ་སྒོའི་ཁ་བྱང་འདི་གིས་ དཔེ་མཛོད་ཁང་གི་ཐོན་སྐྱེད་གསུམ་ལུ་ ངོས་འཛིན་འབདཝ་ཨིན། `IrohaSwift`, `IrohaSwiftMobileTransports` དང་ `IrohaSwiftTransferUI`  དེ་ལས་ iOS 15+དང་ macOS 12+ ལུ་ དམིགས་གཏད་འབད་དོ་ཡོདཔ་ད་ ལག་ཆས་ཚུ་གིས་ Swift 5.9 ཡིན།

ཕབ་ལེཊ་འདི་ རང་ལུགས་ཀྱི་ `NoritoBridge` ཌའི་ལོག་ དམིགས་གཏད་ལས་བརྟེན་ཨིན། ཕབ་ལེཌ་གི་གསལ་སྒྲགས་དེ་ བཟོ་སྐྲུན་མ་འབད་བའི་ཧེ་མར་ `../dist/NoritoBridge.xcframework` སྒྲིང་སྒྲི་བཟོཝ་ཨིན། དེ་ལས་ གནས་སྐབས་ཀྱི་ རྟགས་མཚན་ཚུ་ བཀྲམ་སྤེལ་འབད་མ་ཚུགས་པའི་སྐབས་ལུ་ བྱ་སྟབས་མ་བདེཝ་དང་འབྲེལ་བའི་ཅ་ཆས་ ཡང་ན་ Connect crypto ལྕགས་ལམ་ཚུ་གིས་ མཐུད་སྦྲེལ་འབད་མི་འཛོལ་བ་ཚུ་ བཀལ་དོ་ཡོདཔ་ཨིན།

## Swift སྦ་སྒོའི་འཛིན་སྐྱོང་པ་ {#swift-package-manager}

སྒྲིག་གཞི་འདི་སེལ་འཐུ་འབད་ཡོད་པའི་ ལཱ་གི་ས་ཁོངས་དང་ཕྱདཔ་ད་བཟོ་སྐྲུན་འབད་བའི་སྐབས་ལུ་ ས་གནས་ཀྱི་ `IrohaSwift/` སྦ་སྒོའི་ཐོ་ཡིག་ནང་ SwiftPM ལུ་ཐོ་བཀོད་འབད། `Package.swift` གིས་ལག་ལེན་འཐབ་མི་སྦ་སྒོར་གྱི་ངོ་རྟགས་དེ་ `IrohaSwift` ཨིན་པ།

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

ཁྱོད་རའི་ལག་ལེན་གྱི་དོན་ལུ་ལམ་འདི་ སེལ་འཐུ་འབད། ད་ལྟོའི་ `examples/ios/ConnectMinimalApp`ལམ་དེ་ འདི་བཟུམ་སྦེ་བཟོ་མ་བཏུབ་ ག་ཅི་སྨོ་ཟེར་བ་ཅིན་ ལམ་སྟོན་འདི་གིས་ `../../IrohaSwift` ལུ་ `examples/IrohaSwift` ལུ་ཐོ་བཀོད་འབདཝ་ཨིན།

ཕབ་ལེཊ་འདི་སེལ་འཐུ་མ་ཚར་བའི་ཧེ་མར་ ཐོ་བཀོད་འབད་ཡོད་པའི་བསྒང་ལས་ སྒྲིག་འཇུག་གི་གནས་གོང་ལུ་ མཐུད་སྦྲེལ་འབད་ནི།

```bash
cd /path/to/iroha
make bridge-xcframework
```

འདི་གིས་ `dist/NoritoBridge.xcframework` ཐོན་སྐྱེད་འབདཝ་ཨིན། `IrohaSwift/Package.swift` གིས་འདི་ `../dist/NoritoBridge.xcframework`ཟེར་སླབ་ཨིན།

## CocoaPods {#cocoapods}

གཞི་རྟེན་ code འདི་ནང་ལུ་ཡང་ཡོདཔ་ཨིན། `IrohaSwift/IrohaSwift.podspec`. འདི་གིས་གསལ་བསྒྲགས་འབདཝ་ཨིན། `IrohaSwift` ཀེ་བ་ཚུ་ Swift ༥.༩ དང་ iOS ༡༥ ཨིན། གློག་རིག་དཔྱད་ཡིག་འདི་ pulls Swift གཞི་རྟེན་རྫས་ནང་ལས་འབྱུང་ཁུངས་ཚུ་; རང་ལུགས་ཀྱི་གཞུང་ལམ་དེ་ ད་ལྟོ་ཡང་ཡོད་དགོཔ་ཨིན། འབྲེལ་མཐུད་འབད་ཡོདཔ་ད་ བརྒྱུད་འཕྲིན་ཨེབ་གཏང་འབད་ནི་དང་ Ed25519མེན་པའི་རྟགས་བཀོད་ དེ་ལས་ Connect cryptoགི་དོན་ལུ་ཨིན།

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

འདི་བཟུམ་སྦེ་ ལག་ལེན་འཐབ་དགོ། `URLSession` བརྟག་དཔྱད་འབད་ `https://taira.sora.org/v1/assets/definitions?limit=5` དེ་འབདཝ་ད་ ཁྱེད་ཀྱིས་རྐྱབ་པའི་བསྒང་ལས་ UI དེ་ལས་ སྤྱོད་ལམ་འདི་ བསྐྱར་ཞིབ་འབད་ཞིནམ་ལས་ `IrohaSDK` གྲོགས་རམ་འབད་མི་ཚུ་རྐྱངམ་ཅིག་ ཨེཔ་གིས་ ཉེན་སྲུང་ཅན་གྱི་གནས་སྡུད་ནང་ལས་ ཐོ་བཀོད་འབད་ཡོད་པའི་བརྡ་དོན་ཚུ་ བཏོན་ཞིནམ་ལས་ དེ་ལས་རྩིས་ཁྲ་དེ་ དངུལ་ཀྲམ་སྤྲོད་ཚར་བའི་ཤུལ་ལས་ འབད། Taira.

ཚོང་འབྲེལ་བཟོ་ནི་དང་ བཏང་ནིའི་དོན་ལུ་ `IrohaSDK` གྲོགས་རམ་འབད་མི་ཚུ་ ལག་ལེན་འཐབ་ཨིན། འདི་ཚུ་གིས་ རང་བཞིན་གྱི་ Bridge-backed transaction encoder ཟེར་འབད།

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, དང་ `UnshieldRequest` དམ་ཚིག་ཅན་གྱི་རྩིས་ཁྲ་ IDs དང་ ཀ་ནོ་སི་ཀཱོལ་མ་མཐུན་པའི་ Base58 ལས་ཁུངས་ཀྱི་འགྲེལ་བཤད་ IDs ལག་ཁྱེར་མ་བཙུགས་པའི་ཧེ་མ་

## རང་ལུགས་ཀྱི་ Escrow {#native-escrow}

Swift གིས་ཚོང་ཁྲོམ་དང་མིང་མ་ཤེསཔ་གི་རྒྱབ་སྐྱོར་གྱི་བཀོད་རྒྱ་ཚུ་ བཟོ་ནི་ཨིནམ་ད་ Norito JSON གིས་ `NativeEscrowInstructionBuilders` ཡང་ན་ དེ་འདྲ་མཉམ་ཨིན་པའི་ `IrohaSDK.build*Escrow*` ཆ་རོགས་ཚུ་གི་ཐོག་ལས་ ཕན་ཐོགས་ཅན་ཅིག་སྦེ་བཟོ་དོ་ཡོདཔ་ཨིན། དཔེ་འབད་བ་ཅིན་ [ Native Asset Escrow](/dz/blockchain/escrow.md#swift-and-ios) ལུ་བལྟ་ཚུགས། མིང་མ་ཤེསཔ་ཀྱི་རྒྱབ་སྐྱོར་ Fields དང་ རྩོད་གཞི་སེལ་ནིའི་ཆོག་ཐམ་ token འདི་ཡང་མཐོང་འོང་།

## རྟགས་མཚན་བཀོད་ཐབས། {#signing}

`Keypair`འདི་ Ed25519 གི་ལྕོགས་གྲུབ་ API ཨིན། གཞན་ཨལ་གེ་རི་ཏམ་ཚུ་གི་དོན་ལུ་ `IrohaSDK` བཟོ་ཞིནམ་ལས་ `defaultSigningAlgorithm` དང་གཅིག་ཁར་དང་ `generateSigningKey()` ཡང་ན་ `signingKey(fromSeed:)` ལག་ལེན་འཐབ་དགོ།

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

འདི་ཚུ་ `SigningAlgorithm` enum འདི་ ད་རེས་ Ed25519 དང་ secp256k1 ཚུ་ནང་ཚུད་ཡོདཔ་ཨིན། BLS ཁྱད་ཚད་ལྡན་དང་ཆུང་བ་ཚུ་ ML-DSA, GOST R 34.10-2012 ཚད་འཛིན་གྱི་སྡེ་ཚན་ཚུ་དང་ SM2. ཨེཌ་༢༥༥༡༩ གི་ལམ་གྱི་ཕྱི་ཁར་ རང་སོའི་གཞུང་སྒོ་གི་ རྒྱབ་སྐྱོར་འདི་ དགོཔ་ཨིན།

## འབྲེལ་མཐུད་འབད་ {#connect}

Connect client འདི་ Swift source ལུ་ལག་ལེན་འཐབ་སྟེ་ཡོདཔ་ད་ `NoritoBridge` གིས་རྒྱབ་སྐྱོར་འབད་ཡོད་པའི་ crypto དང་ frame codecs:

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

`ConnectSession` གིས་སྒོ་ཕྱེ་ནི་དང་བསྡམས་ནི་ཚུ་ ལེན་དོ་ཡོདཔ་དང་ སྦྲེལ་ཡོད་པའི་ཁེབས་བཀླག་ཐབས། ཐོ་ཕྱོགས་ལྡེ་མིག་ཚུ་ བཏོན་ཐབས། འབྱུང་རྐྱེན་རྒྱུགས་ཐབས། ཉམས་སྒྲུང་རྒྱུགས་ཐངས། དེ་ལས་བརྟག་དཔྱད་ཀྱི་དུས་དེབ་ཚུ་

## ད་ལྟོའི་ཁེ་ཕན་ {#current-coverage}

Swift ཐོན་ཁུངས་འདི་ ད་ལྟོ་གི་ནང་ཚུགསཔ།

- `ToriiClient` HTTP རྩིས་ཁྲ་ཚུ་གི་དོན་ལུ་ གྲོགས་རམ་འབད་མི་ཚུ་, རྒྱུ་དངོས་ཚུ་, མིང་རྟགས་ཚུ་, ཞིབ་འཚོལ་གྱི་ཤོག་ལེབ་ཚུ་, RWA, ལས་འཆམ་, multisig, གཞུང་སྐྱོང་, ཐོ་བཀོད་ཚུ་, ཌེ་ཊའི་གི་ཐོབ་ཐངས་, གསང་བའི་རྒྱུ་དངོས་ཚུ་, མཚམས་འཇོག་ / དུས་རྒྱུན་གནས་སྟངས་, གསོ་བའི་གནས་ཚུལ།, མེ་ཊིག་སི་དང་ SSE རྒྱུགས་ཆུའི་དོན་ལུ་
- `IrohaSDK` ཚོང་འབྲེལ་བཟོ་མི་ཚུ་དང་ ཕྱིར་འབུད་འབད་ནི་ལུ་ རྒྱབ་སྐྱོར་འབད་མི་ཚུ་, མིན་ཏིག་, མེ་སྤར་གཏང་ནི་, གདོང་ཁེབས་, ཕྱིར་འབུདཔ་མེད་མི་, ZK ཕྱིར་འབུབ་, ZK རྒྱུ་དངོས་གི་ཐོ་ཡིག་, metadata, ངོ་རྐྱང་ཐོབ་ཐངས་ཚུ་, multisig ཐོ་བཀོད་དང་ ལམ་སྟོན་ཚུ་གི་དོན་ལུ་
- `PendingTransactionQueue`དང་ `FilePendingTransactionQueue`བརྒྱུད་དེ་ ཕྱིར་ཚོང་གི་གྲལ་རིམ་རྒྱབ་སྐྱོར་མ་བྱིན་པར་བཞག་ཡོདཔ་ཨིན།
- རྩིས་ཁྲ་ཁ་བྱང་དང་ I105 གི་རྒྱབ་སྐྱོར་འབད་མི་ཚུ་ `AccountAddress` དང་ `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST དང་ SM2 གི་རྟགས་བཀོད་འབད་ཐངས་ཚུ་ དགོས་མཁོ་ཡོད་པ་ཅིན་ རང་བཞིན་གྱི་གཞུང་ལམ་ རྒྱབ་སྐྱོར་དང་གཅིག་ཁར་ཨིན།
- ཚོང་འབྲེལ་གྱི་ས་སྒོ་གི་དོན་ལུ་ རང་སོའི་གཏེར་ཁའི་བརྡ་སྟོན་ལག་ལེན་བཟོ་སྐྲུན་འབད་མི་ཚུ་དང་ ངོ་མ་ཤེས་པའི་གཏེར་ཁའི་དོན་ལུ་
- WebSocket མཐུད་སྦྲེལ་འབད་ཐབས། སྒྲིག་གཞི་, crypto, session, queue, replay, and diagnostics assistants
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
