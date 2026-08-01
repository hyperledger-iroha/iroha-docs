---
translation_locale: zh-hans
translation_source: /guide/security/vpn.md
translation_source_hash: 4161cec5d601ad3a57decc19402738358a03648adad8502b5282e8e9bacc3fa8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 虚拟私人网络 {#virtual-private-networks}

一个 <abbr title="Virtual Private Network">VPN</abbr>是一个网络控制系统,它限制了谁可以访问 Iroha 服务. 它最适用于私人和联盟部署,验证器,应用程序后台和运营商应该通过私人地址而不是开放的互联网路线进行通信.

一个 VPN 不取代 Iroha 同行密钥,帐户密钥,权限,防火墙规则,监控或安全密钥存储.将其视为一个层部署界限: VPN 缩小网络可访问性,而 Iroha 配置和治理决定哪些同行和账户是值得信赖的.

## 什么时候使用 VPN {#when-to-use-a-vpn}

使用 VPN 当:

- 验证器由不同的组织或不同托管环境运营
- Torii 应仅由应用程序后端,运营商或可信的客户访问
- 数据,日志, SSH 或其他管理终端点必须在私营运营商网络中保持
- 测试或阶段化网络应类似于生产访问控制,而不暴露公共终端点

每次部署都不需要 VPN.公共网络可能会故意通过公共门户,负载平衡器或反转代理来暴露 Torii.即使在这种情况下,尽可能地将验证器对等流量和管理终端点放在一个受限制的网络上.

::: tip

浏览器 VPN 只保护该浏览器的流量.除非这些过程通过同一私人网络路由,否则它不会保护`irohad`,CLI,SDK,SSH,指标或备份流量.

:::

## 部署模式 {#deployment-pattern}

对于私人验证器网格,给每个验证器一个稳定的 VPN 地址或私人 DNS 名称.配置同行,使其广告的同行对同行地址可以从其他验证器通过该网络访问:

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

使用分配给当前同行的地址 `network.address` 和 `network.public_address`. 每个同龄人应列出相同的可信的同龄人的身份,但有自家可访问的地址 VPN 路线表.

客户端和 CLI 配置应指向通过 VPN 或通过控制的内部网关可访问的 Torii 终端点:

```toml
torii_url = "http://10.20.0.11:8080"
```

如果 Torii 必须在 VPN 外使用,请将其置于提供 TLS,身份验证,速度限制和记录的反转代理或负载平衡器后面.避免直接向公共互联网暴露原始的同行端口或管理终点.

## 防火墙规则 {#firewall-rules}

使用主机和云防火墙规则,即使有一个 VPN 存在:

|服务|建议访问|
| --- | --- |
|互联网端口|其他验证器 VPN 地址只有 |
|Torii|应用程序后台,运营商或可信的客户端范围 VPN |
|计量和健康检查|运营商网络的监控系统|
|SSH 和管理 |基石主机,特权运营商 VPN 范围,或破玻璃过程|
|备份和存储复制|在私人网络上备份系统|

当一个新同行加入网络时,更新 VPN 会员名单,防火墙允许名单和 Iroha 可信的同行配置作为一个协调变化.

## 运营检查列表 {#operational-checklist}

- 选择一个经过审计和积极维护的 VPN 实现,如 WireGuard,IPsec或由组织批准的管理私人网络.
- 用每个主机和运营商的独特 VPN 凭证.不要在验证器之间共享 VPN 密钥.
- 保持 VPN 凭证与 Iroha 私钥和基因签字材料分开.
- 监测 VPN 延迟,数据包丢失,重新连接和路线变化.共识对持续网络不稳定性很敏感.
- 测试有效的 MTU.包碎可以看起来像间歇性同行或 Torii 故障.
- VPN 范围允许达到同等, Torii,指标, SSH 和备份终端点的文件.
- 当主机,运营商帐户或组织离开网络时,转换 VPN 凭证.
- 避免一个 VPN 门户作为验证器之间唯一的路线.规划生产网络的冗余门户或站点到站点路线.
- 在事件响应演习中包括 VPN 故障,以便运营商知道何时区分网络分区与 Iroha 过程故障.

## 相关页面 {#related-pages}

- [安全原则](/zh-hans/guide/security/security-principles.md)
- [运营安全](/zh-hans/guide/security/operational-security.md)
- [网络部署的关键](/zh-hans/guide/configure/keys-for-network-deployment.md)
- [同行管理](/zh-hans/guide/configure/peer-management.md)
- [同类配置参考](/zh-hans/reference/peer-config/index.md)
