---
translation_locale: zh-hant
translation_source: /blockchain/accounts.md
translation_source_hash: d956bfb8c698fa463ef9fa84a91d50cf0e2100885eba670121ad78753f87d88d
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# 帳戶 {#accounts}

帳戶是可簽署交易並擁有帳本狀態的授權主體。在目前的 Iroha 3 資料模型中，`AccountId` 是不含網域的標準身分：它由帳戶控制器衍生，並以 [I105](/zh-hant/reference/i105.md) 標準形式編碼。人類可讀的網域與資料空間脈絡，則屬於獨立的帳戶別名綁定。

## 結構 {#structure}

已註冊的 `Account` 包含:

- `id`:規範`AccountId`
- `metadata`:任意的帳戶後設資料
- `label`:可選的穩定別名
- `uaid`：SORA Nexus 流程使用的選用通用帳戶 ID
- `opaque_ids`:與帳戶的 UAID 繫結的不透明識別符號

建立帳戶所使用的交易有效載荷為 `NewAccount`.它攜帶相同的身份,後設資料,標籤, UAID 和不透明的 ID 欄位,被註冊帳戶使用.

`uaid` 補充標準的 `AccountId`，並不取代它。當 SORA Nexus 服務需要跨資料空間的穩定使用者或組織識別、保護隱私的註冊流程，或服務能力查詢時，可使用此欄位。執行環境維護一對一的 UAID 與帳戶索引，要求不透明識別碼必須透過 UAID 附加，並拒絕重複或衝突的不透明識別碼。SORA Nexus 服務層流程請參閱 [FHE 與 UAID](/zh-hant/blockchain/sora-nexus-services.md#fhe-and-uaid)。

## 帳戶控制者 {#account-controllers}

控制器定義了帳戶如何授權操作.預設客戶端流程使用Ed25519鍵對,但資料模型還支援多簽字政策控制器等更豐富的控制器.

用戶端設定將簽署授權主體與網路對等節點設定分開儲存：

```toml
[account]
profile = "taira"
public_key = "ed0120..."
private_key_file = "/absolute/path/to/private.key"
```

檢視當前關鍵格式[客戶端配置](/zh-hant/guide/configure/client-configuration.md)和 [關鍵生成](/zh-hant/guide/security/generating-cryptographic-keys.md).

## 在 Taira 試看. {#try-it-on-taira}

列出公共 Taira 測試網上的幾個規範帳戶 IDs：

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.label // "-")] | @tsv'
```

為了檢查帳戶資產,從第一次呼叫中複製一個帳戶 ID,然後在將其放入路徑之前編碼 URL.該 Python 片段為上市的第一個帳戶執行:

```bash
python3 - <<'PY'
import json
import urllib.parse
import urllib.request

root = "https://taira.sora.org"
accounts = json.load(urllib.request.urlopen(f"{root}/v1/accounts?limit=1"))["items"]
account_id = accounts[0]["id"]
encoded = urllib.parse.quote(account_id, safe="")
assets = json.load(
    urllib.request.urlopen(f"{root}/v1/accounts/{encoded}/assets?limit=5")
)

print(json.dumps({"account_id": account_id, "assets": assets["items"]}, indent=2))
PY
```

這些都是公開讀取操作。建立或更新帳戶需要簽署交易，並依照[使用 Taira 和 Minamoto 在 SORA Nexus 上開發](/zh-hant/get-started/sora-nexus-dataspaces.md)的說明，完成由測試網資金服務提供資金的 Taira 設定。

## 登記和許可證 {#registration-and-permissions}

帳戶註冊和未註冊,使用通用 [`Register`和 `Unregister`](/zh-hant/blockchain/instructions.md#un-register)指令.主動執行階段驗證器決定誰可以建立帳戶以及需要哪些許可代幣或角色.

在註冊後,帳戶可以:

- 簽署交易
- 持有資產
- 自己的域名
- 接收角色和許可權令牌
- 儲存後設資料
- 在相關功能啟用時，參與別名、金鑰更換、復原及 SORA Nexus 身分流程

## 解決身份問題 {#troubleshooting-identity-issues}

如果交易意外地被拒絕,請檢查:

- 客戶公鑰與簽名所使用的私鑰相匹配
- 帳戶已在創世過程中或透過提交的交易註冊
- 授權主體有指令要求的許可
- 嚴格帳戶欄位使用規範 I105 帳戶 ID,而可讀的名稱透過活躍帳戶代號繫結解決.

此外,請參見:

- [許可證](/zh-hant/blockchain/permissions.md)
- [超值資料](/zh-hant/blockchain/metadata.md)
- [客戶端配置](/zh-hant/guide/configure/client-configuration.md)
- [SORA Nexus 資料空間](/zh-hant/get-started/sora-nexus-dataspaces.md)
