---
translation_locale: ja
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Swift と iOS {#swift-and-ios}

上流ワークスペースから出荷された Swift SDK は、`IrohaSwift/`の下にある`IrohaSwift` Swift パッケージです。そのパッケージの技術マニフェストは、`IrohaSwift`、`IrohaSwiftMobileTransports`、`IrohaSwiftTransferUI`の3つのライブラリ製品を定義しており、Swift ツール5.9でiOS 15+およびmacOS 12+をターゲットにしています。

このパッケージはネイティブの `NoritoBridge` バイナリターゲットに依存しています。パッケージ解決はビルド前に `../dist/NoritoBridge.xcframework` を検証し、ネイティブシンボルがロードされていない場合、トランザクションや Connect の暗号パスは bridge-unavailable エラーを投げます。

## Swift パッケージマネージャー {#swift-package-manager}

チェックアウトされたワークスペースで開発する場合、SwiftPM をローカルの `IrohaSwift/` パッケージディレクトリに向けます。`Package.swift` が使用するパッケージの識別子は `IrohaSwift` です:

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

アプリのパスを調整してください。現在の `examples/ios/ConnectMinimalApp` パスをそのままコピーしないでください。その技術的マニフェストは `../../IrohaSwift` を `examples/IrohaSwift` に解決します。

パッケージを解決する前に、ブリッジがワークスペースのルートに存在することを確認してください：

```bash
cd /path/to/iroha
make bridge-xcframework
```

これは `dist/NoritoBridge.xcframework` を生成します；`IrohaSwift/Package.swift` はそれを `../dist/NoritoBridge.xcframework` として参照します。

## CocoaPods {#cocoapods}

コードベースには `IrohaSwift/IrohaSwift.podspec` も含まれています。`IrohaSwift` ポッド、Swift 5.9、そして iOS 15 を宣言しています。ポッドスペックはメインリポジトリから Swift ソースを取得します；トランザクションのエンコード、非 Ed25519 の署名、および Connect 暗号のために、ネイティブブリッジは依然として存在しリンクされている必要があります。

## クイックスタート {#quickstart}

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

## 試す Taira 読み取り専用 {#try-taira-read-only}

まず、プレーンな HTTP プローブを使用して、デバイスまたはシミュレーターがパブリック Taira API エンドポイントに到達できることを確認します:

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

UI と再試行動作を構築している間、`https://taira.sora.org/v1/assets/definitions?limit=5` に対しても同じ `URLSession` チェックを使用してください。Taira 上でアカウントに資金が入金され、安全なストレージから暗号署名者のマテリアルがアプリに読み込まれた後にのみ、`IrohaSDK` 送信ヘルパーに切り替えてください。

トランザクションを構築して送信するには、`IrohaSDK` ヘルパーを使用します。これらはネイティブブリッジ対応のトランザクションエンコーダーを呼び出します。

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

`TransferRequest`、`MintRequest`、`BurnRequest`、`ShieldRequest`、および `UnshieldRequest` は、署名前に標準的なアカウントIDおよび標準的な接頭辞なしのBase58資産定義IDを検証します。

## ネイティブエスクロー {#native-escrow}

Swift は、`NativeEscrowInstructionBuilders` または同等の `IrohaSDK.build*Escrow*` ヘルパーを通じて、Norito JSON ペイロードとしてマーケットプレイスおよび匿名エスクロ指示を構築します。例、匿名証明フィールド、および紛争解決者権限トークンについては [ネイティブ資産エスクロー](/ja/blockchain/escrow.md#swift-and-ios) を参照してください。

## 署名 {#signing}

`Keypair` は Ed25519 の便利な API です。他のアルゴリズムの場合は、`defaultSigningAlgorithm` を使って `IrohaSDK` を構築し、`generateSigningKey()` または `signingKey(fromSeed:)` を使用してください:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

`SigningAlgorithm` 列挙型には現在、Ed25519、secp256k1、BLS の標準および小型バリアント、ML-DSA、GOST R 34.10-2012 パラメータセット、および SM2 が含まれています。Ed25519 の簡易パス以外では、ネイティブブリッジのサポートが必要です。

## 接続 {#connect}

Connectクライアントは Swift ソースで実装されており、暗号化およびフレームコーデックは`NoritoBridge`によってサポートされています。

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

`ConnectSession` は、開閉操作、暗号化データコンテナの読み取り、方向キー、フロー制御、イベントストリーム、残高ストリーム、および診断ジャーナルを処理します。

## 現在のカバレッジ {#current-coverage}

現在、Swift ソースには以下が含まれています:

- `ToriiClient` HTTP アカウント、資産、エイリアス、エクスプローラページ、RWA、コントラクト、マルチシグ、ガバナンス、サブスクリプション、データ可用性、機密資産、ノード/ランタイムのステータス、ヘルス、メトリクス、そして SSE ストリーム用のヘルパー
- `IrohaSDK` 転送、発行、破棄、シールド、アンシールドのためのトランザクションビルダーおよび送信／ポーリングヘルパー、ZK 転送、ZK 資産登録、メタデータ、識別子クレーム、マルチシグ登録、およびガバナンスの指示
- `PendingTransactionQueue`および`FilePendingTransactionQueue`を通じた保留中のトランザクションキューのサポート
- account-address と I105 ヘルパーを `AccountAddress` と `AccountId` を通して
- Ed25519、secp256k1、ML-DSA、BLS、GOST、および SM2 の署名面で、必要に応じてネイティブブリッジサポート付き
- マーケットプレイスおよび匿名エスクロー用のネイティブエスクロー指示ペイロードビルダー
- WebSocket、フレーム、暗号、セッション、キュー、リプレイ、および診断ヘルパーを接続する
- 影武者の準備、入力したチャージと償還、操作状況、メモ、ネットワークピアバンドル、プロトコル結果記録、および QR ストリームモデル
- SoraFS、データ利用可能性、および証明添付ヘルパー

## API 例 {#api-examples}

同じソース改訂からの公開実装には`IrohaSwift/Sources/IrohaSwift`を使用し、テスト済みの使用例には`IrohaSwift/Tests/IrohaSwiftTests`を使用してください。

## 参考文献 {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
