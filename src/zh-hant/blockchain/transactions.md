---
translation_locale: zh-hant
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 交易 {#transactions}

**交易**是執行區塊鏈作業的已簽署請求。其可執行的 payload 可以是依序排列的[指令](./instructions.md)、合約呼叫、IVM 位元組碼，或附帶證明的 IVM 執行。現行合約執行模型請參閱[智慧合約](./smart-contracts.md)。

交易執行狀態變化或可執行的工作.僅閱讀檢查使用簽署的查詢或公開閱讀端點,並不會建立交易.

已提交的區塊中被錄取的交易與其執行結果,包括執行拒絕儲存.在區塊錄取之前被拒絕的請求,如無效封裝或排隊拒絕的交易,不會儲存在區塊中.

關於保護隱私的資產流動,請參見 [匿名交易](./anonymous-transactions.md).匿名交易使用遮蔽的資產票據,承諾,取消符號和零知識證明,而不是公開帳戶到帳戶餘額變化.

對於選擇透明執行效果的證據,請參見 [FastPQ](./fastpq.md). FastPQ 在正常交易執行後消耗了執行見證人,併為支援狀態過渡構建了確定性證明批次.

## 在 Taira 試看. {#try-it-on-taira}

使用探索者路線檢查最近的公開 Taira 區塊和交易狀態,而不需要簽署帳戶:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

為了跟蹤您的應用程式之前提交的交易, 從列表中複製`hash`並檢查探索者的詳細路線:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

這仍然是唯讀操作。提交交易需要已簽署的 Norito 封包、正確的鏈 ID、費用中繼資料，以及透過水龍頭取得資金的 Taira 帳戶。

對於支付費用的例子 Taira, 拯救水龍頭助手 [獲取測試網 XOR 在 Taira](/zh-hant/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) 作為 `taira_faucet_claim.py`, 然後透過公共水龍頭來資助簽署者:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

如果水龍頭拼圖或索賠路徑返回 `502`,在除錯交易之前,等待並再次嘗試.

然後,在提交交易時附加 Taira 費用資產的後設資料:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## 離線交易 {#offline-transactions}

Iroha 有兩種離線交易工作流程:

- **離線簽署**會在簽署裝置中斷連線時建立一般的已簽署交易。線上上使用者端將已簽署封包提交給 Torii 之前，交易不會被處理，因此它仍需正確的鏈 ID、許可權主體、許可權、費用和交易生命週期。
- **Kagemusha 離線現金**會在錢包上線時儲值，支援兩個錢包均離線時由接收方發起的錢包間交接，並在接收方恢復上線後贖回產生的票據狀態。

Torii 透過 `/v1/offline/*` 提供完整的 Kagemusha 生命週期：

| 方法與端點 | 用途 |
| --- | --- |
| `GET /v1/offline/readiness` | 評估一個 `asset_definition_id` 的 Kagemusha 就緒狀態 |
| `POST /v1/offline/receiver-lineage` | 為已簽署的接收方請求解析附有證明的有效註冊譜系 |
| `POST /v1/offline/top-up` | 提交已簽署的線上轉離線儲值操作 |
| `POST /v1/offline/redeem` | 提交已簽署的離線贖回操作 |
| `GET /v1/offline/operations/{operation_id}` | 讀取儲值或贖回的規範狀態 |

建構離線操作前，請檢查該資產的就緒狀態：

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

就緒檢查會將錢包繫結至目前啟用的橋接 ABI 21 與已驗證的 V4 成品集。註冊譜系、儲值和贖回請求使用具型別的 `application/x-norito` 封存檔。儲值和贖回會回傳 `202 Accepted`，其 `Location` 標頭指向操作資源；其中內嵌的非零操作 ID 用作冪等鍵。

典型流程如下：

1. 查詢就緒狀態；如果 `ready` 為 false 或存在任何阻斷項目，便停止。
2. 使用型別安全的 Swift 或 JVM 錢包建構並提交規範儲值封存檔；在操作達到最終鏈上狀態前，保留輸入票據狀態和操作 ID。
3. 必要時解析接收方註冊譜系，在本機建構並驗證每次點對點交接；確認轉移前，持久儲存加密的票據狀態。
4. 接收方上線後，建構並提交規範贖回封存檔，然後輪詢其操作資源，直到達到最終狀態。

在票據狀態透過線上生命週期回傳之前，帳本無法發現互相衝突的離線交接。因此，錢包與營運方原則應強制執行價值上限、到期時間、核准發行方、持久化本機儲存與對帳時限。

以下範例使用 `Grant` 指令建立新交易。在該交易中，Mouse 將指定角色（`role_id`）授予 Alice。請參閱[完整範例](./permissions.md#register-a-new-role)。

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
