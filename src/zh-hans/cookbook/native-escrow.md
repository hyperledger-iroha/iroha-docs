---
translation_locale: zh-hans
translation_source: /cookbook/native-escrow.md
translation_source_hash: 0185b6a341ee90ed6cd52fb9f510549b20592468abe6627d3efa639c3b67d1fd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 产业资产保证 {#native-asset-escrow}

## 结果 {#outcome}

选择市场托管和目标绑定资产锁,用 Rust 或 Python 执行当前输入的生命周期,将每个锁试连接到您实际观察到的剩余金额,并从 JavaScript 编译本地 Kotodama 托管表面.

## 预先条件 {#prerequisites}

- 数字资产定义和拥有足够数量的开放者/卖方.
- 提供资金,单钥匙 I105 每个提交步骤的客户.使用现场授权付费 `fee_payment` 目的,其费用资产与当前相匹配 Taira 管响应;不嵌入资产 ID 根据文件.
- Rust 或 Python SDK 的电流从 Iroha 承诺 `bc7114ed1c7f265a156d2100ff09e851cc95702c`.
- 对于 JavaScript 编译器的例子,Node.js 24加上本地构建的 `@iroha/iroha-js`包及其原生 `iroha_js_host`;遵循[JavaScript SDK 源构建设置](/zh-hans/guide/tutorials/javascript.md#build-from-source).浏览器构建必须提供 `compilerUrl`而不是加载原生主机.
- Taira 必须承认资产转让和保证指令.资产所有者可以使用其资产政策允许的普通生命周期;解决争端需要全球的 `CanResolveEscrowDispute`许可.在缺席必要的公共网络权威时,使用生成的本地网络.

市场托管模式是卖家,买家,链外支付和释放.通用锁定名称一个目的地和可选的单独释放权限;它们支持部分撤销,取消和过期.

## 步骤 {#steps}

### 1. 用 Rust 完成市场保证. {#_1-complete-a-marketplace-escrow-with-rust}

这种函数接收了实类型的 IDs 和客户.它打开了40个单位,让买家接受并标记链外支付,然后让卖方释放监管权.每个提交都会通过 `FeePaymentIntent`命名授权费付款人.

```rust
use eyre::{Result, ensure};
use iroha::{
    client::Client,
    data_model::{
        isi::escrow::{
            AcceptAssetEscrow, MarkEscrowPaymentSent, OpenAssetEscrow,
            ReleaseAssetEscrow,
        },
        prelude::*,
        transaction::FeePaymentIntent,
    },
};
use iroha_crypto::Hash;

fn complete_marketplace_escrow(
    seller: &Client,
    buyer: &Client,
    escrow_id: EscrowId,
    asset_definition: AssetDefinitionId,
) -> Result<AssetEscrowRecord> {
    let fee = FeePaymentIntent::authority(Vec::new(), None);

    seller.submit_blocking(
        OpenAssetEscrow::with_evidence_hashes(
            escrow_id,
            asset_definition,
            Quantity::from(40_u64),
            vec![Hash::new("cookbook-fiat-invoice")],
        ),
        fee.clone(),
    )?;
    buyer.submit_blocking(AcceptAssetEscrow::new(escrow_id), fee.clone())?;
    buyer.submit_blocking(MarkEscrowPaymentSent::new(escrow_id), fee.clone())?;
    seller.submit_blocking(ReleaseAssetEscrow::new(escrow_id), fee)?;

    let record = seller.query_single(FindAssetEscrowById::new(escrow_id))?;
    ensure!(record.status == AssetEscrowStatus::Released);
    Ok(record)
}
```

存储账户由本书管理. 授予正常资产转让代币并不使活跃的存储在保证券生命周期之外可剥离.

### 2. 用 Python 打开并部分绘制通用锁. {#_2-open-and-partially-draw-a-generic-lock-with-python}

发放机构在撤销之前查询已签署的原始记录.通过确切的 `remaining_amount`提供了乐观的同步性:一个陈旧的并行请求被拒绝,而不是两次扣除保证权.

```python
import secrets
import time
from decimal import Decimal


def escrow_status(record):
    status = record["status"]
    if isinstance(status, dict):
        return status.get("status", status.get("kind"))
    return str(status)


def open_and_draw_lock(
    *,
    client,
    chain_id,
    opener,
    opener_private_key,
    release_authority,
    release_private_key,
    destination,
    asset_definition_id,
    fee_payment,
):
    escrow_id = f"cookbook_lock_{secrets.token_hex(12)}"

    client.open_asset_lock_and_wait(
        chain_id=chain_id,
        authority=opener,
        private_key=opener_private_key,
        fee_payment=fee_payment,
        escrow_id=escrow_id,
        asset_definition_id=asset_definition_id,
        destination=destination,
        amount="10",
        release_authority=release_authority,
        expires_at_ms=int(time.time() * 1000) + 3_600_000,
        wait=True,
    )

    before = client.get_asset_escrow(
        escrow_id=escrow_id,
        authority=release_authority,
        private_key=release_private_key,
    )
    client.drawdown_asset_lock_and_wait(
        chain_id=chain_id,
        authority=release_authority,
        private_key=release_private_key,
        fee_payment=fee_payment,
        escrow_id=escrow_id,
        amount="4",
        expected_remaining_amount=before["remaining_amount"],
        wait=True,
    )
    after = client.get_asset_escrow(
        escrow_id=escrow_id,
        authority=release_authority,
        private_key=release_private_key,
    )

    assert escrow_status(before) == "Locked"
    assert Decimal(str(before["remaining_amount"])) == Decimal("10")
    assert escrow_status(after) == "Locked"
    assert Decimal(str(after["remaining_amount"])) == Decimal("6")
    return escrow_id, after
```

当 Python SDK 被遗漏时,可以自动查询`expected_remaining_amount`,但通过观察值使签署的经济先决条件可见于应用程序代码中.

对于 Rust 锁流,电流构造器还需要观察到的数量:

```rust
let before = opener.query_single(FindAssetEscrowById::new(lock_id))?;
release_authority.submit_blocking(
    DrawdownAssetLock::new(
        lock_id,
        Quantity::from(4_u64),
        before.remaining_amount,
    ),
    FeePaymentIntent::authority(Vec::new(), None),
)?;

let current = opener.query_single(FindAssetEscrowById::new(lock_id))?;
opener.submit_blocking(
    CancelAssetLock::new(lock_id, current.remaining_amount),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

`DrawdownAssetLock::new`取三个值; `CancelAssetLock::new`取两个. 省略预期剩余数量描述了一个较旧的,不安全的呼叫形式.

### 3. 从 JavaScript 编译 Kotodama 保证金表面. {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript 不需要发明未类型的本土指令.当前的编译器将内置的账本托管暴露在 Kotodama;部署和调用然后遵循[构建并部署智能合同](./smart-contracts.md).

保存为 `native_escrow.ko`:

```kotodama
seiyaku NativeEscrowAitai {
    error enum EscrowError {
        NonPositiveAmount = 1,
    }

    kotoage fn open_offer(
        Name offer,
        AssetDefinitionId asset_definition,
        quantity amount
    ) authorize("Admin") {
        require(amount > 0, EscrowError::NonPositiveAmount);
        ledger::escrow::open_offer(
            offer: offer,
            asset_definition: asset_definition,
            amount: amount,
        );
    }
}
```

以 `compile-native-escrow.mjs`保存下文,并使用它从 Node.js 编译出那个精确的来源:

```js
import { readFile } from 'node:fs/promises'
import { compileKotodamaProgram } from '@iroha/iroha-js/kotodama-compiler'

const source = await readFile('./native_escrow.ko', 'utf8')

const result = await compileKotodamaProgram(source, {
  sourceName: 'native_escrow.ko',
})
if (!result.ok) {
  throw new Error(JSON.stringify(result.diagnostics, null, 2))
}
console.log({
  codeHashHex: result.output.codeHashHex,
  entrypoints: result.output.manifest.entrypoints.map(({ name }) => name),
})
```

运行从前列条件中所描述的源构建包装环境:

```bash
node ./compile-native-escrow.mjs
```

## 验证 {#verify}

对于市场托管,查询 `FindAssetEscrowById` 和双方发布后的资产持有.记录必须是`Released`,命名接受买家,并没有显示剩余保管权.对上述 Python 锁来说,保留返回的 ID 并重复签署的查询:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

也查询目的地资产持有量,并确认其增长了4个单位. 没有保证记录和目的地后状态的交易收据是不完整的验证.

## 解决问题 {#troubleshooting}

- `Not permitted`在开放时通常意味着该机构无法将选定的资产转移到保管中.争端解决有单独的全球 `CanResolveEscrowDispute`门口.
- `expected remaining amount`拒绝是乐观与竞争的冲突.重新查询记录,决定是否打算另一个撤销/取消,并且只签署新指示,如果新的状态是可接受的.
- 只有配置的释放权威才能绘制一个值得信赖的锁.目的地不能仅仅因为它将收到资金而释放.
- 市场发布仅在接受和支付发送状态后才有效;取消限于更早的生命周期状态.
- 截止日期使用权威的账本时间. 不要把当地的墙钟截止时间视为证明`ExpireAssetLock`将通过.
- 收费失效属于提交该生命周期步骤的当事人.基金购买者,卖方/开放者和独立释放权限在 Taira.

## 来源及相关文件 {#source-and-related-docs}

- [在固定承诺](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/isi/escrow.rs)上,本地保证指令模型
- [在固定的承诺中进行本地保证券整合测试](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/native_escrow.rs)
- [Python 托管客户的方法在固定承诺](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama 本地保证券样本在固定承诺](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [国产资产保证金](/zh-hans/blockchain/escrow.md)
- [性资产](./fungible-assets.md)
- [许可证和角色](./permissions-and-roles.md)
