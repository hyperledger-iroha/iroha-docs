---
translation_locale: az
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Xarici Funksiya İnterfeysləri (FFI) {#foreign-function-interfaces-ffi}

`iroha_ffi` proqram paketində Rust APIs-dən C ABI bağlamalarını yaratmaq üçün makrolar və xüsusiyyətlər təqdim olunur. Bu, Iroha tiplərinin FFI sərhədini keçməsi lazım olduqda istifadə olunur, məsələn, SDK bağlamalar və ya host inteqrasiyaları ilə.

## Niyə FFI {#why-ffi}

Funksiya kifayət qədər abstrakt bir varlıqdır və əksər dillər funksiyanın nə etməli olduğunu razılaşsalar da, funksiyaların necə təmsil olunması çox fərqlidir. Üstəlik, bəzi dillərdə, məsələn Rust, bir funksiyanı çağırmağın nəticələri və onun etməyə icazə verildiyi şeylər də fərqlidir. Rust zaman APIs başqa bir dildən və ya fərqli bir host mühitindən çağırılmalıdır, Iroha isə oyun sahəsini bərabərləşdirmək üçün xarici funksiyalar interfeysindən (FFI) istifadə edir.

Bu gün istifadə olunan əsas standart C tətbiq binar interfeysidir. O, sadədir, geniş mövcuddur və sabitdir. Prinsipcə, hər şeyi əl ilə edə bilərsiniz, amma Iroha mövcud Rust API əsasından FFI-uyğun funksiyalar yaratmaq üçün `iroha_ffi` proqram paketini təqdim edir.

Əlbəttə, bunu öz üsulunuzla edə bilərsiniz. `iroha_ffi` proqram paketi sadəcə olaraq, sizə hər halda yaratmalı olacağınız kodu yaradır. Lazımi təkrar şablon kodunu yazmaq kifayət qədər diqqət və intizam tələb edir. Hər bir funksiyanın texniki çağırışı FFI səddindən kənara çıxmaq potensialı ilə `unsafe` olur və bu, təyin olunmamış davranışa səbəb ola bilər. Bizim bunu həll etmə üsulumuz, möhkəm `repr(C)` növlərindən istifadə etməyi əhatə edir.

::: info

Yeganə istisna göstəricilərdir. Boşluq yoxlaması və etibarlılıq qlobal olaraq tətbiq oluna bilməz, buna görə də xam göstəricilər (həmişə olduğu kimi) yalnız istisna hallarda istifadə olunur. Məlumdur ki, biz Iroha məlumat modeli daxilində obyektin demək olar ki, hər bir nümunəsi üçün proqram təminatı adapterləri təmin edirik, ona görə də sizə xam göstəricilərdən istifadə etmək ümumiyyətlə lazım olmamalıdır.

:::

## Nümunə {#example}

Budur bir bağlılıq yaratma nümunəsi:

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

Yuxarıdakı nümunə `DaysSinceEquinox` şəffaf olmayan göstərici kimi təmsil olunmuş aşağıdakı bağlamanı yaradacaq:

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI Bağlama Yaradılması {#ffi-binding-generation}

`iroha_ffi` proqram paketi FFI vasitəsilə çağırıla bilən funksiyaları yaratmaq üçün istifadə olunur. Verilmiş `Rust` strukturlar və metodlar, keçid sərhədini keçmək üçün ehtiyac duyduğunuz `unsafe` kodunu yaradır.

Rust tipi, `FfiType::into_ffi` ilə FFI sərhədini keçə bilən möhkəm `repr(C)` tipinə çevrilir. Bu əksinə də doğrudur: FFI `ReprC` tipi, `FfiType::try_from_ffi` vasitəsilə `Rust` tipinə çevrilir.

::: warning

Qeyd edin ki, əks çevirmə səhvlidir və müəyyən olunmamış davranışa səbəb ola bilər. Ən açıq səhvlərdən qaçmaq üçün əlimizdən gələni etsək də, proqramın düzgünlüyünü öz tərəfinizdə təmin etməlisiniz.

:::

Bağlama yaradılmasını mümkün edən əsas xüsusiyyətlər `ReprC`, `FfiType` və `FfiConvert`-dir.

|Xüsusiyyət|Təsvir|
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ReprC`      |Bu xüsusiyyət, C ABI-a uyğun möhkəm bir tipi təmsil edir. Bu tip FFI sərhədləri boyunca təhlükəsiz şəkildə paylaşa bilər.|
| `FfiType`    |Bu xüsusiyyət verilmiş `Rust` tipi üçün uyğun `ReprC` tipini müəyyən edir. Müəyyən edilmiş `ReprC` tipi yaradılmış FFI funksiyasının API hissəsində `Rust` tipinin yerinə istifadə olunur.|
| `FfiConvert` |Bu xüsusiyyət `Rust` tipini `ReprC` tipinə çevirmək və ya əksinə çevirmək üçün istifadə olunan iki metod `into_ffi` və `try_from_ffi` təyin edir.|

Qeyd edin ki, FFI üzərində mülkiyyət köçürülməsi şəffaf olmayan göstərici tiplərindən başqa yoxdur. Mülkiyyət daşıyan digər bütün tiplər, məsələn `Vec<T>`, surətlənir.

### Adın qarışdırılması {#name-mangling}

Yaradılmış FFI obyektlərinin adlarında ikiqat alt xətlərin istifadəsinə diqqət yetirin:

- `StructName` strukturu üzərində təyin edilmiş `inherent_fn` metodu üçün, FFI adı `StructName__inherent_fn` olardı.
- `StructName` strukturunda `TraitName` traitindən olan `MethodName` metodu üçün FFI adı `StructName__TraitName__MethodName` olardı.
- `StructName` struktunda `field_name` sahəsini təyin etmək üçün FFI funksiyasının adı `StructName__set_field_name` olardı.
- `StructName` struktunda `field_name` sahəsini əldə etmək üçün FFI funksiyasının adı `StructName__field_name` olardı.
- `StructName` strukturunda dəyişdirilə bilən `field_name` sahəsini əldə etmək üçün FFI funksiyasının adı `StrucuName__field_name_mut` olardı.
- Müstəqil `module_name::fn_name` üçün, FFI adı `module_name::__fn_name` olardı.
- Ümumi olmayan və onların implementasiyasının FFI daxilində paylaşılmasına imkan verən xüsusiyyətlər üçün (aşağıda bax `Clone`), FFI adı `module_name::__clone` olardı.

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
