---
translation_locale: zh-hans
translation_source: /guide/tutorials/swift.md
translation_source_hash: 85cc94399b9892984615bf8a0821a1f30395eb87ec164592ca98fbd9903ef834
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Swift 和iOS {#swift-and-ios}

其他 Swift SDK 运输由上游工作空间是 `IrohaSwift` Swift
下面的包 `IrohaSwift/`. 它的包表定义了三个库
产品`IrohaSwift`, `IrohaSwiftMobileTransports`, 并且
`IrohaSwiftTransferUI`并且针对iOS 15+和macOS 12+ Swift 工具 5.9.

包裹取决于本地人 `NoritoBridge` 双重目标.
决议验证 `../dist/NoritoBridge.xcframework` 在建造之前,
交易或连接加密路径抛出桥式不可用错误
没有加载本土的符号.

## Swift 包装经理 {#swift-package-manager}

在一个已注入的工作空间中, SwiftPM 在本地
`IrohaSwift/` 包装目录.
`Package.swift` 是 `IrohaSwift`:

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

调整应用程序的路径.
`examples/ios/ConnectMinimalApp` 路径如今;那个表达解决
`../../IrohaSwift` 在 `examples/IrohaSwift`.

在解决包之前,请确保桥梁存在于工作空间根:

```bash
cd /path/to/iroha
make bridge-xcframework
```

这产生了 `dist/NoritoBridge.xcframework`; `IrohaSwift/Package.swift`
称之为 `../dist/NoritoBridge.xcframework`.

## CocoaPods {#cocoapods}

该代码库还包含 `IrohaSwift/IrohaSwift.podspec`. 声明:
`IrohaSwift` 子, Swift 5.9 和iOS 15. Swift 来自
主存储库;本地桥仍然必须存在,并连接到
交易编码,非Ed25519签字和Connect加密.

## 快速启动 {#quickstart}

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

## 试着 Taira 只有阅读 {#try-taira-read-only}

开始一个平坦的 HTTP 探测器确认设备或模拟器可以到达
公众 Taira 终点:

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

使用相同的方法 `URLSession` 检查
`https://taira.sora.org/v1/assets/definitions?limit=5` 在你们建造的时候,
UI 然后再尝试行为. `IrohaSDK` 只有在
应用程序从安全存储中加载签名材料,账户是通过
Taira.

为了构建和提交交易, `IrohaSDK` 这些叫做
原生桥梁支持的交易编码器:

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

`TransferRequest`, `MintRequest`, `BurnRequest`, `ShieldRequest`, 并且
`UnshieldRequest` 验证法典帐户 IDs 和正文无序
基58资产定义 IDs 在签署之前.

## 产业保险 {#native-escrow}

Swift 建立市场和匿名保证指令 Norito JSON
通过的有效载荷 `NativeEscrowInstructionBuilders` 或同等
`IrohaSDK.build*Escrow*` 你知道吗?
[产业资产抵押](/zh-hans/blockchain/escrow.md#swift-and-ios) 举例来说,
无名证据字段,以及争端解决权限符号.

## 签字 {#signing}

`Keypair` 是Ed25519的便利性 API. 对于其他算法,构建一个
`IrohaSDK` 在 `defaultSigningAlgorithm` 和使用 `generateSigningKey()` 或
`signingKey(fromSeed:)`:

```swift
let pqSdk = IrohaSDK(
    baseURL: torii.baseURL,
    defaultSigningAlgorithm: .mlDsa
)
let signingKey = try pqSdk.generateSigningKey()
```

其他 `SigningAlgorithm` enum 目前包括Ed25519, secp256k1, BLS 正常
和小的变体, ML-DSA, GOST R 34.10-2012参数组,以及 SM2. 原住民
需要在Ed25519方便路径外提供桥梁支持.

## 连接 {#connect}

连接客户端在 Swift 来源,使用加密和框架编码
支持的 `NoritoBridge`:

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

`ConnectSession` 开放和关闭控制器,加密封筒阅读,
方向键,流量控制,事件流,平衡流和诊断
报纸.

## 目前的覆盖范围 {#current-coverage}

其他 Swift 目前来源包括:

- `ToriiClient` HTTP 账户,资产,号,探险页面的助手
  RWA, 合同,多签证,治理,订阅,数据可用性
  机器人运行情况,健康状况,指标和 SSE 河流
- `IrohaSDK` 交易构建者和转让提交/投票助手,金,
  燃烧,护卫,无护卫, ZK 转移, ZK 资产登记,元数据
  标识索赔,多签名注册和管理说明
- 通过 `PendingTransactionQueue` 并且
  `FilePendingTransactionQueue`
- 账户地址和 I105 通过的助手 `AccountAddress` 并且 `AccountId`
- 编辑:Ed25519, secp256k1, ML-DSA, BLS, GOST, 并且 SM2 标签表面,原产地
  在需要时提供桥梁支持
- 产业保证指令用货物构建商和匿名
  托管
- 连接 WebSocket, 框架,加密,会议,排队,重播和诊断
  助手
- 卡盖穆萨备用,打字补充和赎回,运营状态,说明
  同类包,收据和 QR 流量模型
- SoraFS, 数据可用性和证明附件辅助人员

## API 举例 {#api-examples}

使用 `IrohaSwift/Sources/IrohaSwift` 公共实施和
`IrohaSwift/Tests/IrohaSwiftTests` 对于相同的测试使用例
来源修改.

## 来源引用 {#source-references}

- `IrohaSwift/Package.swift`
- `IrohaSwift/IrohaSwift.podspec`
- `IrohaSwift/Sources/IrohaSwift/ToriiClient.swift`
- `IrohaSwift/Sources/IrohaSwift/TxBuilder.swift`
- `IrohaSwift/Sources/IrohaSwift/TransactionEncoder.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectClient.swift`
- `IrohaSwift/Sources/IrohaSwift/ConnectSession.swift`
