---
translation_locale: zh-hant
translation_source: /guide/security/vpn.md
translation_source_hash: 4161cec5d601ad3a57decc19402738358a03648adad8502b5282e8e9bacc3fa8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 虛擬私人網絡 {#virtual-private-networks}

一個 <abbr title="Virtual Private Network">VPN</abbr>是一個網絡控制系統,它限制了誰可以訪問 Iroha 服務. 它最適用於私人和聯盟部署,驗證器,應用程序後臺和運營商應該通過私人地址而不是開放的互聯網路線進行通信.

一個 VPN 不取代 Iroha 同行密鑰,帳戶密鑰,權限,防火牆規則,監控或安全密鑰存儲.將其視爲一個層部署界限: VPN 縮小網絡可訪問性,而 Iroha 配置和治理決定哪些同行和賬戶是值得信賴的.

## 什麼時候使用 VPN {#when-to-use-a-vpn}

使用 VPN 當:

- 驗證器由不同的組織或不同託管環境運營
- Torii 應僅由應用程序後端,運營商或可信的客戶訪問
- 數據,日誌, SSH 或其他管理終端點必須在私營運營商網絡中保持
- 測試或階段化網絡應類似於生產訪問控制,而不暴露公共終端點

每次部署都不需要 VPN.公共網絡可能會故意通過公共門戶,負載平衡器或反轉代理來暴露 Torii.即使在這種情況下,儘可能地將驗證器對等流量和管理終端點放在一個受限制的網絡上.

::: tip

瀏覽器 VPN 只保護該瀏覽器的流量.除非這些過程通過同一私人網絡路由,否則它不會保護`irohad`,CLI,SDK,SSH,指標或備份流量.

:::

## 部署模式 {#deployment-pattern}

對於私人驗證器網格,給每個驗證器一個穩定的 VPN 地址或私人 DNS 名稱.配置同行,使其廣告的同行對同行地址可以從其他驗證器通過該網絡訪問:

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

使用分配給當前同行的地址 `network.address` 和 `network.public_address`. 每個同齡人應列出相同的可信的同齡人的身份,但有自家可訪問的地址 VPN 路線表.

客戶端和 CLI 配置應指向通過 VPN 或通過控制的內部網關可訪問的 Torii 終端點:

```toml
torii_url = "http://10.20.0.11:8080"
```

如果 Torii 必須在 VPN 外使用,請將其置於提供 TLS,身份驗證,速度限制和記錄的反轉代理或負載平衡器後面.避免直接向公共互聯網暴露原始的同行端口或管理終點.

## 防火牆規則 {#firewall-rules}

使用主機和雲防火牆規則,即使有一個 VPN 存在:

|服務|建議訪問|
| --- | --- |
|互聯網端口|其他驗證器 VPN 地址只有 |
|Torii|應用程序後臺,運營商或可信的客戶端範圍 VPN |
|計量和健康檢查|運營商網絡的監控系統|
|SSH 和管理 |基石主機,特權運營商 VPN 範圍,或破玻璃過程|
|備份和存儲複製|在私人網絡上備份系統|

當一個新同行加入網絡時,更新 VPN 會員名單,防火牆允許名單和 Iroha 可信的同行配置作爲一個協調變化.

## 運營檢查列表 {#operational-checklist}

- 選擇一個經過審計和積極維護的 VPN 實現,如 WireGuard,IPsec或由組織批准的管理私人網絡.
- 用每個主機和運營商的獨特 VPN 憑證.不要在驗證器之間共享 VPN 密鑰.
- 保持 VPN 憑證與 Iroha 私鑰和基因簽字材料分開.
- 監測 VPN 延遲,數據包丟失,重新連接和路線變化.共識對持續網絡不穩定性很敏感.
- 測試有效的 MTU.包碎可以看起來像間歇性同行或 Torii 故障.
- VPN 範圍允許達到同等, Torii,指標, SSH 和備份終端點的文件.
- 當主機,運營商帳戶或組織離開網絡時,轉換 VPN 憑證.
- 避免一個 VPN 門戶作爲驗證器之間唯一的路線.規劃生產網絡的冗餘門戶或站點到站點路線.
- 在事件響應演習中包括 VPN 故障,以便運營商知道何時區分網絡分區與 Iroha 過程故障.

## 相關頁面 {#related-pages}

- [安全原則](/zh-hant/guide/security/security-principles.md)
- [運營安全](/zh-hant/guide/security/operational-security.md)
- [網絡部署的關鍵](/zh-hant/guide/configure/keys-for-network-deployment.md)
- [同行管理](/zh-hant/guide/configure/peer-management.md)
- [同類配置參考](/zh-hant/reference/peer-config/index.md)
