---
translation_locale: uz
translation_source: /blockchain/smart-contracts.md
translation_source_hash: ed622cdb1d6a47635d0753c98f80aaa903b916133f43bc9fdab268512d0ace69
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Aqlli shartnomalar {#smart-contracts}

Iroha operatsiyalarni amalga oshirish `Executable` Faydali yuklar. Hozirgi ma'lumot modeli
qo'llab-quvvatlaydi:

- `Executable::Instructions`: to'g'ri tartibdagi Iroha Maxsus ko'rsatmalar
- `Executable::ContractCall`: ishga tushirilgan shartnomaga qo'shimcha ma'lumotnoma chaqiriq
  misollar
- `Executable::Ivm`: Iroha VM Byte kodlari
- `Executable::IvmProved`: Iroha VM oldindan hisoblab chiqilgan ko'rsatma bilan bytecode
  O'rnatish va isbot majburiyatlari

Kotodama bo ' lmoqda Iroha yuqori darajadagi aqlli shartnoma tili. `.ko` manba fayli
deterministik to ' plami IVM konvensional ravishda byte kod sifatida saqlanadi `.to`
ishga tushirish uchun artefakt. Kotodama maqsadlar IVM; U mustaqil emas . RISC-V
yoki WebAssembly maqsad.

Birinchi nashr faqat qo'llab-quvvatlaydi ABI 1. Syscall va ko'rsatkich ABI
siyosat shartnoma qabul qilish va bajarilishi bilan shartsiz ravishda amalga oshiriladi;
ishga tushirish vaqti moslashuvchanligi o'zgartirilmaydi.

## Aqlli shartnomalardan qachon foydalanish kerak {#when-to-use-smart-contracts}

Transaksiyani bevosita ifodalash mumkin bo'lganda odatdagi ko'rsatmalardan foydalaning:

- ro'yxatdan o'tkazish yoki uni bekor qilish ob'ektlari
- Minot, yoqish yoki o'tkazish aktivlari
- Metadatalarni yangilash
- ruxsatnomalarni berish yoki bekor qilish
- qoʻzgʻatish
- zanjirdagi parametrlarni o'rnatish

Transaksiya uchun oʻrnatilgan logika kerak boʻlganda aqlli kontraktdan foydalaning
o'rnatilganda yoki
shartnoma ko'rib chiqilishi kerak.

## IVM Ishlab chiqarish qobiliyatlari {#ivm-executables}

`Executable::Ivm` xom ashyo bilan ta'minlanadi IVM Byte kod. Uzumlar bu byte kodni ichki qismida amalga oshiradi
zanjir uchun o'rnatilgan ishga tushirish vaqti cheklovlari.
aniqlovchi; shartnomalar tranzaksiyalarni amalga oshirishning bir qismi bo'lib, shuning uchun
kelishuvi.

`Executable::IvmProved` o'z ichiga quyidagilarni oladi:

- IVM Byte kodlari
- deterministik ko'rsatma qoplamasi
- ijro-tashkilotlar majburiyati
- gaz siyosati majburiyati

Dasturiy ta'minot to'plamini bajarilgan byte kodga bog'laydi.
siyosat, tasdiqlovchilar isbot va takrorlash ijro qo'shimcha sifatida tekshirish mumkin
xavfsizlik tekshiruvi.

## Ishlab chiqarilgan kontrakt qo'ng'iroqlari {#deployed-contract-calls}

`Executable::ContractCall` manzil orqali ishga tushirilgan shartnoma ko'rinishini chaqiradi.
Ushbu kodni kontrakt kodlari alohida qayd etilganida va bitimlar amalga oshirilayotganda ishlating
Bayt kodini har safar olib yurishning o'rniga uni ma'lumotnoma orqali chaqiring.

## Operatsiya yo'l-yo'riqlari {#operational-guidance}

- Shartnomalarni deterministik saqlang.
  devor soatlari vaqti, host fayl tizimining holati, tarmoq qo'ng'iroqlari yoki boshqa tengdosh lokal
  kirish.
- Fayl yuklarini kompak saqlang. Katta baytkod tranzaksiya hajmini va blokni oshiradi
  tarqatish xarajatlari.
- Oddiy kitob o'zgarishlari uchun yozilgan ko'rsatmalarni afzal ko'rish.
  audit va bajarilishi arzonroq.
- Shartnomalarni yangilash va ro'yxatdan o'tkazish huquqlarini yuqori xavf bilan ta'minlash
  operatsion nazoratlar.

Shuningdek qarang:

- [Ko'rsatmalar](/uz/blockchain/instructions.md)
- [Ishtirokchilar](/uz/blockchain/triggers.md)
- [Ruxsatnomalar](/uz/blockchain/permissions.md)
- [Ma'lumotlar modeli sxemasi](/uz/reference/data-model-schema.md)
