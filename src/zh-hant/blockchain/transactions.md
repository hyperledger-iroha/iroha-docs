---
translation_locale: zh-hant
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 交易 {#transactions}

其他國家 **交易** 這是一個簽名的要求,
可執行的有效負荷可能是
[指示](./instructions.md), 請負電話, IVM 字體代碼,或
證明了 IVM 執行死刑. [智能合同](./smart-contracts.md) 在目前的情況下
合同執行模式.

交易進行變化狀態或可執行的工作.
使用簽名查詢或公開閱讀端點,並不創建交易.

預約區塊中被允許的交易,
在封鎖之前拒絕的申請
接入,例如無效的封筒或被排隊拒絕的交易;
沒有被儲存在一個街區.

對於保護隱私權的資產移動,請見
[匿名交易](./anonymous-transactions.md). 沒有名稱
交易使用保護的資產票,承諾,廢除符號,
沒有知識證明,而不是公眾帳戶對帳戶平衡變化.

檢查已選定的透明執行效果的證據,
[FastPQ](./fastpq.md). FastPQ 在正常情況下,
執行交易,並建立支持的確定性證據批量
國家的轉型.

## 試著使用 Taira {#try-it-on-taira}

使用探險者路線檢查最近的公眾 Taira 區塊和交易
沒有簽名帳戶的狀況:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

若要追蹤您的應用程式之前提交的交易, `hash` 來自:
列出並檢查探險人員的詳細路線:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

還是只能閱讀. Norito
封筒,正确的鎖 ID, 收費金屬數據, Taira 預算時間

請問有哪些例子可以使用 Taira, 拯救水龙头助手
[獲得測試網 XOR 在 Taira](/zh-hant/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
這樣的 `taira_faucet_claim.py`, 然後透過公共水, 提供資金給簽約者.
首先:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

如果水龙头拼圖或索取路徑返回 `502`, 等待再試一次
檢查交易本身的情況.

接著將 Taira 在提交交易時,收費資產元數據:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## 在線交易 {#offline-transactions}

Iroha 有兩種離線交易工作流程:

- **在線簽名** 在簽名期間, 建立正常簽署的交易
  交易不會處理,
  客戶將簽名封面提交給 Torii, 所以它仍然需要
  正確的連鎖 ID, 這項交易的使用時間,
- **卡格莫沙無線現金** 在網路上使用時,
  收件人啟動的錢包到錢包交付,而兩個錢包都是
  在無線,並在收件人返回時換取所產生的留言狀態
  在網路上.

Torii 顯示Kagemusha的全生命周期 `/v1/offline/*`:

| 方法和終點 | 目的 |
| --- | --- |
| `GET /v1/offline/readiness` | 評估 Kagemusha 的準備 `asset_definition_id` |
| `POST /v1/offline/receiver-lineage` | 解決已簽署的收件人申請的證據顯示的積極登記系統 |
| `POST /v1/offline/top-up` | 提交簽署的線上到離線補充操作 |
| `POST /v1/offline/redeem` | 提交已簽署的無線收購操作 |
| `GET /v1/offline/operations/{operation_id}` | 閱讀補充或償還的法典狀態 |

在開啟無線運營之前,檢查該資產的準備狀況:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

準備將錢包連接到活跃的橋 ABI 21 且已得到認證 V4
系統,補充和償還要求使用輸入
`application/x-norito` 檔案. 補充和償還 `202 Accepted`
有一個 `Location` 標題指向操作資源;嵌入式
沒有零的操作 ID 提供無權關鍵.

流量通常是:

1. 請查詢準備狀態, `ready` 是假的或任何阻擋措施都適用.
2. 使用打字 Swift 或是 JVM 為了建立法典補充檔案的錢包,
   提交,並保留輸入記錄狀態和運作 ID 在此之前,
   運行達到最後的連鎖狀態.
3. 在需要時解決接收器登記系統,
   檢查每個同行交付本地,並保留加密的註冊狀態
   在承認轉移之前.
4. 當接收者上線時,
   提供,並調查其運營資源.

在註冊狀態之前, 帳戶無法觀察矛盾的離線交付
在網路生命周期中返回.
因此實行價值限制,過期期期,被接受的發行者,持久本地
存儲和調停窗口.

這裡是建立新交易的例子, `Grant`
在此交易中, 鼠標授予阿里斯所指定的權利.
角色 (`role_id`檢查
[完整的例子](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
