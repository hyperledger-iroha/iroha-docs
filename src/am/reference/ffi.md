---
translation_locale: am
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# የውጭ ተግባር በይነገጾች (FFI) {#foreign-function-interfaces-ffi}

የ`iroha_ffi` የሶፍትዌር ፓኬጅ ከ Rust APIs የC ABI ማሰሪያዎችን ለማመንጨት ማክሮዎችን እና ባህሪያትን ያቀርባል። የ Iroha ዓይነቶች የ FFI ድንበር ማቋረጥ በሚፈልጉበት ቦታ ጥቅም ላይ ይውላል፣ ለምሳሌ በ SDK ማሰሪያዎች ወይም አስተናጋጅ ውህደቶች።

## ለምን FFI {#why-ffi}

ተግባር ረቂቅ አካል ነው፣ እና አብዛኛዎቹ ቋንቋዎች አንድ ተግባር ምን ማድረግ እንዳለበት ቢስማሙም፣ ተግባራት የሚወከሉበት መንገድ በጣም የተለየ ነው። ከዚህም በላይ በአንዳንድ ቋንቋዎች እንደ Rust ተግባርን መጥራት የሚያስከትለው መዘዝ እና እንዲሰራ የሚፈቀድላቸው ነገሮችም የተለያዩ ናቸው. መቼ Rust APIs ከሌላ ቋንቋ ወይም ከተለየ አስተናጋጅ አካባቢ መጠራት አለበት፣ Iroha የመጫወቻ ሜዳውን ለማመጣጠን የውጭ ተግባር በይነገጽ (FFI) ይጠቀማል።

ዛሬ ጥቅም ላይ የዋለው ዋናው መስፈርት የ C መተግበሪያ ሁለትዮሽ በይነገጽ ነው። ቀላል፣ በሰፊው የሚገኝ እና የተረጋጋ ነው። በመርህ ደረጃ፣ ሁሉንም ነገር እራስዎ ማድረግ ይችላሉ፣ ነገር ግን Iroha አሁን ካለው Rust API FFI የሚያሟሉ ተግባራትን ለማመንጨት የ`iroha_ffi` ሶፍትዌር ፓኬጅ ያቀርባል።

በእርግጥ ይህንን በራስዎ መንገድ ማድረግ ይችላሉ። የ`iroha_ffi` የሶፍትዌር ፓኬጅ ለማንኛውም ማመንጨት የሚያስፈልግዎትን ኮድ ብቻ ያመነጫል። አስፈላጊውን ተደጋጋሚ የአብነት ኮድ መጻፍ ትንሽ ትጋት እና ተግሣጽ ይጠይቃል። በ FFI ድንበር ላይ ያለው እያንዳንዱ ተግባር ቴክኒካል ጥሪ `unsafe` ያልተገለጸ ባህሪን የመፍጠር አቅም አለው። እሱን ለመፍታት የቻልንበት ዘዴ የሚያጠነጥነው ጠንካራ `repr(C)` ዓይነቶችን በመጠቀም ነው።

::: info

ብቸኛው ልዩነት ጠቋሚዎች ናቸው. ባዶው ቼክ እና ትክክለኛነት በአለምአቀፍ ደረጃ ሊተገበር አይችልም፣ ስለዚህ ጥሬ ጠቋሚዎች (እንደ ሁልጊዜው) ልዩ በሆኑ ጉዳዮች ላይ ብቻ ጥቅም ላይ ይውላሉ። በ Iroha የውሂብ ሞዴል ውስጥ በሁሉም የነገሮች ምሳሌዎች ዙሪያ የሶፍትዌር አስማሚዎችን ስለምናቀርብ ጥሬ ጠቋሚዎችን በጭራሽ መጠቀም የለብዎትም።

:::

## ምሳሌ {#example}

ማሰር የማመንጨት ምሳሌ ይኸውና -

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

