# Swift and iOS

The Swift SDK shipped by the upstream workspace is the `IrohaSwift` Swift
package under `IrohaSwift/`. Its package manifest defines three library
products—`IrohaSwift`, `IrohaSwiftMobileTransports`, and
`IrohaSwiftTransferUI`—and targets iOS 15+ and macOS 12+ with Swift tools 5.9.

The package depends on the native `NoritoBridge` binary target. Package
resolution validates `../dist/NoritoBridge.xcframework` before building, and
transaction or Connect crypto paths throw bridge-unavailable errors when the
native symbols are not loaded.

## Swift Package Manager

When developing against a checked-out workspace, point SwiftPM at the local
`IrohaSwift/` package directory. The package identity used by
`Package.swift` is `IrohaSwift`:

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

Adjust the path for your app. `examples/ios/ConnectMinimalApp/Package.swift`
shows the same dependency with the relative path `../../../IrohaSwift`.

Before resolving the package, build the current native bridge. For local
development and tests, run this from the workspace root:

```bash
cd /path/to/iroha
python3.12 scripts/test_swift_local.py
```

Release builds produce `dist/NoritoBridge.xcframework` with
`make bridge-xcframework`, which requires `SOURCE_DATE_EPOCH`,
`NORITO_BRIDGE_OUT_DIR`, `NORITO_BRIDGE_BUILD_DIR`,
`NORITO_BRIDGE_ARCHIVE_OUTPUT`, and `MOBILE_SDK_CARGO_LOCKFILE`.
`IrohaSwift/Package.swift` references the bridge as
`../dist/NoritoBridge.xcframework`.

## Quickstart

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

## Try Taira Read-Only

Start with a plain HTTP probe to confirm the device or simulator can reach the
public Taira endpoint:

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

Use the same `URLSession` check for
`https://taira.sora.org/v1/assets/definitions?limit=5` while you are building
UI and retry behavior. Switch to `IrohaSDK` submit helpers only after the
app loads signer material from secure storage and the account is funded on
Taira.

To build and submit a transaction, use the `IrohaSDK` helpers. These call the
native bridge-backed transaction encoder:

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

`TransferRequest`, `MintRequest`, and `BurnRequest` validate canonical account IDs and canonical unprefixed
Base58 asset-definition IDs before signing.

## Native Escrow

Swift builds marketplace escrow instructions as Norito JSON
payloads through `NativeEscrowInstructionBuilders` or the equivalent
`IrohaSDK.build*Escrow*` helpers. See
[Native Asset Escrow](/blockchain/escrow.md#swift-and-ios) for examples
and the dispute resolver permission token.

## Signing

`Keypair` is the Ed25519 convenience API. For other algorithms, construct an
`IrohaSDK` with `defaultSigningAlgorithm` and use `generateSigningKey()` or
`signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

The `SigningAlgorithm` enum currently includes Ed25519, secp256k1, BLS normal
and small variants, ML-DSA, GOST R 34.10-2012 parameter sets, and SM2. Native
bridge support is required outside the Ed25519 convenience path.

## Connect

The Connect client is implemented in Swift source, with crypto and frame codecs
backed by `NoritoBridge`:

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

`ConnectSession` handles open and close controls, encrypted envelope reads,
direction keys, flow control, event streams, balance streams, and diagnostics
journals.

## Current Coverage

The Swift source currently includes:

- `ToriiClient` HTTP helpers for accounts, assets, aliases, explorer pages,
  RWA, contracts, multisig, governance, subscriptions, data availability,
  confidential assets, node/runtime status, health, metrics, and SSE streams
- `IrohaSDK` transaction builders and submit/poll helpers for transfer, mint,
  burn, ZK asset registration, metadata, identifier claims, multisig
  registration, contract deployment, and governance ballots
- pending transaction queue support through `PendingTransactionQueue` and
  `FilePendingTransactionQueue`
- account-address and I105 helpers through `AccountAddress` and `AccountId`
- Ed25519, secp256k1, ML-DSA, BLS, GOST, and SM2 signing surfaces, with native
  bridge support where required
- native escrow instruction payload builders for marketplace and anonymous
  escrow
- Connect WebSocket, frame, crypto, session, queue, replay, and diagnostics
  helpers
- KAGEMUSHA V1 wire helpers and the iPhone platform adapter for the native
  wallet Advance provider, enrollment, recovery, and admitted exchange calls
- SoraFS, data-availability, and proof-attachment helpers

## API Examples

Use `IrohaSwift/Sources/IrohaSwift` for the public implementation and
`IrohaSwift/Tests/IrohaSwiftTests` for tested usage examples from the same
source revision.

## Source References

- `IrohaSwift/Package.swift`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
