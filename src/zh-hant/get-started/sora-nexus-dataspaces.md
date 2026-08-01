---
translation_locale: zh-hant
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 63c317ab61ba912176c43c83d5b4f026f23a7a6e5fb633872a133c9ea1295686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 建立在 SORA 3:Taira 和 Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3是基於應用程序的公共部署軌道 Iroha 3 和 SORA Nexus. 建立和練習在 Taira 首先,然後移動相同的客戶端形狀到 Minamoto 只有當你有單獨的主網鑰匙時,真正的 XOR 費用和生產批准.

這本教程展示瞭如何配置一個 Iroha 客戶端爲公共的 SORA 3個網絡:

- Taira 測試網在 `https://taira.sora.org`
- Minamoto 主網在 `https://minamoto.sora.org`

使用 Taira 用於集成測試,用水龍頭資助的寫作運行器和部署練習.只使用 Minamoto 用於生產準備的主網活動.兩個網絡都在 XOR 收取費用:

- Taira 使用公共水龍頭的測試網 XOR.
- Minamoto 使用真實的 XOR.沒有 Minamoto 龍頭.

## 建設者之路 {#builder-path}

|步驟|Taira 測試網|Minamoto 主要網|
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|開始閱讀網絡狀態|查詢 `/status` 沒有鑰匙|查詢 `/status` 沒有鑰匙|
|選擇一個數據空間|使用公開 `universal` 除非您的應用程序需要一個受監管的路徑|僅在主網批准後使用相同的數據空間|
|獲得費用資產.|使用公衆的 Taira 龍頭|從資助的 Minamoto 賬戶或經批准的財政流通中獲得 XOR|
|測試寫道|使用水龍頭資助的測試 XOR |不要使用測試工具; 寫實用費 XOR |
|促進|繼續嘗試邏輯,監測和簽名處理|使用單獨的鑰匙,資金和釋放控制|

實際流程是:

1. 建立客戶端與 Taira 相反,並使用公開的 `universal`數據空間.
2. 添加一個簽字者,並用 Taira 龍頭資助.
3. 運行應用程序的邏輯與 Taira 相比,直到故障無聊和可觀察.
4. 創建一個單獨的 Minamoto 簽字器,用真實 XOR 資助它,並將相同的經過驗證的運算轉移到主網.

## 1. 瞭解你設定的目標 {#_1-understand-what-you-are-setting-up}

在 SORA Nexus 中,一個數據空間是網絡軌道和路由目錄的一部分.客戶端不僅僅通過更改`client.toml`來創建新的公共數據空間. 客戶端設置可以做兩件事:

1. 向客戶指向右端點 Torii
2. 選擇域名和數據空間路由文本爲其常規帳戶

`AccountId`始終是正規的,無域名. `client.toml`中的`[account].domain`值提供了路由和稱語境;它不會成爲帳戶身份的一部分.對於大多數應用程序來說,從公開的 `universal`數據空間開始.域名文本使用`domain.dataspace`形式,例如:

```text
wonderland.universal
```

