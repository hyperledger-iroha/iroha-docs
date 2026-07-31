---
translation_locale: zh-hans
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama 包装 {#musubi-kotodama-packages}

Musubi 是包装经理 Kotodama 它提供了
开发者为共享可编译的 Cargo 的工作流程 Kotodama 函数
保持包裹身份与 SORA 并且 Iroha 名称空间而不是
一个全球首次出现的名字表.

使用 Musubi 当您需要:

- 出版可重复使用 Kotodama 源库
- 确定确切的过渡源依赖性 `Musubi.lock`
- 从验证的依赖源重构 SoraFS 档案承诺
- 连接一个包名空间到dapp的合同别名
  名称空间
- 通过连锁注册表检查,发布,抽取或伪装包

## 包装名称 {#package-names}

可尼克式包装识别器使用:

```text
namespace/package
```

准确发布引用使用:

```text
namespace/package@version
```

没有领导者 `@` 在一个名字空间之前. `@` 隔离器保留
版本后音.

名称空间段与使用的后音相匹配 Kotodama 达普合同
姓名:

| 包装标识                | 相关合同别名形状 |
| ------------------------- | ---------------------------- |
| `universal/math`          | `router::universal`          |
| `dex.universal/swap-core` | `router::dex.universal`      |

名称空间有 `<dataspace>` 或 `<domain>.<dataspace>` 在一个
包装有dapp链接, Musubi 检查每个链接的合同别名
使用与包装相同的命名空间后音.

## 显然 {#manifest}

一个包始于 `Musubi.toml`:

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

依赖性可能使用准确版本,护理要求,倾斜
要求,野生卡等 `1.*`, 或比较列表,如
`>=1.0.0,<2.0.0`.

`Musubi.lock` 从连接链中记录选定的过渡图
每个锁定节点都存储了其可视化包调用,
要求, SoraFS 标签表,源档案哈希,字节计数,文件
数量,出口函数,确定性源档案计划,
简短的号在进入
锁文件.

## 地方工作流程 {#local-workflow}

从上游 Iroha 工作空间根,运行 Musubi 通过货物:

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

使用 `install --offline` 写一个未解决的锁文件为精确版本
没有查询一个节点的依赖性. `install --locked` 在 CI 在
拒绝使用过时的锁文件.

`build` 通过重写电话来将缓存的依赖源链接,如
`math::add()` 确定性内部 Kotodama 函数名称.它拒绝
调用了依赖性未出口的功能. Musubi v1 图书馆
只有功能:包含国家声明的依赖来源,
触发器,古托巴区块,常数或其他非函数合同项
它们被拒绝.

## 获取来源档案 {#fetching-source-archives}

Musubi 在解决或稍后的过程中可以找到缺失的依赖源
通过缓存子命令:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

现场门口采集使用一个或多个 SoraFS 网关提供商规格:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

提供商的有效载荷文件和网关提供商是相互排斥的
如果多个封闭的包裹缺失,
通过 `package=<dependency-alias>`,
`package=<namespace/package@version>`, `package=<namespace/package>`, 或
`manifest=<64-hex SoraFS manifest digest>`.

门口 `base-url` 并且 `privacy-url` 值必须使用 `https://` 默认的.
在本地测试网关可以使用 `http://localhost`, `http://127.0.0.1`, 或
`http://[::1]` 只有 `--gateway-allow-insecure-localhost`. 流量
代币是运行时间的凭证,并不是写入 `Musubi.lock`.

## 出版物 {#publishing}

`pack` 计算了确定性 BLAKE3-256 来源档案哈希加上
源字节和文件数量. `--car-out`, `--sorafs-manifest-out`, 或
`--source-plan-out` 这也构建了确定性. SoraFS
CAR 有效载荷, SoraFS 显明,以及 Musubi 源档案计划从同一个
源文件集.

在发布之前使用干燥运行:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

没有 `--dry-run`, `publish` 在下面写默认文物
`.musubi/dist/<namespace>/<name>/<version>/`, 选择上传
显现和有效载荷通过 Torii 现在 SoraFS 存储终端点
`--upload`, 记录生成的数据 SoraFS ,并提交
`PublishMusubiRelease` 通过配置 Iroha 客户.

发布的公告必须包括:

- 一个不空的法典源档案
- 确定性源档案计划
- 至少出口的 Kotodama 功能
- 没有选择被拖放的依赖性记录
- 如果存在,其合同别名与包装相匹配的dapp链接
  名称空间

## 登记问题和生命周期 {#registry-queries-and-lifecycle}

搜索和检查注册表,使用:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

宁隐藏了新分辨率的释放,但保留了现有的锁文件
可复制:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi 避免全球名字缩, `namespace/package` 在
在名称空间中发布必须得到授权
为此使用的相同的所有权或授权许可模式 Kotodama
编辑全球简称别名是单独的包
所有权: `SetMusubiShortAlias` 要求: `CanSetMusubiShortAlias`
目标包必须已经有至少一个活跃的
释放.

## Iroha 表面 {#iroha-surfaces}

Musubi 使用第一类 Iroha 指令和查询:

| 表面                      | 目的                                            |
| ---------------------------- | -------------------------------------------------- |
| `PublishMusubiRelease`       | 发布一个不可改变的包装版本.              |
| `YankMusubiRelease`          | 标记现有释放为被拉走.                |
| `SetMusubiShortAlias`        | 绑定一个全球简短的代号, |
| `AssertMusubiReleaseExists`  | 需要一个具体的包装版本才能存在.       |
| `FindMusubiReleaseByRef`     | 根据包装参考,请收取一份释放.        |
| `FindMusubiPackageVersions`  | 列出包邮身份的版本.                    |
| `FindMusubiPackageReleases`  | 列出一个包装身份证的发布总结.           |
| `SearchMusubiPackages`       | 按名字空间和文字搜索包总结.    |
| `FindMusubiShortAliasByName` | 解决一个精选的短名.                     |

Torii 揭示了 Musubi HTTP 下面的路线家族 `/v1/musubi/*`.
面向代理人 MCP 工具被曝光为 `iroha.musubi.*` 别名.
[Torii 终点](/zh-hans/reference/torii-endpoints.md) 并且
[查询参考](/zh-hans/reference/queries.md) 对于更广泛的 API 在地图上.
