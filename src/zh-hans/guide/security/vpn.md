---
translation_locale: zh-hans
translation_source: /guide/security/vpn.md
translation_source_hash: 4161cec5d601ad3a57decc19402738358a03648adad8502b5282e8e9bacc3fa8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 虚拟私人网络 {#virtual-private-networks}

一个 <abbr title="Virtual Private Network">VPN</abbr> 是一个网络控制
能达到的限制 Iroha 它最有用于私人和
认证器,应用后台和运营商的联盟部署
应该通过私人地址进行通信,而不是开放的互联网路线.

一个 VPN 不取代 Iroha 其他类型:
控制,监控或安全存储密钥.
部署边界: VPN 缩小网络可访问性,而 Iroha
配置和治理决定哪些同行和账户是值得信赖的.

## 什么时候使用 VPN {#when-to-use-a-vpn}

使用一个 VPN 当:

- 验证器由不同组织或不同的托管机构运营
  环境
- Torii 只有应用程序后端,运营商或可信的用户才能访问
  客户
- 计量,日志 SSH, 或其他管理终点必须留在私人
  运营商网络
- 测试或阶段化网络应类似于生产访问控制,而无
  揭露公共终点

一个 VPN 公共网络可能是故意使用的.
暴露 Torii 通过公共门户,负载平衡器或反向代理.
在此情况下,保持验证器的同行流量和管理终点在一个
在可能的情况下,限制网络.

::: tip

浏览器 VPN 它只保护该浏览器的流量.
`irohad`, CLI, SDK, SSH, 如果这些过程是
通过同一个私人网络.

:::

## 部署模式 {#deployment-pattern}

对于私人验证器网格,给每个验证器一个稳定 VPN 地址或
个人 DNS 设置同龄人,以便他们的广告的同龄人地址是
其他验证器通过该网络可访问:

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

使用当前同行分配的地址 `network.address` 并且
`network.public_address`. 每个同龄人都应该列出相同的可靠同龄人的身份,
但可以从自己的地址到达 VPN 路线表.

客户和 CLI 配置应该指向一个 Torii 通过可达的终端点
在 VPN 或通过控制的内部门口:

```toml
torii_url = "http://10.20.0.11:8080"
```

如果 Torii 必须在 VPN, 把它放在一个反转代理后面,或者
提供负载平衡器 TLS, 认证,限制费用和记录.
避免直接暴露原始的同行端口或管理终点
公共互联网.

## 防火墙规则 {#firewall-rules}

使用主机和云防火墙规则,即使在 VPN 存在:

| 服务 | 建议访问 |
| --- | --- |
| 同等端口 | 其他验证器 VPN 只有地址 |
| Torii | 应用程序后台,运营商或可靠客户端 VPN 范围 |
| 计量和健康检查 | 运营商网络的监控系统 |
| SSH 管理 | 基石主机,特权运营商 VPN 范围,或破玻璃过程 |
| 备份和存储复制 | 在私人网络上的备份系统 |

根据标准的规则,一个新的同行可以进行审计.
加入网络,更新 VPN 成员,防火墙允许列表以及 Iroha
作为一个协调的变化.

## 运营检查列表 {#operational-checklist}

- 选择一个经过审计和积极维护的公司 VPN 实施,例如
  WireGuard, 组织批准的私人网络.
- 使用唯一 VPN 每个主机和运营商的凭证. VPN 关键
  在验证者之间.
- 保持 VPN 分开的权限 Iroha 个人钥匙和创始签名
  材料.
- 监视器 VPN 延迟,数据包丢失,重新连接和路线变化.
  对持续的网络不稳定性敏感.
- 测试有效性 MTU. 包裹碎片可能看起来像间歇性同行
  或 Torii 失败.
- 文件 VPN 允许达到同等范围, Torii, 数据,
  SSH, 和备用终端点.
- 旋转 VPN 当主机,运营商帐户或组织离开时的凭证
  在网络上.
- 避免一个 VPN 作为验证者之间的唯一路线.
  生产网络的冗余门户或站点到站点路线.
- 包含 VPN 事故响应演习失败,以便运营商知道何时
  区分一个网络分区 Iroha 过程失败.

## 相关页面 {#related-pages}

- [安全原则](/zh-hans/guide/security/security-principles.md)
- [运营安全](/zh-hans/guide/security/operational-security.md)
- [网络部署的关键](/zh-hans/guide/configure/keys-for-network-deployment.md)
- [同行管理](/zh-hans/guide/configure/peer-management.md)
- [同龄人配置参考](/zh-hans/reference/peer-config/index.md)
