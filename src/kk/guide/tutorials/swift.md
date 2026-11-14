---
translation_locale: kk
translation_source: /guide/tutorials/swift.md
translation_source_hash: 753ce1b5e0de4eae56b38e77962566b23fee56d4662a432a7bbe6ea807261422
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
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

Қосымшаңыз үшін жолды реттеңіз. `examples/ios/ConnectMinimalApp/Package.swift` дәл сол тәуелділікті `../../../IrohaSwift` салыстырмалы жолымен көрсетеді.

Пакетті шешер алдында ағымдағы нативті көпірді құрастырыңыз. Жергілікті әзірлеу және тесттер үшін мұны жұмыс алаңының түбірінен іске қосыңыз:

```bash
cd /path/to/iroha
python3.12 scripts/test_swift_local.py
```

Шығарылым құрастырулары `make bridge-xcframework` арқылы `dist/NoritoBridge.xcframework` жасайды; бұл команда `SOURCE_DATE_EPOCH`, `NORITO_BRIDGE_OUT_DIR`, `NORITO_BRIDGE_BUILD_DIR`, `NORITO_BRIDGE_ARCHIVE_OUTPUT` және `MOBILE_SDK_CARGO_LOCKFILE` айнымалыларын талап етеді. `IrohaSwift/Package.swift` көпірді `../dist/NoritoBridge.xcframework` ретінде көрсетеді.

## Жылдам бастау {#quickstart}

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

## Сынап көріңіз Taira Тек оқу үшін {#try-taira-read-only}

Құрылғы не симулятор ашық Taira соңғы нүктесіне жете алатынын растау үшін қарапайым HTTP тексеруінен бастаңыз:

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

`TransferRequest`, `MintRequest` және `BurnRequest` қол қою алдында канондық есептік жазба идентификаторларын және канондық, префикссіз Base58 актив анықтамасы идентификаторларын тексереді.

## Табиғи сенімгерлік есеп {#native-escrow}

Swift нарықтық эскроу нұсқауларын `NativeEscrowInstructionBuilders` немесе сәйкес `IrohaSDK.build*Escrow*` көмекшілері арқылы Norito JSON жүктемелері ретінде жасайды. Мысалдар және дауды шешуші рұқсат токені үшін [Туынды активтерді сенімхатта сақтау](/kk/blockchain/escrow.md#swift-and-ios)-ге қараңыз.

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

let keyPair = try ConnectCrypto.generateKeyPair()
let session = try ConnectSession(
    networkID: try NetworkId(literal: "<exact-network-id>"),
    appPublicKey: keyPair.publicKey,
    nonce: nonce,
    relayToken: "<token>",
    client: client
)
```

`ConnectSession` ашу және жабу басқару элементтерін, шифрланған деректер контейнерін оқу, бағыттау кілттерін, ағынды басқаруды, оқиға ағындарын, баланс ағындарын және диагностикалық журналдарды басқарады.

## Ағымдағы қамту {#current-coverage}

Swift көзі қазіргі уақытта мыналарды қамтиды:

- `ToriiClient` HTTP есеп-шоттар, активтер, лақап аттар, шолушы беттері, RWA, келісімшарттар, көп қолды, басқару, жазылымдар, деректер қолжетімділігі, құпия активтер, түйін/жүру уақыты күйі, денсаулық, көрсеткіштер, және SSE ағындары үшін көмекшілер
- `IrohaSDK` аудару, шығару, жою, ZK активін тіркеу, метадеректер, идентификатор талаптары, көпқолтаңбалы тіркеу, келісімшарт орналастыру және басқару бюллетеньдері үшін транзакция құрастырушылары мен жіберу/сұрау көмекшілері
- `PendingTransactionQueue` және `FilePendingTransactionQueue` арқылы күтуші транзакциялар кезегін қолдау
- тіркелгі-мекенжай және I105 көмекшілері арқылы `AccountAddress` және `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST, және SM2 қолтаңба беттері, қажет болған жағдайда жергілікті көпірді қолдаумен
- нарық және анонимді эскроу үшін жергілікті эскроу нұсқаулығының жүктемесін құрастыру құралдары
- WebSocket, frame, crypto, session, queue, replay және диагностика көмекшілерін қосу
- KAGEMUSHA V1 сым пішімінің көмекші құралдары және нативті әмиянның Advance провайдері, тіркелу, қалпына келтіру мен қабылданған алмасу шақыруларына арналған iPhone платформа адаптері
- SoraFS, мәліметтердің қолжетімділігі және дәлел-қосымша көмекшілері

## API Мысалдар {#api-examples}

Жалпы қолдану үшін `IrohaSwift/Sources/IrohaSwift` пайдаланыңыз және сол дереккөз нұсқасынан сынақтан өткізілген қолдану мысалдары үшін `IrohaSwift/Tests/IrohaSwiftTests` пайдаланыңыз.

## Дерек көздері {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
