---
translation_locale: az
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Swift və iOS {#swift-and-ios}

Upstream iş sahəsi tərəfindən göndərilən Swift SDK `IrohaSwift/` altında `IrohaSwift` Swift paketidir. Onun paket texniki manifesti üç kitabxana məhsulu müəyyən edir—`IrohaSwift`, `IrohaSwiftMobileTransports` və `IrohaSwiftTransferUI`—və iOS 15+ və macOS 12+ üçün Swift alətləri 5.9 ilə hədəfləyir.

Paket yerli `NoritoBridge` ikili hədəfə bağlıdır. Paket həlli qurulmadan əvvəl `../dist/NoritoBridge.xcframework`-i yoxlayır və yerli simvollar yüklənmədikdə əməliyyat və ya Connect kripto yolları körpü-mövcud deyil səhvləri verir.

## Swift Paket Meneceri {#swift-package-manager}

Yoxlanılmış iş sahəsinə qarşı inkişaf etdirərkən, SwiftPM-ü yerli `IrohaSwift/` paket qovluğuna göstərin. `Package.swift` tərəfindən istifadə olunan paket identifikasiyası `IrohaSwift`-dir:

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

Tətbiqiniz üçün yolu tənzimləyin. Cari `examples/ios/ConnectMinimalApp` yolunu olduğu kimi kopyalamayın; həmin texniki manifest `../../IrohaSwift`-i `examples/IrohaSwift`-yə həll edir.

Paket həll edilməzdən əvvəl, körpünün iş sahəsinin kökündə mövcud olduğundan əmin olun:

```bash
cd /path/to/iroha
make bridge-xcframework
```

Bu `dist/NoritoBridge.xcframework` istehsal edir; `IrohaSwift/Package.swift` bunu `../dist/NoritoBridge.xcframework` kimi istinad edir.

## CocoaPods {#cocoapods}

Kod bazası həmçinin `IrohaSwift/IrohaSwift.podspec`-u da ehtiva edir. O, `IrohaSwift` podunu, Swift 5.9-u və iOS 15-i elan edir. Podspec əsas repozitoriyadan Swift mənbələrini çəkir; yerli körpü hələ də əməliyyat kodlaşdırılması, Ed25519 olmayan imzalama və Connect kripto üçün mövcud olmalı və əlaqələndirilməlidir.

## Tez Başlanğıc {#quickstart}

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

## Sına Taira Yalnız Oxumaq {#try-taira-read-only}

Cihazın və ya simulyatorun ictimai Taira API son nöqtəsinə çata biləcəyini təsdiqləmək üçün sadə bir HTTP probe ilə başlayın:

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

`URLSession` yoxlamasını `https://taira.sora.org/v1/assets/definitions?limit=5` üçün istifadə edin, UI və təkrar cəhd davranışını qurarkən. Tətbiq kriptoqrafik imzalayıcı materialını təhlükəsiz yaddaşdan yüklədikdən və hesab Taira-də maliyyələşdirildikdən sonra yalnız `IrohaSDK` göndərmə köməkçilərinə keçin.

Əməkdaşlıq yaratmaq və təqdim etmək üçün `IrohaSDK` köməkçilərindən istifadə edin. Bunlar yerli körpü dəstəklənən əməliyyat kodlayıcısını çağırır:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest` və `UnshieldRequest` imzalamaqdan əvvəl tək protokol-standart hesab ID-lərini və tək protokol-standart prefiksiz Base58 aktiv-təyin ID-lərini təsdiqləyirlər.

## Yerli Etibarnamə {#native-escrow}

Swift market yeri və anonim treyder təlimatlarını Norito JSON paketləri kimi `NativeEscrowInstructionBuilders` və ya ekvivalent `IrohaSDK.build*Escrow*` köməkçilər vasitəsilə qurur. Nümunələr, anonim sübut sahələri və mübahisə həll edici icazə tokeni üçün [Yerli Aktiv Əmanət](/az/blockchain/escrow.md#swift-and-ios)-yə baxın.

## İmzalama {#signing}

`Keypair` Ed25519 rahatlıq API-dir. Digər alqoritmlər üçün `defaultSigningAlgorithm` ilə `IrohaSDK` qurun və `generateSigningKey()` və ya `signingKey(fromSeed:)`-dən istifadə edin:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

`SigningAlgorithm` siyahısına hazırda Ed25519, secp256k1, BLS normal və kiçik variantlar, ML-DSA, GOST R 34.10-2012 parametr dəstləri və SM2 daxildir. Ed25519 rahatlıq yolundan kənarda yerli körpü dəstəyi tələb olunur.

## Qoşul {#connect}

Connect müştərisi Swift mənbəsində həyata keçirilmişdir, kripto və çərçivə kodekləri `NoritoBridge` tərəfindən dəstəklənir:

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

`ConnectSession` açıq və bağlama nəzarətlərini, şifrələnmiş məlumat konteyneri oxunuşlarını, istiqamət düymələrini, axın nəzarətini, hadisə axınlarını, balans axınlarını və diaqnostika jurnallarını idarə edir.

## Cari Əhatə {#current-coverage}

Swift mənbə hazırda aşağıdakılardan ibarətdir:

- `ToriiClient` HTTP hesablar, aktivlər, ləqəblər, tədqiqat səhifələri, RWA, müqavilələr, multisig, idarəetmə, abunələr, məlumat mövcudluğu, məxfi aktivlər, şəbəkə qovşağı/proqram icra mühiti vəziyyəti, sağlamlıq, metriklər və SSE axınlar üçün köməkçilər
- `IrohaSDK` transfer, issue, destroy, shield, unshield üçün əməliyyat qurucuları və təqdim/sonuc yoxlama köməkçiləri, ZK transfer, ZK aktiv qeydiyyatı, metadatalar, identifikator iddiaları, çox imzalı qeydiyyat və idarəetmə təlimatları
- `PendingTransactionQueue` və `FilePendingTransactionQueue` vasitəsilə gözləyən əməliyyat növbəsi dəstəyi
- hesab ünvanı və I105 köməkçilər vasitəsilə `AccountAddress` və `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST və SM2 imzalama səthləri, tələb olunduqda yerli körpü dəstəyi ilə
- bazar yeri və anonim əmanət üçün yerli əmanət təlimatı yükü yaradıcısı
- WebSocket, çərçivə, kripto, sessiya, növbə, təkrar oynatma və diaqnostika köməkçilərinə qoşulun
- Kagemusha hazırlığı, tipləşdirilmiş balans artırma və geri alma, əməliyyat vəziyyəti, qeyd, iştirakçı paketi, qəbz və QR axını modelləri
- SoraFS, məlumat-mövcudluğu və sübut-qaynaq yardımçıları

## API Nümunələr {#api-examples}

Ümumi tətbiq üçün `IrohaSwift/Sources/IrohaSwift`-dən və eyni mənbə reviziyasından sınaqdan keçirilmiş istifadə nümunələri üçün `IrohaSwift/Tests/IrohaSwiftTests`-dən istifadə edin.

## Mənbə İstinadları {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
