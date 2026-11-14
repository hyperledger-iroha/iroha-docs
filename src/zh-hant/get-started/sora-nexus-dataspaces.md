---
translation_locale: zh-hant
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 3d2285e5a27819897b6dcc6d165c468baead29d2922420728fcfbe2433d36fdd
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# 在 SORA Nexus 上開發：Taira 與 Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA Nexus 提供以 Iroha 3 為基礎的公用部署環境。請先在 Taira 上開發與演練；只有在備妥獨立的主網金鑰、支付費用所需的真實 XOR，並獲得生產環境核准後，才將相同的用戶端配置方式移至 Minamoto。

本教學說明如何為 SORA Nexus 公用網路設定 Iroha 用戶端：

- Taira 測試網在 `https://taira.sora.org`
- Minamoto 主網在 `https://minamoto.sora.org`

使用 Taira 進行整合測試、由水龍頭資助的寫入 canary 測試和部署演練.只使用 Minamoto 用於生產準備的主網活動.兩個網路都在 XOR 收取費用:

- Taira 使用公共水龍頭的測試網 XOR.
- Minamoto 使用真實的 XOR.沒有 Minamoto 水龍頭.

## 建設者之路 {#builder-path}

|步驟|Taira 測試網|Minamoto 主要網|
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|開始閱讀網路狀態|查詢 `/status` 沒有鑰匙|查詢 `/status` 沒有鑰匙|
| 選擇資料空間 | 除非應用程式需要受治理的通道，否則使用公用的 `universal` | 取得主網核准後，才使用相同的資料空間 |
|獲得費用資產.|使用公眾的 Taira 水龍頭|從資助的 Minamoto 帳戶或經批准的財政流通中獲得 XOR|
|測試寫入|使用水龍頭資助的測試 XOR |不要使用測試工具; 寫入會耗用真正的 XOR |
|促進|繼續嘗試邏輯,監測和簽名處理|使用單獨的鑰匙,資金和釋放控制|

實際流程是:

1. 針對 Taira 開發用戶端，並使用公用的 `universal` 資料空間。
2. 新增一個簽字者,並用 Taira 水龍頭資助它.
3. 執行應用程式的邏輯與 Taira 相比,直到故障無聊和可觀察.
4. 建立一個獨立的 Minamoto 簽署者，以真實 XOR 為其提供資金，並且只將同樣經過驗證的操作移至主網。

## 繼續使用操作指南 {#continue-with-the-cookbook}

使用此指南來選擇網路,配置簽名器和資金費用.然後繼續使用與您想要構建的應用程式行為相匹配的操作指南:

|目標|操作指南|
| --- | --- |
|檢查 Taira 和配置一個客戶端 | [連線到 Taira](/zh-hant/cookbook/connect-to-taira.md)|
|傳送一個第一次寫下來,驗證結果| [提交和驗證交易](/zh-hant/cookbook/submit-and-verify-transactions.md) |
|註冊、鑄造和轉移價值| [性資產](/zh-hant/cookbook/fungible-assets.md) |
|閱讀過的申請狀態| [查詢賬本狀態](/zh-hant/cookbook/query-ledger-state.md) |
|應對提交的變化反應| [流動事件](/zh-hant/cookbook/stream-events.md) |

書籍將每個工作流程集中,並在需要 Taira 資金或 SORA Nexus 網路環境時連結到此處.

## 1. 瞭解你設定的目標 {#_1-understand-what-you-are-setting-up}

在 SORA Nexus 中，資料空間目錄定義資料空間。通道目錄則另外定義通道：每個通道參照一個資料空間，而一個資料空間可以包含多個通道。用戶端無法只靠修改 `client.toml` 就建立新的公用資料空間。用戶端設定執行兩件事：

1. 向客戶指向右端點 Torii
2. 為其規範帳戶選擇網路環境與簽署金鑰

