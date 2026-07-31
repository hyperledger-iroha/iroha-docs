---
translation_locale: uz
translation_source: /blockchain/smart-contracts.md
translation_source_hash: ed622cdb1d6a47635d0753c98f80aaa903b916133f43bc9fdab268512d0ace69
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Aqlli shartnomalar {#smart-contracts}

Iroha tranzaksiyalari `Executable` foydali yuklarni amalga oshiradi. Hozirgi ma'lumot modeli quyidagilarni qo'llab-quvvatlaydi:

- `Executable::Instructions`: Iroha maxsus yo'l-yo'riqlarining tartiblangan to'plami.
- `Executable::ContractCall`: ishga tushirilgan shartnoma instansiyasiga qo'shimcha ma'lumotnoma chaqirichi
- `Executable::Ivm`: Iroha VM bytekod
- `Executable::IvmProved`: Iroha VM bayt kodi oldindan hisoblangan ko'rsatma qoplamasi va isbot majburiyatlari bilan

Kotodama - bu Iroha ning yuqori darajadagi aqlli shartnoma tili. `.ko` manba fayli deterministik IVM bayt kodiga yig'iladi, an'anaviy ravishda ishga tushirish uchun `.to` artefakt sifatida saqlanadi. Kotodama maqsadlari IVM; u o'z-o'zi RISC-V yoki WebAssembly maqsad emas.

Birinchi nashr faqat ABI versiyasini qo'llab-quvvatlaydi 1. Syscall va pointer-ABI siyosati shartnoma qabul qilinishi va bajarilishi bilan shartsiz amalga oshiriladi; ish vaqti moslashuvchanligi o'zgarishi mavjud emas.

## Aqlli shartnomalardan qachon foydalanish kerak {#when-to-use-smart-contracts}

Transaksiyani to'g'ridan-to'g'ri ifodalash mumkin bo'lganda odatdagi ko'rsatmalardan foydalaning:

- ro'yxatdan o'tkazish yoki uni bekor qilish ob'ektlari
- Minta, yonish yoki o'tkazish aktivlari
- Metadatalarni yangilash
- ruxsatnomalarni berish yoki bekor qilish
- qo'zg ' otish
- zanjirda o'rnatilgan parametrlar

Transaksiya uchun o'rnatilgan logika kerak bo'lganda, uni statik yo'l-yo'riqlar ketma-ketligi sifatida ifodalash qiyin bo'lganida yoki ishga tushirilgan kontrakt instansiyasini ma'lumotnoma orqali chaqirish kerak bo'lsa aqlli shartnoma ishlatish.

## IVM Amalga oshiriladigan qismlar {#ivm-executables}

`Executable::Ivm` xom IVM baytkodini o'z ichiga oladi. Nukllar bu baytkodni zanjir uchun moslashtirilgan ishga tushirish vaqti cheklovlari ichida bajaradi. Baytkodni kichik va deterministik saqlang; shartnomalar bitimlarni amalga oshirishning bir qismi bo'lib, shuning uchun konsensusga ta'sir qiladi.

`Executable::IvmProved` issiqlik o'tkazgichlari uchun mo'ljallangan.

- IVM byte kodi
- deterministik yo'l-yo'riqlarni qoplash
- bajarishga doir tadbirlar majburiyati
- gaz siyosati majburiyati

Dasturi o'rnatilgan bytekod bilan qoplamani bog'laydi. Pipeline siyosatiga qarab, validatorlar dalilni tasdiqlashlari va uni qo'shimcha xavfsizlik tekshiruvi sifatida takrorlashlari mumkin.

## Ishlab chiqarilgan shartnoma qo'ng'iroqlari {#deployed-contract-calls}

`Executable::ContractCall` jo'natilgan kontrakt ko'rinishini manzil orqali chaqiradi. Agar shartnoma kodi alohida ro'yxatdan o'tkazilgan bo'lsa va bitimlar bayt kodini har safar olib yurishning o'rniga, uni ma'lumotnoma asosida chaqirishlari kerak bo'lsa, buni ishlating.

## Operativ yo'l-yo'riq {#operational-guidance}

- Shartnomalarni deterministik saqlang. Shartnoma xatti-harakati mahalliy devor soat vaqti, uy egasi fayl tizimining holati, tarmoq qo'ng'iroqlari yoki boshqa tengdosh lokal ma'lumotlarga bog'liq bo'lishi kerak emas.
- Yordamchi yuklarni kompak saqlang. Katta byte kodlar tranzaksiya hajmini va blok tarqatish xarajatlarini oshiradi.
- Oddiy daftar oʻzgarishlari uchun yozib qoʻyilgan koʻrsatmalarni afzal koʻrish. Ularni audit qilish osonroq va amalga oshirish arzonroq.
- Shartnomalarni yangilash va ro'yxatga olish huquqlarini yuqori xavfli operatsion nazoratlar sifatida ko'rib chiqish.

Shuningdek qarang:

- [Ko'rsatmalar](/uz/blockchain/instructions.md)
- [Ishtirokchilar](/uz/blockchain/triggers.md)
- [Ruxsatnomalar](/uz/blockchain/permissions.md)
- [Ma'lumotlar modeli sxemasi](/uz/reference/data-model-schema.md)
