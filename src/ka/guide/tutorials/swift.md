---
translation_locale: ka
translation_source: /guide/tutorials/swift.md
translation_source_hash: 85cc94399b9892984615bf8a0821a1f30395eb87ec164592ca98fbd9903ef834
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift და iOS {#swift-and-ios}

სააგენტო Swift SDK გადაზიდული upstream სამუშაო სივრცე არის `IrohaSwift` Swift
ქვემოთ მოცემული პაკეტი `IrohaSwift/`. მისი პაკეტის მანიფესტი განსაზღვრავს სამი ბიბლიოთეკა
პროდუქტები`IrohaSwift`, `IrohaSwiftMobileTransports`, და
`IrohaSwiftTransferUI`და iOS 15+ და macOS 12+ მიმართულია Swift ინსტრუმენტები 5.9.

პაკეტი დამოკიდებულია ადგილობრივზე `NoritoBridge` ბინარული სამიზნე.
რეზოლუციის ვალიდატირება `../dist/NoritoBridge.xcframework` მშენებლობის წინ და
ტრანზაქცია ან Connect კრიპტოვალუტის გზები ტრიალებს ხიდი-არა ხელმისაწვდომი შეცდომები, როდესაც
ადგილობრივი სიმბოლოები არ არის ჩართული.

## Swift პაკეტის მენეჯერი {#swift-package-manager}

როდესაც სამუშაო სივრცის შეზღუდვისას, წერტილი SwiftPM ადგილობრივ
`IrohaSwift/` პაკეტის დირექტორი.
`Package.swift` არის `IrohaSwift`:

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

შეეცადეთ შეცვალოთ თქვენი აპლიკაციის გზა. არ გადაწეროთ მიმდინარე
`examples/ios/ConnectMinimalApp` გზა, როგორც არის; რომ manifest გადაწყვეტს
`../../IrohaSwift` დაწვრილებით `examples/IrohaSwift`.

პაკეტის გადაჭრამდე, დარწმუნდით, რომ ხიდი არსებობს სამუშაო სივრცის ფესვზე:

```bash
cd /path/to/iroha
make bridge-xcframework
```

ეს აწარმოებს `dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift`
მიუთითებს მას, როგორც `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

კოდის ბაზა ასევე შეიცავს `IrohaSwift/IrohaSwift.podspec`. ის აცხადებს, რომ
`IrohaSwift` კაპიტალი, Swift 5.9, და iOS 15. Podspec იზიდავს Swift წყაროები
ძირითადი საცავი; ადგილობრივი ხიდი ჯერ კიდევ უნდა არსებობდეს და დაკავშირებული უნდა იყოს
გარიგების კოდირება, არა-Ed25519 ხელმოწერა და Connect კრიპტო.

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

## სცადე. Taira მხოლოდ წაკითხვა {#try-taira-read-only}

დაიწყეთ უბრალოდან HTTP სონდი, რომელიც ადასტურებს, რომ მოწყობილობა ან სიმულატორი მიაღწევს
საზოგადოება Taira საბოლოო წერტილი:

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

გამოიყენეთ იგივე `URLSession` შეამოწმეთ
`https://taira.sora.org/v1/assets/definitions?limit=5` სანამ შენ აშენებ
UI და კვლავ შეეცადეთ ქცევა. გადადით `IrohaSDK` დახმარება მხოლოდ შემდეგ, რაც
აპლიკაცია ატვირთავს ხელმოწერის მასალას უსაფრთხო შენახვისგან და ანგარიში ფინანსდება
Taira.

ტრანზაქციის შესაქმნელად და წარსადგენად, გამოიყენეთ `IrohaSDK` დამხმარეები. ეს ეწოდება
ნაციონალური ტრანზაქციის კოდერი, რომელიც მხარდაჭერით არის უზრუნველყოფილი:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, და
`UnshieldRequest` კანონიკური ანგარიშის დამტკიცება IDs და კანონიკური უპრეფისო
ბაზა58 აქტივების განსაზღვრა IDs სანამ ხელმოწერას.

## ნაციონალური საფინანსო დავალიანება {#native-escrow}

Swift ბაზრის და ანონიმური escrow ინსტრუქციები აშენებს, როგორც Norito JSON
სასარგებლო ტვირთების გავლა `NativeEscrowInstructionBuilders` ან ექვივალენტი
`IrohaSDK.build*Escrow*` მწეველები.
[ნაციონალური აქტივების გადახდა](/ka/blockchain/escrow.md#swift-and-ios) მაგალითად,
ანონიმური მტკიცებულებების ველები და დავების განმუხტვის ნებართვის ტოკი.

## ხელმოწერა {#signing}

`Keypair` ედ25519-ის კომფორტი API. სხვა ალგორითმებისათვის, შეიქმნას
`IrohaSDK` მქონე `defaultSigningAlgorithm` და გამოყენება `generateSigningKey()` ან
`signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

სააგენტო `SigningAlgorithm` enum ამჟამად შეიცავს Ed25519, secp256k1, BLS ნორმალური
და მცირე ზომის ვარიანტები, ML-DSA, GOST R 34.10-2012 პარამეტრების კომპლექტები და SM2. ადგილობრივი
საჭიროა ხიდის მხარდაჭერა Ed25519 მოსახერხებელი გზაზე.

## შეხება {#connect}

კლიენტი Connect განხორციელებულია Swift წყარო, კრიპტო და ჩარჩო კოდეკებით
მხარდაჭერილი `NoritoBridge`:

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

`ConnectSession` ღია და დახურული კონტროლის სახელები, კოდირებული ფარდების წაკითხვა;
მიმართულების გასაღები, ნაკადის კონტროლი, მოვლენათა ნაკადები, ბალანსის ნაკადები და დიაგნოსტიკა
ჟურნალები.

## მიმდინარე დაფარვა {#current-coverage}

სააგენტო Swift წყარო ამჟამად მოიცავს:

- `ToriiClient` HTTP დახმარება ანგარიშების, აქტივების, საიდუმლოების, Explorer გვერდებისათვის;
  RWA, ხელშეკრულებები, მულტი-სიგები, მართვა, აბონენტები, მონაცემების ხელმისაწვდომობა;
  კონფიდენციალური აქტივები, კვანძის/სტარტაიმის სტატუსი, ჯანმრთელობა, მაჩვენებლები და SSE ნაკადები
- `IrohaSDK` ტრანზაქციების შემქმნელები და გადაცემისათვის წარდგენილ/გამოკითხვის დამხმარეები, მინა,
  დამწვრობა, ტყავის დაშლა, ZK გადარიცხვა, ZK აქტივების რეგისტრაცია, მეტა მონაცემები;
  საიდენტიფიკაციო მოთხოვნები, მრავალნიშნა რეგისტრაცია და მართვის ინსტრუქციები
- მიმდინარე ტრანზაქციების რიგის მხარდაჭერა `PendingTransactionQueue` და
  `FilePendingTransactionQueue`
- ანგარიშის მისამართი და I105 დამხმარეები `AccountAddress` და `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST, და SM2 ხელმოწერის ზედაპირები, ადგილობრივი
  საჭიროების შემთხვევაში ხიდის მხარდაჭერა
- ადგილობრივი escrow ინსტრუქციის სასარგებლო ტვირთების მშენებლები ბაზარზე და ანონიმური
  საფინანსო დაფარვა
- შეხება WebSocket, ჩარჩო, კრიპტო, სესია, რიგები, გათამაშება და დიაგნოსტიკა
  დამხმარეები
- კაგემუშას მზადყოფნა, დატვირთული დამატება და გამოსყიდვა, ოპერაციის სტატუსი, შენიშვნა,
  პარტნიორების ბუნდი, ქვითარი და QR დენის მოდელები
- SoraFS, მონაცემთა ხელმისაწვდომობისა და მტკიცებულების ჩართვის დამხმარეები

## API მაგალითები {#api-examples}

გამოყენება `IrohaSwift/Sources/IrohaSwift` საჯარო განხორციელებისთვის და
`IrohaSwift/Tests/IrohaSwiftTests` ამავე დანადგარების გამოყენების ტესტირებული მაგალითებისთვის
წყარო რევიზიონი.

## წყაროების მითითებები {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
