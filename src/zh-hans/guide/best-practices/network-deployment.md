---
translation_locale: zh-hans
translation_source: /guide/best-practices/network-deployment.md
translation_source_hash: 312f9cb3c6fd937b3e7c30ea27d1876ea7901cfa79eced352611db99bbca4a70
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 网络部署 {#network-deployment}

治疗一个 Iroha 验证者必须达成一致的协议.
基因学,拓学,可靠的同行和共识相关的配置
在网络开始并继续完成区块之前.

## 环境分离 {#environment-separation}

- 为地方开发,共享测试网络提供单独的配置包,
  演出和生产.
- 对于所有不可使用环境来说,生成新钥匙.
  局域网或 Taira 在生产中的主要材料.
- 保持同行配置,客户端配置,签署的起源,脚本和部署
  作为一个版本的释放文物.
- 在存储库和部署模板之外存储私钥.

看看
[网络部署的关键](/zh-hans/guide/configure/keys-for-network-deployment.md).

## 创世纪和拓学 {#genesis-and-topology}

- 让每一个验证者都使用相同的签署基因交易,
  专业信息:
  需要它们.
- 使用至少四个验证器,以达到最低的拜占庭错误耐受性
  部署.
- 在能力规划中,观察员与验证者分开.
  投票,提议或收藏,但它们仍然消耗存储,区块同步,
  网络带宽.
- 处理基因,执行器和拓变化作为协调的迁移
  而不是单同行编辑.

看看 [创世纪](/zh-hans/reference/genesis.md),
[同行管理](/zh-hans/guide/configure/peer-management.md), 并且
[绩效和指标](/zh-hans/guide/advanced/metrics.md#node-count-and-quorum).

## Torii 和网络访问 {#torii-and-network-access}

- 放下 Torii 在外面暴露时,在反向代理或防火墙背后
  主机或私人网络.
- 结束 TLS 应用基本身份验证,税率限制,
  在部署需要时,要求尺寸控制在边缘.
- 只有环境所需的终端点才可公布.
  远程测量路线应比公共仅阅读路线更为有限.
- 绑定听者地址到主机本地接口,当同行不应该
  直接接受远程交通.

看看 [Torii 终点](/zh-hans/reference/torii-endpoints.md) 并且
[虚拟私人网络](/zh-hans/guide/security/vpn.md).

## 统一和能力 {#consensus-and-capacity}

- 在调整共识计时器之前测量部署.
  只有在网络,存储和执行层保持跟踪时才能减少延迟.
- 观察排队方向,而不仅仅是短暂的吞吐量样本.
  在稳定负载期间增长,意味着网络过度负载.
- 记录有效性 Sumeragi 参数,远程测量配置文件,验证器数量
  网络 RTT, 每个基准指标的工作负载形状和硬件细节.
- 仅在比较延迟,流量和
  压力信号.

看看 [绩效和指标](/zh-hans/guide/advanced/metrics.md).

## 纯金属和工艺管理 {#bare-metal-and-process-management}

- 保持每一个同龄人 `config.toml`, 密钥,存储目录和端口
  它们是单独的.
- 使用过程管理器,如 systemd 有明确重新启动,记录,
  资源政策.
- 产生的储备 README 然后从 Kagami 局部网络捆绑
  在将测试拓向管理主机翻译时.

看看
[运行 Iroha 在纯金属上](/zh-hans/guide/advanced/running-iroha-on-bare-metal.md).
