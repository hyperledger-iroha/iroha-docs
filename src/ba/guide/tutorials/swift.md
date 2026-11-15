---
translation_locale: ba
translation_source: /guide/tutorials/swift.md
translation_source_hash: 753ce1b5e0de4eae56b38e77962566b23fee56d4662a432a7bbe6ea807261422
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Swift һәм iOS {#swift-and-ios}

Swift SDK өҫкө ағымындағы эш киңлеге тарафынан ебәрелгән `IrohaSwift` Swift пакеты `IrohaSwift/`. Уның пакеты манифестаһы өс китапхана продукцияһын билдәләй`IrohaSwift`, `IrohaSwiftMobileTransports` һәм `IrohaSwiftTransferUI`һәм iOS 15+ һәм macOS 12+ менән маҡсатҡа ҡуйыла Swift инструменттары 5.9.

Пакетта урындағы `NoritoBridge` бинар маҡсатҡа бәйле. пакеттың резолюцияһы төҙөлгәнгә тиклем `../dist/NoritoBridge.xcframework` раҫлана, ә транзакция йәки Connect крипто юлдары урындағы символдар йөкләнмәгәндә күпер булмаған хаталар ташлай.

## Swift Пакет менән идара итеүсе {#swift-package-manager}

Тикшереп алынған эш киңлегенә ҡаршы эшләгәндә, SwiftPM-ды урындағы `IrohaSwift/` пакет каталогына йүнәлтегеҙ. `Package.swift` ҡулланған пакет идентификаторы — `IrohaSwift`:

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

Үҙ ҡушымтағыҙ өсөн юлды көйләгеҙ. `examples/ios/ConnectMinimalApp/Package.swift` шул уҡ бәйлелекте `../../../IrohaSwift` тигән сағыштырма юл менән күрһәтә.

Пакетты хәл итер алдынан ағымдағы натив күперҙе йыйығыҙ. Урындағы эшләү һәм һынауҙар өсөн быны эш киңлеге тамырынан эшләтегеҙ:

```bash
cd /path/to/iroha
python3.12 scripts/test_swift_local.py
```

Релиз йыйылмалары `dist/NoritoBridge.xcframework` файлын `make bridge-xcframework` ярҙамында булдыра; был `SOURCE_DATE_EPOCH`, `NORITO_BRIDGE_OUT_DIR`, `NORITO_BRIDGE_BUILD_DIR`, `NORITO_BRIDGE_ARCHIVE_OUTPUT` һәм `MOBILE_SDK_CARGO_LOCKFILE` талап итә. `IrohaSwift/Package.swift` күпергә `../dist/NoritoBridge.xcframework` тип һылтана.

## Тиҙерәк старт {#quickstart}

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

## Taira Тик уҡырға ғына {#try-taira-read-only}

Ябай HTTP зонд менән башланып, ҡоролма йәки симулятор йәмәғәт Taira һуңғы нөктәһенә барып етергә мөмкинлеген раҫлау:

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

Шул уҡ ҡулланырға `URLSession` тикшереү өсөн `https://taira.sora.org/v1/assets/definitions?limit=5` һеҙ төҙөгән ваҡытта UI һәм үҙ тәртибен яңынан һынап ҡарағыҙ. `IrohaSDK` ярҙамсыларын тапшырыу тик ҡушымтаға ҡул ҡуйыусы материал хәүефһеҙ һаҡлауҙан йөкмәтелгәндән һуң ғына һәм иҫәбенә финансланғандан Taira.

Транзакцияны төҙөү һәм тапшырыу өсөн `IrohaSDK` ярҙамсыларын ҡулланығыҙ. Улар урындағы күпер ярҙамында транзакция кодерын саҡыра:

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

`TransferRequest`, `MintRequest` һәм `BurnRequest` ҡул ҡуйыр алдынан каноник иҫәп идентификаторҙарын һәм префиксһыҙ каноник Base58 актив билдәләмәһе идентификаторҙарын тикшерә.

## Протоколға индерелгән эскроу {#native-escrow}

Swift баҙар эскроуы инструкцияларын `NativeEscrowInstructionBuilders` йәки уларға тиң `IrohaSDK.build*Escrow*` ярҙамсылары аша Norito JSON файҙалы йөктәре рәүешендә төҙөй. Миҫалдар һәм бәхәсте хәл итеүсе рөхсәт токены өсөн [протоколға индерелгән актив эскроуын](/ba/blockchain/escrow.md#swift-and-ios) ҡарағыҙ.

## Ҡул ҡуйыу {#signing}

`Keypair` - Ed25519 ыңгайлылығы API. Башҡа алгоритмдар өсөн, `defaultSigningAlgorithm` менән `IrohaSDK` төҙөү һәм `generateSigningKey()` йәки `signingKey(fromSeed:)` ҡулланыу:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

`SigningAlgorithm` enum хәҙерге ваҡытта Ed25519, secp256k1, BLS normal һәм small варианттарын, ML-DSA, GOST R 34.10-2012 параметрҙар йыйылмаларын һәм SM2-не үҙ эсенә ала. Ed25519 уңайлыҡ юлына инмәгән бөтә осраҡтарҙа native bridge ярҙамы талап ителә.

## Ҡатнашыу {#connect}

Connect клиенты Swift сығанағында ғәмәлгә ашырыла, `NoritoBridge` ярҙамында крипто һәм рамка кодектары менән:

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

`ConnectSession` асыҡ һәм ябыҡ контроллерҙар, шифрланған конверт уҡый, йүнәлеш төймәләре, ағым контроле, ваҡиға ағымы, баланс ағымы һәм диагностика журналдары менән шөғөлләнә.

## Хәҙерге яҡтыртыу {#current-coverage}

Swift сығанағына әлеге ваҡытта түбәндәгеләр инә:

- `ToriiClient` HTTP иҫәбенә ярҙамсылар, активтар, ҡушаматтар, Explorer биттәрҙәре, RWA, килешеүҙәр, мультисиг, идара итеү, яҙылыуҙар, мәғлүмәттәрҙең булыуы, конфиденциаль активтар, узел/эш ваҡыты статусы, һаулыҡ, метрикалар һәм SSE ағымдар
- `IrohaSDK` транзакция төҙөүселәре һәм күсереү, сығарыу, яндырыу, ZK активтарын теркәү, метамәғлүмәттәр, идентификатор дәғүәләре, мультиҡултамға теркәү, контракт урынлаштырыу һәм идара итеү бюллетендәре өсөн тапшырыу/һорап тороу ярҙамсылары
- `PendingTransactionQueue` һәм `FilePendingTransactionQueue` аша күрелгән транзакция сираттары ярҙамы
- иҫәбенә адрес һәм I105 ярҙамсылары аша `AccountAddress` һәм `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST һәм SM2 ҡултамғалау өҫкө йөҙҙәре, кәрәк саҡта күпер ярҙамы менән.
- баҙар өсөн файҙалы йөк төҙөүселәр һәм анонимлыҡ менән тәьмин итеү
- WebSocket, кадр, криптовалюта, сессия, сират, ҡабаттан уйнау һәм диагностика ярҙамсыларын тоташтырыу
- KAGEMUSHA V1 сым форматы ярҙамсылары һәм натив янсыҡтың Advance провайдеры, теркәү, тергеҙеү һәм ҡабул ителгән алмашыу саҡырыуҙары өсөн iPhone платформа адаптеры
- SoraFS, мәғлүмәттәр менән тәьмин итеү һәм иҫбатлау ҡушыу ярҙамсылары

## API Миҫалдар {#api-examples}

Йәмәғәт тормошҡа ашырыу өсөн `IrohaSwift/Sources/IrohaSwift` һәм шул уҡ сығанаҡтан алынған һыналған ҡулланыу миҫалдары өсөн `IrohaSwift/Tests/IrohaSwiftTests` ҡулланыу.

## Сығанаҡтар {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
