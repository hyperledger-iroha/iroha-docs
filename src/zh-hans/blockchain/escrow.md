---
translation_locale: zh-hans
translation_source: /blockchain/escrow.md
translation_source_hash: f3c943ba5d18278382876db7bd7b3b116522811353d4318aafe1023d4b04ce03
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# 产业资产保证 {#native-asset-escrow}

本地保证是对数值资产进行账本管理的保管机制.而不是将资产发送到应用程序拥有的帐户,并依赖应用程序代码来保护该帐户,托管 ISIs 将价值转移到确定性协议保管账户中,并记录托管的生命周期在世界状态.

原生托管适用于市场结算、Aitai 式链下支付协调、里程碑锁定，以及需要账本可见生命周期状态、与证明方绑定的条件释放。

## 概念 {#concepts}

|概念|描述|
| --- | --- |
|`EscrowId`|由调用方选择、封装一个哈希的标识符。它在所有托管记录中必须唯一。|
|`AssetEscrowRecord`|透明的数值资产保证或锁定记录.|
|托管账户|来自链 ID,保证券 ID 和资产定义的确定性协议账户. |
|证据的.|证据哈希可以识别账单,判决,消息,存储表或其他离链的证据.证据的有效载荷本身没有存储在保险记录中. |

透明记录包含卖方,选购者,资产定义,总额,保管账户,生命周期状况,行为类型,剩余金额,选择性释放权限,可选的过期时间印,证据哈希,时间印和可选的解决细节.

担保金额必须是正数资产量,并且必须符合资产定义的数值规范.当担保金或锁存活时,通用资产转让不能耗尽保管账户;以下描述的担保金 ISIs 是担保金的退出路径.

## 市场托管 {#marketplace-escrow}

市场托管协调链上资产释放与链外支付或交货工作流程.

```mermaid
stateDiagram-v2
    [*] --> Open: OpenAssetEscrow
    Open --> Accepted: AcceptAssetEscrow
    Open --> Cancelled: CancelAssetEscrow
    Accepted --> PaymentSent: MarkEscrowPaymentSent
    Accepted --> Cancelled: CancelAssetEscrow
    Accepted --> Disputed: OpenEscrowDispute
    PaymentSent --> Released: ReleaseAssetEscrow
    PaymentSent --> Disputed: OpenEscrowDispute
    Disputed --> Resolved: ResolveEscrowDispute
```

|ISI|谁提出了?|影响|
| --- | --- | --- |
|`OpenAssetEscrow`|卖家|锁定卖方数值资产在协议保管中,并创建一个 `Open`市场记录. |
|`AcceptAssetEscrow`|买家|记录买方并将 `Open`转移到 `Accepted`.卖方不能接受自己的托管. |
|`MarkEscrowPaymentSent`|接受的买家|在买方发送链外支付后,转移`Accepted`到 `PaymentSent`. |
|`ReleaseAssetEscrow`|卖家|转移`PaymentSent`到 `Released`并将全部托管转移给买方. |
|`CancelAssetEscrow`|卖家|转移 `Open`或 `Accepted`到 `Cancelled`并在支付标记之前退款给卖方. |
|`OpenEscrowDispute`|卖家或被接受的买家|移动 `Accepted`或 `PaymentSent`到 `Disputed`,并添加证据. |
|`ResolveEscrowDispute`|在 `CanResolveEscrowDispute` 中的账户|转移`Disputed`到 `Resolved`,并将金额分为买方和卖方. |

争端解决金额必须是非负面的,并且 `buyer_amount + seller_amount`必须等于托管金额.零价值的结算段被允许,但整个分开必须占锁定余额.

### Rust 举例 {#rust-example}

这种例子假设卖方和买方的账户已经存在,资产定义被注册为数值,并且卖方有足够的余额.

