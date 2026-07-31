---
translation_locale: zh-hans
translation_source: /guide/security/password-security.md
translation_source_hash: 39d03f2fa20a21745056353be8f132310fcf9cde051a4fb6528f6257ddc3158a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 密码安全 {#password-security}

在区块链安全领域,保护密码至关重要. 为了确保您的数据及其所代表的一切仍然不受未经授权访问的影响,

## 密码强度 {#password-strength}

您可能曾经遇到有关如何提出建议的建议. _强_ 这些建议可能包括最低密码长度,添加特殊字符等.

所以,什么定义一个 _强密码_? 一个强大的密码是一个密码 _高化_.

为了计算密码的值,我们可以按照 **输入力公式**:

::: tip 输入力公式

$L$ 密码长度;密码中的符号数量.\
$S$ 字符集;唯一可能的象征池的大小.\
$S^L$  可能的组合数量.

$$Entropy=log_2(S^L)$$

结果是密码中的 entropy bits. 数字越高,密码越难破解.

鉴于对进化值的了解,使用以下公式可取出需要进行粗略强加密码的尝试数量:

$$S^L=2^Entropy$$

金融组织建议保持密码的进化在 `64` 在 `127` 位 (`128` 但请记住: <abbr title="Graphics Processing Unit">GPU</abbr>密码破解所需的时间随着时间的推移不断下降.

:::

Following 现在,我们可以比较下面的两个例子:

  1. 一个16字符的密码,使用现代英文字母26字母的小字母,产生了约4300万字元 ($43*10^21$) 可能的组合.

    $$Entropy=log_2(26^{16})=log_2(43,608,742,899,428,874,059,776)=75.20703...$$

  2. 一个16字符的密码,字符集扩展到96字母,包括大写和特殊符号,使得可能的组合数量增加到惊人的52万 ($52*10^30$),显著提高了透力.

    $$Entropy=log_2(96^{16})=log_2(52,040,292,466,647,269,602,037,015,248,896)=105.35940... $$

如今可以看到,即使仅通过扩大文字集从26个符号到96个符号, 恶意分子需要的可能组合数量 $1.1933*10^9$ 几次.

此外,加密码的长度也会进一步增加可能组合的数量,从而提高密码的 entropy 强度.

然而,我们建议使用类似的密码管理程序 [KeePassXC](https://keepassxc.org/) (详细见见 _[添加密码管理程序](./storing-cryptographic-keys.md#adding-a-password-manager-program)_ 并且 _[配置 KeePassXC](./storing-cryptographic-keys.md#configuring-keepassxc)_生成和安全存储密码.

::: tip

一些网站限制了密码的最大可能值,也就是说限制了最大密码长度或被接受的字符集,或者两者.

在使用这些网站时,请记住这一点,并定期更新密码.

:::

## 密码漏洞 {#password-vulnerabilities}

密码可能会受到暴力攻击,通常使用强大的 GPUs 为了阻止此类尝试,请创建一个独特的密码,没有个人信息如生日,地址,电话号码或社会保障号码.避免给攻击者提供易于猜测的线索.

所以,打破现代密码是多么困难?

像这样的设置 [凯文·米特尼克](https://en.wikipedia.org/wiki/Kevin_Mitnick)现在 [集群设置](https://twitter.com/kevinmitnick/status/1649421434899275778?s=20) 住房 24 NVIDIA® GeForce RTX 4090年代和6年 NVIDIA® GeForce RTX 2080年代,他们都在运行 [哈斯托波利斯](https://github.com/hashtopolis) 软件,他曾经破解了密码.

但是,现在让我们把它比较到一个单个 RTX 4090,可加工到300 <abbr title="Hashes per second">/s</abbr> 使用 [`NTLM`](https://www.tarlogic.com/cybersecurity-glossary/ntlm-hash) 和200 <abbr title="Hashes per second">/s</abbr> 使用 [`bcrypt`](https://en.wikipedia.org/wiki/Bcrypt), 按照下列规定 [这个推文](https://twitter.com/Chick3nman512/status/1580712040179826688).

作为我们之前的进化计算的延伸,现在让我们检查下列预测破裂时间:

  1. 有一些 $31,540,000$ 假设最糟糕的情况是: `NTLM`, 在速度 $300*10^9$ <abbr title="Hashes per second">/s</abbr>, 这需要一个. RTX 4090 左右 $4,608.83$ 打破一个16个字符的密码,用现代英文字母26个字符.

  2. 如果 `NTLM` 我们使用 `bcrypt`, 因此降低代速度到 $200*10^3$ <abbr title="Hashes per second">/s</abbr>, 虽然还扩大了设置为96的字符,包括大写字母和特殊符号, $8,249,887,835,549,662,270.456$ 超过了宇宙的年龄.

所以,仅仅是选择更高的 entropy 增加了破解密码到难以理解数量的时间. GPUs, 然而,这种方法与 [XKCD 方法](https://xkcd.com/538/).

重要的是要注意,一个广泛的字符集并不总是必要达到高位.它可以通过使用多个单词密码或特别是长短句子获得. [XKCD 漫画](https://xkcd.com/936/) 这一概念是非常有口皆碑的.

::: warning

避免在任何地方写下密码.安全存储您的密码恢复短语.如果短语太长,则可以写下来,确保您能够读取并输入后面.保存该短语的物理副本在一个安全的地方和/或容器中.

:::
