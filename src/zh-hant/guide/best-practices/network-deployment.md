---
translation_locale: zh-hant
translation_source: /guide/best-practices/network-deployment.md
translation_source_hash: 312f9cb3c6fd937b3e7c30ea27d1876ea7901cfa79eced352611db99bbca4a70
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 網絡部署 {#network-deployment}

將 Iroha 網絡視爲一個協調系統. 在網絡啓動之前,驗證者必須同意基因學,拓學,可信賴的同行和共識相關的配置繼續完成區塊.

## 環境分離 {#environment-separation}

- 爲本地開發,共享測試網絡,階段化和生產提供單獨的配置捆綁.
- 在生產中不要再使用 localnet 或 Taira 關鍵材料.
- 保持同行配置,客戶端配置,簽署的起源,腳本和部署筆記作爲一個版本的發佈文物.
- 在存儲庫和部署模板之外保存私鑰.

見 [網絡部署關鍵](/zh-hant/guide/configure/keys-for-network-deployment.md).

## 創世紀和拓學 {#genesis-and-topology}

- 讓每個驗證者都使用相同的簽署基因交易,可靠的同行集,拓,在個人資料要求時,驗證者擁有權證明.
- 用至少四個驗證器來實現最小的拜占庭錯誤耐受性部署.
- 在能力規劃中,與觀察者分別進行驗證. 觀察者不會投票,提出或收集信息,但它們仍然消耗存儲,區塊同步和網絡帶寬.
- 把基因,執行器和拓變化視爲協調的遷移而不是單同行編輯.

參見 [Genesis](/zh-hant/reference/genesis.md), [同行管理](/zh-hant/guide/configure/peer-management.md)和 [績效和指標](/zh-hant/guide/advanced/metrics.md#node-count-and-quorum).

## Torii 和網絡訪問 {#torii-and-network-access}

- 當它暴露在主機或私人網絡之外時,將 Torii 置於反向代理或防火牆後面.
- 在部署需要時,終止 TLS,並在邊緣應用基本身份驗證,速度限制和要求尺寸控制.
- 只有環境所需的終端點纔可公佈.運營商和遠程測量路線應比公共僅閱讀路線更爲有限.
- 當同行不應直接接受遠程流量時,將聽者地址綁定到主機本地接口.

查看 [Torii 終點](/zh-hant/reference/torii-endpoints.md)和 [虛擬私人網絡](/zh-hant/guide/security/vpn.md).

## 統一和能力 {#consensus-and-capacity}

- 在調整共識計時器之前,測量部署. 較低的時間限制只能在網絡,存儲和執行層保持跟蹤時減少延遲.
- 觀察隊列方向,而不僅僅是短暫的吞吐量樣本.隨着穩定的負載而增長的排隊意味着網絡過載.
- 記錄每一個基準指標的有效 Sumeragi 參數,遠程測量配置文件,驗證器計數,網絡 RTT,工作負載形狀和硬件詳細信息.
- 僅在比較延遲,流量和反壓信號後增加收藏器的容量.

查看 [績效和指標](/zh-hant/guide/advanced/metrics.md).

## 純金屬和工藝管理 {#bare-metal-and-process-management}

- 保持每個同行 `config.toml`,私鑰,存儲目錄和端口的分別.
- 使用 systemd 等進程管理器,明確重新啓動,記錄和資源政策.
- 保存生成的 README 和從 Kagami localnet捆綁中啓動命令,當將測試拓進行轉換到管理的主機時.

查看 [在 Bare Metal](/zh-hant/guide/advanced/running-iroha-on-bare-metal.md)上運行 Iroha.
