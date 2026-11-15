---
translation_locale: zh-hant
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 2ca4fc00709839879fe9cb7ea5e5f697505e5e25d4e5a6cd0bd18d406f6e2846
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# 為私有資料空間贊助費用 {#sponsor-fees-for-a-private-data-space}

SORA Nexus 費用贊助方案可支付符合資格、且路由至私有資料空間的交易所需的全域執行費用。使用者仍須簽署完整交易。具型別的 `FeePaymentIntent` 會選定確切的贊助方案與不可變修訂版、必要的 gas 上限，以及最高收費金額。

資料空間目錄項目不會建立獨立簽署的根。獨立資料空間根有自己的已提交費用貨幣與政策；公開贊助金庫不能授權支付該私有根的費用。設計贊助機制前，請先確立執行根。

## 1. 確立已提交的費用政策 {#_1-establish-the-committed-fee-policy}

簽署的創世資料定義一個包含 `RootFeePolicy` 的 `root_fees_v1` 自訂參數，綁定費用貨幣、費用去向、贊助資金保管帳戶、申領豁免項目及費率。每個一般區塊與每次報價都使用各自捕獲的已提交政策。經授權的費率、費用去向與申領豁免項目變更從下一個區塊開始生效；費用貨幣與贊助資金保管帳戶在第一個區塊之後便無法變更。

在全域執行中，原生費用會銷毀簽署網路所指定的確切 XOR 貨幣，由贊助方案的金庫提供該貨幣。節點設定與交易中繼資料不會選擇支付者，也不會啟用贊助。

請使用網路的標準貨幣與帳戶身分。別名解析不得改變已提交的貨幣、保管帳戶或費用去向身分。

## 2. 建立贊助方案並注資 {#_2-create-and-fund-a-sponsor-program}

方案 ID 的形式為 `<canonical-sponsor-account>/<program-name>`。請透過目前 SDK 與資料模型提供的型別化指令建立方案：

| 指令 | 用途 |
| --- | --- |
| `CreateFeeSponsorProgram` | 建立待啟用的方案，並設定必要的付款帳戶。 |
| `StageFeeSponsorProgramRevision` | 定義一套不可變的資格、操作與預算政策。 |
| `EnrollFeeSponsorBeneficiary` | 在鏈上登記符合資格的受益者。 |
| `FundFeeSponsorProgram` | 將資產轉入保管帳戶，並記入確切方案金庫的餘額。 |
| `ActivateFeeSponsorProgramRevision` | 排定待啟用修訂版最早可啟用的高度。 |

方案管理須由贊助者或明確委派的管理者授權。提款必須由贊助者本人授權，且只有在方案暫停或關閉中時，才可將資金退回方案所記錄的付款帳戶。

每個修訂版指定：

- 明確登記的資格，或登記資格加上獲准的路由預設資格；
- 針對確切原生指令傳輸 ID，或合約位址、程式碼雜湊與進入點的允許及拒絕規則；
- 每種資產在單筆交易、單一區塊、方案時期及受益者時期內的額度；
- 最低儲備額與確定性的時期長度。

拒絕規則優先於允許規則。資料空間的 `fee_sponsor_program_id` 只有在目前有效修訂版允許時，才會授予路由預設資格；交易仍須明確指定確切的方案與修訂版。啟用可能延後，直到前一修訂版尚未結清的配置額度到期。

贊助金庫的資產必須採用 `Global` 餘額政策。只為贊助者的一般帳戶注資，不會為隔離的方案金庫注資；一個方案也不能動用另一個方案的餘額。

## 3. 取得報價、簽署並提交確切交易 {#_3-quote-sign-and-submit-the-exact-transaction}

SDK 整合依序執行下列步驟：

1. 建立尚未簽署的 `TransactionPayload`，包含授權主體、可執行內容、時間戳記、nonce、中繼資料、確切的贊助方案修訂版，以及任何必要的 gas 上限。最高收費金額最初可以留空。
2. 以帳戶簽署包含 `{"payload": <payload>}` 的 `POST /v1/fees/quote` 請求。請求簽署者必須是交易的授權主體。
3. 檢查觀測高度、已解析的資料空間路由、費用項目、扣款來源及贊助容量。確認回應保留所選支付者、修訂版與 gas 上限。
4. 只將 `payload.fee_payment` 替換為建議意圖，然後簽署並提交這份確切負載。
5. 追蹤交易，直到它在狀態中確認為具有最終性的 `Applied`，並保留收據，包括實際使用的贊助方案、修訂版與收費金額。

報價只觀察帳本，不會預留容量。進入佇列時會重新檢查資格，並預留簽署的最高額度。贊助者拒絕時，交易會被拒絕，不會改向使用者收費。

CLI 也會明確指定同一費用來源。例如，當方案已允許這筆確切的資產轉移，且帳戶符合資格時：

```bash
iroha --config ./user.client.toml \
  --fee-payer sponsor \
  --fee-program '<SPONSOR_CANONICAL_I105>/team-payments' \
  --fee-program-revision 1 \
  ledger asset transfer \
  --definition '<ASSET_DEFINITION_BASE58>' \
  --account '<USER_CANONICAL_I105>' \
  --to '<RECIPIENT_CANONICAL_I105>' \
  --quantity 1
```

請使用您網路上目前有效的修訂版與確切識別碼。使用者設定只包含該使用者的簽署者；提交符合資格的贊助交易不需要贊助者的私鑰。

## 4. 決定使用者是否支付應用程式費用 {#_4-decide-whether-the-user-pays-an-application-fee}

贊助者可以支付全域費用，而應用程式完全不向使用者收費。若應用程式收取本地代幣，請在使用者簽署的可執行內容中明確定義該轉移或合約規則。將每項操作納入贊助修訂版的政策，並檢查完整負載的報價。不要從網路費用意圖推定會發生應用程式代幣轉移。

## 診斷拒絕原因 {#diagnose-a-refusal}

請使用節點回傳的穩定費用代碼與處理建議：

| 代碼 | 檢查項目 |
| --- | --- |
| `program_not_found` | 確切的標準方案身分。 |
| `revision_not_active`, `program_not_active` | 修訂版的啟用狀態與方案生命週期。 |
| `beneficiary_not_eligible` | 登記資格或獲准的路由預設資格。 |
| `operation_not_allowed`, `operation_denied` | 每項確切的簽署操作及拒絕規則。 |
| `invalid_gas_limit`, `signed_limit_exceeded` | 將 gas 上限與簽署的最高額度對照最新報價。 |
| `vault_insufficient` | 此方案指定貨幣金庫的已注資餘額。 |
| 預算耗盡代碼 | 單筆交易、單一區塊、方案時期與受益者時期的可用額度。 |

調查結果不明確的提交時，請保留原始交易雜湊及費用拒絕詳情。建立替代交易之前，先確認原交易的狀態。

## 固定版本的來源 {#pinned-sources}

- [費用政策、方案生命週期與報價協定](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/nexus_fee_model.md)
- [具型別的贊助方案指令](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_data_model/src/isi/nexus.rs)
- [CLI 費用來源選項與資產轉移](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)
- [資料空間設定](/zh-hant/get-started/sora-nexus-dataspaces.md)
