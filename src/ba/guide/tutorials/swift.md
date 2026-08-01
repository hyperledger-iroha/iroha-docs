---
translation_locale: ba
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift һәм iOS {#swift-and-ios}

Swift SDK өҫкө ағымындағы эш киңлеге тарафынан ебәрелгән `IrohaSwift` Swift пакеты `IrohaSwift/`. Уның пакеты манифестаһы өс китапхана продукцияһын билдәләй`IrohaSwift`, `IrohaSwiftMobileTransports` һәм `IrohaSwiftTransferUI`һәм iOS 15+ һәм macOS 12+ менән маҡсатҡа ҡуйыла Swift инструменттары 5.9.

Пакетта урындағы `NoritoBridge` бинар маҡсатҡа бәйле. пакеттың резолюцияһы төҙөлгәнгә тиклем `../dist/NoritoBridge.xcframework` раҫлана, ә транзакция йәки Connect крипто юлдары урындағы символдар йөкләнмәгәндә күпер булмаған хаталар ташлай.

## Swift Пакет менән идара итеүсе {#swift-package-manager}

Эш урындарына ҡаршы үҫешкәндә, пункт SwiftPM урындағы `IrohaSwift/` посылкалар каталогы. `Package.swift` булып тора `IrohaSwift`:

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

Үҙ ҡушымтағыҙ өсөн юлды көйләгеҙ. Хәҙерге `examples/ios/ConnectMinimalApp` юлына күсермәгеҙ; был манифест `../../IrohaSwift` менән `examples/IrohaSwift` билдәләнә.

Пакетты хәл итер алдынан күперҙең эш урыны тамырҙа булыуын тикшерегеҙ:

```bash
cd /path/to/iroha
make bridge-xcframework
```

Был `dist/NoritoBridge.xcframework` сығара; `IrohaSwift/Package.swift` уны `../dist/NoritoBridge.xcframework` тип атай.

## CocoaPods {#cocoapods}

Код базаһы шулай уҡ `IrohaSwift/IrohaSwift.podspec`. Ул иғлан итә: `IrohaSwift` капсула, Swift 5.9 һәм iOS 15. Подспект йәлеп итә Swift төп һаҡлағыстағы сығанаҡтар; тыуған күпер һаман да булырға тейеш һәм транзакция кодировкаһы өсөн бәйләнгән, Ed25519 булмаған ҡултамғалар һәм Connect крипто.

## Тиҙерәк старт {#quickstart}

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, һәм `UnshieldRequest` каноник иҫәбен раҫлау IDs һәм ҡануниally prefixed Base58 актив билдәләмәһе IDs ҡул ҡуйғанға тиклем.

## Тыуған эскровы {#native-escrow}

Swift баҙар һәм аноним эскроу күрһәтмәләрен төҙөй Norito JSON файҙалы йөкләмәләр аша `NativeEscrowInstructionBuilders` йәки тигеҙ `IrohaSDK.build*Escrow*` ярҙамсылары, ҡарағыҙ! [Туған активтар иҫәбенә кредит](/ba/blockchain/escrow.md#swift-and-ios) миҫалдар, аноним иҫбатлау баҫыуҙары һәм бәхәстәрҙе хәл итеү өсөн рөхсәт билдәһе.

## Ҡул ҡуйыу {#signing}

`Keypair` - Ed25519 ыңгайлылығы API. Башҡа алгоритмдар өсөн, `defaultSigningAlgorithm` менән `IrohaSDK` төҙөү һәм `generateSigningKey()` йәки `signingKey(fromSeed:)` ҡулланыу:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

`SigningAlgorithm` enum хәҙерге ваҡытта Ed25519, secp256k1, BLS нормаль һәм бәләкәй варианттарын, ML-DSA, GOST R 34.10-2012 параметр йыйылмаларын һәм SM2 үҙ эсенә ала.

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

let session = ConnectSession(sessionID: sessionID, client: client)
let keyPair = try ConnectCrypto.generateKeyPair()
```

`ConnectSession` асыҡ һәм ябыҡ контроллерҙар, шифрланған конверт уҡый, йүнәлеш төймәләре, ағым контроле, ваҡиға ағымы, баланс ағымы һәм диагностика журналдары менән шөғөлләнә.

## Хәҙерге яҡтыртыу {#current-coverage}

Swift сығанағына әлеге ваҡытта түбәндәгеләр инә:

- `ToriiClient` HTTP иҫәбенә ярҙамсылар, активтар, ҡушаматтар, Explorer биттәрҙәре, RWA, килешеүҙәр, мультисиг, идара итеү, яҙылыуҙар, мәғлүмәттәрҙең булыуы, конфиденциаль активтар, узел/эш ваҡыты статусы, һаулыҡ, метрикалар һәм SSE ағымдар
- `IrohaSDK` транзакция төҙөүселәр һәм күсереү өсөн тапшырыу/һайлау ярҙамсылары, минет, яндырыу, ҡалҡан, ҡалҡанһыҙ, ZK күсереү, ZK активтарҙы теркәү, метамәғлүмәттәр, идентификатор талаптары, күп тамғалы теркәү һәм идара итеү инструкциялары
- `PendingTransactionQueue` һәм `FilePendingTransactionQueue` аша күрелгән транзакция сираттары ярҙамы
- иҫәбенә адрес һәм I105 ярҙамсылары аша `AccountAddress` һәм `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST һәм SM2 ҡултамғалау өҫкө йөҙҙәре, кәрәк саҡта күпер ярҙамы менән.
- баҙар өсөн файҙалы йөк төҙөүселәр һәм анонимлыҡ менән тәьмин итеү
- WebSocket, кадр, криптовалюта, сессия, сират, ҡабаттан уйнау һәм диагностика ярҙамсыларын тоташтырыу
- Кагемуша әҙерлеге, типография менән тулыландырыу һәм түләтеү, эксплуатация торошо, иҫкәрмә, тиңдәш төркөмө, квитанция һәм QR ағым моделе
- SoraFS, мәғлүмәттәр менән тәьмин итеү һәм иҫбатлау ҡушыу ярҙамсылары

## API Миҫалдар {#api-examples}

Йәмәғәт тормошҡа ашырыу өсөн `IrohaSwift/Sources/IrohaSwift` һәм шул уҡ сығанаҡтан алынған һыналған ҡулланыу миҫалдары өсөн `IrohaSwift/Tests/IrohaSwiftTests` ҡулланыу.

## Сығанаҡтар {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
