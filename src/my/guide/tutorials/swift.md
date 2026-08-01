---
translation_locale: my
translation_source: /guide/tutorials/swift.md
translation_source_hash: 85cc94399b9892984615bf8a0821a1f30395eb87ec164592ca98fbd9903ef834
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift နှင့် iOS {#swift-and-ios}

နိုင်ငံတကာ Swift SDK Upstream အလုပ်ခွင်က ပို့ပေးတာက `IrohaSwift` Swift အောက်ပါ package ကို `IrohaSwift/`. ၎င်း၏ package manifest တွင် စာကြည့်တိုက်ထုတ်ကုန် သုံးခုကို သတ်မှတ်ထားသည်`IrohaSwift`, `IrohaSwiftMobileTransports`, နှင့် `IrohaSwiftTransferUI`နှင့် iOS 15+ နှင့် macOS 12+ ကို ရည်မှန်းထားသည် Swift ကိရိယာများ 5.9.

ပဲခူးက ဒေသခံကို မူတည်တယ်။ `NoritoBridge` ဘိုင်နရီ ရည်မှန်းချက်။ ပါကတ်အဖြေကို validates `../dist/NoritoBridge.xcframework` မတည်ဆောက်ခင်၊ ငွေချေးမှု (သို့) Connect crypto paths တွေက ဒေသခံ သင်္ကေတတွေ မတင်တဲ့အခါ တံတားမရနိုင်တဲ့အမှားတွေကို ပစ်လွှတ်တယ်။

## Swift Package Manager ကို {#swift-package-manager}

စစ်ဆေးထားတဲ့ အလုပ်ခွင်တစ်ခုနဲ့ ဆောက်လုပ်တဲ့အခါ ဒေသတွင်း `IrohaSwift/` package directory မှာ SwiftPM ကို ညွှန်ပြပါ။ `Package.swift` ကသုံးတဲ့ package ID ဟာ `IrohaSwift` ပါ။

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

သင့် app အတွက် Path ကိုပြင်ဆင်ပါ။ လက်ရှိ `examples/ios/ConnectMinimalApp` path ကို copy မလုပ်ပါနဲ့။ ဒီ manifest က `../../IrohaSwift` ကို `examples/IrohaSwift` သို့ ဖြေရှင်းပေးတယ်။

Package ကို ဖြေရှင်းမပေးခင် တံတားဟာ workspace root မှာရှိတာကို သေချာအောင်လုပ်ပါ။

```bash
cd /path/to/iroha
make bridge-xcframework
```

`dist/NoritoBridge.xcframework` ကိုထုတ်ပေးပြီး `IrohaSwift/Package.swift` ကတော့ `../dist/NoritoBridge.xcframework` လို့ခေါ်ပါတယ်။

## CocoaPods {#cocoapods}

ဒီကုဒ်ဘေ့စ်မှာလည်း ပါဝင်ပါတယ်။ `IrohaSwift/IrohaSwift.podspec`. ၎င်းက ကြေညာသည် `IrohaSwift` အိတ်၊ Swift 5.9 နဲ့ iOS 15 တို့ပါ။ podspec က ဆွဲပေးတယ်။ Swift အဓိက သိုလှောင်ရုံမှ ရင်းမြစ်များ; ဒေသခံတံတားသည် တည်ရှိပြီး ငွေပေးချေမှု ကုဒ်သွင်းခြင်းအတွက် ချိတ်ဆက်ထားရဦးမည်။ Ed25519 မဟုတ်တဲ့ လက်မှတ်ရေးထိုးခြင်းနဲ့ Connect crypto ကိုပါ။

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

## Taira ကို စမ်းကြည့်ပါ။ ဖတ်ရုံပဲ {#try-taira-read-only}

ဒီကိရိယာ (သို့) Simulator က အများပြည်သူ Taira အဆုံးသတ်မှတ်တိုင်ကို ရောက်ရှိနိုင်ကြောင်း အတည်ပြုဖို့ ရိုးရှင်းတဲ့ HTTP ဆန်ဒါတစ်ခုနဲ့ စတင်ပါ။

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

အလားတူပဲ သုံးပါ။ `URLSession` စစ်ဆေးပါ `https://taira.sora.org/v1/assets/definitions?limit=5` သင်ဟာ တည်ဆောက်နေတုန်းမှာ UI အပြုအမူကို ထပ်ပြီး စမ်းကြည့်ပါ။ `IrohaSDK` အကူအညီပေးသူတွေကို လုံခြုံတဲ့ သိုလှောင်မှုကနေ လက်မှတ်ရေးထိုးစာရွက်စာတမ်းကို app က ထည့်သွင်းပြီးနောက်မှပဲ ငွေကြေးထောက်ပံ့မှုကို ပေးပို့ပါ။ Taira.

`IrohaSDK` အကူအညီများကို အသုံးပြု၍ ငွေပေးချေမှု တည်ဆောက်ရန်နှင့် တင်ပြရန်။ ၎င်းတို့သည် ပင်ကိုယ် bridge-backed transaction encoder ကိုခေါ်သည်။

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, နှင့် `UnshieldRequest` တရားဝင်စာရင်းကို validate IDs နှင့် Canonical Unprefixed Base58 အရင်းအမြစ် အဓိပ္ပါယ်ဖွင့်ဆိုချက် IDs လက်မှတ်မထိုးခင်မှာပေါ့။

## Native Escrow {#native-escrow}

Swift စျေးကွက်နှင့် အမည်မသိ escrow ညွှန်ကြားချက်များကိုတည်ဆောက်သည် Norito JSON အသုံးဝင် ဝန်ဆောင်မှုများ `NativeEscrowInstructionBuilders` (သို့) ညီမျှသော `IrohaSDK.build*Escrow*` အကူအညီပေးသူတွေ၊ ကြည့်ပါ။ [Native Asset Escrow](/my/blockchain/escrow.md#swift-and-ios) ဥပမာ၊ အမည်မဲ့ သက်သေပြမှု ကွင်းများနှင့် ပဋိပက္ခဖြေရှင်းခွင့် လက်မှတ်ကိုပါ။

## လက်မှတ်ရေးထိုးခြင်း {#signing}

`Keypair` သည် Ed25519 convenience API ဖြစ်သည်။ အခြားအယ်လ်ဂိုရစ်သမ်များအတွက် `IrohaSDK` ကို `defaultSigningAlgorithm` ဖြင့်တည်ဆောက်ပြီး `generateSigningKey()` သို့မဟုတ် `signingKey(fromSeed:)` ကိုအသုံးပြုပါ။

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

`SigningAlgorithm` enum တွင် လက်ရှိတွင် Ed25519, secp256k1, BLS ပုံမှန်နှင့် အသေးစားဗားရှင်းများ၊ ML-DSA, GOST R 34.10-2012 ပမာဏစုများနှင့် SM2 ပါဝင်သည်။ ဒေသတွင်းတံတားထောက်ပံ့မှုသည် Ed25519 သက်တောင့်သက်သာလမ်းကြောင်းအပြင်လိုအပ်သည်။

## ချိတ်ဆက်ခြင်း {#connect}

Connect client ကို Swift အရင်းအမြစ်မှာ အကောင်အထည်ဖော်ထားပြီး `NoritoBridge` ကထောက်ပံ့တဲ့ crypto နဲ့ frame codecs တွေနဲ့ပါ ၀ င်ပါတယ်။

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

`ConnectSession` ဟာ ဖွင့်ပြီး ပိတ်တဲ့ ထိန်းချုပ်မှုတွေ၊ ကုဒ်သွင်းထားတဲ့ စာအိတ်ဖတ်တာ၊ လမ်းညွှန်ချက် ခလုတ်တွေ၊ စီးဆင်းမှု ထိန်းချုပ်မှု၊ ဖြစ်ရပ်စီးကြောင်းတွေ၊ ဟန်ချက်ညီမှုစီးကြောင်းတွေနဲ့ ရောဂါရှာဖွေရေး ဂျာနယ်တွေကို ကိုင်တွယ်ပါတယ်။

## လက်ရှိအကာအကွယ် {#current-coverage}

Swift အရင်းအမြစ်မှာ လက်ရှိတွင်:

- `ToriiClient` HTTP အကူအညီများ စာရင်းများ၊ အရင်းအမြစ်များ၊ အမည်မဖော်လိုသူများ၊ စူးစမ်းရှာဖွေရေးစာမျက်နှာများ၊ RWA၊ စာချုပ်များ၊ multisig များ၊ အုပ်ချုပ်မှု၊ လက်မှတ်ထိုးခြင်းများ၊ ဒေတာရရှိနိုင်မှု၊ လျှို့ဝှက်အရင်းအမြစ်၊ node/runtime အခြေအနေ၊ ကျန်းမာရေး၊ တိုင်းထွာချက်များနှင့် SSE စီးကြောင်းများအတွက်
- `IrohaSDK` ငွေပေးချေမှု တည်ဆောက်သူများနှင့် လွှဲပြောင်းခြင်း၊ ငွေကြေးထုတ်လုပ်ခြင်း၊ မီးရှို့ခြင်း၊ ကန့်သတ်ချက်၊ ကန့်ကွက်ချက်မရှိသော လွှဲပြောင်းမှု၊ ZK အရင်းအမြစ်မှတ်ပုံတင်ခြင်း၊ ZK မီတာဒေတာများ၊ မှတ်ပုံတင်အဆိုများ၊ multisig မှတ်ပုံတင်ခြင်းနှင့် အုပ်ချုပ်ရေး ညွှန်ကြားချက်များအတွက် တင်ပြ/ရွေးကောက်ပွဲကူညီသူများ
- `PendingTransactionQueue` နှင့် `FilePendingTransactionQueue` မှတစ်ဆင့် ငွေပေးချေမှုလိုင်းထောက်ပံ့မှုကို စောင့်ဆိုင်းနေသည်
- `AccountAddress` နှင့် `AccountId` မှတစ်ဆင့် အကူအညီပေးသူများအတွက် ငွေစာရင်းလိပ်စာနှင့် I105
- Ed25519, secp256k1, ML-DSA, BLS, GOST နှင့် SM2 လက်မှတ်ထိုးတဲ့ မျက်နှာပြင်များ၊ လိုအပ်ပါက ပင်ကိုယ်တံတားအထောက်အပံ့ဖြင့်
- စျေးကွက်အတွက် native escrow instruction payload builders နှင့် အမည်မသိ escrow များ
- WebSocket ကို ချိတ်ဆက်ပါ Frame, Crypto, Session, queue, replay နှင့် diagnostics အကူများ
- Kagemusha အသင့်ရှိမှု၊ ထိပ်သွင်းခြင်းနှင့် ပြန်လည်ဖြည့်စွက်ခြင်း၊ လုပ်ငန်းအခြေအနေ၊ မှတ်ချက်၊ အချိတ်အဆက်၊ လက်မှတ်၊ QR စီးဆင်းမှုပုံစံများ
- SoraFS, ဒေတာရရှိမှုနှင့် သက်သေခံချိတ်ဆက်ခြင်း အကူအညီများ

## API ဥပမာများ {#api-examples}

အများပြည်သူ အကောင်အထည်ဖော်ဖို့ `IrohaSwift/Sources/IrohaSwift` ကိုသုံးပြီး တူညီတဲ့ အရင်းအမြစ် ပြင်ဆင်မှုကနေ စမ်းသပ်ထားတဲ့ အသုံးပြုမှု နမူနာတွေအတွက်လည်း `IrohaSwift/Tests/IrohaSwiftTests` ကို သုံးပါ။

## အရင်းအမြစ် ကိုးကားချက်များ {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
