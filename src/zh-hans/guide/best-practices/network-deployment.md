---
translation_locale: zh-hans
translation_source: /guide/best-practices/network-deployment.md
translation_source_hash: 312f9cb3c6fd937b3e7c30ea27d1876ea7901cfa79eced352611db99bbca4a70
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 网络部署 {#network-deployment}

将 Iroha 网络视为一个协调系统. 在网络启动之前,验证者必须同意基因学,拓学,可信赖的同行和共识相关的配置继续完成区块.

## 环境分离 {#environment-separation}

- 为本地开发,共享测试网络,阶段化和生产提供单独的配置捆绑.
- 在生产中不要再使用 localnet 或 Taira 关键材料.
- 保持同行配置,客户端配置,签署的起源,脚本和部署笔记作为一个版本的发布文物.
- 在存储库和部署模板之外保存私钥.

见 [网络部署关键](/zh-hans/guide/configure/keys-for-network-deployment.md).

## 创世纪和拓学 {#genesis-and-topology}

- 让每个验证者都使用相同的签署基因交易,可靠的同行集,拓,在个人资料要求时,验证者拥有权证明.
- 用至少四个验证器来实现最小的拜占庭错误耐受性部署.
- 在能力规划中,与观察者分别进行验证. 观察者不会投票,提出或收集信息,但它们仍然消耗存储,区块同步和网络带宽.
- 把基因,执行器和拓变化视为协调的迁移而不是单同行编辑.

参见 [Genesis](/zh-hans/reference/genesis.md), [同行管理](/zh-hans/guide/configure/peer-management.md)和 [绩效和指标](/zh-hans/guide/advanced/metrics.md#node-count-and-quorum).

## Torii 和网络访问 {#torii-and-network-access}

- 当它暴露在主机或私人网络之外时,将 Torii 置于反向代理或防火墙后面.
- 在部署需要时,终止 TLS,并在边缘应用基本身份验证,速度限制和要求尺寸控制.
- 只有环境所需的终端点才可公布.运营商和远程测量路线应比公共仅阅读路线更为有限.
- 当同行不应直接接受远程流量时,将听者地址绑定到主机本地接口.

查看 [Torii 终点](/zh-hans/reference/torii-endpoints.md)和 [虚拟私人网络](/zh-hans/guide/security/vpn.md).

## 统一和能力 {#consensus-and-capacity}

- 在调整共识计时器之前,测量部署. 较低的时间限制只能在网络,存储和执行层保持跟踪时减少延迟.
- 观察队列方向,而不仅仅是短暂的吞吐量样本.随着稳定的负载而增长的排队意味着网络过载.
- 记录每一个基准指标的有效 Sumeragi 参数,远程测量配置文件,验证器计数,网络 RTT,工作负载形状和硬件详细信息.
- 仅在比较延迟,流量和反压信号后增加收藏器的容量.

查看 [绩效和指标](/zh-hans/guide/advanced/metrics.md).

## 纯金属和工艺管理 {#bare-metal-and-process-management}

- 保持每个同行 `config.toml`,私钥,存储目录和端口的分别.
- 使用 systemd 等进程管理器,明确重新启动,记录和资源政策.
- 保存生成的 README 和从 Kagami localnet捆绑中启动命令,当将测试拓进行转换到管理的主机时.

查看 [在 Bare Metal](/zh-hans/guide/advanced/running-iroha-on-bare-metal.md)上运行 Iroha.
