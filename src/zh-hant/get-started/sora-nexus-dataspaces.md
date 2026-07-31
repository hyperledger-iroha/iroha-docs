---
translation_locale: zh-hant
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 63c317ab61ba912176c43c83d5b4f026f23a7a6e5fb633872a133c9ea1295686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 繼續努力 SORA 3: Taira 及其他 Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3是基于應用程式的公共部署轨道 Iroha 3 及其他 SORA
Nexus. 建立和練習在 Taira 首先,然後將相同的客戶形狀移動
必須 Minamoto 只有當你有不同的主網鍵, XOR 收取費用,
並批准了產品.

這篇教程顯示了如何配置 Iroha 公眾的客戶 SORA 3
網路:

- Taira 測試網在 `https://taira.sora.org`
- Minamoto 必須在 `https://minamoto.sora.org`

使用 Taira 關於整合測試,用水管資金寫字;
該組織的部署練習. Minamoto 僅適用於準備生產的主網
這兩間網路都收取費用, XOR:

- Taira 使用測試網 XOR 來自公共水槽.
- Minamoto 使用實物 XOR. 沒有. Minamoto 這樣的水龙头.

## 建築師之路 {#builder-path}

| 步                        | Taira 測試網                                                | Minamoto 主要的網站                                   |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| 開始閱讀網路狀態 | 詢問問題 `/status` 沒有關鍵                                 | 詢問問題 `/status` 沒有關鍵                       |
| 選擇一個數據空間            | 公眾使用 `universal` 除非您的應用程式需要一個受管理的行徑 | 僅使用相同的數據空間, |
| 獲得收費資產               | 使用公眾 Taira 排水管                                  | 接收 XOR 提供資金的 Minamoto 帳戶或已批准的財務流動 |
| 考試寫作                 | 使用水龙头资助的測試 XOR                                   | 不要使用測試工具; 寫字花費真實 XOR     |
| 提倡活動                     | 繼續重新嘗試逻辑,監控和簽名處理            | 使用獨立鍵,資金和釋放控制   |

實際流程是:

1. 建立客戶的對抗 Taira 並使用公眾 `universal` 沒有任何相關資訊.
2. 加入一個簽名者, Taira 這樣的水龙头.
3. 應用程式的逻辑, Taira 直到失敗變得乏味,
   這種情況可觀察.
4. 建立一個獨立的 Minamoto 簽名者,以真實的資金提供 XOR, 只是移動
   仍有相同的經驗.

## 1. 瞭解自己所設定的目標 {#_1-understand-what-you-are-setting-up}

在 SORA Nexus, 數據空間是網路路徑和路由目錄的一部分.
客戶端並不只透過更改創建新的公共數據空間
`client.toml`. 客戶設定會做兩個事情:

1. 指向客戶右邊 Torii 終點點
2. 選取域名和資料空間路由背景,

`AccountId` 沒有任何領域. `[account].domain` 值在
`client.toml` 提供路由和稱背景;它不成為
請從公眾網站開始.
`universal` 數據空間.域範圍使用 `domain.dataspace` 形式,為
舉例:

```text
wonderland.universal
```

