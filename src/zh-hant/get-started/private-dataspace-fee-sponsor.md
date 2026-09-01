---
translation_locale: zh-hant
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 37a2c29dccf3d2abacbbba16869d65b70b93545875a122470601194231c2263b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 提供私人資料空間的贊助費 {#sponsor-fees-for-a-private-dataspace}

費用贊助允許使用者在不持有 XOR 的情況下提交私有資料空間交易。使用者仍需簽署交易。交易中繼資料指向贊助者帳戶，執行階段會從該帳戶的 XOR 餘額扣除網路費用。

整合有三個移動部分:

1. 節點允許費用贊助
2. 贊助商帳戶存在,並擁有 XOR
3. 每個使用者對該贊助商擁有 `CanUseFeeSponsor`

在此之後,每一個贊助的使用者交易只需要這個後設資料:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

這個頁面顯示了兩個常見的模式:

- 使用者免手續費寫入:贊助商支付 XOR 而使用者沒有支付.
- 地方代幣費用:使用者以應用代幣支付贊助商,贊助商則以 XOR 支付網路.

首先使用 Taira 或私有測試網路. 新的私人資料空間是運營商和治理變化;它不是由客戶端配置建立的.

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

使用規範 I105 帳戶 IDs,除非您的部署對相同帳戶有活躍帳戶號.

## 1. 準備資料空間 {#_1-prepare-the-dataspace}

從 [中描述的私人資料空間目錄和路由工作開始連線到 SORA Nexus 資料域](/zh-hant/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace).一個面向操作員的片段看起來像這樣:

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

在轉移到使用者交易之前,請檢查:

- 在 `/status` 節點響應中顯示私人通道
- 使用者帳戶由您的私人登入流程接入
- 贊助商帳戶存在
- XOR 費用資產和費用清算帳戶在網路上有效

## 2. 在資料空間中註冊資產 {#_2-register-assets-in-the-dataspace}

在將其傳輸到應用邏輯中之前,註冊使用者將在私人資料空間內保留的資產定義.對於本地代幣費用模式,教程使用`usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

首先設定擁有資產命名空間的網域和 SNS 租約。為 `$BILLING_DOMAIN` 建立一個不含秘密資訊的 `AliasSetupPlanRequestV1` 意圖，其中包括數字型 `team` 資料空間 ID、規範所有者、租期和目前的報價保護條件：

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

然後註冊資產定義. 規範性 `--id` 是網路級資產定義 ID.開發人員和終端使用者應該在資料空間程式碼中使用的稱:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

在登入過程中將本地代幣發貨或轉移給使用者:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

檢查使用者的餘額:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

使用資料空間中的應用資產的模式相同. 每個代幣註冊一個資產定義,給每個程式碼一個資料空間別名,並引用 SDK 程式碼的代號而不是硬編碼的規範資產定義 IDs.

## 3. 登記使用者姓名 {#_3-register-user-aliases}

帳戶仍然是規範的 I105 帳戶 IDs.面向使用者的名稱是帳戶號,而號應是不敏感的手柄,如`alice@team`或`alice@members.team`.不要用電話號碼或電子郵件地址作為號.這些都屬於下一節的私人識別器流中.

姓名設定使用與域名設定相同的宣告規劃器.讓 SDK 或登入服務建立一個無秘密的 `AliasSetupPlanRequestV1`意圖,其帳戶代號輸入 目標 `$USER`,選擇主要角色,鍵入數值資料空間 ID,並執行當前租報價保護.然後規劃並將其作為一個原子交易:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

如果使用者不應該支付 XOR,請使用批准的贊助商知情登入服務來構建和提交設定交易.不要將租收購和密號繫結分為獨立申請交易.

在密名被繫結後,請從 CLI 檢查:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

對於建立新帳戶,最好使用穩定 `uaid`和必要時初始 `label`構建 `NewAccount` 的安裝服務.簡單的 `ledger account register --id`命令只會記錄規範帳戶 ID.

## 4. 透過 FHE 私下登記電話和電子郵件. {#_4-register-phone-and-email-privately-with-fhe}

使用電話號碼和電子郵件地址作為私人識別器索賠,而不是公開別名.支援 FHE 的流量將原始識別器排除在帳戶別名,交易後設資料和世界狀態之外:

1. 運營商註冊[RAM-LFE/FHE 電話和電子郵件專案政策](/zh-hant/blockchain/ram-lfe.md)
2. 運營商註冊活躍標識策略,如 `phone#team`和 `email#team`
3. 錢包將電話或電子郵件正常化.
4. 錢包將加密值傳送到解決器
5. 解析器返回一個 `IdentifierResolutionReceipt`
6. 使用者將 `ClaimIdentifier` 附收據提交
7. 鏈儲存一個不透明的識別符號和回執雜湊,而不是原始電話或電子郵件值.

運營商方策略設定是 SDK 或服務任務.為每個識別符號型別構建並提交這些指令對:

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

複製為電子郵件:

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

在第8步建立贊助商後設資料檔案後,提交使用者簽署的索賠指示,並附上該後設資料:

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

電流 CLI 不顯示這些身份指令的輸入命令.使用 SDK 生成序列化`InstructionBox`值,並透過 `ledger transaction stdin`提交它們:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

在安裝服務中保留這些防護:

- 帳戶名字只能被人讀取的手柄
- 原始電話和電子郵件值永遠不會出現在號,後設資料,日誌或交易有效載荷中.
- 在申請私人識別符號之前,該帳戶有`uaid`
- 收據結合 `policy_id`, `opaque_id`, `uaid`, `account_id`,並過期
- 解決方案金鑰和隱藏程式承諾由治理控制

## 5. 啟用節點上的贊助 {#_5-enable-sponsorship-on-the-node}

費用贊助是節點/執行階段政策. 在 Nexus 費用配置中啟用:

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

`fee_asset_id`是網路費用資產.對於 SORA Nexus,這是 XOR.使用您的網路所曝光的活躍 XOR 號或規範 XOR 資產定義 ID

`sponsor_max_fee = "0"`意味著沒有每筆交易的贊助商上限. 在您知道資料空間交易的正常大小和gas配置後,設定非零限量.

在正常操作程式中重新啟動或滾動這個配置.

## 6. 建立和資助贊助者 {#_6-create-and-fund-the-sponsor}

如果需要,生成一個贊助商關鍵對:

```bash
kagami keys --algorithm ed25519 --out-dir ./fee-sponsor-key
```

將公鑰轉換為網路帳戶格式:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

透過您的私人登入流程註冊贊助商帳戶:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

透過 XOR 從財政部,索賠帳戶或其他資助帳戶為贊助商提供資金:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

對於 Taira 試煉,除了水龍頭助手 [獲取測試網 XOR 在 Taira](/zh-hant/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) 作為 `taira_faucet_claim.py`, 然後透過公共水龍頭來資助贊助商,而不是財政轉賬:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

檢視贊助商的 XOR 餘額:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. 讓使用者訪問贊助商 {#_7-grant-a-user-access-to-the-sponsor}

贊助商必須授予每個使用者向其收取費用的許可權。該授權可防止使用者指定任意贊助商帳戶。

執行這個作為贊助商帳戶,或者作為一個經營帳戶允許的執行階段政策:

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

對於登入服務,將此作為一個正常的帳戶提供步驟,並記錄:

- 使用者帳戶
- 贊助商帳戶
- 資料空間或應用
- 批准票或治理決定

檢查使用者的授權：

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. 附加贊助商的後設資料 {#_8-attach-sponsor-metadata}

建立可重複使用的後設資料檔案:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

使用此後設資料提交的任何寫入操作都會向贊助商收費：

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

對於 SDKs，將相同的交易中繼資料物件加入已簽署的交易。使用者以自己的金鑰簽署交易。贊助商不會簽署每一筆使用者交易，因為先前授予的 `CanUseFeeSponsor` 本身就是授權。

## 模式 1：使用者不支付費用 {#pattern-1-users-pay-no-fees}

在應用程式或運營商收取所有網路費時使用此方法.

開發者檢查列表:

1. 保持使用者的正常交易有效載荷不變.
2. 新增 `fee_sponsor` 的交易後設資料.
3. 作為使用者簽署.
4. 透過私人資料空間路線提交.

使用者帳戶不需要 XOR 的餘額.贊助商帳戶必須保持足夠的 XOR 來支付配置的 Nexus 費用.

## 模式2:使用者支付本地代幣 {#pattern-2-users-pay-a-local-token}

如果使用者不應該持有 XOR,但資料空間仍然需要內部應用程式費用,信用支出或配額代幣時使用這個.

在這種模式下,本地代幣是應用程式支付.它不是網路費資產.贊助商仍然支付網路費用在 XOR.

例如,在私人資料空間中使用本地代幣:

```text
usage#billing.team
```

在登入,訂閱更新或配額分配期間,資助使用者使用 `usage#billing.team`.然後將使用者交易變為原子:

1. 將本地代幣從使用者轉移到贊助商
2. 執行所要求的應用程式操作
3. 包含`fee_sponsor`後設資料,因此贊助商支付 XOR

一個最小的 CLI 冒煙測試僅僅是由 XOR 贊助的本地代幣轉移:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

對於實際應用，不要把本地代幣付款作為單獨的盡力而為交易提交。應建構一筆同時包含付款和業務指令的已簽署交易，或者公開一個合約進入點，在執行業務操作之前收取本地代幣。

在您的應用程式或合同中儲存轉換政策:

- 哪個操作成本多少個本地代幣單位
- 如何支援本地代幣輸入地圖 XOR 補充
- 如果使用者餘額太低,會發生什麼?
- 當贊助商 XOR 餘額太低時會發生什麼?

::: warning

不要使用 `gas_asset_id` 除非您希望贊助商在該gas資產中也收取費用. 在當前的執行階段, `fee_sponsor` 也使贊助商為配置管道gas資產借款的付款人.對於本地代幣使用者費用,透過轉讓或合同規則,明確收集代幣.

:::

## 檢查未成功的贊助交易 {#debug-failed-sponsored-transactions}

常見的拒絕理由通常指向一個缺失的設定步驟:

|錯誤文字|檢查什麼?|
| --- | --- |
|`fee sponsorship is disabled`| `nexus.fees.sponsorship_enabled` 現在還在 `false` 在節點上. |
|`fee sponsor is not authorized`|使用者沒有 `CanUseFeeSponsor`用於此贊助商. |
|`fee asset ... is missing`|贊助商沒有配置的 XOR 費用資產. |
|`fee balance ... is insufficient`| 補充贊助商的 XOR 保持餘額. |
|`fee exceeds sponsor_max_fee`|增加 `sponsor_max_fee`或減少交易規模/gas. |
|`invalid nexus fee asset id`|固定 `nexus.fees.fee_asset_id`或 XOR 資產別名.|

在除錯模式2時,檢查兩個餘額:

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

處理贊助商作為一個財政帳戶:

- 保持測試網,階段化和主網的分別贊助鑰匙
- 在 sponsor 的 XOR 餘額降至 admission floor 之前發出警示
- 一旦交通特徵化,設定非零限 `sponsor_max_fee`
- 在您的應用程式或閘道器中贊助的筆記
- 當使用者離開資料空間時,取消 `CanUseFeeSponsor`
- 調整使用者交易雜湊,本地代幣支付和贊助人 XOR 抵押金

取消使用者的贊助權:

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

- [連線到 SORA Nexus 資料空間](/zh-hant/get-started/sora-nexus-dataspaces.md)
- [透過 CLI](/zh-hant/get-started/operate-iroha-via-cli.md)執行 Iroha 3
- [資產](/zh-hant/blockchain/assets.md)
- [許可證](/zh-hant/blockchain/permissions.md)
- [許可證代幣](/zh-hant/reference/permissions.md)
