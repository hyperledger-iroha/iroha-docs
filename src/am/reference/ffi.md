---
translation_locale: am
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የውጭ ተግባራት በይነገጽ (FFI) {#foreign-function-interfaces-ffi}

የ `iroha_ffi` ሳጥን ከ Rust APIs C ABI ትስስር ለማመንጨት ማክሮዎችን እና ባህሪያትን ያቀርባል ። የ Iroha ዓይነቶች FFI ድንበር ማቋረጥ በሚያስፈልጋቸው ጊዜ ጥቅም ላይ ይውላል ፣ ለምሳሌ በ SDK ትስስር ወይም በአስተናጋጅ ውህደቶች።

## ለምን FFI {#why-ffi}

አንድ ተግባር በአንጻራዊነት ረቂቅ አካል ነው ፣ እና አብዛኛዎቹ ቋንቋዎች አንድ ተግባር ምን ማድረግ እንዳለበት ቢስማሙም ፣ ተግባራት የሚወከሉበት መንገድ በጣም የተለየ ነው። ከዚህም በላይ እንደ Rust ባሉ አንዳንድ ቋንቋዎች አንድን ተግባር መደወል የሚያስከትለው ውጤት እና ማድረግ የሚፈቀድላቸው ነገሮችም የተለያዩ ናቸው። Rust APIs ከሌላ ቋንቋ ወይም ከሌላ አስተናጋጅ አካባቢ ለመደወል ሲያስፈልግ፣ Iroha የጨዋታውን ሁኔታ ለማስተካከል የውጭ ተግባር በይነገጽ (FFI) ይጠቀማል.

በዛሬው ጊዜ ጥቅም ላይ የሚውለው ዋነኛው መስፈርት የሲ ትግበራ ሁለትዮሽ በይነገጽ ነው ። ቀላል ፣ በሰፊው የሚገኝ እና የተረጋጋ ነው። በመርህ ደረጃ ሁሉንም ነገር በእጅ ማድረግ ይችላሉ ፣ ግን Iroha ከነበረው Rust API ውጭ FFI - ተኳሃኝ ተግባራትን ለማመንጨት የ `iroha_ffi` ሳጥን ያቀርባል ።

እርግጥ ነው፣ ይህን ማድረግ የምትችለው በራስህ መንገድ ነው። `iroha_ffi` ሳጥኑ እርስዎ ለማመንጨት የሚያስፈልገውን ኮድ ብቻ ያመነጫል። አስፈላጊውን ቦይለርፕሌት መጻፍ ትንሽ ጥንቃቄና ተግሣጽ ይጠይቃል። በ FFI ወሰን ላይ እያንዳንዱ ተግባር ጥሪ ያልተወሰነ ባህሪን የመፍጠር አቅም ያለው `unsafe` ነው ። እሱን ለመፍታት የቻልነው ዘዴ ጠንካራ `repr(C)` ዓይነቶችን በመጠቀም ዙሪያ ይዞራል ።

::: መረጃ

ብቸኛው ልዩነት ጠቋሚዎች ናቸው ። የ null ፍተሻ እና ትክክለኛነት በዓለም አቀፍ ደረጃ ሊተገበሩ አይችሉም ፣ ስለሆነም ጥሬ ጠቋሚዎቹ (እንደ ሁልጊዜ) ጥቅም ላይ የሚውሉት በልዩ ሁኔታዎች ውስጥ ብቻ ነው ። Iroha የውሂብ ሞዴል ውስጥ አንድ ነገር ማለት ይቻላል በሁሉም ምሳሌ ዙሪያ ማሸጊያዎችን የምናቀርብ በመሆኑ, በጭራሽ ጥሬ ጠቋሚዎችን መጠቀም የለብዎትም.

:::

## ምሳሌ {#example}

አንድ አገናኝ ማመንጨት ምሳሌ ይኸውልዎት:

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

ከላይ የተጠቀሰው ምሳሌ የሚከተለውን አገናኝ ያስገኛል `DaysSinceEquinox` ግልጽ ያልሆነ ጠቋሚ ሆኖ ተገልጿል:

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI አስገዳጅ ትውልድ {#ffi-binding-generation}

`iroha_ffi` ሳጥን በ FFI በኩል ሊጠሩ የሚችሉ ተግባራትን ለማመንጨት ያገለግላል ። `Rust` አቀማመጦች እና ዘዴዎች ከተሰጡ የግንኙነት ድንበርን ለመሻገር የሚያስፈልግዎትን `unsafe` ኮድ ይፈጥራሉ።

ሀ Rust አይነት ወደ ጠንካራ ይለወጣል `repr(C)` የ መሻገር የሚችል አይነት FFI ጋር ድንበር `FfiType::into_ffi`. ይህ ደግሞ በተቃራኒው መንገድ ይሄዳል: FFI `ReprC` አይነት ወደ አንድ ይቀየራል `Rust` type via `FfiType::try_from_ffi`.

::: ማስጠንቀቂያ

ተቃራኒው ልወጣ ሊሳሳት እንደሚችል እና ያልተወሰነ ባህሪን ሊያስከትል እንደሚችል ልብ ይበሉ ። በጣም ግልፅ የሆኑ ስህተቶችን ለማስወገድ የተቻለንን ሁሉ ጥረት ማድረግ የምንችለው ቢሆንም የፕሮግራሙን ትክክለኛነት በእርስዎ መጨረሻ ላይ ማረጋገጥ አለብዎት።

:::

የግንኙነት ማመንጨት የሚችሉ ዋና ባህሪያት `ReprC`, `FfiType` እና `FfiConvert` ናቸው.

|ባሕርይ|መግለጫ |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|`ReprC` |ይህ ባህሪ ለ C ABI የሚስማማ ጠንካራ ዓይነትን ይወክላል ። ዓይነቱ በ FFI ድንበሮች ላይ በደህና ሊጋራ ይችላል ። |
|`FfiType` |ይህ ባህሪ ለተሰጠው `Rust` ዓይነት የሚዛመደውን `ReprC` አይነት ይገልጻል። የተገለጸው `ReprC` አይነት በተፈጠረው FFI ተግባር ውስጥ በ API ውስጥ የ `Rust` አይነት ምትክ ጥቅም ላይ ይውላል ። |
|`FfiConvert` | ይህ ባህሪ ሁለት ዘዴዎችን ይገልጻል `into_ffi` እና `try_from_ffi` ለለውጥ የሚጠቀሙት `Rust` ወደ ወይም ከ `ReprC` ዓይነት።                                |

በ FFI ላይ ባለቤትነት ዝውውር እንደሌለ ልብ ይበሉ ፣ ከማይታዩ የአመልካች ዓይነቶች በስተቀር። ባለቤትነትን የሚሸከሙ ሌሎች ሁሉም ዓይነቶች ፣ ለምሳሌ `Vec<T>` ፣ ክሎኔቶች ናቸው።

### ስም ማንግሊንግ {#name-mangling}

ለ FFI ዕቃዎች በተፈጠሩ ስሞች ውስጥ ባለ ሁለት አዝራሮች መጠቀምን ልብ ይበሉ:

- በ `StructName` መዋቅር ላይ ለተገለጸው `inherent_fn` ዘዴ, የ FFI ስም `StructName__inherent_fn` ይሆናል.
- ለ `MethodName` ዘዴ በ `StructName` መዋቅር ውስጥ ካለው `TraitName` ባህሪ ጋር ሲነጻጸር የ FFI ስም `StructNameTraitNameMethodName` ይሆናል ።
- በ `StructName` መዋቅር ውስጥ የ `field_name` መስክ ለማዘጋጀት, የ FFI ተግባር ስም `StructName__set_field_name` ይሆናል.
- በ `StructName` መዋቅር ውስጥ የ `field_name` መስክ ለማግኘት, የ FFI ተግባር ስም `StructName__field_name` ይሆናል.
- በ `StructName` መዋቅር ውስጥ ሊለወጥ የሚችል `field_name` መስክ ለማግኘት, የ FFI ተግባር ስም `StrucuName__field_name_mut` ይሆናል.
- FFI የሚለው ስም ለነፃነት የሚሠራው `module_name::fn_name` `module_name::__fn_name` ይሆናል።
- በ FFI ውስጥ ለመተግበር የሚያስችሏቸው አጠቃላይ ያልሆኑ ባህሪዎች (ከዚህ በታች `Clone` ይመልከቱ) ፣ የ FFI ስም `module_name::__clone` ይሆናል ።

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
