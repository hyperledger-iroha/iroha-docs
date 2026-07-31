---
translation_locale: zh-hant
translation_source: /blockchain/accounts.md
translation_source_hash: 7a0130655b4caae240ee261bc7d2059914828da258616bc78ccff41ee455e6d3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 帳戶 {#accounts}

帳戶是一家能簽署交易的權威機構,
在目前的情況下 Iroha 3 數據模型, `AccountId` 是法典的,沒有域名:
它是由帳戶管理者來源的, I105.
人可讀域和數據空間的背景屬於獨立的帳戶名稱
沒有任何限制.

## 結構 {#structure}

已註冊的 `Account` 含有:

- `id`: 經典 `AccountId`
- `metadata`: 任意的帳戶元數據
- `label`: 選擇性穩定名稱
- `uaid`: 選擇性通用帳戶 ID 使用於 Nexus 流量
- `opaque_ids`: 沒有透明的識別碼, UAID

建立帳戶的交易用量是 `NewAccount`. 這裡有
同樣的身份,元數據,標籤, UAID, 並不透明 ID 已使用的字段
註冊帳戶.

`uaid` 補充了法典 `AccountId`; 沒有任何替代性.
什麼時候 Nexus 服務需要一個穩定的使用者或組織處理
提供資料,保護隱私的註冊或服務能力查詢.
運行時間保持一對一 UAID需要不透明的識別碼,
必須通過一 UAID, 並拒絕複製或碰撞的不透明
查看
[FHE 及其他 UAID](/zh-hant/blockchain/sora-nexus-services.md#fhe-and-uaid) 關於 Nexus
服務層流量.

## 帳戶管理員 {#account-controllers}

控制器定義帳戶如何授權行動.
流量使用Ed25519鍵組,但數據模型也支持更豐富的
控制器,例如多簽名政策控制器.

客戶端配置將簽名權利存儲與同行分別
配置:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

請看 [客戶端配置](/zh-hant/guide/configure/client-configuration.md) 及其他
[關鍵世代](/zh-hant/guide/security/generating-cryptographic-keys.md) 關於
目前的關鍵格式.

## 試著使用 Taira {#try-it-on-taira}

列出一些聖經記錄 IDs 來自公眾 Taira 檢測網:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

檢查帳戶資產,複製帳戶 ID 在第一次通話時, URL- 編碼
在將它放在路上之前. Python 這樣做是第一次.
列表中的帳戶:

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

建立或更新帳戶是簽名的交易.
需要提供水龙头资金, Taira 在此描述的設置
[接觸到 SORA Nexus 數據區域](/zh-hant/get-started/sora-nexus-dataspaces.md).

## 註冊及許可證 {#registration-and-permissions}

帳戶注冊與未注冊的通用
[`Register` 及其他 `Unregister`](/zh-hant/blockchain/instructions.md#un-register)
執行時間驗證器決定誰可以建立帳戶
以及需要使用哪些授權令牌或角色.

在註冊後,帳戶可以:

- 簽署交易
- 持有資產
- 自己的域名
- 接收角色和許可令牌
- 存儲元數據
- 參與稱,回應,恢復, Nexus 當這些人
  功能已啟用

## 解決身份問題 {#troubleshooting-identity-issues}

如果交易意外被拒絕,請確認:

- 客戶公钥與簽名使用的私密鍵相匹配
- 該帳戶已註冊於創世記或承諾的交易中
- 該權威有指令所要求的許可
- 嚴格的帳戶欄位使用法典 I105 帳號 ID, 可閱讀的同時
  姓名是透過一個活跃的帳戶密碼結束方式解決

查看以下內容:

- [許可證](/zh-hant/blockchain/permissions.md)
- [數據表](/zh-hant/blockchain/metadata.md)
- [客戶端配置](/zh-hant/guide/configure/client-configuration.md)
- [SORA Nexus 數據空間](/zh-hant/get-started/sora-nexus-dataspaces.md)