```rust
use iroha::{
    client::Client,
    data_model::{
        isi::escrow::{
            AcceptAssetEscrow, MarkEscrowPaymentSent, OpenAssetEscrow,
            ReleaseAssetEscrow,
        },
        prelude::*,
    },
};
use iroha_crypto::Hash;

fn release_marketplace_escrow(
    seller_client: &Client,
    buyer_client: &Client,
    asset_definition_id: AssetDefinitionId,
) -> eyre::Result<()> {
    let escrow_id = EscrowId::new(Hash::new("docs-marketplace-escrow-001"));

    seller_client.submit_blocking(OpenAssetEscrow::with_evidence_hashes(
        escrow_id,
        asset_definition_id,
        Numeric::from(40_u64),
        vec![Hash::new("invoice:2026-001")],
    ))?;

    buyer_client.submit_blocking(AcceptAssetEscrow::new(escrow_id))?;
    buyer_client.submit_blocking(MarkEscrowPaymentSent::new(escrow_id))?;
    seller_client.submit_blocking(ReleaseAssetEscrow::new(escrow_id))?;

    let record = seller_client.query_single(FindAssetEscrowById::new(escrow_id))?;
    assert_eq!(record.status, AssetEscrowStatus::Released);
    assert_eq!(record.remaining_amount, Numeric::zero());

    Ok(())
}
```

## 一般资产锁 {#generic-asset-locks}

资产锁使用相同的保管记录类型,但它们不是买家-卖家的报价.它们锁定了目的地账户的资金,并需要另一个发放权限部门提取资金.

|ISI|谁提出了?|影响|
| --- | --- | --- |
|`OpenAssetLock`|来源账户|锁定正额,记录目的地作为记录买家,并设置状态为 `Locked`. |
|`DrawdownAssetLock`|释放权限账户；未设置释放权限时则为目的地账户|转移部分或全部剩余的监护到目的地.|
|`CancelAssetLock`|锁打开器|取消一个活跃的锁,并退还剩余的金额给打开器. |
|`ExpireAssetLock`|经过最后期限后的任何交易授权主体机构|在过去使用 `expires_at_ms` 的锁期到期,并将剩余的金额退还给打开器. |

`DrawdownAssetLock`在 `Locked`中保持记录,而部分数额仍然存在.当剩余数量达到零时,状态将成为`DrawnDown`,并且记录会关闭.

```rust
use iroha::{
    client::Client,
    data_model::{
        isi::escrow::{CancelAssetLock, DrawdownAssetLock, ExpireAssetLock, OpenAssetLock},
        prelude::*,
    },
};
use iroha_crypto::Hash;

fn drawdown_and_close_asset_locks(
    opener_client: &Client,
    destination_client: &Client,
    release_authority_client: &Client,
    asset_definition_id: AssetDefinitionId,
    destination: AccountId,
    release_authority: AccountId,
) -> eyre::Result<()> {
    let trusted_lock_id = EscrowId::new(Hash::new("docs-asset-lock-trusted"));

    opener_client.submit_blocking(OpenAssetLock::with_options(
        trusted_lock_id,
        asset_definition_id.clone(),
        destination.clone(),
        Numeric::from(40_u64),
        Some(release_authority),
        None,
        vec![Hash::new("milestone-plan-v1")],
    ))?;

    release_authority_client.submit_blocking(DrawdownAssetLock::new(
        trusted_lock_id,
        Numeric::from(15_u64),
    ))?;

    let partially_drawn =
        opener_client.query_single(FindAssetEscrowById::new(trusted_lock_id))?;
    assert_eq!(partially_drawn.status, AssetEscrowStatus::Locked);
    assert_eq!(partially_drawn.remaining_amount, Numeric::from(25_u64));

    opener_client.submit_blocking(CancelAssetLock::new(trusted_lock_id))?;
    let cancelled = opener_client.query_single(FindAssetEscrowById::new(trusted_lock_id))?;
    assert_eq!(cancelled.status, AssetEscrowStatus::Cancelled);

    let expiring_lock_id = EscrowId::new(Hash::new("docs-asset-lock-expiring"));
    opener_client.submit_blocking(OpenAssetLock::with_options(
        expiring_lock_id,
        asset_definition_id,
        destination,
        Numeric::from(10_u64),
        None,
        Some(0),
        Vec::new(),
    ))?;

    destination_client.submit_blocking(ExpireAssetLock::new(expiring_lock_id))?;
    let expired = opener_client.query_single(FindAssetEscrowById::new(expiring_lock_id))?;
    assert_eq!(expired.status, AssetEscrowStatus::Expired);

    Ok(())
}
```

