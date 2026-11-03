---
translation_locale: zh-hans
translation_source: /cookbook/smart-contracts.md
translation_source_hash: ca6fd12e33df43b73a72dd6327133115aa44256cf579387c11bf0693797bf96e
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# 建立和部署智能合同 {#build-and-deploy-a-smart-contract}

## 结果 {#outcome}

检查并编译 Kotodama V1 合约，在本地运行其公开的视图函数，使用明确选择、由授权主体支付的费用部署已验证的 IVM 构件，并通过 Torii 读取已部署的视图函数。

## 预先条件 {#prerequisites}

- 签出到提交 `c8c872461e92f04325c350cdd952f4276e96f9dc` 的 Iroha 源代码、Rust 和 Cargo。
- 当前的 `iroha` CLI 和 `musubi`（在检出的源代码目录中以 `cargo run -p musubi --` 运行），以及通过[连接到 Taira](./connect-to-taira.md)获得的已注资 Taira 客户端。
- `IROHA_CONFIG` 中必须使用绝对路径。Musubi 的网络绑定会保存对此客户端文件的引用，并以该文件中的账户密钥签名部署。
- 别名权限。执行器要求针对确切的合约别名或其上层范围持有 `CanManageAccountAlias`：对于 `name::domain.dataspace` 是所属域名，对于 `name::dataspace` 则是数据空间。已注册账户不需要另外的代码注册权限，而受保护的命名空间还需要经过网络的治理流程。示例使用 `cookbook_tuple::universal`；在 Taira 上，请将其替换为您拥有的域名中的别名，或在创世配置已授予该别名范围的生成式本地网络上部署。

```bash
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
test -f "$IROHA_CONFIG"
```

## 步骤 {#steps}

### 1.已知良好的 Kotodama V1 合同复制 {#_1-copy-a-known-good-kotodama-v1-contract}

工作在的内部 Iroha 检查和复制编译器的反复返回样本,所以源和工具链保持在相同的提交.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

