---
translation_locale: zh-hant
translation_source: /guide/security/vpn.md
translation_source_hash: 4161cec5d601ad3a57decc19402738358a03648adad8502b5282e8e9bacc3fa8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 虛擬私人網絡 {#virtual-private-networks}

其他國家 <abbr title="Virtual Private Network">VPN</abbr> 是一個網路控制系統,
能達到的限制 Iroha 提供服務.
聯盟部署,其中核實者,應用程序背端和運營商
該透過私人地址傳達訊息,而不是開放的網路路線.

其他國家 VPN 沒有取代 Iroha 關鍵,帳戶關鍵,權限,防火牆
請把它當成一層的密钥,
部署的限制: VPN 減少網路可及性, Iroha
配置和治理決定哪些同行和帳戶可信任.

## 什麼時候使用 VPN {#when-to-use-a-vpn}

使用一個 VPN 當:

- 驗證機由不同組織或不同的主機運營
  环境
- Torii 只有應用程序背端,運營商或可信的使用者才能取得
  客戶
- 數據,日志, SSH, 或其他行政目的地必須留在私人
  運營者網絡
- 測試或分期網絡應像沒有產品接入控制
  揭露公共目的地

其他國家 VPN 公共網絡可能會故意
顯示 Torii 透過公共門口,負荷平衡器或反向代理.
在此情況下, 保持驗證碼的同行流量和管理端點
在可能情況下,

::: tip

浏览器 VPN 只有保護該覽器的流量.
`irohad`, CLI, SDK, SSH, 除非這些流程是
透過相同的私人網路.

:::

## 部署模式 {#deployment-pattern}

提供每個驗證器的穩定格式 VPN 或是地址
專屬 DNS 設定同行,以便他們廣告的同行地址是
在該網絡上,可由其他驗證機接觸:

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

使用現在同行所分配的地址 `network.address` 及其他
`network.public_address`. 每個同行都應該列出相同的可信同行身份,
但只有由自己的地址可到达 VPN 這裡是路線桌子.

客戶及 CLI 配置應該指向一個 Torii 通過可達到的終點
這項政策 VPN 或通過控制的內部門口:

```toml
torii_url = "http://10.20.0.11:8080"
```

如果 Torii 必須在 VPN, 將它放在反向代理後,或
提供負荷平衡器 TLS, 認證,限制價格和登記.
避免將原始的同類端口或管理末點直接暴露在
公共網路.

## 防火牆規則 {#firewall-rules}

使用主機和雲端防火牆規則, 即使在 VPN 存在:

| 服務 | 推使用 |
| --- | --- |
| 聯絡方式 | 其他驗證碼 VPN 只有地址 |
| Torii | 應用程序背景,運營商或可信的客戶端 VPN 範圍 |
| 數據和健康檢查 | 在運營者網絡上的監控系統 |
| SSH 及管理 | 基石主機,特權運營者 VPN 或是破玻璃的過程 |
| 備份和儲存複製 | 在私人網路上備份系統 |

檢查更容易, 而不是廣泛的許可規則.
加入網路, VPN 加入,防火牆允許列表, Iroha
這項計畫的目標是:

## 運營檢查名單 {#operational-checklist}

- 選擇監控和積極維護的網站 VPN 實施,例如:
  WireGuard, 或是由組織批准的管理私人網絡.
- 使用獨一無二 VPN 每個主機和運營商的認證. VPN 關鍵
  在驗證者之間.
- 保持 VPN 不同於 Iroha 密钥和創世記簽名
  其他材料.
- 監控器 VPN 這項計畫的目標是: 延遲,包裹損失,重連結和路線變化.
  對持續的網路不穩定性很敏感.
- 檢測有效性 MTU. 包裹的碎片可能看起來像是偶爾交差
  或是 Torii 沒有成功.
- 該文件 VPN 範圍可以達到同行, Torii, 數據,
  SSH, 並提供補充端點.
- 旋轉 VPN 當主機,運營者帳戶或組織離開時的憑證
  該網站的使用者.
- 避免任何一個 VPN 通過證實者之間的唯一通道.
  產品網絡的冗長門口或站點到站點路線.
- 包含 VPN 應對事件的演習失败,
  區分一個網路分區與 Iroha 過程失敗.

## 有關頁面 {#related-pages}

- [安全原則](/zh-hant/guide/security/security-principles.md)
- [運營安全](/zh-hant/guide/security/operational-security.md)
- [網路部署的關鍵](/zh-hant/guide/configure/keys-for-network-deployment.md)
- [同級管理](/zh-hant/guide/configure/peer-management.md)
- [類型的參考資料](/zh-hant/reference/peer-config/index.md)
