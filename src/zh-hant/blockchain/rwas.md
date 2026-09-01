---
translation_locale: zh-hant
translation_source: /blockchain/rwas.md
translation_source_hash: 8d64a9a17c93f60306c279e8656e6edde8ce5dd024e742218bfb9572b7438bb0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# 現實資產 {#real-world-assets}

現實世界資產 (RWAs) 是鏈外資產模型,其所有權或控制在鏈上進行跟蹤. 在 Iroha 中,一個 RWA 是一個註冊賬本的批次,具有生成的識別符,擁有者帳戶,數量,業務後設資料,來源和可選生命週期控制

RWAs 與數值資產餘額不同:

- 數值資產是帳戶持有的可存餘額
- 一個 NFT 是一個獨一無二的連鎖記錄,只有一個擁有者
- 一個 RWA 是一個可以攜帶業務後設資料,數量,儲存,結,贖回狀態,來源和控制者政策的批次

使用 RWAs 如果帳本需要代表特定的鏈外分數,而不是僅僅是可結的餘額.

## RWA 分數 {#rwa-lot}

一批 RWA 含有:

- `id`: 產生的規範 RWA 識別符號,顯示為 `<hash>$<domain>`
- `owned_by`:目前持有物品的帳戶
- `quantity`:由批次所代表的剩餘數量
- `spec`:數量規格,例如十分級尺度
- `primary_reference`:主要的鏈外收據,證書,發票或登錄檔引用
- `status`:可選的業務狀態文字
- `metadata`:用於商業環境和索引的緊 JSON 欄位
- `parents`:用於此批次的源分數
- `controls`:控制者帳戶,控制者的角色和啟用的控制者操作
- `is_frozen`和`held_quantity`:執行階段強制執行的生命週期狀態

保持連鎖有效載荷緊. 在 WSV 之外儲存大型法律檔案,檢查報告和審計捆綁,然後在 RWA 後設資料中放一個摘要, URI, SoraFS 路徑或明確引用.

## 識別符號 {#identifiers}

`RegisterRwa`不接受呼叫者選擇的 `id`,也不接受`owner`欄位.交易授權主體成為初始的 `owned_by`帳戶,執行階段在目標域中產生`RwaId`.

RWA ID 的文字形式是:

```text
<generated-hash>$<domain>
```

例如:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

應用程式應在 `primary_reference` 或 `metadata` 中儲存其業務識別碼，然後在交易提交後，透過 `RwaEvent::Created`、`FindRwas`、`/v1/rwas` 或 explorer route set 找到產生的 `RwaId`。

## 生命週期 {#lifecycle}

常見的 RWA 工作流程包括:

|行動|實施行為|
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa`|在一個域內建立生成-ID 批次;交易授權主體成為 `owned_by`. |
|`TransferRwa`|轉移數量到另一個帳戶. 一個完整的轉讓可以改變 `owned_by`. 一個部分的轉讓會產生單獨的子包,生成 ID. |
|`HoldRwa`|需要配置控制器和 `hold_enabled`. |
|`ReleaseRwa`|需要設定控制器和 `hold_enabled`.|
|`FreezeRwa`|封鎖一般擁有者操作。需要已設定的控制器，且 `freeze_enabled` 已啟用。 |
|`UnfreezeRwa`|重新啟用一般擁有者操作。需要已設定的控制器，且 `freeze_enabled` 已啟用。 |
|`RedeemRwa`|永久從流通量中扣除數量。當 `redeem_enabled` 為 true 時，擁有者或控制器可以提交。 |
|`MergeRwas`|結合同個域和規格的父母分數,成一個產生的孩子分數. |
|`ForceTransferRwa`|在控制器流程中移動量. 需要配置控制器和 `force_transfer_enabled`.|
|`SetRwaControls`|取代批發控制政策.需要擁有者或控制者.|
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |更新大量的後設資料.要求所有者或控制者;冷的批次需要控制者.|

目前程式碼中沒有 `UnregisterRwa` instruction。當所代表的數量已交付、消耗、結算或以其他方式退出流通時，請使用 `RedeemRwa` 讓鏈下批次退役。

## 超值資料和控制 {#metadata-and-controls}

為了幫助應用程式識別和驗證批次,使用傳輸資料為緊的事實:

- 資產類別,發行人,託管人或登錄檔參考
- 倉庫,貨櫃, ISIN,賬單或證書識別符號
- 證書和法律檔案的內容雜湊
- SoraFS 對於更大的證據捆綁的路徑或顯示引用
- 外鏈服務所使用的期限,管轄權或合規性標籤

已實施的 `RwaControlPolicy`有以下欄位:

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

控制器帳戶和角色只能執行由相應的布林標誌啟動的操作.當前的控制載荷包含控制器身份和執行旗.轉移允許列表和嵌入式 `transfers`規則不在此有效載荷之外.

## 查詢,事件和 APIs {#queries-events-and-apis}

使用[`FindRwas`](/zh-hant/reference/queries.md#assets-nfts-and-rwas)列出已註冊的 RWA 批次.需要現場更新的應用程式可以訂閱[`Rwa`資料事件](/zh-hant/blockchain/filters.md#data-event-filters)為建立,所有者更改,分組,合併,贖回,結,解凍,持有,釋放,強力轉移,控制變化和後設資料事件.

Torii 將鏈狀態路線,如 `/v1/rwas`和`/v1/rwas/query`,以及當該路線家族被啟用時的探索者路線加上 `/v1/explorer/rwas`和 `/v1/explorer/rwas/{rwa_id}`.生成的客戶端應該更喜歡透過節點暴露的確切響應形狀而使用現場 [`/openapi.json`](/zh-hant/reference/torii-endpoints.md#common-endpoints)文件.

### 在 Taira 試看. {#try-it-on-taira}

檢查公眾 Taira 目前是否已註冊 RWA 批次:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

列出 RWA 直播 Taira OpenAPI 文件所暴露的路線:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

當尚未註冊公開批次時,預計將出現空置 `items`.註冊,轉移,持有,結和贖回是簽署的交易.

## 試試吧 {#try-it}

下面的例子使用 Python SDK 從 [共享設定](/zh-hant/guide/tutorials/python.md#shared-setup). 在提交交易之前,更換帳戶 IDs,私鑰和生成的分數 IDs 以您自己的網路的值.

### 發現 RWA API 路線 {#discover-rwa-api-routes}

這種僅可閱讀的例子要求執行 Torii 節點,哪些應用程式面向 RWA 路線已啟用:

```python
from iroha_python import create_torii_client

