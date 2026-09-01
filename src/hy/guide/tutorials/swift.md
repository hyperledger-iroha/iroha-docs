---
translation_locale: hy
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: nllb-200-ct2
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

Կարգավորեք ձեր հավելվածի ուղին: Մի կրկնօրինակեք ընթացիկ `examples/ios/ConnectMinimalApp` ուղին, ինչպես այն կա. այդ գրառումը լուծում է `../../IrohaSwift` ՝ `examples/IrohaSwift`.

Նախքան փաթեթը լուծելը, համոզվեք, որ կամուրջը գոյություն ունի աշխատատեղի արմատում.

```bash
cd /path/to/iroha
make bridge-xcframework
```

Այն արտադրում է `dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift`-ը նշում է այն որպես `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

Կոդային հիմնադրամը նաեւ պարունակում է `IrohaSwift/IrohaSwift.podspec`. Այն հայտարարում է, որ `IrohaSwift` կոշիկ, Swift 5.9, եւ iOS 15. Podspec ձգում է Swift հիմնական պահեստից ստացված աղբյուրներ. տեղական կամուրջը դեռ պետք է լինի եւ կապված են գործարքի կոդավորման, ոչ-Ed25519 ստորագրման եւ Connect crypto համար:

## Արագ սկիզբ {#quickstart}

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, եւ `UnshieldRequest` վավերացնել կանոնական հաշվետվությունը IDs եւ կանոնիկ անփոխարինված Base58 ակտիվի սահմանումը IDs նախքան ստորագրումը:

## Բնակչական վարձակալություն {#native-escrow}

Swift կառուցում է շուկայական եւ անանուն պահպանումի հրահանգներ որպես Norito JSON օգտակար բեռնվածքներ `NativeEscrowInstructionBuilders` կամ հավասար `IrohaSDK.build*Escrow*` օգնականների միջոցով: Դիտեք [ Ակտիվների ներկառուցված էսքրո](/hy/blockchain/escrow.md#swift-and-ios) օրինակները, անանուն ապացույցների դաշտերը եւ վեճերի լուծման թույլտվության տոքերը:

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

let session = ConnectSession(sessionID: sessionID, client: client)
let keyPair = try ConnectCrypto.generateKeyPair()
```

`ConnectSession` կառավարում է բաց եւ փակ վերահսկողությունները, կոդավորված փաթեթների ընթերցումները, ուղղության բանալիները, հոսքի վերահսկողությունը, իրադարձությունների հոսքերը, մնացորդների հոսքերը եւ ախտորոշիչ ամսագրերը:

## Ներկայիս ծավալը {#current-coverage}

Swift աղբյուրը ներկայումս ներառում է:

- `ToriiClient` HTTP օգնականներ հաշիվների, ակտիվների, կեղծանունների, Explorer էջերի, RWA, պայմանագրերի, multisig-ի, կառավարման, բաժանորդագրությունների, տվյալների մատչելիության, գաղտնի ակտիվների, բջիջների/շարժային ժամանակի կարգավիճակի, առողջության, չափանիշների եւ SSE հոսքերի համար:
- `IrohaSDK` գործարքների կառուցողներ եւ փոխանցման, մինետի, այրման, վահանակի, առանց վահանակների, ZK փոխանցման համար ներկայացվող/ընտրման օգնականներ, ZK ակտիվների գրանցում, մետադատա, նույնականացման պահանջներ, բազմակի գրանցում եւ կառավարման հրահանգներ
- `PendingTransactionQueue` եւ `FilePendingTransactionQueue` միջոցով սպասվող փոխարժեքների հերթի աջակցությունը
- հաշիվի հասցեն եւ I105 օգնականները, որոնք անցնում են `AccountAddress` եւ `AccountId`:
- Ed25519, secp256k1, ML-DSA, BLS, GOST եւ SM2 ստորագրող մակերեւույթներ, որտեղ անհրաժեշտ է տեղական կամուրջի աջակցություն
- տեղական հանձնարարականներ շուկայի համար եւ անանուն հանձնարարում
- Կապակցեք WebSocket, շրջանակ, կրիպտո, նստաշրջան, հերթ, կրկնօրինակում եւ ախտորոշման օգնականներ
- Kagemusha պատրաստությունը, տիպված լրացում եւ վերադարձ, շահագործման կարգավիճակ, ծանոթագրություն, հանգույցների փաթեթ, ստացուցք եւ QR հոսքի մոդելներ
- SoraFS, տվյալների մատչելիության եւ ապացույցների հավելման օգնականներ

## API Օրինակներ {#api-examples}

Օգտագործել `IrohaSwift/Sources/IrohaSwift` հանրային իրականացման համար եւ `IrohaSwift/Tests/IrohaSwiftTests` նույն աղբյուրի վերանայման փորձարկված օգտագործման օրինակների համար:

## Աղբյուրի հղումներ {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
