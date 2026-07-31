---
translation_locale: zh-hans
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 外部函数接口 (FFI) {#foreign-function-interfaces-ffi}

其他 `iroha_ffi` 箱子提供了生成C的宏和特征 ABI
结合 Rust APIs. 在 Iroha 需要跨越一个 FFI
边界,例如通过 SDK 结合或主机集成.

## 为什么? FFI {#why-ffi}

一个函数是一个相当抽象的实体,虽然大多数语言都同意
函数应该做什么,函数的表示方式是
另外,在某些语言中,如 Rust, 后果
要求一个函数和它可以做的事情也
在什么时候? Rust APIs 需要从另一个语言或
不同的宿主环境, Iroha 使用外部函数接口 (FFI)
为了平衡竞争环境.

今天使用的主要标准是C应用程序二进制接口.
基本上,你可以做
一切都是手动的,但 Iroha 提供了 `iroha_ffi` 产生的盒子
FFI-从现有功能中完成符合的函数 Rust API.

你当然可以按照自己的方式做. `iroha_ffi` 只是一个盒子
编写该代码,需要生成的代码.
需要一些勤奋和纪律.
每个函数调用 FFI 边界是 `unsafe` 具有潜力
我们所设法解决的方法,
转移到使用 **强** `repr(C)` 这些类型.

::: info

只有指标例外. 无效检查和有效性不能
在全球范围内实施,因此原始指标 (如往常) 仅用于特殊情况下
鉴于我们提供了几乎每个案例的包装
在 Iroha 您不需要使用原始指针
所有的东西.

:::

## 举个例子 {#example}

这是一个结合生成的例子:

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

上面的例子将产生以下结合:
`DaysSinceEquinox` 作为一个不透明的指标:

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI 结合的世代 {#ffi-binding-generation}

其他 `iroha_ffi` 用于生成可通过
FFI. 给出 `Rust` 结构和方法,它们产生 `unsafe` 这个代码
您需要跨越联系界限.

一个 Rust 机型将转换为强的 `repr(C)` 可以穿越的类型
FFI 边界 `FfiType::into_ffi`. 这样就会反转.
现在, FFI `ReprC` 类型转换为 `Rust` 通过类型
`FfiType::try_from_ffi`.

::: warning

注意相反的转换是错误的,可能导致未定义的
虽然我们可以尽最大努力避免最明显的
错误,你必须确保你的程序是正确的.

:::

The 允许结合生成的主要特征是 `ReprC`, `FfiType`, 并且
`FfiConvert`.

| 性格特征        | 描述                                                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ReprC`      | 这种特征代表着一个强大的类型,符合C ABI. 这种类型可以安全共享 FFI 边界                                                                |
| `FfiType`    | 这种特征定义了相应的 `ReprC` 给定的类型 `Rust` 定义的类型 `ReprC` 类型是代替 `Rust` 在 API 产生的 FFI 功能. |
| `FfiConvert` | 这种特征定义了两个方法 `into_ffi` 并且 `try_from_ffi` 用于转换 `Rust` 类型到或从 `ReprC` 类型.                                |

请注意,没有转让所有权 FFI 除了不透明的指针
所有其他类型,如 `Vec<T>`, 它们被克隆.

### 名字:马格林 {#name-mangling}

注意在生成的名称中使用双重突显 FFI 对象:

- 为了 `inherent_fn` 根据 `StructName` 结构, FFI
  这个名字是 `StructName__inherent_fn`.
- 为了 `MethodName` 通过该方法 `TraitName` 标志性
  `StructName` 结构, FFI 这个名字是
  `StructName__TraitName__MethodName`.
- 为设置 `field_name` 在该领域 `StructName` 结构, FFI
  函数名称将是 `StructName__set_field_name`.
- 为了得到 `field_name` 在该领域 `StructName` 结构, FFI
  函数名称将是 `StructName__field_name`.
- 为了得到可变的 `field_name` 在该领域 `StructName` 结构, FFI
  函数名称将是 `StrucuName__field_name_mut`.
- 对于独立人士来说 `module_name::fn_name`, 在 FFI 这个名字是
  `module_name::__fn_name`.
- 对于非通用的特征,
  在 FFI (见 `Clone` 在下面) FFI 这个名字是
  `module_name::__clone`.

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
