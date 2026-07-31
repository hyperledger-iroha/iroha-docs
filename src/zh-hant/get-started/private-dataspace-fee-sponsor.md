---
translation_locale: zh-hant
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 提供個人資料空間的贊助費用 {#sponsor-fees-for-a-private-dataspace}

免費提供資料空間交易,
農場 XOR. 使用者仍會簽署交易.
在贊助商帳戶上, XOR 平衡
在網路費用上.

整合有三個移動部分:

1. 結點允許使用費用的贊助
2. 贊助者帳戶存在,並有 XOR
3. 每個使用者都有 `CanUseFeeSponsor` 對於這個贊助商

接著,每個受贊助的使用者交易只需要這個元數據:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

這頁面顯示了兩個常見的模式:

- **免費使用者寫**: 贊助者支付 XOR 而使用者並沒有付出任何費用.
- **在本地代碼上收費**: 使用者以應用程式代碼支付贊助商,
  贊助商在 XOR.

使用 Taira 或是一個私人測試網絡.
操作員和管理變化;它並不是由客戶端配置建立.

## 範例價值 {#example-values}

下面的命令使用這些位置持有者:

```bash
export DATASPACE="team"
export USER="<USER_ACCOUNT_I105>"
export SPONSOR="<SPONSOR_ACCOUNT_I105>"
export TREASURY="<TREASURY_ACCOUNT_I105>"
export XOR_ASSET="xor#universal"
export BILLING_DOMAIN="billing.team"
export LOCAL_FEE_ASSET="usage#billing.team"
export LOCAL_FEE_ASSET_ID="<LOCAL_FEE_ASSET_DEFINITION_BASE58>"
export USER_ALIAS="alice@team"
export PHONE_POLICY="phone#team"
export EMAIL_POLICY="email#team"
export POLICY_OWNER="<IDENTIFIER_POLICY_OWNER_ACCOUNT_I105>"
```

使用法典 I105 年 月 日 IDs 除非您的部署有活跃帳戶
對同一個帳戶而言,

## 1. 準備資料空間 {#_1-prepare-the-dataspace}

開始從個人數據空間目錄和路由工作,
[接觸到 SORA Nexus 數據區域](/zh-hant/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace).
面向操作員的片段看起來像這樣:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "team-private"
description = "Private team lane"
dataspace = "team"
visibility = "private"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "team"
id = 42
description = "Private team dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "team"
[nexus.routing_policy.rules.matcher]
account_prefix = "team."
description = "Route team domains to the private dataspace"
```

在轉移到使用者交易之前,

- 隱私路線在結中顯示 `/status` 如何應對
- 使用者帳戶由您的私人登入流程接收
- 贊助商帳戶存在
- 這項政策 XOR 在網路上有效的收費資產和收費清洗帳戶

## 2. 在數據空間中註冊資產 {#_2-register-assets-in-the-dataspace}

註冊使用者將在私人中持有的資產定義
在你將這些數據傳輸到應用程式逻辑中之前,
學習模式,教程使用 `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

首先設定域名, SNS 建立一間租公司,
沒有秘密 `AliasSetupPlanRequestV1` 目的是 `$BILLING_DOMAIN`, 包括
數字化 `team` 數據空間 ID, 經典所有者,租賃期限及現行價格
警衛:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

註冊資產定義. `--id` 是網路水平
資產的定義 ID. 這種名稱是開發者和最終使用者應該使用的.
數據空間代碼:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

在登入過程中將本地代碼轉移至使用者:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

檢查使用者的平衡:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

使用相同的模式在數據空間中的應用程式資產.
每個代號都提供一個數據空間名稱,
其他名稱 SDK 代碼而不是硬編碼的法規性資產定義 IDs.

## 3. 註冊使用者姓名 {#_3-register-user-aliases}

數據仍然是法典的 I105 年 月 日 IDs. 使用者名稱是帳號
這種字母應該是非敏感的手柄, `alice@team` 或是
`alice@members.team`. 不要使用電話號碼或電子郵件地址為假名.
該項目的位置在下一部分的私人識別碼流程中.

設定使用相同的宣言規劃器與域名設定. SDK 或是
建立一個無秘密的登入服務. `AliasSetupPlanRequestV1` 他們的意圖
預算名稱入口目標 `$USER`, 選取主要角色, 入數字
數據空間 ID, 預算及使用時間,
作为一個原子交易:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

如果使用者不需要付款 XOR, 使用已批准的承諾者意識上登機
提供建設和提交設置交易的服務.
收購與其他名稱,

請檢查這個名稱. CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

請選擇建立新的帳戶,
`NewAccount` 有一個子 `uaid` 如果需要, `label`. 其他國家
簡單 `ledger account register --id` 命令只會記錄法典
年 月 日 ID.

## 4. 透過電話和電子郵件私下登記 FHE {#_4-register-phone-and-email-privately-with-fhe}

使用電話號碼和電子郵件地址作為私人身份證索引,而不是公開
其他國家的名稱. FHE- 支持流量將原始識別子排除在帳戶名稱之外,
交易元數據和世界狀況:

1. 運營商會註冊一項
   [RAM-LFE/FHE 計畫政策](/zh-hant/blockchain/ram-lfe.md) 在電話和電子郵件上
2. 運營商會註冊活動識別方式, `phone#team` 及其他
   `email#team`
3. 這個錢包將電話或電子郵件正常化
4. 錢包將加密值發送到解決器
5. 解析器返回一個 `IdentifierResolutionReceipt`
6. 使用者提交 `ClaimIdentifier` 附收件
7. 連鎖存儲不透明的識別碼和收件哈希,而不是原始電話或
   電子郵件值

這項政策是: SDK 或是服務任務.
這些指令對每種識別子:

```text
RegisterRamLfeProgramPolicy(
  program_id = "phone_team",
  owner = "$POLICY_OWNER",
  backend = "bfv-programmed-sha3-256-v1",
  verification_mode = "signed",
  commitment = "<HIDDEN_PROGRAM_POLICY_COMMITMENT>",
  resolver_public_key = "<RESOLVER_PUBLIC_KEY>"
)
ActivateRamLfeProgramPolicy(program_id = "phone_team")

RegisterIdentifierPolicy(
  id = "$PHONE_POLICY",
  owner = "$POLICY_OWNER",
  normalization = "PhoneE164",
  program_id = "phone_team",
  note = "Private phone registration for team dataspace"
)
ActivateIdentifierPolicy(policy_id = "$PHONE_POLICY")
```

請重複使用:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

在安裝過程中,錢包或後端應本地正常化:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

在第8步建立贊助者元數據檔案後,提交使用者簽名的文件
使用此元數據的索赔指示:

```text
ClaimIdentifier(
  account = "$USER",
  receipt = IdentifierResolutionReceipt {
    payload: {
      policy_id: "$PHONE_POLICY",
      opaque_id: "<OPAQUE_ACCOUNT_ID>",
      uaid: "<USER_UAID>",
      account_id: "$USER",
      ...
    },
    attestation: "<RESOLVER_SIGNATURE_OR_PROOF>"
  }
)
```

目前的 CLI 不會顯示這些身份的輸入命令
產生連續化 `InstructionBox` 數值與 SDK 及其他
提交他們 `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

請將這些護欄放在上機服務中:

- 帳戶名稱只能被人閱讀
- 在密碼,元數據,日志或
  交易使用負荷
- 這個帳戶有 `uaid` 在它要求私人識別碼之前
- 收取證券的結束 `policy_id`, `opaque_id`, `uaid`, `account_id`, 及過期
- 解決鍵和隱藏程式承諾由治理控制.

## 5. 啟動 Node 的贊助 {#_5-enable-sponsorship-on-the-node}

這項政策是"節點/運行時間"的. Nexus 收費設定:

```toml
[nexus.fees]
fee_asset_id = "xor#universal"
fee_sink_account_id = "<FEE_SINK_ACCOUNT_I105_OR_ALIAS>"
base_fee = "0"
per_byte_fee = "0"
per_instruction_fee = "0.001"
per_gas_unit_fee = "0.00005"
sponsorship_enabled = true
sponsor_max_fee = "0"
```

`fee_asset_id` 是網路費資產. SORA Nexus 這就是 XOR. 請使用
活動 XOR 其他名稱或法典 XOR 資產的定義 ID 您的網站將此曝光.

`sponsor_max_fee = "0"` 沒有每項交易的贊助者限值.
在你知道正常尺寸和氣體配置后,
您的數據區域交易.

請重新啟動或通過正常操作程序進行這個設定.

## 6. 建立和資助贊助者 {#_6-create-and-fund-the-sponsor}

如果需要, 生成一個贊助者關鍵對:

```bash
kagami keys --algorithm ed25519 --json
```

轉換公钥為您的網路帳戶格式:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

在您的私人登入流程中註冊贊助者帳戶:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

提供資金給贊助商 XOR 收取的金屬,債券或其他資金
帳號:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

於 Taira 沒有人能試過,
[獲得測試網 XOR 在 Taira](/zh-hant/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
這樣的 `taira_faucet_claim.py`, 然後用公共水來資助贊助者
而不是財務金轉移:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

請查看贊助商的網站 XOR 均衡:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. 允許使用者與贊助商聯繫 {#_7-grant-a-user-access-to-the-sponsor}

這項授予每位使用者免費收取費用的許可.
阻止使用者命名任意的贊助商帳戶.

或是您的經營帳戶所允許.
運行時間政策:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission grant --id "$USER"
```

請將此轉換為正常的帳戶供應步,

- 使用者帳號
- 贊助商帳戶
- 數據空間或應用程式
- 批准票或治理決定

檢查使用者的補助金:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. 附加贊助商的數據 {#_8-attach-sponsor-metadata}

建立可重複使用的元數據檔案:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

任何使用此元數據提交的筆記本都會向贊助商收取費用:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

於 SDKs, 附上同一個交易元數據對象,
交易.使用者用使用者的密钥簽署交易.
不會簽署所有使用者交易, `CanUseFeeSponsor`
授予是授權的.

## 模式1:使用者免費付款 {#pattern-1-users-pay-no-fees}

使用此項,當應用程式或運營者收取所有網路費用時.

發達者檢查名單:

1. 保持使用者的正常交易用量不變.
2. 添加交易元數據 `fee_sponsor`.
3. 請以使用者身份簽名.
4. 透過私人數據空間路線提交.

使用者帳戶不需要 XOR 贊助者帳戶必須保持
足夠的 XOR 為了覆蓋配置的 Nexus 收取費用.

## 圖案 2:使用者付出本地代幣 {#pattern-2-users-pay-a-local-token}

請使用此時, XOR, 但數據空間仍然需要一個
內部應用程式費用,信用支出或配额代幣.

在這個模式下,本地代幣是應用程式支付.
支持者仍在支付網路費用 XOR.

例如, 在私人數據空間中使用本地代碼:

```text
usage#billing.team
```

基金使用者: `usage#billing.team` 在登入時,訂閱更新,
或配额分配. 然後將使用者交易進行原子化:

1. 從使用者轉移本地代幣給贊助商
2. 執行所要求的應用程序操作
3. 包含 `fee_sponsor` 這樣贊助者會付出 XOR

沒有任何問題. CLI 煙霧測試只是由本地代碼傳輸主辦的 XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

請不要將本地代碼支付為個別的帳號.
建立一個簽署的交易,
還是將合同入口點曝光,
在執行商業操作之前收集本地代幣.

在您的應用程式或合同中保存轉換政策:

- 該操作費用是多少個本地代幣單位
- 如何支持本地代币流入地圖 XOR 補充
- 如果使用者平衡太低,
- 什麼會發生在贊助者 XOR 這樣的平衡太低了.

::: warning

不要使用 `gas_asset_id` 在"本地代碼收費"模式下,
在目前的運行時間內,
`fee_sponsor` 也使贊助商成為配置管道氣體的付款人
在本地代幣使用者費用上,
轉讓或合同規則.

:::

## 檢查未成功的贊助交易 {#debug-failed-sponsored-transactions}

常見的拒絕理由通常指向一個缺失設定步骤:

| 錯誤文本 | 檢查哪些問題 |
| --- | --- |
| `fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` 還是這樣 `false` 在結節上. |
| `fee sponsor is not authorized` | 沒有使用者 `CanUseFeeSponsor` 這位贊助者. |
| `fee asset ... is missing` | 沒有任何預算. XOR 收費資產. |
| `fee balance ... is insufficient` | 補充贊助者的服務 XOR 這樣的平衡 |
| `fee exceeds sponsor_max_fee` | 提高 `sponsor_max_fee` 或減少交易規模/氣體. |
| `invalid nexus fee asset id` | 解決問題 `nexus.fees.fee_asset_id` 或是 XOR 這是一種不錯的行為. |

檢查兩個平衡:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"

iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

## 如何運用贊助者 {#operate-the-sponsor}

請將贊助商當作財務金帳戶:

- 保持檢測網,舞台和主網的獨立贊助者鍵
- 在贊助商之前, XOR 預算時間:
- 设置非零 `sponsor_max_fee` 一旦交通特征化,
- 在您的應用程式或門口中,
- 撤銷 `CanUseFeeSponsor` 當使用者離開數據空間時
- 協調使用者交易哈希,本地代碼付款和贊助者 XOR
  負債

取消使用者的贊助:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission revoke --id "$USER"
```

## 有關頁面 {#related-pages}

- [接觸到 SORA Nexus 數據區域](/zh-hant/get-started/sora-nexus-dataspaces.md)
- [運行 Iroha 3 透過 CLI](/zh-hant/get-started/operate-iroha-via-cli.md)
- [資產](/zh-hant/blockchain/assets.md)
- [許可證](/zh-hant/blockchain/permissions.md)
- [許可令牌](/zh-hant/reference/permissions.md)
