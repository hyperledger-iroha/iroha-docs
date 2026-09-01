---
translation_locale: zh-hant
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK 教程 {#sdk-tutorials}

這些頁面總結了從主工作空間傳送的 Iroha 3 客戶端入口點,包括規範包名,安裝路徑和最小的起始點.

## 建議的命令 {#recommended-order}

1. [安裝 Iroha 3](/zh-hant/get-started/install-iroha.md)
2. [啟動 Iroha 3](/zh-hant/get-started/launch-iroha.md)
3. 選擇一個 SDK:
   - [Rust](/zh-hant/guide/tutorials/rust.md)
   - [Python](/zh-hant/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/zh-hant/guide/tutorials/javascript.md)
   - [Kotlin,Android 和Java](/zh-hant/guide/tutorials/kotlin-java.md)
   - [Swift 和iOS](/zh-hant/guide/tutorials/swift.md)
4. 當您想要一個完整的客戶端應用參考時,請檢視[樣本應用程式](/zh-hant/guide/tutorials/sample-apps.md).
5. 使用 [嵌入 Kaigi](/zh-hant/guide/tutorials/kaigi.md)當您想在自己的應用程式中新增支援錢包的音訊/視訊會議時.
6. 使用 [Musubi 包](/zh-hant/guide/tutorials/musubi.md),當您需要可重複使用的 Kotodama 源庫,具有連鎖鏈上登錄檔依賴.

## 樣本 {#samples}

在上游工作空間中包含 JavaScript 的操作指南和 Swift/iOS樣本專案.對於 Android,請從 Kotlin SDK 模組及其測試開始.

- [應用程式樣本概述](/zh-hant/guide/tutorials/sample-apps.md)
- [嵌入 Kaigi 在 JavaScript 應用中](/zh-hant/guide/tutorials/kaigi.md)

## 真理的來源 {#source-of-truth}

所有 SDK 頁面都來自當前的上游工作空間:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (對 Kotlin-第一個 Android 表面的Java鏡子)
- `IrohaSwift`
- `crates/musubi`

如果有疑問,請在這些目錄中更好地選擇 README 和包裝後設資料;它們描述您正在構建的源修改.
