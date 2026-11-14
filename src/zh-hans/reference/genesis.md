---
translation_locale: zh-hans
translation_source: /reference/genesis.md
translation_source_hash: dda17468f39573a1fcf43474351bd01c4fea38e8b603fd4d8b21780b273c8649
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# 创世记参考 {#genesis-reference}

在当前 Iroha 3 工作流程，一个 `genesis.json` 清单描述了第一个 网络启动时将应用的事务和参数。

分发给同级的签名工件是 Norito-编码的 `.nrt` 文件 生产者 `kagami genesis sign`.

## 主要领域 {#main-fields}

创世清单可以定义：

- `chain` 对于链标识符
- `chain_discriminant`：用于在清单中编码账户字面量的 I105 网络前缀
- `executor` 对于可选的执行程序升级字节码路径
- `ivm_dir` 为了 IVM 触发器和升级使用的库
- `consensus_mode` 对于清单所公布的初始模式
- `wire_protocol_version`：首个发布版本的共识传输协议版本
- `consensus_fingerprint`：共识参数的可选类型化指纹，JSON 清单会显式声明该字段
- `transactions` 用于有序参数更新、指令、触发器和拓扑
- `sumeragi_context`：已签名的 Sumeragi 高度上下文参数
- `crypto_admission_policy`：链明确接受、列于 `allowed_algorithms` 的签名及控制器算法

之内 `transactions`, 拓扑条目对对等 ID 和 PoPs 一起：

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## 生成清单 {#generate-a-manifest}

使用 Kagami 生成模板。按规范升序为每个获准算法重复指定 `--allowed-signing`；Kagami 不会补充被省略的算法：

```bash
cargo run -p iroha_kagami -- genesis generate \
  --chain-id <CHAIN_ID> \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 \
  --allowed-signing bls_normal > genesis.json
```

对于公开 SORA Nexus 数据空间，预期共识模式为 `npos`。其他 Iroha 3 部署可根据目标配置采用许可模式或 NPoS。

## 签署舱单 {#sign-the-manifest}

编辑并验证后 JSON, 将其签名到可部署的 `.nrt` 堵塞：

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt \
  --expected-hash-out genesis.expected_hash
```

`kagami genesis sign` 从由所有者保管、硬链接数为 1 的普通文件中的私钥派生创世密钥对，以生成可部署的签名区块。传入 `--expected-public-key` 可要求该密钥对与已发布的创世公钥相匹配。该文件必须包含一个规范的私钥 multihash，后接一个换行符；Kagami 拒绝符号链接以及权限模式不是 `0600` 的文件。命令行不接受原始私钥。生成的文件就是对等节点应在配置中引用的文件。

## 配置 `iroha3d` {#configure-iroha3d}

将守护进程指向已签名创世区块及固定其预期哈希的文件。`kagami genesis sign --expected-hash-out` 会写入该文件，节点在首次启动和重启时均要求提供它：

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
expected_hash_file = "genesis.expected_hash"
```

## 相关工具 {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet generate`
- `cargo xtask kagami-profiles`

有关生成器的实现和命令详细信息，请参阅 [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami/README.md).
