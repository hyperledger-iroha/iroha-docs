---
translation_locale: zh-hant
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 交易 {#transactions}

交易是一個簽署的請求來執行在區塊鏈上的工作.可執行的有效載荷可以是有序的序列 [指令](./instructions.md), 一個合同調用, IVM 字節代碼,或一個被證明的 IVM 執行死刑. [智能合同](./smart-contracts.md) 對於當前的合同執行模式.

交易執行狀態變化或可執行的工作.僅閱讀檢查使用簽署的查詢或公開閱讀終端點,並不會創建交易.

已提交的區塊中被錄取的交易與其執行結果,包括執行拒絕存儲.在區塊錄取之前被拒絕的請求,如無效包裹或排隊拒絕的交易,不會存儲在區塊中.

關於保護隱私的資產流動,請參見 [匿名交易](./anonymous-transactions.md).匿名交易使用屏蔽的資產紙幣,承諾,取消符號和零知識證明,而不是公開賬戶到賬戶餘額變化.

對於選擇透明執行效果的證據,請參見 [FastPQ](./fastpq.md). FastPQ 在正常交易執行後消耗了執行見證人,併爲支持狀態過渡構建了確定性證明批量.

## 在 Taira 試看. {#try-it-on-taira}

使用探索者路線檢查最近的公開 Taira 區塊和交易狀態,而不需要簽署賬戶:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

爲了跟蹤您的應用程序之前提交的交易, 從列表中複製`hash`並檢查探索者的詳細路線:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

提交交易需要簽署的 Norito 包裹,正確的鏈接 ID,費用元數據和一個頭資助的 Taira 賬戶.

對於支付費用的例子 Taira, 拯救水龍頭助手 [獲取測試網 XOR 在 Taira](/zh-hant/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) 作爲 `taira_faucet_claim.py`, 然後通過公共水龍頭來資助簽署者:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

如果水龍頭拼圖或索賠路徑返回 `502`,在調試交易之前,等待並再次嘗試.

然後,在提交交易時附加 Taira 費用資產的元數據:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## 離線交易 {#offline-transactions}

Iroha 有兩種離線交易工作流程:

- 在線簽字創建一個正常的簽名交易,而簽名設備被斷開.在網上客戶端向 Torii 提交簽名包裹之前,該交易不會進行處理,因此它仍然需要正確的鏈接 ID,權威,許可證,費用和交易壽命.
- 在網上時,Kagemusha在線現金充滿錢包,支持接收者啓動的錢包到錢包交付,同時兩者都當收件人返回網上時,收取結果的筆記狀態.

Torii 將整個Kagemusha生命週期暴露在`/v1/offline/*`下:

|方法和終點|目的|
| --- | --- |
|`GET /v1/offline/readiness`|評估 Kagemusha 的準備性 `asset_definition_id` |
|`POST /v1/offline/receiver-lineage`|解決簽署的收件人請求的有效登記譜系|
|`POST /v1/offline/top-up`|提交已簽署的在線到離線補充操作|
|`POST /v1/offline/redeem`|提交一個簽署的離線贖回操作|
|`GET /v1/offline/operations/{operation_id}`|閱讀補充或贖回的法規狀態|

在構建離線運營之前,檢查資產的準備性:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

準備將錢包連接到活躍的橋樑. ABI 21 證實 V4 後代,補充和贖回請求使用輸入 `application/x-norito` 存檔,補充和贖回 `202 Accepted` 有一個 `Location` 標題指向操作資源;嵌入式非零操作 ID 提供了無權的鑰匙.

典型的流量是:

1. 如果 `ready` 是假的或任何阻塞器適用,請查詢準備性和停止.
2. 使用打字的 Swift 或 JVM 錢包構建常規補充檔案,提交它,並保留輸入筆記狀態和操作 ID,直到操作達到最終鏈狀態.
3. 在需要時解決接收者註冊後代,本地構建和驗證每個同行傳遞,並在確認轉移之前保持加密的筆記狀態.
4. 當接收者在網上時,建立了法典贖回檔案,提交,並對其運營資源進行調查.

在網上生命週期中,筆記本無法觀察到相互矛盾的離線轉移.因此,錢包和運營商政策應強制執行價值限制,過期期限,接受發行人,可持續的本地存儲和和解窗口.

以下是使用 `Grant` 指令創建新交易的一個例子. 在此交易中,鼠標正在賦予愛麗絲指定的角色 (`role_id`).查看 [完整例](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
