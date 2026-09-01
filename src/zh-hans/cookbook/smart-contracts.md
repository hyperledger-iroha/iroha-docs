---
translation_locale: zh-hans
translation_source: /cookbook/smart-contracts.md
translation_source_hash: f1ea542f7a710830cd32465d141db8452e6418d426500995b9df7c9c4e1fd597
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 建立和部署智能合同 {#build-and-deploy-a-smart-contract}

## 结果 {#outcome}

检查和编译 Kotodama V1 合同,本地执行其公开入口点,部署验证的 IVM 构件,模拟部署的入口点并以明确报价的机构支付费用提交.

## 预先条件 {#prerequisites}

- 签出到提交 `0010c5a70039eac101a4846499ba9ceaf43eb65c` 的 Iroha 源代码、Rust 和 Cargo。
- 当前的 `iroha` CLI，以及通过[连接到 Taira](./connect-to-taira.md)获得的已注资 Taira 客户端。
- `IROHA_CONFIG` 和 `IROHA_PRIVATE_KEY_FILE` 中必须使用绝对路径。密钥文件必须由所有者保管，是硬链接数为 1、权限模式为 `0600` 的普通文件；部署辅助程序有意不提供内联私钥参数。
- Taira 运营商批准。注册合约代码需要 `CanRegisterSmartContractCode`，受保护的部署还可能需要治理归属和颁布。如果 Taira 尚未授予此访问权限，请在创世配置已授予该权限的生成式本地网络上执行部署。

```bash
TORII_URL=https://taira.sora.org
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
IROHA_PRIVATE_KEY_FILE=/absolute/path/to/taira-private-key.txt
test -n "$TAIRA_ACCOUNT_ID"
test -f "$IROHA_PRIVATE_KEY_FILE"

CHAIN_ID="$({
  python3 - "$IROHA_CONFIG" <<'PY'
import sys
import tomllib

with open(sys.argv[1], "rb") as config_file:
    print(tomllib.load(config_file)["chain"])
PY
})"
```

## 步骤 {#steps}

### 1.已知良好的 Kotodama V1 合同复制 {#_1-copy-a-known-good-kotodama-v1-contract}

工作在的内部 Iroha 检查和复制编译器的反复返回样本,所以源和工具链保持在相同的提交.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

完整的来源小,使用当前的 `seiyaku`/`kotoage`语法:

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    kotoage fn compute() -> (int, int) authorize("Entry") {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama 针对 Iroha 虚拟机及其当前的 ABI.它不是一个 WASM 或 EVM 源语言.

### 2. 检查,建造和验证构件 {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p ivm --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

第一个构建发布了构件和验证的辅助记录.第二个运行在只读 `--verify` 模式下,如果任何现有输出不完全匹配当前源头,则失败.将`.to`文件及其清单视为一本复习的构建输出.

### 3. 在本地运行字节码 {#_3-run-the-bytecode-locally}

`compute`是一个公开的 `kotoage`入口点.使用`debug-call`运行,该系统在没有提交或支付交易的情况下执行与本地测试数据相对.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama 整数被呈现为 JSON 字符串,因此解码的tuple是 `["3", "5"]`.

### 4. 通过本地助手部署 {#_4-deploy-through-the-native-helper}

助手上传字节代码块,注册签署的清单,并提交一个 `CommitContractDeployment`操作.它收费报价每笔交易,拒绝改变选择付款人或加油绑定的报价.

```bash
printf '%s\n' \
  '{"payer":"authority","value":{"charge_limits":[],"gas_limit":1500000}}' \
  > ./build/fee-payment.json

cargo run -p iroha_cli --bin ivm_contract_deploy -- \
  --torii-url "$TORII_URL" \
  --chain-id "$CHAIN_ID" \
  --authority "$TAIRA_ACCOUNT_ID" \
  --private-key-file "$IROHA_PRIVATE_KEY_FILE" \
  --code-file ./build/tuple_return_demo.to \
  --contract-alias cookbook_tuple::universal \
  --fee-payment-json ./build/fee-payment.json \
  --out-dir ./build/deployment \
  > ./build/deployment.json

jq '{contract_address, code_hash_hex, final, fee_quotes}' \
  ./build/deployment.json
```

空的 `charge_limits` 请求不是复制来的资产标识符：辅助程序会在签名前接受精确的实时报价。请将返回的收费资产与当前的 faucet 响应进行比较。合约调用仅通过带类型的实时报价接受费用选择；`gas_asset_id` 交易 metadata 不属于首个版本的合约。

### 5. 模拟并调用部署的入口点 {#_5-simulate-and-call-the-deployed-entrypoint}

模拟在 Torii 上运行公共入口点,没有提交.下面的调用是交易,因此明确选择授权主体费付款人.这两项命令都绑定了1500000个gas限制.

```bash
iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-simulation.json

iroha --config "$IROHA_CONFIG" \
  --machine \
  --fee-payer authority \
  contract call \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  --wait \
  --timeout-ms 60000 \
  > ./build/deployed-call.json

jq -e '.terminal_kind == "Applied"' ./build/deployed-call.json
```

## 验证 {#verify}

通过返回的代码哈希来搜索链上的清单,并通过规范地址模拟相同的公开入口点:

```bash
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/deployment.json; })"
CONTRACT_ADDRESS="$({ jq -er '.contract_address' ./build/deployment.json; })"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-simulation.json
```

部署只有当别名解决返回地址时才完成,清单可在相同的代码哈希下读取,本地和 Torii 模拟返回 `["3", "5"]`,提交的呼叫达到 `Applied`.

## 解决问题 {#troubleshooting}

- `CanRegisterSmartContractCode`失败需要一个 Taira 运营商授权或在 localnet上发生/启动链变化.正常账户不能自行授予此许可事实后.
- 管理或受保护通道拒绝意味着部署需要该网络所要求的准确批准属性.协调批准者列表;不要创作账户 IDs.
- 一个明示或 ABI 不匹配意味着字节码,明示和节点运行时没有描述相同的构件.重建与 `--verify` 固定的提交.
- `fee quote changed ... gas bound` 表示所要求的输入意图和现场报价不同意见.重新预期,而不是修改签署交易.
- 部署辅助器在网络提交之前拒绝内线键,允许键文件模式,符号链接和复制链接的文件.
- 只有视图输入点的错误意味着 `compute` 通过错误的命令家族进行了路由. 这个样本声明`kotoage`,所以使用调用模拟或提交.
- 合同调用需要正型gas限制.第一次发布的呼叫合约拒绝最高级别的gas或费用资产元数据.

## 来源及相关文件 {#source-and-related-docs}

- [Kotodama V1 命令的执行在固定提交上](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)的双重返回源样本
- [在固定提交中本地部署辅助员](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [合同集成测试在固定提交上](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [智能合同](/zh-hans/blockchain/smart-contracts.md)
- [CLI 引用](/zh-hans/get-started/operate-iroha-via-cli.md)
