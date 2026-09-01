---
translation_locale: uz
translation_source: /reference/ffi.md
translation_source_hash: 2df23722cea2f918874f0109b31b24bb3d8dbd7f95c00d1d6d1568c5f81f68bc
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Chet funktsiya interfeyslari (FFI) {#foreign-function-interfaces-ffi}

`iroha_ffi` dasturiy ta'minot paketi Rust APIs dan C ABI bog‘lamalarini yaratish uchun makrolar va xususiyatlarni taqdim etadi. U Iroha turlari FFI chegarasidan o‘tishi kerak bo‘lgan joylarda ishlatiladi, masalan, SDK bog‘lamalari yoki mezbon integratsiyalari orqali.

## Nima uchun FFI {#why-ffi}

Funksiya biroz mavhum mavjudotdir, va ko‘pgina tillar funksiya nima qilishi kerakligiga rozi bo‘lsa-da, funksiyalar qanday ifodalanishi juda farq qiladi. Bundan tashqari, ba'zi tillarda, masalan Rust, funksiyani chaqirishning oqibatlari va uning qilishga ruxsat berilgan narsalari ham boshqacha. Rust qachon APIs boshqa til yoki boshqa xost muhiti tomonidan chaqirilishi kerak, Iroha teng sharoit yaratish uchun chet funksiyalar interfeysidan (FFI) foydalanadi.

Bugungi kunda ishlatiladigan asosiy standart C ilova binar interfeysidir. U sodda, keng tarqalgan va barqarordir. Aslida, siz hamma narsani qo'lda qilishingiz mumkin, lekin Iroha mavjud Rust API dan FFI-ga mos keladigan funksiyalarni yaratish uchun `iroha_ffi` dasturiy paketini taqdim etadi.

Albatta, siz buni o'zingizcha qilishingiz mumkin. `iroha_ffi` dasturiy ta'minot paketi faqat sizga har qanday holatda kerak bo'ladigan kodni yaratadi. Zarur bo'lgan takroriy shablon kodini yozish sezilarli darajada mehnat va intizom talab qiladi. Har bir funksiya texnik chaqiruv FFI chegara orqali amalga oshirilganda, `unsafe` bilan bog‘liq bo‘lib, noaniq xatti-harakatni keltirib chiqarishi mumkin. Biz uni hal qilishga muvaffaq bo‘lgan usulimiz mustahkam `repr(C)` turlaridan foydalanishga asoslangan.

::: info

Yagona istisno ko‘rsatkichlardir. Bo‘sh tekshiruv va amal qilinishini global tarzda majburlash mumkin emas, shuning uchun xom ko‘rsatkichlar (doimiy qilganimizdek) faqat istisno hollarda ishlatiladi. Agar biz Iroha ma'lumotlar modeli ichidagi deyarli har bir obyektning atrofida dasturiy adapterlar taqdim qilsak, sizga hech qachon xom ko'rsatkichlardan foydalanishga to'g'ri kelmasligi kerak.

:::

## Misol {#example}

Mana bir bog'lanishni yaratish misoli:

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

Yuqoridagi misol quyidagi bog‘lanishni yaratadi, bunda `DaysSinceEquinox` shaffof bo‘lmagan ko‘rsatgich sifatida ifodalanadi:

```rust
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI Bog'lashni yaratish {#ffi-binding-generation}

`iroha_ffi` dasturiy ta'minot paketi FFI orqali chaqiriladigan funksiyalarni yaratish uchun ishlatiladi. `Rust` strukturalar va metodlar berilgan holda, ular sizga bog‘lanish chegarasini kesib o‘tish uchun kerak bo‘lgan `unsafe` kodini yaratadi.

Rust turidagi narsa mustahkam `repr(C)` turiga aylantiriladi, u `FfiType::into_ffi` bilan FFI chegarasini kesib o'tishi mumkin. Bu aksincha ham shunday: FFI `ReprC` turi `FfiType::try_from_ffi` orqali `Rust` turiga aylantiriladi.

::: warning

Shuni yodda tutingki, qarama-qarshi aylantirish xatoga moyil bo‘lib, noma'lum xatti-harakatga olib kelishi mumkin. Eng aniq xatolardan qochish uchun qo‘limizdan kelganini qilishimiz mumkin bo‘lsa-da, dastur to‘g‘riligini o‘z tomoningizdan ta'minlashingiz zarur.

:::

Bog'lash generatsiyasini ta'minlaydigan asosiy xususiyatlar `ReprC`, `FfiType` va `FfiConvert` dir.

|Xususiyat|Tavsif|
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ReprC`      |Ushbu xususiyat C ABI ga mos keladigan mustahkam turini ifodalaydi. Ushbu tur FFI chegaralari bo‘ylab xavfsiz ulashilishi mumkin.|
| `FfiType`    |Ushbu xususiyat berilgan `Rust` turi uchun mos keluvchi `ReprC` turini belgilaydi. Belgilangan `ReprC` turi yaratilgan FFI funksiyaning API da `Rust` turining o‘rnida ishlatiladi.|
| `FfiConvert` |Bu xususiyat `Rust` turini `ReprC` turiga yoki aksincha konvertatsiya qilish uchun ishlatiladigan `into_ffi` va `try_from_ffi` metodlarini belgilaydi.|

Qayd eting, faqat shaffof bo‘lmagan ko‘rsatkich tiplari bundan mustasno, FFI ustidan egalik o‘tkazilmaydi. Egalikni o‘z ichiga olgan boshqa barcha turlar, masalan `Vec<T>`, nusxalanadi.

### Ismni o'zgartirish {#name-mangling}

Yaratilgan FFI obyektlarining nomlarida ikki pastki chiziqdan foydalanishga e'tibor bering:

- `StructName` strukturasida belgilangan `inherent_fn` usul uchun, FFI nomi `StructName__inherent_fn` bo‘ladi.
- `StructName` strukturasidagi `TraitName` traitidagi `MethodName` usuli uchun, FFI nomi `StructName__TraitName__MethodName` bo'ladi.
- `StructName` strukturadagi `field_name` maydonni o'rnatish uchun, FFI funksiyaning nomi `StructName__set_field_name` bo'ladi.
- `StructName` strukturadagi `field_name` maydonni olish uchun, FFI funksiyaning nomi `StructName__field_name` bo'ladi.
- `StructName` strukturasidagi o'zgartiriladigan `field_name` maydonini olish uchun, FFI funktsiya nomi `StrucuName__field_name_mut` bo'ladi.
- Mustaqil `module_name::fn_name` uchun, FFI nomi `module_name::__fn_name` bo'ladi.
- Umumiy bo‘lmagan va ularning amalga oshirilishini FFI da bo‘lishishga imkon beradigan xususiyatlar uchun (quyida `Clone` ga qarang), FFI nomi `module_name::__clone` bo‘ladi.

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
