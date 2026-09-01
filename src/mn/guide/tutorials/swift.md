---
translation_locale: mn
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Swift ба iOS {#swift-and-ios}

Дээд түвшний ажлын орчмоор илгээсэн Swift SDK нь `IrohaSwift/`-ны дорх `IrohaSwift` Swift багц юм. Түүний багцын техникийн жагсаалтад гурван сангийн бүтээгдэхүүн тодорхойлогдсон—`IrohaSwift`, `IrohaSwiftMobileTransports`, ба `IrohaSwiftTransferUI`—мөн iOS 15+ ба macOS 12+-ийг Swift хэрэгслээр 5.9 хувилбартай чиглүүлдэг.

Энэ багц нь нутгийн `NoritoBridge` бинар зорилтот зүйл дээр хараат байдаг. Багцыг шийдвэрлэхэд бүтээхээс өмнө `../dist/NoritoBridge.xcframework`-ийг баталгаажуулдаг, мөн гүйлгээ эсвэл Connect крипто замууд нутгийн тэмдгүүд ачаалагдаагүй үед bridge-unavailable алдааг гаргадаг.

## Swift Багц Менежер {#swift-package-manager}

Татаж авсан ажлын орчин дээр хөгжүүлэхдээ SwiftPM-д дотоод `IrohaSwift/` багцын санг заана. `Package.swift`-ийн ашигладаг багцын танигч нь `IrohaSwift`:

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

Таны апп-д зориулсан замыг тохируулна уу. Одоогийн `examples/ios/ConnectMinimalApp` замыг яг таг хуулбарлаж болохгүй; энэ техникийн манифест нь `../../IrohaSwift`-ийг `examples/IrohaSwift` болгон шийддэг.

Сав багцыг шийдэхээсээ өмнө гүүр нь ажлын өрөөний үндсэн хавтсанд буй эсэхийг шалгаарай:

```bash
cd /path/to/iroha
make bridge-xcframework
```

Энэ нь `dist/NoritoBridge.xcframework` үүсгэдэг; `IrohaSwift/Package.swift` үүнийг `../dist/NoritoBridge.xcframework` гэж дурдсан байдаг.

## CocoaPods {#cocoapods}

Кодын сан нь бас `IrohaSwift/IrohaSwift.podspec` агуулсан. Энэ нь `IrohaSwift` pod-ийг, Swift 5.9 болон iOS 15-ийг зарлан мэдээлдэг. Podspec нь үндсэн репозитороос Swift эх үүсвэрүүдийг татдаг; төрөлх гүүр нь гүйлгээ кодлох, Ed25519 бус гарын үсэг, Connect криптографийн хувьд байж холбогдсон байх шаардлагатай.

## Хурдан эхлэлт {#quickstart}

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

## Оролдоно уу Taira Зөвхөн унших {#try-taira-read-only}

Төхөөрөмж эсвэл симулятор олон нийтийн Taira API төгсгөлийн цэгт хүрч чадах эсэхийг баталгаажуулахын тулд энгийн HTTP илрүүлэгчээр эхлүүлээрэй:

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

Та UI ба дахин оролдлогын үйлдлийг барьж байхдаа `https://taira.sora.org/v1/assets/definitions?limit=5`-д зориулсан ижил `URLSession` шалгалтыг ашиглана уу. Апп нь нууцлалын агуулахнаас криптографийн гарын үсгийн материал ачаалсаны дараа, мөн Taira-д дансанд хөрөнгө орсоны дараа л `IrohaSDK` илгээх туслахууд руу шилжинэ үү.

Гүйлгээг үүсгэж илгээхийн тулд `IrohaSDK` туслахуудыг ашиглана. Эдгээр нь төрөлхийн гүүрийн дэмжлэгтэй гүйлгээний кодлогчийг дуудах болно:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, ба `UnshieldRequest` гарын үсэг зурхаас өмнө ганц протоколын стандарттай дансны ID болон ганц протоколын стандартгүй Base58 хөрөнгийн тодорхойлолтын ID-ийг баталгаажуулдаг.

## Оршин суугаа хүн болон итгэмжлэгдсэн хадгаламж {#native-escrow}

Swift нь Norito JSON payload-уудыг `NativeEscrowInstructionBuilders` эсвэл тэнцүү `IrohaSDK.build*Escrow*` туслах хэрэгслийн тусламжтайгаар зах зээл болон нэргүй хадгалах заавруудыг бүтээдэг. Жишээ, нэргүй нотолгооны талбарууд, маргаан шийдвэрлэх зөвшөөрлийн токеныг үзэхийн тулд [Уугуул хөрөнгийн хадгаламж](/mn/blockchain/escrow.md#swift-and-ios)-ыг үзнэ үү.

## Гарын үсэг зурах {#signing}

`Keypair` нь Ed25519-ний тав тухын API юм. Бусад алгоритмуудын хувьд `defaultSigningAlgorithm`-оор `IrohaSDK` үүсгээд `generateSigningKey()` эсвэл `signingKey(fromSeed:)`-ыг ашигла:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

Одоогийн `SigningAlgorithm` enum-д Ed25519, secp256k1, BLS ердийн ба жижиг хувилбарууд, ML-DSA, GOST R 34.10-2012 параметрийн багцууд, болон SM2 орсон байна. Ed25519 хялбар замын гадуур эх нутгийн гүүрний дэмжлэг шаардлагатай.

## Холбох {#connect}

Connect клиент нь Swift эх кодод хэрэгжсэн бөгөөд крипто болон фрейм кодекуудыг `NoritoBridge` дэмждэг:

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

`ConnectSession` нь нээлт, хаалт удирдлагууд, кодлогдсон өгөгдлийн хадгалах савыг унших, чиглэлийн түлхүүрүүд, урсгалын хяналт, үйл явдлын урсгалууд, тэнцлийн урсгалууд, оношлогооны сэтгүүлүүдийг удирддаг.

## Өнөөгийн хамрах хүрээ {#current-coverage}

Одоогийн байдлаар Swift эх сурвалж нь дараахуудыг агуулж байна:

- `ToriiClient` HTTP данс, хөрөнгө, овог нэр, хайлтын хуудсууд, RWA, гэрээ, олон гарын үсэг, захиргаа, захиалга, өгөгдлийн хүртээмж, нууцлаг хөрөнгө, зангилаа/гэрэгээний төлөв, эрүүл мэнд, хэмжилт, болон SSE урсгалд туслах хэрэгслүүд
- `IrohaSDK` шилжүүлэг, гаргах, устгах, хамгаалах, хамгаалалтыг арилгах, ZK шилжүүлэг, ZK хөрөнгийн бүртгэл, метадата, таних тэмдэг шаардлага, олон гарын үсгийн бүртгэл, удирдлагын зааварчилгааны гүйлгээний бүтээгчид болон илгээх/асуух туслахууд
- `PendingTransactionQueue` ба `FilePendingTransactionQueue` дамжуулан хийгдэж буй гүйлгээний дарааллын дэмжлэг
- account-address ба I105 туслахуудыг `AccountAddress` болон `AccountId`-ийн дамжуулан
- Ed25519, secp256k1, ML-DSA, BLS, GOST, ба SM2 гарын үсгийн гадаргуу, шаардлагатай тохиолдолд уугуул гүүрийн дэмжлэгтэй
- зах зээл ба нэргүй эскроугаар дамжуулан байгалийн эх үүсвэрийн эскроу зааврын өгөгдлийн бүтээгчид
- Холбох WebSocket, хүрээ, крипто, сесс, дараалал, дахин тоглуулах, болон оношилгооны туслахууд
- Kagemusha бэлэн байдал, төрөлжсөн нөхөх болон худалдаж авах, ажиллагааны төлөв, тэмдэглэл, сүлжээний хамтрагч багц, протоколын үр дүнгийн бүртгэл, болон QR урсгалын загварууд
- SoraFS, өгөгдлийн боломжтой байдал, баталгааны хавсралтын тэтгэгчид

## API Жишээ {#api-examples}

Нийтийн хэрэгжилтэнд `IrohaSwift/Sources/IrohaSwift`-ыг, нэг эх үүсвэрийн шинэчлэлтээс туршигдсан хэрэглээний жишээнүүдэд `IrohaSwift/Tests/IrohaSwiftTests`-ыг ашиглана уу.

## Эх үүсвэрийн лавлагаа {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
