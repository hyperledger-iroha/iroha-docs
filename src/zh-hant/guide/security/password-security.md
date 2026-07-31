---
translation_locale: zh-hant
translation_source: /guide/security/password-security.md
translation_source_hash: 39d03f2fa20a21745056353be8f132310fcf9cde051a4fb6528f6257ddc3158a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 密碼安全 {#password-security}

在區塊安全領域, 保護密碼至關重要.

## 密碼的強度 {#password-strength}

您可能曾遇到如何提出建议. _很強_ 密碼. 這些可能包括最低密碼長度,特殊字符的添加等建議.

如何定義一個 _堅強的密碼_? 密碼是一個具有 _高度_.

我們可能會跟隨密碼的 **內能式**:

::: tip 內能式

$L$ 密碼長度;密碼中的符號數量.\
$S$ 字符集;唯一可能的符號池的大小.\
$S^L$  可能的組合數量.

$$Entropy=log_2(S^L)$$

數字是密碼中的 entropy bit 的數量.

已知 Entropy值, 使用以下公式可取出使用此 Entropy 的密碼的破壞強制所需的試驗量:

$$S^L=2^Entropy$$

金融組織建議保持密碼的密碼在範圍內, `64` 必須 `127` 數位 (`128` 但請記住, <abbr title="Graphics Processing Unit">GPU</abbr>密碼破解所需的時間隨著時間而下降.

:::

Following 我們要比较下列兩個例子:

  1. 只有使用現代英文字母的小字母 (26 字符) 的16個字符密碼,$43*10^21$) 可能的組合.

    $$Entropy=log_2(26^{16})=log_2(43,608,742,899,428,874,059,776)=75.20703...$$

  2. 包含大字母和特殊符號的16個字符密碼,$52*10^30$), 顯著提高了透力.

    $$Entropy=log_2(96^{16})=log_2(52,040,292,466,647,269,602,037,015,248,896)=105.35940... $$

即使是將字符集從26個符號擴大到96個, $1.1933*10^9$ 這樣的情況,

增加密碼的長度也會使可能的組合數量更加增長,

我們建議使用密碼管理程式 [KeePassXC](https://keepassxc.org/) (詳情請查看) _[添加密碼管理程序](./storing-cryptographic-keys.md#adding-a-password-manager-program)_ 及其他 _[設定方式 KeePassXC](./storing-cryptographic-keys.md#configuring-keepassxc)_生成和安全存儲您的密碼.

::: tip

某些網站限制了密碼的最大可能值, 也就是說,

請記住這些網站使用時,

:::

## 密碼的脆弱性 {#password-vulnerabilities}

密碼可能會受到暴力攻擊, GPUs 沒有任何個人信息,如生日,地址,電話號碼或社會保障號碼. 避免向攻擊者提供易猜測的線索.

如何破解現代密碼?

這樣的策略 [凱文·米特尼克](https://en.wikipedia.org/wiki/Kevin_Mitnick)沒有任何問題 [集群設置](https://twitter.com/kevinmitnick/status/1649421434899275778?s=20) 住房 24 NVIDIA® GeForce RTX 其他國家, NVIDIA® GeForce RTX 2080年代,他們都在跑步 [哈斯托波利斯](https://github.com/hashtopolis) 他使用軟體破解密碼,

我們將它比較到一個單位. RTX 4090,可處理到 300 <abbr title="Hashes per second">其他國家</abbr> 使用 [`NTLM`](https://www.tarlogic.com/cybersecurity-glossary/ntlm-hash) 和 200 年 <abbr title="Hashes per second">其他國家</abbr> 使用 [`bcrypt`](https://en.wikipedia.org/wiki/Bcrypt), 在此概述 [這個推文](https://twitter.com/Chick3nman512/status/1580712040179826688).

我們現在要看下列預測破裂時間:

  1. 這裡有 $31,540,000$ 假設最糟糕的情況是: `NTLM`, 在 $300*10^9$ <abbr title="Hashes per second">其他國家</abbr>, 這樣就需要一張 RTX 約 4090 公里 $4,608.83$ 打破16個字符的密碼,

  2. 如果而不是 `NTLM` 我們使用 `bcrypt`, 因此降低代速度到 $200*10^3$ <abbr title="Hashes per second">其他國家</abbr>, 還是擴展到96的字符, 包括大文字和特殊符號, $8,249,887,835,549,662,270.456$ 超越宇宙的年齡.

只是選擇更高的エントロピー增加了破解密碼所需的時間. GPUs, 但這個方法與 [XKCD 方法](https://xkcd.com/538/).

很重要的是要注意,一個廣泛的字符集並不是總是需要达到高度. [XKCD 漫畫](https://xkcd.com/936/) 這一點很好用.

::: warning

避免在任何地方寫下你的密碼. 安全存放您的密碼恢復短語. 如果短語太長,你可以記錄它,以確保你能讀出並打字後來.

:::