`AccountId` 一律是規範識別碼，且不含網域；`client.toml` 也沒有網域設定：`[account].profile` 只選擇網路的 I105 前綴。網域脈絡屬於別名及網域擁有的物件。大多數應用程式應先使用公用的 `universal` 資料空間。網域脈絡使用 `domain.dataspace` 格式，例如：

```text
wonderland.universal
```

若需要新的組織資料空間，請準備目錄與路由提案，而非嘗試從一般用戶端帳戶註冊。請參閱下方的[佈建新的資料空間](#_8-provision-a-new-data-space)。

## 2. 檢查公眾 Torii 端點 {#_2-check-the-public-torii-endpoint}

在配置簽名器之前,請檢查目標終端直播.

對於 Taira:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

對於 Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

檢查節點提供的資料空間與通道檢視：

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

使用 `https://minamoto.sora.org/status` 的相同命令用於主網.

## Taira MCP 用於代理人 {#taira-mcp-for-agents}

Taira 還為代理執行階段公開了一個 Torii 原生的模型內容協定（MCP）橋。當代理需要即時 testnet 讀取、指令碼化診斷或經過嚴格審查的寫入演練，而又不想先建置自訂 Torii 使用者端時，請使用它。

|設定|價值|
| --- | --- |
|MCP 端點 |`https://taira.sora.org/v1/mcp`|
|網路根|`https://taira.sora.org`|
|預期使用|Taira 測試網讀取和水龍頭資助的寫入演練.|
|產量等價| 不要將此條目指向 Minamoto 除了主網外 MCP 端點和釋放控制明確批准 |

此橋接介面只接受無狀態的 JSON-RPC `POST` 請求。加入簽署材料前，請先檢查其探索中繼資料：

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'MCP-Protocol-Version: 2026-07-28' \
  -H 'Mcp-Method: server/discover' \
  -d '{"jsonrpc":"2.0","id":1,"method":"server/discover","params":{"_meta":{"io.modelcontextprotocol/protocolVersion":"2026-07-28","io.modelcontextprotocol/clientCapabilities":{}}}}' \
  | jq '{versions: .result.supportedVersions, server: .result._meta["io.modelcontextprotocol/serverInfo"].name, toolset: .result.capabilities.extensions["org.hyperledger.iroha/tools"].toolsetVersion}'
```

在代理執行階段中，將該 URL 設定為使用者本機 MCP 伺服器。不要將代理 MCP 設定、API 權杖、轉送的驗證標頭、`authority` 或 `private_key` 值提交到此檔案儲存庫或應用程式儲存庫。

代理提示規則與 Taira 工作良好:

- 在呼叫之前,從 MCP 伺服器中發現工具;如果伺服器報告 `listChanged`,重新發現.
- 寧願選用 `iroha.*`工具,而不是原始的 `torii.*`.
- 開始僅閱讀:在提出筆記之前檢查狀態,帳戶,資產,號,區塊,治理狀態和交易狀態.
- 在實時測試網路突變之前,需要明確的人類指示.對於預先簽署的交易封裝,請使用 `iroha.transactions.submit_and_wait`,以便代理只等待結果而不是僅提交.
- 在代理響應中總結交易雜湊,最終狀態和伺服器驗證錯誤.

### 開發工作流程與代理人 {#development-workflow-with-agents}

使用代理作為 Iroha 客戶端,交易構建者,診斷指令碼和測試網執行簿的開發助手.它可以檢查程式碼,讀取 Taira 狀態,提出更改和執行本地測試, 但它不應該轉變一個活躍的網路直到人類批准準確的操作.

實際的工作流程是:

1. 在編寫程式碼之前,請代理檢查相關的檔案, SDK 程式碼, CLI 命令或 MCP 工具計劃.
2. 讓代理先寫出最小的客戶端路徑:狀態檢查,帳戶搜尋,號解析度或餘額搜尋.
3. 只有在僅閱讀通話對 Taira 工作後,只新增交易構建程式碼.
4. 保持現實網路測試的選擇,例如在 `TAIRA_LIVE=1` 後面,以便正常的單元測試執行從來不花費測試網資金或取決於網路可用性.
5. 要求經紀人在提交任何交易之前報告網路根,鏈,授權主體帳戶,說明總結,費用資產和預期狀態變化.
6. 在將產生的程式碼推廣到 CI 或主網路工作流程之前，請檢查其秘密處理、重試行為、冪等性和拒絕處理。

只有閱讀的有用 MCP 開發工具包括帳戶資產查詢,別名解析,區塊查詢,交易查詢,交易列表,在提交任何簽署的有效載荷之前,使用這些來建立信心.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### 經過代理人的交易工作流程 {#transaction-workflow-through-agents}

MCP 橋樑可以提交簽署的 Iroha 交易,但它不刪除正常的交易要求. 交易仍然需要正確的授權主體,許可證,費用資金,鏈 ID,後設資料和簽名.

對於原始 Iroha 交易,先用 SDK 或 CLI 編寫和簽署交易封裝,然後只向代理提供規範的檔案.簽署的交易位元組編碼為 `body_base64`.代理人可以用 `iroha.transactions.submit_and_wait`提交封裝,或用 `iroha.transactions.submit`提交輪詢和 `iroha.transactions.wait`提交輪詢.

不要將私鑰貼上到代理提示中. 如果一個代理需要構建交易,請把它指向載入使用者執行階段的秘密的地方程式碼.經紀人永遠不應該將金鑰材料寫入Markdown、測試資料、日誌或 commit.

在提交交易之前,請讓代理人編寫一個簡短的交易計劃:

- `network`:Taira 測試網根和鏈 ID
- `authority`:簽署和支付費用的帳戶
- `instructions`：註冊、鑄造、銷毀、轉移,後設資料,許可或合同呼叫總結
- `fee asset`:將對 Taira 徵收資產
- `preflight reads`:已進行的帳戶,資產餘額,許可證,代名或區塊檢查
- `expected result`:確認後應該可見的狀態
- `idempotency`：重試相同要求時會發生什麼？

提交後,讓代理等待終端狀態,然後透過讀取查詢驗證狀態變化.有用的完成報告包括:

- 交易雜湊
- 終端狀態如 `Committed`, `Applied`, `Rejected`或`Expired`
- 在可用時,區塊或探險器細節
- 驗證閱讀結果
- 拒絕訊息和失敗是否像許可證,費用,驗證,陳舊狀態或終端可用性.

舉個例子:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

當已準備簽署的封裝時:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

處理 Taira MCP 作為公共測試網控制表面. Taira 鍵,測試網 XOR,水龍頭帳戶和 canary 簽署者是可一次性使用的,必須與 Minamoto 鑰匙和生產釋放工作流程保持分離.

## 你現在可以試玩具的例子 {#toy-examples-you-can-try-now}

這些示例只能閱讀,除非註明.它們在你生成金鑰之前工作,並且可以安全地對付兩個公共網路.

比較 Taira 測試網和 Minamoto 主網的健康:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

列出 Taira 提供的公用資料空間通道：

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

當您需要主網檢視時,執行同樣的命令對 Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

為儀錶板,機器人或部署檢查建立一個小的 Node.js 狀態探測器:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`, {
    headers: { Accept: 'application/json' },
  }).then((res) => res.json());
  const publicSpaces = status.teu_lane_commit
    .filter((lane) => lane.visibility === 'public')
    .map((lane) => `${lane.dataspace_alias}:${lane.block_height}`)
    .join(', ');

  console.log(
    `${name}: ${status.blocks} blocks, ${status.queue_size} queued, public spaces ${publicSpaces}`,
  );
}
EOF
```

首個寫入側練習應該是 Taira 水龍頭索賠.它使用測試網 XOR,並且永遠不應指向 Minamoto.

## 3. 建立一個 Taira 客戶端配置. {#_3-create-a-taira-client-config}

如果您還沒有一個鍵組,生成鍵組:

```bash
kagami keys --algorithm ed25519 --out-dir ./taira-client-key
```

建立 `taira.client.toml`:

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
# The exact `network_id` from https://taira.sora.org/v1/accounts/capabilities
network_id = "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774"
torii_url = "https://taira.sora.org/"

[account]
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

頂層的 `chain` 是確切的 Taira 交易鏈 ID，而 `network_id` 是每個簽章綁定的確切網路身分。請在 `network_id` 與 `network_id_file` 之間恰好設定其中一項。`[account].profile = "taira"` 設定會獨立選擇 Taira 的 I105 鏈識別值。鏈 ID 不會選擇帳戶設定檔。

執行僅閱讀的檢查:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

在寫入測試之前,執行公開的 Taira 診斷:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

執行需要付費的寫入前，請先透過水龍頭為 Taira 帳戶注資。預先準備交易的水龍頭流程，請參閱[在 Taira 領取測試網 XOR](#_4-get-testnet-xor-on-taira)。

帳戶注資後，可選擇以簽署的日誌指令進行寫入冒煙測試。每筆提交的交易都會指定費用支付者，而 CLI 會在簽署前報出確切費用：

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  tx ping --msg "taira smoke test"
```

