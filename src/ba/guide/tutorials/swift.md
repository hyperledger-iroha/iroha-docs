---
translation_locale: ba
translation_source: /guide/tutorials/swift.md
translation_source_hash: 85cc94399b9892984615bf8a0821a1f30395eb87ec164592ca98fbd9903ef834
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift һәм iOS {#swift-and-ios}

Ҡоролтай Swift SDK өҫкө ағымындағы эш урыны менән ебәрелгән `IrohaSwift` Swift посылка `IrohaSwift/`. Уның пакет манифестарында өс китапхана продукцияһы билдәләнә`IrohaSwift`, `IrohaSwiftMobileTransports`, һәм `IrohaSwiftTransferUI`һәм iOS 15+ һәм macOS 12+ менән маҡсатлы Swift инструменттар 5.9.

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

Үҙ ҡушымтағыҙ өсөн юлды көйләгеҙ. `examples/ios/ConnectMinimalApp` юлы бар; ул асыҡтан-асыҡ хәл итә `../../IrohaSwift` өсөн `examples/IrohaSwift`.

Пакетты хәл итер алдынан күперҙең эш урыны тамырҙа булыуын тикшерегеҙ:

```bash
cd /path/to/iroha
make bridge-xcframework
```

Был етештереүсе `dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift` тип атала `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

Код базаһы шулай уҡ `IrohaSwift/IrohaSwift.podspec`. Ул иғлан итә: `IrohaSwift` капсула, Swift 5.9 һәм iOS 15. Подспект йәлеп итә Swift төп һаҡлағыстан сығанаҡтар; туған күпер әле лә булырға тейеш һәм транзакция кодировкаһы, Ed25519 булмаған ҡултамғалау һәм Connect крипто өсөн бәйләнгән.

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
    let (data, response) = try await URLSession.shared.data(from: url)

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

`Keypair` - Ed25519 уңайлылығы API. Башҡа алгоритмдар өсөн, төҙөү `IrohaSDK` менән `defaultSigningAlgorithm` һәм ҡулланыу `generateSigningKey()` йәки `signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

Ҡоролтай `SigningAlgorithm` enum әлеге ваҡытта Ed25519, secp256k1, үҙ эсенә ала. BLS Нормаль һәм бәләкәй варианттар, ML-DSA, GOST R 34.10-2012 параметрҙар йыйылмалары, һәм SM2. Эд25519 уңайлы юлынан ситтә урындағы күпер ярҙамы талап ителә.

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

- `ToriiClient` HTTP аккаунттар, активтар, ҡушаматтар, эҙләүсе биттәр өсөн ярҙамсылар, RWA, килешеүҙәр, күп миҡдарлылыҡ, идара итеү, подпискалар, мәғлүмәттәрҙең булыуы, йәшерен активтар, узел/эш ваҡыты статусы, һаулыҡ, метрикалар һәм SSE йылғалар
- `IrohaSDK` Транзакция төҙөүселәр һәм күсереү өсөн тапшырыу/һайлау ярҙамсылары, минет, янғын, ҡалҡан, ҡалҡанһыҙ, ZK күсереү, ZK Активтарҙы теркәү, метамәғлүмәттәр, идентификатор талаптары, күп тамғалы теркәү һәм идара итеү инструкциялары
- `PendingTransactionQueue` һәм `FilePendingTransactionQueue` аша күрелгән транзакция сираттары ярҙамы
- иҫәбенә адрес һәм I105 ярҙамсылары аша `AccountAddress` һәм `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST, һәм SM2 кәрәк саҡта күпер ярҙамы менән ҡултамғалау өҫкө йөҙө
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
