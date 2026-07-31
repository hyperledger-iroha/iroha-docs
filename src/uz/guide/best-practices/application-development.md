---
translation_locale: uz
translation_source: /guide/best-practices/application-development.md
translation_source_hash: f95261b0416abfcd87881135ceb9b604a1cdde2dd1afc79fecf9c113a256a8c7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ilovalar ishlab chiqish {#application-development}

Iroha ilovalar tranzaksiya xatti-harakatini aniqlashtirishi kerak, imzolashni davom ettiring
tarkibiy holatni, va so'rovlar va hodisalarni osonlikcha foydalanish
ishlab chiqarishda kuzatish.

## Mijozni oʻrnatish {#client-setup}

- Ilova manba kodidan tashqarida mijoz konfiguratsiyasini saqlash.
  zanjir ID, Torii URL, imzolash hisobi va tranzaksiya moslamalari
  atrof-muhitga oid konfiguratsiya.
- saqlang `client.toml` lokalnet uchun alohida fayllar, Taira, Minamoto, va
  xususiy tarmoqlar. nusxa ko'chirilgan testnet imzochi hech qachon asosiy
  imzolovchi.
- Transaksiya muddatlari va holat vaqtlarini bila turib belgilash.
  hayot muddati normal tarmoq jitter ostida tugashi mumkin, ammo juda uzoq
  takrorlangan ma'lumotlarni asoslash qiyin kechishi mumkin.
- Foydalanish `nonce = true` faqat takrorlangan operatsiyalar alohida bo'lishi kerak
  Ishlab chiqarish uchun o'z ichiga oladigan
  ariza talabnomasi ID Shunday qilib, qayta urinishlar izlanishi mumkin.

Koʻring [Mijozning konfiguratsiyasi](/uz/guide/configure/client-configuration.md) uchun
joriy TOML maydonlar.

## Transaksiyalar {#transactions}

- Transaksiyalarni tiplangandan yaratish SDK iloji bo'lsa, o'rniga ko'rsatmalar
  xomashyo JSON yoki simli yig'ilgan foydali yuklar.
- Preflight muhim faqat o'qish savollar bilan yozadi: hisob mavjudligi,
  aktivlar saldi, ruxsatnoma holati, to'lov aktivlarining mavjudligi va maqsad
  obyekt holati.
- Transaksiya hashini, vakolat hisobini, ko'rsatmalarning qisqartirilishini yozib oling va
  taqdim etishdan oldin davlat o'zgarishi kutilmoqda.
- Kasallik `Rejected`, `Expired`, va vaqt ajratish natijalari boshqacha.
  mijoz yakuniy holatni kuzatmaganligini anglatadi; bu tasdiqlamaydi
  tarmoq tranzaksiyaga e'tibor bermadi.
- Muvaffaqiyatli yozishdan so'ng, hosil bo'lgan holatni so'rov yoki
  biznes faoliyati bilan bog'liq bo'lgan voqea nazorat punkti.

Transaksiya mexanikasi uchun qarang [Transaksiyalar](/uz/blockchain/transactions.md).

## Savollar va voqealar {#queries-and-events}

- O'zgarish xabarlari uchun joriy holat va hodisalar oqimlari so'rovlaridan foydalaning.
  O'yinlarni qayta-qayta keng so'rovlar bilan almashtirishdan qoching.
- Hisob, aktiv va blok kabi keng takrorlanadigan so'rovlarni sahifalashtirish
  ro'yxatga olish.
- Subskripsiyalar va triggerlar uchun tor filtrlarni afzal ko'rish.
  diagnostika uchun foydali bo'lsa-da, zaruriy emas va mijoz tomonida bajarilishi mumkin
  qayta ishlash.
- Oʻqish uchun cheklangan tamaki tekshiruvi imzolangan muomala sinovlaridan ajralib tursin .
  yakuniy nuqtalar mavjudligi aniqlanishi osonroq.

Koʻring [Savollar](/uz/blockchain/queries.md), [Tadbirlar](/uz/blockchain/events.md), va
[Filterlar](/uz/blockchain/filters.md).

## Agent yordamida rivojlanish {#agent-assisted-development}

- Agentlar shifokorlarni tekshirib ko'rsin, SDK kod va faqat o'qiladigan tarmoq holati oldin
  ularga tranzaksiya kodini yozishni so'rash.
- To ' g'ri tarmoq sinovlarini o ' tkazish
  `TAIRA_LIVE=1`.
- Xususiy kalitlarni, hisobni tiklash materiallarini qo'ymang. API signallar yoki
  mualliflarning boshliqlarini iltimoslarga yuboradi.
- Har qanday agent jonli testnetni taqdim etishdan oldin muomala rejasi talab qilinadi
  reja tarmoq, vakolatxona, yo'l-yo'riqlarni
  to'lov aktivlari, parvozdan oldin o'qiladigan ma'lumotlar, kutilayotgan natija va qayta urinish xatti-harakati.

O ' zbekiston Respublikasi Taira MCP ish oqimi, qarang
[Oʻzlashtiring SORA 3: Taira va Minamoto](/uz/get-started/sora-nexus-dataspaces.md#taira-mcp-for-agents).

## SDK Hygiena {#sdk-hygiene}

- Pinar SDK va ikkilamchi versiyalarni birgalikda
  [Qo'shish matrisi](/uz/reference/compatibility-matrix.md).
- O'rnatilgan mijoz kodi, snippet va misollarni
  ish maydonini qayta ko'rib chiqish.
- Transaksiyalarni tuzish kodini va integratsiya sinovlarini birlik sinovlari qo'shish
  eng kichik o'qish va yozish yo'nalishlari sizning arizaingiz bog'liq.
