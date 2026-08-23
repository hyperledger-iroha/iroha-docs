---
translation_locale: ja
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift およびiOS {#swift-and-ios}

労働組合 Swift SDK アウトストリームワークスペースで運送されるのは `IrohaSwift` Swift 下のパッケージ `IrohaSwift/`. そのパッケージマニストでは3つの図書館製品が定義されています`IrohaSwift`, `IrohaSwiftMobileTransports`, そして `IrohaSwiftTransferUI`およびiOS 15+とmacOS 12+を対象とする Swift 道具 5.9.

パッケージはネイティブ `NoritoBridge` バイナリーターゲットに依存します.パッケージ解像度は構築前に `../dist/NoritoBridge.xcframework` を有効化し,ネイティブシンボルがロードされていない場合,トランザクションまたはConnect暗号経路はブリッジ利用できないエラーを投げ出します.

## Swift パッケージ管理者 {#swift-package-manager}

チェックアウトされたワークスペースに対して開発する場合,地元の `IrohaSwift/` パッケージディレクトリに SwiftPM を点灯します. `Package.swift` によって使用されるパケットアイデンティティは `IrohaSwift` です:

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

アプリのパスを変更する.現在の `examples/ios/ConnectMinimalApp` パスをコピーしないでください.そのマニフェストは `../../IrohaSwift` を `examples/IrohaSwift` に解決します.

パッケージを解く前に,ブリッジがワークスペースのルーツに存在していることを確認してください:

```bash
cd /path/to/iroha
make bridge-xcframework
```

これは `dist/NoritoBridge.xcframework`を生成し, `IrohaSwift/Package.swift` は `../dist/NoritoBridge.xcframework` と参照する.

## CocoaPods {#cocoapods}

また,コードベースには `IrohaSwift/IrohaSwift.podspec`. 宣言する `IrohaSwift` カプセル Swift 5.9とiOS 15で,podspecが引っ張ります Swift メインリポジトリからの情報源;ネイティブブリッジはまだ存在しなければならない 取引暗号化,非Ed25519署名,およびConnect暗号にリンクされています.

## スピードスタート {#quickstart}

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

## Taira 試聴する {#try-taira-read-only}

デバイスまたはシミュレーターが公共の Taira エンドポイントに到達できることを確認するために,シンプルな HTTP 探査機から開始します:

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

同じ使い方 `URLSession` チェック `https://taira.sora.org/v1/assets/definitions?limit=5` あなたが建てる間に UI 行動に切り替える `IrohaSDK` アップが安全なストレージから署名資料をアップロードし,アカウントが資金調達された後のみ Taira.

トランザクションを作成し,送信するには `IrohaSDK` ヘルパーを使用します.これらはネイティブブリッジサポートのトランザクションエンコードを呼びます:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, そして `UnshieldRequest` カノニカル・アカウントを検証する IDs また,法典的な未定のBase58資産定義 IDs 署名する前に

## 国産エスクロー {#native-escrow}

Swift 市場と匿名のエスクロー指示を構築する Norito JSON 経路での有用荷物 `NativeEscrowInstructionBuilders` またはそれと同等 `IrohaSDK.build*Escrow*` 助手者 [国産資産のエスクロー](/ja/blockchain/escrow.md#swift-and-ios) 例として,匿名証明フィールドと紛争解決許可トークン.

## 署名 {#signing}

`Keypair` エド25519の便利性です API. 他のアルゴリズムでは, `IrohaSDK` と `defaultSigningAlgorithm` そして使用 `generateSigningKey()` または `signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

`SigningAlgorithm` enum は現在,Ed25519, secp256k1, BLS 正常および小変数, ML-DSA, GOST R 34.10-2012パラメータセット,および SM2 を含む. Ed25519便利経路の外ではネイティブブリッジサポートが必要である.

## 接続する {#connect}

Connect クライアントは Swift ソースで実装され, `NoritoBridge` によってサポートされている暗号およびフレームコデックがあります.

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

`ConnectSession` は開閉制御,暗号化された封筒読み取り,方向鍵,流れ制御,イベントストリーム,バランスストリーム,診断ジャーナルを操作します

## 現在 の 対象 {#current-coverage}

Swift ソースは,現在以下のものを含む.

- `ToriiClient` HTTP アカウント,資産,ニックネーム,探索者ページ, RWA,契約,マルチシグ,ガバナンス,サブスクリプション,データ利用可能性,機密資産,ノード/ランタイム状態,健康,メトリック,および SSE ストリーム
- `IrohaSDK`トランザクション作成者および移転,ミント,バーン,シールド,アンシールド, ZK 移転, ZK 資産登録,メタデータ,識別請求,マルチシグ登録,ガバナンス指示の提出/投票援助者
- `PendingTransactionQueue`と `FilePendingTransactionQueue`経由で取引のキューサポートを待機している
- `AccountAddress`と `AccountId`経由で口座アドレスおよび I105 助手
- Ed25519, secp256k1, ML-DSA, BLS, GOST,および SM2 の署名表面,必要に応じてネイティブブリッジサポートで
- 市場用のネイティブエスクロー指示用荷物の構築者および匿名エスクロー
- 接続 WebSocket,フレーム,暗号,セッション,キュー,リプレイ,および診断ヘルパー
- カゲムシャの準備,入力された補充および償還,運行状態,メモ,ピアバンドル,領収書,および QR ストリームモデル
- SoraFS,データ可用性,証明添付補助者

## API 例 {#api-examples}

`IrohaSwift/Sources/IrohaSwift` を公共の実装で使用し,同じソース修正からテストされた利用例では `IrohaSwift/Tests/IrohaSwiftTests` を使用する.

## ソース参照 {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
