---
translation_locale: ka
translation_source: /guide/tutorials/swift.md
translation_source_hash: 753ce1b5e0de4eae56b38e77962566b23fee56d4662a432a7bbe6ea807261422
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Swift და iOS {#swift-and-ios}

Swift SDK საწყის სამუშაო სივრცეში გზავნილია `IrohaSwift` Swift პაკეტი ქვემოთ `IrohaSwift/`. მისი პაკეტის ტექნიკური მანიფესტი განსაზღვრავს სამ ბიბლიოთეკის პროდუქტს`IrohaSwift`, `IrohaSwiftMobileTransports` და `IrohaSwiftTransferUI`და მიმართულია iOS 15+-სა და macOS 12+-ზე Swift ინსტრუმენტებით 5.9.

პაკეტი დამოკიდებულია `NoritoBridge` ბინარული სამიზნეზე. პაკეტის რეზოლუცია ადასტურებს `../dist/NoritoBridge.xcframework` მშენებლობამდე, ხოლო ტრანზაქციის ან Connect კრიპტოგრაფიული გზები ტრიალებენ ხიდის არანაირ შეცდომებს, როდესაც ბინური სიმბოლოები არ არის დატვირთული.

## Swift შეფუთვის მენეჯერი {#swift-package-manager}

ჩაკეტილი სამუშაო სივრცის მიმართ განვითარებისას, მიუთითეთ SwiftPM ადგილობრივ `IrohaSwift/` პაკეტის დირექტორში. `Package.swift`-ს მიერ გამოყენებული პაკეტის იდენტობა არის `IrohaSwift`:

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

ბილიკი თქვენს აპლიკაციას მოარგეთ. `examples/ios/ConnectMinimalApp/Package.swift` იმავე დამოკიდებულებას აჩვენებს ფარდობითი ბილიკით `../../../IrohaSwift`.

პაკეტის დამოკიდებულებების გადაწყვეტამდე ააგეთ მიმდინარე ნატიური ხიდი. ლოკალური დეველოპმენტისა და ტესტებისთვის გაუშვით ეს სამუშაო სივრცის ძირიდან:

```bash
cd /path/to/iroha
python3.12 scripts/test_swift_local.py
```

გამოშვების აწყობები `dist/NoritoBridge.xcframework`-ს `make bridge-xcframework`-ით ქმნის, რომელსაც სჭირდება `SOURCE_DATE_EPOCH`, `NORITO_BRIDGE_OUT_DIR`, `NORITO_BRIDGE_BUILD_DIR`, `NORITO_BRIDGE_ARCHIVE_OUTPUT` და `MOBILE_SDK_CARGO_LOCKFILE`. `IrohaSwift/Package.swift` ხიდს მიმართავს როგორც `../dist/NoritoBridge.xcframework`.

## სწრაფი დასაწყისი {#quickstart}

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

## შეეცადეთ Taira მხოლოდ წაკითხვა {#try-taira-read-only}

დაიწყეთ მარტივი HTTP შემოწმებით, რათა დაადასტუროთ, რომ მოწყობილობა ან სიმულატორი საჯარო Taira ბოლო წერტილს აღწევს:

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

გამოიყენეთ იგივე `URLSession` შეამოწმება `https://taira.sora.org/v1/assets/definitions?limit=5`, როდესაც თქვენ აშენებთ UI და განმეორებით ცდილობთ ქცევას. გადადით `IrohaSDK`-ზე დააბრუნეთ დამხმარეები მხოლოდ მას შემდეგ, რაც აპლიკაცია ჩატვირთავს კრიპტოგრაფიულ ხელმოწერის მასალას უსაფრთხო შენახვადან და ანგარიში დაფინანსებულია Taira.

ტრანზაქციის შესაქმნელად და წარსადგენად გამოიყენეთ `IrohaSDK` დამხმარეები. ისინი იწვევენ ადგილობრივ ხიდზე მხარდაჭერილ ტრანსაქციულ კოდირს:

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

`TransferRequest`, `MintRequest` და `BurnRequest` ხელმოწერამდე ამოწმებს ანგარიშების კანონიკურ ID-ებს და აქტივების განსაზღვრების კანონიკურ, პრეფიქსის გარეშე Base58 ID-ებს.

## ადგილობრივი საფინანსო ანაზღაურება {#native-escrow}

Swift მარკეტპლეისის ესქროს ინსტრუქციებს Norito JSON დატვირთვების სახით ქმნის `NativeEscrowInstructionBuilders`-ის ან ეკვივალენტური `IrohaSDK.build*Escrow*` დამხმარეების მეშვეობით. მაგალითებისა და დავის გადამწყვეტის ნებართვის ტოკენისთვის იხილეთ [ადგილობრივი აქტივების ესქრო](/ka/blockchain/escrow.md#swift-and-ios).

## ხელმოწერა {#signing}

`Keypair` არის Ed25519 კომფორტი API. სხვა ალგორითმებისათვის, შეიქმნას `IrohaSDK` `defaultSigningAlgorithm` და გამოიყენოს `generateSigningKey()` ან `signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

`SigningAlgorithm` enum ამჟამად მოიცავს Ed25519, secp256k1, BLS ნორმალურ და მცირე ვარიანტებს, ML-DSA, GOST R 34.10-2012 პარამეტრების ნაკრებებს და SM2. Ed25519 მოსახერხებელი ბილიკის მიღმა საჭიროა ადგილობრივი ხიდების მხარდაჭერა.

## გაერთიანება {#connect}

კონექტის კლიენტი განხორციელებულია Swift წყაროზე, კრიპტო და ჩარჩო კოდეკებით, რომელსაც მხარს უჭერს `NoritoBridge`:

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

`ConnectSession` მართავს ღია და დახურული კონტროლები, კოდირებული მონაცემების კონტეინერის წაკითხვა, მიმართულების გასაღები, ნაკადის კონტროლი, მოვლენების ნაკადები, ბალანსის ნაკადები და დიაგნოსტიკური ჟურნალები.

## ამჟამინდელი მოცულობა {#current-coverage}

Swift წყარო ამჟამად მოიცავს:

- `ToriiClient` HTTP დამხმარეები ანგარიშებზე, აქტივებზე, საფირმოზე, Explorer-გვერდებზე, RWA, ხელშეკრულებებზე, მრავალხელმოწერა-ზე, მმართველობაზე, აბონენტებზე, მონაცემთა ხელმისაწვდომობაზე, კონფიდენციალურ აქტივებს, კვანძის/სტარტაიმის სტატუსზე, ჯანმრთელობაზე, მაჩვენებლებსა და SSE ნაკადებზე.
- `IrohaSDK` ტრანზაქციების შემქმნელები და გაგზავნისა და სტატუსის პერიოდული შემოწმების დამხმარეები გადარიცხვის, გამოშვების, დაწვის, ZK აქტივების რეგისტრაციის, მეტამონაცემების, იდენტიფიკატორებზე მოთხოვნების, მრავალხელმოწერიანი ანგარიშის რეგისტრაციის, კონტრაქტის განთავსებისა და მმართველობის ბიულეტენებისთვის
- მიმდინარე ტრანზაქციული რიგის მხარდაჭერა `PendingTransactionQueue` და `FilePendingTransactionQueue` საშუალებით
- საანგარიშო მისამართი და I105 დამხმარე პირები `AccountAddress` და `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST და SM2 საფორმაციო ზედაპირები, საჭიროების შემთხვევაში ადგილობრივი ხიდების მხარდაჭერით.
- ადგილობრივი საფინანსო ინსტრუქციის დატვირთვების მშენებლები ბაზრისთვის და ანონიმური საფინანსოსათვის
- დააკავშიროთ WebSocket, ჩარჩო, კრიპტო, სესია, რიგები, გათამაშება და დიაგნოსტიკის დამხმარეები
- KAGEMUSHA V1 გადაცემის ფორმატის დამხმარე საშუალებები და iPhone პლატფორმის ადაპტერი ნატიური საფულის Advance მომწოდებლისთვის, რეგისტრაციისთვის, აღდგენისა და დაშვებული გაცვლის გამოძახებებისთვის
- SoraFS, მონაცემთა ხელმისაწვდომობისა და დასამტკიცებელი მიმაგრების დამხმარეები

## API მაგალითები {#api-examples}

გამოიყენეთ `IrohaSwift/Sources/IrohaSwift` საჯარო დანერგვისთვის და `IrohaSwift/Tests/IrohaSwiftTests` იგივე წყაროს რევიზიიდან გამოკვლეული გამოყენების მაგალითებისთვის.

## წყაროების მითითებები {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
