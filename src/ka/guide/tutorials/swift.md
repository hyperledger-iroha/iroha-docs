---
translation_locale: ka
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift და iOS {#swift-and-ios}

Swift SDK გადაგზავნილი upstream სამუშაო სივრცე არის `IrohaSwift` Swift პაკეტი ქვეშ `IrohaSwift/`. მისი პაკეტის მანიფესტი განსაზღვრავს სამი ბიბლიოთეკის პროდუქტები`IrohaSwift`, `IrohaSwiftMobileTransports` და `IrohaSwiftTransferUI`და მიზნად ისახავს iOS 15+ და macOS 12+ Swift ინსტრუმენტების 5.9.

პაკეტი დამოკიდებულია `NoritoBridge` ბინარული სამიზნეზე. პაკეტის რეზოლუცია ადასტურებს `../dist/NoritoBridge.xcframework` მშენებლობამდე, ხოლო ტრანზაქციის ან Connect კრიპტოვალუტების გზები ტრიალებენ ხიდის არანაირ შეცდომებს, როდესაც ბინური სიმბოლოები არ არის დატვირთული.

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

შეცვალეთ თქვენი აპლიკაციის გზა. არ გადაწეროთ მიმდინარე `examples/ios/ConnectMinimalApp` გზა, როგორც არის; ეს მანიფესტი გადაწყვეტს `../../IrohaSwift` to `examples/IrohaSwift`.

პაკეტის გადაჭრამდე, დარწმუნდით, რომ ხიდი არსებობს სამუშაო სივრცეში ფესვზე:

```bash
cd /path/to/iroha
make bridge-xcframework
```

აღნიშნული პროდუქტი წარმოადგენს `dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift` უწოდებს მას როგორც `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

კოდის ბაზა ასევე შეიცავს `IrohaSwift/IrohaSwift.podspec`. იგი აცხადებს `IrohaSwift` პოდს, Swift 5.9 და iOS 15. პოდსპექი იზიდავს Swift წყაროებს მთავარ საცავიდან; მშობლიური ხიდი ჯერ კიდევ უნდა არსებობდეს და დაკავშირებული იყოს ტრანზაქციის კოდირებისთვის, არა-Ed25519 ხელმოწერისთვის და კრიპტო კავშირისთვის.

## სწრაფი დასაწყისი {#quickstart}

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

## შეეცადეთ Taira მხოლოდ წაკითხვა {#try-taira-read-only}

დაიწყეთ მარტივი HTTP სონდის გამოყენებით, რათა დაადასტუროთ, რომ მოწყობილობა ან სიმულატორი შეიძლება მიაღწიოს საზოგადოებრივ Taira საბოლოო წერტილს:

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

გამოიყენეთ იგივე `URLSession` შეამოწმება `https://taira.sora.org/v1/assets/definitions?limit=5`, როდესაც თქვენ აშენებთ UI და კვლავ სცადეთ ქცევა. გადადით `IrohaSDK`-მდე დააბრუნეთ დამხმარეები მხოლოდ მას შემდეგ, რაც აპლიკაცია ატვირთავს ხელმოწერის მასალას უსაფრთხო შენახვისგან და ანგარიში ფინანსდება Taira.

ტრანზაქციის შესაქმნელად და წარსადგენად, გამოიყენეთ `IrohaSDK` დამხმარეები. ისინი ეძახიან ადგილობრივ ხიდზე მხარდაჭერილ ტრანზაკციულ კოდირებას:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, და `UnshieldRequest` კანონიკური ანგარიშის დამტკიცება IDs და კანონიკური არასწორი Base58 აქტივის განსაზღვრა IDs მანამდე, სანამ ხელმოწერა.

## ადგილობრივი საფინანსო ანაზღაურება {#native-escrow}

Swift ქმნის ბაზრის და ანონიმური საფინანსო ინსტრუქციებს, როგორც Norito JSON სასარგებლო ტვირთები `NativeEscrowInstructionBuilders` ან ექვივალენტული `IrohaSDK.build*Escrow*` დამხმარეების მეშვეობით. იხილეთ [ Native Asset Escrow](/ka/blockchain/escrow.md#swift-and-ios) მაგალითებისთვის, ანონიმურ მტკიცებულებების ველები და დავების განმუხტვის ნებართვის ჯილდო.

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

let session = ConnectSession(sessionID: sessionID, client: client)
let keyPair = try ConnectCrypto.generateKeyPair()
```

`ConnectSession` მართავს ღია და დახურული კონტროლი, კოდირებული ფურცლის წაკითხვა, მიმართულების გასაღები, ნაკადის მართვა, მოვლენების ნაკადები, ბალანსის ნაკადები და დიაგნოსტიკური ჟურნალები.

## ამჟამინდელი მოცულობა {#current-coverage}

Swift წყარო ამჟამად მოიცავს:

- `ToriiClient` HTTP დამხმარეები ანგარიშებზე, აქტივებზე, საფირმოზე, Explorer-გვერდებზე, RWA, ხელშეკრულებებზე, multisig-ზე, მმართველობაზე, აბონენტებზე, მონაცემთა ხელმისაწვდომობაზე, კონფიდენციალურ აქტივებს, კვანძის/სტარტაიმის სტატუსზე, ჯანმრთელობაზე, მაჩვენებლებსა და SSE ნაკადებზე.
- `IrohaSDK` ტრანზაქციების შემქმნელები და გადაცემის/გამოკითხვის დამხმარეები ტრანსფერისთვის, მონტაჟისთვის, წვისთვის, ტყვეობისთვის, უტყვილისათვის, ZK გადარიცხვა, ZK აქტივების რეგისტრაცია, მეტა მონაცემები, საიდენტიფიკაციო მოთხოვნები, მრავალფუნქციური რეგისტრაციისა და მმართველობის ინსტრუქციები
- მიმდინარე ტრანზაქციული რიგის მხარდაჭერა `PendingTransactionQueue` და `FilePendingTransactionQueue` საშუალებით
- საანგარიშო მისამართი და I105 დამხმარე პირები `AccountAddress` და `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST და SM2 საფორმაციო ზედაპირები, საჭიროების შემთხვევაში ადგილობრივი ხიდების მხარდაჭერით.
- ადგილობრივი საფინანსო ინსტრუქციის სასარგებლო ტვირთების მშენებლები ბაზრისთვის და ანონიმური საფინანსოსათვის
- დააკავშიროთ WebSocket, ჩარჩო, კრიპტო, სესია, რიგები, გათამაშება და დიაგნოსტიკის დამხმარეები
- კაგემუშას მზადყოფნა, ჩაწერილი დამატება და გამოსყიდვა, ექსპლუატაციის სტატუსი, შენიშვნა, თანამოაზრე ბუნდი, მიღება და QR ნაკადის მოდელები.
- SoraFS, მონაცემთა ხელმისაწვდომობისა და დასამტკიცებელი მიმაგრების დამხმარეები

## API მაგალითები {#api-examples}

გამოიყენეთ `IrohaSwift/Sources/IrohaSwift` საჯარო დანერგვისთვის და `IrohaSwift/Tests/IrohaSwiftTests` იგივე წყაროს რევიზიიდან გამოკვლეული გამოყენების მაგალითებისთვის.

## წყაროების მითითებები {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
