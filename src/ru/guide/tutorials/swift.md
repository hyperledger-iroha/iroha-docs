---
translation_locale: ru
translation_source: /guide/tutorials/swift.md
translation_source_hash: 85cc94399b9892984615bf8a0821a1f30395eb87ec164592ca98fbd9903ef834
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift и iOS {#swift-and-ios}

В настоящее время Swift SDK доставленный рабочим пространством вверх по течению `IrohaSwift` Swift упаковка под `IrohaSwift/`. В его пакетном манифесте определены три продукты библиотеки`IrohaSwift`, `IrohaSwiftMobileTransports`, и `IrohaSwiftTransferUI`и ориентирован на iOS 15+ и macOS 12+ с Swift инструменты 5.9.

Пакет зависит от коренной бинарной цели `NoritoBridge`. Резолюция пакета подтверждает `../dist/NoritoBridge.xcframework` до построения, а транзакционные или криптовалютные пути Connect бросают ошибки, недоступные для моста, когда коренные символы не загружены.

## Swift Управляющий пакетом {#swift-package-manager}

При разработке против закрытого рабочего пространства, точка SwiftPM в местном `IrohaSwift/` Пакетный каталог. `Package.swift` - это `IrohaSwift`:

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

Не копируйте текущий `examples/ios/ConnectMinimalApp` путь как есть; этот манифест решает `../../IrohaSwift` на `examples/IrohaSwift`.

Прежде чем решить пакет, убедитесь, что мост существует на корне рабочего пространства:

```bash
cd /path/to/iroha
make bridge-xcframework
```

При этом производится `dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift` называет его `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

В кодовой базе также содержится `IrohaSwift/IrohaSwift.podspec`. Он объявляет подход `IrohaSwift`, Swift 5.9, и iOS 15. Podspec вытягивает источники Swift из основного хранилища; родный мост все еще должен быть присутствующим и связанным для кодирования транзакций, подписи не-Ed25519 и криптовалюты Connect.

## Быстрый старт {#quickstart}

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

## Попробуйте Taira Читайте только {#try-taira-read-only}

Начните с простых исследований HTTP для подтверждения того, что устройство или симулятор может достичь общедоступной конечной точки Taira:

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

Используйте такую же проверку `URLSession` для `https://taira.sora.org/v1/assets/definitions?limit=5` во время создания UI и попытайтесь повторить поведение. Перейти на `IrohaSDK` отправьте помощников только после того, как приложение загрузит материал подписи из безопасного хранилища и счет будет финансироваться на Taira.

Для создания и представления транзакции используйте помощника `IrohaSDK`.

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, и `UnshieldRequest` подтвердить канонический учет IDs и каноническое беспрефиксированное определение активов Base58 IDs до подписания.

## Местные банковские кредиты {#native-escrow}

Swift создает рыночную площадку и анонимные поручительные инструкции, как Norito JSON полезные грузы через `NativeEscrowInstructionBuilders` или эквивалент `IrohaSDK.build*Escrow*` Помощники. [Сберегательная задолженность за собственные активы](/ru/blockchain/escrow.md#swift-and-ios) Например, анонимные поля доказательств и токен разрешения разрешения споров.

## Подписание {#signing}

`Keypair` - это удобство Ed25519 API. Для других алгоритмов, сооружайте `IrohaSDK` с помощью `defaultSigningAlgorithm` и используйте `generateSigningKey()` или `signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

Enum `SigningAlgorithm` в настоящее время включает Ed25519, secp256k1, BLS нормальные и небольшие варианты, ML-DSA, GOST R 34.10-2012 наборы параметров, и SM2. Поддержка нативных мостов требуется за пределами пути удобства Ed25519.

## Соединение {#connect}

Клиент Connect реализуется в источнике Swift, с крипто- и рамковыми кодеками, поддерживаемыми `NoritoBridge`:

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

`ConnectSession` управляет открытыми и закрытыми элементами управления, зашифрованными чтениями конвертов, ключами направления, контролем потока, потоками событий, балансовыми потоками и журналами диагностики.

## Нынешнее охватывание {#current-coverage}

В настоящее время источник Swift включает в себя:

- `ToriiClient` HTTP помощники для учетных записей, активов, псевдонимов, страниц исследователей, RWA, контрактов, мультисиг, управления, подписок, доступности данных, конфиденциальных активов, статуса узла/регулируемого времени, здоровья, метрики и потоков SSE
- `IrohaSDK` застройщики транзакций и помощники по сдаче/выборам для передачи, монета, сжигания, щита, незащищенных, ZK передача, ZK регистрация активов, метаданные, идентификационные требования, регистрация с множеством знаков и инструкции по управлению
- Поддержка очереди транзакций в ожидании посредством `PendingTransactionQueue` и `FilePendingTransactionQueue`
- Адрес счета и помощники I105 через `AccountAddress` и `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST и SM2 подписывающие поверхности, при необходимости с местной мостовой поддержкой.
- нативные инструкции по хранению сбережений для строителей полезных грузов на рынке и анонимные поручения по хранению
- Подключить WebSocket, кадр, крипто, сеанс, очередь, воспроизведение и помощник диагностики.
- Готовность кагемуши, напечатанное дополнение и выкуп, состояние эксплуатации, записка, параллельный пакет, расписка и модели потока QR
- SoraFS, помощники по обеспечению доступности данных и прикреплению к доказательству

## API Примеры {#api-examples}

Использование `IrohaSwift/Sources/IrohaSwift` для публичной реализации и `IrohaSwift/Tests/IrohaSwiftTests` для испытанных примеров использования из одного и того же источника.

## Ссылки на источники {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
