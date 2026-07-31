---
translation_locale: zh-hant
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 實際財產 {#real-world-assets}

實際的資產 (RWAs) 擁有或控制的非連鎖資產模型
在網路上追蹤. Iroha, 其他國家 RWA 是一個注冊的帳簿,
產生的識別碼,所有者帳戶,數量,商業元數據;
選擇性生命周期控制.

RWAs 與數值資產餘額不同:

- 數值資產是一個帳戶持有的可存余额
- 其他國家 NFT 是一個獨特的連鎖紀錄,
- 其他國家 RWA 數量,儲存數據,
  凍結,償還狀態,來源和控制者政策

使用 RWAs 當帳號需要代表特定的連鎖外分數時
而不是只有可的平衡.

## RWA 羅得 {#rwa-lot}

其他國家 RWA 批量含有:

- `id`: 產生的法典 RWA 表示為
  `<hash>$<domain>`
- `owned_by`: 目前擁有土地的帳戶
- `quantity`: 批量所代表的剩余數量
- `spec`: 數量規格,例如數位尺度
- `primary_reference`: 首要的連鎖外收單,證書,發票,或
  註冊參考
- `status`: 選擇性企業狀況文本
- `metadata`: 簡約的 JSON 企業背景及索引使用的字段
- `parents`: 來源分數使用於取出這個分數
- `controls`: 控制者帳戶,控制者的角色和被啟動的控制者
  活動
- `is_frozen` 及其他 `held_quantity`: 生命周期狀態由運行時間執行

保持連鎖的使用載荷紧.
其他國家的監控集團 WSV, 然後寫下一個字體, URI, SoraFS
路線或顯示參考 RWA 沒有任何相關資料.

## 標籤 {#identifiers}

`RegisterRwa` 沒有接受被挑選的呼叫者 `id`, 這種情況不太好,
其他國家 `owner` 交易權威成為初始 `owned_by`
運行時間產生了 `RwaId` 在目標領域.

文本形式 RWA ID 是:

```text
<generated-hash>$<domain>
```

舉例來說:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

申請者應將其企業識別碼存儲在 `primary_reference`
或是 `metadata`, 然後發現他們所產生的 `RwaId` 來自
`RwaEvent::Created`, `FindRwas`, `/v1/rwas`, 或是探索者路線
在交易承諾後.

## 生命周期 {#lifecycle}

常見的 RWA 工作流程包括:

| 活動                                  | 實現的行為                                                                                                       |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `RegisterRwa`                              | 建立一個生成的...ID 在一個領域中的物件;交易權威成為 `owned_by`.                                       |
| `TransferRwa`                              | 轉移數量到另一個帳戶. `owned_by`; 部分轉移產生了一個孩子的數量. |
| `HoldRwa`                                  | 需要配置控制器和 `hold_enabled`.                                                     |
| `ReleaseRwa`                               | 需要配置控制器和 `hold_enabled`.                                                 |
| `FreezeRwa`                                | 需要一個配置的控制器和 `freeze_enabled`.                                    |
| `UnfreezeRwa`                              | 需要配置控制器和 `freeze_enabled`.                                |
| `RedeemRwa`                                | 要求所有者或監管人, `redeem_enabled`.                                                  |
| `MergeRwas`                                | 結合由同一領域和特定的親子組成數量,                              |
| `ForceTransferRwa`                         | 在控制器流程中移動量. `force_transfer_enabled`.                    |
| `SetRwaControls`                           | 需要擁有者或控制者.                                                        |
| `SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` | 需要所有者或控制器;凍結的 lots需要控制器.                                 |

沒有. `UnregisterRwa` 在目前的代碼中使用指示.
沒有連鎖的物品 `RedeemRwa` 代表數量交付時,
消耗,定居或以其他方式從循環中移除.

## 數據與控制 {#metadata-and-controls}

使用傳統數據, 幫助應用程式識別和驗證
這項項目:

- 資產類別,發行者,保管人或登記帳號參考
- 倉庫,櫃台, ISIN, 發票或證書識別碼
- 證明和法律文件的內容哈希
- SoraFS 關於更大的證據集的路徑或顯示參考
- 沒有連鎖服務使用的 maturity,管轄權或合规標籤

已實行 `RwaControlPolicy` 有這些字段:

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

只有控制者可執行管理員的帳戶和角色
按相應的布魯式旗啟動的操作.
這項政策並不包含被嵌入式載體,
`transfers` 沒有任何規則.

## 詢問問題,事件及情況 APIs {#queries-events-and-apis}

使用 [`FindRwas`](/zh-hant/reference/queries.md#assets-nfts-and-rwas) 在列表中
已註冊 RWA 應用程式需要實時更新,
[`Rwa` 數據事件](/zh-hant/blockchain/filters.md#data-event-filters) 因為他們創造了,
已被轉換所有者, 分裂,合并,收購,凍結,解凍,持有,釋放,
發生的變化,控制與傳輸事件.

Torii 揭露連鎖狀態的路線,如 `/v1/rwas` 及其他 `/v1/rwas/query`,
再加上探索者航線, `/v1/explorer/rwas` 及其他
`/v1/explorer/rwas/{rwa_id}` 當該路線家族被啟動時.
客戶應該更喜歡直播
[`/openapi`](/zh-hant/reference/torii-endpoints.md#common-endpoints) 該文件
結點所暴露的正確反應形狀.

### 試著使用 Taira {#try-it-on-taira}

檢查是否公開 Taira 目前已註冊 RWA 數量:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

列出這些 RWA 線路被直播曝光 Taira OpenAPI 文件:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

沒有任何問題 `items` 在未登記公眾分數時,
註冊,轉移,保留,結和償還是簽署的交易.

## 試下試看 {#try-it}

以下的例子使用 Python SDK 來自的表面
[分享的設定](/zh-hant/guide/tutorials/python.md#shared-setup). 取代了
帳號 IDs, 密钥和生成的物件 IDs 擁有自己的價值觀
在提交交易之前的網路.

### 發現 RWA API 航線 {#discover-rwa-api-routes}

這只能閱讀的例子要求 Torii 針對應用程式的節點 RWA
提供以下航線:

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

如果列表是空的, RWA 提供指令和
透過其他方式的查詢 Torii APIs, 但它並不揭露選擇性 JSON
這裡有許多人,

### 註冊倉庫領収書 {#register-a-warehouse-receipt}

如果一個商務行動要成為一項簽署的交易,
公司收件號碼進入 `primary_reference`; 這本書 ID 是的
在交易承諾後生成.

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

在交易承諾後,生成的列表 RWA IDs. 鎖狀態路線
揭露了聖經 IDs; 在您使用事件或探索者詳細路線時,
需要匹配一個 ID 回到 `primary_reference` 或是傳達數據:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

也可以返回更豐富的預測:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### 暫時停留的轉移 {#transfer-with-a-temporary-hold}

使用生成的 RWA ID 這個例子假設
`alice` 是所有者,並配置為控制器
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

在連鎖外的過程完成時,釋放扣:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 添加控制和審查元數據 {#add-controls-and-audit-metadata}

控制與元數據是分別的.
申請或審計人員需要顯示的事實數據:

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

### 還款或退休金量 {#redeem-or-retire-quantity}

預購數量,當代表的外鎖資產已交付時;
這項方案必須有:
`redeem_enabled`, 簽名者必須是所有者或控制者.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 在遵守規定的審核期間停止使用 {#freeze-during-compliance-review}

經常的所有者經營會被封鎖.
簽名者必須是控制者, `freeze_enabled`.

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

在審核通過時,

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

呈現一張發票, RWA 存儲票數的批量
`primary_reference` 在註冊後, ID
轉移和償還.

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

在收取或支付的情況下, ID:

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

在不連鎖結算後,還原所代表的金額:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### 碳信用退休金 {#carbon-credit-retirement}

借錢還款後退休金.
指出連鎖以外的證書或登記證明:

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

### 兩種組合 {#merge-two-lots}

兩項離鎖位置的合并.
在同一領域使用相同的數量規格.
兒童群組 ID.

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

沒有任何問題. Python 交易的例子,查看
[實際財產](/zh-hant/guide/tutorials/python.md#real-world-assets).

## 有關文件 {#related-docs}

- [資產](/zh-hant/blockchain/assets.md)
- [數據表](/zh-hant/blockchain/metadata.md)
- [Iroha 特別指示](/zh-hant/blockchain/instructions.md)
- [詢問問題](/zh-hant/reference/queries.md#assets-nfts-and-rwas)
- [Torii 目的地](/zh-hant/reference/torii-endpoints.md#app-and-sora-route-families)
