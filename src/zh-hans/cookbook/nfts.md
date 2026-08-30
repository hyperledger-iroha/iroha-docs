---
translation_locale: zh-hans
translation_source: /cookbook/nfts.md
translation_source_hash: 5eb6a349b815afbac9717f7b44c499adc78b1280625388656015ff4b133b9085
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

## 结果 {#outcome}

检查 Taira NFT 记录,更新,转移和查询一个独特的数据. NFT 在生成的本地网络上. 工作流程使用一个完全合格的 `name$domain.dataspace` NFT ID 和法典 I105 业主 IDs.

## 预先条件 {#prerequisites}

- `curl`,`jq`, Python 3.11或以后的电流,以及 `iroha` CLI.
- 仅可读的 Taira 访问.
- 为了写作,一个由 [发射 Iroha](/zh-hans/get-started/launch-iroha.md), 与 `./localnet/client.toml` 和 Torii 在 `http://127.0.0.1:8080`.

## 步骤 {#steps}

### 1. 检查公众收藏 Taira {#_1-inspect-the-public-taira-collection}

空白页面是成功读取的:这意味着请求页面中没有可见的 NFTs.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs 是独特的记录,而不是数值平衡.它们有一个 ID,一个拥有者和一个紧的`content`元数据地图.

### 2. 准备当地所有者 IDs {#_2-prepare-local-owner-ids}

编写示例使用登录的 `wonderland.universal`域名. 在不暴露其私钥的情况下导出配置权威,然后选择另一个注册帐户作为转移目的地.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
NFT_ID='cookbook_badge$wonderland.universal'

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

`$`分区器属于 NFT 文本表格. 保持完整的 `wonderland.universal`域和数据空间后.

### 3. 登记 NFT 的初始含量 {#_3-register-the-nft-with-initial-content}

CLI 从标准输入中读取最初的 JSON 对象.当前的权威机构成为所有者.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. 更新内容地图 {#_4-update-the-content-map}

基数据值为 JSON.设置一个键插入或取代该单项;它不会取代整个 NFT 记录.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. 转让所有权 {#_5-transfer-ownership}

供应既正规 I105 账户 IDs. 一个别名必须在被使用之前解决 `--from` 或 `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning 许可范围

在 Taira, 每个写作都需要 `--metadata ./taira.tx-metadata.json` 登记,转移,删除和元数据更新由活跃的运行时间检查 (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft`, 和 `CanModifyNftMetadata` 在默认权限表面上) 使用为您的应用程序分配的一个域名或在 localnet 上保存这个通行.

:::

在合同所有的工作流程中, Kotodama 显示输入 NFT 主机调用.以下是通过固定 IVM 文档测试编译和执行的精确生命周期设置:

```kotodama
seiyaku NftFlow {
    kotoage fn nft_issue_and_transfer() authorize("NftAuthority") {
        let owner = AccountId::parse(
            "sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV",
        );
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft, owner);
        let to = AccountId::parse(
            "sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76",
        );
        ledger::nft::transfer(
            source: owner,
            nft: nft,
            destination: to,
        );
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft);
    }
}
```

两个固定的 I105 值是上游测试装置;带在执行前会记录目的地.它们不是`CURRENT_OWNER`和`NEW_OWNER`从 CLI 通行道.对于应用程序合同,提供其实际的法规帐户,然后编译,测试,部署并通过 [智能合约](./smart-contracts.md)调用它.不要向 Taira 提交未经审查的字节码,并且记住,执行合同仍然需要运行时间授权.

## 验证 {#verify}

直接阅读 NFT,并确认其所有者改变了,而其内容仍然附上:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

如果 CLI 将记录包裹在输出包装中,请一次检查 JSON 并将该声明应用于包含的 NFT 对象. 权威变量为 `id`, `owned_by`和 `content`.

## 解决问题 {#troubleshooting}

- `name$domain`可以默认地在某些解析器中使用通用数据空间,但书籍和应用程序 IDs 应使用明确的 `name$domain.dataspace`表格.
- 拒绝重复登记同一个 NFT ID. 使用新 localnet 或选择稳定新的 ID 来进行单独的记录.
- 在标准输入时,输入元数据必须是有效的 JSON.没有引用 JSON 的链不是元数据值.
- 一个由现有所有者以外的账户签署的转让需要准确的许可;改变 `--from`不会改变签署者的身份.
- 转移后,原始客户端可能不再被允许突变或取消 NFT 注册. 使用新所有者的签名器或授权的控制者.
- Taira 可以返回空白的 NFT 收藏.不要将`items: []`作为证明 NFT 指令不可使用的证据

## 来源及相关文件 {#source-and-related-docs}

- [NFT 集成测试在固定的承诺](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT 在固定提交时进行主机调用测试](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [确切的 Kotodama NFT 生命周期固定在定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/zh-hans/blockchain/nfts.md)
- [超值数据](/zh-hans/blockchain/metadata.md)
- [指示](/zh-hans/blockchain/instructions.md)
- [许可证代币](/zh-hans/reference/permissions.md)
