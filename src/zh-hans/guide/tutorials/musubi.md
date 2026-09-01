---
translation_locale: zh-hans
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 621d1795fd1c3cc62462a9a91af68fe684c0ff5293f5e77801420dc8318bac38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# Musubi Kotodama 包装 {#musubi-kotodama-packages}

Musubi 是 Kotodama 源包的首次发布包管理器.它解决了一个精确的链上依赖图表,验证 SoraFS 来源档案,编译和测试选定的工作空间,构建规范的 CAR 档案,并通过 Iroha 发布不可变的版本.

使用 Musubi 当需要:

- 发布可重复使用的 Kotodama 函数库
- 在 `Musubi.lock` 中刻出一个准确的过渡图
- 从最终完成的 SoraFS 档案承诺中重建依赖来源
- 构建和测试一个包装或多包装工作空间
- 通过连锁注册表检查,发布,抽取,维护或名包

## 包装名称 {#package-names}

标准的包装选择器使用:

```text
namespace/package
```

准确发布标识符添加一个版本:

```text
namespace/package@version
```

没有领导者 `@` 名称空间是数据空间根,例如 `universal` 或一个域名合格的数据空间,如 `dex.universal`. 总账将结构名称空间绑定到一个稳定的家庭数据空间,然后才能索赔包.

## 清单和锁文件 {#manifest-and-lockfile}

一个包装使用封闭的第一版本 `Musubi.toml`方案.清单必须声明`manifest-version = 1`, Kotodama 版 `"1"`和 IVM ABI 版本 `1`;没有替代清单或 ABI 模式.

```toml
manifest-version = 1

[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"
edition = "1"
abi-version = 1

[lib]
source-dir = "src"
exports = ["quote"]

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"
```

依赖性可以使用精确版本,关心或倾斜要求,像 `1.*`这样的野生卡和逗号分离比较组,如 `>=1.0.0,<2.0.0`.依赖度表键是母本地进口别名;`package`始终是规范注册表选择器.

`Musubi.lock`将图表绑定到精确的创世来源 `NetworkId` 和一个最终的注册录像.它记录了选定的工作空间根和不可变的释放节点,包括发布,源代码,界面,档案, ABI 以及精确的依赖边缘承诺.当解决图所要求时,允许并行版本.

## 配置 Taira SoraFS 取 {#configure-taira-sorafs-fetching}

Taira 是此工作流的公开测试网络.从一个 Taira 客户端配置开始,包含已注册链接和当前固定的创世来源网络身份,然后在下面添加供应商特定的认证搜索键.一个 Taira 重置可以改变`NetworkId`;从签署的部署配置文件中更新它,而不是从稳定的链中推断它 UUID.帐户签名材料和供应商操作员密钥必须保留在仅所有者运行时文件中.

```toml
torii_url = "https://taira.sora.org/"
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"

[musubi.fetch]
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"
client_id = "musubi-taira"
request_timeout_ms = 30000

[[musubi.fetch.provider_gateways]]
provider_id = "REPLACE_WITH_ADMITTED_PROVIDER_ID_HEX"
url = "REPLACE_WITH_ADVERTISED_PROVIDER_HTTPS_ORIGIN"
operator_public_key = "REPLACE_WITH_PROVIDER_AUTHORIZED_OPERATOR_PUBLIC_KEY"
operator_private_key_file = "./secrets/taira-sorafs-provider.key"
```

在公共测试网根中发现 Taira 的受理供应商:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

提供商目录提供提供商身份和广告端点.从选择的提供商获得匹配操作员授权.运行时使用该键请求有限流令牌;令牌既不是 CLI 参数也不是锁文件内容.

请勿将 Taira 验证器的 pin URL 用作 `url`。签入的验证器已停用内嵌 SoraFS 存储。其 `https://taira-validator-{1,2,3,4}.sora.org` 端点接受 pin 注册，而 archive 读取则使用所选且已获准 provider 的 HTTPS origin。

## 地方工作流程 {#local-workflow}

从上游 Iroha 工作空间根,创建或输入包目录并通过Cargo运行 Musubi:

```bash
mkdir -p examples/swap-core
cd examples/swap-core

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  init . --namespace dex.universal --name swap-core --export quote

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  add std.universal/math --version '^1.0.0' --rename math

cargo run --manifest-path ../../Cargo.toml -p musubi -- fetch --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- check --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- build --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- test --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- package --config client.toml
```

