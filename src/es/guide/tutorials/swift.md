---
translation_locale: es
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift y iOS {#swift-and-ios}

El Swift SDK enviado por el espacio de trabajo ascendente es el paquete `IrohaSwift` Swift bajo `IrohaSwift/`. Su manifiesto del paquete define tres productos de la biblioteca `IrohaSwift`, `IrohaSwiftMobileTransports` y `IrohaSwiftTransferUI`y se dirige a iOS 15+ y macOS 12+ con herramientas Swift 5.9.

El paquete depende del objetivo binario nativo `NoritoBridge`. La resolución del paquete valida `../dist/NoritoBridge.xcframework` antes de la construcción, y las trayectorias de transacción o cripto Connect lanzan errores no disponibles cuando los símbolos nativos no se cargan.

## Swift Administrador de paquetes {#swift-package-manager}

Cuando se desarrolle con respecto a un espacio de trabajo cerrado, apunte SwiftPM en el directorio local de paquetes `IrohaSwift/`. La identidad del paquete utilizada por `Package.swift` es `IrohaSwift`:

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

Ajuste la ruta para su aplicación. No copie el camino actual `examples/ios/ConnectMinimalApp` tal y como está; ese manifiesto resuelve `../../IrohaSwift` a `examples/IrohaSwift`.

Antes de resolver el paquete, asegúrese de que existe el puente en la raíz del espacio de trabajo:

```bash
cd /path/to/iroha
make bridge-xcframework
```

Esto produce `dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift` se refiere a él como `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

La base de código también contiene `IrohaSwift/IrohaSwift.podspec`. Declare el pod `IrohaSwift`, Swift 5.9, e iOS 15. El podspec extrae fuentes Swift del repositorio principal; el puente nativo aún tiene que estar presente y vinculado para la codificación de transacciones, firma no Ed25519 y cripto Connect.

## Inicio rápido {#quickstart}

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

## Prueba Taira Sólo para lectura {#try-taira-read-only}

Comience con una sonda simple HTTP para confirmar que el dispositivo o simulador puede alcanzar el punto final público Taira:

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

Utilizar el mismo `URLSession` verificación de `https://taira.sora.org/v1/assets/definitions?limit=5` mientras usted está construyendo UI y volver a intentar el comportamiento. `IrohaSDK` enviar ayudantes sólo después de que la aplicación cargue el material de firma del almacenamiento seguro y la cuenta se financia en el Taira.

Para construir y enviar una transacción, utilice los ayudantes `IrohaSDK`. Estos llaman al codificador de transacciones nativo respaldado por puentes:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, y `UnshieldRequest` validación de la cuenta canónica IDs y definición de activos base58 canónica sin prefijo IDs antes de firmar.

## Escrow nativo {#native-escrow}

Swift construye las instrucciones de mercado y garantía anónima como cargas útiles Norito JSON a través de `NativeEscrowInstructionBuilders` o los ayudantes equivalentes `IrohaSDK.build*Escrow*`. Véase [ Native Asset Escrow](/es/blockchain/escrow.md#swift-and-ios) para ejemplos, campos de prueba anónimos y el token de permiso de resolución de disputas.

## Firmar {#signing}

`Keypair` es la conveniencia Ed25519 API. Para otros algoritmos, construye un `IrohaSDK` con `defaultSigningAlgorithm` y utilice `generateSigningKey()` o `signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

El Consejo `SigningAlgorithm` Enum actualmente incluye Ed25519, secp256k1, BLS variantes normales y pequeñas, ML-DSA, GOST R 34.10-2012 conjuntos de parámetros, y SM2. Se requiere el apoyo del puente nativo fuera de la vía de conveniencia Ed25519.

## Conectar {#connect}

El cliente Connect se implementa en la fuente Swift, con códigos criptográficos y de marcos respaldados por `NoritoBridge`:

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

`ConnectSession` maneja los controles de apertura y cierre, las lecturas encriptadas del sobre, las teclas de dirección, el control de flujo, los flujos de eventos, flujos de equilibrio y revistas de diagnóstico.

## Cobertura actual {#current-coverage}

La fuente Swift incluye actualmente:

- `ToriiClient` HTTP auxiliares para cuentas, activos, alias, páginas exploradoras, RWA, contratos, multisig, gobernanza, suscripciones, disponibilidad de datos, activos confidenciales, estado de nodo/tiempo de funcionamiento, salud, métricas y flujos SSE
- `IrohaSDK` constructores de transacciones y asistentes de envío/polling para transferencias, acuñales, quemaduras, escudos, sin escudos; ZK la transferencia, ZK registro de activos, metadatos, reclamaciones de identificación, registro multisig e instrucciones de gobernanza.
- Apoyo pendiente en la cola de transacciones a través de `PendingTransactionQueue` y `FilePendingTransactionQueue`
- Dirección de cuenta y auxiliares I105 a través del `AccountAddress` y el `AccountId`
- Superficies de señalización Ed25519, secp256k1, ML-DSA, BLS, GOST y SM2, con soporte de puente nativo cuando sea necesario
- Instrucciones de custodia nativa para constructores de carga útil para el mercado y custodia anónima
- Conectar WebSocket, marco, cripto, sesión, cola, reproducción y asistentes de diagnóstico.
- Preparación de Kagemusha, composición y canje tipografados, estado de operación, nota, paquete de pares, recibo y modelos de corriente QR
- SoraFS, auxiliares para la disponibilidad de datos y el apego de pruebas.

## API Ejemplos {#api-examples}

Usar `IrohaSwift/Sources/IrohaSwift` para la implementación pública y `IrohaSwift/Tests/IrohaSwiftTests` para ejemplos de uso probados de la misma revisión de fuente.

## Referencias de fuentes {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
