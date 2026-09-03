---
translation_locale: uz
translation_source: /blockchain/smart-contracts.md
translation_source_hash: c69237ded68aee4d663b00f1aa13d400c4763682af9bd5b5a49ca0edb5905dd2
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Aqlli shartnomalar {#smart-contracts}

Iroha tranzaksiyalari `Executable` foydali yuklarni amalga oshiradi. Hozirgi ma'lumot modeli quyidagilarni qo'llab-quvvatlaydi:

- `Executable::Instructions`: Iroha maxsus yo'l-yo'riqlarining tartiblangan to'plami.
- `Executable::ContractCall`: ishga tushirilgan shartnoma instansiyasiga qo'shimcha ma'lumotnoma chaqirichi
- `Executable::Ivm`: Iroha VM bytekod
- `Executable::IvmProved`: Iroha VM bayt kodi oldindan hisoblangan ko'rsatma qoplamasi va isbot majburiyatlari bilan

Kotodama — Iroha'ning yuqori darajali aqlli shartnomalar tili. `.ko` manba fayli deterministik IVM bayt-kodiga kompilyatsiya qilinadi va joylashtirish uchun odatda `.to` artefakti sifatida saqlanadi. Kotodama faqat IVM-ni nishonga oladi. U RISC-V yoki WebAssembly-ni nishonga olmaydi.

Birinchi reliz faqat ABI 1-versiyasini qo‘llab-quvvatlaydi. syscall va pointer-ABI siyosati shartnomani qabul qilish va bajarish vaqtida hech qanday shartsiz qo‘llanadi; ish vaqti mosligi tugmasi mavjud emas.

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

## Shartnoma Hayot davri va mulkdorlik {#contract-lifecycle-and-ownership}

Har bir jo'natilgan manzil `ContractLifecycleControlV1` yozuvini saqlaydi, shu jumladan shartnoma faoliyatsiz bo'lsa ham. Yozuvda birinchi jo'natishning o'zgarmas kelib chiqishi, joriy va davom etayotgan egasi, bekor qilinishi mumkin bo'lgan Parlament delegatsiyasi, faol kod hash, nol bo'lmagan solishtirish-va almashtirish tekshiruvi mavjud; va har qanday saqlab qolgan favqulodda holatlarni saqlash. To'g'ridan-to'g'ri ishga tushirish taqdim etuvchi hisobvaraqni egasi sifatida tayinlaydi va uni joylashtirishning kelib chiqishi sifatida qayd etadi. Parlament ishga tushirishida parlamentga egalik qiladi va uning taklif qiluvchi, taklif tarkibini ID qayd etadi; va muvaffaqiyatli boshqaruv urinishi ID faqat kelib chiqish sifatida.

Konfiguratsiya qilingan himoyalangan nom maydonlari Parlament tomonidan ishga tushirilishi uchun ajratilgan. `CanRegisterSmartContractCode` artefaktni ro'yxatdan o'tkazishga ruxsat beradi, lekin himoyalangan nomlar maydonida to'g'ridan-to'g'ri ishga tushirilishiga yoki xom faollashtirilishiga ruxsat bermaydi; u erda dastlabki hayot davri to'plami Parlament tomonidan tasdiqlangan ishga tushirish yo'li bilan yaratilishi kerak.

Hayot davri egasi yoki bitta hisob raqamidir yoki Parlament. Hisobvaraq egaligi o'zgarishlaridan `OfferContractOwnership` foydalaning, so'ngra bo'sh turgan egasining `AcceptContractOwnership`; joriy egasi `CancelContractOwnershipOffer` bilan qabul qilinmagan taklif. Qabul qilish har qanday Parlament delegatsiyasini tasdiqlaydi. Hisobni olib tashlash hisobvaraqning shartnomasiga ega bo'lganida yoki to'xtamayotgan taklifda ishtirok etayotgan mulkdor bo'lsa rad etiladi.

Hisobvaraq egasi Parlamentga kontraktni yangilash, faollashtirish yoki o'chirib tashlashga ruxsat berishi mumkin va keyinchalik ushbu vakolatni bekor qilishi mumkin. Parlamentga tegishli o'zgarishlar va parlamentning qabul qilishi tasdiqlangan boshqaruvni amalga oshirish orqali amalga oshiriladi.

Raw `ActivateContractInstance` va `DeactivateContractInstance` yo'l-yo'riqlari faqat joriy hisob raqami egasi uchun mavjud. Ular rekordning to'g'ri `expected_revision` bo'lishi kerak; eskirgan yoki nol ko'riklar yopilmaydi. Xom faollashtirish hayoti davrining rekordini yaratolmaydi va u `active_code_hash` o'zgartirishdan oldin ro'yxatdan o'tgan artefakt, manifest va ABI ni tasdiqlaydi. faol kod hashini tozalaydi, ammo mulkdorlik va kelib chiqishini saqlab qoladi. Har bir muvaffaqiyatli hayot davridagi o'tish qayta ko'rib chiqishni ilgari suradi va to'liq post-davlatni chiqaradi.

Parlamentning favqulodda darajadagi taklifiga faqat to'liq parlament quvurlari orqali va Asosiy hujjaning dastlabki o'rinlarining kamida uchdan ikki qismidan "Aye" ovozlari bilan cheklov qo'llash mumkin. U faqat qo'ng'iroqlarni to'xtatish va ijro etishni boshlash mumkin: u uzaytirilishi yoki kod, mulkdorlik yoki delegatsiyani o'zgartirishi mumkin emas. Qo'ng'ichishlar va moslashtiriladigan ishga tushirishlarni qo'llash balandligidan boshlab muddati tugagangacha blokirovka qilish mumkin, ammo muddatlari o'tadi. Expiry avtomatik ravishda ijroni tiklaydi, ammo to'xtatishni o'chirmaydi. Sertifikatlangan `CompleteEmergencyHoldRetrospective` harakat keyinchalik aniq to'xtatni IDs bog'lashi va ro'yxatdan o'tishdan oldin nol bo'lmagan qidiruv ildizini o'zlashtirishi kerak; ushbu retrospektivani tugatmaguncha boshqa to'xtatib turish qo'llanilishi mumkin emas.

API dasturi yoqilg'i bo'lganda, saqlangan holatni `GET /v1/gov/contracts/{contract_address}` bilan o'qing. Uning `found` maydoni hayot davri ro'yxati mavjudligini anglatadi va manzil hozirda faol kodga ega emasligini anglatadi.

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
