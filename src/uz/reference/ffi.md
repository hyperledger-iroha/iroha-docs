---
translation_locale: uz
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Xorijiy funksiya interfeyslari (FFI) {#foreign-function-interfaces-ffi}

O ' zbekiston Respublikasining `iroha_ffi` C ishlab chiqarish uchun makro va xususiyatlarni taqdim etadi. ABI bilan bog'liq Rust APIs. U yerda ishlatiladi Iroha turlari o'tish kerak FFI chegara, masalan, SDK bog'lanishlar yoki uy egasi integratsiyalari.

## Nima uchun FFI {#why-ffi}

Funksiya juda abstrakt entitetdir va aksariyat tillar funksiyaning nima qilishi kerakligi to'g'risida kelishib olganda, funksiyalarning ifodalash usuli juda farq qiladi. Bundan tashqari, Rust kabi ba'zi tillarda funktsiyaga chaqirishning oqibatlari va unga ruxsat berilgan narsalar ham farq qiladi. Rust APIs boshqa tildan yoki boshqa uy muhitidan chaqirilishi kerak bo'lganda, Iroha o'yin sharoitini tenglashtirish uchun chet funksiya interfeysidan (FFI) foydalanadi.

Bugungi kunda ishlatiladigan asosiy standart C dasturlari ikkilamchi interfeysidir. Bu sodda, keng tarqalgan va barqaror. Aslida siz hamma narsani qo'lda bajarishingiz mumkin, ammo Iroha mavjud bo'lgan Rust API dan FFI-ga mos funksiyalarni hosil qilish uchun `iroha_ffi` qutisini taqdim etadi .

Albatta, siz buni o'zingizning yo'lingiz bilan qila olasiz. `iroha_ffi` qutisi faqatgina siz yaratishingiz kerak bo'lgan kodni ishlab chiqaradi. Kerakli boilerplate yozish juda ko'p g'ayrat va intizom talab qiladi. FFI chegara bo'ylab har bir funktsiya qo'ng'iroqlari `unsafe` bo'lib, aniqlanmagan xatti-harakatlarga olib kelishi mumkin. Biz uni hal qilishga muvaffaq bo'lgan usul kuchli `repr(C)` turlarini ishlatish bilan aylanadi.

::: info

Faqatgina istisnolar ko'rsatkichlardir. Null tekshiruvi va haqiqiyligi global miqyosda qo'llanilmaydi, shuning uchun xom ko'rsatkichi (har doimgidek) faqat istisno hollarda ishlatiladi. Iroha ma'lumotlar modelidagi ob'ektning deyarli har bir holatini o'rab olgan holda, siz hech qachon xom ko'rsatkichlardan foydalanishingiz shart emas.

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

Yuqoridagi misol `DaysSinceEquinox` bilan quyidagi bog'lanishni hosil qiladi, u shaffof ko'rsatkich sifatida tasvirlanadi:

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI Bog'lovchi avlod {#ffi-binding-generation}

`iroha_ffi` qutisi FFI orqali chaqirish mumkin bo'lgan funksiyalarni yaratish uchun ishlatiladi. `Rust` tuzilmalari va usullarini hisobga olgan holda, ular bog'lanish chegarasini kesish uchun kerak bo'ladigan `unsafe` kodini ishlab chiqaradi.

A Rust turi mustahkamga aylantiriladi `repr(C)` o'tish mumkin bo'lgan turi FFI bilan chegarasi `FfiType::into_ffi`. Bu esa oʻzgacha yoʻldan boradi: FFI `ReprC` turi o'zgartirilgan `Rust` yo'nalishi `FfiType::try_from_ffi`.

::: warning

Shuni yodda tutingki, aksincha o'zgarish noto'g'ri va aniqlanmagan xatti-harakatlarga sabab bo'lishi mumkin. Biz eng ko'p xatolarni oldini olish uchun qo'limizdan kelganini qilishimiz mumkin bo'lsa-da, siz dasturning to'g'ridan-to'g'risida ishonch hosil qilishingiz kerak.

:::

Bog'lovchi ishlab chiqarishni imkon beradigan asosiy xususiyatlar `ReprC`, `FfiType` va `FfiConvert`.

|Xususiyat |Tafsiri |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|`ReprC` |Ushbu xususiyat C ABI ga mos keladigan mustahkam turni ifodalaydi. Bu tur FFI chegaralarida xavfsiz taqsimlanishi mumkin. |
|`FfiType` |Ushbu xususiyat ma'lum bir `Rust` turi uchun tegishli `ReprC` tipini belgilaydi. hosil bo'lgan FFI funksiyasining API funksiyasida `Rust` tipining o'rniga belgilangan `ReprC` turi ishlatiladi. |
|`FfiConvert` |Ushbu xususiyat `into_ffi` va `try_from_ffi` turini `Rust` turiga yoki undan `ReprC` turiga aylantirish uchun ishlatiladigan ikkita usulni belgilaydi. |

FFI bo'yicha egalik o'tkazilishi yo'qligiga e'tibor bering, faqat shaffof ko'rsatkich turlari mavjud. `Vec<T>` kabi egalikni olib boradigan barcha boshqa turlar klonlanadi.

### Ism Mangling {#name-mangling}

FFI ob'ektlarining ishlab chiqilgan nomlarida ikki marta ko'rsatkichlar qo'llanilishiga e'tibor bering:

- `StructName` tuzilmasida belgilangan `inherent_fn` usuli uchun FFI nomi `StructName__inherent_fn` bo'ladi.
- `StructName` tarkibidagi `TraitName` xususiyatidan `MethodName` usuli uchun FFI nomi `StructNameTraitNameMethodName` bo'ladi.
- `StructName` strukturasida `field_name` maydonini o'rnatish uchun FFI funksiya nomi `StructName__set_field_name` bo'ladi.
- `StructName` tuzilmasidagi `field_name` maydonini olish uchun FFI funksiya nomi `StructName__field_name` bo'ladi.
- `StructName` tarkibida o'zgaruvchan `field_name` maydonini olish uchun FFI funksiya nomi `StrucuName__field_name_mut` bo'ladi.
- O'zboshida turgan `module_name::fn_name` uchun FFI nomi `module_name::__fn_name` bo'ladi.
- Umumiy bo'lmagan xususiyatlar uchun va ularni amalga oshirishni FFI (qarang) `Clone` quyida keltirilgan), FFI nom boʻladi `module_name::__clone`.

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
