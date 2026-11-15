---
translation_locale: fr
translation_source: /guide/tutorials/swift.md
translation_source_hash: 753ce1b5e0de4eae56b38e77962566b23fee56d4662a432a7bbe6ea807261422
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Swift et iOS {#swift-and-ios}

Le Swift SDK expédié par l’espace de travail en amont est le `IrohaSwift` Swift sous `IrohaSwift/`. Son manifeste technique de package définit trois produits de bibliothèque—`IrohaSwift`, `IrohaSwiftMobileTransports`, et `IrohaSwiftTransferUI`—et cible iOS 15+ et macOS 12+ avec les outils Swift 5.9.

Le package dépend de la cible binaire native `NoritoBridge`. La résolution du package valide `../dist/NoritoBridge.xcframework` avant la compilation, et les chemins cryptographiques de transaction ou Connect renvoient des erreurs bridge-unavailable lorsque les symboles natifs ne sont pas chargés.

## Swift Gestionnaire de Paquets {#swift-package-manager}

Lors du développement sur un espace de travail extrait, pointez SwiftPM vers le répertoire de package local `IrohaSwift/`. L'identité du package utilisée par `Package.swift` est `IrohaSwift` :

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

Ajustez le chemin pour votre application. `examples/ios/ConnectMinimalApp/Package.swift` montre la même dépendance avec le chemin relatif `../../../IrohaSwift`.

Avant de résoudre le paquet, compilez le pont natif actuel. Pour le développement local et les tests, exécutez ceci depuis la racine de l'espace de travail :

```bash
cd /path/to/iroha
python3.12 scripts/test_swift_local.py
```

Les compilations de publication produisent `dist/NoritoBridge.xcframework` avec `make bridge-xcframework`, qui requiert `SOURCE_DATE_EPOCH`, `NORITO_BRIDGE_OUT_DIR`, `NORITO_BRIDGE_BUILD_DIR`, `NORITO_BRIDGE_ARCHIVE_OUTPUT` et `MOBILE_SDK_CARGO_LOCKFILE`. `IrohaSwift/Package.swift` référence le pont comme `../dist/NoritoBridge.xcframework`.

## Démarrage rapide {#quickstart}

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

## Essayer Taira Lecture seule {#try-taira-read-only}

Commencez par une simple requête de contrôle HTTP pour vérifier que l'appareil ou le simulateur peut atteindre le point d'accès public Taira :

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

Utilisez la même vérification `URLSession` pour `https://taira.sora.org/v1/assets/definitions?limit=5` pendant la conception de l’UI et des nouvelles tentatives. Passez aux assistants d’envoi `IrohaSDK` seulement après le chargement sécurisé des données du signataire et le financement du compte sur Taira.

Pour créer et soumettre une transaction, utilisez les aides `IrohaSDK`. Celles-ci appellent l'encodeur de transaction natif pris en charge par le pont :

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

`TransferRequest`, `MintRequest` et `BurnRequest` valident les identifiants de compte canoniques et les identifiants de définition d'actifs canoniques en Base58 non préfixés avant de signer.

## Séquestre natif {#native-escrow}

Swift construit des instructions de séquestre de place de marché sous forme de charges utiles Norito JSON via `NativeEscrowInstructionBuilders` ou les assistants équivalents `IrohaSDK.build*Escrow*`. Voir [Compte séquestre d'actifs natifs](/fr/blockchain/escrow.md#swift-and-ios) pour des exemples et le jeton de permission du résolveur de litiges.

## Signature {#signing}

`Keypair` est la commodité Ed25519 API. Pour d'autres algorithmes, construisez un `IrohaSDK` avec `defaultSigningAlgorithm` et utilisez `generateSigningKey()` ou `signingKey(fromSeed:)` :

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

L'énumération `SigningAlgorithm` inclut actuellement Ed25519, secp256k1, les variantes normales et petites BLS, ML-DSA, les ensembles de paramètres R 34.10-2012 GOST, et SM2. Un support natif du pont est requis en dehors du chemin pratique Ed25519.

## Connecter {#connect}

Le client Connect est implémenté dans la source Swift, avec des codecs crypto et de trame pris en charge par `NoritoBridge` :

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

`ConnectSession` gère les contrôles d’ouverture et de fermeture, la lecture des enveloppes chiffrées, les clés de direction, le contrôle de flux, les flux d’événements et de soldes, ainsi que les journaux de diagnostic.

## Couverture actuelle {#current-coverage}

La source Swift inclut actuellement :

- assistants HTTP de `ToriiClient` pour les comptes, les actifs, les alias, les pages de l’explorateur, les RWA, les contrats, la multisignature, la gouvernance, les abonnements, la disponibilité des données, les actifs confidentiels, l’état du nœud et de l’environnement d’exécution, la santé, les métriques et les flux SSE
- constructeurs de transactions `IrohaSDK` et assistants de soumission/interrogation pour le transfert, l'émission, la destruction, l'enregistrement d'actifs ZK, les métadonnées, les revendications d'identifiant, l'enregistrement multisignature, le déploiement de contrats et les bulletins de vote de gouvernance
- support de la file d'attente des transactions en attente via `PendingTransactionQueue` et `FilePendingTransactionQueue`
- adresse de compte et I105 assistants via `AccountAddress` et `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST et SM2 surfaces de signature, avec un support natif pour les passerelles lorsque nécessaire
- constructeurs de charges utiles d'instructions d'entiercement natives pour le marché et l'entiercement anonyme
- Connectez WebSocket, aide-mémoire pour cadre, crypto, session, file d'attente, lecture, et diagnostics
- utilitaires du format de transmission KAGEMUSHA V1 et adaptateur de plateforme iPhone pour le fournisseur Advance du portefeuille natif, l’inscription, la récupération et les appels d’échange autorisés
- SoraFS, disponibilité des données et assistants de pièce justificative

## API Exemples {#api-examples}

Utilisez `IrohaSwift/Sources/IrohaSwift` pour l'implémentation publique et `IrohaSwift/Tests/IrohaSwiftTests` pour des exemples d'utilisation testés à partir de la même révision de source.

## Références de source {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
