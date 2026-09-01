---
translation_locale: kk
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Swift және iOS {#swift-and-ios}

Жоғары деңгейлі жұмыс кеңістігі арқылы жіберілген Swift SDK — бұл `IrohaSwift/` астындағы `IrohaSwift` Swift пакеті. Оның пакет техникалық манифесті үш кітапхана өнімін анықтайды — `IrohaSwift`, `IrohaSwiftMobileTransports` және `IrohaSwiftTransferUI` — және iOS 15+ және macOS 12+ нұсқаларына Swift құралдар 5.9 көмегімен бағытталған.

Пакет жергілікті `NoritoBridge` бинарлық нысанға байланысты. Пакетті шешу `../dist/NoritoBridge.xcframework` құрамын құрастырудан бұрын тексереді, ал транзакция немесе Connect крипто жолдары жергілікті белгілер жүктелмегенде bridge-unavailable қателіктерін шығарады.

## Swift Бағдарламаны Басқару Құралы {#swift-package-manager}

Тексерілген жұмыс кеңістігіне қарсы әзірлеу кезінде SwiftPM нысанын жергілікті `IrohaSwift/` пакет каталогына нұсқаңыз. `Package.swift` пайдаланған пакет идентификаторы: `IrohaSwift`:

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

Қосымшаңыз үшін жолды реттеңіз. Ағымдағы `examples/ios/ConnectMinimalApp` жолын сол күйінде көшірмеңіз; сол техникалық манифест `../../IrohaSwift`-ді `examples/IrohaSwift`-ге шешеді.

Пакетті шешер алдында көпірдің жұмыс алаңының түбірінде бар екеніне көз жеткізіңіз:

```bash
cd /path/to/iroha
make bridge-xcframework
```

Бұл `dist/NoritoBridge.xcframework` тудырады; `IrohaSwift/Package.swift` оны `../dist/NoritoBridge.xcframework` ретінде көрсетеді.

## CocoaPods {#cocoapods}

Код базасында сондай-ақ `IrohaSwift/IrohaSwift.podspec` бар. Ол `IrohaSwift` подын, Swift 5.9 және iOS 15 жариялайды. Podspec негізгі репозиторийден Swift көздерін тартады; транзакцияны кодтау, Ed25519 емес қолтаңба және Connect криптосы үшін жергілікті көпір әлі де болуы және қосылуы керек.

## Жылдам бастау {#quickstart}

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

## Сынап көріңіз Taira Тек оқу үшін {#try-taira-read-only}

Құрылғы немесе симулятор қоғамдық Taira API соңғы нүктеге жете алатынын растау үшін қарапайым HTTP зондпен бастаңыз:

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

Сіз UI және қайта әрекет ету әрекетін жасап жатқанда `https://taira.sora.org/v1/assets/definitions?limit=5` үшін сол `URLSession` тексеруді пайдаланыңыз. Қолданба сендірілген сақтау орнынан криптографиялық қолтаңба материалын жүктегеннен және есептік жазба Taira-те қаржыландырылғаннан кейін ғана `IrohaSDK` жіберу көмекшілеріне ауысу жасаңыз.

Транзакция құру және жіберу үшін `IrohaSDK` көмегін пайдаланыңыз. Бұл жергілікті көпірмен қолдаулы транзакция кодтағышын шақырады:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest` және `UnshieldRequest` қол қоймас бұрын бір протоколдық стандарттағы есеп-шот идентификаторларын және бір протоколдық стандарттағы префикссіз Base58 актив анықтамасы идентификаторларын тексереді.

## Табиғи сенімгерлік есеп {#native-escrow}

Swift нарық алаңын және анонимді депозит нұсқауларын `NativeEscrowInstructionBuilders` немесе сәйкес `IrohaSDK.build*Escrow*` көмекшілері арқылы Norito JSON жүктемелері ретінде жасайды. Мысалдар, анонимді дәлел өрістері және дауды шешуші рұқсат токені үшін [Туынды активтерді сенімхатта сақтау](/kk/blockchain/escrow.md#swift-and-ios)-ге қараңыз.

## Қол қою {#signing}

`Keypair` - бұл Ed25519 ыңғайлылығы API. Басқа алгоритмдер үшін `defaultSigningAlgorithm` көмегімен `IrohaSDK` құрыңыз және `generateSigningKey()` немесе `signingKey(fromSeed:)` қолданыңыз:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

`SigningAlgorithm` enum қазіргі уақытта Ed25519, secp256k1, BLS кәдімгі және кіші нұсқаларды, ML-DSA, GOST R 34.10-2012 параметрлер жинақтарын және SM2 қамтиды. Ed25519 ыңғайлылық жолынан тыс жерде жергілікті көпірді қолдау қажет.

## Қосу {#connect}

Connect клиенті Swift кодында жүзеге асырылған, крипто және frame кодектерін `NoritoBridge` қамтамасыз етеді:

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

`ConnectSession` ашу және жабу басқару элементтерін, шифрланған деректер контейнерін оқу, бағыттау кілттерін, ағынды басқаруды, оқиға ағындарын, баланс ағындарын және диагностикалық журналдарды басқарады.

## Ағымдағы қамту {#current-coverage}

Swift көзі қазіргі уақытта мыналарды қамтиды:

- `ToriiClient` HTTP есеп-шоттар, активтер, лақап аттар, шолушы беттері, RWA, келісімшарттар, көп қолды, басқару, жазылымдар, деректер қолжетімділігі, құпия активтер, түйін/жүру уақыты күйі, денсаулық, көрсеткіштер, және SSE ағындары үшін көмекшілер
- `IrohaSDK` транзакцияны құрастырушылар және аудару, шығару, жою, қорғау, қорғауды алу, ZK аудару, ZK активті тіркеу, метадеректер, идентификатор талаптары, көпқосымша тіркеу және басқару нұсқауларын жіберу/сұрау көмегін көрсететін құралдар
- `PendingTransactionQueue` және `FilePendingTransactionQueue` арқылы күтуші транзакциялар кезегін қолдау
- тіркелгі-мекенжай және I105 көмекшілері арқылы `AccountAddress` және `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST, және SM2 қолтаңба беттері, қажет болған жағдайда жергілікті көпірді қолдаумен
- нарық және анонимді эскроу үшін жергілікті эскроу нұсқаулығының жүктемесін құрастыру құралдары
- WebSocket, frame, crypto, session, queue, replay және диагностика көмекшілерін қосу
- Kagemusha дайындық, терілген қайта толтыру және өтеу, операция статусі, ескерту, желілік әріптес пакеті, протокол нәтижесі жазбасы және QR ағын үлгілері
- SoraFS, мәліметтердің қолжетімділігі және дәлел-қосымша көмекшілері

## API Мысалдар {#api-examples}

Жалпы қолдану үшін `IrohaSwift/Sources/IrohaSwift` пайдаланыңыз және сол дереккөз нұсқасынан сынақтан өткізілген қолдану мысалдары үшін `IrohaSwift/Tests/IrohaSwiftTests` пайдаланыңыз.

## Дерек көздері {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
