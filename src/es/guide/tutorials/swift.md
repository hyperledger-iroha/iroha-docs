---
translation_locale: es
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Swift y iOS {#swift-and-ios}

El Swift SDK enviado por el espacio de trabajo ascendente es el paquete `IrohaSwift` Swift bajo `IrohaSwift/`. Su manifiesto técnico de paquete define tres productos de biblioteca: `IrohaSwift`, `IrohaSwiftMobileTransports` y `IrohaSwiftTransferUI`, y apunta a iOS 15+ y macOS 12+ con herramientas Swift 5.9.

El paquete depende del objetivo binario nativo `NoritoBridge`. La resolución del paquete valida `../dist/NoritoBridge.xcframework` antes de compilar, y las rutas de criptografía de transacción o Connect generan errores de puente no disponible cuando los símbolos nativos no están cargados.

## Swift Gestor de Paquetes {#swift-package-manager}

Al desarrollar con un espacio de trabajo revisado, apunta SwiftPM al directorio local del paquete `IrohaSwift/`. La identidad del paquete utilizada por `Package.swift` es `IrohaSwift`:

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

Ajusta la ruta de tu aplicación. No copies la ruta actual `examples/ios/ConnectMinimalApp` tal cual; ese manifiesto técnico resuelve `../../IrohaSwift` en `examples/IrohaSwift`.

Antes de resolver el paquete, asegúrate de que el puente exista en la raíz del espacio de trabajo:

```bash
cd /path/to/iroha
make bridge-xcframework
```

Esto produce `dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift` lo refiere como `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

La base de código también contiene `IrohaSwift/IrohaSwift.podspec`. Declara el pod `IrohaSwift`, Swift 5.9 y iOS 15. El podspec extrae las fuentes de Swift del repositorio principal; el puente nativo todavía debe estar presente y vinculado para la codificación de transacciones, la firma no Ed25519 y la criptografía de Connect.

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

## Probar Taira Solo lectura {#try-taira-read-only}

Comience con una sonda simple HTTP para confirmar que el dispositivo o simulador puede alcanzar el punto final público Taira API:

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

Usa el mismo cheque `URLSession` para `https://taira.sora.org/v1/assets/definitions?limit=5` mientras construyes UI y el comportamiento de reintento. Cambia a los ayudantes de envío `IrohaSDK` solo después de que la aplicación cargue el material del firmante criptográfico desde el almacenamiento seguro y la cuenta esté financiada en Taira.

Para construir y enviar una transacción, utiliza los ayudantes `IrohaSDK`. Estos llaman al codificador de transacciones respaldado por el puente nativo:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest` y `UnshieldRequest` validan los ID de cuenta canónicos y los ID de definición de activos en Base58 sin prefijo antes de firmar.

## Fideicomiso Nativo {#native-escrow}

Swift construye instrucciones de mercado y de depósito en garantía anónimo como cargas Norito JSON a través de `NativeEscrowInstructionBuilders` o los equivalentes ayudas `IrohaSDK.build*Escrow*`. Vea [Custodia de Activos Nativos](/es/blockchain/escrow.md#swift-and-ios) para ejemplos, campos de prueba anónimos y el token de permiso del resolutor de disputas.

## Firmando {#signing}

`Keypair` es la API de conveniencia de Ed25519. Para otros algoritmos, construya un `IrohaSDK` con `defaultSigningAlgorithm` y use `generateSigningKey()` o `signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

El enum `SigningAlgorithm` actualmente incluye Ed25519, secp256k1, BLS variantes normales y pequeñas, ML-DSA, conjuntos de parámetros GOST R 34.10-2012, y SM2. Se requiere soporte nativo de puente fuera de la ruta de conveniencia Ed25519.

## Conectar {#connect}

El cliente Connect está implementado en el código fuente Swift, con criptografía y códecs de marco respaldados por `NoritoBridge`:

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

`ConnectSession` gestiona los controles de apertura y cierre, la lectura de sobres cifrados, las claves de dirección, el control de flujo, los flujos de eventos y saldos, y los registros de diagnóstico.

## Cobertura Actual {#current-coverage}

La fuente Swift actualmente incluye:

- asistentes HTTP de `ToriiClient` para cuentas, activos, alias, páginas del explorador, RWA, contratos, multifirma, gobernanza, suscripciones, disponibilidad de datos, activos confidenciales, estado del nodo y del entorno de ejecución, salud, métricas y flujos SSE
- `IrohaSDK` constructores de transacciones y asistentes de envío/consulta para transferir, emitir, quemar, proteger, desproteger, ZK transferir, ZK registro de activos, metadatos, reclamaciones de identificador, registro multisig e instrucciones de gobernanza
- soporte de cola de transacciones pendientes a través de `PendingTransactionQueue` y `FilePendingTransactionQueue`
- account-address y I105 ayudantes a través de `AccountAddress` y `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST y SM2 superficies de firma, con soporte de puente nativo donde sea necesario
- constructores de cargas de instrucciones de custodia nativa para mercado y custodia anónima
- Conectar WebSocket, marco, criptografía, sesión, cola, reproducción y auxiliares de diagnóstico
- Preparación de Kagemusha, recarga y redención tipeadas, estado de operación, nota, paquete de pares de red, registro de resultados del protocolo y modelos de flujo QR
- SoraFS, disponibilidad de datos y asistentes de adjunto de pruebas

## API Ejemplos {#api-examples}

Usa `IrohaSwift/Sources/IrohaSwift` para la implementación pública y `IrohaSwift/Tests/IrohaSwiftTests` para ejemplos de uso probados de la misma revisión de origen.

## Referencias de fuente {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
