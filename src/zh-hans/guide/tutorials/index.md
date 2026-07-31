---
translation_locale: zh-hans
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK 教程 {#sdk-tutorials}

这些页面总结了 Iroha 3 客户从主机运输的入口点
工作空间,包括标准包名称,安装路径和最小值
起点.

## 建议的条例 {#recommended-order}

1. [安装 Iroha 3](/zh-hans/get-started/install-iroha.md)
2. [发射 Iroha 3](/zh-hans/get-started/launch-iroha.md)
3. 选择一个 SDK:
   - [Rust](/zh-hans/guide/tutorials/rust.md)
   - [Python](/zh-hans/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/zh-hans/guide/tutorials/javascript.md)
   - [Kotlin, Android, 和Java](/zh-hans/guide/tutorials/kotlin-java.md)
   - [Swift 和iOS](/zh-hans/guide/tutorials/swift.md)
4. 审查 [样本应用程序](/zh-hans/guide/tutorials/sample-apps.md) 当你想要一个
   完整的客户申请参考.
5. 使用 [嵌入式 Kaigi](/zh-hans/guide/tutorials/kaigi.md) 当你想添加时
   在您自己的应用程序中进行支持钱包的音频/视频会议.
6. 使用 [Musubi 包装](/zh-hans/guide/tutorials/musubi.md) 当您需要重复使用时
   Kotodama 链上注册表依赖的源库.

## 样本 {#samples}

上游工作空间包含 JavaScript 配方和 Swift/iOS样本
为项目. Android, 首先, Kotlin SDK 模块及其测试.

- [应用程序样本概述](/zh-hans/guide/tutorials/sample-apps.md)
- [嵌入式 Kaigi 在一个 JavaScript 应用程序](/zh-hans/guide/tutorials/kaigi.md)

## 真理的来源 {#source-of-truth}

所有的 SDK 下面的页面来自当前上游工作空间:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (Java镜子的 Kotlin- 首先 Android 表面)
- `IrohaSwift`
- `crates/musubi`

在怀疑的时候, README 在这些目录中包含的包装元数据;
它们描述了你正在构建的源改.