ከላይ ያለው ምሳሌ የሚከተለውን ማሰሪያ ያመነጫል `DaysSinceEquinox` እንደ ግልጽ ያልሆነ ጠቋሚ ይወከላል።

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI አስገዳጅ ትውልድ {#ffi-binding-generation}

የ`iroha_ffi` ሶፍትዌር ፓኬጅ በ FFI በኩል ሊጠሩ የሚችሉ ተግባራትን ለማመንጨት ይጠቅማል። ከ `Rust` አወቃቀሮች እና ዘዴዎች አንፃር፣ የማገናኛ ድንበሩን ለማቋረጥ የሚያስፈልግዎትን `unsafe` ኮድ ያመነጫሉ።

የ Rust አይነት የ FFI ድንበርን በ`FfiType::into_ffi` ሊያቋርጥ ወደሚችል ጠንካራ `repr(C)` አይነት ይቀየራል። ይህ በተቃራኒው ይሄዳል FFI `ReprC` አይነት በ`FfiType::try_from_ffi` በኩል ወደ `Rust` አይነት ይቀየራል።

::: warning

ተቃራኒው ልወጣ ለስህተት የተጋለጠ እና ወደ ያልተገለጸ ባህሪ ሊያመራ እንደሚችል ልብ ይበሉ። በጣም ግልጽ የሆኑ ስህተቶችን ለማስወገድ የተቻለንን ሁሉ ማድረግ ብንችልም, ፕሮግራሙ ከጎንዎ በትክክል መስራቱን ማረጋገጥ አለብዎት.

:::

አስገዳጅ ትውልድን የሚያስችሉት ዋና ዋና ባህሪያት `ReprC`፣ `FfiType` እና `FfiConvert` ናቸው።

|ባሕርይ|መግለጫ|
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|`ReprC`|ይህ ባህሪ ከ C ABI ጋር የሚስማማ ጠንካራ አይነትን ይወክላል። አይነቱ በ FFI ድንበሮች ላይ ደህንነቱ በተጠበቀ ሁኔታ ሊጋራ ይችላል።|
|`FfiType`|ይህ ባህሪ ለአንድ የተወሰነ `Rust` አይነት ተጓዳኝ `ReprC` አይነት ይገልጻል። የተገለጸው `ReprC` አይነት በተፈጠረው FFI ተግባር API ውስጥ በ`Rust` አይነት ምትክ ጥቅም ላይ ይውላል።|
|`FfiConvert`|ይህ ባህሪ የ`Rust` አይነት ወደ `ReprC` አይነት ወይም ከ [] አይነት ለመለወጥ የሚያገለግሉ ሁለት ዘዴዎችን `into_ffi` እና `try_from_ffi` ይገልጻል።|

ግልጽ ያልሆኑ የጠቋሚ አይነቶች ካልሆነ በስተቀር በ FFI ላይ ምንም የባለቤትነት ዝውውር እንደሌለ ልብ ይበሉ። እንደ `Vec<T>` ያሉ የባለቤትነት መብትን የሚሸከሙ ሁሉም ዓይነቶች ተዘግተዋል።

### ስም ማንግሊንግ {#name-mangling}

በ FFI ነገሮች የመነጩ ስሞች ውስጥ ድርብ የስር ነጥቦችን መጠቀምን ልብ ይበሉ -

- በ `StructName` መዋቅር ላይ ለተገለጸው `inherent_fn` ዘዴ፣ FFI ስም `StructName__inherent_fn` ይሆናል።
- በ `StructName` መዋቅር ውስጥ ካለው `TraitName` ባህሪ ለ `MethodName` ዘዴ፣ FFI ስም `StructName__TraitName__MethodName` ይሆናል።
- በ `StructName` መዋቅር ውስጥ `field_name` መስክን ለማዘጋጀት፣ የ FFI ተግባር ስም `StructName__set_field_name` ይሆናል።
- በ `StructName` መዋቅር ውስጥ `field_name` መስኩን ለማግኘት፣ የ FFI ተግባር ስም `StructName__field_name` ይሆናል።
- በ `StructName` መዋቅር ውስጥ የሚለዋወጠውን `field_name` መስክ ለማግኘት፣ የ FFI ተግባር ስም `StrucuName__field_name_mut` ይሆናል።
- ለነጻ `module_name::fn_name` FFI ስሙ `module_name::__fn_name` ይሆናል።
- አጠቃላይ ላልሆኑ ባህሪያት እና አተገባበሩን በ FFI ውስጥ ማካፈል ለሚፈቅዱ ባህሪያት (ከዚህ በታች `Clone` ይመልከቱ) የ FFI ስም `module_name::__clone` ይሆናል።

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
