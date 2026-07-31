---
translation_locale: ru
translation_source: /guide/tutorials/swift.md
translation_source_hash: 85cc94399b9892984615bf8a0821a1f30395eb87ec164592ca98fbd9903ef834
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift и iOS {#swift-and-ios}

Сборник Swift SDK отправляется вверх по течению рабочее пространство `IrohaSwift` Swift
упаковка под `IrohaSwift/`. В его пакетном манифесте определены три библиотеки
продукты`IrohaSwift`, `IrohaSwiftMobileTransports`, и
`IrohaSwiftTransferUI`и ориентированы на iOS 15+ и macOS 12+ с Swift инструменты 5.9.

Пакет зависит от родного `NoritoBridge` Бинарная цель.
подтверждает резолюцию `../dist/NoritoBridge.xcframework` до строительства, и
транзакции или подключить криптовалютные пути бросают мост недоступных ошибок, когда
не загружены символы местных народов.

## Swift Управляющий пакетом {#swift-package-manager}

При разработке против закрытого рабочего пространства точка SwiftPM в местном
`IrohaSwift/` Пакетный каталог.
`Package.swift` является `IrohaSwift`:

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

Устрой путь для вашего приложения. Не копируйте текущий
`examples/ios/ConnectMinimalApp` путь, как есть; что манифест решает
`../../IrohaSwift` к `examples/IrohaSwift`.

Перед решением пакета убедитесь, что мост существует на корне рабочего пространства:

```bash
cd /path/to/iroha
make bridge-xcframework
```

Это производит `dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift`
упоминает его как `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

База кодов также содержит `IrohaSwift/IrohaSwift.podspec`. Он заявляет:
`IrohaSwift` капсулы, Swift 5.9 и iOS 15. Подспект вытягивает Swift источники из
главный хранилище; коренный мост должен быть все еще присутствующим и связанным для
транзакционное кодирование, не-Ed25519 подпись и криптовалюты Connect.

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

## Попробуйте . Taira Читать только {#try-taira-read-only}

Начнем с простых HTTP Сонд для подтверждения того, что устройство или симулятор может достичь
общественность Taira конечная точка:

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

Используйте то же самое . `URLSession` проверка на
`https://taira.sora.org/v1/assets/definitions?limit=5` пока ты строишь
UI и попробуйте повторить поведение. `IrohaSDK` предоставлять помощников только после
приложение загружает подписанный материал из безопасного хранилища и счет финансируется на
Taira.

Для создания и представления транзакции используйте `IrohaSDK` Они называют
нативный кодировщик транзакций, поддерживаемый мостом:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, и
`UnshieldRequest` подтвердить канонический учет IDs и канонический непредставленный
Определение активов Base58 IDs до подписания.

## Начальная сберегательная плата {#native-escrow}

Swift создает рыночные и анонимные инструкции по хранению в качестве Norito JSON
полезные нагрузки `NativeEscrowInstructionBuilders` или эквивалент
`IrohaSDK.build*Escrow*` Помощники.
[Осуществление сбережений на собственные активы](/ru/blockchain/escrow.md#swift-and-ios) для примеров,
анонимные поля доказательства, и разрешение разрешения споров.

## Подписание {#signing}

`Keypair` - это удобство Ed25519 API. Для других алгоритмов, построить
`IrohaSDK` с `defaultSigningAlgorithm` и использование `generateSigningKey()` или
`signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

Сборник `SigningAlgorithm` enum в настоящее время включает Ed25519, secp256k1, BLS нормальное
и небольшие варианты, ML-DSA, GOST R 34.10-2012 наборы параметров, и SM2. Родной
Поддержка моста требуется за пределами проездной дороги Ed25519

## Подключение {#connect}

Клиент Connect реализован в Swift источник, с крипто- и рамковыми кодеками
Поддерживается `NoritoBridge`:

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

`ConnectSession` ручки открытых и закрытых элементов управления, зашифрованные конверты
ключи направления, контроль потока, потоки событий, балансовые потоки и диагностика
Журналы.

## Нынешнее охватывание {#current-coverage}

Сборник Swift источник в настоящее время включает:

- `ToriiClient` HTTP помощники по счетам, активам, псевдонимам, страницам исследователей,
  RWA, контракты, многозначные услуги, управление, подписки, доступность данных;
  конфиденциальные активы, состояние узла/время работы, состояние здоровья, показатели и SSE потоки
- `IrohaSDK` строители транзакций и помощники по предоставлению/выборам для перевода, минда,
  сжигание, щит, без щита, ZK передача, ZK регистрация активов, метаданные,
  претензии на идентификатор, регистрация с многознаками и инструкции по управлению
- поддержка очереди транзакций через `PendingTransactionQueue` и
  `FilePendingTransactionQueue`
- адрес счета и I105 помощники через `AccountAddress` и `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST, и SM2 подписывающие поверхности, с коренным
  мостовая поддержка, если это необходимо
- нативные инструкции по счету для строителей полезных грузов для рынка и анонимные
  депозитные средства
- Подключение WebSocket, Рама, крипто, сеанс, очередь, повторная игра и диагностика
  помощники
- Готовность Kagemusha, загрузка и выкуп, состояние работы, записка,
  параллельный пакет, квитанция и QR модели потока
- SoraFS, помощники по обеспечению доступности данных и прикреплению к доказательству

## API Примеры {#api-examples}

Использование `IrohaSwift/Sources/IrohaSwift` для общественного осуществления и
`IrohaSwift/Tests/IrohaSwiftTests` для проверенных примеров использования из той же
пересмотр источника.

## Ссылки на источники {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