`fetch`解决了最终的注册表图,允许时更新`Musubi.lock`,并从认证的 SoraFS 地点填写不可变的本地缓存. `check`, `build`, `test`和 `package`在自己的工作之前执行相同的图形和缓存检查.

使用 `--locked` 拒绝任何锁文件更改.只使用`--offline` 当注册表索引和所有需要的档案都已经缓存时. `--frozen` 结合了这两个限制.离线缓存失败; Musubi 永远不会写一个未解决的锁文件.

依赖源通过重写符合条件的呼叫,如 `math::add()`与确定性内部 Kotodama 名称进行连接.对未出口函数的依赖呼叫被拒绝.进口库暴露了函数;本地 `[[contract]]`和 `[[test]]`目标仍然是明确的包目标.

## 缓存验证和修复 {#cache-verification-and-repair}

公共缓存命令运行在不可变的注册表提交档案:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` 会隔离已损坏的受信任后代，并在最终确定的提供方证据允许时重新获取完全相同的归档。对于实时且非空的变更，修剪会刻意采用失败关闭策略；请使用 `--dry-run` 检查已分类的候选项。

## 包装和出版 {#packaging-and-publishing}

在编写档案之前检查清洁的正文件集,然后构建规范包:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` 会写入 `target/package/<namespace>-<name>-<version>.car`。CAR 会绑定规范的软件包清单、语义化发布清单、精确的验证锁、源代码树、接口摘要和 SoraFS 归档承诺。首个版本的 CLI 中没有独立的 `pack`、`--car-out`、`--sorafs-manifest-out` 或 `--source-plan-out` 命令。

发布是一个已签名且可恢复的网络工作流。所选的 `client.toml` 必须包含所需的 `[musubi.publication]` 绑定，以及账户和 Taira 网络配置。仅打包一个 workspace member：

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

操作日志和种子输入边界持久化后，使用 `--detach` 返回。使用 `publish --resume <operation-id> --config client.toml` 继续持久化的操作。范围较窄的 `--recover <operation-id>` 路径只会为未受改动的输入前日志重建缺失且不可变的 sidecar。发布没有 `--dry-run` 或通用公共上传后备路径；请运行 `package --list` 和 `package` 进行本地预检。

## 登记查询和生命周期 {#registry-queries-and-lifecycle}

搜索和检查使用相同的 Taira 客户端配置的最终注册表:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  search swap --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  info dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  versions dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  alias resolve swap --config client.toml
```

扬金排除了从新分辨率中不可改变的释放,而现有的精确锁仍然可复制.先阅读当前的扬金修改,然后提交比较和设置突变:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

使用 `unyank` 与相同的包装,版本和新阅读修订来逆转该状态. 包装所有权和维护角色控制发布,,元数据,和档案位置权限. 全球别名有自己的价格注册,重定位历史,和比较和设置修订;它们不是包装所有权的快捷方式.

## Iroha 表面 {#iroha-surfaces}

Musubi 使用了首次发布的 V1 说明和查询:

|表面| 用途                                                        |
| ---------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1`|绑定一个名字空间与其稳定的家庭数据空间.|
|`RegisterMusubiArchiveV1`|注册不可变的身份认证源档案承诺. |
|`AddMusubiArchiveLocationV1`|添加或更新已证明的 SoraFS 档案位置. |
|`PublishMusubiReleaseV1`|要求或更新一个包,并发布一个不可变的版本. |
|`SetMusubiReleaseYankV1`|进行比较并设置精确释放的拉动状态.|
|`InviteMusubiPackageMaintainerV1`|启动明确的包装角色邀请流. |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |登记或重定位一个全球化名. |
|`AssertMusubiReleaseDigestV1`|确立一个不变的释放摘要.|
|`FindMusubiExactPackageV1`|阅读一个精确的包装及其修订.|
|`FindMusubiExactReleaseV1`|阅读一个准确的释放快照.|
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |解决或列出已完成的释放候选人.|
|`FindMusubiArchiveLocationsV1`|阅读提供商支持的最终档案位置. |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |阅读当前的名目标或其不可变的历史.|

Torii 显示下面的应用程序路线家族 `/v1/musubi/*`. MCP 工具使用电流 `iroha.musubi.queries.*` 和 `iroha.musubi.instructions.*` 他们的名字. [Torii 端点](/zh-hans/reference/torii-endpoints.md) 和 [查询参考](/zh-hans/reference/queries.md) 为更广泛的 API 在地图上.
