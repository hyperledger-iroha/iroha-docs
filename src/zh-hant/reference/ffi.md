---
translation_locale: zh-hant
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 外部函式介面 (FFI) {#foreign-function-interfaces-ffi}

`iroha_ffi`盒子提供了從 Rust APIs 中生成C ABI 結合的宏和特徵.它用於 Iroha 型別需要跨越 FFI 邊界時,例如透過 SDK 結合或主機整合.

## 為什麼 FFI {#why-ffi}

函式是一個相當抽象的實體,雖然大多數語言都同意一個函式應該做什麼,此外,在某些語言中,例如: Rust, 呼叫函式的後果和它被允許做的事情也不同. Rust APIs 需要從另一個語言或不同的接待環境中呼叫, Iroha 使用外部函式介面 (FFI) 為平衡競爭環境.

今天使用的主要標準是C應用程式二進位制介面.它簡單,廣泛可用和穩定.原則上,你可以手動完成所有事情,但 Iroha 提供了`iroha_ffi` crate來生成 FFI-合適的函式從現有的 Rust API.

當然，您也可以依自己的方式實作。`iroha_ffi` crate 只會產生無論如何都得撰寫的程式碼。手動撰寫必要的樣板程式碼需要相當程度的謹慎與自律。跨越 FFI 邊界的每次函式呼叫都是 `unsafe`，可能造成未定義行為。我們藉由使用**穩健的** `repr(C)` 型別解決了這個問題。

::: info

唯一的例外是指標.無效檢查和有效性不能在全球範圍內執行,因此原始指標 (如往常) 只應用於特殊情況下. 由於我們提供了幾乎每一個物件的封裝器在 Iroha 資料模型中,你根本不需要使用原始指標.

:::

## 舉例 {#example}

這是一個結合式生成的例子:

```rust
#[derive(FfiType)]
struct DaysSinceEquinox(u32);

#[ffi_export]
impl DaysSinceEquinox {
    pub fn update_value(&mut self, a: &u8) {
        self.0 = *a as u32;
    }
}
```

上面的示例將產生以下結合與 `DaysSinceEquinox`表示為不透明指標:

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI 結合性生成 {#ffi-binding-generation}

其他 `iroha_ffi` 盒子用於生成透過 FFI. 給出 `Rust` 結構和方法,它們產生了 `unsafe` 您需要的程式碼才能跨越連結界限.

一個 Rust 型別被轉換為一個強大的 `repr(C)` 型別,可以透過 FFI 跨越`FfiType::into_ffi` 的邊界.這也是相反的: FFI `ReprC` 型別透過 `FfiType::try_from_ffi` 轉換為`Rust`.

::: warning

請注意,相反的轉換是錯誤的,可能導致未定義的行為. 雖然我們可以盡最大努力避免最明顯的錯誤, 你必須確保你的計劃是正確的.

:::

允許結合生成的主要特徵是 `ReprC`, `FfiType`和 `FfiConvert`.

|品質|描述|
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|`ReprC`|這種特徵代表了一個符合C ABI 的強型別.該型別可以安全地跨越 FFI 邊界進行共享. |
|`FfiType`|這個特徵為給定的 `Rust`型別定義了相應的 `ReprC` 型別.在生成的 FFI 函式中的 API 中,使用已定義的`ReprC` 型別代替`Rust` 型別 .|
|`FfiConvert`|這一特徵定義了兩種方法 `into_ffi` 和 `try_from_ffi`,用於將 `Rust`型別轉換為或從 `ReprC`型別. |

請注意,除了不透明的指標型別外,對 FFI 沒有所有權轉移.所有其他擁有所有權的型別,如 `Vec<T>`,都被克隆.

### 名稱修飾 {#name-mangling}

注意 FFI 物件的生成名稱中使用雙重凸點:

- 對於 `StructName`結構上定義的`inherent_fn`方法,FFI 名稱將是`StructName__inherent_fn`.
- 為了 `MethodName` 這種方法 `TraitName` 中的特徵 `StructName` 結構, FFI 這個名字是 `StructName__TraitName__MethodName`.
- 為設定 `field_name` 在該領域 `StructName` 結構, FFI 函式的名稱將是 `StructName__set_field_name`.
- 為了得到 `field_name` 在該領域 `StructName` 結構, FFI 函式的名稱將是 `StructName__field_name`.
- 為了在 `StructName`結構中獲得可變的 `field_name` 欄位,函式名稱 FFI 將是 `StrucuName__field_name_mut`.
- 對於獨立的 `module_name::fn_name`,FFI 名稱將是 `module_name::__fn_name`.
- 對於非通用且允許在 FFI 中共享其實施的特徵 (見下文`Clone`),FFI 名稱將是 `module_name::__clone`.

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
