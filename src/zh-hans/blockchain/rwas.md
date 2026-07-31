---
translation_locale: zh-hans
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 现实世界资产 {#real-world-assets}

现实资产 (RWAs) 拥有或控制的外链资产模型
在链上追踪. Iroha, 一个 RWA 是一个注册的账本,
产生的标识符,所有者账户,数量,业务元数据
来源和可选的生命周期控制.

RWAs 与数值资产余额不同:

- 数字资产是账户持有的可存余额
- 一个 NFT 是一个独一无二的连锁记录
- 一个 RWA 是可以携带业务元数据,数量,存储,
  结,赎回状态,来源和控制者政策

使用 RWAs 当账本需要代表特定的链外分数时
而不是只是一个可复杂的平衡.

## RWA 洛特 {#rwa-lot}

一个 RWA 批量含有:

- `id`: 产生的法典 RWA 标识符显示为
  `<hash>$<domain>`
- `owned_by`: 目前拥有物地的账户
- `quantity`: 批次所代表的未经出货量
- `spec`: 数量规格,例如数分尺度
- `primary_reference`: 主要的链外收据,证书,发票或
  注册表参考
- `status`: 选择性业务状态文本
- `metadata`: 紧的 JSON 用于业务背景和索引的领域
- `parents`: 源分数用于取出这个分数
- `controls`: 控制者账户,控制者的角色和启用的控制者
  运营
- `is_frozen` 并且 `held_quantity`: 运行时间强制执行的生命周期状态

保持连锁的有效载荷紧,存储大量法律文件,检查
报告和审计包 WSV, 然后,你把它写起来. URI, SoraFS
路径,或显而易见的参考 RWA 其他数据.

## 标识符 {#identifiers}

`RegisterRwa` 不接受被选中的调用人 `id`, 他不接受.
一个 `owner` 交易权威成为最初的 `owned_by`
运行时间产生了 `RwaId` 在目标领域.

文本形式 RWA ID 是:

```text
<generated-hash>$<domain>
```

例如:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

申请应将其业务识别符存储在 `primary_reference`
或 `metadata`, 然后发现所产生的 `RwaId` 在
`RwaEvent::Created`, `FindRwas`, `/v1/rwas`, 或是探险者路线设定
在交易承担后.

## 生命周期 {#lifecycle}

一般情况 RWA 工作流程包括:

| 行动                                  | 实施行为                                                                                                       |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `RegisterRwa`                              | 创建一个生成的...ID 交易权威成为 `owned_by`.                                       |
| `TransferRwa`                              | 将数量转移到另一个账户. `owned_by`; 一部分转移产生了产生的孩子. |
| `HoldRwa`                                  | 需要配置控制器和 `hold_enabled`.                                                     |
| `ReleaseRwa`                               | 需要配置控制器和 `hold_enabled`.                                                 |
| `FreezeRwa`                                | 需要配置控制器和 `freeze_enabled`.                                    |
| `UnfreezeRwa`                              | 需要配置控制器和 `freeze_enabled`.                                |
| `RedeemRwa`                                | 要求所有者或控制员和 `redeem_enabled`.                                                  |
| `MergeRwas`                                | 结合来自同一个域和规格的父母分数的量,成生成的子分数.                              |
| `ForceTransferRwa`                         | 通过控制器流动移动数量. `force_transfer_enabled`.                    |
| `SetRwaControls`                           | 取代物品控制政策,需要所有者或管理员.                                                        |
| `SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` | 需要所有者或控制器;冷的批量需要控制器.                                 |

没有. `UnregisterRwa` 在当前代码中的指示.
连锁以外的物品 `RedeemRwa` 代表数量交付时,
消费,定居或以其他方式从循环中移除.

## 超级数据和控制 {#metadata-and-controls}

为了帮助应用程序识别和验证
批量:

- 资产类别,发行人,保管人或注册表参考
- 仓库,保险柜, ISIN, 发票或证书标识符
- 证书和法律文件的内容哈希
- SoraFS 对于更大的证据捆绑的路径或显而易见引用
- 在链外服务所使用的期限,管辖权或合规标签

已实施的 `RwaControlPolicy` 有以下领域:

```json
{
  "controller_accounts": [],
  "controller_roles": [],
  "freeze_enabled": true,
  "hold_enabled": true,
  "force_transfer_enabled": false,
  "redeem_enabled": true
}
```

控制者账户和角色只允许控制者执行
运算由相应的布尔标志启用.
有效载荷不是允许清单转移政策,也不包含嵌套
`transfers` 规则.

## 问题,事件 APIs {#queries-events-and-apis}

使用 [`FindRwas`](/zh-hans/reference/queries.md#assets-nfts-and-rwas) 在列表中
已注册 RWA 需要实时更新的应用程序可以订阅
[`Rwa` 数据事件](/zh-hans/blockchain/filters.md#data-event-filters) 对于创造者,
转换所有者,分割,合并,赎回,结,解凍,保留,释放
转移,控制变化和元数据事件.

Torii 暴露链状态路线,如 `/v1/rwas` 并且 `/v1/rwas/query`,
加上探险者航线,如 `/v1/explorer/rwas` 并且
`/v1/explorer/rwas/{rwa_id}` 在该路线家族被启用时.
客户应该更喜欢直播.
[`/openapi`](/zh-hans/reference/torii-endpoints.md#common-endpoints) 文件
一个节点所暴露的反应形状.

### 试着. Taira {#try-it-on-taira}

检查是否公开 Taira 目前已注册 RWA 很多:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

列出 RWA 现场的路线 Taira OpenAPI 文件:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

没有任何东西 `items` 在未登记公开批发的情况下,产量预计.
登记,转移,保留,结和赎回是签署的交易.

## 试试吧 {#try-it}

下面的例子使用 Python SDK 的表面
[分享的设置](/zh-hans/guide/tutorials/python.md#shared-setup). 取代
账户 IDs, 个人钥匙和生成的批量 IDs 有你自己的价值观
在提交交易之前的网络.

### 发现 RWA API 航线 {#discover-rwa-api-routes}

这种只读的例子要求一个运行 Torii 面向应用程序的节点 RWA
设置:

```python
from iroha_python import create_torii_client

client = create_torii_client("https://taira.sora.org")
openapi = client.request_json("GET", "/openapi", expected_status=(200,))

rwa_paths = sorted(
    path for path in openapi.get("paths", {}) if path.startswith("/v1/rwas")
)

for path in rwa_paths:
    print(path)
```

如果列表是空的,节点可能仍然支持 RWA 指令和
通过其他方式查询 Torii APIs, 但它并未揭示 JSON
路线家族.

### 注册仓库收据 {#register-a-warehouse-receipt}

使用一项商业行动成为一个签署的交易时使用草案.
商业收据号码进入 `primary_reference`; 大本 ID 是
在交易承诺后产生.

```python
from iroha_python import TransactionConfig, TransactionDraft

config = TransactionConfig(
    chain_id=CHAIN_ID,
    authority=alice,
    metadata={**TX_METADATA, "source": "rwa-docs"},
)

draft = TransactionDraft(config)
draft.register_rwa(
    {
        "domain": "commodities.universal",
        "quantity": "100",
        "spec": {"scale": 0},
        "primary_reference": "warehouse-receipt-001",
        "status": "active",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "inspection_report": "sorafs://reports/copper-001.json",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": True,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

在交易承诺后,生成的列表 RWA IDs. 连锁国家路线
揭示了法典 IDs; 在您使用事件或探险者详细路线时,
需要匹配一个 ID 回到 `primary_reference` 或是元数据:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

启用 Explorer 的节点也可以返回更丰富的投影:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### 暂时停留的转移 {#transfer-with-a-temporary-hold}

使用生成的 RWA ID 这种例子假设
`alice` 是所有者,并且配置为控制器
`hold_enabled`.

```python
warehouse_lot_id = (
    "0123456789abcdef0123456789abcdef"
    "0123456789abcdef0123456789abcdef$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.transfer_rwa(warehouse_lot_id, quantity="10", destination=bob)
draft.hold_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

在连锁之外的过程完成时,释放扣:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 添加控制和审计元数据 {#add-controls-and-audit-metadata}

控制和元数据是单独的.
对申请或审计人员需要显示的事实的元数据:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.set_rwa_controls(
    warehouse_lot_id,
    {
        "controller_accounts": [alice],
        "controller_roles": [],
        "freeze_enabled": True,
        "hold_enabled": True,
        "force_transfer_enabled": True,
        "redeem_enabled": True,
    },
)
draft.set_rwa_key_value(warehouse_lot_id, "auditor", "alice")
draft.set_rwa_key_value(
    warehouse_lot_id,
    "proof_hash",
    "sha256:2b1c7a4e...",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 赎回或退休金额 {#redeem-or-retire-quantity}

在代价的链外资产交付后,赎回量
产品必须有:
`redeem_enabled`, 签署者必须是所有者或控制者.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 在合规审查期间结 {#freeze-during-compliance-review}

在链外审查必须阻止普通业主运营时,
签署者必须是控制者, `freeze_enabled`.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.freeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {
        "status": "frozen",
        "reason": "custodian inventory check",
        "case_id": "OPS-2026-0042",
    },
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

在审查通过后,解:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.unfreeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {"status": "cleared", "case_id": "OPS-2026-0042"},
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 收取的发票 {#invoice-receivable}

代表一个账单作为 RWA 通过存储发票号码
`primary_reference` 在注册后,使用生成的 ID
为转移和赎回.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.register_rwa(
    {
        "domain": "receivables.universal",
        "quantity": "50000",
        "spec": {"scale": 2},
        "primary_reference": "INV-2026-0007",
        "status": "issued",
        "metadata": {
            "asset_class": "invoice",
            "currency": "USD",
            "debtor": "example-buyer",
            "due_date": "2026-06-30",
            "document_hash": "sha256:4df4c8...",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": False,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

在收取款项的融资或支付时,使用生成的发票批量 ID:

```python
invoice_lot_id = (
    "fedcba9876543210fedcba9876543210"
    "fedcba9876543210fedcba9876543210$receivables.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.transfer_rwa(invoice_lot_id, quantity="50000", destination=bob)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

在链外结算后赎回所代表的金额:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 碳信用退休金 {#carbon-credit-retirement}

借助赎金,在索赔后退休信用.
指出链外证书或注册证明:

```python
carbon_lot_id = (
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa$carbon.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(carbon_lot_id, quantity="250")
draft.set_rwa_key_value(
    carbon_lot_id,
    "retirement_certificate",
    "sorafs://certificates/carbon-credit-2026-001-retired.json",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 两块结合起来 {#merge-two-lots}

两个离链的位置结合时,将数量合并.
运行时间产生了
孩子的数量 ID.

```python
warehouse_lot_id_2 = (
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.merge_rwas(
    {
        "parents": [
            {"rwa": warehouse_lot_id, "quantity": "40"},
            {"rwa": warehouse_lot_id_2, "quantity": "60"},
        ],
        "primary_reference": "warehouse-receipt-003",
        "status": "merged",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "merge_reason": "same custodian and quality grade",
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

为了完整 Python 交易例,见
[现实世界资产](/zh-hans/guide/tutorials/python.md#real-world-assets).

## 相关文件 {#related-docs}

- [资产](/zh-hans/blockchain/assets.md)
- [数据表](/zh-hans/blockchain/metadata.md)
- [Iroha 特别指示](/zh-hans/blockchain/instructions.md)
- [问题](/zh-hans/reference/queries.md#assets-nfts-and-rwas)
- [Torii 终点](/zh-hans/reference/torii-endpoints.md#app-and-sora-route-families)
