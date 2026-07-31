---
translation_locale: zh-hant
translation_source: /guide/best-practices/network-deployment.md
translation_source_hash: 312f9cb3c6fd937b3e7c30ea27d1876ea7901cfa79eced352611db99bbca4a70
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 網路部署 {#network-deployment}

治療一個 Iroha 核實者必須同意
基因,拓,可信的同行以及共識相關的配置
在網路開始並繼續完成區塊之前.

## 區域分隔 {#environment-separation}

- 為地方開發提供獨立配置組,
  這項計畫的目標是:
- 沒有任何可處理環境的新鍵.
  地方網路或 Taira 在生产中使用的重要材料.
- 保持同行配置,客戶配置,簽名基因,脚本和部署
  這項計畫的目標是:
- 存儲私密鍵在資料庫及部署模板之外.

請看
[網路部署的關鍵](/zh-hant/guide/configure/keys-for-network-deployment.md).

## 創世記與拓論 {#genesis-and-topology}

- 讓每個驗證者都使用相同的簽名創始交易,
  專屬性證據
  需要他們.
- 使用至少四個驗證器,
  部署.
- 觀察員不需要使用其他工具,
  他們仍然使用存儲,區塊同步,
  並提供網路頻寬.
- 處理基因,執行器和拓變化作為協調的遷移
  而不是獨立的編輯.

請看 [創世記](/zh-hant/reference/genesis.md),
[同級管理](/zh-hant/guide/configure/peer-management.md), 及其他
[性能與指標](/zh-hant/guide/advanced/metrics.md#node-count-and-quorum).

## Torii 以及網路接入 {#torii-and-network-access}

- 放下 Torii 在外面露出時,
  主機或私人網路.
- 結束 TLS 並適用基本認證,限制利率,
  在部署需要時,
- 只有環境需要的端點才被公布.
  遠程測量路線應比公共僅閱讀路線更嚴格.
- 聯繫聽者地址與主機本地接口,
  直接接受遠端交通.

請看 [Torii 目的地](/zh-hant/reference/torii-endpoints.md) 及其他
[虛擬私人網絡](/zh-hant/guide/security/vpn.md).

## 協調和能力 {#consensus-and-capacity}

- 在調節共識時間之前, 測量部署.
  只有在網路,儲存和執行層保持追蹤時才會減少延遲.
- 觀看排隊方向,而不是短暫的吞吐量樣本.
  在穩定的負載中增長,意味著網路過重.
- 記錄有效性 Sumeragi 參數,遠隔計程表格,驗證碼的數量,
  網路 RTT, 每個基准指數的工作負載形狀和硬體細節.
- 只有在比较延迟,流量和
  這樣的訊息,

請看 [性能與指標](/zh-hant/guide/advanced/metrics.md).

## 純金屬及工藝管理 {#bare-metal-and-process-management}

- 保持每個同行的 `config.toml`, 隱私關鍵,儲存目錄和端口
  沒有任何相關資訊.
- 使用過程管理器,例如: systemd 顯示重新啟動,記錄,
  資源政策.
- 產生的儲存 README 開始命令從 Kagami 局部網路捆綁
  在將測試拓學翻譯為管理的主機時.

請看
[跑步 Iroha 在純金屬上](/zh-hant/guide/advanced/running-iroha-on-bare-metal.md).
