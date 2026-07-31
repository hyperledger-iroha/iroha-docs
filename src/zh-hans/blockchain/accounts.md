---
translation_locale: zh-hans
translation_source: /blockchain/accounts.md
translation_source_hash: 7a0130655b4caae240ee261bc7d2059914828da258616bc78ccff41ee455e6d3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 账户 {#accounts}

账户是一个可以签署交易和拥有本书状态的机构.
在当前 Iroha 3 数据模型 `AccountId` 是法典和无域名的:
它来自账户控制者,并被加密为 I105.
人能读取域名和数据空间背景属于单独的账户代号
结合.

## 结构 {#structure}

已注册的 `Account` 含有:

- `id`: 圣经 `AccountId`
- `metadata`: 任意账户元数据
- `label`: 一个可选的稳定别名
- `uaid`: 可选的通用账户 ID 使用的 Nexus 流量
- `opaque_ids`: 与账户的密码绑定的不透明标识符 UAID

创建帐户所使用的交易有效负载是 `NewAccount`. 它带着
同样的身份,元数据,标签, UAID, 和不透明的 ID 已使用的字段
注册账户.

`uaid` 补充了法典 `AccountId`; 它不会取代它.
什么时候 Nexus 服务需要一个稳定的用户或组织处理
个人隐私保护的注册或服务能力查找.
运行时间保持一个对一个 UAID- 需要不透明的标识符
通过一个 UAID, 和拒绝复制或碰撞的不透明
标识符.
[FHE 并且 UAID](/zh-hans/blockchain/sora-nexus-services.md#fhe-and-uaid) 对于 Nexus
服务层流量.

## 账户控制者 {#account-controllers}

控制器定义了帐户如何授权操作.
流量使用Ed25519键对,但数据模型也支持更丰富的
控制器,例如多签名政策控制器.

客户端配置存储签署权限与同行分开
配置:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

看看 [客户端配置](/zh-hans/guide/configure/client-configuration.md) 并且
[关键产品](/zh-hans/guide/security/generating-cryptographic-keys.md) 对于
目前的关键格式.

## 试着. Taira {#try-it-on-taira}

列出一些神圣经文 IDs 在公众那里 Taira 测试网:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

检查账户资产,复制一个帐户 ID 从第一次电话和 URL- 编码
在把它放在路上之前. Python 短片第一次做了.
列出的账户:

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

创建或更新一个帐户是一个签署的交易
需要水龙头资助 Taira 在
[连接到 SORA Nexus 数据库](/zh-hans/get-started/sora-nexus-dataspaces.md).

## 注册和许可证 {#registration-and-permissions}

账户注册和未注册
[`Register` 并且 `Unregister`](/zh-hans/blockchain/instructions.md#un-register)
执行时间验证器决定谁可以创建帐户
以及需要哪些许可证或角色.

在注册后,帐户可以:

- 签署交易
- 持有资产
- 自己的域名
- 接收角色和许可证
- 存储元数据
- 参与伪名,回复,恢复和 Nexus 当这些
  功能已启用

## 解决身份问题 {#troubleshooting-identity-issues}

如果交易意外被拒绝,请检查:

- 客户公钥与签名所使用的私钥相匹配
- 账户已在创始或承担的交易中注册
- 授权机构有指令所要求的许可
- 严格账户字段使用法典 I105 账户 ID, 可读的同时
  名字通过一个活跃的账户代号绑定解决

查看以下内容:

- [许可证](/zh-hans/blockchain/permissions.md)
- [数据表](/zh-hans/blockchain/metadata.md)
- [客户端配置](/zh-hans/guide/configure/client-configuration.md)
- [SORA Nexus 数据空间](/zh-hans/get-started/sora-nexus-dataspaces.md)
