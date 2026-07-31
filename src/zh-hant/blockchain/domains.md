---
translation_locale: zh-hant
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 域名 {#domains}

域名是註冊在 `World`. 在目前的情況下 Iroha
域名是由其主數據空間獲得資格的,
識別號碼是:

```text
domain.dataspace
```

這樣的情況 `payments.universal` 這些名字 `payments` 在這個領域內
`universal` 沒有任何相關資訊.

## 結構 {#structure}

已註冊的 `Domain` 含有:

- `id`: 數據空間合格 `DomainId`
- `logo`: 選擇性 `SoraFS` URI 對域名標誌
- `metadata`: 任意的關鍵值元數據
- `owned_by`: 擁有域名的帳戶,通常是該帳戶
  已註冊

實現一個域名的使用量是 `NewDomain`. 這裡有
這項政策 `id`, 選擇性 `logo`, 及初始 `metadata`. 跑步時間充滿
`owned_by` 常見的客戶不提供此用荷物
直接使用.

## 登記 {#registration}

這樣的設定流程將保持在
SNS 租,所有者能力,報價保護和域名排列在一個原子
`EnsureAlias` 這項交易. `Register::Domain` 仍是一個創始/開啟帶
表面,以及 `ledger domain` 沒有命令 `register` 這位副司令官.

建立一個沒有秘密的網站. `AliasSetupPlanRequestV1` 目的是 SDK 或是搭乘
服務,然後有 CLI 預算與現實狀態相反,
計畫:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

目的是識別 `payments.universal`, 它的數字資料空間,
I105 租收購期限及現行政策/付款提價保證
預算的終點是: `POST /v1/aliases/setup/plan`; 返回的計劃是
域外移除仍在使用
[`Unregister`](/zh-hant/blockchain/instructions.md#un-register).

建立或移除域名需要適當的域管理
在主動執行時間驗證器下使用權限.
[`SetKeyValue` 及其他 `RemoveKeyValue`](/zh-hant/blockchain/instructions.md#setkeyvalue-removekeyvalue)
當該權利有許可修改該域名時.

## 試著使用 Taira {#try-it-on-taira}

目前公眾可見的域名列表 Taira 檢測網:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

顯示公共路徑目錄的地圖:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

使用第一個命令,當應用程式需要檢查是否存在域名.
在您需要確認資料空間是否公開時,
限制或落後核心車道.

在試用之前, Taira, 拯救他們
來自的水龙头助手
[獲得測試網 XOR 在 Taira](/zh-hant/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
這樣的 `taira_faucet_claim.py`, 通過公共水龙头提供簽名者資金,
附加費用的數據:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

在重複的測試網運行上建立獨特域名的意圖,
Taira 沒有使用已生成的計劃,
在本地網路上或 Minamoto.

## 與其他單位的關係 {#relationship-to-other-entities}

提供域名範圍的數據的名稱空間.
資產定義使用域名合格識別子,查詢可以列出
域名或找到一個域目的對象.
但帳戶可以擁有域名,
該類型的產品,

查看以下內容:

- [世界](/zh-hant/blockchain/world.md)
- [資產](/zh-hant/blockchain/assets.md)
- [數據表](/zh-hant/blockchain/metadata.md)
- [命名規則](/zh-hant/reference/naming.md)
