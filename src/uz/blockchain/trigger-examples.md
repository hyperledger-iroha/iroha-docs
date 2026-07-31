---
translation_locale: uz
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Oʻzgarishlarni qoʻzgʻatish {#event-trigger-example}

Ushbu misolda kanonik domensiz hisobdan foydalaniladi IDs va rejalashtirilgan aktiv
ta'riflar Iroha 3 ma'lumotlar modeli.

Bir tarmoq quyidagilarni oʻz ichiga oladi:

- Alisaning kaliti tomonidan boshqariladigan kanonik hisob
- Mad Hatterning kaliti bilan boshqariladigan kanonik hisob
- aktivni belgilash `tea` koʻrsatkich `wonderland.universal`
- har bir hisobda saqlanadigan ushbu aktivning balansini

Maqsad - Alicaning choy balansini kuzatadigan triggerni qayd etish va
Mad Hatter hisobidan ma'lumotlar bilan bog'liq voqea sodir bo'lganda o'tkazib yuboradi
chiqarib yuborilgan.

## 1. Hisob-kitoblar va aktivlarni tayyorlash {#_1-prepare-accounts-and-assets}

Birinchi navbatda ishtirokchi hisobvaraqlarni va aktivni belgilashni qayd qiling.
joriy Iroha, hisob IDs hisobda nazoratchilardan kelib chiqqan bo'lsa,
domenlardan foydalanish `domain.dataspace` shakli:

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

Asset ta'rif hali ham kanonik ko'rinmas manzilga ega.
ro'yxatdan o'tganidan so'ng manzil va uni qo'zg'atish harakatida ishlating.

## 2. Ishtirokchi hokimiyatini tanlang {#_2-choose-the-trigger-authority}

Agar iloji bo'lsa, triggerning texnik hisobini maxsus hisob raqamiga o'rnating.
maxsus hisobda trigger uchun qaysi ruxsatnomalar kerakligi aniq
bajarilishi va o'chirgichni operatorning shaxsiy imzosi bilan bog'lashdan qochadi
kalit.

Texnik hisob qaydnomasi allaqachon mavjud bo'lishi kerak va u taqdim etish uchun ruxsat olishlari kerak
qo'zg'atuvchining bajarilishi mumkin bo'lgan ko'rsatmalari.

## 3. Ijro qilinadigan qismni belgilash {#_3-define-the-executable}

Amalga oshirilishi mumkin boʻlgan dastur oʻtkazilayotganda trigger tomonidan yuboriladigan koʻrsatmalarning ketma-ketligi
Filter moslamalari. Ushbu misol uchun u bitta o'tishni o'z ichiga oladi:

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

Foydalanish SDK so'nggi muomala faydali yuk uchun hozirgi bosilgan qurilishchilar.
qattiq kodlangan eski matn IDs qo'zg'atuvchi kodda; tahlil yoki so'rov kanonik IDs
ijro etilishini qurishdan oldin.

## 4. O'zgarish filtrini belgilash {#_4-define-the-event-filter}

O'zingiz qiziqtirgan ob'ektga hodisalarni torlaydigan ma'lumotlar bo'yicha filtrdan foydalaning:

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

Filterlarni amaliy bo'lgancha aniq saqlang. `AcceptAll` filtr uchun foydali
debugging, lekin u har bir moslashish hodisa qo'zg'atish xarajatini to'laydi
baholash.

## 5. Ishtirokchini yozib oling {#_5-register-the-trigger}

Ishtirokchini quyidagi bilan qayd qiling:

- o'rmonxona `TriggerId`
- bajarilishi mumkin bo'lgan ko'rsatmalarning tartibini
- `Repeats::Indefinitely` yoki `Repeats::Exactly(n)`
- texnik hisob raqami
- hodisa filtrini
- ko'rsatkichlar

Trigger ro'yxatining o'zi normal bir operatsiya, shuning uchun ro'yxatga olish
hisobda triggerlarni ro'yxatdan o'tkazish uchun ruxsat kerak.
qo'zg'atuvchi tomonidan talab etiladigan ruxsatnomalar.

## Ijro buyruqi {#execution-order}

Blokning bajarilishi:

1. Oddiy tranzaksiya yo'l-yo'riqlari birinchi o'rinni egallaydi.
2. Ushbu ko'rsatmalar bilan hosil bo'lgan ma'lumotlar yig'iladi.
3. Filterlari ushbu tadbirlarga mos bo'lgan tetiklar rejalashtirilgan.
4. Trigger tomonidan ishlab chiqariladigan ta'sirlar blokni amalga oshirish borasidagi quvurda
   cheklanmagan rekursiv qo'zg'atuvchini amalga oshirish imkonini beradi.

Agar qoʻzgʻatgich ishlatsa `Repeats::Exactly(n)`, hisobda yangi qoʻzgʻotish
bo'lsa, o'sha xatti-harakatni yana ko'rish kerak.