client = create_torii_client("https://taira.sora.org")
openapi = client.request_json("GET", "/openapi.json", expected_status=(200,))

rwa_paths = sorted(
    path for path in openapi.get("paths", {}) if path.startswith("/v1/rwas")
)

for path in rwa_paths:
    print(path)
```

如果列表是空的,節點可能仍然透過其他 Torii APIs 支援 RWA 指令和查詢,但它不會暴露可選的 JSON 路線家族.

### 註冊倉庫收據 {#register-a-warehouse-receipt}

當一項業務操作應形成一筆已簽署交易時，請使用草稿。業務收據號碼放入 `primary_reference`；交易提交後才會產生帳本 ID。

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

在交易提交後,生成列表 RWA IDs.鏈狀態路線暴露了規範的 IDs;使用事件或探索者詳細路線當你需要匹配一個 ID 回到 `primary_reference` 或後設資料時:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

啟用 Explorer 的節點也可以返回更豐富的投影:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### 暫時停留的轉移 {#transfer-with-a-temporary-hold}

使用由鏈返回的生成 RWA ID.本例假設`alice`是所有者,並且也配置為控制器與`hold_enabled`.

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

### 新增控制和審計後設資料 {#add-controls-and-audit-metadata}

控制和後設資料是單獨的. 使用對控制者政策的控制,以及應用程式或審計人員需要顯示的事實的後設資料:

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

### 贖回或登出數量 {#redeem-or-retire-quantity}

在所代表的鏈外資產交付、消耗、登出或以其他方式從流通中移除後提交 `RedeemRwa`.這將永久減少批次中所表示的數量.批次必須啟用`redeem_enabled`.簽署者必須是所有者或控制者.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 在合規審查期間結 {#freeze-during-compliance-review}

提交 `FreezeRwa` 當鏈外審查必須阻止普通所有者運營時.簽署人必須是控制者.批次必須有`freeze_enabled`.

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

在審查透過後,提交 `UnfreezeRwa`:

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

代表一個賬單作為 RWA 透過儲存發票號碼在 `primary_reference` 在註冊後,使用生成的 ID 為轉讓和贖回.

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

當領取的債務被融資或支付時,使用生成的發票批次 ID:

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

### 碳信用登出 {#carbon-credit-retirement}

提交 `RedeemRwa`以從迴圈中刪除索賠的碳積分.將離鏈證書或註冊證明儲存在後設資料中:

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

結合兩個離鏈的位置.父母必須在同一領域,使用相同的數量規格.執行階段產生孩子的分數 ID.

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

對於 Python 交易的完整例子,請參見[現實世界資產](/zh-hant/guide/tutorials/python.md#real-world-assets).

## 相關檔案 {#related-docs}

- [資產](/zh-hant/blockchain/assets.md)
- [超值資料](/zh-hant/blockchain/metadata.md)
- [Iroha 特別指示](/zh-hant/blockchain/instructions.md)
- [查詢](/zh-hant/reference/queries.md#assets-nfts-and-rwas)
- [Torii 端點](/zh-hant/reference/torii-endpoints.md#app-and-sora-route-families)
