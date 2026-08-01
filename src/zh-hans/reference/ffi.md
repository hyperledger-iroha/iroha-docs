---
translation_locale: zh-hans
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 外部函数接口 (FFI) {#foreign-function-interfaces-ffi}

`iroha_ffi`盒子提供了从 Rust APIs 中生成C ABI 结合的宏和特征.它用于 Iroha 类型需要跨越 FFI 边界时,例如通过 SDK 结合或主机集成.

## 为什么 FFI {#why-ffi}

函数是一个相当抽象的实体,虽然大多数语言都同意一个函数应该做什么,此外,在某些语言中,例如: Rust, 呼叫函数的后果和它被允许做的事情也不同. Rust APIs 需要从另一个语言或不同的接待环境中调用, Iroha 使用外部函数接口 (FFI) 为平衡竞争环境.

今天使用的主要标准是C应用程序二进制接口.它简单,广泛可用和稳定.原则上,你可以手动完成所有事情,但 Iroha 提供了`iroha_ffi` 箱来生成 FFI-合适的函数从现有的 Rust API.

当然,你可以按照自己的方式做到这一点. `iroha_ffi` 盒子只能生成你需要生成的代码.每个在 FFI 边界上的函数调用都是`unsafe`,可能导致未定义的行为.我们设法解决它的方法,围绕着使用强大的 `repr(C)`类型.

::: info

唯一的例外是指针.无效检查和有效性不能在全球范围内执行,因此原始指标 (如往常) 只应用于特殊情况下. 由于我们提供了几乎每一个对象的包装在 Iroha 数据模型中,你根本不需要使用原始指针.

:::

## 举例 {#example}

这是一个结合式生成的例子:

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

上面的示例将产生以下结合与 `DaysSinceEquinox`表示为不透明指标:

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI 结合性生成 {#ffi-binding-generation}

其他 `iroha_ffi` 盒子用于生成通过 FFI. 给出 `Rust` 结构和方法,它们产生了 `unsafe` 您需要的代码才能跨越链接界限.

一个 Rust 类型被转换为一个强大的 `repr(C)` 类型,可以通过 FFI 跨越`FfiType::into_ffi` 的边界.这也是相反的: FFI `ReprC` 类型通过 `FfiType::try_from_ffi` 转换为`Rust`.

::: warning

请注意,相反的转换是错误的,可能导致未定义的行为. 虽然我们可以尽最大努力避免最明显的错误, 你必须确保你的计划是正确的.

:::

允许结合生成的主要特征是 `ReprC`, `FfiType`和 `FfiConvert`.

|品质|描述|
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|`ReprC`|这种特征代表了一个符合C ABI 的强类型.该类型可以安全地跨越 FFI 边界进行共享. |
|`FfiType`|这个特征为给定的 `Rust`类型定义了相应的 `ReprC` 类型.在生成的 FFI 函数中的 API 中,使用已定义的`ReprC` 类型代替`Rust` 类型 .|
|`FfiConvert`|这一特征定义了两种方法 `into_ffi` 和 `try_from_ffi`,用于将 `Rust`类型转换为或从 `ReprC`类型. |

请注意,除了不透明的指标类型外,对 FFI 没有所有权转移.所有其他拥有所有权的类型,如 `Vec<T>`,都被克隆.

### 姓名Mangling {#name-mangling}

注意 FFI 对象的生成名称中使用双重凸点:

- 对于 `StructName`结构上定义的`inherent_fn`方法,FFI 名称将是`StructName__inherent_fn`.
- 为了 `MethodName` 这种方法 `TraitName` 中的特征 `StructName` 结构, FFI 这个名字是 `StructNameTraitNameMethodName`.
- 为设置 `field_name` 在该领域 `StructName` 结构, FFI 函数的名称将是 `StructName__set_field_name`.
- 为了得到 `field_name` 在该领域 `StructName` 结构, FFI 函数的名称将是 `StructName__field_name`.
- 为了在 `StructName`结构中获得可变的 `field_name` 字段,函数名称 FFI 将是 `StrucuName__field_name_mut`.
- 对于独立的 `module_name::fn_name`,FFI 名称将是 `module_name::__fn_name`.
- 对于非通用且允许在 FFI 中共享其实施的特征 (见下文`Clone`),FFI 名称将是 `module_name::__clone`.

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
