---
translation_locale: az
translation_source: /guide/tutorials/swift.md
translation_source_hash: 85cc94399b9892984615bf8a0821a1f30395eb87ec164592ca98fbd9903ef834
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift və iOS {#swift-and-ios}

İndiki Swift SDK yuxarı axın iş məkanı tərəfindən göndərilən `IrohaSwift` Swift aşağıdakı paket `IrohaSwift/`. Onun paket manifestində üç kitabxana məhsulları müəyyən edilir`IrohaSwift`, `IrohaSwiftMobileTransports`, və `IrohaSwiftTransferUI`və iOS 15+ və macOS 12+ ilə hədəflənib Swift vasitələr 5.9.

Paket yerli `NoritoBridge` ikili hədəfdən asılıdır. Paketin qətnaməsi qurmadan əvvəl `../dist/NoritoBridge.xcframework` təsdiqlənir və yerli simvollar yüklənmədikdə əməliyyat və ya Connect kripto yolları körpü-mümkün olmayan səhvləri atır.

## Swift Paket meneceri {#swift-package-manager}

Qeydiyyatdan keçmiş bir iş məkanına qarşı inkişaf edərkən, yerli `IrohaSwift/` paket dizaynında SwiftPM göstərin. `Package.swift` tərəfindən istifadə olunan paket kimliyi `IrohaSwift`dir:

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

Tətbiqiniz üçün yol düzəldin. Hal-hazırda olan `examples/ios/ConnectMinimalApp` yolu kopyalamayın; bu manifest `../../IrohaSwift` ilə `examples/IrohaSwift` həll olunur.

Paketi həll etmədən əvvəl körpünün iş məkanının kökündə olduğundan əmin olun:

```bash
cd /path/to/iroha
make bridge-xcframework
```

Bu, `dist/NoritoBridge.xcframework` istehsal edir; `IrohaSwift/Package.swift` onu `../dist/NoritoBridge.xcframework` olaraq adlandırır.

## CocoaPods {#cocoapods}

Kod bazasında həmçinin `IrohaSwift/IrohaSwift.podspec`. O, bəyan edir `IrohaSwift` kapsul, Swift 5.9 və iOS 15. Podspec çəkir Swift Əsas anbardan mənbələr; yerli körpü hələ də mövcud olmalıdır və əməliyyat kodlaşdırılması üçün əlaqələndirilməlidir. Ed25519 olmayan imzalanma və Connect kripto.

## Tez başlanğıc {#quickstart}

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

## Taira Yalnız oxumaq üçün cəhd edin {#try-taira-read-only}

Cihazın və ya simulatorun ictimai Taira son nöqtəsinə çatdıra biləcəyini təsdiq etmək üçün sadə bir HTTP sondası ilə başlayın:

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

Eyni istifadə edin. `URLSession` yoxlama `https://taira.sora.org/v1/assets/definitions?limit=5` Sən bina qurursan UI və davranışını yenidən sınayın. `IrohaSDK` yalnız tətbiq etibarlı saxlama vasitəsilə imzalanma materialını yüklədikdən sonra və hesabın maliyyələşdirilməsindən sonra köməkçi göndərin Taira.

Bir əməliyyat qurmaq və təqdim etmək üçün `IrohaSDK` köməkçilərindən istifadə edin.

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, və `UnshieldRequest` Kanonik hesabı təsdiqləmək IDs və kanonik prefikssiz Base58 aktiv tərifi IDs imzalanmadan əvvəl.

## Native Escrow {#native-escrow}

Swift marketplace və anonim escrow təlimatlarını Norito JSON pay yükləri olaraq `NativeEscrowInstructionBuilders` və ya ekvivalent `IrohaSDK.build*Escrow*` köməkçiləri vasitəsilə qurur. Misallar üçün [Native Asset Escrow](/az/blockchain/escrow.md#swift-and-ios), anonim sübut sahələri və mübahisə həlli icazəsi tokeninə baxın.

## İmzalama {#signing}

`Keypair` Ed25519 rahatlığıdır API. Digər alqoritmlər üçün `defaultSigningAlgorithm` ilə `IrohaSDK` qurun və `generateSigningKey()` və ya `signingKey(fromSeed:)` istifadə edin:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

`SigningAlgorithm` enumunda hazırda Ed25519, secp256k1, BLS normal və kiçik variantlar, ML-DSA, GOST R 34.10-2012 parametrlər dəstləri və SM2 daxildir.

## Bağlantı {#connect}

Connect müştəri Swift mənbədə, `NoritoBridge` tərəfindən dəstəklənən kripto və çərçivə kodekləri ilə həyata keçirilir:

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

`ConnectSession` açılış və bağlanma nəzarətləri, şifrələnmiş zarf oxumaları, istiqamət düymələri, axın nəzarəti, hadisələr axını, balans axını və diaqnostik jurnalları idarə edir.

## Hal-hazırda mövcud olan əhatə {#current-coverage}

Swift mənbəsi hazırda aşağıdakılardır:

- `ToriiClient` HTTP hesablar, aktivlər, aliases, explorer səhifələri, RWA, müqavilələr, multisig, idarəetmə, abunəçilik, məlumatların mövcudluğu, məxfi aktivlər, node/runtime status, sağlamlıq, ölçülər və SSE axınları üçün köməkçiləri
- `IrohaSDK` əməliyyat qurucusu və transfer, mint, burn, shield, unshield, ZK transfer, ZK aktiv qeydiyyatı, metadata, identifikator iddiaları, multisig qeydiyyata alınması və idarəetmə təlimatları üçün təqdim edən/səlah verən köməkçilər
- `PendingTransactionQueue` və `FilePendingTransactionQueue` vasitəsilə əməliyyat növbəsi dəstəyi gözlənilir.
- `AccountAddress` və `AccountId` vasitəsilə hesab ünvanı və I105 köməkçiləri;
- Ed25519, secp256k1, ML-DSA, BLS, GOST və SM2 imzalanma səthləri, lazım olduqda yerli körpü dəstəyi ilə.
- Marketplace və anonim escrow üçün yerli escrow təlimat payload qurucuları
- WebSocket, çərçivə, kripto, seans, sıra, yenidən oynatma və diaqnoz köməkçilərini bağlayın.
- Kagemusha hazırlığı, yazılmış əlavə və geri qaytarma, əməliyyat statusu, qeyd, həmyaşıd paketləri, qəbulu və QR axın modelləri.
- SoraFS, məlumatların mövcudluğu və sübut əlavələrinin köməkçisi

## API nümunələr {#api-examples}

İctimai tətbiqetmə üçün `IrohaSwift/Sources/IrohaSwift` və eyni mənbə yenidənqurmasından test edilmiş istifadə nümunələri üçün `IrohaSwift/Tests/IrohaSwiftTests` istifadə edin.

## Mənbə istinadları {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
