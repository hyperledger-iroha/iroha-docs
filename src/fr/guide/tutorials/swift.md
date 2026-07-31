---
translation_locale: fr
translation_source: /guide/tutorials/swift.md
translation_source_hash: 85cc94399b9892984615bf8a0821a1f30395eb87ec164592ca98fbd9903ef834
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift et iOS {#swift-and-ios}

Les Swift SDK l'espace de travail en amont est le `IrohaSwift` Swift
le paquet sous `IrohaSwift/`. Son manifeste de paquets définit trois bibliothèques
produits`IrohaSwift`, `IrohaSwiftMobileTransports`, et
`IrohaSwiftTransferUI`et cible iOS 15+ et macOS 12+ avec Swift outils 5.9.

L'emballage dépend de l'origine `NoritoBridge` cible binaire.
validation de la résolution `../dist/NoritoBridge.xcframework` avant la construction, et
transaction ou connecter les voies de cryptographie jeter des erreurs bridge-disponibles lorsque le
les symboles natifs ne sont pas chargés.

## Swift Gestionnaire de colis {#swift-package-manager}

Lorsqu'il s'agit de développer contre un espace de travail déconnecté, le point SwiftPM à l'hôpital
`IrohaSwift/` le répertoire des paquets.
`Package.swift` est `IrohaSwift`:

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

Ajustez le chemin pour votre application. Ne pas copier le courant
`examples/ios/ConnectMinimalApp` chemin tel qu'il est; ce manifeste résoud
`../../IrohaSwift` à `examples/IrohaSwift`.

Avant de résoudre le paquet, assurez-vous que le pont existe à la racine de l'espace de travail:

```bash
cd /path/to/iroha
make bridge-xcframework
```

Cela produit `dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift`
se réfère à elle comme `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

La base de code contient également: `IrohaSwift/IrohaSwift.podspec`. Il déclare que
`IrohaSwift` une capsule, Swift 5.9, et iOS 15. Le podspec tire Swift des sources de
le référentiel principal; le pont d'origine doit toujours être présent et relié pour
le codage des transactions, la signature non-Ed25519 et Connect crypto.

## Début rapide {#quickstart}

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

## Essayez ! Taira Lecture uniquement {#try-taira-read-only}

Commencez par une plaine HTTP la sonde pour confirmer que le dispositif ou le simulateur peut atteindre
le public Taira point final:

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

Utilisez le même `URLSession` vérifier pour
`https://taira.sora.org/v1/assets/definitions?limit=5` pendant que vous construisez
UI et réessayez le comportement. `IrohaSDK` ne soumettent des aides qu'après le
l'application charge le matériel de signature du stockage sécurisé et le compte est financé sur
Taira.

Pour créer et soumettre une transaction, utilisez le `IrohaSDK` Ils appellent les
encodeur de transaction natif à support bridge:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, et
`UnshieldRequest` valider le compte canonique IDs et canonique sans préfixe
Base58 définition d'actif IDs avant de signer.

## Réservation de fonds propres {#native-escrow}

Swift construit une place de marché et des instructions de dépôt anonyme comme Norito JSON
chargements utiles à travers `NativeEscrowInstructionBuilders` ou équivalent
`IrohaSDK.build*Escrow*` Les assistants.
[Réservation des actifs natifs](/fr/blockchain/escrow.md#swift-and-ios) à titre d'exemple,
champs de preuve anonymes, et le jeton d'autorisation pour résoudre les différends.

## Signature {#signing}

`Keypair` est la commodité Ed25519 API. Pour d'autres algorithmes, construire un
`IrohaSDK` avec `defaultSigningAlgorithm` et utilisation `generateSigningKey()` ou
`signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

Les `SigningAlgorithm` enum comprend actuellement Ed25519, secp256k1, BLS de façon normale
et de petites variantes, ML-DSA, GOST R 34.10-2012 ensembles de paramètres, et SM2. Native
Le support du pont est requis en dehors de la voie d'accès à l'Ed25519.

## Connectez {#connect}

Le client Connect est mis en œuvre dans Swift source, avec des codecs cryptographiques et cadres
soutenu par `NoritoBridge`:

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

`ConnectSession` les poignées d'ouverture et de fermeture des commandes, les enveloppes chiffrées;
les clés de direction, le contrôle du débit, les flux d'événements, les flux de l'équilibre et les diagnostics
Des journaux.

## Couverture actuelle {#current-coverage}

Les Swift la source comprend actuellement:

- `ToriiClient` HTTP les assistants pour les comptes, les actifs, les pseudonymes, les pages explorateurs,
  RWA, les contrats, la multisig, la gouvernance, les abonnements, la disponibilité des données;
  les actifs confidentiels, l'état du nœud/temps d'exécution, la santé, les mesures et SSE courants
- `IrohaSDK` constructeurs de transactions et auteurs d'enquêtes pour le transfert, la menthe,
  brûlure, bouclier, sans bouclier; ZK le transfert, ZK l'enregistrement des actifs, les métadonnées,
  les demandes d'identification, l'enregistrement multisigne et les instructions de gouvernance
- support de file d'attente des transactions par le biais `PendingTransactionQueue` et
  `FilePendingTransactionQueue`
- adresse de compte et I105 les aides à travers `AccountAddress` et `AccountId`
- Le numéro de référence est le numéro d'identification. ML-DSA, BLS, GOST, et SM2 surfaces signataires, avec des caractères natifs
  soutien de pont si nécessaire
- les constructeurs de charge utile native escrow instruction pour le marché et anonyme
  dépôt de garantie
- Connectez WebSocket, cadre, crypto, session, file d'attente, répétition et diagnostic
  les aides
- Prêt Kagemusha, remplacement et rachat typé, état d'exploitation, note,
  le paquet partagé, le reçu et QR modèles de flux
- SoraFS, les aides à la disponibilité des données et à l'attachement de preuves

## API Exemples {#api-examples}

Utilisation `IrohaSwift/Sources/IrohaSwift` pour la mise en œuvre publique et
`IrohaSwift/Tests/IrohaSwiftTests` pour les exemples d'utilisation testés de la même
révision de la source.

## Références à la source {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
