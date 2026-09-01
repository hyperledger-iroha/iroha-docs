---
translation_locale: zh-hant
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift 和iOS {#swift-and-ios}

上游工作空間提供的 Swift SDK 是 `IrohaSwift/` 下的 `IrohaSwift` Swift 套件。其套件 manifest 定義三個函式庫產品：`IrohaSwift`、`IrohaSwiftMobileTransports` 和 `IrohaSwiftTransferUI`，並以 Swift 5.9 工具支援 iOS 15+ 與 macOS 12+。

此套件依賴原生的 `NoritoBridge` 二進位目標.套件解析在構建之前驗證`../dist/NoritoBridge.xcframework`,當本地符號不載入時,交易或連線加密路徑會丟擲橋式不可用的錯誤.

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

調整應用程式的路徑.不要複製當前的 `examples/ios/ConnectMinimalApp`路徑,該形式將 `../../IrohaSwift` 分解為 `examples/IrohaSwift`.

在解決包之前,請確保橋樑存在於工作空間根點:

```bash
cd /path/to/iroha
make bridge-xcframework
```

這產生`dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift`將其稱為`../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

該程式碼庫還包含 `IrohaSwift/IrohaSwift.podspec`. 宣告: `IrohaSwift` 子, Swift 5,9和iOS 15. Swift 來自主儲存庫中的來源;原始橋樑仍然必須存在並用於交易編碼,非Ed25519簽名和Connect加密.

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

開始一個簡單的 HTTP 探測器,以確認裝置或模擬器可以達到公眾的 Taira 端點:

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

在構建 UI 時,使用相同的 `URLSession` 檢查對 `https://taira.sora.org/v1/assets/definitions?limit=5` 和重新嘗試行為. 切換到 `IrohaSDK` 僅在應用程式從安全儲存中載入簽名材料後提交輔助員,並且帳戶在 Taira 上獲得資金.

為了構建和提交交易,使用 `IrohaSDK`輔助員. 這些稱為本地橋接支援的交易編碼器:

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

`TransferRequest`、`MintRequest`、`BurnRequest`、`ShieldRequest` 和 `UnshieldRequest` 會在簽署前驗證規範帳戶 IDs 和規範且無前置詞的 Base58 資產定義 IDs。

## 產業保險 {#native-escrow}

Swift 透過 `NativeEscrowInstructionBuilders` 或等效的 `IrohaSDK.build*Escrow*` 輔助程式，將市場和匿名託管指令建置為 Norito JSON 負載。有關範例、匿名證明欄位和爭議解決者許可權權杖，請參閱[原生資產託管](/zh-hant/blockchain/escrow.md#swift-and-ios)。

## 簽字 {#signing}

`Keypair`是Ed25519方便性 API.對於其他演算法來說,用 `defaultSigningAlgorithm`構建一個 `IrohaSDK`,並使用 `generateSigningKey()`或 `signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

目前`SigningAlgorithm` enum包括Ed25519, secp256k1, BLS 正常和小型變體, ML-DSA, GOST R 34.10-2012引數組,以及 SM2.在Ed25519便利路徑之外,需要原生橋樑支援.

## 連線 {#connect}

連線客戶端在 Swift 源中實現,加密和框架程式碼由 `NoritoBridge`支援:

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

`ConnectSession`處理開啟和關閉控制,加密封裝閱讀,方向鍵,流量控制,事件流,餘額流和診斷日誌.

## 目前覆蓋範圍 {#current-coverage}

目前 Swift 來源包括:

- `ToriiClient` HTTP 對帳戶,資產,別名,探索者頁面, RWA,合同,多簽證,管理,訂閱,資料可用性,機密資產,節點/執行階段狀態,健康,指標和 SSE 流的輔助員
- `IrohaSDK`交易構建者和提交/投票助手轉移、鑄造、銷毀,盾牌,無盾牌,ZK 轉移, ZK 資產登記,後設資料,識別索賠,多簽名登記以及管理說明
- 透過 `PendingTransactionQueue`和 `FilePendingTransactionQueue`等待的交易佇列支援
- 透過 `AccountAddress`和 `AccountId`的帳戶地址和 I105 助手.
- Ed25519, secp256k1, ML-DSA, BLS,GOST 和 SM2 的簽字表面,在需要時具有原生橋樑支
- 用於市場型和匿名託管的原生託管指令承載資料建構器
- 連線 WebSocket,框架,加密,會議,排隊,重播和診斷輔助器
- 卡蓋穆沙準備,打字補充和贖回,運營狀態,筆記,對等節點捆綁,收據和 QR 流模型
- SoraFS,資料可用性和驗證附件輔助器

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
