---
translation_locale: zh-hant
translation_source: /guide/security/vpn.md
translation_source_hash: 020591f0d7c5560dfb2e9f3f4537f429cbeba864c3eb022856d42addcf32e225
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 虛擬私人網路 {#virtual-private-networks}

一個 <abbr title="Virtual Private Network">VPN</abbr>是一個網路控制系統,它限制了誰可以訪問 Iroha 服務. 它最適用於私人和聯盟部署,驗證器,應用程式後臺和運營商應該透過私人地址而不是開放的網際網路路線進行通訊.

一個 VPN 不取代 Iroha 對等節點金鑰,帳戶金鑰,許可權,防火牆規則,監控或安全金鑰儲存.將其視為一個層部署界限: VPN 縮小網路可訪問性,而 Iroha 配置和治理決定哪些對等節點和帳戶是值得信賴的.

## 什麼時候使用 VPN {#when-to-use-a-vpn}

使用 VPN 當:

- 驗證器由不同的組織或不同託管環境運營
- Torii 應僅由應用程式後端,運營商或可信的客戶訪問
- 資料,日誌, SSH 或其他管理端點必須在私營運營商網路中保持
- 測試或階段化網路應類似於生產訪問控制,而不暴露公共端點

每次部署都不需要 VPN.公共網路可能會故意透過公共門戶,負載平衡器或反轉代理來暴露 Torii.即使在這種情況下,儘可能地將驗證器對等流量和管理端點放在一個受限制的網路上.

::: tip

瀏覽器 VPN 只保護該瀏覽器的流量.除非這些過程透過同一私人網路路由,否則它不會保護`iroha3d`,CLI,SDK,SSH,指標或備份流量.

:::

## 部署模式 {#deployment-pattern}

對於私人驗證器網格,給每個驗證器一個穩定的 VPN 地址或私人 DNS 名稱.配置對等節點,使其廣告的對等節點對對等節點地址可以從其他驗證器透過該網路訪問:

```toml
trusted_peers = [
  "PUBLIC_KEY_1@10.20.0.11:1337",
  "PUBLIC_KEY_2@10.20.0.12:1337",
  "PUBLIC_KEY_3@10.20.0.13:1337",
  "PUBLIC_KEY_4@10.20.0.14:1337",
]

[network]
address = "10.20.0.11:1337"
public_address = "10.20.0.11:1337"

[torii]
address = "10.20.0.11:8080"
```

使用分配給當前對等節點的地址 `network.address` 和 `network.public_address`. 每個對等節點應列出相同的可信的對等節點的身份,但有自家可訪問的地址 VPN 路線表.

客戶端和 CLI 配置應指向透過 VPN 或透過控制的內部閘道器可訪問的 Torii 端點:

```toml
torii_url = "http://10.20.0.11:8080"
```

如果 Torii 必須在 VPN 外使用,請將其置於提供 TLS,身份驗證,速度限制和記錄的反轉代理或負載平衡器後面.避免直接向公共網際網路暴露原始的對等節點埠或管理端點.

## 防火牆規則 {#firewall-rules}

使用主機和雲防火牆規則,即使有一個 VPN 存在:

|服務|建議訪問|
| --- | --- |
|網際網路埠|其他驗證器 VPN 地址只有 |
|Torii|應用程式後臺,運營商或可信的客戶端範圍 VPN |
|計量和健康檢查|運營商網路的監控系統|
|SSH 和管理 |基石主機,特權運營商 VPN 範圍,或破玻璃過程|
|備份和儲存複製|在私人網路上備份系統|

預設拒絕規則比寬泛的允許規則更易稽核。當新的對等節點加入網路時，應將 VPN 成員資格、防火牆允許清單和 Iroha 受信任對等節點設定作為一項協調變更一併更新。

## 運營檢查列表 {#operational-checklist}

- 選擇一個經過審計和積極維護的 VPN 實現,如 WireGuard,IPsec或由組織批准的管理私人網路.
- 用每個主機和運營商的獨特 VPN 憑證.不要在驗證器之間共享 VPN 金鑰.
- 保持 VPN 憑證與 Iroha 私鑰和創世簽字材料分開.
- 監測 VPN 延遲,資料包丟失,重新連線和路線變化.共識對持續網路不穩定性很敏感.
- 測試有效的 MTU.包碎可以看起來像間歇性對等節點或 Torii 故障.
- VPN 範圍允許達到同等, Torii,指標, SSH 和備份端點的檔案.
- 當主機,運營商帳戶或組織離開網路時,轉換 VPN 憑證.
- 避免一個 VPN 門戶作為驗證器之間唯一的路線.規劃生產網路的冗餘門戶或站點到站點路線.
- 在事件響應演習中包括 VPN 故障,以便運營商知道何時區分網路分割槽與 Iroha 過程故障.

## 相關頁面 {#related-pages}

- [安全原則](/zh-hant/guide/security/security-principles.md)
- [運營安全](/zh-hant/guide/security/operational-security.md)
- [網路部署的關鍵](/zh-hant/guide/configure/keys-for-network-deployment.md)
- [對等節點管理](/zh-hant/guide/configure/peer-management.md)
- [對等節點配置參考](/zh-hant/reference/peer-config/index.md)
