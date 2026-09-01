---
translation_locale: zh-hans
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK 教程 {#sdk-tutorials}

这些页面总结了从主工作空间发送的 Iroha 3 客户端入口点,包括规范包名,安装路径和最小的起始点.

## 建议的命令 {#recommended-order}

1. [安装 Iroha 3](/zh-hans/get-started/install-iroha.md)
2. [启动 Iroha 3](/zh-hans/get-started/launch-iroha.md)
3. 选择一个 SDK:
   - [Rust](/zh-hans/guide/tutorials/rust.md)
   - [Python](/zh-hans/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/zh-hans/guide/tutorials/javascript.md)
   - [Kotlin,Android 和Java](/zh-hans/guide/tutorials/kotlin-java.md)
   - [Swift 和iOS](/zh-hans/guide/tutorials/swift.md)
4. 当您想要一个完整的客户端应用参考时,请查看[样本应用程序](/zh-hans/guide/tutorials/sample-apps.md).
5. 使用 [嵌入 Kaigi](/zh-hans/guide/tutorials/kaigi.md)当您想在自己的应用程序中添加支持钱包的音频/视频会议时.
6. 使用 [Musubi 包](/zh-hans/guide/tutorials/musubi.md),当您需要可重复使用的 Kotodama 源库,具有连锁链上注册表依赖.

## 样本 {#samples}

在上游工作空间中包含 JavaScript 的操作指南和 Swift/iOS样本项目.对于 Android,请从 Kotlin SDK 模块及其测试开始.

- [应用程序样本概述](/zh-hans/guide/tutorials/sample-apps.md)
- [嵌入 Kaigi 在 JavaScript 应用中](/zh-hans/guide/tutorials/kaigi.md)

## 真理的来源 {#source-of-truth}

所有 SDK 页面都来自当前的上游工作空间:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (对 Kotlin-第一个 Android 表面的Java镜子)
- `IrohaSwift`
- `crates/musubi`

如果有疑问,请在这些目录中更好地选择 README 和包装元数据;它们描述您正在构建的源修改.
