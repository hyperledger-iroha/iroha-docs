---
translation_locale: zh-hant
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: a420551345570c4f6b6c0288bc78041665b199727b177eb0aee1f6495850fae6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 儲存密碼關鍵 {#storing-cryptographic-keys}

您的敏感數據只會保持隱私, <abbr title="Operational Security">OPSEC</abbr> 如何保護密碼關鍵?社會工程的威脅,即有人扮演權力的人試圖操縱你將你的私密密碼關键交給他們是真的.

更多關於 <abbr title="Operational Security">OPSEC</abbr> 以及其最佳做法, [運營安全](./operational-security).

## 數位儲存密碼關鍵 {#storing-cryptographic-keys-digitally}

在數位化密碼關鍵保護方面,[SSH](https://www.ssh.com/) 及其他 [GPG](https://www.gnupg.org/)可用. 這些方法提供了安全層,

許多人 Iroha 建築的決定受了建築設計的原則影響. **安全的貝** (`SSH`這部分主要集中在 `SSH` 如何有效實現您在密碼鍵存儲的協議, Iroha 這就是生態系統.

### 使用 SSH 及其他 SSH 這是一場非常棒的活動. {#using-ssh-and-ssh-agent}

**安全的貝協議** (`SSH`) 是一個加密網絡協議, 它作為虛擬門口, SSH 提供一個高效的方法, `SSH` 提供兩個主要的認證機制:傳統的基于密碼的方式和更安全的公私關對方法.

更多關於 `SSH`, 查看 [相關的情況 SSH 學院主題](https://www.ssh.com/academy/ssh).

透過網路登入系統, `SSH` 關鍵 **SSH 這是一場非常棒的活動.** (`ssh-agent`記得你的助理程序 `SSH` 這樣的設定可以讓您使用 `SSH` 在它連接到其他機器時,

您的公钥存放在遠端系統上, `ssh-agent` 您的行動 _公眾_ 遠端系統會發送回一個 [這個挑戰](https://en.wikipedia.org/wiki/Challenge%E2%80%93response_authentication) 這只是你的 _專屬_ 您的關鍵可以正確地回應. `ssh-agent` 如何應對這個挑戰, _專屬_ 如果答案符合系統的預期,

這裡的美麗 `ssh-agent` 這樣你不需要每次連接遠端系統時輸入密碼或私钥密碼.

更多關於 `ssh-agent`, 查看 [相關的情況 SSH 學院主題](https://www.ssh.com/academy/ssh/agent).

::: info 預覽

這項計畫的概要, `SSH` 該協議和 `ssh-agent` 工具,請參閱以下內容: [SSH 學院](https://www.ssh.com/academy) 這些議題:

  - [這是什麼? SSH 沒有任何樓盤符合您的搜尋](https://www.ssh.com/academy/ssh)
  - [如何配置ssh-agent,代理转发, &代理协议](https://www.ssh.com/academy/ssh/agent)

:::

### 添加密碼管理程序 {#adding-a-password-manager-program}

推薦增加您的安全性 `SSH` 密碼保護他們使用密碼, 這樣是惡意行為者獲得您的敏感信息的途徑中的額外障礙.

使用者密碼存儲並使用各種密碼管理器. `SSH` 只是為了明確性, [KeePass](https://keepass.info/) 這種方法可以使用, [KeePassXC](https://keepassxc.org/) 在 Linux 操作系統上運行的端口.

如何設定的指示 KeePassXC 查看 [設定方式 KeePassXC](#configuring-keepassxc) 在下面的部分.

![KeePassXC: `Main` 顯示器 UI](../../../img/KeePassXC.png)

KeePassXC 提供更高的安全性,靈活性和控制. `SSH` 密碼管理器提供了 `ssh-agent` 存储的密钥, KeePassXC 窗戶已關閉.

::: tip

理論上, KeePass 港口 [在官方網站上列出](https://keepass.info/download.html) 可用于主要的儲存目的.
我們推薦以下任何一項: [KeePassX](https://www.keepassx.org/) 或是 [KeePassXC](https://keepassxc.org/).

:::

#### 設定方式 KeePassXC {#configuring-keepassxc}

設定使用 KeePassXC, 執行以下步骤:

1. 發射 KeePassXC, 然後去 **工具** > **設定**, 或選擇 **裝置** 按從上方開始 UI 這裡有許多人.

2. 在這個國家 **應用程式設定** 顯示的,選擇 **SSH 這是一場非常棒的活動.** 在左邊的菜單中, **啟動 SSH 代理集成** 這裡是個票.

   ::: info 顯示參考截圖

   ![KeePassXC `SSH Agent` 標籤: 啟動 SSH 這是一場非常棒的活動.](../../../img/keepassxc_ssh_agent.png)

   :::

3. 建立一個新的 KeePassXC 數據庫. 查看指令 [KeePassXC 使用者指南 > 創建您的第一個資料庫](https://keepassxc.org/docs/KeePassXC_UserGuide#_creating_your_first_database).

4. 任何您想存儲在網路上的關鍵, KeePassXC 執行下列步骤:

   - 在資料庫中添加新輸入. [KeePassXC 使用者指南 > 創建您的第一個資料庫](https://keepassxc.org/docs/KeePassXC_UserGuide#_creating_your_first_database).

   - 在添加新的輸入時, 通過以下方式附加包含鍵的檔案: **進步** 在左邊菜單中, **加入** 在這個國家 **附屬件** 在下列部分中選擇所需文件 **選擇檔案** 窗口會出現.

   - 在添加新的輸入時,選擇 **SSH 這是一場非常棒的活動.** 在左邊菜單中, **附屬性** 在這里, **隱私關鍵** 選取下列檢查框:

      - **在開啟/解鎖資料庫時, 添加代理鍵**

      - **在數據庫關閉/鎖定時,**

      - **在使用這個鍵時需要使用者確認**

   - 如果有必要, 請更改此文.

   - 當準備好時, **OK** 這樣可以保存入口.

   ::: details 顯示參考截圖

   ![KeePassXC `Advanced` 標籤:添加私钥附件](../../../img/keepassxc_private_key.png)

   ![KeePassXC `SSH Agent` 標籤:添加私钥附件](../../../img/keepassxc_pk_agent.png)

   :::

##### 預期的結果 {#expected-results}

- 密碼化和 `shh` 密钥是存储在 KeePassXC 該資料庫可在 KeePassXC 窗口是開放的.

- 存儲的加密和 `ssh` 在授權要求時,可使用鍵.

- 存儲的加密和 `ssh` 關鍵將被移除 `ssh-agent` 這次的 KeePassXC 窗戶已關閉.

::: info 預覽

沒有允許 **在使用這個鍵時需要使用者確認** 這項方案, `ssh-agent` 如果密碼管理者程序被惡意軟體或系統服務通過一個 `SIGKILL` 密钥可能會留在 `ssh-agent`, 因為Unix系統程式無法截取 `SIGKILL`.

:::

## 物理存儲密碼關鍵 {#storing-cryptographic-keys-physically}

對於那些尋求最高水平的無線安全者來說, 儲存加密密钥的選擇實質地確保密钥與數位網絡保持完全斷線,从而減少未經授權進入的風險.

### 使用硬件鍵 {#using-a-hardware-key}

我們的團隊認為硬體鍵是最好的安全措施之一. USB 這樣可以在安全漏洞情況下輕鬆斷線裝置,或者只需重新連接到不同的機器.

但因為有許多品牌的硬件鍵, APIs 要尋找最適合您需求的關鍵,

我們的團隊在內部測試了 [YubiKey 5C 的情況](https://www.yubico.com/il/product/yubikey-5c/) 顯示了許多積極的功能, API 功能性.

但我們必須考慮其中的缺點. [HMAC 挑戰-回應認證](https://en.wikipedia.org/wiki/Challenge%E2%80%93response_authentication) 並儲存相應的資料. _專屬_ 這樣的設定可能會讓攻擊者無意中對存儲在網路上的信息做出有知識的猜測. YubiKey 這樣會危及整體安全性.

這種情況可以被減輕, YubiKey 5C. 目的是使用 YubiKey 5C 提供安全的接入 KeePassXC 存儲您的加密資料庫和 `SSH` 這種方法甚至可以被認為有益, 因為它超越了大部分密碼的安全性, KeePassXC 數據庫泄露.

::: info

了解更多關於 _上述方法_, 請見其中一個回答 KeePassXC 發展者[詹克·貝文多夫](https://github.com/phoerious)下列部分 StackExchange 詢問:

[是否合理使用 KeePassXC 在 YubiKey?](https://security.stackexchange.com/questions/201345/is-it-reasonable-to-use-keepassxc-with-yubikey/258414#258414)

:::

### 如何使用語? {#using-a-mnemonic-phrase}

您可以記得一個私密鍵, _內蒙式詞語_. 這種方法在許多錢包中使用, 需要記住25個特定詞. KeePassXC, 提供mnemonic密碼生成.
