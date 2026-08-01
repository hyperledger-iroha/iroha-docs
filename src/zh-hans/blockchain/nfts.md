---
translation_locale: zh-hans
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

Iroha NFT 是一个具有一个所有者的独特账本对象. 使用 NFTs 当记录需要自己的身份,元数据,生命周期事件和所有权转移语义时,但不需要数字平衡时.

与数值 [资产](/zh-hans/blockchain/assets.md)不同,一个 NFT 没有精度,可选性或每账户的数量. NFT 存在为一个注册对象,所有权直接追踪该对象.

## 结构 {#structure}

已注册的 `Nft` 包含:

- `id`:一个 `NftId`
- `content`:描述 NFT 的元数据
- `owned_by`:持有 NFT 的账户

`content`字段是`Metadata`地图.保持紧:存储描述字段,稳定引用,哈希, URIs 或 SoraFS 路径在那里.存储大型文件,媒体或高率的应用状态离链,并只在 NFT 上保存可验证的参考.

## 在 Taira 试看. {#try-it-on-taira}

检查公开 Taira 测试网是否目前拥有 NFT 记录:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

查看节点暴露的 NFT 路线的现场 OpenAPI 文档:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

虚空的 `items`阵列是公共测试网上的有效响应.这意味着当前页面中没有 NFTs,而不是说 NFT 指令不可用.

## NFT IDs {#nft-ids}

`NftId`使用以下文本表格:

```text
name$domain
name$domain.dataspace
```

例如, `badge$docs.universal` 在 `docs.universal` 域中识别`badge` NFT.如果遗漏数据空间,当前的解析器使用`universal` 数据空间,因此 `badge$docs` 解决为`badge$docs.universal`.

使用 NFT IDs 的稳定名称. ID 是指令,查询,权限,事件过器和应用参考所使用的对象身份.

## 生命周期 {#lifecycle}

NFT 生命周期运营使用 Iroha 特殊指示:

- [`Register`](/zh-hans/blockchain/instructions.md#un-register)创建 NFT 的初始 `content`.
- [`Unregister`](/zh-hans/blockchain/instructions.md#un-register)删除了 NFT.
- [`Transfer`](/zh-hans/blockchain/instructions.md#transfer)`owned_by`的变化
- [`SetKeyValue`和 `RemoveKeyValue`](/zh-hans/blockchain/instructions.md#setkeyvalue-removekeyvalue)更新的 NFT 元数据.

## 在本地试看 {#try-it-locally}

这些例子假设您已经启动了本地网络,并从 [CLI 指南](/zh-hans/get-started/operate-iroha-via-cli.md)生成的客户端配置:

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

生成的本地网络已经设置了 `wonderland.universal` 和其 SNS 要使用不同的域名,首先用声明符创建一个域名 `app alias setup plan` 和 `app alias setup apply` 工作流程 [域名](/zh-hans/blockchain/domains.md#registration).

注册一个 NFT.注册从标准输入中读取初始内容 JSON:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

直接检查 NFT,然后列出所有 NFTs,包含全部条目:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

添加一个元数据键,然后再次读取 NFT:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

删除元数据密钥:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

选择地转移 NFT.使用`ledger nft get`来读取当前所有者从 `owned_by`,并使用`ledger account list all`找到目的地账户 ID.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

通过后删除例 NFT. 如果您将其转移,则要么将它转移回来,要么提交与当前所有者帐户配置的非注册命令.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## 问题和事件 {#queries-and-events}

使用[`FindNfts`](/zh-hans/reference/queries.md#assets-nfts-and-rwas)列出 NFTs 和[`FindNftsByAccountId`](/zh-hans/reference/queries.md#assets-nfts-and-rwas)列出由账户所有的 NFTs.

NFT 注册,删除,传输和元数据更新发出 NFT 数据事件. 订阅本书变更或构建反应 NFT 生命周期事件时使用`Nft`数据事件过器.

## 许可证 {#permissions}

默认授权表面包括 NFT 特定的代币:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

通过活跃的运行时间验证器执行许可检查,因此一个网络可通过升级执行器来定制授权. [许可证代码](/zh-hans/reference/permissions.md) 对于当前默认代币列表.

## 选择 NFTs {#choosing-nfts}

使用 NFT 用于特殊性和所有权的记录:

- 证书,章,许可证和证明
- 成员身份或访问记录
- 身份相关或账户所有的申请记录
- 链外媒体,文档或公布的引用

使用数值资产用于可存余额,并且使用简单的 [元数据](/zh-hans/blockchain/metadata.md),当数据只是现有账本对象的一种紧属性.

此外,请参见:

- [资产](/zh-hans/blockchain/assets.md)
- [超值数据](/zh-hans/blockchain/metadata.md)
- [指示](/zh-hans/blockchain/instructions.md)
- [查询](/zh-hans/blockchain/queries.md)