如果您需要一個新的組織數據空間,請編制一份目錄和路由建議,而不是試圖從普通客戶端帳戶註冊. 查看下面[提供新數據空間](#_8-provision-a-new-dataspace).

## 2. 檢查公衆 Torii 終點 {#_2-check-the-public-torii-endpoint}

在配置簽名器之前,請檢查目標終端直播.

對於 Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

對於 Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

檢查節點暴露的數據空間和路徑視圖:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

使用 `https://minamoto.sora.org/status` 的相同命令用於主網.

## Taira MCP 用於代理人 {#taira-mcp-for-agents}

Taira 也揭示了一個 Torii-本地模型文本議定書 (MCP 當一個代理需要現場測試網時使用它,編寫的診斷,或嚴格審查的寫作練習, Torii 首先是客戶.

|設置|價值|
| --- | --- |
|MCP 終點 |`https://taira.sora.org/v1/mcp`|
|網絡根|`https://taira.sora.org`|
|預期使用|Taira 測試網閱讀和水龍頭資助的寫作練習.|
|產量等價| 不要將此條目指向 Minamoto 除了主網外 MCP 終端點和釋放控制明確批准 |

在添加簽字材料之前,檢查橋樑的元數據:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

設置 URL 作爲一個用戶本地 MCP 服務器在代理運行時間. MCP 配置, API 代幣,轉發的作者標題, `authority`, 或 `private_key` 在此文檔 repo 或應用程序 repo 中的值.

代理提示規則與 Taira 工作良好:

- 在打電話之前,從 MCP 服務器中發現工具;如果服務器報告 `listChanged`,重新發現.
- 寧願選用 `iroha.`工具,而不是原始的 `torii.`.
- 開始僅閱讀:在提出筆記之前檢查狀態,賬戶,資產,號,區塊,治理狀態和交易狀態.
- 在實時測試網絡突變之前,需要明確的人類指示.對於預先簽署的交易包裹,請使用 `iroha.transactions.submit_and_wait`,以便代理只等待結果而不是僅提交.
- 在代理響應中總結交易哈希,最終狀態和服務器驗證錯誤.

### 開發工作流程與代理人 {#development-workflow-with-agents}

使用代理作爲 Iroha 客戶端,交易構建者,診斷腳本和測試網運行簿的開發助手.它可以檢查代碼,讀取 Taira 狀態,提出更改和運行本地測試, 但它不應該轉變一個活躍的網絡直到人類批准準確的操作.

實際的工作流程是:

1. 在編寫代碼之前,請代理檢查相關的文件, SDK 代碼, CLI 命令或 MCP 工具計劃.
2. 讓代理先寫出最小的客戶端路徑:狀態檢查,賬戶搜索,號分辨率或平衡搜索.
3. 只有在僅閱讀通話對 Taira 工作後,只添加交易構建代碼.
4. 保持現實網絡測試的選擇,例如在 `TAIRA_LIVE=1` 後面,以便正常的單元測試運行從來不花費測試網資金或取決於網絡可用性.
5. 要求經紀人在提交任何交易之前報告網絡根,鏈,權威賬戶,說明總結,費用資產和預期狀態變化.
6. 在將其推廣到 CI 或主網絡工作流程之前,檢查生成的祕密處理,重新嘗試行爲,無權和拒絕處理代碼.

只有閱讀的有用 MCP 開發工具包括賬戶資產查找,別名解析,區塊查詢,交易查找,交易列表,在提交任何簽署的有效載荷之前,使用這些來建立信心.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### 經過代理人的交易工作流程 {#transaction-workflow-through-agents}

MCP 橋樑可以提交簽署的 Iroha 交易,但它不刪除正常的交易要求. 交易仍然需要正確的權威,許可證,費用資金,鏈 ID,元數據和簽名.

對於原始 Iroha 交易,先用 SDK 或 CLI 編寫和簽署交易包裹,然後只向代理提供正規的文件.簽署的交易字節編碼爲 `body_base64`.代理人可以用 `iroha.transactions.submit_and_wait`提交封面,或用 `iroha.transactions.submit`提交調查和 `iroha.transactions.wait`提交調查.

不要將私鑰粘貼到代理提示中. 如果一個代理需要構建交易,請把它指向加載用戶運行時間的祕密的地方代碼.經紀人永遠不應該將關鍵材料寫入Markdown,Fixtures,Logs或 commit.

在提交交易之前,請讓代理人編寫一個簡短的交易計劃:

- `network`:Taira 測試網根和鏈 ID
- `authority`:簽署和支付費用的賬戶
- `instructions`:註冊,貨幣交易,燃燒,轉移,元數據,許可或合同調用總結
- `fee asset`:將對 Taira 徵收資產
- `preflight reads`:已進行的賬戶,資產餘額,許可證,代名或區塊檢查
- `expected result`:確認後應該可見的狀態
- `idempotency`:如果重新審覈同樣的請求,會發生什麼?

提交後,讓代理等待終端狀態,然後通過讀取查詢驗證狀態變化.有用的完成報告包括:

- 交易哈希
- 終端狀態如 `Committed`, `Applied`, `Rejected`或`Expired`
- 在可用時,區塊或探險器細節
- 驗證閱讀結果
- 拒絕消息和失敗是否像許可證,費用,驗證,陳舊狀態或終端可用性.

舉個例子:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

當已準備簽署的包裹時:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

處理 Taira MCP 作爲公共測試網控制表面. Taira 鍵,測試網 XOR,水龍頭賬戶和印儀是可一次性使用的,必須與 Minamoto 鑰匙和生產釋放工作流程保持分離.

## 你現在可以試玩具的例子 {#toy-examples-you-can-try-now}

這些示例只能閱讀,除非註明.它們在你生成密鑰之前工作,並且可以安全地對付兩個公共網絡.

比較 Taira 測試網和 Minamoto 主網的健康:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

列出 Taira 所曝光的公共數據空間路徑:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

當您需要主網視圖時,運行同樣的命令對 Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

爲儀表板,機器人或部署檢查建立一個小的 Node.js 狀態探測器:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`).then((res) => res.json());
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

首個寫邊玩具應該是 Taira 龍頭索賠.它使用測試網 XOR,並且永遠不應指向 Minamoto.

## 3. 創建一個 Taira 客戶端配置. {#_3-create-a-taira-client-config}

生成一個鍵對,如果您還沒有一個:

```bash
kagami keys --algorithm ed25519 --json
```

創建 `taira.client.toml`:

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
torii_url = "https://taira.sora.org/"

[account]
domain = "wonderland.universal"
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

頂級層次 `chain` 是確切的 Taira 交易鏈 ID. 其他 `[account].profile = "taira"` 設置獨立選擇 Taira I105 連鎖區分劑. ID 沒有選擇帳戶配置文件.

執行僅閱讀的檢查:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

在寫作測試之前,執行公開的 Taira 診斷:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

在運行費用筆記之前,通過龍頭來資助 Taira 賬戶.直接的龍頭流程是在 [Get Testnet XOR 上 Taira](#_4-get-testnet-xor-on-taira).

在接收水龍頭索賠和資助賬戶之後, Taira 魚是可選的寫煙測試:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

魚提交了一個簽名的 ping,等待確認, `--write-config` 提供. Taira 即使水龍頭本身工作時,也可能會導致簽署的ping失敗. `taira doctor` 報告過度排列或魚回報 `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, 等待再嘗試,然後把它視爲客戶端配置錯誤.

對於無監督煙霧測試,將魚包裹在一個有限的重複測試循環中:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml taira write-canary \
    --public-root https://taira.sora.org \
    --write-config ./taira.canary.client.toml \
    --json && ok=true && break

  sleep 60
done

test "$ok" = true
```

如果 `iroha taira doctor` 顯示出嚴重失敗,停止重新試驗.排隊和收費拒絕是公共測試網絡的過渡條件;DNS, TLS 或 `status = "fail"`診斷不是.

## 創建一個 SORA Nexus 帳戶 ID {#generate-a-sora-nexus-account-id}

SORA Nexus 賬戶 ID 是一個源於帳戶公鑰和目標網絡前的常規 I105 地址,而不是客戶端 TOML 中的`[account].domain`值.同樣的公共密鑰在 Taira 和 Minamoto 上對不同的 IDs 進行編碼,生產用戶應該爲 Minamoto 生成單獨的密鑰組.

創建或加載將控制帳戶的Ed25519鍵組:

```bash
kagami keys --algorithm ed25519 --json
```

轉換公鑰爲 Taira 賬戶 ID:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

轉換一個 Minamoto 公共密鑰,使用主網前:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

在 Nexus API 或 CLI 命令要求一個法典帳戶 ID 的情況下,使用結果的賬號 ID 例如 Taira 龍頭 `account_id`,在您的客戶端配置中保存匹配的私鑰,並選擇相同的公共網絡以 `[account].profile = "taira"`或 `[account].profile = "minamoto"`.

生成 ID 本身並不能創建一個資助的連鎖賬戶.在 Taira 上,龍頭可以創建和資助測試網寫帳戶.在 Minamoto 上,使用已批准的主網安裝或財政流程.

### 關鍵存儲和備份 {#key-storage-and-backup}

賬戶 ID 和公鑰可以共享.相匹配的私鑰,密碼短語,種子和恢復材料必須被保密.

在 SORA Nexus 賬戶中使用這些實踐:

- 存儲私鑰在加密密碼管理器,硬件支持的關鍵存儲器或專用簽字服務中.不要將密鑰交給源控制,也不要把生產密鑰留在 Shell 歷史記錄,日誌,聊天,門票或未加密備份中.
- 使用每個保險櫃或生產簽名器的獨特高密碼. 存儲密碼在密碼管理器或分類保管過程中,而不是與加密私鑰相同的文件或備份捆綁中.
- 保持 Taira 和 Minamoto 的密鑰分開,把 Taira 的密鑰作爲一次性測試網材料和 Minamoto 的密鑰當作生產資金權威.
- 備份私鑰,公鑰,帳戶 ID,賬戶配置文件以及任何需要恢復簽署者的帳戶恢復或存儲記錄.在恢復過程中很容易濫用沒有網絡文本的私鑰.
- 保持至少一個加密的離線備份和一個地理位置分開的加密備份,用於生產簽名器.在依賴備份之前測試恢復,只需進行小型讀取操作.
- 如果私鑰,密碼短語,備份媒體或簽名主機可能被曝光,請旋轉或更換籤名器.

詳細見 [存儲密碼密鑰](/zh-hant/guide/security/storing-cryptographic-keys.md)和 [密碼安全](/zh-hant/guide/security/password-security.md).

## 4. 獲取測試網 XOR 在 Taira {#_4-get-testnet-xor-on-taira}

直接使用公共水龍頭,流量是:

1. 創建或加載簽字符,並計算其常規賬戶 Taira ID.
2. 帶來當前的水龍頭拼圖.
3. 如果 `difficulty_bits` 超過 `0` 則解決題.
4. 提交水龍頭申請.
5. 在發送付費信之前,等到賬戶或資產餘額顯現.

將公鑰轉換到 Taira I105 賬戶 ID 中,該龍頭預期:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

拿來這個題:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
```

如果拼圖或索賠終點返回 `502`,截止時間,或者其他網關級別錯誤,請等待再嘗試,然後更改鍵或客戶端配置.

答案是這樣的:

```json
{
  "algorithm": "scrypt-leading-zero-bits-v1",
  "difficulty_bits": 8,
  "anchor_height": 741,
  "anchor_block_hash_hex": "05d2...",
  "challenge_salt_hex": null,
  "scrypt_log_n": 13,
  "scrypt_r": 8,
  "scrypt_p": 1,
  "max_anchor_age_blocks": 6
}
```

當 `difficulty_bits`爲 `0`時,只提交 ID 的賬戶:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}'
```

當 `difficulty_bits` 超過 `0`時,解答題幷包括杆高度加上nonce:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }'
```

題算法是:

1. 構建挑戰爲 SHA-256:
   - `iroha:accounts:faucet:pow:v2`的字節
   - UTF-8 的賬戶 ID
   - `anchor_height`作爲一個大子 `u64`
   - `anchor_block_hash_hex`被解碼爲字節
   - `challenge_salt_hex`在存在時被解碼爲字節
2. 試用 `u64` 非符號編碼爲大端的8字節值.
3. 對於每一個nonce,運行腳本:
   - 密碼:是8字節的
   - 鹽:32字節的挑戰
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - 輸出長度: 32 字節
4. 獲勝的無數是第一個以至少 `difficulty_bits`爲首的零位的消化.

管道響應包括資產資金和排列交易哈希:

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "asset_id": "...",
  "amount": "25000",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

目前回應是 HTTP `202 Accepted`.上述資產定義 ID 是由公共水龍頭資助的 Taira 費用資產.在返回 `tx_hash_hex` 和 `status: "QUEUED"`時,水龍頭已經接受了請求.

然後在提交您自己的付費交易之前,查詢資產:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition 6TEAJqbb8oEPmLncoNiMRbLEK6tw \
  --account <TAIRA_I105_ACCOUNT_ID>
```

如果頭索賠被接受,但賬戶或資產尚未可見,交易仍在公共測試網隊列處理後. 在發送寫信之前等待再嘗試閱讀.

對於準備運行的直接檢查 API,將此存儲爲 `taira_faucet_claim.py`並通過 Taira I105 帳戶 ID:

```python
#!/usr/bin/env python3
import hashlib
import json
import sys
import urllib.request


def has_leading_zero_bits(digest: bytes, bits: int) -> bool:
    full, rem = divmod(bits, 8)
    if digest[:full] != b"\0" * full:
        return False
    return rem == 0 or digest[full] >> (8 - rem) == 0


root = "https://taira.sora.org"
account_id = sys.argv[1]

with urllib.request.urlopen(f"{root}/v1/accounts/faucet/puzzle") as res:
    puzzle = json.load(res)

claim = {"account_id": account_id}
difficulty = int(puzzle["difficulty_bits"])

if difficulty > 0:
    challenge = hashlib.sha256()
    challenge.update(b"iroha:accounts:faucet:pow:v2")
    challenge.update(account_id.encode())
    challenge.update(int(puzzle["anchor_height"]).to_bytes(8, "big"))
    challenge.update(bytes.fromhex(puzzle["anchor_block_hash_hex"]))
    if puzzle.get("challenge_salt_hex"):
        challenge.update(bytes.fromhex(puzzle["challenge_salt_hex"]))

    n = 1 << int(puzzle["scrypt_log_n"])
    r = int(puzzle["scrypt_r"])
    p = int(puzzle["scrypt_p"])
    salt = challenge.digest()

    for nonce in range(1_000_000):
        nonce_bytes = nonce.to_bytes(8, "big")
        digest = hashlib.scrypt(nonce_bytes, salt=salt, n=n, r=r, p=p, dklen=32)
        if has_leading_zero_bits(digest, difficulty):
            claim["pow_anchor_height"] = puzzle["anchor_height"]
            claim["pow_nonce_hex"] = nonce_bytes.hex()
            break
    else:
        raise SystemExit("faucet nonce not found")

request = urllib.request.Request(
    f"{root}/v1/accounts/faucet",
    data=json.dumps(claim).encode(),
    headers={"content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

龍頭僅適用於 Taira 測試網資金.在 Minamoto 流動中,不要使用測試網 XOR,龍頭賬戶或 Taira 加拿大簽名器.

## 5. 創建一個 Minamoto 客戶端配置. {#_5-create-a-minamoto-client-config}

使用 Minamoto 單獨的鍵組.不要重複使用 Taira 關鍵在主網上.

創建 `minamoto.client.toml`:

```toml
chain = "00000000-0000-0000-0000-000000000753"
torii_url = "https://minamoto.sora.org/"

[account]
domain = "wonderland.universal"
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

頂級層次 `chain` 是電流 Nexus 主網鏈 ID. `[account].profile = "minamoto"` 選擇了 Minamoto I105 鏈區分器;終端點主機名稱和鏈 ID 不要隱含地選擇它.

將 Minamoto 公共密鑰轉換爲其常規的 I105 賬戶 ID,並附上主網前:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

在賬戶通過主網上登錄或管理流程提供儲備和資金之前,僅進行閱讀側檢查:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

不要將 Taira 龍頭或寫法輔助器與 Minamoto 打開.

## 6. 在 XOR 中資助 Minamoto 賬戶. {#_6-fund-a-minamoto-account-with-xor}

Minamoto 費用由生產 XOR 支付,而 Minamoto 沒有公共水龍頭.通過批准的主網登錄或財政轉賬來資助配置的帳戶,或者從現有資助的 Minamoto 賬戶中獲得 XOR.

在提交筆記之前,請檢查常規賬戶 ID 和資金使用僅閱讀檢查. 作爲生產資金,將 Minamoto XOR 視爲生產資金:先在 Taira 上練習同樣的操作,保留單獨的生產密鑰,不要假設可以重置主網交易.

Taira XOR 不能支付 Minamoto 費用.測試網餘額和水龍頭索賠不會轉移到 Minamoto.

## 7. 在現有數據空間內工作 {#_7-work-inside-an-existing-dataspace}

使用在數據空間內居住的賬本對象的完全合格域名.例如,公共數據空間中的項目域名應該使用:

```text
apps.universal
```

在您的帳戶獲得所需權限後,爲域名創建一個無祕密的 `AliasSetupPlanRequestV1` 意圖,並使用聲明計劃器:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

對於 Minamoto,生成並批准單獨的主網意圖和計劃.計劃與其鏈,權威,現實狀態和截止日期有關,因此不能推廣或重播 Taira 計劃:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

帳戶號使用相同的數據空間後音:

```text
alice@apps.universal
alice@universal
```

嚴格賬戶字段仍然使用常規 I105 帳戶 IDs.將姓氏視爲可以讀取的人類的綁定,並解決常規賬戶 IDs.

## 8. 提供新的數據空間 {#_8-provision-a-new-dataspace}

一個新的數據區是一個運營商和治理變化.公衆 Torii 終端點可以將流量導向配置的數據區,但它會拒絕未知的數據區別姓氏.

在準備更改之前,捕捉當前的現場目錄:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

對於運營商賬戶,請檢查車道表姿勢:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

除非行徑 ID,數據空間 ID,驗證器設置,故障耐受性,表格,路由規則和運營所有者一起經過審查,否則不得推廣新的號.一個正常的用戶帳戶,具有所需權限,可以通過代號規劃器在現有數據空間內獲得域名和其 SNS 租;它不能安全地添加新的公共數據空間.

對於私人或組織數據空間,編制一項目錄變更,包括:

- 唯一的數據空間別名和數字 `id`
- 一個相匹配的車道入口或現有車道分配
- 數據空間 `fault_tolerance`
- 路由指令或帳戶範圍的規則,應在此登陸
- 空間目錄表或相等的部署證據,當數據區暴露 UAID 功能時
- 對驗證器,合規性,結算和監測政策的治理批准

一個可查看的配置片段是這樣的:

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
account_prefix = "payments."
description = "Route payments domains to the payments dataspace"
```

運營商的接受應包括以下門戶:

- `irohad --sora --config <config.toml> --trace-config` 傳輸已解決的節點配置
- 生成或檢查的表格是用哈希和簽名存檔的
- 在任何 Minamoto 促銷之前,煙霧測試通過 Taira
- 變更後的目錄 `/status` 表示預期的車道和數據空間
- `iroha app nexus lane-report --summary` 沒有報告缺失所需的表格

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

只有在 Taira 部署,煙霧測試,監控和治理證據完成後才能將相同的數據空間推廣到 Minamoto.

## 相關頁面 {#related-pages}

- [安裝 Iroha 3](/zh-hant/get-started/install-iroha.md)
- [通過 CLI](/zh-hant/get-started/operate-iroha-via-cli.md)運行 Iroha 3
- [對私人數據空間的贊助費用](/zh-hant/get-started/private-dataspace-fee-sponsor.md)
- [Torii 終端點](/zh-hant/reference/torii-endpoints.md)
- [創世記引用](/zh-hant/reference/genesis.md)