此命令會等待確認。Taira 是公用測試網，因此即使水龍頭本身正常運作，佇列飽和仍可能使 ping 失敗。若 `taira doctor` 回報佇列飽和，或 ping 回傳 `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`，請先等待並重試，再判斷是否為用戶端設定錯誤。

執行無人值守的冒煙測試時，請將 ping 放入重試次數有限的迴圈：

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml --fee-payer authority \
    tx ping --msg "taira smoke test" && ok=true && break

  sleep 60
done

test "$ok" = true
```

如果 `iroha taira doctor` 顯示出嚴重失敗,停止重新試驗.排隊和收費拒絕是公共測試網路的過渡條件;DNS, TLS 或 `status = "fail"`診斷不是.

## 建立一個 SORA Nexus 帳戶 ID {#generate-a-sora-nexus-account-id}

SORA Nexus 帳戶 ID 是由帳戶公鑰與目標網路前綴衍生的規範 I105 位址。同一把公鑰在 Taira 與 Minamoto 上會編碼為不同的 ID；生產環境使用者應另外為 Minamoto 產生一組金鑰對。

建立或載入將控制帳戶的Ed25519鍵組:

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
```

轉換公鑰為 Taira 帳戶 ID:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

轉換一個 Minamoto 公共金鑰,使用主網前:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

