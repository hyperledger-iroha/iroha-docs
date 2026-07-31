---
translation_locale: mn
translation_source: /guide/tutorials/swift.md
translation_source_hash: 85cc94399b9892984615bf8a0821a1f30395eb87ec164592ca98fbd9903ef834
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift болон iOS {#swift-and-ios}

Хөдөлмөрийн Swift SDK эргэлтийн ажлын орон зай нь `IrohaSwift` Swift
дэд хэсэгт багц `IrohaSwift/`. Үндсэн 3 номын санг багтаасан .
бүтээгдэхүүн`IrohaSwift`, `IrohaSwiftMobileTransports`, болон
`IrohaSwiftTransferUI` болон iOS 15+ болон macOS 12+-ийг Swift хэрэгсэл 5.9.

Барилгын багц нь эх орондоо `NoritoBridge` Хоёр дахь зорилт.
Үргэлт батлах `../dist/NoritoBridge.xcframework` барилгын өмнө,
транзакцын эсвэл холбох крипто замыг нь дамжингүй алдаа гаргахад
Тус нутгийн бэлгэдэл нь ачааллгүй.

## Swift Барилгын менежер {#swift-package-manager}

Хөдөлмөрийн орон зайг шалгалтгүйгээр хөгжүүлэхэд SwiftPM орон нутгийн
`IrohaSwift/` багцын жагсаалт.
`Package.swift` бол `IrohaSwift`:

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

Хэрэглээнийхээ замыг тохируул.
`examples/ios/ConnectMinimalApp` зам бол; энэ явдлыг шийдвэрлэнэ
`../../IrohaSwift` . `examples/IrohaSwift`.

Пакетыг шийдэхээс өмнө буудлын ажил орчны гарал дээр байдаг эсэхийг шалгаарай:

```bash
cd /path/to/iroha
make bridge-xcframework
```

Энэ нь `dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift`
Энэ нь: `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

Үндсэн код нь мөн `IrohaSwift/IrohaSwift.podspec`. Энэ нь
`IrohaSwift` шашин, Swift 5.9 болон iOS 15. Swift .
гол хадгаламж; эх цамхаг одоо ч байх ёстой бөгөөд холбогдох
транзакцын код, Ed25519 бус гарын үсэг зурах, Connect крипто.

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

## Та үүнийг туршиж үзээрэй. Taira Зөвхөн уншигч {#try-taira-read-only}

Тэнгисийн хэсгээр эхлэнэ HTTP төхөөрөмж эсвэл симулятор нь
олон нийт Taira төгсгөл:

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

Үүнтэй ижил хэрэглэж болно `URLSession` хяналт
`https://taira.sora.org/v1/assets/definitions?limit=5` Та бариад байх үед
UI Энэ нь та бүхэнд таалагдаж байна. `IrohaSDK` Зөвхөн
хэрэгсэл баталгаатай хадгаламжийн гарын үсэг зурагч материалыг борлуулж, дансны санхүүжилт
Taira.

Худалдааны бүтээн байгуулалтыг хийх, өргөн мэдүүлэхэд `IrohaSDK` Энэ нь "Хэрэглэгчид"
"Bridge-backed transaction encoder" гэдэг нь:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, болон
`UnshieldRequest` санхүүгийн тооцоог баталгаажуулах IDs болон санхүүгийн өмгөөлөгчгүй
База 58 хөрөнгийн тодорхойлолт IDs Хөдөлмөрийг гарын үсэг зурхаасаа өмнө.

## Тухайн хяналтын төлбөр {#native-escrow}

Swift зах зээлийн байршил болон нууцлан хадгаламжлах жуулчлалын чиглэлийг Norito JSON
хэрэглэгдэх ачаа `NativeEscrowInstructionBuilders` эсвэл ижил төстэй
`IrohaSDK.build*Escrow*` Хөдөлмөрийн туслагч.
[Үндэсний хөрөнгийн хяналт](/mn/blockchain/escrow.md#swift-and-ios) Жишээлбэл,
Аноним дуудлаганы талбай, маргааныг шийдвэрлэх зөвшөөрлийн тэмдэг.

## Гарын үсэг зурах {#signing}

`Keypair` Ed25519-ийн тохиромжтой API. Бусад алгоритмийн хувьд
`IrohaSDK` хамтран `defaultSigningAlgorithm` болон ашиглах `generateSigningKey()` эсвэл
`signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

Хөдөлмөрийн `SigningAlgorithm` enum нь одоогийн Ed25519, secp256k1 BLS хэвийн
Жижиг хэмжээний төрөл, ML-DSA, GOST R 34.10-2012-ийн параметрний багц, SM2. Төгс
Эд25519 замын гадна гүүрний дэмжлэг шаардлагатай.

## Харилцаа холбоо {#connect}

Connect клиент нь Swift эх сурвалж, крипто болон төхөөрөмжийн кодэк
дэмжлэгтэй `NoritoBridge`:

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

`ConnectSession` нээлттэй болон хаагдсан удирдлага, нууцалт хуудас уншдаг.
чиглэлийн түлхүүр, урсгалын хяналт, үйл явдлын урсгал, тэнцвэрлэх урсгал, оношилгоо
сэтгүүл.

## Одоогийн хамрааллалт {#current-coverage}

Хөдөлмөрийн Swift эх үүсвэр нь одоогийн байдлаар:

- `ToriiClient` HTTP данс, хөрөнгө, нууц үсэг, хайгуулын хуудсуудын туслах
  RWA, гэрээ, олон талт, засаглал, захиалг, бүртгэл, мэдээллийн хэрэгсэл;
  нууц хөрөнгө, түймэр / гүйлгээний цаг үеийн байдал, эрүүл мэнд, үзүүлэлтүүд, SSE урсгал
- `IrohaSDK` гүйлгээний бүтээн байгуулагч, шилжүүлэн суулгах / санал асуулга явуулах туслах ажилтан
  халуун, хамгаалалтгүй, ZK шилжүүлэн суулгах, ZK хөрөнгийн бүртгэл, метадэтгэл,
  тодруулгын нэхэмжлэл, олон тамгатай бүртгэл, удирдлагын заавар
- гүйлгээний шуурхайны дэмжлэг `PendingTransactionQueue` болон
  `FilePendingTransactionQueue`
- бүртгэлийн хаяг, I105 тусламж үзүүлэгчид `AccountAddress` болон `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST, болон SM2 гарын үсэг зурагч, эх оронч
  шаардлагатай тохиолдолд гүүрний дэмжлэг
- зах зээлийн хэрэглэгдэх хэрэглээний ачааны үйлдвэрлэгч, аноним
  Хөдөлмөрийн сан
- Харилцаа холбоо WebSocket, рамз, крипто, хуралдаан, шуурхай, дахин тоглолт, оношилгоо
  туслах
- Кагемушагийн бэлэн байдал, түргэн хуримтлагдсан нэмэлт хэрэгсэл, төлбөр, үйл ажиллагааны байдал, тэмдэглэл,
  хамтын ажиллагааны багц, хүлээн авах болон QR урсгалын загварууд
- SoraFS, Мэдээллийн хүртээмж, баталгаажуулалтын холбооны туслах

## API Жишээлбэл {#api-examples}

Хэрэглээ `IrohaSwift/Sources/IrohaSwift` олон нийтийн хэрэгжилтэд зориулсан,
`IrohaSwift/Tests/IrohaSwiftTests` ижил төстэй ашиглалтын шинжилгээний үлгэр жишээ
эх үүсвэрийн шинэчлэл.

## Эх сурвалж {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
