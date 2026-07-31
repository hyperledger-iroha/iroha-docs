---
translation_locale: zh-hans
translation_source: /guide/security/operational-security.md
translation_source_hash: 01397a0e53a3f62df21e33b1473babd910cc733713ef69e43b3bbb501b48e7a5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 运营安全 {#operational-security}

运营安全 (OPSEC) 是安全和风险管理的系统方法,其基本上是针对特定使用情况采取的战略和建议的集合,以防止未经授权访问和数据泄露.

<abbr title="Operational Security">OPSEC</abbr> 对于大多数公司来说,确保资产的可用性和稳定是标准做法. 这包括考虑诸如物理安全 (例如,确保无监督的邮件不包含敏感数据),安全通信协议 (例如,不会通过未加密方式发送敏感数据) 等因素 SMS),威胁分析 (例如,确定潜在的恶意分子,了解最新攻击方法),人员培训 (例如,没有员工跟踪 <abbr title="Operational Security">OPSEC</abbr> 这些措施 _的意思_, 降低风险 (例如加密硬盘和 USB 设备).

自从 Iroha 可能将作为财务账本部署, <abbr title="Operational Security">OPSEC</abbr> 这一主题描述了个人和组织使用的战略和方法. Iroha 在他们的运营中,应该考虑作为其广泛的安全协议的一部分.

按照本主题的指导方针并采用是实现全面安全的必要步骤,但它本身不够. [安全](./index.md) 部分,特别是以下问题:

- [安全原则](./security-principles.md)
- [密码安全](./password-security.md)

## 建议 OPSEC 措施 {#recommended-opsec-measures}

- 保持警. [最可能的](https://arxiv.org/pdf/2209.08356.pdf) 一个人在区块链中失去资产的方法是通过泄露他们的敏感细节.

- 密码驱动器可以保护您的数据,即使攻击者获得硬件.

- 使用可靠的软件.通过可复制二元构建运输的软件,并且从源头上构建的软件是最值得信赖的.未经审计的专有或开源软件是一个潜在的风险,必须认真对待.

- 一个分秒就足以窃取你的设备.

- 检查二元包上的签名. 这与使用的公共密钥加密没有太大的区别 Iroha.

- 为了防止未经授权的访问,在没有监督的情况下,始终保护您的笔记本电脑或个人计算机.

- 建立一个安全 [有空气间隙](https://en.wikipedia.org/wiki/Air_gap_(networking)首先,加密钥匙,然后存储在一个 _仅在线使用_ 设备,最好安装有电磁屏蔽. [硬件密钥](./storing-cryptographic-keys.md#using-a-hardware-key) 专门为此设计.

- 常规更新有助于修复漏洞并尽量减少与过时软件相关的潜在风险,即使在这些漏洞被披露之前.

- 制定定期更新密码和加密密钥的常规程序.这种积极的方法有助于提高整体安全态度,因为击中移动目标要比较困难.

## 使用浏览器 {#using-browsers}

如果申请与 Iroha 具有网页 UI, 您的浏览器可以帮助安全或构成潜在威胁.

考虑以下措施来提高浏览安全性:

- 避免使用已知的安全模式不良的浏览器以及泄露用户数据.
  
  您可以查找任何浏览器的隐私侵犯和安全问题. [这篇关于浏览器隐私的文章](https://www.unixsheikh.com/articles/choose-your-browser-carefully.html) 请注意,专有浏览器 (如Chrome,Safari,Opera,Vivaldi,Edge等) 通常是非常难以审计的,因为他们的代码被隐藏于公众,这意味着你不能确定它们是多么安全.

- 优先考虑具有价值和保护用户隐私和安全的历史的浏览器:
  - [自由狼](https://librewolf.net/), [冰猫](https://www.gnu.org/software/gnuzilla/), [燃烧](https://github.com/dr460nf1r3/firedragon-browser),  Mozilla Firefox 的成熟的叉子,附加了安全功能.
  - [无眼的](https://github.com/ungoogled-software/ungoogled-chromium) 一个高度审计的开源版本,加上了额外的安全措施,并删除了所有与谷歌相关的网络服务.
  - [勇敢的](https://brave.com/) 经过高度审核的开源版本 [谷歌 Chromium](https://www.chromium.org/Home/) 通过额外的安全措施增强;有内置 <abbr title="Virtual Private Network">VPN</abbr> 广告拦截功能.
  - [猎](https://www.falkon.org/) 一个基于Qt的开源网页浏览器 (建立在 `QtWebEngine`, 一个包装 [谷歌 Chromium](https://www.chromium.org/Home/)) 有已知安全性记录;可从其下载 [KDE 商店页面](https://store.falkon.org/browse/).
  - [覽器](https://qutebrowser.org/) 一个基于Qt的开源网页浏览器 (建立在 `QtWebEngine`, 一个包装 [谷歌 Chromium](https://www.chromium.org/Home/)) 有已知安全经验;具有独特的键盘专注的方法, GUI; 作为许多安全专家的首选浏览器.

- 避免让人 `JavaScript` 除非必要.

- 使用浏览器内置的插件限制机制来限制安装的插件权限.

- 在重要操作之前和之后清除cookies. **让我加入** 或 **记住我** 请记住,有些网站默认启用了此功能.

- 使用广告拦截器.这些不仅阻止广告,还禁用网站跟踪功能. 根据您使用的浏览器,广告拦阻器可能不是内置的功能.

- 警类似的角色 (例如: `0`, `θ`, `O`, `О`, `ዐ` 并且 `߀` 关注这样的细节可以避免鱼攻击.

- 避免网 UI 在使用之前,设置你的桌面电子邮件客户端签字和验证 GPG 关键的签名.

- 避免使用基于网络的消息服务. `electron` 软件的使用者可能会受到许多攻击,

- 更新您的浏览器到最新版本,每当可能.

- 请注意您安装哪些浏览器扩展.只使用知名和可靠的源头的扩展程序.恶意扩展程序可能会危及您的数据和隐私.

- 创建不同的浏览器配置文件,用于各种任务.使用一个配置文件为日常浏览,另一个用于涉及高安全性和敏感数据的活动.这样,安装在日常浏览的配置文件上的扩展不能从安全的访问敏感数据.

- 使用您浏览器的可移植版本复制到一个 USB 这种方法确保即使安全漏洞允许安装的插件之一访问个人资料之间的数据,您的安全相关的个人资料仍然存在于单独可移动设备上.

- 定期清除浏览器缓存和cookies,以删除可能在设备上意外存储的敏感数据.

## 恢复计划 {#recovery-plan}

在紧急情况下,如失去钥匙或面临安全漏洞时,一个精确结构化和提前准备的恢复计划是必不可少的救援线.

组织应在制定恢复计划时考虑以下关键方面:

- 在关键丢失或其他安全事件发生时,要概述一步步的程序,确保这些步骤易于用户和/或员工访问和理解.

- 建立一个通讯道,可以迅速报告安全漏洞和潜在威胁,如泄露或丢失的加密密钥和密码.

- 如果您使用硬件密钥 (例如, [YubiKey](https://www.yubico.com/products/) 或 [SoloKeys 独身](https://solokeys.com/collections/all)) 作为一种安全措施,考虑采用冗余策略.保持两个钥匙:一个用于日常使用,另一个存储在安全位置.

- 当报告安全漏洞或泄露时,请立即更换或禁用所影响的密钥和密码.

- 定期审查和更新您的恢复计划,以确保随着安全环境的发展,该计划仍然具有相关性和效果.

::: warning

记住,恢复计划不仅仅是另一个文件. 相反,它是一种救生线,帮助解决意外的挑战.通过预测潜在的场景和制定明确的行动路线图,你加强了你的运营安全性,并提高了你对任何安全事件有效响应的准备力.

:::