凡是 SORA Nexus API 或 CLI 命令要求規範帳戶 ID 的地方，都應使用產生的帳戶 ID，例如餘額查詢、嚴格帳戶欄位或別名綁定。請將對應的私鑰保存在用戶端設定中，並透過 `[account].profile = "taira"` 或 `[account].profile = "minamoto"` 選擇相同的公用網路。

生成 ID 本身並不能建立一個資助的連鎖帳戶.在 Taira 上,水龍頭可以建立和資助測試網寫帳戶.在 Minamoto 上,使用已批准的主網安裝或財政流程.

### 關鍵儲存和備份 {#key-storage-and-backup}

帳戶 ID 和公鑰可以共享.相匹配的私鑰,密碼短語,種子和恢復材料必須被保密.

在 SORA Nexus 帳戶中使用這些實踐:

- 儲存私鑰在加密密碼管理器,硬體支援的關鍵儲存器或專用簽字服務中.不要將金鑰交給源控制,也不要把生產金鑰留在 Shell 歷史記錄,日誌,聊天,門票或未加密備份中.
- 使用每個保險櫃或生產簽名器的獨特高密碼. 儲存密碼在密碼管理器或分類保管過程中,而不是與加密私鑰相同的檔案或備份捆綁中.
- 保持 Taira 和 Minamoto 的金鑰分開,把 Taira 的金鑰作為一次性測試網材料和 Minamoto 的金鑰當作生產資金授權主體.
- 備份私鑰,公鑰,帳戶 ID,帳戶配置檔案以及任何需要恢復簽署者的帳戶恢復或儲存記錄.在恢復過程中很容易濫用沒有網路文字的私鑰.
- 保持至少一個加密的離線備份和一個地理位置分開的加密備份,用於生產簽名器.在依賴備份之前測試恢復,只需進行小型讀取操作.
- 如果私鑰,密碼短語,備份媒體或簽名主機可能被曝光,請旋轉或更換籤名器.

