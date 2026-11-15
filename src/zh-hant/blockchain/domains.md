---
translation_locale: zh-hant
translation_source: /blockchain/domains.md
translation_source_hash: 26e8efe6c728d0f819b12e7d8257777d3d4ea272f42fabf8aec727467146500f
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# 域名 {#domains}

網域是登記於 `World` 的具名命名空間。在目前的 Iroha 3 資料模型中，網域以其所屬資料空間限定名稱，因此標準識別碼為：

```text
domain.dataspace
```

例如，`payments.universal` 表示 `universal` 資料空間內的 `payments` 網域。

## 結構 {#structure}

已註冊的 `Domain` 包含:

- `id`：以資料空間限定名稱的 `DomainId`
- `logo`:域名標誌的可選標誌`SoraFS` URI
- `metadata`:任意的關鍵值後設資料
- `owned_by`:域名所有權的帳戶,通常是註冊該域名的帳戶

啟動帶有效載荷用於實現域名是 `NewDomain`.它攜帶`id`,可選 `logo`和初始 `metadata`.執行階段從授權主體填寫`owned_by`.普通客戶不會直接提交這種有效載荷.

## 登記 {#registration}

通常的域名建立使用宣告別名設定流程.這將 SNS 租協議,所有者功能,報價保護和域名行保持在一個原子 `EnsureAlias`交易中.`Register::Domain`仍然是創世/bootstrap表面,並且`ledger domain`命令沒有`register`子命令.

透過 SDK 或登入服務建立一個無秘密的 `AliasSetupPlanRequestV1` 意圖,然後讓 CLI 與現實狀態進行計劃,並提交那個準確的計劃:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

此意圖指定 `payments.universal`、其數值資料空間識別碼、標準 I105 擁有者、租約取得期限，以及目前政策與付款報價的檢查條件。規劃端點為 `POST /v1/aliases/setup/plan`；傳回的計畫綁定特定鏈、授權主體、狀態與截止時間。移除網域仍使用 [`Unregister`](/zh-hant/blockchain/instructions.md#un-register)。

建立或刪除域名需要在主動執行階段驗證器下獲得適當的域管理許可權. 噹噹局有權修改該域名時,域名後設資料可以透過 [`SetKeyValue`和 `RemoveKeyValue`](/zh-hant/blockchain/instructions.md#setkeyvalue-removekeyvalue)更新.

## 在 Taira 試看. {#try-it-on-taira}

列出目前在公共測試網 Taira 上可見的域名:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

將公開通道目錄對應回資料空間別名：

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

應用程式需要確認網域是否存在時，請使用第一個命令。通道目錄可用來檢視與某個資料空間關聯的通道，包括每個通道的公開或受限可見性，以及相對於核心通道的同步狀態。

設定網域是需要支付費用的寫入操作。在 Taira 上嘗試前，請先使用[在 Taira 取得測試網 XOR](/zh-hant/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)所列的資金申領流程為簽署帳戶注資，再明確指定費用支付者以套用計畫。CLI 會在簽署前計算確切費用：

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

在重複測試網路執行中建立一個獨特域名的意圖,並使用 Taira 的當前政策和費用資產報價保護.不要再利用為 localnet 或 Minamoto 製作的計劃.

## 與其他實體的關係 {#relationship-to-other-entities}

域名整合賬本物件,為域名擴充套件的資料提供一個名稱空間.資產定義使用域名合格識別符號,查詢可以列出域名或找到在當前資料模型中,帳戶本身是無域的,但帳戶可以擁有域和持有其定義在域下存在的資產.

此外,請參見:

- [世界](/zh-hant/blockchain/world.md)
- [資產](/zh-hant/blockchain/assets.md)
- [超值資料](/zh-hant/blockchain/metadata.md)
- [命名規則](/zh-hant/reference/naming.md)
