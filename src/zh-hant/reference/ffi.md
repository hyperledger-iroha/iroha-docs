---
translation_locale: zh-hant
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 外部函數接口 (FFI) {#foreign-function-interfaces-ffi}

其他國家 `iroha_ffi` 盒子提供生成C的宏和特征 ABI
由於 Rust APIs. 在使用的情況下 Iroha 需要跨越一個 FFI
限制,例如: SDK 結合或主機集成.

## 為什麼? FFI {#why-ffi}

函數是一個相當抽象的單體,
函數的表現方式是
在某些語言中, Rust, 造成的影響
該函數的呼叫,以及它可以做的事情
什麼時候會發生? Rust APIs 需要從另一種語言或
不同的宿主環境, Iroha 使用外部函數接口 (FFI)
這樣就能讓球場平衡.

這種標準是C應用二元接口.
基本上,您可以使用
這一切都是手動的, Iroha 提供了 `iroha_ffi` 產生的盒子
FFI-由現有系統中完成的符合性功能 Rust API.

您可以以自己的方式做這件事. `iroha_ffi` 只是一個盒子
寫出這個代碼,
需要大量的勤奮與規律.
每個函數的呼叫 FFI 邊界是 `unsafe` 具有潛力
我們如何解決這個問題,
在使用 **堅固的** `repr(C)` 這樣的人.

::: info

只有指针, 無效檢查和有效性不能被
這種指標 (如往常) 只有在特殊情況下使用.
我們提供包裹在幾乎每個案例
該物件的 Iroha 沒有使用原始指標,
沒有任何問題.

:::

## 舉例 {#example}

這裡是建立結合的例子:

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

這樣的例子會產生下列結合:
`DaysSinceEquinox` 呈現為不透明的指標:

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI 束的世代 {#ffi-binding-generation}

其他國家 `iroha_ffi` 該盒子用于生成可透過
FFI. 已提供 `Rust` 他們的方法, `unsafe` 這個代碼
您需要跨越聯繫界限.

其他國家 Rust 這種變化為強固的 `repr(C)` 這種可以穿越
FFI 邊界與 `FfiType::into_ffi`. 這樣的情況會逆轉,
這樣的情況: FFI `ReprC` 該類型轉換為 `Rust` 通過方式
`FfiType::try_from_ffi`.

::: warning

請注意,相反的轉換是錯誤的,
儘管我們能盡最大努力避免最明显的
你必須確保程式的正確性.

:::

The 能使結合生成的主要特征是 `ReprC`, `FfiType`, 及其他
`FfiConvert`.

| 性格特征        | 描述                                                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ReprC`      | 這種特征代表了符合C的強固型態 ABI. 該類型可以安全地分享到其他地區 FFI 沒有任何限制.                                                                |
| `FfiType`    | 這樣的特點定義了相應的 `ReprC` 特定型號 `Rust` 定義的類型 `ReprC` 該類型是取代 `Rust` 在 API 產生的 FFI 功能. |
| `FfiConvert` | 這個特點定義了兩種方法 `into_ffi` 及其他 `try_from_ffi` 轉換的方法, `Rust` 來自或向的類型 `ReprC` 這樣的.                                |

請注意, FFI 除了不透明的指標
其他所有持有所有權的類型, `Vec<T>`, 已被克隆.

### 姓名:Mangling {#name-mangling}

請注意在生成的名稱中使用雙重突顯. FFI 這些物件:

- 為了 `inherent_fn` 該方法在 `StructName` 其他國家 FFI
  這個名字是 `StructName__inherent_fn`.
- 為了 `MethodName` 該方法來自 `TraitName` 該區域的特征
  `StructName` 其他國家 FFI 這個名字是
  `StructName__TraitName__MethodName`.
- 來設定 `field_name` 在這個領域 `StructName` 其他國家 FFI
  函數名稱是 `StructName__set_field_name`.
- 獲得 `field_name` 在這個領域 `StructName` 其他國家 FFI
  函數名稱是 `StructName__field_name`.
- 為了獲得可變的 `field_name` 在這個領域 `StructName` 其他國家 FFI
  函數名稱是 `StrucuName__field_name_mut`.
- 沒有任何問題. `module_name::fn_name`, 這項政策 FFI 這個名字是
  `module_name::__fn_name`.
- 那些不一般的特點,
  在 FFI (參閱) `Clone` 在下面) FFI 這個名字是
  `module_name::__clone`.

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
