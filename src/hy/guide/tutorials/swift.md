---
translation_locale: hy
translation_source: /guide/tutorials/swift.md
translation_source_hash: 753ce1b5e0de4eae56b38e77962566b23fee56d4662a432a7bbe6ea807261422
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Swift եւ iOS {#swift-and-ios}

Swift SDK-ը, որը ուղարկվում է վերածնային աշխատանքային տարածքից, այն է `IrohaSwift` Swift փաթեթը `IrohaSwift/`-ի ներքո: Նրա փաթեթի մանիֆեսը սահմանում է երեք գրադարանային արտադրանքը`IrohaSwift`, `IrohaSwiftMobileTransports` եւ `IrohaSwiftTransferUI`, եւ ուղղված է iOS 15+-ին եւ macOS 12+-ին Swift գործիքների 5.9-ով.

Փաթեթը կախված է ներկառուցված `NoritoBridge` բինար թիրախից: Փաթեթի բանաձեւը հաստատում է `../dist/NoritoBridge.xcframework` կառուցվելուց առաջ, եւ գործարքի կամ Connect կրիպտո ուղիները նետում են կամուրջի անհասանելի սխալներ, երբ ներկառուցված խորհրդանիշները չեն բեռնվում:

## Swift Փաթեթավորման կառավարիչ {#swift-package-manager}

Երբ զարգանում է դեմ check-out աշխատանքային տարածքի, կետը SwiftPM տեղական `IrohaSwift/` փաթեթների ցուցակը: Փաթեթի ինքնությունը, որը օգտագործվում է `Package.swift` է `IrohaSwift`:

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

Կարգավորեք ուղին ձեր հավելվածի համար։ `examples/ios/ConnectMinimalApp/Package.swift`-ը ցույց է տալիս նույն կախվածությունը `../../../IrohaSwift` հարաբերական ուղով։

Նախքան փաթեթը լուծելը՝ կառուցեք ընթացիկ բնիկ կամուրջը։ Տեղային մշակման և թեստերի համար գործարկեք սա աշխատանքային տարածքի արմատից.

```bash
cd /path/to/iroha
python3.12 scripts/test_swift_local.py
```

Թողարկման կառուցումները `dist/NoritoBridge.xcframework`-ը ստեղծում են `make bridge-xcframework`-ով, որը պահանջում է `SOURCE_DATE_EPOCH`, `NORITO_BRIDGE_OUT_DIR`, `NORITO_BRIDGE_BUILD_DIR`, `NORITO_BRIDGE_ARCHIVE_OUTPUT` և `MOBILE_SDK_CARGO_LOCKFILE`։ `IrohaSwift/Package.swift`-ը կամուրջին հղում է անում որպես `../dist/NoritoBridge.xcframework`։

## Արագ սկիզբ {#quickstart}

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

## Փորձեք Taira Միայն կարդալ {#try-taira-read-only}

Սկսեք պարզ HTTP հետաքննությամբ ՝ հաստատելու համար, որ սարքը կամ սիմուլատորը կարող է հասնել հանրային Taira վերջնական կետին.

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

Օգտագործեք նույն `URLSession` ստուգումը `https://taira.sora.org/v1/assets/definitions?limit=5`-ի համար, երբ կառուցում եք UI եւ կրկին փորձեք վարքագիծը: Փոխիր `IrohaSDK`-ին, ուղարկեք օգնականներ միայն այն բանից հետո, երբ հավելվածը ապահով պահեստավորումներից ներբեռնում է ստորագրող նյութը եւ հաշիվն ֆինանսավորվում է Taira- ում:

Գործարքի ստեղծման եւ ներկայացնելու համար օգտագործեք `IrohaSDK` օգնականները: Նրանք կոչում են բրիջային աջակցությամբ գործարքների ներկառուցված կոդավորիչը.

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

`TransferRequest`-ը, `MintRequest`-ը և `BurnRequest`-ը ստորագրելուց առաջ վավերացնում են հաշիվների կանոնական ID-ները և ակտիվների սահմանումների կանոնական, առանց նախածանցի Base58 ID-ները։

## Բնակչական վարձակալություն {#native-escrow}

Swift-ը շուկայական էսկրոուի հրահանգները կառուցում է որպես Norito JSON օգտակար բեռներ՝ `NativeEscrowInstructionBuilders`-ի կամ համարժեք `IrohaSDK.build*Escrow*` օգնականների միջոցով։ Օրինակների և վեճը լուծողի թույլտվության տոկենի համար տես [Ակտիվների բնիկ էսկրոու](/hy/blockchain/escrow.md#swift-and-ios)։

## ստորագրություն {#signing}

`Keypair` է Ed25519 հարմարավետությունը API: Այլ ալգորիթմների համար կառուցեք `IrohaSDK` ՝ օգտագործելով `defaultSigningAlgorithm` եւ օգտագործեք `generateSigningKey()` կամ `signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

Գլխավոր էջ `SigningAlgorithm` enum- ը ներկայումս ներառում է Ed25519 secp256k1, BLS նորմալ եւ փոքր տարբերակներ, ML-DSA, GOST R 34.10-2012 պարամետրերի հավաքածուներ, եւ SM2. Տեղական կամուրջի աջակցությունը պահանջվում է Ed25519 հարմարավետ ճանապարհից դուրս:

## Կապակցեք {#connect}

Connect հաճախորդը իրականացվում է Swift աղբյուրում, կրիպտո եւ շրջանակային կոդեկներով, որոնք աջակցված են `NoritoBridge`:

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

`ConnectSession` կառավարում է բաց եւ փակ վերահսկողությունները, կոդավորված փաթեթների ընթերցումները, ուղղության բանալիները, հոսքի վերահսկողությունը, իրադարձությունների հոսքերը, մնացորդների հոսքերը եւ ախտորոշիչ ամսագրերը:

## Ներկայիս ծավալը {#current-coverage}

Swift աղբյուրը ներկայումս ներառում է:

- `ToriiClient` HTTP օգնականներ հաշիվների, ակտիվների, կեղծանունների, Explorer էջերի, RWA, պայմանագրերի, multisig-ի, կառավարման, բաժանորդագրությունների, տվյալների մատչելիության, գաղտնի ակտիվների, բջիջների/շարժային ժամանակի կարգավիճակի, առողջության, չափանիշների եւ SSE հոսքերի համար:
- `IrohaSDK` գործարքների կառուցիչներ և ներկայացման ու վիճակի պարբերական ստուգման օգնականներ՝ փոխանցման, թողարկման, այրման, ZK ակտիվների գրանցման, մետատվյալների, նույնացուցիչների հայտերի, բազմաստորագրային գրանցման, պայմանագրի տեղակայման և կառավարման քվեաթերթիկների համար
- `PendingTransactionQueue` եւ `FilePendingTransactionQueue` միջոցով սպասվող փոխարժեքների հերթի աջակցությունը
- հաշիվի հասցեն եւ I105 օգնականները, որոնք անցնում են `AccountAddress` եւ `AccountId`:
- Ed25519, secp256k1, ML-DSA, BLS, GOST եւ SM2 ստորագրող մակերեւույթներ, որտեղ անհրաժեշտ է տեղական կամուրջի աջակցություն
- տեղական հանձնարարականներ շուկայի համար եւ անանուն հանձնարարում
- Կապակցեք WebSocket, շրջանակ, կրիպտո, նստաշրջան, հերթ, կրկնօրինակում եւ ախտորոշման օգնականներ
- KAGEMUSHA V1 փոխանցման ձևաչափի օգնականներ և iPhone հարթակի ադապտեր՝ անմիջապես հարթակում աշխատող դրամապանակի Advance տրամադրողի, գրանցման, վերականգնման և ընդունված փոխանակման կանչերի համար
- SoraFS, տվյալների մատչելիության եւ ապացույցների հավելման օգնականներ

## API Օրինակներ {#api-examples}

Օգտագործել `IrohaSwift/Sources/IrohaSwift` հանրային իրականացման համար եւ `IrohaSwift/Tests/IrohaSwiftTests` նույն աղբյուրի վերանայման փորձարկված օգտագործման օրինակների համար:

## Աղբյուրի հղումներ {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