Python 目前为通用锁提供了高级辅助函数：`open_asset_lock`、`drawdown_asset_lock`、`cancel_asset_lock` 和 `expire_asset_lock`。如需在 Python 中使用市场托管和条件托管，请通过该 SDK 的 JSON 逃生通道使用规范的 `InstructionBox` JSON，或通过提供一等托管构建器的 SDK 提交。

## 争议 {#disputes}

一个市场托管可以从 `Accepted`或 `PaymentSent`进入争端.只有注册的卖家或买家才能打开争端.解决需要 `CanResolveEscrowDispute`,无论是直接向解决者账户授予,还是通过角色继承.

```rust
use iroha::{
    client::Client,
    data_model::{
        isi::escrow::{OpenEscrowDispute, ResolveEscrowDispute},
        prelude::*,
    },
};
use iroha_crypto::Hash;
use iroha_executor_data_model::permission::escrow::CanResolveEscrowDispute;

fn resolve_disputed_escrow(
    admin_client: &Client,
    buyer_client: &Client,
    court_client: &Client,
    court: AccountId,
    escrow_id: EscrowId,
) -> eyre::Result<()> {
    admin_client.submit_blocking(Grant::account_permission(
        Permission::from(CanResolveEscrowDispute),
        court,
    ))?;

    buyer_client.submit_blocking(OpenEscrowDispute::with_evidence_hashes(
        escrow_id,
        vec![Hash::new("buyer-payment-receipt")],
    ))?;

    court_client.submit_blocking(ResolveEscrowDispute::with_evidence_hashes(
        escrow_id,
        Numeric::from(30_u64),
        Numeric::from(10_u64),
        vec![Hash::new("court-judgement-001")],
    ))?;

    let record = admin_client.query_single(FindAssetEscrowById::new(escrow_id))?;
    assert_eq!(record.status, AssetEscrowStatus::Resolved);
    assert_eq!(
        record.resolution.as_ref().map(|resolution| resolution.buyer_amount.clone()),
        Some(Numeric::from(30_u64)),
    );

    Ok(())
}
```

## 条件托管 {#conditional-escrow}

条件托管为受益人锁定数值资产，并且只有在所有条件依次通过后才会释放。每个条件都会指定证明方账户、由账本求值的谓词（`Equals` 某个类型化值，或 `QuantityAtMost` 某个上限），以及从 1 开始的序号。可选的账本时间窗口会限定所有证明的时间范围。

| ISI | 调用方 | 效果 |
| --- | --- | --- |
| `OpenConditionalEscrow` | 开立方 | 以不可变条件和绝对到期时间将该金额锁定在协议托管中。 |
| `AttestEscrowCondition` | 该条件的证明方 | 为下一个条件提供 `Bool`、`Text` 或 `Quantity` 值。最后一个条件通过时，托管资产释放给受益人。 |
| `ExpireConditionalEscrow` | 任意账户 | 若托管尚未释放，则在到期后退款给开立方。 |

## SDK 使用 {#sdk-usage}

各个 SDKs 以不同方式提供托管支持。Rust 具有规范的类型化数据模型。Python 目前提供通用资产锁辅助函数。JavaScript 和 TypeScript 使用 Kotodama 托管主机调用。Kotlin/JVM 和 Swift 为市场托管提供类型化载荷构建器。