詳細見 [儲存密碼金鑰](/zh-hant/guide/security/storing-cryptographic-keys.md)和 [密碼安全](/zh-hant/guide/security/password-security.md).

## 4. 獲取測試網 XOR 在 Taira {#_4-get-testnet-xor-on-taira}

使用 CLI 預先準備交易的水龍頭流程領取測試網 XOR。水龍頭會為 `taira.client.toml` 中設定的帳戶注資；若帳戶尚不存在，會先註冊。流程如下：

1. 讀取公用水龍頭政策：水龍頭授權主體、費用資產及金額。
2. 準備領取申請。CLI 會完成工作量證明，驗證 Torii 準備並簽署的確切交易，然後將交易儲存至僅限私人存取的日誌目錄，不予提交。
3. 將已儲存的交易提交一次。
4. 等待資產餘額可見後，再傳送需要付費的寫入。

讀取政策：

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
  -H 'Accept: application/json' \
  | tee ./taira-faucet-policy.json \
  | jq .
```

答案是這樣的:

```json
{
  "schema_version": 1,
  "network_id": "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774",
  "network_prefix": 369,
  "authority": "<TAIRA_FAUCET_AUTHORITY_I105>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "amount": "25000"
}
```

該政策是未簽署的探索資料。自動化程序應固定預期的授權主體、資產定義與金額，而非信任每次回應。`prepare` 會拒絕與您傳入值不符的預備交易。

準備並提交領取申請：

```bash
export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' ./taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' ./taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' ./taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` 會以私人存取權限建立日誌目錄，並拒絕取代既有目錄，因此每次領取申請都應使用新目錄。水龍頭是公用測試網服務。若 `submit` 回報 `Pending`、逾時或收到 `502`，請使用相同的設定與日誌執行 `taira account faucet resume`，而非準備另一筆申請。過期的工作量證明錨點會使 `prepare` 失敗；請在新的日誌目錄中重新準備。

然後在提交您自己的付費交易之前,查詢資產:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

若領取申請已套用，但資產尚不可見，請先等待並重試讀取，再傳送寫入。

水龍頭僅適用於 Taira 測試網資金.在 Minamoto 流動中,不要使用測試網 XOR,水龍頭帳戶或 Taira canary 簽署者.

## 5. 建立一個 Minamoto 客戶端配置. {#_5-create-a-minamoto-client-config}

使用 Minamoto 單獨的鍵組.不要重複使用 Taira 關鍵在主網上.

建立 `minamoto.client.toml`:

