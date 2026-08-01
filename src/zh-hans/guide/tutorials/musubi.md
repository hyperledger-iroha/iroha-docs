---
translation_locale: zh-hans
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama 包装 {#musubi-kotodama-packages}

Musubi 是 Kotodama 源包的包管理器. 它为开发人员提供了类似 Cargo 的工作流程,可以共享可组合的 Kotodama 函数,同时将包裹身份与 SORA 和 Iroha 名字空间联系在一起,而不是全球首次出现的名字表.

使用 Musubi 当需要:

- 出版可重复使用的源库 Kotodama
- 在 `Musubi.lock` 中确定确切的过渡源依赖性
- 从验证的 SoraFS 档案承诺中重新构建依赖来源
- 将包名空间连接到同一名区中的dapp合同别名
- 通过连锁注册表检查,发布,抽取或名包

## 包装名称 {#package-names}

可尼克式包装识别器使用:

```text
namespace/package
```

准确释放引用使用:

```text
namespace/package@version
```

名称空间前没有首页 `@`. `@`分区为版本后尾保留.

名称空间段与 Kotodama dapp合同别名所使用的后相匹配:

|包装标识|相关合同别名形状|
| ------------------------- | ---------------------------- |
|`universal/math`|`router::universal`|
|`dex.universal/swap-core`|`router::dex.universal`|

名称空间要么具有 `<dataspace>`或`<domain>.<dataspace>`的形式.当一个包装有dapp链接时, Musubi 检查每个链接的合同别名都使用与包装相同的命名空间后音.

## 显现 {#manifest}

一个包装以 `Musubi.toml`开始:

```toml
[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"

[exports]
functions = ["quote"]

[dapp]
namespace = "dex.universal"
contracts = ["router::dex.universal"]
```

依赖性可以使用精确版本,护理要求,点要求,像 `1.*`这样的野生卡或比较列表,如 `>=1.0.0,<2.0.0`.

`Musubi.lock`将从链上登记中记录选定的过渡图.每个锁定节点都存储了其常规包,所选的要求,SoraFS 表格消化,源档案哈希,字节计数,文件计数,出口函数,确定性源档案计划和依赖姓氏.在进入锁文件之前解决短名字.

## 地方工作流程 {#local-workflow}

从上游 Iroha 工作空间根,运行 Musubi 通过 Cargo:

```bash
cargo run -p musubi -- init --namespace dex.universal --name swap-core --dapp
cargo run -p musubi -- add std.universal/math --version '^1.0.0' --alias math
cargo run -p musubi -- install --config client.toml
cargo run -p musubi -- build src/lib.ko --manifest-out target/lib.contract.json
cargo run -p musubi -- pack \
  --car-out source.car \
  --sorafs-manifest-out manifest.norito \
  --source-plan-out source-plan.norito
```

使用 `install --offline` 来写一个未解决的锁文件,不需要查询节点.在 CI 中使用 `install --locked` 拒绝过时的锁文件.

`build`通过重写`math::add()`等调用到确定性内部 Kotodama 函数名称来将缓存的依赖源链接.它拒绝对该依赖未出口的函数的调用.Musubi v1图书馆仅具有功能:包含状态声明,触发器, kotoba 区块,常量或其他非功能合同项的依赖来源被拒绝.

## 获取来源档案 {#fetching-source-archives}

Musubi 可以通过缓存子命令在解决或稍后搜索缺失的依赖源:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

现场网关采集使用一个或多个 SoraFS 网关供应商规格:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

提供商的有效载荷文件和网关供应商对一个接收操作相互排斥.如果缺少多个锁定包,请用 `package=<dependency-alias>`,`package=<namespace/package@version>`, `package=<namespace/package>`或 `manifest=<64-hex SoraFS manifest digest>`来查询每个网关供應商.

门口 `base-url` 和 `privacy-url` 值必须使用 `https://` 默认情况下,本地测试网关可以使用 `http://localhost`, `http://127.0.0.1`, 或 `http://[::1]` 只有 `--gateway-allow-insecure-localhost`. 流通令牌是运行时间凭证,并非写入 `Musubi.lock`.

## 出版物 {#publishing}

`pack`计算了确定性的 BLAKE3-256 源档案哈希加上源字节和文件计数.当 `--car-out`, `--sorafs-manifest-out`或 `--source-plan-out`是在提供时,它还从同一源文件集中构建了确定性的 SoraFS CAR 实用载荷, SoraFS 表格和 Musubi 源档案计划.

在发布之前使用干燥运行:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

没有 `--dry-run`, `publish` 将默认的文物写在 `.musubi/dist/<namespace>/<name>/<version>/`, 选择性上传表格和有效载荷 Torii 没有什么. SoraFS 存储终端点 `--upload`, 记录生成的数据 SoraFS 子,并提交 `PublishMusubiRelease` 通过配置的 Iroha 客户.

发布的公告必须包括:

- 一个不空的法典源档案
- 一个确定性源档案计划
- 至少一个出口的 Kotodama 函数
- 没有选择被拖放的依赖性记录
- 如果存在,其合同别名与包装名称空间相匹配的dapp链接

## 登记问题和生命周期 {#registry-queries-and-lifecycle}

搜索和检查注册表,使用:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

扬金隐藏了新的分辨率的释放,但保持现有锁文件可复制:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi 通过将 `namespace/package` 作为规范包名来避免全球名称缩.在一个命名空间中发布必须由相同的所有权或授权许可模型授权使用该 Kotodama dapp名称空间.`SetMusubiShortAlias`需要`CanSetMusubiShortAlias`的许可,目标包必须已经有至少一个活跃的发行.

## Iroha 表面 {#iroha-surfaces}

Musubi 使用第一类 Iroha 说明和查询:

|表面|目的|
| ---------------------------- | -------------------------------------------------- |
|`PublishMusubiRelease`|发布一个不可变的包装版本.|
|`YankMusubiRelease`|标记现有释放为被拉走的.|
|`SetMusubiShortAlias`|绑定一个全球简短代号到一个包邮身份证.|
|`AssertMusubiReleaseExists`|需要一个具体的包装版本才能存在.|
|`FindMusubiReleaseByRef`|根据具体的包装引用,请收取一个释放.|
|`FindMusubiPackageVersions`|列出包 ID 的版本. |
|`FindMusubiPackageReleases`|列出一个包邮身份的发布总结. |
|`SearchMusubiPackages`|按名字空间和文字搜索包总结. |
|`FindMusubiShortAliasByName`|解决一个简短的姓氏.|

Torii 揭示了 Musubi HTTP 下面的路线家族 `/v1/musubi/`. 面向代理人 MCP 工具被曝光为 `iroha.musubi.` 其他名字. [Torii 终点](/zh-hans/reference/torii-endpoints.md) 和 [查询参考](/zh-hans/reference/queries.md) 为更广泛的 API 在地图上.