完整的源代码很短：一个私有辅助 `fn`，以及一个明确允许所有调用者的公开只读 `view fn`：

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    view fn compute() authorize(anyone) -> (int, int) {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama 针对 Iroha 虚拟机及其当前的 ABI.它不是一个 WASM 或 EVM 源语言.

### 2. 检查,建造和验证构件 {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p kotodama_toolchain --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

第一个构建发布了构件和验证的辅助记录.第二个运行在只读 `--verify` 模式下,如果任何现有输出不完全匹配当前源头,则失败.将`.to`文件及其清单视为一本复习的构建输出.

### 3. 在本地运行字节码 {#_3-run-the-bytecode-locally}

`compute` 是一个公开的只读 `view fn`。使用 `debug-view` 运行它；它会在本地针对可选的测试数据执行已编译的字节码，而不提交交易或支付交易费用。

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-view \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-view.json
```

Kotodama 整数被呈现为 JSON 字符串,因此解码的tuple是 `["3", "5"]`.

### 4. 使用 Musubi 部署已验证的构件 {#_4-deploy-the-verified-artifact-with-musubi}

`iroha contract` 可以检查、查看和调试合约，但不会部署合约，因此 Taira 上的部署要通过 Musubi 进行。其部署服务会上传字节码分块、注册已验证的清单，并提交一个 `CommitContractDeployment` 操作。它会为每笔交易获取报价，拒绝任何会改变所选付款人、赞助方修订版本或 gas 上限的报价，并且只有在锁定的包构建重现其代码哈希和 ABI 哈希之后，才会部署预先构建的构件。在由 Kagami 管理的本地网络上，则改用 `kagami contract deploy` 以 `--alias cookbook_tuple::universal --json` 部署 `./build/tuple_return_demo.to`；其收据位于 `.receipt` 下，而 `kagami context show` 会打印要作为 `IROHA_CONFIG` 使用的客户端配置。

```bash
cat > ./contracts/Musubi.toml <<'TOML'
manifest-version = 1

[package]
namespace = "local"
name = "cookbook-tuple"
version = "0.1.0"
edition = "1"
abi-version = 1

[[contract]]
name = "tuple_return_demo"
path = "tuple_return_demo.ko"
TOML

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml check

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml \
  network configure taira \
  --config "$IROHA_CONFIG" \
  --fee-payer authority \
  --contract tuple_return_demo \
  --alias cookbook_tuple::universal

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml --format json \
  deploy --network taira \
  --contract tuple_return_demo \
  --artifact ./build/tuple_return_demo.to \
  --artifact-manifest ./build/tuple_return_demo.manifest.json \
  > ./build/deployment.json

jq '.data.receipt | {contract_address, code_hash, stored_artifact_matches}' \
  ./build/deployment.json
```

此绑定使用 `--fee-payer authority`；Musubi 会在签名前给出以 Taira 费用资产计价的确切费用报价。请将返回的收费资产与当前水龙头政策公布的资产进行比较。合约调用仅通过带类型的实时报价接受费用选择；`gas_asset_id` 交易 metadata 不属于首个版本的合约。

### 5. 读取已部署的视图函数 {#_5-read-the-deployed-view}

`contract view` 会在 Torii 上执行只读入口点，不需要交易或费用。视图函数没有交易形式：Torii 会在其调用路由上拒绝视图选择器。

```bash
iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-view.json
```

## 验证 {#verify}

解析别名，按 Torii 为已部署视图函数报告的代码哈希获取链上清单，并通过规范地址运行相同的视图函数：

```bash
CONTRACT_ADDRESS="$({
  jq -er '.data.receipt.contract_address' ./build/deployment.json
})"
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/local-view.json; })"
DEPLOYED_CODE_HASH="$({
  jq -er '.code_hash_hex' ./build/deployed-view.json
})"
test "$DEPLOYED_CODE_HASH" = "$CODE_HASH"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --dataspace-id 0 \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-view.json
```

只有当部署收据报告已存储的构件为已验证、别名解析为返回的地址、清单可在相同的代码哈希下读取，且本地与 Torii 的视图结果都返回 `["3", "5"]` 时，部署才算完成。

## 解决问题 {#troubleshooting}

- `deployment authority lacks CanManageAccountAlias` 或执行器的 `authority is not permitted to manage contract alias` 表示该账户不得绑定该别名。请使用您拥有的域名中的别名，或从该范围的所有者获取确切的别名授权或其域名或数据空间授权；在本地网络上，则在创世中授予。
- 受保护命名空间的拒绝表示该别名命名空间受治理约束。列出批准者账户 ID 并不能作为批准证据；请针对该命名空间使用网络的治理流程（`iroha app gov deploy propose`），或选择该命名空间以外的别名。
- 清单或 ABI 不匹配表示字节码、清单和节点运行时描述的不是同一个构件。请在固定的提交上重新构建，然后使用 `--verify` 再次运行构建。
- `fee quote changed ... gas bound` 表示所要求的输入意图和现场报价不同意见.重新预期,而不是修改签署交易.
- 中断的部署会将其已签名的计划保存在日志中。请使用 `musubi deploy --resume <JOURNAL>` 恢复，而不是签名新的计划。
- `is read-only and cannot be invoked as a transaction` 或 `is not a kotoage or lifecycle entrypoint` 表示 `compute` 被发送到了调用命令。此示例声明的是 `view fn`，因此请在本地使用 `debug-view`，在 Torii 上使用 `view`。
- 合同调用需要正型gas限制.第一次发布的呼叫合约拒绝最高级别的gas或费用资产元数据.

## 来源及相关文件 {#source-and-related-docs}

- [固定提交中的 Kotodama V1 命令实现](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_toolchain/src/bin/koto.rs)
- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/tuple_return_demo.ko)的双重返回源样本
- 固定提交中的 [Musubi 部署命令](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/musubi/src/command_deploy.rs) 与[原生合约部署服务](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_contract_deploy/src/lib.rs)
- [合同集成测试在固定提交上](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/contracts.rs)
- [智能合同](/zh-hans/blockchain/smart-contracts.md)
- [CLI 引用](/zh-hans/get-started/operate-iroha-via-cli.md)
