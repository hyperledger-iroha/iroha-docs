---
translation_locale: az
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Xarici funksiya interfeysləri (FFI) {#foreign-function-interfaces-ffi}

İndiki `iroha_ffi` qutu C istehsalı üçün makro və xüsusiyyətlər təmin edir ABI bağlamalar Rust APIs. Burada istifadə olunur: Iroha növləri keçmək lazımdır FFI sərhədləri, məsələn SDK bağlamalar və ya ev sahibi inteqrasiyaları.

## Niyə FFI {#why-ffi}

Bir funksiya olduqca abstrakt bir varlıqdır və əksər dillər bir funksiyanın nə etməli olduğu barədə razılaşsa da, Əməllərin təmsil edilməsi üsulları çox fərqlidir. Rust, Bir funksiyanı çağırmanın nəticələri və onun etməyə icazə verilən şeylər də fərqlidir. Rust APIs başqa dildən və ya fərqli bir ev sahibliyi mühitindən zəng edilməsinə ehtiyac Iroha xarici funksiya interfeysindən istifadə edir (FFI) oyun sahələrini bərabərləşdirmək üçün.

Bu gün istifadə olunan əsas standart C tətbiqi ikitərəfli interfeysidir. Bu sadədir, geniş yayılmış və sabitdir. Əsasən hər şeyi əl ilə edə bilərsiniz, lakin Iroha mövcud olan Rust API funksiyasından FFI uyğun funksiyaları istehsal etmək üçün `iroha_ffi` qabını təmin edir.

Təbii ki, bunu öz yolunuzla edə bilərsiniz. `iroha_ffi` qutusu hər halda istehsal etməli olduğunuz kod yaratır. Lazım olan qaynağı yazmaq kifayət qədər səylər və intizam tələb edir. FFI sərhədindən keçən hər bir funksiya çağırışı qeyri-müəyyən davranışlara səbəb ola biləcək `unsafe`dir. Onu həll etməyi bacardığımız üsul güclü `repr(C)` növlərindən istifadə etmək ətrafında fırlanır.

::: info

Null yoxlaması və etibarlılığı qlobal səviyyədə tətbiq edilə bilməz, buna görə də xam göstərici (hər zaman olduğu kimi) yalnız istisna hallarda istifadə olunur. Iroha məlumat modelindəki obyektin demək olar ki, hər bir nümunəsinin ətrafında qovluqlar təqdim etdiyimizi nəzərə alaraq, ümumiyyətlə xam göstəricilərdən istifadə etmək lazım deyil.

:::

## Misal {#example}

Burada bir bağlanma yaratma nümunəsi var:

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

Yuxarıda göstərilən nümunədə `DaysSinceEquinox` ilə aşağıdakı bağlanma əmələ gətirəcəkdir.

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI Bağlayıcı nəsil {#ffi-binding-generation}

FFI vasitəsilə zəng edilə bilən funksiyaları yaratmaq üçün `iroha_ffi` qutusu istifadə olunur. `Rust` strukturlarını və üsullarını nəzərə alaraq, birləşmə sərhədini keçmək üçün lazım olan `unsafe` kodunu yaradırlar.

A Rust növü güclü birinə çevrilmişdir `repr(C)` növü keçə bilən FFI ilə sərhəd `FfiType::into_ffi`. Bu da əksinə gedir: FFI `ReprC` növü bir `Rust` vasitəsi ilə `FfiType::try_from_ffi`.

::: warning

Qeyd edək ki, əks dönüşüm səhvə yol aça bilər və müəyyən edilməmiş davranışlara səbəb ola bilər. Ən açıq səhvlərdən qaçınmaq üçün əlimizdən gələni etsək də, proqramın düzgün olduğundan əmin olmalısınız.

:::

Bağlanma istehsalını təmin edən əsas xüsusiyyətlər `ReprC`, `FfiType` və `FfiConvert`dir.

|Xüsusiyyət |Təsviri|
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|`ReprC` | Bu xüsusiyyət C-yə uyğun güclü bir tipdir. ABI. Tip təhlükəsiz bir şəkildə bölüşdürülə bilər FFI sərhədlər.                                                                |
|`FfiType` |Bu xüsusiyyət müəyyən edilmiş `Rust` tipli üçün müvafiq `ReprC` növünü təyin edir. Təsdiqlənmiş `ReprC` tipi istehsal olunan FFI funksiyasının API ində `Rust` tipin yerinə istifadə olunur. |
|`FfiConvert` |Bu xüsusiyyət `into_ffi` və `try_from_ffi` növünün `Rust` tipinə və ya `ReprC` tipinə çevrilməsi üçün istifadə olunan iki üsul müəyyənləşdirir. |

Qeyd edək ki, FFI üzərində mülkiyyətin ötürülməsi qeyri-müəyyən göstərici növləri istisna olmaqla yoxdur. `Vec<T>` kimi mülkiyyəti olan bütün digər növlər klonlaşdırılır.

### Adı Mangling {#name-mangling}

FFI obyektlərinin yaradılmış adlarında ikiqat altyazıların istifadəsinə diqqət yetirin:

- `StructName` strukturunda müəyyən edilmiş `inherent_fn` metodu üçün FFI adı `StructName__inherent_fn` olacaqdır.
- `StructName` strukturundakı `TraitName` xüsusiyyətindən olan `MethodName` metodu üçün FFI adı `StructNameTraitNameMethodName` olacaq.
- `StructName` strukturunda `field_name` sahəsinin təyin edilməsi üçün FFI funksiyasının adı `StructName__set_field_name` olacaq.
- `StructName` strukturunda `field_name` sahəsini əldə etmək üçün FFI funksiyasının adı `StructName__field_name` olacaqdır.
- `StructName` strukturunda dəyişən `field_name` sahəsini əldə etmək üçün, FFI funksiyasının adı `StrucuName__field_name_mut` olacaq.
- Müstəqil `module_name::fn_name` üçün FFI adı `module_name::__fn_name` olacaq.
- Ümumi olmayan və tətbiqini bölüşməyə imkan verən xüsusiyyətlər üçün FFI (aşağıda `Clone` bax) FFI adı `module_name::__clone` olacaq.

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
