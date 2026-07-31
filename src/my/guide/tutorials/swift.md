---
translation_locale: my
translation_source: /guide/tutorials/swift.md
translation_source_hash: 85cc94399b9892984615bf8a0821a1f30395eb87ec164592ca98fbd9903ef834
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift ပြီးတော့ iOS {#swift-and-ios}

နိုင်ငံခြားရေး Swift SDK Upstream အလုပ်ခွင်မှတင်ပို့သည် `IrohaSwift` Swift
အောက်ပါ package ကို `IrohaSwift/`. ၎င်းရဲ့ package manifest မှာ စာကြည့်တိုက် သုံးခုကို သတ်မှတ်ထားပါတယ်။
ထုတ်ကုန်များ`IrohaSwift`, `IrohaSwiftMobileTransports`, နှင့်
`IrohaSwiftTransferUI`iOS 15+ နဲ့ macOS 12+ ကို ရည်ရွယ်ပြီး Swift ကိရိယာများ 5.9.

ပါကတ်က ဒေသခံကို မူတည်ပါတယ်။ `NoritoBridge` ဘိုင်နရီ ပစ်မှတ်။
ကြေညာချက်ကို အတည်ပြု `../dist/NoritoBridge.xcframework` ဆောက်လုပ်ရေးမတိုင်ခင်နဲ့
transaction သို့မဟုတ် Connect crypto paths ကိုတံတားမရနိုင်သောအမှားများကိုပစ်
ဒေသခံ သင်္ကေတတွေ မတင်ပါဘူး။

## Swift Package Manager ကို {#swift-package-manager}

စစ်ဆေးထားတဲ့ အလုပ်ခွင်တစ်ခုနဲ့ ဆန့်ကျင်ပြီး ဆောက်လုပ်တဲ့အခါ Point SwiftPM ဒေသတွင်း
`IrohaSwift/` Package directory ကို အသုံးပြုသော package identity ကို
`Package.swift` ရှိသည် `IrohaSwift`:

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

App အတွက် Path ကိုပြင်ဆင်ပါ။ Current ကို Copy မလုပ်ပါနဲ့
`examples/ios/ConnectMinimalApp` လမ်းကြောင်းရှိသလို ဖြစ်နေပါသည်
`../../IrohaSwift` သို့ `examples/IrohaSwift`.

Package ကို ဖြေရှင်းမပေးခင် bridge က workspace root မှာရှိတာကို သေချာအောင်လုပ်ပါ။

```bash
cd /path/to/iroha
make bridge-xcframework
```

ဒါက `dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift`
၎င်းကို `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

ကုဒ်ဘေ့စ်မှာလည်း ပါဝင်ပါတယ်။ `IrohaSwift/IrohaSwift.podspec`. ၎င်းက ကြေညာထားသည်
`IrohaSwift` အိတ်၊ Swift 5.9 နဲ့ iOS 15 မှာ podspec က ဆွဲပေးတယ်။ Swift ရင်းမြစ်များ
အဓိက သိုလှောင်ရုံမှာ၊ မူလတံတားက ရှိနေဆဲဖြစ်ပြီး ဆက်သွယ်ဖို့ လိုအပ်ပါတယ်။
Transaction encoding, non-Ed25519 လက်မှတ်ရေးထိုးခြင်း, နှင့် Connect crypto.

## အမြန်စတင်ခြင်း {#quickstart}

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

## စမ်းကြည့်ပါ။ Taira စာဖတ်ခြင်းသာ {#try-taira-read-only}

ပကတိတစ်ခုနဲ့ စလိုက်ပါ HTTP probe က device (သို့) simulator ကိုရောက်ရှိနိုင်တာကိုအတည်ပြုဖို့
အများပြည်သူ Taira အဆုံးသတ်မှတ်ချက်:

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

အလားတူပဲ သုံးပါ။ `URLSession` စစ်ဆေးပါ
`https://taira.sora.org/v1/assets/definitions?limit=5` သင်ဟာ ဆောက်လုပ်နေတုန်း
UI နောက်တစ်ကြိမ် ပြုမူမှုကို စမ်းကြည့်ပါ။ `IrohaSDK` အကူအညီပေးသူတွေကို
app က လုံခြုံတဲ့ သိုလှောင်မှုကနေ လက်မှတ်ရေးထိုးသူ ပစ္စည်းတွေကို တင်ပြီး အကောင့်ကို ငွေကြေးထောက်ပံ့ပေးတယ်။
Taira.

ငွေလဲလှယ်မှု တည်ဆောက်ပြီး တင်ပြဖို့ `IrohaSDK` အကူအညီပေးသူတွေ၊
Native bridge-backed transaction encoder:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, နှင့်
`UnshieldRequest` တရားဝင်စာရင်းကို အတည်ပြု IDs ကနောနိဗ္ဗာန်နဲ့ မစတင်တဲ့
Base58 အရင်းအမြစ် သတ်မှတ်ချက် IDs လက်မှတ်မထိုးခင်

## Native Escrow {#native-escrow}

Swift စျေးကွက်နှင့်မည်မသိ escrow ညွှန်ကြားချက်များကိုတည်ဆောက်သည် Norito JSON
အကူအညီပေးသော ဝန်ဆောင်မှုများ `NativeEscrowInstructionBuilders` သို့မဟုတ် ညီမျှသော
`IrohaSDK.build*Escrow*` အကူအညီပေးသူတွေ၊
[Native Asset Escrow](/my/blockchain/escrow.md#swift-and-ios) နမူနာများအတွက်
အမည်မသိ သက်သေခံ ကွင်းတွေ၊ ပဋိပက္ခဖြေရှင်းခွင့် လက်မှတ်တွေပေါ့။

## လက်မှတ်ရေးထိုးခြင်း {#signing}

`Keypair` Ed25519 ရဲ့ သက်တောင့်သက်သာမှု API. အခြားအယ်လ်ဂိုရစ်သမ်များအတွက်
`IrohaSDK` နှင့်အတူ `defaultSigningAlgorithm` အသုံးပြုခြင်း `generateSigningKey()` ဒါမှမဟုတ်
`signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

နိုင်ငံခြားရေး `SigningAlgorithm` enum တွင် Ed25519၊ secp256k1 ပါဝင်သည်။ BLS ပုံမှန်
အသေးစားပုံစံတွေနဲ့ ML-DSA, GOST R 34.10-2012 ပါရီမီတာ အစုများနှင့် SM2. ဒေသခံ
ED25519 လမ်းကြောင်းအပြင်မှာ တံတားထောက်ပံ့မှု လိုအပ်ပါတယ်။

## ဆက်သွယ်ခြင်း {#connect}

Connect client ကို Swift source ကို crypto နဲ့ frame codec တွေနဲ့
ထောက်ခံချက် `NoritoBridge`:

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

`ConnectSession` ဖွင့်ပြီး ပိတ်တဲ့ ထိန်းချုပ်မှု လက်ကိုင်တွေ၊ ကုဒ်သွင်းထားတဲ့ စာအိတ်တွေ ဖတ်တယ်။
လမ်းညွှန်ချက်များ၊ စီးဆင်းမှု ထိန်းချုပ်မှု၊ ဖြစ်စဉ်စီးကြောင်းများ၊ ဟန်ချက်ညီမှုစီးကြောင်းများနှင့် ရောဂါစစ်ဆေးမှုများ
ဂျာနယ်တွေပေါ့။

## လက်ရှိအကာအကွယ် {#current-coverage}

နိုင်ငံခြားရေး Swift အရင်းအမြစ်သည် လက်ရှိတွင်:

- `ToriiClient` HTTP အကောင့်များ၊ အရင်းအမြစ်များ၊ အမည်မဖော်လိုသူများ၊ စူးစမ်းရှာဖွေရေး စာမျက်နှာများအတွက် အကူအညီပေးသူများ
  RWA, စာချုပ်များ၊ multisig များ၊ အုပ်ချုပ်ရေးစနစ်၊ လက်မှတ်ထိုးခြင်းများ၊ ဒေတာရရှိနိုင်မှု
  လျှို့ဝှက်ပစ္စည်းများ၊ node/runtime အခြေအနေ၊ ကျန်းမာရေး၊ metrics များနှင့် SSE မြစ်များ
- `IrohaSDK` ငွေလွှဲပြောင်းရေးအတွက် ငွေပေးချေမှု တည်ဆောက်သူများနှင့် တင်သွင်း/ရွေးကောက်ပွဲ အကူအညီပေးသူများ၊
  မီးရှို့၊ ပိုင်းခတ်၊ ပိုင်းမပါ ZK လွှဲပြောင်းမှု ZK အရင်းအမြစ် မှတ်ပုံတင်၊ မီတာဒေတာ
  အမည်သတ်မှတ်ချက်များ၊ multisig မှတ်ပုံတင်ခြင်းနှင့် အုပ်ချုပ်ရေး ညွှန်ကြားချက်များ
- စောင့်ဆိုင်းနေသော ငွေပေးချေမှုတန်း ထောက်ပံ့မှု `PendingTransactionQueue` နှင့်
  `FilePendingTransactionQueue`
- အကောင့်လိပ်စာနှင့် I105 အကူအညီပေးသူများ `AccountAddress` နှင့် `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST, နှင့် SM2 လက်မှတ်ရေးထိုးတဲ့ မျက်နှာပြင်တွေ၊ ဒေသခံတွေနဲ့
  လိုအပ်ပါက တံတားထောက်ပံ့မှု
- စျေးကွက်အတွက် native escrow ညွှန်ကြားချက် အသုံးဝင်ဝန်ဆောင်မှု ဆောက်လုပ်သူများနှင့် အမည်မသိ
  အလှူခံ
- ဆက်သွယ်ခြင်း WebSocket, frame, crypto, session, queue, replay နဲ့ diagnostics
  အကူအညီပေးသူများ
- Kagemusha အသင့်ရှိမှု၊ ထိပ်သွင်းပြီး ပြန်လည်ဖြည့်ဆည်းခြင်း၊ လုပ်ငန်းအခြေအနေ၊ မှတ်ချက်
  တူညီတဲ့ ဘက်လ်၊ လက်မှတ်နဲ့ QR စီးဆင်းမှုပုံစံများ
- SoraFS, ဒေတာရရှိနိုင်မှုနှင့် သက်သေခံချိတ်ဆက်မှု အကူအညီများ

## API ဥပမာများ {#api-examples}

အသုံးပြုခြင်း `IrohaSwift/Sources/IrohaSwift` အများပြည်သူအတွက် အကောင်အထည်ဖော်ဖို့နဲ့
`IrohaSwift/Tests/IrohaSwiftTests` စမ်းသပ်သုံးစွဲမှု နမူနာများအတွက်
အရင်းအမြစ် ပြင်ဆင်ခြင်း။

## အရင်းအမြစ် ကိုးကားချက်များ {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
