---
translation_locale: zh-hans
translation_source: /blockchain/accounts.md
translation_source_hash: 015a85d81c44b7ef7f13cdafb2ed8e493ef512b94dc500939655c70285eac3bd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 账户 {#accounts}

账户是一个能够签署交易并拥有账本状态的授权主体。在当前 Iroha 3 数据模型中，`AccountId` 是规范且无域的：它派生自账户控制器，并以 [I105](/zh-hans/reference/i105.md) 规范编码。人类可读的域和数据空间上下文属于单独的账户别名绑定。

## 结构 {#structure}

已注册的 `Account` 包含:

- `id`:规范`AccountId`
- `metadata`:任意的账户元数据
- `label`:可选的稳定别名
- `uaid`:可选的通用账户 ID 用于 Nexus 流.
- `opaque_ids`:与账户的 UAID 绑定的不透明标识符

创建帐户所使用的交易有效载荷为 `NewAccount`.它携带相同的身份,元数据,标签, UAID 和不透明的 ID 字段,被注册账户使用.

`uaid` 是对规范 `AccountId` 的补充，而不是替代。当 Nexus 服务需要跨数据空间的稳定用户或组织句柄、保护隐私的注册流程或服务能力查找时，请使用它。运行时维护一对一的 UAID到账户索引，要求不透明标识符通过 UAID 附加，并拒绝重复或冲突的不透明标识符。有关 Nexus 服务层流程，请参阅 [FHE 和 UAID](/zh-hans/blockchain/sora-nexus-services.md#fhe-and-uaid)。

## 账户控制者 {#account-controllers}

控制器定义了帐户如何授权操作.默认客户端流程使用Ed25519键对,但数据模型还支持多签字政策控制器等更丰富的控制器.

客户端配置将签名授权主体与网络对等节点配置分开存储：

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

查看当前关键格式[客户端配置](/zh-hans/guide/configure/client-configuration.md)和 [关键生成](/zh-hans/guide/security/generating-cryptographic-keys.md).

## 在 Taira 试看. {#try-it-on-taira}

列出公共 Taira 测试网上的几个规范账户 IDs：

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

为了检查账户资产,从第一次调用中复制一个帐户 ID,然后在将其放入路径之前编码 URL.该 Python 片段为上市的第一个账户执行:

```bash
python3 - <<'PY'
import json
import urllib.parse
import urllib.request

root = "https://taira.sora.org"
accounts = json.load(urllib.request.urlopen(f"{root}/v1/accounts?limit=1"))["items"]
account_id = accounts[0]["id"]
encoded = urllib.parse.quote(account_id, safe="")
assets = json.load(
    urllib.request.urlopen(f"{root}/v1/accounts/{encoded}/assets?limit=5")
)

print(json.dumps({"account_id": account_id, "assets": assets["items"]}, indent=2))
PY
```

创建或更新一个帐户是一个签署的交易,需要以下页面所述、由 faucet 供资的 Taira 设置： [连接到 SORA Nexus 数据空间](/zh-hans/get-started/sora-nexus-dataspaces.md).

## 登记和许可证 {#registration-and-permissions}

帐户注册和未注册,使用通用 [`Register`和 `Unregister`](/zh-hans/blockchain/instructions.md#un-register)指令.主动运行时验证器决定谁可以创建账户以及需要哪些许可代币或角色.

在注册后,帐户可以:

- 签署交易
- 持有资产
- 自己的域名
- 接收角色和权限令牌
- 存储元数据
- 当这些功能被启用时,参与别名, rekey,回收和 Nexus 身份流

## 解决身份问题 {#troubleshooting-identity-issues}

如果交易意外地被拒绝,请检查:

- 客户公钥与签名所使用的私钥相匹配
- 账户已在创世过程中或通过提交的交易注册
- 授权主体有指令要求的许可
- 严格账户字段使用规范 I105 帐户 ID,而可读的名称通过活跃账户代号绑定解决.

此外,请参见:

- [许可证](/zh-hans/blockchain/permissions.md)
- [超值数据](/zh-hans/blockchain/metadata.md)
- [客户端配置](/zh-hans/guide/configure/client-configuration.md)
- [SORA Nexus 数据空间](/zh-hans/get-started/sora-nexus-dataspaces.md)
