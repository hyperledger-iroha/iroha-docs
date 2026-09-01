---
translation_locale: fr
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: bing-translator-llm
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

Ajustez le chemin pour votre application. Ne copiez pas le chemin actuel `examples/ios/ConnectMinimalApp` tel quel ; ce manifeste technique résout `../../IrohaSwift` en `examples/IrohaSwift`.

Avant de résoudre le paquet, assurez-vous que le pont existe à la racine de l'espace de travail :

```bash
cd /path/to/iroha
make bridge-xcframework
```

Cela produit `dist/NoritoBridge.xcframework` ; `IrohaSwift/Package.swift` le référence comme `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

La base de code contient également `IrohaSwift/IrohaSwift.podspec`. Elle déclare le pod `IrohaSwift`, Swift 5.9, et iOS 15. Le podspec récupère les sources Swift depuis le dépôt principal ; le pont natif doit encore être présent et lié pour l'encodage des transactions, la signature non Ed25519 et la crypto Connect.

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

## Essayer Taira Lecture seule {#try-taira-read-only}

Commencez avec une sonde HTTP simple pour confirmer que le dispositif ou le simulateur peut atteindre le point de terminaison public Taira API :

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest` et `UnshieldRequest` valident les identifiants de compte canoniques et les identifiants d'actifs en Base58 non préfixés avant de signer.

## Séquestre natif {#native-escrow}

Swift construit des instructions de marché et de séquestre anonymes sous forme de charges utiles Norito JSON via `NativeEscrowInstructionBuilders` ou les helpers équivalents `IrohaSDK.build*Escrow*`. Voir [Compte séquestre d'actifs natifs](/fr/blockchain/escrow.md#swift-and-ios) pour des exemples, les champs de preuve anonymes et le jeton de permission du résolveur de litiges.

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

let session = ConnectSession(sessionID: sessionID, client: client)
let keyPair = try ConnectCrypto.generateKeyPair()
```

`ConnectSession` gère les contrôles d’ouverture et de fermeture, la lecture des enveloppes chiffrées, les clés de direction, le contrôle de flux, les flux d’événements et de soldes, ainsi que les journaux de diagnostic.

## Couverture actuelle {#current-coverage}

La source Swift inclut actuellement :

- assistants HTTP de `ToriiClient` pour les comptes, les actifs, les alias, les pages de l’explorateur, les RWA, les contrats, la multisignature, la gouvernance, les abonnements, la disponibilité des données, les actifs confidentiels, l’état du nœud et de l’environnement d’exécution, la santé, les métriques et les flux SSE
- `IrohaSDK` constructeurs de transactions et helpers de soumission/interrogation pour le transfert, l'émission, la destruction, le masquage, le dévoilement, ZK transfert, ZK enregistrement d'actifs, métadonnées, revendications d'identifiant, enregistrement multisignature et instructions de gouvernance
- support de la file d'attente des transactions en attente via `PendingTransactionQueue` et `FilePendingTransactionQueue`
- adresse de compte et I105 assistants via `AccountAddress` et `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST et SM2 surfaces de signature, avec un support natif pour les passerelles lorsque nécessaire
- constructeurs de charges utiles d'instructions d'entiercement natives pour le marché et l'entiercement anonyme
- Connectez WebSocket, aide-mémoire pour cadre, crypto, session, file d'attente, lecture, et diagnostics
- Préparation Kagemusha, rechargement et remboursement tapés, état de l'opération, note, paquet de pairs réseau, enregistrement du résultat du protocole, et modèles de flux QR
- SoraFS, disponibilité des données et assistants de pièce justificative

## API Exemples {#api-examples}

Utilisez `IrohaSwift/Sources/IrohaSwift` pour l'implémentation publique et `IrohaSwift/Tests/IrohaSwiftTests` pour des exemples d'utilisation testés à partir de la même révision de source.

## Références de source {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
