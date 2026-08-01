---
translation_locale: zh-hant
translation_source: /blockchain/rwas.md
translation_source_hash: cbdc6d766fb90bea7e68dc67f2c705bb1638340feeb2fca9f2dd43a727ac03e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 現實資產 {#real-world-assets}

現實世界資產 (RWAs) 是鏈外資產模型,其所有權或控制在鏈上進行跟蹤. 在 Iroha 中,一個 RWA 是一個註冊賬本的批量,具有生成的識別符,擁有者帳戶,數量,業務元數據,來源和可選生命週期控制

RWAs 與數值資產餘額不同:

- 數值資產是賬戶持有的可存餘額
- 一個 NFT 是一個獨一無二的連鎖記錄,只有一個擁有者
- 一個 RWA 是一個可以攜帶業務元數據,數量,存儲,結,贖回狀態,來源和控制者政策的批量

使用 RWAs 如果本書需要代表特定的鏈外分數,而不是僅僅是可結的餘額.

## RWA 分數 {#rwa-lot}

一批 RWA 含有:

- `id`: 產生的法典 RWA 標識符,顯示爲 `<hash>$<domain>`
- `owned_by`:目前持有物品的賬戶
- `quantity`:由批量所代表的剩餘數量
- `spec`:數量規格,例如十分級尺度
- `primary_reference`:主要的鏈外收據,證書,發票或註冊表引用
- `status`:可選的業務狀態文本
- `metadata`:用於商業環境和索引的緊 JSON 字段
- `parents`:用於此批次的源分數
- `controls`:控制者賬戶,控制者的角色和啓用的控制者操作
- `is_frozen`和`held_quantity`:運行時間強制執行的生命週期狀態

保持連鎖有效載荷緊. 在 WSV 之外存儲大型法律文件,檢查報告和審計捆綁,然後在 RWA 元數據中放一個消化, URI, SoraFS 路徑或明確引用.

## 標識符 {#identifiers}

`RegisterRwa`不接受調用者選擇的 `id`,也不接受`owner`字段.交易權威成爲初始的 `owned_by`賬戶,運行時間在目標域中產生`RwaId`.

RWA ID 的文本形式是:

```text
<generated-hash>$<domain>
```

例如:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

申請應在 `primary_reference`或 `metadata`中存儲其業務識別符,然後從 `RwaEvent::Created`, `FindRwas`,`/v1/rwas`或交易承諾後設置的探索者路線發現生成的 `RwaId`.

## 生命週期 {#lifecycle}

常見的 RWA 工作流程包括:

|行動|實施行爲|
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa`|在一個域內創建生成-ID 批量;交易權威成爲 `owned_by`. |
|`TransferRwa`|轉移數量到另一個賬戶. 一個完整的轉讓可以改變 `owned_by`. 一個部分的轉讓會產生單獨的子包,生成 ID. |
|`HoldRwa`|需要配置控制器和 `hold_enabled`. |
|`ReleaseRwa`|需要設置控制器和 `hold_enabled`.|
|`FreezeRwa`|需要配置控制器和 `freeze_enabled`. |
|`UnfreezeRwa`|需要配置控制器和 `freeze_enabled`. |
|`RedeemRwa`|在 `redeem_enabled`是正確的時,所有者或控制者可以提交. |
|`MergeRwas`|結合同個域和規格的父母分數,成一個產生的孩子分數. |
|`ForceTransferRwa`|在控制器流程中移動量. 需要配置控制器和 `force_transfer_enabled`.|
|`SetRwaControls`|取代批發控制政策.需要擁有者或控制者.|
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |更新大量的元數據.要求所有者或控制者;冷的批量需要控制者.|

目前代碼中沒有 `UnregisterRwa` 指令. 當代表量交付,消費,結算或以其他方式從循環中移除時,將 `RedeemRwa` 帶回鏈外的批次.

## 超值數據和控制 {#metadata-and-controls}

爲了幫助應用程序識別和驗證批量,使用傳輸數據爲緊的事實:

- 資產類別,發行人,託管人或註冊表參考
- 倉庫,貨櫃, ISIN,賬單或證書標識符
- 證書和法律文件的內容哈希
- SoraFS 對於更大的證據捆綁的路徑或顯示引用
- 外鏈服務所使用的期限,管轄權或合規性標籤

已實施的 `RwaControlPolicy`有以下字段:

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

控制器賬戶和角色只能執行由相應的布爾標誌啓動的操作.當前的控制載荷包含控制器身份和運行旗.轉移允許列表和嵌入式 `transfers`規則不在此有效載荷之外.

## 查詢,事件和 APIs {#queries-events-and-apis}

使用[`FindRwas`](/zh-hant/reference/queries.md#assets-nfts-and-rwas)列出已註冊的 RWA 批量.需要現場更新的應用程序可以訂閱[`Rwa`數據事件](/zh-hant/blockchain/filters.md#data-event-filters)爲創建,所有者更改,分組,合併,贖回,結,解凍,持有,釋放,強力轉移,控制變化和元數據事件.

Torii 將鏈狀態路線,如 `/v1/rwas`和`/v1/rwas/query`,以及當該路線家族被啓用時的探索者路線加上 `/v1/explorer/rwas`和 `/v1/explorer/rwas/{rwa_id}`.生成的客戶端應該更喜歡一個節點所暴露的確切響應形狀而不是現場 [`/openapi`](/zh-hant/reference/torii-endpoints.md#common-endpoints)文檔.

### 在 Taira 試看. {#try-it-on-taira}

檢查公衆 Taira 目前是否已註冊 RWA 批量:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

列出 RWA 直播 Taira OpenAPI 文檔所暴露的路線:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

當尚未註冊公開批量時,預計將出現空置 `items`.註冊,轉移,持有,結和贖回是簽署的交易.

## 試試吧 {#try-it}

下面的例子使用 Python SDK 從 [共享設置](/zh-hant/guide/tutorials/python.md#shared-setup). 在提交交易之前,更換賬戶 IDs,私鑰和生成的分數 IDs 以您自己的網絡的值.

### 發現 RWA API 路線 {#discover-rwa-api-routes}

這種僅可閱讀的例子要求運行 Torii 節點,哪些應用程序面向 RWA 路線已啓用:

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

如果列表是空的,節點可能仍然通過其他 Torii APIs 支持 RWA 指令和查詢,但它不會暴露可選的 JSON 路線家族.

### 註冊倉庫收據 {#register-a-warehouse-receipt}

在一個商業行動成爲一個簽署的交易時,使用草案. 商業收據號碼進入 `primary_reference`;經過交易承諾後生成本書 ID.

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

在交易提交後,生成列表 RWA IDs.鏈狀態路線暴露了正規的 IDs;使用事件或探索者詳細路線當你需要匹配一個 ID 回到 `primary_reference` 或元數據時:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

啓用 Explorer 的節點也可以返回更豐富的預測:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### 暫時停留的轉移 {#transfer-with-a-temporary-hold}

使用由鏈返回的生成 RWA ID.本例假設`alice`是所有者,並且也配置爲控制器與`hold_enabled`.

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

在連鎖外過程成功後,提交 `ReleaseRwa`:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 添加控制和審計元數據 {#add-controls-and-audit-metadata}

控制和元數據是單獨的. 使用對控制者政策的控制,以及應用程序或審計人員需要顯示的事實的元數據:

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

### 贖回或退休金額 {#redeem-or-retire-quantity}

在所代表的鏈外資產交付,消耗,退休或以其他方式從循環中移除後提交 `RedeemRwa`.這將永久減去提交的數量. 批次必須有`redeem_enabled`.簽署者必須是所有者或控制者.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 在合規審查期間結 {#freeze-during-compliance-review}

提交 `FreezeRwa` 當鏈外審查必須阻止普通所有者運營時.簽署人必須是控制者.批量必須有`freeze_enabled`.

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

在審查通過後,提交 `UnfreezeRwa`:

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

### 收取的發票 {#invoice-receivable}

代表一個賬單作爲 RWA 通過存儲發票號碼在 `primary_reference` 在註冊後,使用生成的 ID 爲轉讓和贖回.

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

當領取的債務被融資或支付時,使用生成的發票批量 ID:

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

在鏈外結算後,贖回所代表的金額:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 碳信用退休金 {#carbon-credit-retirement}

提交 `RedeemRwa`以從循環中刪除索賠的碳積分.將離鏈證書或註冊證明存儲在元數據中:

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

### 結合兩個樂隊 {#merge-two-lots}

結合兩個離鏈的位置.父母必須在同一領域,使用相同的數量規格.運行時間產生孩子的分數 ID.

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

對於 Python 交易的完整例子,請參見[Real-World Assets](/zh-hant/guide/tutorials/python.md#real-world-assets).

## 相關文件 {#related-docs}

- [資產](/zh-hant/blockchain/assets.md)
- [超值數據](/zh-hant/blockchain/metadata.md)
- [Iroha 特別指示](/zh-hant/blockchain/instructions.md)
- [查詢](/zh-hant/reference/queries.md#assets-nfts-and-rwas)
- [Torii 終端點](/zh-hant/reference/torii-endpoints.md#app-and-sora-route-families)
