---
translation_locale: ru
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Swift и iOS {#swift-and-ios}

Swift SDK, отправленный из вышестоящего рабочего пространства, является пакетом `IrohaSwift` Swift по `IrohaSwift/`. Его технический манифест пакета определяет три библиотечных продукта — `IrohaSwift`, `IrohaSwiftMobileTransports` и `IrohaSwiftTransferUI` — и ориентирован на iOS 15+ и macOS 12+ с инструментами Swift версии 5.9.

Пакет зависит от нативного бинарного таргета `NoritoBridge`. Разрешение пакета проверяет `../dist/NoritoBridge.xcframework` перед сборкой, а пути транзакции или Connect crypto вызывают ошибки bridge-unavailable, когда нативные символы не загружены.

## Swift Менеджер пакетов {#swift-package-manager}

При разработке с использованием загруженного рабочего пространства укажите SwiftPM на локальный каталог пакета `IrohaSwift/`. Идентификатор пакета, используемый `Package.swift`, следующий: `IrohaSwift`:

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

Настройте путь для вашего приложения. Не копируйте текущий путь `examples/ios/ConnectMinimalApp` как есть; этот технический манифест преобразует `../../IrohaSwift` в `examples/IrohaSwift`.

Прежде чем разрешать пакет, убедитесь, что мост существует в корне рабочей области:

```bash
cd /path/to/iroha
make bridge-xcframework
```

Это создает `dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift` ссылается на это как на `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

База кода также содержит `IrohaSwift/IrohaSwift.podspec`. Она объявляет под `IrohaSwift`, Swift 5.9 и iOS 15. Podspec получает источники Swift из основного репозитория; нативный мост всё ещё должен присутствовать и быть связанным для кодирования транзакций, подписи, не использующей Ed25519, и криптографии Connect.

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

## Попробуйте Taira Только для чтения {#try-taira-read-only}

Начните с простой HTTP пробной проверки, чтобы подтвердить, что устройство или симулятор может получить доступ к публичной Taira API конечной точке:

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

Используйте ту же проверку `URLSession` для `https://taira.sora.org/v1/assets/definitions?limit=5`, пока вы создаёте UI и поведение повторной попытки. Переключайтесь на помощники отправки `IrohaSDK` только после того, как приложение загрузит криптографические подписи из безопасного хранилища и счёт будет профинансирован на Taira.

Чтобы создать и отправить транзакцию, используйте вспомогательные функции `IrohaSDK`. Они вызывают кодировщик транзакций с поддержкой нативного моста:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest` и `UnshieldRequest` проверяют канонические идентификаторы аккаунтов и канонические идентификаторы определений активов в формате Base58 без префикса перед подписью.

## Нативный эскроу {#native-escrow}

Swift создает маркетплейс и инструкции для анонимного эскроу в виде полезной нагрузки Norito JSON через `NativeEscrowInstructionBuilders` или эквивалентные помощники `IrohaSDK.build*Escrow*`. См. [Эскроу для родных активов](/ru/blockchain/escrow.md#swift-and-ios) для примеров, полей анонимного подтверждения и токена разрешений для разрешения споров.

## Подписание {#signing}

`Keypair` — это удобная версия Ed25519 API. Для других алгоритмов создайте `IrohaSDK` с `defaultSigningAlgorithm` и используйте `generateSigningKey()` или `signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

Перечисление `SigningAlgorithm` в настоящее время включает Ed25519, secp256k1, BLS обычные и маленькие варианты, ML-DSA, GOST наборы параметров R 34.10-2012 и SM2. Нативная поддержка моста требуется за пределами удобного пути Ed25519.

## Подключить {#connect}

Клиент Connect реализован в исходном коде Swift, с криптографией и кодеками кадров, поддерживаемыми `NoritoBridge`:

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

`ConnectSession` управляет элементами управления открытия и закрытия, чтением зашифрованного контейнера данных, клавишами направления, управлением потоком, потоками событий, потоками баланса и журналами диагностики.

## Текущее покрытие {#current-coverage}

Источник Swift в настоящее время включает:

- `ToriiClient` HTTP помощники для счетов, активов, псевдонимов, страниц обозревателя, RWA, контрактов, мультиподписей, управления, подписок, доступности данных, конфиденциальных активов, состояния узла/исполнения, состояния, метрик и SSE потоков
- `IrohaSDK` генераторы транзакций и вспомогательные функции отправки/опроса для перевода, выпуска, уничтожения, шифрования, дешифрования, ZK перевода, ZK регистрации активов, метаданных, требований идентификаторов, регистрации мультиподписей и инструкций по управлению
- поддержка очереди ожидающих транзакций через `PendingTransactionQueue` и `FilePendingTransactionQueue`
- адрес аккаунта и I105 помощники через `AccountAddress` и `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST и SM2 поверхности подписания, с нативной поддержкой моста там, где это требуется
- родные сборщики полезной нагрузки инструкций условного депонирования для рынка и анонимного условного депонирования
- Подключите WebSocket, каркас, крипто, сессии, очередь, повтор, и средства диагностики
- Готовность Kagemusha, типизированные пополнение и погашение, состояние операции, нота, пакет сетевых узлов, квитанция и модели потока QR
- SoraFS, помощники для доступности данных и прикрепления доказательств

## API Примеры {#api-examples}

Используйте `IrohaSwift/Sources/IrohaSwift` для публичной реализации и `IrohaSwift/Tests/IrohaSwiftTests` для проверенных примеров использования из той же версии источника.

## Источник ссылок {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
