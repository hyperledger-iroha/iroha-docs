---
translation_locale: zh-hans
translation_source: /blockchain/rwas.md
translation_source_hash: cbdc6d766fb90bea7e68dc67f2c705bb1638340feeb2fca9f2dd43a727ac03e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 现实资产 {#real-world-assets}

现实世界资产 (RWAs) 是链外资产模型,其所有权或控制在链上进行跟踪. 在 Iroha 中,一个 RWA 是一个注册账本的批量,具有生成的识别符,拥有者帐户,数量,业务元数据,来源和可选生命周期控制

RWAs 与数值资产余额不同:

- 数值资产是账户持有的可存余额
- 一个 NFT 是一个独一无二的连锁记录,只有一个拥有者
- 一个 RWA 是一个可以携带业务元数据,数量,存储,结,赎回状态,来源和控制者政策的批量

使用 RWAs 如果本书需要代表特定的链外分数,而不是仅仅是可结的余额.

## RWA 分数 {#rwa-lot}

一批 RWA 含有:

- `id`: 产生的法典 RWA 标识符,显示为 `<hash>$<domain>`
- `owned_by`:目前持有物品的账户
- `quantity`:由批量所代表的剩余数量
- `spec`:数量规格,例如十分级尺度
- `primary_reference`:主要的链外收据,证书,发票或注册表引用
- `status`:可选的业务状态文本
- `metadata`:用于商业环境和索引的紧 JSON 字段
- `parents`:用于此批次的源分数
- `controls`:控制者账户,控制者的角色和启用的控制者操作
- `is_frozen`和`held_quantity`:运行时间强制执行的生命周期状态

保持连锁有效载荷紧. 在 WSV 之外存储大型法律文件,检查报告和审计捆绑,然后在 RWA 元数据中放一个消化, URI, SoraFS 路径或明确引用.

## 标识符 {#identifiers}

`RegisterRwa`不接受调用者选择的 `id`,也不接受`owner`字段.交易权威成为初始的 `owned_by`账户,运行时间在目标域中产生`RwaId`.

RWA ID 的文本形式是:

```text
<generated-hash>$<domain>
```

例如:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

申请应在 `primary_reference`或 `metadata`中存储其业务识别符,然后从 `RwaEvent::Created`, `FindRwas`,`/v1/rwas`或交易承诺后设置的探索者路线发现生成的 `RwaId`.

## 生命周期 {#lifecycle}

常见的 RWA 工作流程包括:

|行动|实施行为|
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa`|在一个域内创建生成-ID 批量;交易权威成为 `owned_by`. |
|`TransferRwa`|转移数量到另一个账户. 一个完整的转让可以改变 `owned_by`. 一个部分的转让会产生单独的子包,生成 ID. |
|`HoldRwa`|需要配置控制器和 `hold_enabled`. |
|`ReleaseRwa`|需要设置控制器和 `hold_enabled`.|
|`FreezeRwa`|需要配置控制器和 `freeze_enabled`. |
|`UnfreezeRwa`|需要配置控制器和 `freeze_enabled`. |
|`RedeemRwa`|在 `redeem_enabled`是正确的时,所有者或控制者可以提交. |
|`MergeRwas`|结合同个域和规格的父母分数,成一个产生的孩子分数. |
|`ForceTransferRwa`|在控制器流程中移动量. 需要配置控制器和 `force_transfer_enabled`.|
|`SetRwaControls`|取代批发控制政策.需要拥有者或控制者.|
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |更新大量的元数据.要求所有者或控制者;冷的批量需要控制者.|

目前代码中没有 `UnregisterRwa` 指令. 当代表量交付,消费,结算或以其他方式从循环中移除时,将 `RedeemRwa` 带回链外的批次.

## 超值数据和控制 {#metadata-and-controls}

为了帮助应用程序识别和验证批量,使用传输数据为紧的事实:

- 资产类别,发行人,托管人或注册表参考
- 仓库,货柜, ISIN,账单或证书标识符
- 证书和法律文件的内容哈希
- SoraFS 对于更大的证据捆绑的路径或显示引用
- 外链服务所使用的期限,管辖权或合规性标签

已实施的 `RwaControlPolicy`有以下字段:

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

控制器账户和角色只能执行由相应的布尔标志启动的操作.当前的控制载荷包含控制器身份和运行旗.转移允许列表和嵌入式 `transfers`规则不在此有效载荷之外.

## 查询,事件和 APIs {#queries-events-and-apis}

使用[`FindRwas`](/zh-hans/reference/queries.md#assets-nfts-and-rwas)列出已注册的 RWA 批量.需要现场更新的应用程序可以订阅[`Rwa`数据事件](/zh-hans/blockchain/filters.md#data-event-filters)为创建,所有者更改,分组,合并,赎回,结,解凍,持有,释放,强力转移,控制变化和元数据事件.

Torii 将链状态路线,如 `/v1/rwas`和`/v1/rwas/query`,以及当该路线家族被启用时的探索者路线加上 `/v1/explorer/rwas`和 `/v1/explorer/rwas/{rwa_id}`.生成的客户端应该更喜欢一个节点所暴露的确切响应形状而不是现场 [`/openapi`](/zh-hans/reference/torii-endpoints.md#common-endpoints)文档.

### 在 Taira 试看. {#try-it-on-taira}

检查公众 Taira 目前是否已注册 RWA 批量:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

列出 RWA 直播 Taira OpenAPI 文档所暴露的路线:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

当尚未注册公开批量时,预计将出现空置 `items`.注册,转移,持有,结和赎回是签署的交易.

## 试试吧 {#try-it}

下面的例子使用 Python SDK 从 [共享设置](/zh-hans/guide/tutorials/python.md#shared-setup). 在提交交易之前,更换账户 IDs,私钥和生成的分数 IDs 以您自己的网络的值.

### 发现 RWA API 路线 {#discover-rwa-api-routes}

这种仅可阅读的例子要求运行 Torii 节点,哪些应用程序面向 RWA 路线已启用:

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

如果列表是空的,节点可能仍然通过其他 Torii APIs 支持 RWA 指令和查询,但它不会暴露可选的 JSON 路线家族.

### 注册仓库收据 {#register-a-warehouse-receipt}

在一个商业行动成为一个签署的交易时,使用草案. 商业收据号码进入 `primary_reference`;经过交易承诺后生成本书 ID.

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

在交易提交后,生成列表 RWA IDs.链状态路线暴露了正规的 IDs;使用事件或探索者详细路线当你需要匹配一个 ID 回到 `primary_reference` 或元数据时:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

启用 Explorer 的节点也可以返回更丰富的预测:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### 暂时停留的转移 {#transfer-with-a-temporary-hold}

使用由链返回的生成 RWA ID.本例假设`alice`是所有者,并且也配置为控制器与`hold_enabled`.

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

在连锁外过程成功后,提交 `ReleaseRwa`:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 添加控制和审计元数据 {#add-controls-and-audit-metadata}

控制和元数据是单独的. 使用对控制者政策的控制,以及应用程序或审计人员需要显示的事实的元数据:

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

在所代表的链外资产交付,消耗,退休或以其他方式从循环中移除后提交 `RedeemRwa`.这将永久减去提交的数量. 批次必须有`redeem_enabled`.签署者必须是所有者或控制者.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 在合规审查期间结 {#freeze-during-compliance-review}

提交 `FreezeRwa` 当链外审查必须阻止普通所有者运营时.签署人必须是控制者.批量必须有`freeze_enabled`.

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

在审查通过后,提交 `UnfreezeRwa`:

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

代表一个账单作为 RWA 通过存储发票号码在 `primary_reference` 在注册后,使用生成的 ID 为转让和赎回.

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

当领取的债务被融资或支付时,使用生成的发票批量 ID:

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

在链外结算后,赎回所代表的金额:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 碳信用退休金 {#carbon-credit-retirement}

提交 `RedeemRwa`以从循环中删除索赔的碳积分.将离链证书或注册证明存储在元数据中:

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

### 结合两个乐队 {#merge-two-lots}

结合两个离链的位置.父母必须在同一领域,使用相同的数量规格.运行时间产生孩子的分数 ID.

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

对于 Python 交易的完整例子,请参见[Real-World Assets](/zh-hans/guide/tutorials/python.md#real-world-assets).

## 相关文件 {#related-docs}

- [资产](/zh-hans/blockchain/assets.md)
- [超值数据](/zh-hans/blockchain/metadata.md)
- [Iroha 特别指示](/zh-hans/blockchain/instructions.md)
- [查询](/zh-hans/reference/queries.md#assets-nfts-and-rwas)
- [Torii 终端点](/zh-hans/reference/torii-endpoints.md#app-and-sora-route-families)
