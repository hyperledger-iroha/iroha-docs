---
translation_locale: zh-hans
translation_source: /guide/tutorials/swift.md
translation_source_hash: a218239d9f4e14a513b895267b9b20b21a5fba021b0b97c013dab7e5be50a97f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift 和iOS {#swift-and-ios}

上游工作区提供的 Swift SDK 是 `IrohaSwift/` 下的 `IrohaSwift` Swift 包。其包清单定义了三个库产品：`IrohaSwift`、`IrohaSwiftMobileTransports` 和 `IrohaSwiftTransferUI`，并使用 Swift 5.9 工具面向 iOS 15+ 和 macOS 12+。

该包依赖原生的 `NoritoBridge` 二进制目标.包解析在构建之前验证`../dist/NoritoBridge.xcframework`,当本地符号不加载时,交易或连接加密路径会抛出桥式不可用的错误.

## Swift 包装经理 {#swift-package-manager}

在使用已注入的工作空间时,在本地 `IrohaSwift/`包目录中点 SwiftPM. `Package.swift`所使用的包身份是`IrohaSwift`:

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

调整应用程序的路径.不要复制当前的 `examples/ios/ConnectMinimalApp`路径,该形式将 `../../IrohaSwift` 分解为 `examples/IrohaSwift`.

在解决包之前,请确保桥梁存在于工作空间根点:

```bash
cd /path/to/iroha
make bridge-xcframework
```

这产生`dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift`将其称为`../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

该代码库还包含 `IrohaSwift/IrohaSwift.podspec`. 声明: `IrohaSwift` 子, Swift 5,9和iOS 15. Swift 来自主存储库中的来源;原始桥梁仍然必须存在并用于交易编码,非Ed25519签名和Connect加密.

## 快速开始 {#quickstart}

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

## 试看 Taira 只阅读 {#try-taira-read-only}

开始一个简单的 HTTP 探测器,以确认设备或模拟器可以达到公众的 Taira 端点:

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

在构建 UI 时,使用相同的 `URLSession` 检查对 `https://taira.sora.org/v1/assets/definitions?limit=5` 和重新尝试行为. 切换到 `IrohaSDK` 仅在应用程序从安全存储中加载签名材料后提交辅助员,并且账户在 Taira 上获得资金.

为了构建和提交交易,使用 `IrohaSDK`辅助员. 这些称为本地桥接支持的交易编码器:

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

`TransferRequest`、`MintRequest`、`BurnRequest`、`ShieldRequest` 和 `UnshieldRequest` 会在签名前验证规范账户 IDs 和规范的无前缀 Base58 资产定义 IDs。

## 产业保险 {#native-escrow}

Swift 通过 `NativeEscrowInstructionBuilders` 或等效的 `IrohaSDK.build*Escrow*` 辅助程序，将市场和匿名托管指令构建为 Norito JSON 负载。有关示例、匿名证明字段和争议解决者权限令牌，请参阅[原生资产托管](/zh-hans/blockchain/escrow.md#swift-and-ios)。

## 签字 {#signing}

`Keypair`是Ed25519方便性 API.对于其他算法来说,用 `defaultSigningAlgorithm`构建一个 `IrohaSDK`,并使用 `generateSigningKey()`或 `signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

目前`SigningAlgorithm` enum包括Ed25519, secp256k1, BLS 正常和小型变体, ML-DSA, GOST R 34.10-2012参数组,以及 SM2.在Ed25519便利路径之外,需要原生桥梁支持.

## 连接 {#connect}

连接客户端在 Swift 源中实现,加密和框架代码由 `NoritoBridge`支持:

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

`ConnectSession`处理打开和关闭控制,加密封装阅读,方向键,流量控制,事件流,余额流和诊断日志.

## 目前覆盖范围 {#current-coverage}

目前 Swift 来源包括:

- `ToriiClient` HTTP 对账户,资产,别名,探索者页面, RWA,合同,多签证,管理,订阅,数据可用性,机密资产,节点/运行时状态,健康,指标和 SSE 流的辅助员
- `IrohaSDK`交易构建者和提交/投票助手转移、铸造、销毁,盾牌,无盾牌,ZK 转移, ZK 资产登记,元数据,识别索赔,多签名登记以及管理说明
- 通过 `PendingTransactionQueue`和 `FilePendingTransactionQueue`等待的交易队列支持
- 通过 `AccountAddress`和 `AccountId`的账户地址和 I105 助手.
- Ed25519, secp256k1, ML-DSA, BLS,GOST 和 SM2 的签字表面,在需要时具有原生桥梁支
- 用于市场型和匿名托管的原生托管指令载荷构建器
- 连接 WebSocket,框架,加密,会议,排队,重播和诊断辅助器
- 卡盖穆沙准备,打字补充和赎回,运营状态,笔记,对等节点捆绑,收据和 QR 流模型
- SoraFS,数据可用性和验证附件辅助器

## API 举例 {#api-examples}

用 `IrohaSwift/Sources/IrohaSwift`用于公开实施和`IrohaSwift/Tests/IrohaSwiftTests`用于相同来源修订的测试使用示例.

## 来源引用 {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