|SDK|使用这个表面.|范围|
| --- | --- | --- |
| [Rust](#rust-sdk) |`iroha::data_model::isi::escrow`|市场托管、通用锁、条件托管、查询和事件。|
| [Python](#python-asset-locks) |`Instruction.open_asset_lock`、`TransactionDraft.open_asset_lock` 以及客户端 `*_and_wait` 辅助函数|通用资产锁。市场托管和条件托管的辅助函数目前还不是 Python 的一等方法。|
| [JavaScript / TypeScript](#javascript-and-typescript-kotodama) |`compileKotodamaProgram`从 `@iroha/iroha-js/kotodama-compiler` |Kotodama 合约中的托管主机调用。 |
| [Kotlin / JVM](#kotlin-and-jvm) |`org.hyperledger.iroha.sdk.core.model.instructions` 中的 `InstructionTemplate` 类|市场托管的自定义指令模板。|
| [Swift / iOS](#swift-and-ios) |`NativeEscrowInstructionBuilders` 和 `IrohaSDK.build*Escrow*` 辅助函数|市场托管的 Norito JSON 指令载荷。|

下面的例子侧重于指令构建. 账户融资,签名管理和交易提交遵循每个 SDK 的正常流量.

### Rust SDK {#rust-sdk}

当您需要完整的原生覆盖或查询/事件支持时，请使用 Rust SDK。上面的示例展示了如何使用 `iroha::data_model::isi::escrow` 完成市场托管释放、通用锁提取和争议解决。

```rust
use iroha::{
    client::Client,
    data_model::{isi::escrow::OpenAssetEscrow, prelude::*},
};
use iroha_crypto::Hash;

fn open_and_read(
    client: &Client,
    asset_definition_id: AssetDefinitionId,
) -> eyre::Result<AssetEscrowRecord> {
    let escrow_id = EscrowId::new(Hash::new("docs-rust-sdk-escrow"));

    client.submit_blocking(OpenAssetEscrow::new(
        escrow_id,
        asset_definition_id,
        Numeric::from(10_u64),
    ))?;

    client.query_single(FindAssetEscrowById::new(escrow_id))
}
```

### Python 资产锁定 {#python-asset-locks}

Python SDK 将一流的辅助者暴露在通用资产锁中. 使用它们进行里程碑式支付,释放授权主体机构的提款,开户方取消和过期退款.

```python
client.open_asset_lock_and_wait(
    chain_id="dev-chain",
    authority="<source-account-id>",
    private_key_hex="<source-private-key-hex>",
    escrow_id="merchant-lock-001",
    asset_definition_id="<asset-definition-base58>",
    destination="<destination-account-id>",
    amount="2500",
    release_authority="<trusted-release-account-id>",
    expires_at_ms=1_704_000_000_000,
)

client.drawdown_asset_lock_and_wait(
    chain_id="dev-chain",
    authority="<trusted-release-account-id>",
    private_key_hex="<trusted-release-private-key-hex>",
    escrow_id="merchant-lock-001",
    amount="1000",
)

client.expire_asset_lock_and_wait(
    chain_id="dev-chain",
    authority="<any-account-id>",
    private_key_hex="<any-private-key-hex>",
    escrow_id="merchant-lock-001",
)
```

对于双方锁,遗漏 `release_authority`;目的地账户可以提交 `drawdown_asset_lock`.

### JavaScript 和 TypeScript Kotodama {#javascript-and-typescript-kotodama}

其他 JavaScript SDK 目前没有曝光直接的本地托管交易构建者. JavaScript 或 TypeScript 部署的应用 Kotodama 合同,编译托管主机调用 Kotodama 编译器.

原生托管主机调用需要明确的访问提示,因为编译器无法为不透明托管 ISIs 获得更窄的访问集合.在出口入口点上使用呼叫`escrow_*`内置的野生卡指引.

```js
import { compileKotodamaProgram } from "@iroha/iroha-js/kotodama-compiler";

const source = `
seiyaku MarketplaceEscrow {
  meta { abi_version: 1; }

  #[access(read="*", write="*")]
  kotoage fn run() permission(Admin) {
    let asset = asset_definition("62Fk4FPcMuLvW5QjDGNF2a4jAmjM");
    let offer = name("aitai_offer");
    let evidence = norito_bytes("00");

    call escrow_open_offer(offer, asset, 10, evidence);
    call escrow_accept(offer);
    call escrow_mark_payment_sent(offer);
    call escrow_release(offer);
  }
}
`;

const compiled = compileKotodamaProgram(source, {
  sourceName: "escrow.ko",
});

if (compiled.diagnostics.length > 0) {
  throw new Error(compiled.diagnostics.map((item) => item.message).join("\n"));
}
```

处理争议时，请使用 `escrow_open_dispute(offer, evidence)` 和 `escrow_resolve_dispute(offer, buyer_amount, seller_amount, evidence)`。

### Kotlin 和 JVM {#kotlin-and-jvm}

Kotlin/JVM SDK 模型本地托管作为自定义指令模板.每个模板验证了所需的字段,并揭示了交易构造商使用的定律参数地图.

```kotlin
import org.hyperledger.iroha.sdk.core.model.escrow.NativeEscrowPermissions
import org.hyperledger.iroha.sdk.core.model.instructions.AcceptAssetEscrowInstruction
import org.hyperledger.iroha.sdk.core.model.instructions.MarkEscrowPaymentSentInstruction
import org.hyperledger.iroha.sdk.core.model.instructions.OpenAssetEscrowInstruction
import org.hyperledger.iroha.sdk.core.model.instructions.ReleaseAssetEscrowInstruction
import org.hyperledger.iroha.sdk.core.model.instructions.ResolveEscrowDisputeInstruction

val open = OpenAssetEscrowInstruction(
    escrowId = "escrow-hash",
    assetDefinition = "xor#wonderland",
    amount = "42.5",
    evidenceHashes = listOf("invoice-hash"),
)
val accept = AcceptAssetEscrowInstruction("escrow-hash")
val paid = MarkEscrowPaymentSentInstruction("escrow-hash")
val release = ReleaseAssetEscrowInstruction("escrow-hash")
val resolve = ResolveEscrowDisputeInstruction(
    escrowId = "escrow-hash",
    buyerAmount = "30",
    sellerAmount = "12.5",
    evidenceHashes = listOf("judgement-hash"),
)

println(open.arguments)
println(NativeEscrowPermissions.CAN_RESOLVE_ESCROW_DISPUTE)
```

### Swift 和iOS {#swift-and-ios}

Swift SDK 将保证说明构建为 Norito JSON 的有效载荷. 直接使用 `NativeEscrowInstructionBuilders`,或者在您的应用程序已经拥有一个 `IrohaSDK`实例时,拨打对等式的 `IrohaSDK.build*Escrow*`辅助器.

```swift
import IrohaSwift

let open = try NativeEscrowInstructionBuilders.openAssetEscrow(
    escrowId: "escrow-hash",
    assetDefinition: "xor#wonderland",
    amount: "42.5",
    evidenceHashes: ["invoice-hash"]
)
let accept = try NativeEscrowInstructionBuilders.acceptAssetEscrow(
    escrowId: "escrow-hash"
)
let paid = try NativeEscrowInstructionBuilders.markEscrowPaymentSent(
    escrowId: "escrow-hash"
)
let release = try NativeEscrowInstructionBuilders.releaseAssetEscrow(
    escrowId: "escrow-hash"
)
let resolve = try NativeEscrowInstructionBuilders.resolveEscrowDispute(
    escrowId: "escrow-hash",
    buyerAmount: "30",
    sellerAmount: "12.5",
    evidenceHashes: ["judgement-hash"]
)
```

争议解决者权限令牌可通过 `NativeEscrowPermissions.canResolveEscrowDispute` 获取。

## 查询和事件 {#queries-and-events}

使用保证查询状态页面,调整工作和支持工具:

|查询|目的|
| --- | --- |
|`FindAssetEscrowById`|按 `EscrowId`阅读一个透明的托管或锁定.|
|`FindAssetEscrows`|列出透明的托管和锁定记录.|
|`FindAssetEscrowsBySeller`|列出卖家或锁开户打开的记录. |
|`FindAssetEscrowsByBuyer`|列出买方接受的市场保证券或针对目的地锁定. |
|`FindAssetEscrowsByStatus`|在 `AssetEscrowStatus`之前列出记录. |

`EscrowEventFilter` 可以按托管 ID、卖方、买方、状态和事件集掩码订阅透明的原生托管及锁事件。该事件族包括 `Opened`、`Accepted`、`PaymentSent`、`Released`、`Cancelled`、`Expired`、`Disputed` 和 `Resolved`。

## 运营说明 {#operational-notes}

- 存储大型账单,聊天日志,判断或审计包在托管记录之外,并将它们的哈希作为证据.
- 在申请中使用稳定的 `EscrowId`衍生值,以便重新尝试不能为相同的报价创建重复托管.
- 授予 `CanResolveEscrowDispute`仅为经营争端程序的账户或角色.
- 视支付链外验证为应用政策. Iroha 记录保管和生命周期过渡;它不单独验证法定或外部支付轨道.
