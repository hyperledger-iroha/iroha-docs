---
translation_locale: fr
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift et iOS {#swift-and-ios}

Les États membres Swift SDK l'espace de travail en amont est le `IrohaSwift` Swift l'emballage `IrohaSwift/`. Son manifeste d'emballage définit trois produits bibliothécaires`IrohaSwift`, `IrohaSwiftMobileTransports`, et `IrohaSwiftTransferUI`et cible iOS 15+ et macOS 12+ avec Swift outils 5.9.

Le paquet dépend de l'objectif binaire natif `NoritoBridge`. La résolution du paquet valide `../dist/NoritoBridge.xcframework` avant la construction, et les chemins de transaction ou de cryptographie Connect lancent des erreurs non disponibles lorsque les symboles natifs ne sont pas chargés.

## Swift Gestionnaire du colis {#swift-package-manager}

Lorsqu'il s'agit de développer contre un espace de travail déconnecté SwiftPM dans le local `IrohaSwift/` L'identité du paquet utilisée par `Package.swift` est `IrohaSwift`:

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

Ajustez le chemin pour votre application. Ne copiez pas le chemin `examples/ios/ConnectMinimalApp` actuel tel qu'il est; ce manifeste résoudra `../../IrohaSwift` à `examples/IrohaSwift`.

Avant de résoudre le paquet, assurez-vous que le pont existe à la racine de l'espace de travail:

```bash
cd /path/to/iroha
make bridge-xcframework
```

Il en résulte `dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift` le renvoie à `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

La base de code contient également: `IrohaSwift/IrohaSwift.podspec`. Il déclare que le `IrohaSwift` une capsule, Swift 5.9 et iOS 15. Le podspec tire Swift sources du référentiel principal; le pont d'origine doit toujours être présent et liés pour le codage des transactions, la signature non-Ed25519 et Connect crypto.

## Démarrage rapide {#quickstart}

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

## Essayez Taira En lisant seulement {#try-taira-read-only}

Commencez par une sonde HTTP simple pour confirmer que l'appareil ou le simulateur peut atteindre l'extrémité publique Taira:

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

Utilisez la même vérification `URLSession` pour `https://taira.sora.org/v1/assets/definitions?limit=5` pendant que vous construisez UI et réessayez le comportement. Passez à `IrohaSDK` envoyez des aides seulement après que l'application a chargé du matériel de signature d'un stockage sécurisé et que le compte soit financé sur Taira.

Pour créer et soumettre une transaction, utilisez l'assistant `IrohaSDK`. Ils appellent le codeur de transaction natif à support bridge:

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

Le compte canonique IDs et la définition de l'actif sans préfixe canonique Base58 IDs sont validés par `TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest` et `UnshieldRequest` avant signature.

## Réservation de fonds propres {#native-escrow}

Swift crée des instructions d'escrow sur le marché et anonymes en tant que chargements utiles de Norito JSON par l'intermédiaire de `NativeEscrowInstructionBuilders` ou des aides équivalentes `IrohaSDK.build*Escrow*`. Voir [Native Asset Escrow](/fr/blockchain/escrow.md#swift-and-ios) pour les exemples, les champs de preuve anonymes et le jeton d'autorisation de résolution des différends.

## La signature {#signing}

`Keypair` est la commodité Ed25519 API. Pour d'autres algorithmes, construisez un `IrohaSDK` avec `defaultSigningAlgorithm` et utilisez `generateSigningKey()` ou `signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

L'enum `SigningAlgorithm` comprend actuellement Ed25519, secp256k1, normal BLS et de petites variantes, ML-DSA, GOST R 34.10-2012 ensembles de paramètres, et SM2. Le support du pont natif est requis en dehors de la voie de commodité Ed25519.

## Connectez {#connect}

Le client Connect est mis en œuvre dans la source Swift, avec des codecs cryptographiques et de cadres pris en charge par `NoritoBridge`:

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

`ConnectSession` gère les commandes d'ouverture et de fermeture, les lectures chiffrées des enveloppes, les touches de direction, le contrôle du débit, les flux d'événements, les flux de balance et les journaux de diagnostic.

## Couverture actuelle {#current-coverage}

La source Swift comprend actuellement les éléments suivants:

- `ToriiClient` HTTP auxiliaires pour les comptes, les actifs, les pseudonymes, les pages explorateurs, RWA, les contrats, le multisig, la gouvernance, les abonnements, la disponibilité des données, les actif confidentiels, l'état du nœud/temps d'exécution, la santé, les mesures et les flux SSE
- `IrohaSDK` constructeurs d'opérations et auxiliaires de soumission/poll pour le transfert, la menthe, la combustion, le bouclier, l'absence de bouclier; ZK le transfert, ZK l'enregistrement des actifs, les métadonnées, les réclamations d'identification, l'en enregistrement multisigne et les instructions de gouvernance;
- soutien à la file d'attente des transactions par l'intermédiaire de `PendingTransactionQueue` et `FilePendingTransactionQueue`;
- adresse de compte et I105 auxiliaires par l'intermédiaire de `AccountAddress` et de `AccountId`
- Surfaces de signage Ed25519, secp256k1, ML-DSA, BLS, GOST et SM2, avec support de pont natif lorsque cela est nécessaire
- les constructeurs de charges utiles d'instructions en fiducie natives pour le marché et les fiducieux anonymes
- Connectez WebSocket, le cadre, la cryptographie, la session, la file d'attente, la répétition et les aides de diagnostic
- Préparation Kagemusha, remplissage et rachat typés, état d'exploitation, note, paquet de pairs, reçu et modèles de flux QR
- SoraFS, aides à la disponibilité des données et aux pièces jointes de preuve

## API Exemples {#api-examples}

Utiliser `IrohaSwift/Sources/IrohaSwift` pour la mise en œuvre publique et `IrohaSwift/Tests/IrohaSwiftTests` pour les exemples d'utilisation testés provenant de la même révision de source.

## Références à la source {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