```toml
chain = "00000000-0000-0000-0000-000000000753"
# The exact `network_id` from https://minamoto.sora.org/v1/accounts/capabilities
network_id = "<MINAMOTO_NETWORK_ID>"
torii_url = "https://minamoto.sora.org/"

[account]
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

頂層的 `chain` 是目前 SORA Nexus 主網的鏈 ID，而 `network_id` 是 Minamoto 的確切網路身分；首次執行簽署操作前，請從能力路由讀取它。`[account].profile = "minamoto"` 會選擇 Minamoto 的 I105 鏈識別值；端點主機名稱與鏈 ID 不會隱含地選擇此值。

將 Minamoto 公共金鑰轉換為其規範的 I105 帳戶 ID,並附上主網前:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

在帳戶透過主網上登入或管理流程提供儲備和資金之前,僅進行閱讀側檢查:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

請勿對 Minamoto 執行 Taira 水龍頭或冒煙測試命令。

## 6. 在 XOR 中資助 Minamoto 帳戶. {#_6-fund-a-minamoto-account-with-xor}

Minamoto 費用由生產 XOR 支付,而 Minamoto 沒有公共水龍頭.透過批准的主網登入或財政轉賬來資助配置的帳戶,或者從現有資助的 Minamoto 帳戶中獲得 XOR.

在提交筆記之前,請檢查規範帳戶 ID 和資金使用僅閱讀檢查. 作為生產資金,將 Minamoto XOR 視為生產資金:先在 Taira 上練習同樣的操作,保留單獨的生產金鑰,不要假設可以重置主網交易.

Taira XOR 不能支付 Minamoto 費用.測試網餘額和水龍頭索賠不會轉移到 Minamoto.

## 7. 在既有資料空間中工作 {#_7-work-inside-an-existing-data-space}

對於位於資料空間內的帳本物件，請使用完整限定網域名稱。例如，公用資料空間中的專案網域應使用：

```text
apps.universal
```

在您的帳戶獲得所需許可權後,為域名建立一個無秘密的 `AliasSetupPlanRequestV1` 意圖,並使用宣告計劃器:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

對於 Minamoto,生成並批准單獨的主網意圖和計劃.計劃與其鏈,授權主體,現實狀態和截止日期有關,因此不能推廣或重播 Taira 計劃:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

帳戶別名使用相同的資料空間後綴：

```text
alice@apps.universal
alice@universal
```

嚴格帳戶欄位仍然使用規範 I105 帳戶 IDs.將別名視為可以讀取的人類的繫結,並解決規範帳戶 IDs.

## 8. 佈建新的資料空間 {#_8-provision-a-new-data-space}

新增資料空間涉及營運與治理變更。公用 Torii 端點可以將流量路由至已設定的資料空間，但會拒絕未知的資料空間別名。

在準備更改之前,捕捉當前的現場目錄:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

對於運營商帳戶,請檢查通道表姿勢:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

只有在通道 ID、資料空間 ID、驗證者集合、容錯能力、清單、路由規則及營運負責方已一併審查後，才可正式啟用新別名。具備所需權限的一般使用者帳戶，可以透過別名規劃器在既有資料空間內取得網域及其 SNS 租約；該帳戶無法安全地新增公用資料空間。

對於私有或組織資料空間，請準備包含下列項目的目錄變更：

- 唯一的資料空間別名與數值 `id`
- 一個相匹配的通道入口或現有通道分配
- 資料空間的 `fault_tolerance`
- 路由指令或帳戶範圍的規則,應在此登陸
- 若資料空間提供 UAID 能力，則需提供空間目錄清單或等效的部署證據
- 對驗證器,合規性,結算和監測政策的治理批准

一個可檢視的配置片段是這樣的:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "payments"
description = "Payments lane"
dataspace = "payments"
visibility = "public"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "payments"
id = 20
description = "Payments dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "payments"
[nexus.routing_policy.rules.matcher]
instruction = "transfer::asset"
description = "Route asset transfers to the payments dataspace"
```

運營商的接受應包括以下門戶:

- `iroha3d --sora --config <config.toml> --trace-config` 傳輸已解決的節點配置
- 生成或檢查的清單是用雜湊和簽名存檔的
- 在任何 Minamoto 促銷之前,冒煙測試透過 Taira
- 變更後的 `/status` 目錄顯示預期的通道與資料空間
- `iroha app nexus lane-report --summary` 沒有報告缺失所需的清單

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

只有在 Taira 部署、冒煙測試、監控及治理證據皆已完成後，才將相同的資料空間推進至 Minamoto。

## 相關頁面 {#related-pages}

- [安裝 Iroha 3](/zh-hant/get-started/install-iroha.md)
- [透過 CLI](/zh-hant/get-started/operate-iroha-via-cli.md)執行 Iroha 3
- [為私有資料空間贊助費用](/zh-hant/get-started/private-dataspace-fee-sponsor.md)
- [Torii 端點](/zh-hant/reference/torii-endpoints.md)
- [創世記引用](/zh-hant/reference/genesis.md)
