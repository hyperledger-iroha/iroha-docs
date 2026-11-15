---
translation_locale: zh-hant
translation_source: /blockchain/transactions.md
translation_source_hash: d9227effcdb4d54ac76f6288ba213de20f2574e1585e13b96a5202c44b69f3be
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
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

這仍然是唯讀操作。提交交易需要簽署的 Norito 封裝、正確的鏈 ID 與網路 ID、明確的費用支付者，以及已由測試網資金服務注資的 Taira 帳戶。

執行 Taira 上需要支付費用的範例前，請透過[在 Taira 取得測試網 XOR](/zh-hant/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)所列的資金申領流程，先為簽署帳戶注資，再檢查費用資產餘額：

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

若測試網資金服務的路由回傳 `502`，請先等待並重試，再對交易本身進行偵錯。

接著在提交交易時選擇費用支付者。指定 `--fee-payer authority` 時，由簽署帳戶支付；CLI 會在簽署前以 Taira 的費用資產計算確切費用：

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "faucet-funded taira transaction"
```

## 離線交易 {#offline-transactions}

Iroha 有兩種離線交易工作流程:

- **離線簽署**會在簽署裝置中斷連線時建立一般的已簽署交易。線上上使用者端將已簽署封包提交給 Torii 之前，交易不會被處理，因此它仍需正確的鏈 ID、許可權主體、許可權、費用和交易生命週期。
- **Kagemusha 離線現金**可在已註冊且受硬體保護的錢包連線時載入價值，支援兩個錢包都離線時的錢包間付款，並在錢包再次連線時將剩餘價值卸載至帳本帳戶。

Torii 提供一條 Kagemusha 變更路由：`POST /v1/kagemusha/enrollment`。它接受經帳戶驗證的 `application/x-norito` 註冊框架，並傳回不得快取的私密回應。`/v1/kagemusha/{scheme}/wallets/{wallet}/` 下由帳戶簽署的 SDK 讀取路由會傳回 Load 收據與最終性證據；這些路由未列於 `/openapi.json`。生命週期的帳本部分使用一般簽署交易，內含 `KagemushaWalletLedgerV1` 指令：

| 動作 | 用途 |
| --- | --- |
| `Activate` | 啟用已註冊的錢包；原生啟動驗證為必要步驟 |
| `IssueLoad` | 以原子方式扣除支付者餘額，並記錄錢包的下一筆 Load |
| `Unload` | 將完整 Unload 申領支付至其綁定帳戶，最多支付一次 |
| `ClaimFee` | 將完整費用申領支付至其固定受益者 |
| `Abandon` | 放棄尚未使用的註冊 |

典型流程如下：

1. 使用具備型別介面的 Swift 或 Android 錢包，透過 `/v1/kagemusha/enrollment` 註冊錢包，然後啟用它。
2. 提交 `IssueLoad` 交易。執行時會檢查預期的下一筆 Load 序號，以及非零的請求 ID，因此過期或經修改的重試會失敗。若回應遺失，請讀取原始 Load 收據，而不是再簽署另一筆 Load。
3. 在錢包離線期間，於本機交換並驗證錢包間付款，且在確認每筆轉帳之前持久儲存錢包狀態。
4. 錢包再次連線後，提交其 Unload 申領並等待最終性。

Kagemusha 尚未通過發布資格認證：真實資金環境下的資格認證，以及在實體裝置上進行的手機註冊、啟用與付款，仍未完成。

在票據狀態透過線上生命週期回傳之前，帳本無法發現互相衝突的離線交接。因此，錢包與營運方原則應強制執行價值上限、到期時間、核准發行方、持久化本機儲存與對帳時限。

以下範例使用 `Grant` 指令建立新交易。在該交易中，Mouse 將指定角色（`role_id`）授予 Alice。請參閱[完整範例](./permissions.md#register-a-new-role)。

```rust
let grant_role = Grant::account_role(role_id, alice_id);
// `network_id` is the target network's `NetworkId`; the fee intent is bound
// into the signature (use the intent returned by a fee quote).
let grant_role_tx = TransactionBuilder::new(
    network_id,
    mouse_id,
    FeePaymentIntent::authority(Vec::new(), None),
)
.with_instructions([grant_role])
.sign(&mouse_private_key);
```
