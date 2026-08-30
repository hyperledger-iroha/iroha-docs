---
translation_locale: uz
translation_source: /blockchain/smart-contracts.md
translation_source_hash: 4281cb307762443c85b67659310da69f1f1ea5b99926bad43b90abe36e87075e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Aqlli shartnomalar {#smart-contracts}


Iroha operatsiyalari `Executable` foydali yuklarni amalga oshiradi. Hozirgi ma'lumotlar modeli quyidagilarni qo'llab-quvvatlaydi:

- `Executable::Instructions`: Iroha maxsus yo'l-yo'riqlarining tartiblangan to'plami.
- `Executable::ContractCall`: ishga tushirilgan shartnoma instansiyasiga qo'shimcha ma'lumotnoma chaqirichi
- `Executable::Ivm`: Iroha VM bytekod
- `Executable::IvmProved`: Iroha VM bayt kodi oldindan hisoblangan ko'rsatma qoplamasi va isbot majburiyatlari bilan

Kotodama bo ' lmoqda Iroha yuqori darajadagi aqlli shartnoma tili. `.ko` manbali fayllarni deterministik IVM Byte kod, an'anaviy ravishda `.to` joylashtirishga mo'ljallangan artefakt. Kotodama maqsadlar IVM Faqatgina. RISC-V yoki WebAssembly.

Birinchi nashr faqat ABI versiyasini qo'llab-quvvatlaydi 1. Syscall va pointer-ABI siyosati bir shartsiz V1 shartnomasi bo'lib, uni qabul qilish va ijro etish orqali amalga oshiriladi; boshqa ishga tushirish vaqti usuli mavjud emas.

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

Dasturi o'rnatilgan bytekod bilan qoplamani bog'laydi. Pipeline siyosatiga qarab, tasdiqlovchilar dalilni tasdiqlashlari va uni qo'shimcha xavfsizlik tekshiruvi sifatida takrorlashlari mumkin.

## Ishlab chiqarilgan shartnoma qo'ng'iroqlari {#deployed-contract-calls}

`Executable::ContractCall` jo'natilgan kontrakt ko'rinishini manzil orqali chaqiradi. Agar shartnoma kodi alohida ro'yxatdan o'tkazilgan bo'lsa va bitimlar bayt kodini har safar olib yurishning o'rniga, uni ma'lumotnoma asosida chaqirishlari kerak bo'lsa, buni ishlating.

## Shartnoma Hayot davri va mulkdorlik {#contract-lifecycle-and-ownership}

Har bir jo'natilgan manzil `ContractLifecycleControlV1` yozuvini saqlaydi, shu jumladan shartnoma faoliyatsiz bo'lsa ham. Yozuvda birinchi jo'natishning o'zgarmas kelib chiqishi, joriy va davom etayotgan egasi, Parlamentning istisno qilinishi mumkin bo'lgan delegatsiyasi, faol kod hash, noldan tashqari solishtirish-va almashtirish tekshiruvi mavjud; va har qanday saqlab qolgan favqulodda holatlarni saqlash. To'g'ridan-to'g'ri ishga tushirish ishga tushirish hisobini qayd etadi. Parlament ishga tushirish uning taklifchisi, taklif tarkibi ID va muvaffaqiyatli boshqaruv urinishlarini ID qayd etadi.

Hayot davri egasi yoki bitta hisobvaraq yoki Parlamentdir. Hisobvaraq egaligi o'zgarishlarida alohida taklif va qabul qilinadi; taklifni qabul qilish har qanday Parlament delegatsiyasidan voz kechadi. Hisobvaraq egasi Parlamentga kontraktni faollashtirishga yoki uni deaktiv qilishga ruxsat berishi mumkin. keyinchalik ushbu delegatsiyani bekor qiladi, lekin delegatsiya hech qachon Parlamentga egalikni o'tkazishga ruxsat bermaydi. Parlament tomonidan o'zgartirilgan o'zgarishlar va parlamentning qabul qilishi tasdiqlangan boshqaruvni amalga oshirish orqali amalga oshiriladi.

Raw `ActivateContractInstance` va `DeactivateContractInstance` ko'rsatmalari faqat joriy hisob raqami egasi uchun mavjud. Ular rekordning to'g'ri `expected_revision` bo'lishi kerak; Ish vaqti eskirgan yoki nol o'zgartirishlarni rad etadi. Xom faollashtirish hayoti davrining rekordini yaratolmaydi va u `active_code_hash` o'zgartirishdan oldin ro'yxatdan o'tgan artefakt, manifest va ABI ni tasdiqlaydi. faol kod hashini tozalaydi, ammo mulkdorlik va kelib chiqishini saqlab qoladi. Har bir muvaffaqiyatli hayot davridagi o'tish qayta ko'rib chiqishni ilgari suradi va to'liq post-davlatni chiqaradi.

Aktivlashtirish, shuningdek, bir manifest-deklaratsiyalangan hayot davomiyligi ho'ki o'tishi mumkin. Manifestida `EntryPointKind::Hajimari` kirish punkti (`hajimari`/`始まり`) bosqichlari `Hajimari`. Aktiv manzilni kodga qayta qo'yish `EntryPointKind::Kaizen` kirish punkti (`kaizen`/`改善`) bosqichlari `Kaizen`. Shartnoma darhol o'zgarib turadi, ammo shartnoma hali tayyor emas: har bir `Kotoage` va `View` to'g'ri bosqichga ko'tarilgan xok muvaffaqiyatli bo'lguncha qo'ng'iroq rad qilinadi.

`hajimari` yoki `kaizen` aniq kirish nuqtasi va uning manifestida bayon etilgan dalillarni qo'llab-quvvatlagan holda, `Executable::ContractCall` bilan bosqichma-bosqich bo'lgan hoqni xuddi shu shartnoma manzilida va yangi kod hashidan chaqiring. Ish vaqti `CanInvokeContractEntrypoint` ruxsatnomasini manzil va tanlovchi tomonidan ko'rib chiqiladi; qo'ng'iroq qiluvchilar ushbu ruxsatni yaratishi yoki bermasligi kerak. Cheklanib turgan markerda ish vaqti natijasida hosil bo'ladigan, deterministik `transition_id` va yangi `code_hash` mavjud; `Kaizen` belgisi ham `previous_code_hash`. Mijozlar `transition_id` ni hisoblab ham, taqdim ham qilmaydilar. Muvaffaqiyatli qamish markerni atomik ravishda iste'mol qiladi, muvaffaqiyatsiz qolgan qamish esa uni keyinchalik qayta sinab ko'rish uchun kutmoqda.

Parlamentning favqulodda darajadagi taklifi amaldagi qayta ko'rib chiqish, kod hash va nol bo'lmagan hodisalarni o'chirishni bog'lagan holda eng ko'pida 3600 ta blok uchun to'xtatishni qo'llashi mumkin. Vaqt tugashi ijroni tiklaydi, ammo to'siqni o'chirmaydi. Sertifikatlangan `CompleteEmergencyHoldRetrospective` harakat keyinchalik to'g'ri to'siq IDs ni bog'lashi va yozib olishdan oldin nol bo'lmagan qidiruv ildizini sindirib tashlashi kerak; ushbu retrospektiv mavjud bo'lganda boshqa to'siq qo'yilishi mumkin emas.

API dasturi yoqilg'i bo'lganda, saqlangan holatni `GET /v1/gov/contracts/{contract_address}` bilan o'qing. Uning `found` maydoni hayot davri ro'yxati mavjudligini anglatadi, biroq manzilda hozirgi kunda faol kod mavjud emas.

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
