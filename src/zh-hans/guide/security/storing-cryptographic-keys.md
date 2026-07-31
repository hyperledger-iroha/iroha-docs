---
translation_locale: zh-hans
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: a420551345570c4f6b6c0288bc78041665b199727b177eb0aee1f6495850fae6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 存储加密钥 {#storing-cryptographic-keys}

您的敏感数据只会保持私密, <abbr title="Operational Security">OPSEC</abbr> 社交工程的威胁,即有人假装自己是一个有权威的人试图操纵你给他们你的私密加密钥,是真实的.

更多信息 <abbr title="Operational Security">OPSEC</abbr> 和其最佳实践,见 [运营安全](./operational-security).

## 数字化存储密码钥 {#storing-cryptographic-keys-digitally}

在数字化保护密码密钥方面,主要只有两个方法[SSH](https://www.ssh.com/) 并且 [GPG](https://www.gnupg.org/)可用. 这些方法提供了安全层,以防止未经授权访问您的加密密钥.

许多人 Iroha 建筑决策受到建筑设计的原则的影响. **安全** (`SSH`) 协议,因此本节主要关注 `SSH` 如何有效地实现您在密码密钥中存储的协议 Iroha 生物系统.

### 使用 SSH 并且 SSH 代理人 {#using-ssh-and-ssh-agent}

**安全协议** (`SSH`) 是一个作为虚拟门户的加密网络协议,通过使用 SSH 提供一个高效的方法远程与系统互动,而无需物理存在. `SSH` 提供两个主要的身份验证机制:传统基于密码的方法和更安全的公私钥对方法.

更多信息 `SSH`, 查看 [相关的 SSH 学院主题](https://www.ssh.com/academy/ssh).

为了简化登录过程,并绕过重复输入的需要, `SSH` 关键 **SSH 代理人** (`ssh-agent`) 记住你的助理程序 `SSH` 按此设置,可以使用 `SSH` 门户可以随时连接到其他机器,轻松地访问钥匙.

您的公钥存储在远程系统上,并保证您的私钥安全. `ssh-agent` 为您的信息提供 _公众_ 接入系统的密钥. [挑战](https://en.wikipedia.org/wiki/Challenge%E2%80%93response_authentication) 只有你 _个人_ 你的钥匙可以正确响应. `ssh-agent` 通过使用您的 _个人_ 如果响应与系统预期的相匹配,你会获得访问权限.

它们的美丽 `ssh-agent` 在您的会议期间,它会保留您的私钥,所以每次连接到远程系统时不需要继续输入密码或私钥密码.

为了解更多关于 `ssh-agent`, 查看 [相关的 SSH 学院主题](https://www.ssh.com/academy/ssh/agent).

::: info 备注

详细概述 `SSH` 协议和 `ssh-agent` 工具,请参见以下内容 [SSH 学院](https://www.ssh.com/academy) 主题:

  - [什么是 SSH (安全?)](https://www.ssh.com/academy/ssh)
  - [如何配置ssh-agent,代理转发和代理协议](https://www.ssh.com/academy/ssh/agent)

:::

### 添加密码管理程序 {#adding-a-password-manager-program}

建议提高您的安全性. `SSH` 通过密码保护钥匙,从而使恶意行为者获取您的敏感信息成为额外的障碍.

用户密码存储可以使用各种密码管理器 `SSH` 为了澄清, [KeePass](https://keepass.info/) 作为一个密码管理器的例子, [KeePassXC](https://keepassxc.org/) 在Linux操作系统上运行的端口.

如何设置的指示 KeePassXC 查看 [配置 KeePassXC](#configuring-keepassxc) 下面的部分.

![KeePassXC: `Main` 屏幕 UI](../../../img/KeePassXC.png)

KeePassXC 它不仅存储密码,而且还提供了更好的安全性,灵活性和控制. `SSH` 密钥.当用于键存储时,这个密码管理器提供 `ssh-agent` 存储的密钥,然后在 KeePassXC 窗户关闭.

::: tip

理论上,任何一个 KeePass 港口 [在官方网站上列出的](https://keepass.info/download.html) 可用于关键的存储目的.
我们建议: [KeePassX](https://www.keepassx.org/) 或 [KeePassXC](https://keepassxc.org/).

:::

#### 配置 KeePassXC {#configuring-keepassxc}

配置 KeePassXC, 执行以下步骤:

1. 发射 KeePassXC, 然后去 **工具** > **设置**, 或选择 **装备** 按从顶部 UI 面板.

2. 在 **应用程序设置** 显示的页面,选择 **SSH 代理人** 在左边菜单中,然后选择 **启用 SSH 代理集成** 检查盒.

   ::: info 显示参考截图

   ![KeePassXC `SSH Agent` 标签: 启用 SSH 代理人](../../../img/keepassxc_ssh_agent.png)

   :::

3. 创建一个新的 KeePassXC 数据库. 查看指令 [KeePassXC 使用者指南 > 创建您的第一个数据库](https://keepassxc.org/docs/KeePassXC_UserGuide#_creating_your_first_database).

4. 每个你想存储的钥匙 KeePassXC 创建的数据库,执行以下步骤:

   - 在数据库中添加一个新条目. [KeePassXC 使用者指南 > 创建您的第一个数据库](https://keepassxc.org/docs/KeePassXC_UserGuide#_creating_your_first_database).

   - 在添加新条目时,通过以下操作将包含键的文件附上: **高级** 在左边菜单中,然后选择 **加入** 在 **附件** 在下列部分中,选择所需的文件 **选择文件** 窗口出现.

   - 在添加一个新条目时,选择 **SSH 代理人** 在左侧菜单中,然后从 **附带** 在 **私钥** 部分;然后选择以下的选项框:

      - **在数据库开放/解锁时添加键到代理**

      - **当数据库关闭/锁定时,将密钥从代理中删除**

      - **在使用此键时需要用户确认**

   - 如果需要,请对该条目进行其他更改.

   - 当准备好时,选择 **OK** 为了保存入口.

   ::: details 显示参考截图

   ![KeePassXC `Advanced` 标签:添加私钥附件](../../../img/keepassxc_private_key.png)

   ![KeePassXC `SSH Agent` 标签:添加私钥附件](../../../img/keepassxc_pk_agent.png)

   :::

##### 预期结果 {#expected-results}

- 密码化和 `shh` 密钥存储为一个 KeePassXC 数据库可以访问 KeePassXC 窗户开放.

- 存储的加密和 `ssh` 在授权要求时,可使用钥匙.

- 存储的加密和 `ssh` 关键将从 `ssh-agent` 一旦 KeePassXC 窗户关闭.

::: info 备注

没有使 **在使用此键时需要用户确认** 选择, `ssh-agent` 如果密码管理程序被恶意软件或系统服务通过一个 `SIGKILL` 密钥可能会留在 `ssh-agent`, 由于Unix系统程序无法拦截 `SIGKILL`.

:::

## 物理存储加密钥 {#storing-cryptographic-keys-physically}

对于那些寻求最高水平的离线安全者来说,存储加密密钥的选择可以确保密钥完全与数字网络连接不开,从而降低未经授权访问的风险.

### 使用硬件钥匙 {#using-a-hardware-key}

我们的团队认为硬件钥匙是最好的安全措施之一. USB 机器在安全漏洞的情况下可以轻松断开设备,或者只需重新连接到其他机器.

然而,由于有很多品牌的硬件钥匙, APIs 重要的是要对市场进行研究,以找到最适合您需求的关键.

迄今为止,我们的团队已经内部测试了 [YubiKey 5C](https://www.yubico.com/il/product/yubikey-5c/) 硬件钥匙,其中包括多功能 API 功能性.

然而,需要考虑一个潜在的缺点. [HMAC 挑战响应认证](https://en.wikipedia.org/wiki/Challenge%E2%80%93response_authentication) 和存储相应的 _个人_ 这种设置可能会使攻击者不知情地对存储在网络中的信息做出有知识的猜测. YubiKey 5C的内存,从而危及了整体安全性.

幸运的是,通过采用一种替代方法来缓解这种脆弱性 YubiKey 5C. 目的是使用 YubiKey 5C安全访问一个 KeePassXC 存储您的加密数据库和 `SSH` 这种方法甚至可以被认为是有益的,因为它超越了大多数密码的安全性, KeePassXC 数据库泄露.

::: info

阅读更多关于 _上述方法_, 查看其中一个答案 KeePassXC 开发人员[詹克·贝文多夫](https://github.com/phoerious)以下内容 StackExchange 问题:

[是否合理使用 KeePassXC 在 YubiKey?](https://security.stackexchange.com/questions/201345/is-it-reasonable-to-use-keepassxc-with-yubikey/258414#258414)

:::

### 用一个音词 {#using-a-mnemonic-phrase}

也可以记住一个私钥作为一系列的单词, _语_. 这种方法在许多钱包中使用,需要记住约25个特定词. KeePassXC, 提供了mnemonic密码生成.
