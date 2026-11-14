---
translation_locale: zh-hans
translation_source: /guide/configure/genesis.md
translation_source_hash: 91be089c82a76991e35a43e1541f9e069fdf70d3fb5de2492b985c06c78a2372
translation_status: machine-validated
translation_engine: google-translate+reviewed-delta+reviewed-first-release-source-amendment
---
# 创世纪 {#genesis}

Genesis 定义了初始链状态。可编辑源是 JSON 显现， 和一个 Iroha 3 节点消耗一个签名的 Norito 交易文件。

::: details 默认创世清单

<<< @/snippets/genesis.json

:::

## 文件 {#files}

上游仓库在 `defaults/genesis.template.json` 提供默认源模板。模板并不完整；只有通过 `kagami genesis materialize` 将其转为清单后，才能验证、签名或供节点使用。Kagami 生成的网络会将自己的清单和签名交易写入输出目录：

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

生成的 `README.md` 在该目录中记录确切的文件并启动 所选配置文件的命令。

## 对等配置 {#peer-configuration}

对等节点在 `config.toml` 的 `[genesis]` 部分指定已签名创世交易，并将其预期哈希固定在单独文件中：

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
expected_hash_file = "./genesis.expected_hash"
```

网络中的所有对等节点必须使用一致的已签名创世交易和创世公钥。首次启动和重启均需要预期哈希文件；`kagami genesis sign --expected-hash-out` 会写入该文件。

## 签署创世纪 {#signing-genesis}

如果您手动编辑清单，请在启动对等点之前验证并对其进行签名：

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt \
  --expected-hash-out ./genesis.expected_hash
```

`GENESIS_PRIVATE_KEY_FILE` 必须是由所有者保管的普通文件，权限模式为 `0600` 且硬链接数为 1；文件内容必须是一个规范的私钥 multihash，末尾带换行符。Kagami 拒绝符号链接，且绝不接受通过命令行传入的原始创世私钥。

对于 NPoS 或 SORA Nexus 配置，请包含所生成配置要求的拓扑和 BLS 持有证明。Kagami 的 `localnet generate`、`wizard` 和 `sora-network generate` 命令会自动处理这些细节。

## 重新承诺创世纪 {#recommitting-genesis}

新网络从其已签名的创世数据启动。要在一次性本地网络中测试不同的创世数据，请停止对等节点，删除其生成的状态目录，然后从新签名的创世数据启动。运行中的网络绝不能通过替换创世数据来升级。协议定义的变更需要由治理批准的选择转换，并针对所选定义和义务进行资格验证。
