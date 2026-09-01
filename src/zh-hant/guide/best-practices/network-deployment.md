---
translation_locale: zh-hant
translation_source: /guide/best-practices/network-deployment.md
translation_source_hash: 7839268b8c1f6700b0c26652e3308fa4e8acef4717d8527c609b6f30fb8c84ab
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# 網路部署 {#network-deployment}

將 Iroha 網路視為一個協調系統. 在網路啟動之前,驗證者必須同意創世學,拓撲,可信賴的對等節點和共識相關的配置繼續完成區塊.

## 環境分離 {#environment-separation}

- 為本地開發,共享測試網路,階段化和生產提供單獨的配置捆綁.
- 在生產中不要再使用 localnet 或 Taira 金鑰材料.
- 保持對等節點配置,客戶端配置,簽署的起源,指令碼和部署筆記作為一個版本的釋出構件.
- 在儲存庫和部署模板之外儲存私鑰.

見 [網路部署關鍵](/zh-hant/guide/configure/keys-for-network-deployment.md).

## 創世紀和拓撲 {#genesis-and-topology}

- 讓每個驗證者都使用相同的簽署創世交易,可靠的對等節點集,拓,在個人資料要求時,驗證者擁有權證明.
- 用至少四個驗證器來實現最小的拜占庭錯誤耐受性部署.
- 在能力規劃中,與觀察者分別進行驗證. 觀察者不會投票,提出或收集資訊,但它們仍然消耗儲存,區塊同步和網路頻寬.
- 把創世,執行器和拓變化視為協調的遷移而不是單對等節點編輯.

參見 [Genesis](/zh-hant/reference/genesis.md), [對等節點管理](/zh-hant/guide/configure/peer-management.md)和 [績效和指標](/zh-hant/guide/advanced/metrics.md#node-count-and-quorum).

## Torii 和網路訪問 {#torii-and-network-access}

- 當它暴露在主機或私人網路之外時,將 Torii 置於反向代理或防火牆後面.
- 在部署需要時,終止 TLS,並在邊緣應用基本身份驗證,速度限制和要求尺寸控制.
- 只有環境所需的端點才可公佈.運營商和遠端測量路線應比公共僅閱讀路線更為有限.
- 當對等節點不應直接接受遠端流量時,將聽者地址繫結到主機本地介面.

檢視 [Torii 端點](/zh-hant/reference/torii-endpoints.md)和 [虛擬私人網路](/zh-hant/guide/security/vpn.md).

## 統一和能力 {#consensus-and-capacity}

- 在調整共識計時器之前,測量部署. 較低的時間限制只能在網路,儲存和執行層保持跟蹤時減少延遲.
- 觀察佇列方向,而不僅僅是短暫的吞吐量樣本.隨著穩定的負載而增長的排隊意味著網路過載.
- 記錄每一個基準指標的有效 Sumeragi 引數,遠端測量配置檔案,驗證器計數,網路 RTT,工作負載形狀和硬體詳細資訊.
- 每次更改一個有限的排列或有效載荷恢復限度,並保留前後延遲,流量,記憶體和反壓力證據.

檢視 [績效和指標](/zh-hant/guide/advanced/metrics.md).

## 純金屬和工藝管理 {#bare-metal-and-process-management}

- 保持每個對等節點 `config.toml`,私鑰,儲存目錄和埠的分別.
- 使用 systemd 等程序管理器,明確重新啟動,記錄和資源政策.
- 儲存生成的 README 和從 Kagami localnet捆綁中啟動命令,當將測試拓進行轉換到管理的主機時.

檢視 [在 Bare Metal](/zh-hant/guide/advanced/running-iroha-on-bare-metal.md)上執行 Iroha.
