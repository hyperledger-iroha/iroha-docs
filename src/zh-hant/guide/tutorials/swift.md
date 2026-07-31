---
translation_locale: zh-hant
translation_source: /guide/tutorials/swift.md
translation_source_hash: 85cc94399b9892984615bf8a0821a1f30395eb87ec164592ca98fbd9903ef834
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift 和iOS {#swift-and-ios}

其他國家 Swift SDK 在上流工作空間中, `IrohaSwift` Swift
在下面的包 `IrohaSwift/`. 這份文件包含三個圖書館:
產品`IrohaSwift`, `IrohaSwiftMobileTransports`, 及其他
`IrohaSwiftTransferUI`並針對iOS 15+和macOS 12+ Swift 工具 5.9

包裝取決於原住民 `NoritoBridge` 雙重目標.
核准的決議 `../dist/NoritoBridge.xcframework` 在建造之前,
交易或連接加密路徑在
沒有原住民符號加載.

## Swift 包裝經理 {#swift-package-manager}

在一個已被查斷的工作空間上, SwiftPM 在本地
`IrohaSwift/` 包裝目錄.
`Package.swift` 是的 `IrohaSwift`:

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

調整應用程式的路徑.
`examples/ios/ConnectMinimalApp` 這樣的路徑,
`../../IrohaSwift` 必須 `examples/IrohaSwift`.

在解決包之前, 請確保橋在工作空間根位存在:

```bash
cd /path/to/iroha
make bridge-xcframework
```

這樣的產品 `dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift`
提到它是 `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

該代碼基礎也包含 `IrohaSwift/IrohaSwift.podspec`. 這項法案宣稱
`IrohaSwift` 子, Swift 這種情況下, Swift 來自
主要資料庫;本地橋仍必須存在,
交易編碼,非Ed25519簽名和Connect加密.

## 快速開始 {#quickstart}

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

## 請試下 Taira 只有閱讀 {#try-taira-read-only}

開始用平面 HTTP 探測器確認裝置或模擬器能達到
公眾 Taira 目的地:

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

使用相同的方法 `URLSession` 檢查是否有
`https://taira.sora.org/v1/assets/definitions?limit=5` 在你們正在建造的時候,
UI 改為""或"". `IrohaSDK` 只有在
該應用程式將簽名資料從安全存儲中載入,
Taira.

建立和提交交易, `IrohaSDK` 這些人稱為
基於橋支持的交易編碼器:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, 及其他
`UnshieldRequest` 證明法典帳號 IDs 並沒有法典預設
基本58 資產定義 IDs 在簽署之前.

## 預借貸款 {#native-escrow}

Swift 建立市場和匿名的保證指令, Norito JSON
通過的有效載荷 `NativeEscrowInstructionBuilders` 或同等
`IrohaSDK.build*Escrow*` 幫助他們.
[預借本地資產](/zh-hant/blockchain/escrow.md#swift-and-ios) 舉例來說
沒有任何隱私權,

## 簽名 {#signing}

`Keypair` 這是Ed25519的便利 API. 在其他算法中,
`IrohaSDK` 在 `defaultSigningAlgorithm` 及使用 `generateSigningKey()` 或是
`signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

其他國家 `SigningAlgorithm` enum 目前包括Ed25519, secp256k1, BLS 常態
還有許多小的變體, ML-DSA, GOST R 34.10-2012 參數組,以及 SM2. 來自本地地區
需要在Ed25519便利路外提供橋梁支持.

## 聯繫 {#connect}

聯繫客戶端在 Swift 使用加密碼和框架代克
得到支持 `NoritoBridge`:

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

`ConnectSession` 打開和關閉控制器,加密封筒閱讀,
方向鍵,流量控制,事件流量,平衡流量和診斷
這是一份雜誌.

## 目前的覆蓋 {#current-coverage}

其他國家 Swift 目前的來源包括:

- `ToriiClient` HTTP 對帳戶,資產,稱,探索者頁面的輔助人員;
  RWA, 這項計畫的目的是:
  密切的資產,結/運行時間狀態,健康,指數,以及 SSE 流水
- `IrohaSDK` 交易建設者和提交/投票助手,
  燃燒,護衛,沒有護衛, ZK 轉移, ZK 資產登記,元數據
  識別碼要求,多標簽登記和管理指令
- 暫停交易排隊支持 `PendingTransactionQueue` 及其他
  `FilePendingTransactionQueue`
- 帳戶地址和 I105 幫助過的人 `AccountAddress` 及其他 `AccountId`
- 沒有任何問題, ML-DSA, BLS, GOST, 及其他 SM2 標簽表面,使用原住民
  在需要時提供橋梁支持
- 產品使用者:
  預約金
- 聯繫 WebSocket, 圖片,加密碼,會議,排隊,重播和診斷
  助手
- 卡蓋穆沙準備,輸入補充和償還,運營狀況,注意事項,
  聯合組,收件,以及 QR 流量模型
- SoraFS, 資料可用性及證據附加輔助人員

## API 舉例 {#api-examples}

使用 `IrohaSwift/Sources/IrohaSwift` 提供公共實施,
`IrohaSwift/Tests/IrohaSwiftTests` 檢測的使用範例
源改版.

## 源頭參考資料 {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
