---
translation_locale: uz
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Xorijiy funksiya interfeyslari (FFI) {#foreign-function-interfaces-ffi}

O ' zbekiston Respublikasi `iroha_ffi` C ishlab chiqarish uchun makros va xususiyatlarni taqdim etadi ABI
to'lovlar Rust APIs. U yerda ishlatiladi Iroha turlari o'tish kerak FFI
chegara, masalan SDK bog'lanishlar yoki uy egasi integratsiyalari.

## Nima uchun ? FFI {#why-ffi}

Funksiya biroz abstrakt entitetdir va aksariyat tillar
funksiya nima qilishi kerak, funktsiyalar qanday tasvirlanganligi
Bundan tashqari, ba'zi tillarda: Rust, oqibatlari
funksiyani chaqirish va unga ruxsat etilgan narsalar ham
farq qiladi. Rust APIs boshqa tildan yoki
boshqa uy egasi muhit, Iroha tashqi funksiya interfeysidan foydalanadi (FFI)
o'yin maydonini tenglashtirish uchun.

Bugungi kunda ishlatiladigan asosiy standart C dasturlari ikkilamchi interfeysi.
oddiy, keng tarqalgan va barqaror.
hamma narsani qo'lda, lekin Iroha ko'rsatkichlarini `iroha_ffi` ishlab chiqarish uchun qutis
FFI- mavjud bo'lgan funksiyalar Rust API.

Albatta, siz buni o'zingizning yo'lingiz bilan qila olasiz. `iroha_ffi` faqat qutisi
yozib olish uchun kerak bo'lgan kodni yaratadi.
zarur boilerplate bir oz g'ayrat va intizom talab qiladi.
Har bir funktsiya qo'ng'iroq FFI chegara `unsafe` qo'llash imkoniyati bilan
Biz uni hal qilishga muvaffaq bo'lgan usul
foydalanish bilan aylanadi **mustahkam** `repr(C)` turlari.

::: info

Faqatgina istisno ko'rsatkichlardir.
jahon miqyosida qo'llaniladi, shuning uchun xom ko'rsatkichlar (har doimgidek) faqat istisno hollarda ishlatiladi
Biz deyarli har bir holatda
ob'ekt Iroha ma'lumotlar modeli, siz xom ko'rsatkichlar foydalanish kerak emas
Hammasi.

:::

## Misol {#example}

Bu erda bog'lanish hosil qilishning bir namunasi:

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

Yuqorida keltirilgan misol quyidagi bogʻliqlikni hosil qiladi:
`DaysSinceEquinox` ko'rsatgich sifatida tasvirlangan:

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI Qatnamli avlod {#ffi-binding-generation}

O ' zbekiston Respublikasi `iroha_ffi` kassa orqali chaqirish mumkin bo'lgan funksiyalarni ishlab chiqarish uchun ishlatiladi
FFI. Berilgan `Rust` uslubi va usullari, ular `unsafe` kodini
siz bog'lanish chegaralarini kesib o'tish uchun kerak bo'ladi.

A Rust tip mustahkamga aylanadi `repr(C)` o'tish mumkin bo'lgan tur
FFI bilan chegarasi `FfiType::into_ffi`. Bu oʻzgacha yoʻl bilan boradi .
Xoʻsh: FFI `ReprC` turi o'zgartirilgan `Rust` turlari
`FfiType::try_from_ffi`.

::: warning

Shuni ta'kidlangki, qarama-qarshi konversiya noto'g'ri va aniqlanmagan sabablarga olib kelishi mumkin
Biz eng ko'rinmas holatlardan qochishga harakat qilamiz.
xatolar, siz dasturning to'g'riligini o'zingiz uchun ta'minlashingiz kerak.

:::

The Bog'lovchi ishlab chiqarishni imkon beradigan asosiy xususiyatlar: `ReprC`, `FfiType`, va
`FfiConvert`.

| Xususiyat        | Tafsiri                                                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ReprC`      | Ushbu xususiyat C ga mos keladigan kuchli turni ifodalaydi ABI. Tovushni xavfsiz ravishda turli FFI chegaralar.                                                                |
| `FfiType`    | Ushbu xususiyat tegishli `ReprC` ma'lum bir tur uchun `Rust` turi; aniqlangan `ReprC` turining o'rniga `Rust` bosish API ishlab chiqarilgan FFI funksiya. |
| `FfiConvert` | Ushbu xususiyat ikkita usulni belgilaydi . `into_ffi` va `try_from_ffi` o'zgarishni amalga oshirish uchun ishlatiladi `Rust` to'g'ri yoki undan `ReprC` turi.                                |

Shuni ta'kidlash kerakki, mulkdorlik o'tkazilmaydi FFI ko'rsatgichdan tashqari
Boshqa barcha turdagi mulkdorlar, masalan `Vec<T>`, klonlangan.

### Ism Mangling {#name-mangling}

Ishlab chiqarilgan nomlarda ikki marta ko'rsatkichlar qo'llanilishiga e'tibor bering FFI obyektlar:

- O ' zbekiston Respublikasi `inherent_fn` O'zbekiston Respublikasining `StructName` tarkibiy tuzilmasi, FFI
  nom `StructName__inherent_fn`.
- O ' zbekiston Respublikasi `MethodName` O'zbekiston Respublikasi `TraitName` belgilari
  `StructName` tarkibiy tuzilmasi, FFI nom
  `StructName__TraitName__MethodName`.
- Oʻrnatish uchun `field_name` maydondagi `StructName` tarkibiy tuzilmasi, FFI
  funksiya nomi `StructName__set_field_name`.
- Oʻz navbatida , `field_name` maydondagi `StructName` tarkibiy tuzilmasi, FFI
  funksiya nomi `StructName__field_name`.
- Oʻzgaruvchanini olish uchun `field_name` maydondagi `StructName` tarkibiy tuzilmasi, FFI
  funksiya nomi `StrucuName__field_name_mut`.
- Mustaqillik uchun `module_name::fn_name`, ko'rsatilgan FFI nom
  `module_name::__fn_name`.
- Umumiy bo'lmagan va o'zlarining
  Oʻzbekiston Respublikasida FFI (qarang) `Clone` (boshida) FFI nom
  `module_name::__clone`.

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