如果您需要新的組織數據空間,
而不是從普通客戶帳戶登記.
請看 [提供新的數據空間](#_8-provision-a-new-dataspace) 在下面.

## 2. 檢查公眾 Torii 終點點 {#_2-check-the-public-torii-endpoint}

在設定簽名器之前, 檢查目標終點是否啟動.

於 Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

於 Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

檢查 node 的數據空間和行徑顯示:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

使用相同的命令, `https://minamoto.sora.org/status` 沒有任何問題.

## Taira MCP 對於代理人 {#taira-mcp-for-agents}

Taira 這也顯示了 Torii-本地模式的文脈協議 (MCP) 橋梁
使用它當代理需要直播測試網閱讀,
沒有建立一個習慣,
Torii 首先是客戶.

| 設定 | 價值 |
| --- | --- |
| MCP 終點點 | `https://taira.sora.org/v1/mcp` |
| 網路根 | `https://taira.sora.org` |
| 預期使用 | Taira 測試網閱讀和用水資金的寫作練習 |
| 產量等級 | 請不要將此輸入指向 Minamoto 除了主網外 MCP 終點和釋放控制明顯承認 |

在添加簽名材料之前, 檢查橋梁的元數據:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

設定這個程式 URL 作为使用者本地 MCP 在代理運行時間內.
承諾代理人 MCP 配置, API 標籤,轉發的作者標題, `authority`, 或是
`private_key` 在本文 repo或應用 repo 中的值.

代理提醒使用規則 Taira:

- 發現這些工具 MCP 在打電話之前, 再發現如果
  伺服器報告 `listChanged`.
- 喜歡選購的 `iroha.*` 在原料上使用的工具 `torii.*` 這種工具.
- 開始閱讀:檢查狀態,帳戶,資產,名稱,區塊,
  在提出書寫之前,
- 必須在生動的測試網突變之前明顯向人類指示.
  預先簽署的交易包裹,使用 `iroha.transactions.submit_and_wait`
  這樣的代理人只等待結果,
- 總結交易哈希,最終狀態和伺服器驗證錯誤
  該組織的反應.

### 與代理人合作的發展工作流程 {#development-workflow-with-agents}

使用代理作為發展助手 Iroha 客戶,交易承辦人,
檢測程式和測試網運行簿.
它可以檢查代碼,閱讀 Taira 國家,提議改變和進行本地測試,
但它不能變化一個直播網絡,
該組織的行動.

實際工作流程是:

1. 請代理檢查相關的資料, SDK 這個代碼, CLI 命令,或 MCP
   在它寫代碼之前,
2. 請代理人先寫下最小的客戶路徑:狀態檢查,帳號
   或是平衡查詢.
3. 只有在只閱讀通話工作後,
   Taira.
4. 請繼續使用網路測試, `TAIRA_LIVE=1`, 所以一個
   通常的單位測試運行從來沒有花費測試網資金或依賴網路
   提供可用性
5. 要求代理人報告網路根,連鎖,權威帳戶,
   在提交之前,指令總結,收費資產和預期狀態變化
   任何交易.
6. 檢查生成的密碼,重新嘗試行為,無能力以及
   在推廣之前處理拒絕 CI 或持續工作流程.

僅供閱讀使用 MCP 开发工具包括查看帳戶資產,
這項指令是:
在提交任何文件之前,使用這些檢查來建立信心.
簽署的有效載荷.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### 交易經由代理人的工作流程 {#transaction-workflow-through-agents}

其他國家 MCP 橋可以提交簽名的文件. Iroha 交易,但它並不取消
交易仍需要正确的
授權,許可證,費用資金,連鎖 ID, 這樣的數據,

在原料上 Iroha 交易,建立和簽署交易包裹
SDK 或是 CLI 首先,只能向代理人提供經典簽名的交易.
編碼為 `body_base64`. 該代理人可以提交封面,
`iroha.transactions.submit_and_wait`, 或提交
`iroha.transactions.submit` 調查與 `iroha.transactions.wait`.

請不要將私密關鍵貼在代理提示中.
請把它指向本地代碼,
或忽略了測試網配置檔案.
該代理人絕對不應該將關鍵資料寫入Markdown,
必須承諾.

在提交交易之前,請使代理人進行短暫的交易
計畫:

- `network`: Taira 測試網根和連鎖 ID
- `authority`: 簽名和支付費用的帳戶
- `instructions`: 註冊,票,燒錄,傳輸,元數據,許可或
  合同呼叫總結
- `fee asset`: 收取的資產 Taira
- `preflight reads`: 帳戶,資產餘額,許可證,名稱或區塊
  已完成的檢查
- `expected result`: 確認後必須看到的狀態
- `idempotency`: 如果重新審查相同的要求,

在提交後, 請使代理人等待終端狀態,
使用閱讀查詢的狀態變化.有用的完成報告包括:

- 交易哈希
- 終端狀況如: `Committed`, `Applied`, `Rejected`, 或是 `Expired`
- 如果可用, 區塊或探險器的詳細
- 檢查閱讀結果
- 拒絕訊息以及失敗是否看起來像許可,費用,
  驗證,舊狀態或端點可用性

預覽:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

如果已準備簽名封面:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

治療 Taira MCP 作为公共測試網控制表面. Taira 密钥,測試網 XOR,
該組織必須與其他國家保持獨立.
Minamoto 關鍵和產品釋放工作流程.

## 你現在可以試玩具的例子 {#toy-examples-you-can-try-now}

這些例子只能閱讀,除非註明.
這兩家公共網絡都能安全使用.

比較 Taira 檢測網和 Minamoto 網路健康:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

列出公眾數據空間路徑, Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

執行相同的命令, Minamoto 當您需要主網視圖時:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

建立一個小的 Node.js 顯示器,機械人或部署的狀況調查
檢查:

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

首先,寫字的玩具應該是 Taira 該機使用測試網.
XOR 沒有任何指向 Minamoto.

## 3. 建立一個 Taira 客戶設定 {#_3-create-a-taira-client-config}

如果您尚未使用,

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

這位高層人士, `chain` 是正確的 Taira 交易連鎖 ID. 其他國家
`[account].profile = "taira"` 這個設定獨立地選擇 Taira I105
鎖分辨劑. ID 沒有選擇帳戶配置文件.

請檢查:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

管理公眾 Taira 在寫作測試之前的診斷:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

提供資金 Taira 在你使用手機之前,
接下來,
[獲得測試網 XOR 在 Taira](#_4-get-testnet-xor-on-taira).

在收取水龙头索赔和支付帳戶後, Taira
魚是可選的寫煙測試:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

魚會發送簽名的訊息, 等待確認,
執行時間簽名器設定 `--write-config` 提供. Taira 是公眾的
這樣的排列飽和性可能會使已簽署的 ping 失败,
管道本身就有效了. `taira doctor` 報告了飽和的排隊或
加拿大魚回歸 `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, 等待再試一次
處理它為客戶端配置錯誤.

在未監控的煙霧試驗中,將魚包裹在一個有限的重複試驗圈中:

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

停止再嘗試, `iroha taira doctor` 顯示嚴重故障.
而收費拒絕是暫時的公共測試網條件; DNS,
TLS, 或是 `status = "fail"` 診斷並不是如此.

## 產生一個 SORA Nexus 帳戶 ID {#generate-a-sora-nexus-account-id}

其他國家 SORA Nexus 年 月 日 ID 是一種法典 I105 該地址來自:
沒有使用戶口密碼,
`[account].domain` 客戶中的價值 TOML. 公共密碼的相同代码
不同的 IDs 在 Taira 及其他 Minamoto, 產品使用者應提供
獨立的鍵組 Minamoto.

發明或加載會控制帳戶的Ed25519鍵組:

```bash
kagami keys --algorithm ed25519 --json
```

將公钥轉換為 Taira 年 月 日 ID:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

轉換一個 Minamoto 公共鍵含有主網前音符:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

使用結果的帳號 ID 在任何地方 Nexus API 或是 CLI 命令要求一個
經典紀錄 ID, 例如: Taira 排水管 `account_id`, 平衡
請查詢,嚴格的帳戶欄位或密碼聯繫.
在您的客戶端設定中,
`[account].profile = "taira"` 或是 `[account].profile = "minamoto"`.

產生了 ID 沒有自行建立在連鎖上資金的帳戶.
Taira, 試驗網的帳戶可以建立和提供資金.
Minamoto, 使用已批准的主網上登入或財務流程.

### 鍵存儲及備份 {#key-storage-and-backup}

帳號 ID 這樣的私密關鍵,
密碼,種子和回收材料必須保密.

使用這些方法 SORA Nexus 帳戶:

- 儲存私密鍵在加密密碼管理器,
  請不要將密钥交給源頭
  控制或留下產品關鍵在貝爾歷史,日志,聊天,票,
  或沒有加密的備份.
- 請使用一個獨特的高密碼,
  在密碼管理器或分割保管過程中儲存密碼,而不是在
  同一個檔案或備份包,
- 保持 Taira 及其他 Minamoto 關鍵分開. Taira 單次使用的關鍵
  檢測網材料和 Minamoto 提供產品基金權威的關鍵.
- 備份私密鍵,公開鍵,帳戶 ID, 帳戶的個人資料及任何
  需要恢復簽名者的帳戶回收或保管資料.
  在恢復過程中, 沒有網路背景的鍵很容易被濫用.
- 保持至少一個加密的無線備份,
  檢測復原使用一個
  在預備之前,只能讀取小操作.
- 如果私密鍵,密碼,備份媒體,
  或是簽名的主機可能暴露在外面.

更多詳情請見
[儲存密碼關鍵](/zh-hant/guide/security/storing-cryptographic-keys.md)
及其他 [密碼安全](/zh-hant/guide/security/password-security.md).

## 4. 獲得測試網 XOR 在 Taira {#_4-get-testnet-xor-on-taira}

直接使用公共水.

1. 生成或加載簽名器,並計算其法典性 Taira 年 月 日 ID.
2. 請將目前的水龙頭解答.
3. 解答這個問題, `difficulty_bits` 是比 `0`.
4. 請向我們提出水龙头申請.
5. 在發送之前等待帳戶或資產余額顯示
   收費的筆記.

轉換公钥為 Taira I105 年 月 日 ID 排水所預期的:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

拿下這個拼圖:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
```

是公共測試網服務.
返回 `502`, 或是其他門口級錯誤,等待再嘗試
在改變您的密碼或客戶設定之前.

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

什麼時候 `difficulty_bits` 是的 `0`, 只提供帳號 ID:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}'
```

什麼時候 `difficulty_bits` 是比 `0`, 解決這個難題,
的高度加上:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }'
```

解答的算法是:

1. 建立這個挑戰, SHA-256 超過:
   - 數字的字节 `iroha:accounts:faucet:pow:v2`
   - 這項政策 UTF-8 年 月 日 ID
   - `anchor_height` 像大子一樣 `u64`
   - `anchor_block_hash_hex` 解碼為字體
   - `challenge_salt_hex` 如果存在,會被解碼成字體
2. 請試下 `u64` 沒有數值,以大英8字元的數值編碼.
3. 按下以下字符串:
   - 密碼: 8 字節的無數
   - 盐: 32 字段的挑戰
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - 輸出長度: 32 字節
4. 贏得獎項是第一個至少有 `difficulty_bits`
   沒有任何結果.

排管回應包括資金資產和排隊交易哈希:

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

目前回應是: HTTP `202 Accepted`. 該產品
定義 ID 上面是 Taira 這項計畫的目標是:
在回應時, faucet 已接受要求 `tx_hash_hex` 及其他
`status: "QUEUED"`.

在提交您自己的付費之前,
交易:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition 6TEAJqbb8oEPmLncoNiMRbLEK6tw \
  --account <TAIRA_I105_ACCOUNT_ID>
```

如果該水龙头索赔被接受,但帳戶或資產不顯示
但交易仍在公共測試網排隊處理後.
在發送信件之前再試閱讀.

準備好使用的直線 API 請把這個保存成 `taira_faucet_claim.py`
並通過 Taira I105 年 月 日 ID:

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

這水龍頭只適用於 Taira 沒有使用測試網 XOR, 排水管
帳戶或 Taira 卡納里簽名者 Minamoto 沒有任何問題.

## 5. 建立一個 Minamoto 客戶設定 {#_5-create-a-minamoto-client-config}

使用不同的鍵組 Minamoto. 不要再使用 Taira 關鍵為主網.

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

這位高層人士, `chain` 是目前的 Nexus 主網連鎖 ID.
`[account].profile = "minamoto"` 選擇 Minamoto I105 链接
區別性;終點主機名稱和連鎖 ID 請不要暗示它.

轉換一個 Minamoto 公共鍵在其法典中 I105 年 月 日 ID 在這個情況下
主要的前:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

只有在帳戶預備和資金提供之前,
透過主網路上載或管理流程:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

請勿使用 Taira 水管或寫卡納助手 Minamoto.

## 6. 基金 a Minamoto 帳號與 XOR {#_6-fund-a-minamoto-account-with-xor}

Minamoto 收費與生產有關 XOR, 及其他 Minamoto 沒有公眾
通過批准的主網上安裝,
或是收到財務金轉移, XOR 已有資金提供 Minamoto
預算時間

檢查法典帳號 ID 還是以只閱讀的檢查提供资金,
提交一份書. Minamoto XOR 作为生产资金:
在 Taira 首先,要保持分別的生產鍵,
假設可以重置主網路交易.

Taira XOR 不能支付 Minamoto 試管網的余額和水龙头索賠
沒有轉移到 Minamoto.

## 7. 在現有數據空間內工作 {#_7-work-inside-an-existing-dataspace}

使用完全合格的域名,
例如,公共資料空間中的項目域應
使用:

```text
apps.universal
```

在您的帳戶獲得所需權限後,
`AliasSetupPlanRequestV1` 對域名的意圖,使用宣言規劃器:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

於 Minamoto, 建立和批准獨立的主體意圖與計劃.
他們的連鎖,權威,生活狀態和截止日期,
Taira 這項計劃不能推廣或重播:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

帳戶名稱使用相同的數據空間后音:

```text
alice@apps.universal
alice@universal
```

嚴格的帳戶欄位仍然使用法典 I105 年 月 日 IDs. 請使用別名
能被人閱讀的結束, IDs.

## 8. 提供新的數據空間 {#_8-provision-a-new-dataspace}

新的數據空間是一個操作者和治理改變. Torii
終端點可以將流量導向配置的數據區域,
沒有人知道的數據空間名稱.

在準備更改之前,

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

檢查車道明顯姿態:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

沒有新名稱, ID, 數據空間 ID, 驗證機組,
該網站上使用者必須遵守:
正常使用者帳戶,有所需的權限,
獲得一塊域名, SNS 透過該網站,
沒有安全地添加新的公共數據空間.

在個人或組織數據空間中, 準備一項目錄變更:

- 獨特的數據空間名稱和數字 `id`
- 匹配的行徑入口或現有行徑分配
- 數據空間 `fault_tolerance`
- 該登陸的指令或帳戶範圍的路由規則
  在這裡
- 空間目錄明示或相當的發射證據,
  數據空間的曝光 UAID 能力
- 核實者,合规性,清算和監控的治理批准
  政策

這樣看起來是可檢查的配置片段:

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

運營者接受應包括以下門口:

- `irohad --sora --config <config.toml> --trace-config` 通過了
  已解決的節點配置
- 生成或審核的表格是用哈希和簽名存档的
- 煙霧測試通過 Taira 在任何 Minamoto 提升活動
- 改變後的情況 `/status` 圖表顯示預期的行徑和數據空間
- `iroha app nexus lane-report --summary` 沒有報告缺失要求
  顯示表

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

推廣相同的數據空間, Minamoto 只有在 Taira 部署,
煙霧測試,監控和治理證據已完成.

## 有關頁面 {#related-pages}

- [裝置 Iroha 3](/zh-hant/get-started/install-iroha.md)
- [運行 Iroha 3 透過 CLI](/zh-hant/get-started/operate-iroha-via-cli.md)
- [提供私人數據空間的贊助費](/zh-hant/get-started/private-dataspace-fee-sponsor.md)
- [Torii 終點點](/zh-hant/reference/torii-endpoints.md)
- [創世記的參考](/zh-hant/reference/genesis.md)
