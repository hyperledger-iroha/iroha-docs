---
translation_locale: zh-hant
translation_source: /guide/tutorials/swift.md
translation_source_hash: 85cc94399b9892984615bf8a0821a1f30395eb87ec164592ca98fbd9903ef834
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift 和iOS {#swift-and-ios}

其他 Swift SDK 由上游工作空間發送的是 `IrohaSwift` Swift 下面的包裝 `IrohaSwift/`. 它的包郵說明書定義了三個圖書館產品`IrohaSwift`, `IrohaSwiftMobileTransports`, 和 `IrohaSwiftTransferUI`並且針對iOS 15+和macOS 12+ Swift 工具 5.9.

包 depends on the native `NoritoBridge` binary target. 包分辨率在構建之前驗證`../dist/NoritoBridge.xcframework`,當本地符號不加載時,交易或連接加密路徑會拋出橋式不可用的錯誤.

## Swift 包裝經理 {#swift-package-manager}

在使用已注入的工作空間時,在本地 `IrohaSwift/`包目錄中點 SwiftPM. `Package.swift`所使用的包身份是`IrohaSwift`:

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

調整應用程序的路徑.不要複製當前的 `examples/ios/ConnectMinimalApp`路徑,該表格將 `../../IrohaSwift` 分解爲 `examples/IrohaSwift`.

在解決包之前,請確保橋樑存在於工作空間根點:

```bash
cd /path/to/iroha
make bridge-xcframework
```

這產生`dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift`將其稱爲`../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

該代碼庫還包含 `IrohaSwift/IrohaSwift.podspec`. 聲明: `IrohaSwift` 子, Swift 5,9和iOS 15. Swift 來自主存儲庫中的來源;原始橋樑仍然必須存在並用於交易編碼,非Ed25519簽名和Connect加密.

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

## 試看 Taira 只閱讀 {#try-taira-read-only}

開始一個簡單的 HTTP 探測器,以確認設備或模擬器可以達到公衆的 Taira 終點:

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

在構建 UI 時,使用相同的 `URLSession` 檢查對 `https://taira.sora.org/v1/assets/definitions?limit=5` 和重新嘗試行爲. 切換到 `IrohaSDK` 僅在應用程序從安全存儲中加載簽名材料後提交輔助員,並且賬戶在 Taira 上獲得資金.

爲了構建和提交交易,使用 `IrohaSDK`輔助員. 這些稱爲本地橋接支持的交易編碼器:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, 和 `UnshieldRequest` 驗證法典賬戶 IDs 基本資產的定義 IDs 在簽署之前.

## 產業保險 {#native-escrow}

Swift 通過 `NativeEscrowInstructionBuilders`或同等 `IrohaSDK.build*Escrow*`助手構建市場和匿名保證指令,作爲 Norito JSON 的有效載荷.參見 [本土資產保證](/zh-hant/blockchain/escrow.md#swift-and-ios)爲示例,匿名證明字段和爭端解決權限代幣.

## 簽字 {#signing}

`Keypair`是Ed25519方便性 API.對於其他算法來說,用 `defaultSigningAlgorithm`構建一個 `IrohaSDK`,並使用 `generateSigningKey()`或 `signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

目前`SigningAlgorithm` enum包括Ed25519, secp256k1, BLS 正常和小型變體, ML-DSA, GOST R 34.10-2012參數組,以及 SM2.在Ed25519便利路徑之外,需要原生橋樑支持.

## 連接 {#connect}

連接客戶端在 Swift 源中實現,加密和框架代碼由 `NoritoBridge`支持:

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

`ConnectSession`處理打開和關閉控制,加密封筒閱讀,方向鍵,流量控制,事件流,平衡流和診斷日誌.

## 目前覆蓋範圍 {#current-coverage}

目前 Swift 來源包括:

- `ToriiClient` HTTP 對賬戶,資產,姓氏,探索者頁面, RWA,合同,多簽證,管理,訂閱,數據可用性,機密資產,節點/運行時間狀態,健康,指標和 SSE 流的輔助員
- `IrohaSDK`交易構建者和提交/投票助手轉移,硬幣,燒傷,盾牌,無盾牌,ZK 轉移, ZK 資產登記,元數據,識別索賠,多簽名登記以及管理說明
- 通過 `PendingTransactionQueue`和 `FilePendingTransactionQueue`等待的交易隊列支持
- 通過 `AccountAddress`和 `AccountId`的賬戶地址和 I105 助手.
- Ed25519, secp256k1, ML-DSA, BLS,GOST 和 SM2 的簽字表面,在需要時具有原生橋樑支
- 產地保證指令用貨物構建商和匿名保證
- 連接 WebSocket,框架,加密,會議,排隊,重播和診斷輔助器
- 卡蓋穆沙準備,打字補充和贖回,運營狀態,筆記,同行捆綁,收據和 QR 流模型
- SoraFS,數據可用性和驗證附件輔助器

## API 舉例 {#api-examples}

用 `IrohaSwift/Sources/IrohaSwift`用於公開實施和`IrohaSwift/Tests/IrohaSwiftTests`用於相同來源修訂的測試使用示例.

## 來源引用 {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
