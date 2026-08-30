---
translation_locale: zh-hant
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 37a2c29dccf3d2abacbbba16869d65b70b93545875a122470601194231c2263b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 提供私人數據空間的贊助費 {#sponsor-fees-for-a-private-dataspace}

費用贊助允許用戶在沒有持有 XOR 的情況下提交私人數據空間交易.用戶仍然簽署了交易.交易的元數據指向贊助商賬戶,運行時間爲網絡費用借款贊助商的餘額 XOR.

集成有三個移動部分:

1. 節點允許費用贊助
2. 贊助商賬戶存在,並擁有 XOR
3. 每個用戶對該贊助商擁有 `CanUseFeeSponsor`

在此之後,每一個贊助的用戶交易只需要這個元數據:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

這個頁面顯示了兩個常見的模式:

- 免費用戶寫道:贊助商支付 XOR 而用戶沒有支付.
- 地方代幣費用:用戶以應用代幣支付贊助商,贊助商則以 XOR 支付網絡.

首先使用 Taira 或私有測試網絡. 新的私人數據空間是運營商和治理變化;它不是由客戶端配置創建的.

## 示例值 {#example-values}

下面的命令使用這些位置持有符:

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

使用常規 I105 帳戶 IDs,除非您的部署對相同賬戶有活躍賬戶號.

## 1. 準備數據空間 {#_1-prepare-the-dataspace}

從 [中描述的私人數據空間目錄和路由工作開始連接到 SORA Nexus 數據域](/zh-hant/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace).一個面向操作員的碎片看起來像這樣:

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

在轉移到用戶交易之前,請檢查:

- 在 `/status` 節點響應中顯示私人車道
- 用戶帳戶由您的私人登錄流程接入
- 贊助商賬戶存在
- XOR 費用資產和費用清算賬戶在網絡上有效

## 2. 在數據空間中註冊資產 {#_2-register-assets-in-the-dataspace}

在將其傳輸到應用邏輯中之前,註冊用戶將在私人數據空間內保留的資產定義.對於本地代幣費用模式,教程使用`usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

首先設置擁有資產名稱空間的域名和 SNS 租協議.爲 `$BILLING_DOMAIN`創建一個無祕密的 `AliasSetupPlanRequestV1`意圖,包括數值 `team`數據空間 ID,法定所有者,租期限和當前報價保護:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

然後註冊資產定義. 規範性 `--id` 是網絡級資產定義 ID.開發人員和最終用戶應該在數據空間代碼中使用的稱:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

在登錄過程中將本地代幣發貨或轉移給用戶:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

檢查用戶的平衡:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

使用數據空間中的應用資產的模式相同. 每個代幣註冊一個資產定義,給每個代碼一個數據空間別名,並引用 SDK 代碼的代號而不是硬編碼的正規資產定義 IDs.

## 3. 登記用戶姓名 {#_3-register-user-aliases}

賬戶仍然是常規的 I105 帳戶 IDs.面向用戶的名稱是賬戶號,而號應是不敏感的手柄,如`alice@team`或`alice@members.team`.不要用電話號碼或電子郵件地址作爲號.這些都屬於下一節的私人識別器流中.

姓名設置使用與域名設置相同的聲明規劃器.讓 SDK 或登錄服務創建一個無祕密的 `AliasSetupPlanRequestV1`意圖,其帳戶代號輸入 目標 `$USER`,選擇主要角色,鍵入數值數據空間 ID,並執行當前租報價保護.然後規劃並將其作爲一個原子交易:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

如果用戶不應該支付 XOR,請使用批准的贊助商知情登錄服務來構建和提交設置交易.不要將租收購和密號綁定分爲獨立申請交易.

在密名被綁定後,請從 CLI 檢查:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

對於創建新賬戶,最好使用穩定 `uaid`和必要時初始 `label`構建 `NewAccount` 的安裝服務.簡單的 `ledger account register --id`命令只會記錄正規帳戶 ID.

## 4. 通過 FHE 私下登記電話和電子郵件. {#_4-register-phone-and-email-privately-with-fhe}

使用電話號碼和電子郵件地址作爲私人識別器索賠,而不是公開姓氏.支持 FHE 的流量將原始識別器排除在賬戶姓氏,交易元數據和世界狀態之外:

1. 運營商註冊[RAM-LFE/FHE 電話和電子郵件項目政策](/zh-hant/blockchain/ram-lfe.md)
2. 運營商註冊活躍標識策略,如 `phone#team`和 `email#team`
3. 錢包將電話或電子郵件正常化.
4. 錢包將加密值發送到解決器
5. 解析器返回一個 `IdentifierResolutionReceipt`
6. 使用者將 `ClaimIdentifier` 附收據提交
7. 鏈存儲一個不透明的標識符和收件哈希,而不是原始電話或電子郵件值.

運營商方策略設置是 SDK 或服務任務.爲每個標識符類型構建並提交這些指令對:

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

複製爲電子郵件:

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

在第8步創建贊助商元數據文件後,提交使用者簽署的索賠指示,並附上該元數據:

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

電流 CLI 不顯示這些身份指令的輸入命令.使用 SDK 生成序列化`InstructionBox`值,並通過 `ledger transaction stdin`提交它們:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

在安裝服務中保留這些防護:

- 賬戶名字只能被人讀取的手柄
- 原始電話和電子郵件值永遠不會出現在號,元數據,日誌或交易有效載荷中.
- 在申請私人標識符之前,該賬戶有`uaid`
- 收據結合 `policy_id`, `opaque_id`, `uaid`, `account_id`,並過期
- 解決方案密鑰和隱藏程序承諾由治理控制

## 5. 啓用節點上的贊助 {#_5-enable-sponsorship-on-the-node}

費用贊助是節點/運行時間政策. 在 Nexus 費用配置中啓用:

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

`fee_asset_id`是網絡費用資產.對於 SORA Nexus,這是 XOR.使用您的網絡所曝光的活躍 XOR 號或常規 XOR 資產定義 ID

`sponsor_max_fee = "0"`意味着沒有每筆交易的贊助商上限. 在您知道數據空間交易的正常規模和氣體配置後,設置非零限量.

在正常操作程序中重新啓動或滾動這個配置.

## 6. 創建和資助贊助者 {#_6-create-and-fund-the-sponsor}

如果需要,生成一個贊助商關鍵對:

```bash
kagami keys --algorithm ed25519 --out-dir ./fee-sponsor-key
```

將公鑰轉換爲網絡帳戶格式:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

通過您的私人登錄流程註冊贊助商賬戶:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

通過 XOR 從財政部,索賠賬戶或其他資助帳戶爲贊助商提供資金:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

對於 Taira 試煉,除了水龍頭助手 [獲取測試網 XOR 在 Taira](/zh-hant/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) 作爲 `taira_faucet_claim.py`, 然後通過公共水龍頭來資助贊助商,而不是財政轉賬:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

查看贊助商的 XOR 餘額:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. 讓用戶訪問贊助商 {#_7-grant-a-user-access-to-the-sponsor}

贊助商必須允許每個用戶向其收取費用.補貼是阻止用戶命名任意贊助商賬戶的原因.

運行這個作爲贊助商賬戶,或者作爲一個經營帳戶允許的運行時間政策:

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

對於登錄服務,將此作爲一個正常的賬戶提供步驟,並記錄:

- 用戶帳戶
- 贊助商賬戶
- 數據空間或應用
- 批准票或治理決定

檢查用戶的資助:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. 附加贊助商的元數據 {#_8-attach-sponsor-metadata}

創建可重複使用的元數據文件:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

用此元數據提交的任何筆記本將向贊助商收取:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

對於 SDKs,將相同的交易元數據對象添加到簽署的交易中.用戶用用戶密鑰簽署交易.贊助商不會簽署每個用戶交易,因爲之前的`CanUseFeeSponsor`授予是授權.

## 第一個模式:用戶免費付款 {#pattern-1-users-pay-no-fees}

在應用程序或運營商收取所有網絡費時使用此方法.

開發者檢查列表:

1. 保持用戶的正常交易有效載荷不變.
2. 添加 `fee_sponsor` 的交易元數據.
3. 作爲用戶簽署.
4. 通過私人數據空間路線提交.

用戶帳戶不需要 XOR 的餘額.贊助商賬戶必須保持足夠的 XOR 來支付配置的 Nexus 費用.

## 模式2:用戶支付本地代幣 {#pattern-2-users-pay-a-local-token}

如果用戶不應該持有 XOR,但數據空間仍然需要內部應用程序費用,信用支出或配額代幣時使用這個.

在這種模式下,本地代幣是應用程序支付.它不是網絡費資產.贊助商仍然支付網絡費用在 XOR.

例如,在私人數據空間中使用本地代幣:

```text
usage#billing.team
```

在登錄,訂閱更新或配額分配期間,資助用戶使用 `usage#billing.team`.然後將用戶交易變爲原子:

1. 將本地代幣從用戶轉移到贊助商
2. 執行所要求的應用程序操作
3. 包含`fee_sponsor`元數據,因此贊助商支付 XOR

一個最小的 CLI 煙霧測試僅僅是由 XOR 贊助的本地代幣轉移:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

對於真正的應用程序,不要將本地代幣支付作爲一個單獨的最佳努力交易.構建包含支付和業務指令的簽名交易,或者在運行業務之前暴露收取本地代碼的合同入口點.

在您的應用程序或合同中保存轉換政策:

- 哪個操作成本多少個本地代幣單位
- 如何支持本地代幣輸入地圖 XOR 補充
- 如果用戶平衡太低,會發生什麼?
- 當贊助商 XOR 餘額太低時會發生什麼?

::: warning

不要使用 `gas_asset_id` 除非您希望贊助商在該氣體資產中也收取費用. 在當前的運行時間, `fee_sponsor` 也使贊助商爲配置管道氣體資產借款的付款人.對於本地代幣用戶費用,通過轉讓或合同規則,明確收集代幣.

:::

## 檢查未成功的贊助交易 {#debug-failed-sponsored-transactions}

常見的拒絕理由通常指向一個缺失的設置步驟:

|錯誤文本|檢查什麼?|
| --- | --- |
|`fee sponsorship is disabled`| `nexus.fees.sponsorship_enabled` 現在還在 `false` 在節點上. |
|`fee sponsor is not authorized`|用戶沒有 `CanUseFeeSponsor`用於此贊助商. |
|`fee asset ... is missing`|贊助商沒有配置的 XOR 費用資產. |
|`fee balance ... is insufficient`| 補充贊助商的 XOR 保持平衡. |
|`fee exceeds sponsor_max_fee`|增加 `sponsor_max_fee`或減少交易規模/氣體. |
|`invalid nexus fee asset id`|固定 `nexus.fees.fee_asset_id`或 XOR 資產別名.|

在調試模式2時,檢查兩個平衡:

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

## 運營贊助商 {#operate-the-sponsor}

處理贊助商作爲一個財政賬戶:

- 保持測試網,階段化和主網的分別贊助鑰匙
- 提醒贊助商 XOR 餘額到達入學樓層
- 一旦交通特徵化,設置非零限 `sponsor_max_fee`
- 在您的應用程序或網關中贊助的筆記
- 當用戶離開數據空間時,取消 `CanUseFeeSponsor`
- 調整用戶交易哈希,本地代幣支付和贊助人 XOR 抵押金

取消用戶的贊助權:

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

## 相關頁面 {#related-pages}

- [連接到 SORA Nexus 數據庫](/zh-hant/get-started/sora-nexus-dataspaces.md)
- [通過 CLI](/zh-hant/get-started/operate-iroha-via-cli.md)運行 Iroha 3
- [資產](/zh-hant/blockchain/assets.md)
- [許可證](/zh-hant/blockchain/permissions.md)
- [許可證代幣](/zh-hant/reference/permissions.md)
