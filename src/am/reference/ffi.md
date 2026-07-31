---
translation_locale: am
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የውጭ ተግባር በይነገጾች (FFI) {#foreign-function-interfaces-ffi}

የ `iroha_ffi` የ C ማመንጨት ማክሮዎችን እና ባህሪያትን ያቀርባል ABI
ከ Rust APIs. ይህ ጥቅም ላይ የሚውል Iroha ዓይነቶች አንድ ማቋረጥ አለባቸው FFI
ወሰን ለምሳሌ በ SDK ትስስር ወይም አስተናጋጅ ውህደቶች።

## ለምን? FFI {#why-ffi}

አንድ ተግባር በአንጻራዊነት ረቂቅ አካል ነው, እና አብዛኛዎቹ ቋንቋዎች
አንድ ተግባር ምን ማድረግ እንዳለበት፣ ተግባራት የሚገለጹበት መንገድ
ከዚህም በላይ በአንዳንድ ቋንቋዎች ለምሳሌ Rust, ውጤቶቹ
አንድን ተግባር ለመጥራት እና ማድረግ የሚፈቀድላቸው ነገሮች እንዲሁ ናቸው
መቼ ነው? Rust APIs ከሌላ ቋንቋ ወይም
የተለያዩ አስተናጋጅ አካባቢዎች፣ Iroha የውጭ ተግባር በይነገጽ (FFI)
የጨዋታውን መስክ ለማስተካከል።

በዛሬው ጊዜ ጥቅም ላይ ዋነኛው መስፈርት የ C ትግበራ ሁለትዮሽ በይነገጽ ነው.
ቀላል, በሰፊው የሚገኝ እና የተረጋጋ.
ሁሉም ነገር በእጅ ነው, ግን Iroha የ `iroha_ffi` ለማመንጨት የሚሆን ሳጥን
FFI-የተሟላ ተግባራት ከቀድሞው Rust API.

እርግጥ ነው፣ ይህን በራስህ መንገድ ማድረግ ትችላለህ። `iroha_ffi` ሳጥን ብቻ
እርስዎ ለማመንጨት ያስፈልገናል ኮድ ያመነጫል.
አስፈላጊው ቦይለርፕሌት በጣም ትንሽ ጥንቃቄ እና ተግሣጽ ይጠይቃል ።
እያንዳንዱ ተግባር ጥሪ በላይ FFI ድንበር ነው `unsafe` የማድረግ አቅም ያለው
እኛ መፍትሄ ለማግኘት ያገኘነው ዘዴ
በመጠቀም ዙሪያ ይሽከረከራል **ጠንካራ** `repr(C)` ዓይነቶች.

::: info

ብቸኛው ልዩነት ጠቋሚዎች ናቸው.
በአለም አቀፍ ደረጃ የተተገበረ በመሆኑ ጥሬ አመልካቾች (እንደ ሁልጊዜ) ጥቅም ላይ የሚውሉት በልዩ ሁኔታዎች ውስጥ ብቻ ነው
ጉዳዮችን.
ውስጥ ያለውን ነገር Iroha የውሂብ ሞዴል, አንተ ጥሬ አመልካቾች መጠቀም የለበትም
ሁሉም.

:::

## ምሳሌ {#example}

እዚህ ላይ አንድ አገናኝ ማመንጨት ምሳሌ ነው:

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

ከላይ የተጠቀሰው ምሳሌ የሚከተለውን አገናኝ ያስገኛል
`DaysSinceEquinox` በኦፕራክ አመልካች መልክ የተገለጸ:

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI አስገዳጅ ትውልድ {#ffi-binding-generation}

የ `iroha_ffi` ክሬት በ በኩል ሊጠሩ የሚችሉ ተግባራትን ለማመንጨት ጥቅም ላይ ይውላል
FFI. የተሰጠው `Rust` አሠራሮች እና ዘዴዎች, እነዚህ `unsafe` ይህ ኮድ
የግንኙነት ድንበርን ለመሻገር የሚያስፈልግህ ነው።

ሀ Rust አይነት ወደ ጠንካራ ይቀየራል `repr(C)` የ መሻገር የሚችል አይነት
FFI ድንበር `FfiType::into_ffi`. ይህ በተቃራኒው መንገድ ይሄዳል
ደህና: FFI `ReprC` አይነት ወደ አንድ ይቀየራል `Rust` አይነት via
`FfiType::try_from_ffi`.

::: warning

ተቃራኒው ልወጣ ስህተት መሆኑን ልብ ይበሉ እና ያልተወሰነ ሊያስከትል ይችላል
በጣም ግልፅ የሆነውን ነገር ለማስወገድ የተቻለንን ሁሉ ጥረት የምናደርግ ቢሆንም
ስህተቶች ቢኖሩም የፕሮግራሙን ትክክለኛነት በእርስዎ በኩል ማረጋገጥ አለብዎት።

:::

The የግንኙነት ማመንጨት የሚችሉ ዋና ባህሪዎች `ReprC`, `FfiType`, እና
`FfiConvert`.

| ባሕርይ        | መግለጫ                                                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ReprC`      | ይህ ባሕርይ ከ C ጋር የሚስማማ ጠንካራ ዓይነትን ይወክላል ABI. ይህ አይነት በደህና በመላው ሊጋራ ይችላል FFI ድንበሮች።                                                                |
| `FfiType`    | ይህ ባህሪ የሚዛመደውን ይገልጻል `ReprC` ለተሰጠው አይነት `Rust` የተገለጸው `ReprC` አይነት በቦታው ጥቅም ላይ ይውላል `Rust` ውስጥ አይነት API ከተፈጠረው FFI ተግባር። |
| `FfiConvert` | ይህ ባህሪ ሁለት ዘዴዎችን ይገልጻል `into_ffi` እና `try_from_ffi` ለቀይሮ ማከናወን ጥቅም ላይ የሚውሉ `Rust` ወደ ወይም ከ `ReprC` ዓይነት።                                |

ባለቤትነት ማስተላለፍ የለም መሆኑን ልብ ይበሉ FFI ግልጽ ያልሆነ አመልካች በስተቀር
ሁሉም ሌሎች ባለቤትነት ያላቸው ዓይነቶች፣ ለምሳሌ `Vec<T>`, የተገለበጡ ናቸው።

### ስም ማንግሊንግ {#name-mangling}

በፈጠራ ስሞች ውስጥ ድርብ አዝራሮች ጥቅም ላይ ማስታወሻ FFI ዕቃዎች

- ለ `inherent_fn` በ `StructName` struct, የ FFI
  ስም ይሆናል `StructName__inherent_fn`.
- ለ `MethodName` ዘዴ ከ `TraitName` ውስጥ ባህሪ
  `StructName` struct, የ FFI ስም ይሆናል
  `StructName__TraitName__MethodName`.
- ለማዘጋጀት `field_name` መስክ ውስጥ `StructName` struct, የ FFI
  ተግባር ስም ይሆናል `StructName__set_field_name`.
- ለማግኘት `field_name` መስክ ውስጥ `StructName` struct, የ FFI
  ተግባር ስም ይሆናል `StructName__field_name`.
- ተለዋዋጭውን ለማግኘት `field_name` መስክ ውስጥ `StructName` struct, የ FFI
  ተግባር ስም ይሆናል `StrucuName__field_name_mut`.
- ለነጻ መቆም `module_name::fn_name`, የ FFI ስም ይሆናል
  `module_name::__fn_name`.
- አጠቃላይ ያልሆኑ እና ያላቸውን ማጋራት የሚፈቅድ ባህሪያት
  በ FFI (እይታ `Clone` ከታች) FFI ስም ይሆናል
  `module_name::__clone`.

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
