---
translation_locale: az
translation_source: /guide/tutorials/swift.md
translation_source_hash: 753ce1b5e0de4eae56b38e77962566b23fee56d4662a432a7bbe6ea807261422
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
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

Tətbiqiniz üçün yolu tənzimləyin. `examples/ios/ConnectMinimalApp/Package.swift` eyni asılılığı `../../../IrohaSwift` nisbi yolu ilə göstərir.

Paketi həll etməzdən əvvəl cari yerli körpünü yığın. Lokal inkişaf və testlər üçün bunu iş sahəsinin kökündən işə salın:

```bash
cd /path/to/iroha
python3.12 scripts/test_swift_local.py
```

Buraxılış yığımları `make bridge-xcframework` ilə `dist/NoritoBridge.xcframework` yaradır; bu əmr `SOURCE_DATE_EPOCH`, `NORITO_BRIDGE_OUT_DIR`, `NORITO_BRIDGE_BUILD_DIR`, `NORITO_BRIDGE_ARCHIVE_OUTPUT` və `MOBILE_SDK_CARGO_LOCKFILE` tələb edir. `IrohaSwift/Package.swift` körpüyə `../dist/NoritoBridge.xcframework` kimi istinad edir.

## Tez Başlanğıc {#quickstart}

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

## Sına Taira Yalnız Oxumaq {#try-taira-read-only}

Cihazın və ya simulyatorun açıq Taira son nöqtəsinə çata bildiyini təsdiqləmək üçün sadə HTTP yoxlaması ilə başlayın:

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

`TransferRequest`, `MintRequest` və `BurnRequest` imzalamaqdan əvvəl tək protokol-standart hesab ID-lərini və tək protokol-standart prefiksiz Base58 aktiv-təyin ID-lərini təsdiqləyirlər.

## Yerli Etibarnamə {#native-escrow}

Swift bazar eskrousu təlimatlarını Norito JSON paketləri kimi `NativeEscrowInstructionBuilders` və ya ekvivalent `IrohaSDK.build*Escrow*` köməkçilər vasitəsilə qurur. Nümunələr və mübahisə həll edici icazə tokeni üçün [Yerli Aktiv Depoziti](/az/blockchain/escrow.md#swift-and-ios) bölməsinə baxın.

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

let keyPair = try ConnectCrypto.generateKeyPair()
let session = try ConnectSession(
    networkID: try NetworkId(literal: "<exact-network-id>"),
    appPublicKey: keyPair.publicKey,
    nonce: nonce,
    relayToken: "<token>",
    client: client
)
```

`ConnectSession` açıq və bağlama nəzarətlərini, şifrələnmiş məlumat konteyneri oxunuşlarını, istiqamət düymələrini, axın nəzarətini, hadisə axınlarını, balans axınlarını və diaqnostika jurnallarını idarə edir.

## Cari Əhatə {#current-coverage}

Swift mənbə hazırda aşağıdakılardan ibarətdir:

- `ToriiClient` HTTP hesablar, aktivlər, ləqəblər, tədqiqat səhifələri, RWA, müqavilələr, multisig, idarəetmə, abunələr, məlumat mövcudluğu, məxfi aktivlər, şəbəkə qovşağı/proqram icra mühiti vəziyyəti, sağlamlıq, metriklər və SSE axınlar üçün köməkçilər
- `IrohaSDK` köçürmə, buraxılış, yandırma, ZK aktiv qeydiyyatı, metadatalar, identifikator iddiaları, çox imzalı qeydiyyat, müqavilə yerləşdirilməsi və idarəetmə bülletenləri üçün əməliyyat qurucuları və təqdim/sorğu köməkçiləri
- `PendingTransactionQueue` və `FilePendingTransactionQueue` vasitəsilə gözləyən əməliyyat növbəsi dəstəyi
- hesab ünvanı və I105 köməkçilər vasitəsilə `AccountAddress` və `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST və SM2 imzalama səthləri, tələb olunduqda yerli körpü dəstəyi ilə
- bazar yeri və anonim əmanət üçün yerli əmanət təlimatı yükü yaradıcısı
- WebSocket, çərçivə, kripto, sessiya, növbə, təkrar oynatma və diaqnostika köməkçilərinə qoşulun
- KAGEMUSHA V1 ötürmə formatı köməkçiləri və birbaşa platformada işləyən pul kisəsinin Advance təminatçısı, qeydiyyat, bərpa və qəbul edilmiş mübadilə çağırışları üçün iPhone platforma adapteri
- SoraFS, məlumat-mövcudluğu və sübut-qaynaq yardımçıları

## API Nümunələr {#api-examples}

Ümumi tətbiq üçün `IrohaSwift/Sources/IrohaSwift`-dən və eyni mənbə reviziyasından sınaqdan keçirilmiş istifadə nümunələri üçün `IrohaSwift/Tests/IrohaSwiftTests`-dən istifadə edin.

## Mənbə İstinadları {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
