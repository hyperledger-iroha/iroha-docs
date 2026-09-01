---
translation_locale: uz
translation_source: /blockchain/smart-contracts.md
translation_source_hash: 4281cb307762443c85b67659310da69f1f1ea5b99926bad43b90abe36e87075e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Aqlli shartnomalar {#smart-contracts}


Iroha tranzaksiyalari `Executable` foydali yuklarini bajaradi. Joriy ma’lumotlar modeli quyidagilarni qo‘llab-quvvatlaydi:

- `Executable::Instructions`: Iroha maxsus ko‘rsatmalaridan iborat tartibli majmua;
- `Executable::ContractCall`: joylashtirilgan shartnoma nusxasini havola orqali chaqirish;
- `Executable::Ivm`: Iroha VM baytkodi;
- `Executable::IvmProved`: oldindan hisoblangan ko‘rsatmalar qoplami va isbot majburiyatlariga ega Iroha VM baytkodi.

Kotodama — Iroha yuqori darajadagi aqlli shartnoma tili. `.ko` manba fayli deterministik IVM baytkodiga kompilyatsiya qilinadi va joylashtirish uchun odatda `.to` artefakti sifatida saqlanadi. Kotodama faqat IVM ni nishonlaydi; RISC-V yoki WebAssembly ni emas.

Birinchi reliz faqat ABI ning 1-versiyasini qo‘llab-quvvatlaydi. Tizim chaqiruvlari va ko‘rsatkich-ABI siyosati qabul qilish hamda bajarishda majburiy qo‘llanadigan yagona shartsiz V1 shartnomasidir; muqobil bajarish muhiti rejimi yo‘q.

## Aqlli shartnomalardan qachon foydalanish kerak {#when-to-use-smart-contracts}

Tranzaksiyani bevosita ifodalash mumkin bo‘lsa, odatiy ko‘rsatmalardan foydalaning:

- obyektlarni ro‘yxatdan o‘tkazish yoki chiqarish;
- aktivlarni zarb qilish, yoqish yoki o‘tkazish;
- metama’lumotni yangilash;
- ruxsatlarni berish yoki bekor qilish;
- triggerni bajarish;
- zanjirdagi parametrlarni o‘rnatish.

Tranzaksiyaga statik ko‘rsatmalar ketma-ketligi bilan ifodalash noqulay bo‘lgan paketlangan mantiq kerak bo‘lsa yoki joylashtirilgan shartnoma nusxasini havola orqali chaqirish lozim bo‘lsa, aqlli shartnomadan foydalaning.

## IVM bajariladigan foydali yuklari {#ivm-executables}

`Executable::Ivm` xom IVM baytkodini olib yuradi. Tugunlar uni zanjir uchun sozlangan bajarish muhiti chegaralarida bajaradi. Baytkodni kichik va deterministik saqlang; shartnomalar tranzaksiya bajarilishining bir qismi bo‘lgani uchun konsensusga ta’sir qiladi.

`Executable::IvmProved` isbot olib yuradigan jarayonlar uchun mo‘ljallangan. U quyidagilarni o‘z ichiga oladi:

- IVM baytkodi;
- deterministik ko‘rsatmalar qoplami;
- bajarish hodisalari majburiyati;
- gaz siyosati majburiyati.

Isbot qoplamni bajarilgan baytkodga bog‘laydi. Konveyer siyosatiga qarab, tasdiqlovchilar isbotni tekshirishi va qo‘shimcha xavfsizlik tekshiruvi sifatida bajarishni takrorlashi mumkin.

## Joylashtirilgan shartnoma chaqiruvlari {#deployed-contract-calls}

`Executable::ContractCall` joylashtirilgan shartnoma nusxasini manzil orqali chaqiradi. Shartnoma kodi alohida ro‘yxatdan o‘tgan va tranzaksiyalar baytkodni har safar olib yurish o‘rniga uni havola orqali chaqirishi kerak bo‘lsa, undan foydalaning.

## Shartnoma hayot davri va egalik {#contract-lifecycle-and-ownership}

Har bir joylashtirilgan manzil shartnoma faol bo‘lmaganida ham `ContractLifecycleControlV1` yozuvini saqlaydi. Yozuvda birinchi joylashtirishning o‘zgarmas kelib chiqishi, joriy va kutilayotgan ega, bekor qilinadigan Parlament vakolati, faol kod xeshi, noldan farqli solishtirish-va-almashtirish tahriri hamda saqlanayotgan favqulodda cheklov bo‘ladi. Bevosita joylashtirish joylashtiruvchi hisobni qayd etadi. Parlament joylashtirishi esa taklifchi, taklif kontenti identifikatori va muvaffaqiyatli boshqaruv urinish identifikatorini qayd etadi.

Hayot davri egasi bitta hisob yoki Parlament bo‘ladi. Hisob egaligini o‘zgartirish alohida taklif va qabul qilishdan iborat; taklif qabul qilinsa, Parlamentga berilgan har qanday vakolat bekor qilinadi. Hisob egasi Parlamentga shartnomani faollashtirish yoki faolsizlantirish huquqini berib, keyin bu vakolatni bekor qilishi mumkin, ammo vakolat Parlamentga egalikni o‘tkazishga hech qachon ruxsat bermaydi. Parlamentga tegishli o‘zgarishlar va Parlamentning qabul qilishi sertifikatlangan boshqaruv ta’sirlari orqali amalga oshiriladi.

Xom `ActivateContractInstance` va `DeactivateContractInstance` ko‘rsatmalari faqat joriy hisob egasiga ochiq. Ular yozuvning aniq `expected_revision` qiymatini olib yurishi shart; eskirgan yoki nol tahrir xavfsiz tarzda rad etiladi. Xom faollashtirish hayot davri yozuvini yarata olmaydi va `active_code_hash` ni o‘zgartirishdan avval ro‘yxatdan o‘tgan artefakt, manifest va ABI ni tekshiradi. Faolsizlantirish faol kod xeshini tozalaydi, ammo egalik va kelib chiqishni saqlaydi. Har bir muvaffaqiyatli hayot davri o‘tishi tahrirni oshiradi va amaldan keyingi butun holatni chiqaradi.

Faollashtirish manifest e’lon qilgan bitta hayot davri ilgagini ham tayyorlashi mumkin. Manifestida `EntryPointKind::Hajimari` kirish nuqtasi (`hajimari`/`始まり`) bo‘lgan dastlabki faollashtirish `Hajimari` ni tayyorlaydi. Faol manzilni manifestida `EntryPointKind::Kaizen` kirish nuqtasi (`kaizen`/`改善`) bo‘lgan kodga qayta bog‘lash `Kaizen` ni tayyorlaydi. Bog‘lanish darhol o‘zgaradi, ammo shartnoma hali tayyor emas: aynan tayyorlangan ilgak muvaffaqiyatli tugamaguncha har bir `Kotoage` va `View` chaqiruvi rad etiladi. Ilgak kutilayotganida boshqa faollashtirish ham rad etiladi.

Tayyorlangan ilgakni ayni shartnoma manzili va yangi kod xeshida `Executable::ContractCall` bilan, manifest e’lon qilgan aniq `hajimari` yoki `kaizen` kirish nuqtasi va argumentlardan foydalanib chaqiring. Bajarish muhiti manzil va selektor doirasidagi `CanInvokeContractEntrypoint` ruxsatini o‘zi beradi; chaqiruvchilar bu ruxsatni yaratmasligi yoki bermasligi kerak. Kutilayotgan belgi bajarish muhiti hosil qilgan deterministik `transition_id` va yangi `code_hash` ni, `Kaizen` belgisi esa `previous_code_hash` ni ham o‘z ichiga oladi. Mijozlar `transition_id` ni hisoblamaydi ham, yubormaydi ham. Muvaffaqiyatli ilgak belgini atomik sarflaydi, muvaffaqiyatsiz ilgak esa keyinroq qayta urinish uchun uni kutilayotgan holatda qoldiradi.

Parlamentning favqulodda darajadagi taklifi joriy tahrir, kod xeshi va nol bo‘lmagan hodisa dayjestini bog‘lasa, ko‘pi bilan 3 600 blokka cheklov joriy qilishi mumkin. Chaqiruvlar cheklov joriy qilingan balandlikdan uning amal qilish muddati tugaydigan balandlikkacha, oxirgi balandlikni kiritmagan holda, bloklanadi. Muddat tugashi bajarilishni tiklaydi, ammo cheklov yozuvini o‘chirmaydi. Yozuvni tozalashdan oldin sertifikatlangan `CompleteEmergencyHoldRetrospective` amali aynan shu cheklov identifikatorlari va dayjestini hamda nol bo‘lmagan xulosa ildizini bog‘lashi shart; retrospektiva yakunlanmaguncha boshqa cheklov joriy qilib bo‘lmaydi.

Ilova API si yoqilganda saqlanayotgan holatni `GET /v1/gov/contracts/{contract_address}` bilan o‘qing. Uning `found` maydoni hayot davri yozuvi mavjudligini bildiradi, manzilda hozir faol kod borligini emas.

## Ishlatishga oid tavsiyalar {#operational-guidance}

- Shartnomalarni deterministik saqlang. Shartnoma xatti-harakati mahalliy tizim soati, mezbon fayl tizimi holati, tarmoq chaqiruvlari yoki tugunga xos boshqa kirishlarga bog‘liq bo‘lmasligi kerak.
- Foydali yuklarni ixcham saqlang. Katta baytkod tranzaksiya hajmi va blok tarqatish xarajatini oshiradi.
- Reyestrdagi sodda o‘zgarishlar uchun tiplashtirilgan ko‘rsatmalarni tanlang. Ularni tekshirish osonroq va bajarish arzonroq.
- Shartnomani yangilash va ro‘yxatdan o‘tkazish ruxsatlarini yuqori xavfli operatsion boshqaruv deb hisoblang.

Shuningdek qarang:

- [Ko'rsatmalar](/uz/blockchain/instructions.md)
- [Triggerlar](/uz/blockchain/triggers.md)
- [Ruxsatnomalar](/uz/blockchain/permissions.md)
- [Ma'lumotlar modeli sxemasi](/uz/reference/data-model-schema.md)
