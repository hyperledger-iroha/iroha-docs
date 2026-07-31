---
translation_locale: zh-hant
translation_source: /guide/security/operational-security.md
translation_source_hash: 01397a0e53a3f62df21e33b1473babd910cc733713ef69e43b3bbb501b48e7a5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 運營安全 {#operational-security}

運營安全 (OPSEC) 是安全與風險管理的系統化方法, 這本方法基本上是針對特定使用情況采用的策略和建議集,

<abbr title="Operational Security">OPSEC</abbr> 這項做法包括考慮物理安全等因素 (例如, 確保無監控的郵寄留言不包含敏感數據),安全通信協議 (例如, 不通過未加密方式傳送敏感數據). SMS),威脅分析 (例如,檢測可能的惡意分子,了解最新的攻擊方法),人員訓練 (例如,沒有員工跟蹤 <abbr title="Operational Security">OPSEC</abbr> 他們的措施 _這種情況_, 預測可能會影響您的硬盤和硬體, USB 裝置).

自從此, Iroha 可能會用作金融帳號, <abbr title="Operational Security">OPSEC</abbr> 這項主題描述了個人與組織使用的策略和方法. Iroha 他們的行動應該考慮到其廣泛的安全協議的一部分.

確保安全性並不夠, 這項指南的遵守和采用是取得全面安全的必要一步. [安全性](./index.md) 部分,尤其是以下議題:

- [安全原則](./security-principles.md)
- [密碼安全](./password-security.md)

## 推薦 OPSEC 行動 {#recommended-opsec-measures}

- 保持警. [很可能](https://arxiv.org/pdf/2209.08356.pdf) 在一個區塊中失去資產的方法是將他們的敏感資料放出.

- 加密你的磁盤. 加密開啟裝置使他們可以保護你的數據, 即使攻擊者獲得硬件的權利.

- 使用可靠的軟體. 透過可複製二元結構發送的軟體, 而你從來建立的軟體是最值得信賴的.

- 沒有任何可隨身的裝置,

- 檢查二元包上的簽名. Iroha.

- 保護您的筆記型電腦或個人計算機. 使用強固的密碼,鎖定屏幕,並遵循最佳安全做法.

- 建立一個安全的 [有空氣隙](https://en.wikipedia.org/wiki/Air_gap_(networking)首先加密這些鍵, _只有在網路上_ 裝置,最好有電磁屏蔽安裝. [硬件鍵](./storing-cryptographic-keys.md#using-a-hardware-key) 專為此目的設計.

- 常常更新會幫助修補漏洞,並減少與舊軟件相關的潛在風險, 即使此類漏洞尚未被披露.

- 制定定期更新密碼和加密密钥的常規方式. 這種積極的方法有助於提高整體安全姿勢,

## 使用覽器 {#using-browsers}

如果有連接到 Iroha 具有網頁 UI, 您的覽器可能有助於安全或可能造成威脅.

請考慮以下措施來提高您的覽安全性:

- 避免使用已知不良安全模式以及泄露使用者資料的浏覽器.
  
  您可以搜尋任何浏覽器的隱私侵害和安全問題. [這篇文章是關於覽器隱私](https://www.unixsheikh.com/articles/choose-your-browser-carefully.html) 請注意,專屬浏览器 (如 Chrome, Safari, Opera, Vivaldi, Edge 等) 通常是非常難以監控的,

- 首要選擇具有評估和保護使用者隱私與安全的確實歷史的覽器:
  - [沒有任何問題](https://librewolf.net/), [冰貓](https://www.gnu.org/software/gnuzilla/), [火車](https://github.com/dr460nf1r3/firedragon-browser),  Mozilla Firefox的成熟叉子,
  - [沒有眼睛的](https://github.com/ungoogled-software/ungoogled-chromium) 高級審核的開源版本,加強了更多安全措施,並取消了所有與Google相關的網際網路服務.
  - [勇敢的人](https://brave.com/) 高級審核的開放源版本 [谷歌 Chromium](https://www.chromium.org/Home/) 增加了更多安全措施; <abbr title="Virtual Private Network">VPN</abbr> 並提供廣告阻擋功能.
  - [福克恩](https://www.falkon.org/) 一個開源的Qt基于Web浏览器 (建立在 `QtWebEngine`, 包裝 [谷歌 Chromium](https://www.chromium.org/Home/)已知安全性;可從該網站上下載多種擴展功能 [KDE 商店頁面](https://store.falkon.org/browse/).
  - [覽器](https://qutebrowser.org/) 一個開源的Qt基于Web浏览器 (建立在 `QtWebEngine`, 包裝 [谷歌 Chromium](https://www.chromium.org/Home/)) 具有已知安全歷史;具有獨特的鍵盤專注方法, GUI; 許多安全專家都認為它是首選的覽器.

- 避免使用 `JavaScript` 除非必要.

- 使用浏览器內建的插件限制机制, 限制安裝插件所擁有的權利.

- 在重要操作之前和之后, 清除cookies. **請讓我加入** 或是 **記得我** 請記住有些網站默認啟用此功能.

- 使用廣告阻擋器. 這些功能不僅阻止廣告,而且禁用網站跟蹤功能. 取決於您使用的浏覽器,廣告阻礙器可能不是內建的功能.

- 請注意相似的角色 (例如: `0`, `θ`, `O`, `О`, `ዐ` 及其他 `߀` 這樣的細節可能會讓你免受魚攻擊.

- 避免使用網路 UI 在使用之前,請設定您的桌面電子郵件客戶端, GPG 必須提供其他方式.

- 避免使用網路上的訊息服務. `electron` 該軟體可能會受到許多相同的攻擊,

- 更新您的浏覽器以最新版本,隨時可能.

- 請小心安裝什麼樣的浏覽器擴展. 只使用知名且可信的源頭擴展.

- 建立不同的浏览器配置文件,可用于各種任務. 使用一個配置文件進行日常浏覽,而另一個用于涉及高度安全和敏感數據的活動.

- 使用您的浏览器可移植版本, USB 這種方法保證即使安裝的插件之一提供了檔案之間的數據, 您的安全相關的檔案仍然存在於個別可移除設備上.

- 定期清除您的浏覽器預存庫和 Cookie,以移除可能在您的裝置上意外儲存的敏感資料.

## 恢復計畫 {#recovery-plan}

在緊急狀況中,例如失去關鍵或面臨安全漏洞時, 預先建立和準備好好的恢復計劃是重要生命線.

組織應在制定恢復計畫時考慮以下關鍵方面:

- 在關鍵損失或其他安全事件發生時,要概述一步步的程序.

- 建立一個通訊道,可迅速報導安全漏洞和潜在的威脅,

- 如果您使用硬件鍵 (例如, [YubiKey](https://www.yubico.com/products/) 或是 [SoloKeys 獨立活動](https://solokeys.com/collections/all)) 作为安全措施,可考慮采用冗長性策略. 保持兩個鍵:一個用于日常使用,另一個存放在安全位置上.

- 隨著安全漏洞或泄露事件發生, 迅速取代或禁用受影響的密碼和密碼.

- 定期審核並更新您的恢復計畫, 這樣確保該計劃隨著安全風景的發展保持相關和有效.

::: warning

請記住,恢復計畫不僅只是另一份文件. 相反,它是幫助解決意外挑戰的生命線.

:::
