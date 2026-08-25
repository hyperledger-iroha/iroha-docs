---
translation_locale: zh-hant
translation_source: /blockchain/accounts.md
translation_source_hash: 015a85d81c44b7ef7f13cdafb2ed8e493ef512b94dc500939655c70285eac3bd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 賬戶 {#accounts}

帳戶是一個可以簽署交易的權威機構,並擁有賬本狀態.在當前 Iroha 3 數據模型中,`AccountId`是正規和無域名的:它源於賬戶控制器,可編碼爲 [I105](/zh-hant/reference/i105.md). 人能閱讀的域名和數據空間背景屬於單獨的帳戶代號結合.

## 結構 {#structure}

已註冊的 `Account` 包含:

- `id`:法典`AccountId`
- `metadata`:任意的賬戶元數據
- `label`:可選的穩定別名
- `uaid`:可選的通用賬戶 ID 用於 Nexus 流.
- `opaque_ids`:與賬戶的 UAID 綁定的不透明標識符

創建帳戶所使用的交易有效載荷爲 `NewAccount`.它攜帶相同的身份,元數據,標籤, UAID 和不透明的 ID 字段,被註冊賬戶使用.

`uaid` 補充了法典 `AccountId`; 它不會取代它.當使用時 Nexus 服務需要一個穩定的用戶或組織處理跨數據域,運行時間保持一個人對一個 UAID- 需要通過一個模糊的標識符 UAID, 拒絕複製或碰撞的不透明標識符. [FHE 和 UAID](/zh-hant/blockchain/sora-nexus-services.md#fhe-and-uaid) 對於 Nexus 服務層流量.

## 賬戶控制者 {#account-controllers}

控制器定義了帳戶如何授權操作.默認客戶端流程使用Ed25519鍵對,但數據模型還支持多簽字政策控制器等更豐富的控制器.

客戶端配置將簽字權從同行配置分別存儲:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

查看當前關鍵格式[客戶端配置](/zh-hant/guide/configure/client-configuration.md)和 [關鍵生成](/zh-hant/guide/security/generating-cryptographic-keys.md).

## 在 Taira 試看. {#try-it-on-taira}

列出一些神聖經文 IDs 來自公衆 Taira 測試網:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

爲了檢查賬戶資產,從第一次調用中複製一個帳戶 ID,然後在將其放入路徑之前編碼 URL.該 Python 片段爲上市的第一個賬戶執行:

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

創建或更新一個帳戶是一個簽署的交易,需要水 Taira 描述的設置 [連接到 SORA Nexus 數據庫](/zh-hant/get-started/sora-nexus-dataspaces.md).

## 登記和許可證 {#registration-and-permissions}

帳戶註冊和未註冊,使用通用 [`Register`和 `Unregister`](/zh-hant/blockchain/instructions.md#un-register)指令.主動運行時間驗證器決定誰可以創建賬戶以及需要哪些許可代幣或角色.

在註冊後,帳戶可以:

- 簽署交易
- 持有資產
- 自己的域名
- 接收角色和權限令牌
- 存儲元數據
- 當這些功能被啓用時,參與別名, rekey,回收和 Nexus 身份流

## 解決身份問題 {#troubleshooting-identity-issues}

如果交易意外地被拒絕,請檢查:

- 客戶公鑰與簽名所使用的私鑰相匹配
- 賬戶已在創始過程中或通過承諾的交易註冊
- 權威有指令要求的許可
- 嚴格賬戶字段使用常規 I105 帳戶 ID,而可讀的名稱通過活躍賬戶代號綁定解決.

此外,請參見:

- [許可證](/zh-hant/blockchain/permissions.md)
- [超值數據](/zh-hant/blockchain/metadata.md)
- [客戶端配置](/zh-hant/guide/configure/client-configuration.md)
- [SORA Nexus 數據空間](/zh-hant/get-started/sora-nexus-dataspaces.md)
