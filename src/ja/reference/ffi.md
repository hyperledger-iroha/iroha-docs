---
translation_locale: ja
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# 外国関数インターフェース（FFI） {#foreign-function-interfaces-ffi}

`iroha_ffi` ソフトウェアパッケージは、Rust APIs から C ABI バインディングを生成するためのマクロとトレイトを提供します。これは、Iroha 型が FFI 境界を越える必要がある場合に使用されます。例えば、SDK バインディングやホスト統合によってです。

## なぜ FFI {#why-ffi}

関数はかなり抽象的な存在であり、ほとんどの言語は関数が何をすべきかについては同意していますが、関数がどのように表現されるかという方法は非常に異なります。さらに、Rust のようないくつかの言語では、関数を呼び出すことの結果や、それが許されていることも異なります。Rust の場合 APIs は別の言語または異なるホスト環境から呼び出される必要があり、Iroha は公平な競争環境を作るために外部関数インターフェース(FFI)を使用します。

現在使用されている主な標準はCアプリケーションバイナリインターフェースです。それは簡単で、広く利用可能であり、安定しています。原則として、すべてを手動で行うことも可能ですが、Iroha は既存の Rust API から FFI 準拠の関数を生成する`iroha_ffi`ソフトウェアパッケージを提供しています。

もちろん、あなた自身の方法でこれを行うこともできます。 `iroha_ffi` ソフトウェアパッケージは、結局自分で生成する必要があるコードを単に生成するだけです。 必要な繰り返しのテンプレートコードを書くにはかなりの 勤勉さと規律。すべての機能の技術的呼び出しにおいて FFI 境界は `unsafe` 未定義の動作を引き起こす可能性があります。私たちがそれを解決する方法は、堅牢なものを使用することに関わっています `repr(C)` 種類。

::: info

唯一の例外はポインタです。ヌルチェックや有効性はグローバルに強制できないため、未加工のポインタ（これまで通り）は特別な場合にのみ使用されます。私たちは Iroha データモデルのほぼすべてのオブジェクトのインスタンスにソフトウェアアダプタを提供していることを考えると、生のポインタを使用する必要はまったくないはずです。

:::

## 例 {#example}

これはバインディングを生成する例です。

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

上の例は、`DaysSinceEquinox` が不透明ポインタとして表される次のバインディングを生成します:

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI バインディング生成 {#ffi-binding-generation}

`iroha_ffi` ソフトウェアパッケージは、FFI 経由で呼び出すことができる関数を生成するために使用されます。`Rust` の構造体とメソッドが与えられると、リンク境界を跨ぐために必要な `unsafe` コードを生成します。

Rust タイプは、`FfiType::into_ffi`を使用して FFI の境界を越えることができる堅牢な`repr(C)`タイプに変換されます。逆もまた同じです：FFI`ReprC`タイプは、`FfiType::try_from_ffi`を介して`Rust`タイプに変換されます。

::: warning

逆の変換は誤りやすく、未定義の動作を引き起こす可能性があることに注意してください。最も明らかな間違いを避けるために最善を尽くすことはできますが、プログラムの正確性を保証するのはあなた自身です。

:::

バインディング生成を可能にする主な特性は、`ReprC`、`FfiType`、および`FfiConvert`です。

|特性|説明|
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ReprC`      |この特性は、C ABI に準拠する堅牢な型を表しています。この型は FFI の境界を安全にまたぐことができます。|
|`FfiType`|このトレイトは、与えられた `Rust` 型に対応する `ReprC` 型を定義します。定義された `ReprC` 型は、生成された FFI 関数の API において `Rust` 型の代わりに使用されます。|
| `FfiConvert` | このトレイトは2つのメソッドを定義します `into_ffi` そして `try_from_ffi` その変換を実行するために使用される `Rust` 〜からまたは〜へタイプする `ReprC` タイプ。                                |

不透明ポインタ型を除き、FFI の所有権の移転はないことに注意してください。所有権を持つ他のすべての型、例えば `Vec<T>` はクローンされます。

### 名前のマングリング {#name-mangling}

生成された FFI オブジェクトの名前での二重アンダースコアの使用に注意してください:

- `StructName`構造体で定義された`inherent_fn`メソッドの場合、FFI の名前は`StructName__inherent_fn`になります。
- `StructName`構造体の`TraitName`トレイトの`MethodName`メソッドに対して、FFI の名前は`StructName__TraitName__MethodName`になります。
- `StructName` 構造体の `field_name` フィールドを設定するための FFI 関数名は `StructName__set_field_name` です。
- `StructName` 構造体の `field_name` フィールドを取得するための FFI 関数名は `StructName__field_name` です。
- `StructName`構造体のミュータブルな`field_name`フィールドを取得するには、FFI 関数の名前は`StrucuName__field_name_mut`となります。
- 独立型の`module_name::fn_name`の場合、FFI の名前は`module_name::__fn_name`になります。
- 汎用ではなく、その実装を FFI で共有することを許す特性については（下記の `Clone` を参照）、FFI の名前は `module_name::__clone` になります。

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
