---
translation_locale: zh-hans
translation_source: /reference/genesis.md
translation_source_hash: 1312e80d9e662cc3e8cf4d0668ff4bb9e6ce3f74a60bb5287205aeeb5afd5de8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 创世记参考 {#genesis-reference}

在当前 Iroha 3 工作流程，一个 `genesis.json` 清单描述了第一个
网络启动时将应用的事务和参数。

分发给同级的签名工件是 Norito-编码的 `.nrt` 文件
生产者 `kagami genesis sign`.

## 主要领域 {#main-fields}

创世清单可以定义：

- `chain` 对于链标识符
- `executor` 对于可选的执行程序升级字节码路径
- `ivm_dir` 为了 IVM 触发器和升级使用的库
- `consensus_mode` 对于清单所公布的初始模式
- `transactions` 用于有序参数更新、指令、触发器和拓扑
- `crypto` 对于初始加密快照

之内 `transactions`, 拓扑条目对对等 ID 和 PoPs 一起：

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## 生成清单 {#generate-a-manifest}

使用 Kagami 生成模板：

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

对于公众 SORA Nexus 数据空间， `npos` 是预期的共识模式。
其他 Iroha 3 根据目标，部署可以使用许可或 NPoS
轮廓。

## 签署舱单 {#sign-the-manifest}

编辑并验证后 JSON, 将其签名到可部署的 `.nrt` 堵塞：

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` 从清单中读取创世公钥并使用
来自所有者持有的单链接常规文件的私钥，以生成
可部署的签名块。该文件必须包含一个规范的私钥
多哈希后跟换行符； Kagami 拒绝符号链接和模式其他
比 `0600`. 命令行不接受原始私钥。结果
是对等方应从其配置中引用的文件。

## 配置 `iroha3d` {#configure-iroha3d}

将守护进程指向已签名的创世块：

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## 相关工具 {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

有关生成器的实现和命令详细信息，请参阅
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
