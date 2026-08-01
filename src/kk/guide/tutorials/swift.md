---
translation_locale: kk
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift және iOS {#swift-and-ios}

Қауымдастық Swift SDK жоғары ағымындағы жұмыс кеңістігі арқылы жіберіледі `IrohaSwift` Swift Төмендегі топтама `IrohaSwift/`. Оның топтамалық манифесті үш кітапхана өнімдерін анықтайды`IrohaSwift`, `IrohaSwiftMobileTransports`, және `IrohaSwiftTransferUI` және iOS 15+ және macOS 12+ Swift құралдар 5.9.

Пакеті түпкілікті `NoritoBridge` бинарлық нысанаға байланысты. Пакеттің шешуі `../dist/NoritoBridge.xcframework` құрудан бұрын жарамды, ал транзакция немесе Connect крипто жолдары түпкілікті символдар жүктелмегенде көпірге қол жетімді емес қателерді жібереді.

## Swift Ұйымдастырушы {#swift-package-manager}

Тексеруден тыс жұмыс кеңістігіне қарсы дамыған кезде нүкте SwiftPM жергілікті `IrohaSwift/` Баптамалар каталогы. `Package.swift` болып табылады `IrohaSwift`:

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

Қолданбаңыз үшін жолды түзету. Ағымдағы `examples/ios/ConnectMinimalApp` жолды көшірмеңіз, өйткені ол `../../IrohaSwift` -ге `examples/IrohaSwift` шығады.

Пакетті шешуден бұрын, күпердің жұмыс кеңістігінің түбірінде бар екенін тексеріңіз:

```bash
cd /path/to/iroha
make bridge-xcframework
```

Бұл `dist/NoritoBridge.xcframework` шығарады; `IrohaSwift/Package.swift` оны `../dist/NoritoBridge.xcframework` деп атайды.

## CocoaPods {#cocoapods}

Код базасында сондай-ақ `IrohaSwift/IrohaSwift.podspec`. Ол мәлімдейді `IrohaSwift` қақпақ, Swift 5.9 және iOS 15. Podspec тартып Swift негізгі қоймадан алынған көздер; түпкүлдік көпір әлі де болуы керек және транзакцияларды кодтау, Ed25519 емес қолтаңбалау және Connect крипто үшін байланысты.

## Шұғыл бастау {#quickstart}

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

## Taira Тек оқуға тырыс {#try-taira-read-only}

Құрылғының немесе симулятордың Taira жұртшылыққа қол жеткізе алатынын растау үшін қарапайым HTTP зондпен бастаңыз:

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

Сол сияқты қолданылсын `URLSession` тексеру `https://taira.sora.org/v1/assets/definitions?limit=5` Сендер тұрғызған кезде UI және мінез-құлықты қайталап көріңіз. `IrohaSDK` қосымша қолтаңбалау материалын қауіпсіз сақтаудан жүктегеннен кейін ғана көмекшілерді жібереді және шот қаржыландырылады Taira.

Транзакцияны құру және тапсыру үшін `IrohaSDK` көмекшілерін қолданыңыз. Олар жергілікті көпірлік қолдаулы транзакция кодтаушысын атайды:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, және `UnshieldRequest` каноникалық есептерді растау IDs және каноникалық префикссіз Base58 активтің анықтамасы IDs қол қойғанға дейін.

## Жергiлiктi банктер {#native-escrow}

Swift `NativeEscrowInstructionBuilders` немесе оған тең `IrohaSDK.build*Escrow*` көмекшілері арқылы Norito JSON пайдалы жүктеме ретінде нарықтық және анонимді кепілдік беру нұсқауларын жасайды. мысалдар үшін [ Негізгі активтердің кепілдік беруін](/kk/blockchain/escrow.md#swift-and-ios) қараңыз, анонимді дәлелдеу өрістері және дауларды шешу рұқсатын белгісі.

## Қол қою {#signing}

`Keypair` - Ed25519 ыңғайлылығы API. Басқа алгоритмдер үшін `defaultSigningAlgorithm` арқылы `IrohaSDK` құраңыз және `generateSigningKey()` немесе `signingKey(fromSeed:)` қолданыңыз:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

`SigningAlgorithm` ендігі қазіргі уақытта Ed25519, secp256k1, BLS қалыпты және шағын нұсқалар, ML-DSA, GOST R 34.10-2012 параметрлер жиынтығы, және SM2. Эд25519 ыңғайлы жолынан тыс жерде жергілікті көпірлік қолдау қажет.

## Қосылу {#connect}

Connect клиенті Swift көзінде іске қосылады, крипто және кадр кодтары `NoritoBridge` қолданады:

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

`ConnectSession` ашық және жабық басқаруды, шифрланған конвертті оқиды, бағыттау кілттерін, ағынды бақылауды, оқиға ағынын, тепе-теңдік ағынын және диагностикалық журналдарды басқарады.

## Қазіргі кездегі қамту {#current-coverage}

Swift көзі қазіргі уақытта мыналарды қамтиды:

- `ToriiClient` HTTP шоттар, активтер, қолданбалы аты-жөндер, зерттеуші парақтары, RWA, келісімшарттар, мультисиг, басқару, жазылулар, деректердің қол жетімділігі, құпия активтер, түйін / жұмыс уақытының жағдайы, денсаулық, метрикалар және SSE ағымдар
- `IrohaSDK` транзакция жасаушылар және көшіру, монета, күйдіру, қалқан, қалқансыз, ZK көшіру, ZK активтерді тіркеу, метамәліметтер, сәйкестендіру талаптары, көпбелгілік тіркелу және басқару нұсқаулары үшін тапсырыс берушілер/ойын берушілер
- `PendingTransactionQueue` және `FilePendingTransactionQueue` арқылы күтілетін транзакциялық кезекті қолдау
- `AccountAddress` және `AccountId` арқылы тіркелгі мекенжайы мен I105 көмекшілері
- Ed25519, secp256k1, ML-DSA, BLS, GOST және SM2 қолтаңбалау беттері, қажет болған жағдайда жергілікті көпірлік қолдау
- нарықтағы және анонимді депозиттік жүкқұжаттарды жасаушылар үшін жергілікті депозиттік нұсқаулық
- WebSocket, кадр, крипто, сессия, кезек, қайта ойнау және диагностика көмекшілерін қосу
- Кагемуша дайындығы, түрлендірілген толықтыру және өтелу, жұмыс істеу жағдайы, жазба, теңгерімді топтама, квитанция және QR ағын үлгілері
- SoraFS, деректердің қол жетімділігі және дәлелді тіркелу көмекшілері

## API мысалдар {#api-examples}

Қоғамдық іске асыру үшін `IrohaSwift/Sources/IrohaSwift` және сол көзді қайта қараудан алынған сыналған пайдалану үлгілері үшін `IrohaSwift/Tests/IrohaSwiftTests` қолданылсын.

## Кіріспе сілтемелері {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
