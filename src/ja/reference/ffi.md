---
translation_locale: ja
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 外部関数インターフェイス (FFI) {#foreign-function-interfaces-ffi}

労働組合 `iroha_ffi` Cを生成するためのマクロと特性を提供します. ABI 関連性 Rust APIs. これは, Iroha 型は, FFI 境界線は,例えば SDK 結合またはホスト統合.

## なぜ FFI {#why-ffi}

機能はかなり抽象的な個体であり,ほとんどの言語が関数が何をすべきかについて合意している一方で,関数は表現される方法は非常に異なります.さらに, Rust のようないくつかの言語では,関数を呼び出す結果とそれを行う許可があることも異なっています. Rust APIs を別の言語または異なるホスト環境から呼び出さなければならない場合,Iroha は,外関数インターフェース (FFI) を使って,競技場を平衡します.

シンプルで広く利用可能で安定している Cアプリケーションのバイナリーインターフェースです基本的には 手動で何でもできますが Iroha 提供する `iroha_ffi` 発生する箱 FFI- 既存の機能から Rust API.

`iroha_ffi` 箱は,とにかく生成する必要があるコードを生成するだけです.必要なボイラープレートを書き出すにはかなりの勤勉さと規律が必要です.FFI の境界を越えたすべての関数呼び出しは,未定義の行動を引き起こす可能性のある `unsafe` である.それを解決する方法は,堅固な `repr(C)` タイプを使用することで回転します.

::: 情報

唯一の例外は指針である.無効チェックと有効性は世界的に強制できないため,原始指針 (いつものように) は例外的な場合にのみ使用される.Iroha データモデルのオブジェクトのほぼすべてのインスタンスの 包装を提供しているので, 原始指数を全く使用する必要はありません.

:::

## 例 {#example}

結合を生成する例です.

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

上記例では,不透明な指数として表現された `DaysSinceEquinox` で以下の結合を生成します.

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI 拘束力のある世代 {#ffi-binding-generation}

`iroha_ffi` 箱は, FFI を通して呼び出すことができる関数を生成するために使用されます. `Rust` の構造と方法により,リンクの境界を越えるために必要な `unsafe` コードを生成します.

Rust 型は, `FfiType::into_ffi` で FFI の境界を横切ることができる堅固な `repr(C)` 型に変換される.これは逆の方向にも行われます: FFI `ReprC` 型は `FfiType::try_from_ffi` を介して `Rust` 型に転換されます.

::: 警告

逆の変換は誤りであり,未定義な行動を引き起こす可能性があることに注意してください. 最も明らかな間違いを避けるために最善を尽くすことができますが,あなたはあなたの端でプログラムの正確性を確保する必要があります.

:::

結合生成を可能にする主な特徴は, `ReprC`, `FfiType`,および `FfiConvert`.

|特徴|記述|
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|`ReprC`|この特徴は,C ABI に適合する強固なタイプを表します.このタイプは,安全に FFI の境界を越えて共有できます. |
|`FfiType`|この特性は,与えられた `Rust` 型に対して対応する `ReprC` タイプを定義します.生成された FFI 関数の API で,定義された `ReprC` 型は `Rust` 型の代わりに使用されます. |
|`FfiConvert`|この特徴は, `into_ffi` と `try_from_ffi` の2つの方法を定義し, `Rust` 型が `ReprC` 型に変換されるために使用されます.|

FFI に対する所有権譲渡は不透明なポインタタイプを除いてないことに注意してください. `Vec<T>`などの所有権を担う他のすべてのタイプがクローンされます.

### 名前 マングリング {#name-mangling}

FFI オブジェクトの生成された名前では,ダブルアンダースコアを使用することを注意してください.

- `StructName` 構造に定義された `inherent_fn` メソッドについては, FFI の名称は `StructName__inherent_fn` である.
- `StructName`構造の`TraitName`特征からなる `MethodName` 方法については, FFI の名称は `StructNameTraitNameMethodName` である.
- `StructName` 構造に `field_name` フィールドを設定するには,関数名 FFI は `StructName__set_field_name` である.
- `StructName` 構造の `field_name` フィールドを得るには,関数名 FFI は `StructName__field_name` です.
- `StructName`構造の変形性 `field_name` フィールドを取得するには,関数名 FFI は `StrucuName__field_name_mut` となります.
- フリースタンディング `module_name::fn_name` に対して, FFI の名称は `module_name::__fn_name` になります.
- FFI で実施を共有できる一般的な特徴ではない (下記 `Clone`を参照) に対して,FFI の名称は `module_name::__clone`です.

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
