---
translation_locale: mn
translation_source: /guide/tutorials/swift.md
translation_source_hash: 85cc94399b9892984615bf8a0821a1f30395eb87ec164592ca98fbd9903ef834
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift болон iOS {#swift-and-ios}

Үндсэн хуулийн Swift SDK эргэлтийн ажлын хэсгээр шилжүүлсэн нь `IrohaSwift` Swift дэргэдэх багц `IrohaSwift/`. Тус багцын манфист нь гурван номын сан бүтээгдэхүүнийг тодорхойлдог`IrohaSwift`, `IrohaSwiftMobileTransports`, болон `IrohaSwiftTransferUI` болон iOS 15+ болон macOS 12+-д чиглэсэн Swift тоног төхөөрөмж 5.9.

Пакет нь үндсэн `NoritoBridge` бинар зорилтоос хамааралтай. Пакетын тогтоол `../dist/NoritoBridge.xcframework`-ийг бүтээн байгуулалтад хүрэхийн өмнө баталгаажуулдаг бөгөөд төлөөлөгч символуудыг борлуулахгүй үед транзакцын эсвэл Connect крипто замыг дампуулж чадахгүй алдаа гаргадаг .

## Swift Барилгын менежер {#swift-package-manager}

Хөдөлмөрийн орон зайг шалгахдаа SwiftPM -ийг орон нутгийн `IrohaSwift/` багцын жагсаалтад тодруулъя. `Package.swift`-ийн хэрэглэсэн багцын тодорхойлолт нь `IrohaSwift`:

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

Таны аппликейшнүүдийн замыг зохицуу. Одоогийн `examples/ios/ConnectMinimalApp` замыг яг одоо байгаагаар дуулгаж болохгүй; энэ манфист нь `../../IrohaSwift`-ийг `examples/IrohaSwift`-д тогтоох болно.

Пакетыг шийдвэрлэхээс өмнө буудлыг ажлын байрны гарал дээр байдаг эсэхийг шалгаарай:

```bash
cd /path/to/iroha
make bridge-xcframework
```

Энэ нь `dist/NoritoBridge.xcframework` үйлдвэрлэдэг; `IrohaSwift/Package.swift` үүнийг `../dist/NoritoBridge.xcframework` гэж дурддаг.

## CocoaPods {#cocoapods}

Үндсэн код нь мөн `IrohaSwift/IrohaSwift.podspec`. Энэ нь `IrohaSwift` цогц, Swift 5.9 болон iOS 15. Podspec нь татдаг Swift гол хадгаламжийн эх үүсвэрүүд; төлөөлөгчийн гүүр одоо ч байх ёстой бөгөөд гүйлгээний кодлохын тулд холбогдсон байх ёстой. Эд25519-ийн бус гарын үсэг зурах, Connect крипто.

## Удахгүй эхлэх {#quickstart}

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

## Taira уншигчдаа л үзээрэй {#try-taira-read-only}

Тоног төхөөрөмж эсвэл симулятор нь Taira олон нийтэд хүрэх боломжтой гэдгийг баталгаажуулах энгийн HTTP сондаар эхэлнэ:

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

Үүнтэй ижил хэрэглэж болно `URLSession` шалгалт `https://taira.sora.org/v1/assets/definitions?limit=5` Хэрэв та баригдаж байгаа бол UI болон заншил дахин туршиж үзээрэй. `IrohaSDK` хэрэгсэл аюулгүй хадгаламжаас гарын үсэг зурагч материалыг татаж, бүртгэлээ санхүүжүүлсний дараа л тусламж үзүүлнэ. Taira.

Транзакцын бүтээн байгуулалт хийх, өргөн мэдүүлэхэд `IrohaSDK` туслах хэрэглэнэ. Эдгээр нь дотоодын цахилгаан дэмжлэгтэй транзакцийн кодлогч гэж нэрлэдэг:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, болон `UnshieldRequest` санхүүгийн тайланг баталгаажуулах IDs ба санхүүгийн бус Base58 хөрөнгийн тодорхойлолт IDs гарын үсэг зурхаасаа өмнө.

## Үндэсний хадгаламж {#native-escrow}

Swift зах зээлийн байршил болон нууцлан хадгаламжлах чиглэлийг . Norito JSON хэрэглээний ачаалл `NativeEscrowInstructionBuilders` эсвэл ижил төстэй `IrohaSDK.build*Escrow*` Хөдөлмөрийн туслагчид. [Тухайн хөрөнгийн хяналт тавих](/mn/blockchain/escrow.md#swift-and-ios) Жишээ нь, нууцлагдсан баталгааны талбай болон маргаан шийдвэрлэх зөвшөөрлийн тэмдэгт.

## Гарын үсэг зурах {#signing}

`Keypair` нь Ed25519 тохиромжтой API. Бусад алгоритмээр `IrohaSDK`-ийг `defaultSigningAlgorithm` -тэй барьж, `generateSigningKey()` эсвэл `signingKey(fromSeed:)` -ийг ашиглах:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

Үндсэн хуулийн `SigningAlgorithm` enum нь одоогийн Ed25519, secp256k1-ийг багтааж байна, BLS энгийн болон жижиг хэлбэрүүд, ML-DSA, GOST R 34.10-2012 дахь параметрний багц, SM2. Эд25519 зөөврийн замын гаднах нутгийн гүүрний дэмжлэг шаардлагатай.

## Холбоолуул {#connect}

Connect үйлчлүүлэгчийг Swift эх үүсвэрийн хэрэгсэлээр, `NoritoBridge` дэргэдэх крипто болон төхөөрөмжийн кодекүүдээр хэрэгжүүлж байна:

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

`ConnectSession` нь нээлт болон хаах хяналт, шифрлэгдсэн хуудас уншдаг, чиглэлийн товчоо, урсгалын хяналтын систем, үйл явдлын урсгал, тэнцвэрлэх урсгал, оношилгооны сэтгүүлийг удирдаж байна.

## Одоогоор хамааралтай {#current-coverage}

Swift эх сурвалж нь одоогийн байдлаар:

- `ToriiClient` HTTP бүртгэл, хөрөнгө, нууц үсэг, хайгуулын хуудсууд, RWA, гэрээ, олон талт, засаглал, захиалг, өгөгдлийн хүртээмж, нууц эд хөрөнгө, түймрийн / гүйлгээний цаг үеийн байдал, эрүүл мэнд, үзүүлэлтүүд, SSE урсгал
- `IrohaSDK` гүйлгээний бүтээн байгуулагчид, шилжүүлэн суулгах, мынтлах, шатаах, хамгаалалттай, хамгаалалгүй, ZK шилжүүлэх, ZK хөрөнгийн бүртгэл, метадэтгэмжлэл, тодруулгын шаардлагууд, олон тамгын бүртгэл, засаглалын заавар
- `PendingTransactionQueue` болон `FilePendingTransactionQueue` замаар гүйлгээний шуурхайн дэмжлэг хүлээлттэй байна
- `AccountAddress` болон `AccountId` дамжуулан бүртгэлийн хаяг, I105 туслах
- Ed25519, secp256k1, ML-DSA, BLS, GOST болон SM2 гарын үсэг зурах дэлгэцүүд, шаардлагатай тохиолдолд үндэсний гүүрний дэмжлэгтэй
- зах зээлийн зориулалтаар нөөц ачаалал барьдаг, үл тодруулсан хадгаламж олгогч
- WebSocket, зураг, крипто, хуралдаан, шуурхай, дахин тоглолт, оношилгооны туслалцааг холбоно
- Кагемушагийн бэлэн байдал, цахим хувилбар болон төлбөр тооцоо, үйл ажиллагааны байдал, тэмдэглэл, дундаж багц, хүлээн зөвшөөрөл, QR урсгалын загварууд
- SoraFS, өгөгдлийн хүртээмжтэй байдал, хяналтын холбооны туслах

## API Жишээ нь: {#api-examples}

Нийтийн хэрэгжилтэд `IrohaSwift/Sources/IrohaSwift` болон ижил эх үүсвэрийн шинэчилсэн найруулгын ашиглалтын шинжилгээний жишээнүүдэд `IrohaSwift/Tests/IrohaSwiftTests`-ийг ашиглана.

## Эх сурвалж {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
