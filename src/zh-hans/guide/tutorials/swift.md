---
translation_locale: zh-hans
translation_source: /guide/tutorials/swift.md
translation_source_hash: 753ce1b5e0de4eae56b38e77962566b23fee56d4662a432a7bbe6ea807261422
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
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

请根据您的应用调整路径。`examples/ios/ConnectMinimalApp/Package.swift` 使用相对路径 `../../../IrohaSwift` 展示了相同的依赖项。

在解析软件包之前，请先构建当前的原生桥接库。对于本地开发和测试，请在工作区根目录运行：

```bash
cd /path/to/iroha
python3.12 scripts/test_swift_local.py
```

发布构建通过 `make bridge-xcframework` 生成 `dist/NoritoBridge.xcframework`，该命令需要 `SOURCE_DATE_EPOCH`、`NORITO_BRIDGE_OUT_DIR`、`NORITO_BRIDGE_BUILD_DIR`、`NORITO_BRIDGE_ARCHIVE_OUTPUT` 和 `MOBILE_SDK_CARGO_LOCKFILE`。`IrohaSwift/Package.swift` 以 `../dist/NoritoBridge.xcframework` 引用该桥接库。

## 快速开始 {#quickstart}

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

`TransferRequest`、`MintRequest` 和 `BurnRequest` 会在签名前验证规范账户 IDs 和规范的无前缀 Base58 资产定义 IDs。

## 产业保险 {#native-escrow}

Swift 通过 `NativeEscrowInstructionBuilders` 或等效的 `IrohaSDK.build*Escrow*` 辅助程序，将市场托管指令构建为 Norito JSON 负载。有关示例和争议解决者权限令牌，请参阅[原生资产托管](/zh-hans/blockchain/escrow.md#swift-and-ios)。

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

let keyPair = try ConnectCrypto.generateKeyPair()
let session = try ConnectSession(
    networkID: try NetworkId(literal: "<exact-network-id>"),
    appPublicKey: keyPair.publicKey,
    nonce: nonce,
    relayToken: "<token>",
    client: client
)
```

`ConnectSession`处理打开和关闭控制,加密封装阅读,方向键,流量控制,事件流,余额流和诊断日志.

## 目前覆盖范围 {#current-coverage}

目前 Swift 来源包括:

- `ToriiClient` HTTP 对账户,资产,别名,探索者页面, RWA,合同,多签证,管理,订阅,数据可用性,机密资产,节点/运行时状态,健康,指标和 SSE 流的辅助员
- `IrohaSDK` 的交易构建器和提交/轮询辅助函数，适用于转账、铸造、销毁、ZK 资产注册、元数据、标识符申领、多重签名注册、合约部署和治理投票
- 通过 `PendingTransactionQueue`和 `FilePendingTransactionQueue`等待的交易队列支持
- 通过 `AccountAddress`和 `AccountId`的账户地址和 I105 助手.
- Ed25519, secp256k1, ML-DSA, BLS,GOST 和 SM2 的签字表面,在需要时具有原生桥梁支
- 用于市场型和匿名托管的原生托管指令载荷构建器
- 连接 WebSocket,框架,加密,会议,排队,重播和诊断辅助器
- KAGEMUSHA V1 传输格式辅助方法，以及供原生钱包 Advance 提供者、注册、恢复和获准交换调用使用的 iPhone 平台适配器
- SoraFS,数据可用性和验证附件辅助器

## API 举例 {#api-examples}

用 `IrohaSwift/Sources/IrohaSwift`用于公开实施和`IrohaSwift/Tests/IrohaSwiftTests`用于相同来源修订的测试使用示例.

## 来源引用 {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
