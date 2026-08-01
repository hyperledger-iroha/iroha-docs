---
translation_locale: uz
translation_source: /blockchain/trigger-examples.md
translation_source_hash: d40a0298466fdcbd30a9fdff979887b033e069646fcf3e437527d4d4ec2d0684
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Oʻzgarishlarni qoʻzgʻatish {#event-trigger-example}

Ushbu misol Iroha 3 ma'lumotlar modelidagi kanonik domensiz hisob IDs va ko'zda tutilgan aktivlarni aniqlashdan foydalanadi.

Aytaylik , tarmoqda:

- Alisaning kaliti tomonidan boshqariladigan kanonik hisob
- Mad Hatterning kaliti bilan nazorat qilinadigan kanonik hisob
- `wonderland.universal` bo'yicha `tea` deb taxmin qilingan aktivni belgilash
- har bir hisobda saqlanadigan ushbu aktivning balanslari

Maqsad Alice-ning choy balansini kuzatib boradigan triggerni ro'yxatdan o'tkazish va to'g'rilash ma'lumotlari bo'lganda Mad Hatter hisobidan transferni yuborishdir.

## 1. Hisob-kitoblar va aktivlarni tayyorlash {#_1-prepare-accounts-and-assets}

Birinchi navbatda ishtirokchi hisobvaraqlarni va aktivni belgilashni qayd qiling. joriy Iroha da IDs hisob raqami hisob boshqaruvchilari tomonidan beriladi, prognoz qilingan domenlar esa `domain.dataspace` shaklidan foydalanadi:

```text
domain: wonderland.universal
asset definition projection: tea in wonderland.universal
holder accounts: AccountId(controller=alice_key), AccountId(controller=mad_hatter_key)
```

Asset ta'rifida hali ham kanonik ko'rinmas manzil mavjud. Bu manzilni ro'yxatdan o'tgandan so'ng saqlash yoki so'rovlash va uni qo'zg'atish harakatida ishlating.

## 2. Ishtirokchi hokimiyatini tanlang. {#_2-choose-the-trigger-authority}

Agar iloji bo'lsa, triggerning texnik hisobini maxsus hisobga o'rnating. O'ziga xos hisobda triggerni bajarish uchun qaysi ruxsatnomalar kerakligi aniqlanadi va triggerni operatorning shaxsiy imzolash kaliti bilan bog'lashni oldini oladi.

Texnik hisobvaraq allaqachon mavjud bo'lishi va qo'zg'atuvchi ishga tushirish vositasida ko'rsatmalarni taqdim etish uchun ruxsat olishlari kerak.

## 3. Ijro qilinadigan elementni belgilash {#_3-define-the-executable}

Amalga oshirilishi mumkin bo'lgan ish o'tkazuvchisi voqea filtrini moslashtirganida yuboradigan ko'rsatma tartibidir. Ushbu misol uchun u bitta uzatishni o'z ichiga oladi:

```text
Transfer(
  source = AssetId(tea_definition, mad_hatter_account),
  value = Numeric(1),
  destination = AssetId(tea_definition, alice_account)
)
```

SDK ning so'nggi o'rnatilgan quruvchilaridan oxirgi operatsiya fayzli yukini ishlating. Ishga tushirish kodida eski matnli IDs ni qattiq kodlashdan qoching; ijro etilishini qurishdan oldin tahlil yoki so'rov kanonik IDs dan qoching.

## 4. O'yin filtrini aniqlang. {#_4-define-the-event-filter}

Ma'lumotlar hodisalari filtridan foydalanib , hodisalarni siz qiziqtirgan ob'ektga qisqartirasiz:

```text
EventFilterBox::Data(
  DataEventFilter for asset changes involving
  AssetId(tea_definition, alice_account)
)
```

Filterlarni amaliy bo'lganidek aniq saqlang. `AcceptAll` filtrlari xatolar uchun foydali, ammo u har bir moslashish hodisasi trigger baholash xarajatini to'laydi.

## 5. Ishtirokchini ro'yxatga oling {#_5-register-the-trigger}

Ishtirokchini quyidagicha yozib oling:

- o'simlik `TriggerId`
- bajarilishi mumkin bo'lgan ko'rsatmalarning ketma-ketligi
- `Repeats::Indefinitely` yoki `Repeats::Exactly(n)`
- texnik hisob raqami
- hodisa filtrini
- opsional metadatalar

Triggerni ro'yxatga olish o'zi normal operatsiya, shuning uchun ro'yxatdan o'tkazuvchi hisobvaraqqa triggerlarni qayd etish uchun ruxsat kerak. Texnik hisobvaraq triggerning bajarilishi uchun talab etiladigan ruxsatlarga ega.

## Ijro buyruqlari {#execution-order}

Bir blok bajarilganda:

1. Oddiy operatsiya yo'l-yo'riqlari birinchi o'rinni egallaydi.
2. Ushbu ko'rsatmalar bilan hosil bo'lgan voqealar ma'lumotlari to'planadi.
3. Filterlari o'sha tadbirlarga mos bo'lgan triggerlar rejalashtirilgan.
4. Trigger tomonidan ishlab chiqariladigan ta'sirlar blokni ijro etish to'g'risidagi tizimda cheksiz rekursiv triggerni amalga oshirishga yo'l qo'ymagan holda hal etiladi.

Agar qo'zg'atuvchidan `Repeats::Exactly(n)` foydalangan bo'lsa, hisob-kitob tugaganda va xuddi shunday xulq-atvor kerak bo'lganda yangi qo'ng'iroqni ro'yxatga oling.
