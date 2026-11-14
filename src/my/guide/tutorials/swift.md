---
translation_locale: my
translation_source: /guide/tutorials/swift.md
translation_source_hash: 753ce1b5e0de4eae56b38e77962566b23fee56d4662a432a7bbe6ea807261422
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Swift နှင့် iOS {#swift-and-ios}

နိုင်ငံတကာ Swift SDK Upstream အလုပ်ခွင်က ပို့ပေးတာက `IrohaSwift` Swift အောက်ပါ package ကို `IrohaSwift/`. ၎င်းရဲ့ Package Technical Manifesto မှာ စာကြည့်တိုက်ထုတ်ကုန် သုံးခုကို သတ်မှတ်ထားပါတယ်။`IrohaSwift`, `IrohaSwiftMobileTransports`, နှင့် `IrohaSwiftTransferUI`နှင့် iOS 15+ နှင့် macOS 12+ ကို ရည်မှန်းထားသည် Swift ကိရိယာများ 5.9.

ဤပက်ကေ့ချ်သည် မူရင်းစက်ပေါ်ရှိ `NoritoBridge` binary ပစ်မှတ်အပေါ် မှီခိုသည်။ ပက်ကေ့ချ်ဖြေရှင်းမှုက build မလုပ်မီ `../dist/NoritoBridge.xcframework` ကို စစ်ဆေးပြီး မူရင်းသင်္ကေတများ မဖွင့်ရသေးလျှင် transaction သို့မဟုတ် Connect cryptography လမ်းကြောင်းများက ချိတ်ဆက်တံတားမရနိုင်သည့် အမှားများ ထုတ်ပေးသည်။

## Swift Package Manager ကို {#swift-package-manager}

checkout လုပ်ထားသော workspace ဖြင့် ဖွံ့ဖြိုးရေးလုပ်လျှင် SwiftPM ကို စက်တွင်း `IrohaSwift/` ပက်ကေ့ချ်ဖိုင်တွဲသို့ ညွှန်ပါ။ `Package.swift` အသုံးပြုသော ပက်ကေ့ချ်အထောက်အထားသည် `IrohaSwift` ဖြစ်သည်။

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

သင့် app အတွက် လမ်းကြောင်းကို ပြင်ဆင်ပါ။ `examples/ios/ConnectMinimalApp/Package.swift` သည် တူညီသော dependency ကို ဆက်စပ်လမ်းကြောင်း `../../../IrohaSwift` ဖြင့် ပြသည်။

Package ကို resolve မလုပ်မီ လက်ရှိ native bridge ကို တည်ဆောက်ပါ။ ဒေသတွင်း ဖွံ့ဖြိုးရေးနှင့် စမ်းသပ်မှုများအတွက် ၎င်းကို workspace root မှ လုပ်ဆောင်ပါ:

```bash
cd /path/to/iroha
python3.12 scripts/test_swift_local.py
```

ထုတ်ဝေရေး build များသည် `make bridge-xcframework` ဖြင့် `dist/NoritoBridge.xcframework` ကို ထုတ်လုပ်ပြီး ၎င်းအတွက် `SOURCE_DATE_EPOCH`၊ `NORITO_BRIDGE_OUT_DIR`၊ `NORITO_BRIDGE_BUILD_DIR`၊ `NORITO_BRIDGE_ARCHIVE_OUTPUT` နှင့် `MOBILE_SDK_CARGO_LOCKFILE` လိုအပ်သည်။ `IrohaSwift/Package.swift` သည် bridge ကို `../dist/NoritoBridge.xcframework` အဖြစ် ရည်ညွှန်းသည်။

## အမြန်စတင်ခြင်း {#quickstart}

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

## Taira ကို စမ်းကြည့်ပါ။ ဖတ်ရုံပဲ {#try-taira-read-only}

စက်ပစ္စည်း သို့မဟုတ် simulator က အများသုံး Taira ၏ endpoint သို့ ရောက်ရှိနိုင်ကြောင်း အတည်ပြုရန် ရိုးရှင်းသော HTTP စမ်းသပ်ချက်ဖြင့် စတင်ပါ:

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

UI နှင့် ပြန်ကြိုးစားမှုအပြုအမူကို တည်ဆောက်နေစဉ် `https://taira.sora.org/v1/assets/definitions?limit=5` အတွက် တူညီသော `URLSession` စစ်ဆေးမှုကို အသုံးပြုပါ။ အက်ပ်က လက်မှတ်ထိုးဒေတာကို လုံခြုံသောသိုလှောင်မှုမှ ဖွင့်ပြီး အကောင့်၌ Taira ပေါ်တွင် ရန်ပုံငွေရှိပြီးမှသာ `IrohaSDK` တင်သွင်းမှုအကူကိရိယာများသို့ ပြောင်းပါ။

`IrohaSDK` အကူအညီများကို အသုံးပြု၍ ငွေပေးချေမှုတစ်ခု တည်ဆောက်ပြီး တင်သွင်းပါ။ ၎င်းတို့သည် မူလ bridge-backed transaction encoder ကိုခေါ်ယူသည်။

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

`TransferRequest`၊ `MintRequest` နှင့် `BurnRequest` တို့သည် လက်မှတ်မထိုးမီ ကနွန်နစ်အကောင့် ID များနှင့် ရှေ့ဆက်စာသားမပါသော ကနွန်နစ် Base58 ပိုင်ဆိုင်မှုသတ်မှတ်ချက် ID များကို စစ်ဆေးအတည်ပြုသည်။

## စံညွှန်ကြားချက်ဖြင့် ကြားခံထိန်းသိမ်းခြင်း {#native-escrow}

Swift သည် `NativeEscrowInstructionBuilders` သို့မဟုတ် ညီမျှသော `IrohaSDK.build*Escrow*` အကူအညီပေး function များမှတစ်ဆင့် စျေးကွက် escrow ညွှန်ကြားချက်များကို Norito JSON payload များအဖြစ် တည်ဆောက်သည်။ ဥပမာများနှင့် အငြင်းပွားမှု ဖြေရှင်းသူ၏ ခွင့်ပြုချက် token အတွက် [ပိုင်ဆိုင်မှုများကို စံညွှန်ကြားချက်ဖြင့် ကြားခံထိန်းသိမ်းခြင်း](/my/blockchain/escrow.md#swift-and-ios) ကို ကြည့်ပါ။

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

let keyPair = try ConnectCrypto.generateKeyPair()
let session = try ConnectSession(
    networkID: try NetworkId(literal: "<exact-network-id>"),
    appPublicKey: keyPair.publicKey,
    nonce: nonce,
    relayToken: "<token>",
    client: client
)
```

`ConnectSession` ဟာ ဖွင့်ပြီး ပိတ်တဲ့ ထိန်းချုပ်မှုတွေ၊ ကုဒ်သွင်းထားတဲ့ ဒေတာ ကွန်တိန်နာဖတ်တာ၊ လမ်းညွှန်ချက် ခလုတ်တွေ၊ စီးဆင်းမှု ထိန်းချုပ်မှု၊ ဖြစ်ရပ်စီးကြောင်းတွေ၊ ဟန်ချက်ညီမှုစီးကြောင်းတွေနဲ့ ရောဂါရှာဖွေရေး ဂျာနယ်တွေကို ကိုင်တွယ်ပါတယ်။

## လက်ရှိအကာအကွယ် {#current-coverage}

Swift အရင်းအမြစ်မှာ လက်ရှိတွင်:

- အကောင့်၊ ပိုင်ဆိုင်မှု၊ alias၊ ရှာဖွေကြည့်ရှုစာမျက်နှာ၊ RWA၊ စာချုပ်၊ လက်မှတ်စုံ၊ အုပ်ချုပ်မှု၊ စာရင်းသွင်းမှု၊ ဒေတာရရှိနိုင်မှု၊ လျှို့ဝှက်ပိုင်ဆိုင်မှု၊ နိုဒ်နှင့်လည်ပတ်စနစ်အခြေအနေ၊ ကျန်းမာရေး၊ တိုင်းတာချက်နှင့် SSE stream များအတွက် `ToriiClient` HTTP အကူကိရိယာများ
- လွှဲပြောင်းခြင်း၊ ထုတ်လုပ်ခြင်း၊ ဖျက်ဆီးခြင်း၊ ZK ပိုင်ဆိုင်မှု မှတ်ပုံတင်ခြင်း၊ metadata၊ identifier တောင်းဆိုမှုများ၊ multisig မှတ်ပုံတင်ခြင်း၊ contract ဖြန့်ကျက်ခြင်းနှင့် အုပ်ချုပ်မှု မဲပြားများအတွက် `IrohaSDK` transaction builder များနှင့် တင်သွင်းခြင်း/အခြေအနေစစ်ခြင်း အကူအညီပေး function များ
- `PendingTransactionQueue` နှင့် `FilePendingTransactionQueue` မှတစ်ဆင့် ငွေပေးချေမှုလိုင်းထောက်ပံ့မှုကို စောင့်ဆိုင်းနေသည်
- `AccountAddress` နှင့် `AccountId` မှတစ်ဆင့် အကူအညီပေးသူများအတွက် ငွေစာရင်းလိပ်စာနှင့် I105
- Ed25519, secp256k1, ML-DSA, BLS, GOST နှင့် SM2 လက်မှတ်ထိုးတဲ့ မျက်နှာပြင်များ၊ လိုအပ်ပါက ပင်ကိုယ်တံတားအထောက်အပံ့ဖြင့်
- စျေးကွက်အတွက် native escrow instruction payload builders နှင့် အမည်မသိ escrow များ
- WebSocket ကို ချိတ်ဆက်ပါ Frame, Crypto, Session, queue, replay နှင့် diagnostics အကူများ
- KAGEMUSHA V1 ကွန်ရက်ပို့ဆောင်မှုပုံစံ အကူလုပ်ဆောင်ချက်များနှင့် မူရင်းပိုက်ဆံအိတ်၏ Advance ပံ့ပိုးသူ၊ စာရင်းသွင်းမှု၊ ပြန်လည်ရယူမှုနှင့် လက်ခံခွင့်ရ ဖလှယ်မှု ခေါ်ယူချက်များအတွက် iPhone platform ချိတ်ဆက်ကိရိယာ
- SoraFS, ဒေတာရရှိမှုနှင့် သက်သေခံချိတ်ဆက်ခြင်း အကူအညီများ

## API ဥပမာများ {#api-examples}

အများပြည်သူ အကောင်အထည်ဖော်ဖို့ `IrohaSwift/Sources/IrohaSwift` ကိုသုံးပြီး တူညီတဲ့ အရင်းအမြစ် ပြင်ဆင်မှုကနေ စမ်းသပ်ထားတဲ့ အသုံးပြုမှု နမူနာတွေအတွက်လည်း `IrohaSwift/Tests/IrohaSwiftTests` ကို သုံးပါ။

## အရင်းအမြစ် ကိုးကားချက်များ {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
