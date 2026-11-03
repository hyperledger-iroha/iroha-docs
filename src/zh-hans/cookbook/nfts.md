---
translation_locale: zh-hans
translation_source: /cookbook/nfts.md
translation_source_hash: b60c542052eac6a916350c4aaa779c9f46d248be64ecea9c9bda679a4d56dff3
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# NFTs {#nfts}

## 结果 {#outcome}

检查 Taira NFT 记录,更新,转移和查询一个独特的数据. NFT 在生成的本地网络上. 工作流程使用一个完全合格的 `name$domain.dataspace` NFT ID 和规范 I105 业主 IDs.

## 预先条件 {#prerequisites}

- `curl`,`jq`, Python 3.11或以后的电流,以及 `iroha` CLI.
- 仅可读的 Taira 访问.
- 对于写入操作，需要一个按照 [启动 Iroha](/zh-hans/get-started/launch-iroha.md) 的做法以 `kagami localnet generate --peers 4 --out-dir ./localnet` 生成的本地网络，其中包含 `./localnet/client.toml` 和位于 `http://127.0.0.1:8080` 的 Torii，另外还需要一个由其签名者拥有的 NFT 域名（见步骤 2）。

## 步骤 {#steps}

### 1. 检查公众收藏 Taira {#_1-inspect-the-public-taira-collection}

空白页面是成功读取的:这意味着请求页面中没有可见的 NFTs.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5&include_total=true' \
  | jq '{total, nfts: [.items[] | {id, owned_by, metadata}]}'
```

NFTs 是唯一记录，而不是数值余额。它们有一个 ID、一个所有者和一个紧凑的内容映射；Torii 集合行会将其作为 `metadata` 返回，而 `ledger nft get` 会将其作为 `content` 返回。

### 2. 准备当地所有者 IDs {#_2-prepare-local-owner-ids}

写入示例需要一个由签名账户拥有的域名，或针对该域名的 `CanRegisterNft` 授权。生成的本地网络不会为其客户端注册任何应用程序域名，而直接注册域名的操作仅保留给创世，因此请将 `NFT_DOMAIN` 设为您的签名者所控制的 `name.dataspace` 域名。在不暴露私钥的情况下推导出已配置的授权主体，然后选择另一个已注册账户作为转移目的地。

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
test -n "$NFT_DOMAIN"
NFT_ID="cookbook_badge\$$NFT_DOMAIN"

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
CURRENT_OWNER="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

NEW_OWNER="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg owner "$CURRENT_OWNER" \
      '[.items[].id | select(. != $owner)][0]'
)"
```

`$` 分隔符属于 NFT 的文本形式。在 ID 中保留完整的 `name.dataspace` 域名。

### 3. 登记 NFT 的初始含量 {#_3-register-the-nft-with-initial-content}

CLI 从标准输入中读取最初的 JSON 对象.当前的授权主体机构成为所有者.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. 更新内容映射 {#_4-update-the-content-map}

元数据值是 JSON。设置一个键会插入或替换该条目，而不会替换整个 NFT 记录。

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. 转让所有权 {#_5-transfer-ownership}

供应既规范 I105 账户 IDs. 一个别名必须在被使用之前解决 `--from` 或 `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning 许可范围

在 Taira 上，每次写入都使用 `--fee-payer authority`；CLI 会在签名前给出以 Taira 费用资产计价的确切费用报价。注册、转移、移除和元数据更新由当前生效的运行时检查（默认权限接口中的 `CanRegisterNft`、`CanTransferNft`、`CanUnregisterNft` 和 `CanModifyNftMetadata`）。请使用您的账户拥有的域名，或您的账户持有这些授权的域名。

:::

在合同所有的工作流程中, Kotodama 显示输入 NFT 主机调用.以下是通过固定 IVM 文档测试编译和执行的精确生命周期测试数据:

```kotodama
// Mint an NFT, transfer it, update metadata, and burn it using typed IDs.
seiyaku NftFlow {
    permission NftAuthority;
    kotoage fn nft_issue_and_transfer() authorize(NftAuthority) {
        let owner = AccountId::parse("sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV");
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft: nft, owner: owner);
        let to = AccountId::parse("sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76");
        ledger::nft::transfer(source: owner, nft: nft, destination: to);
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft: nft);
    }
}
```

两个固定的 I105 值是上游项目的测试数据；测试框架会在执行前注册目标账户。它们并非 CLI 操作指南中的 `CURRENT_OWNER` 和 `NEW_OWNER`。对于应用程序合约，请提供其实际的规范账户，然后通过[智能合约](./smart-contracts.md)编译、测试、部署并调用。请勿向 Taira 提交未经审查的字节码；合约执行仍须通过运行时授权。

## 验证 {#verify}

直接阅读 NFT,并确认其所有者改变了,而其内容仍然附上:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

CLI 会直接打印 NFT 记录本身。可作为依据的不变量是 `id`、`owned_by` 和 `content`。

## 解决问题 {#troubleshooting}

- `name$domain`可以默认地在某些解析器中使用通用数据空间,但书籍和应用程序 IDs 应使用明确的 `name$domain.dataspace`形式.
- 拒绝重复登记同一个 NFT ID. 使用新 localnet 或选择稳定新的 ID 来进行单独的记录.
- 在标准输入时,输入元数据必须是有效的 JSON.没有引用 JSON 的链不是元数据值.
- 由当前所有者以外的账户签名的转移，需要拥有该 NFT 的域名或具备确切的 `CanTransferNft` 授权；更改 `--from` 不会改变签名者。
- 转移只会变更 `owned_by`。元数据更新和取消注册仍由域名所有者，或持有该 NFT 的 `CanModifyNftMetadata` 或 `CanUnregisterNft` 的账户负责；新所有者可以再将其转移出去。
- Taira 可以返回空白的 NFT 收藏.不要将`items: []`作为证明 NFT 指令不可使用的证明

## 来源及相关文件 {#source-and-related-docs}

- [NFT 集成测试在固定的提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/nft.rs)
- [Kotodama NFT 在固定提交时进行主机调用测试](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [确切的 Kotodama NFT 生命周期测试数据在定提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/docs/examples/12_nft_flow.ko)
- [固定提交中的 Kotodama 文档示例测试](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_documentation_examples.rs)
- [NFTs](/zh-hans/blockchain/nfts.md)
- [超值数据](/zh-hans/blockchain/metadata.md)
- [指示](/zh-hans/blockchain/instructions.md)
- [许可证代币](/zh-hans/reference/permissions.md)
