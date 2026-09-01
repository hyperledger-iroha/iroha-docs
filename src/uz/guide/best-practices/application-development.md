---
translation_locale: uz
translation_source: /guide/best-practices/application-development.md
translation_source_hash: f95261b0416abfcd87881135ceb9b604a1cdde2dd1afc79fecf9c113a256a8c7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ilovalar rivojlanishi {#application-development}

Iroha ilovalari tranzaksiya xatti-harakatini aniqlashtirishi, imzolash holatini saqlab qolishi va so'rovlar va hodisalarni ishlab chiqarishda kuzatish oson bo'lgan tarzda ishlatishi kerak.

## Mijozning oʻrnatilishi {#client-setup}

- Ilova manba kodidan tashqarida mijoz konfiguratsiyasini saqlang. ID, Torii URL zanjirini, imzolash hisobini va muomala sozlamalarini atrof-muhitga oid konfiguratsiyalardan yuklab oling.
- `client.toml` fayllarini lokalnet, Taira, Minamoto va xususiy tarmoqlar uchun alohida saqlang. Testnet imzochisi nusxasi hech qachon mainnet imzochisiga aylanishi kerak emas.
- Transaksiya muddatlari va status vaqtlarini bila turib o'rnating. juda qisqa umr ko'rish odatiy tarmoq g'amginligi ostida tugashi mumkin, juda uzoq bo'lsa, takrorlangan ma'lumotlarni asoslash qiyinroq qiladi.
- `nonce = true` ni faqat takrorlangan operatsiyalarda alohida hashlar bo'lishi kerak bo'lganda ishlating. Idempotent biznes operatsiyalari uchun ilova so'rovini ID saqlash va qayta ishlatish, shuning uchun qayta urinishlar izlanishi mumkin.

Joriy TOML maydonlari uchun [Klientning konfiguratsiyasi](/uz/guide/configure/client-configuration.md)-ni ko'ring.

## Transaksiyalar {#transactions}

- Agar iloji bo'lsa, xom JSON yoki simli yig'ilgan foydali yuklar o'rniga SDK yozuvi ko'rsatmalaridan tranzaksiyalarni quring.
- Preflight muhim faqat o'qiladigan so'rovlar bilan yozadi: hisob mavjudligi, aktiv balanslari, ruxsatnoma holati, to'lov aktivlarining mavjudligi va maqsad ob'ekti holati.
- Transaksiya hashini, vakolat hisobini, ko'rsatmalarning qisqartmasi va kutilayotgan holat o'zgarishini taqdim etishdan oldin yozib oling.
- `Rejected`, `Expired` bilan boshqacha muomala qilish va vaqt ajratish natijalari turlicha. Vaqt o'tishi mijoz yakuniy holatni kuzatmaganligini anglatadi; u tarmoq tranzaksiyaga beparvo ekanligini isbotlamaydi.
- Muvaffaqiyatli yozishdan so'ng, hosil bo'lgan holatni biznes operatsiyasiga mos keladigan so'rov yoki hodisa tekshiruvi bilan tasdiqlash.

Transaksiya mexanikasini ko'rish uchun [Transaksiyalar](/uz/blockchain/transactions.md)

## So'rovlar va voqealar {#queries-and-events}

- Oʻzgarishlarni bildirish uchun joriy holat va hodisalar oqimlari soʻrovlaridan foydalaning. O'yinlarni qayta-qayta keng so'rovlar bilan almashtirishdan qoching.
- Hisob, aktiv va blok ro'yxatlari kabi keng takrorlanishi mumkin bo'lgan so'rovlarni sahifalashtirish.
- Subscriptions va trigger uchun tor filtrlarni afzal ko'rish. keng filtrlar diagnostika uchun foydali, lekin zaruriy bo'lmagan ijro va mijoz tomoni qayta ishlash qo'shishi mumkin.
- Oxirgi nuqtalar mavjudligini aniqlash osonroq bo'lishi uchun, faqat o'qiladigan tutun tekshiruvlarini imzolangan bitim sinovlaridan ajratib qo'ying.

Qarang [So'rovlar](/uz/blockchain/queries.md), [Havf-havoyatlar](/uz/blockchain/events.md) va [Filterlar](/uz/blockchain/filters.md).

## Agentlar yordamida rivojlanish {#agent-assisted-development}

- Agentlardan tranzaksiya kodini yozishni so'rashdan oldin hujjatlarni, SDK kodini va faqat o'qish uchun tarmoq holatini tekshiringlar.
- `TAIRA_LIVE=1` kabi atrof muhit bayrog'i ortida jonli tarmoq sinovlarini o'tkazing.
- Xususiy kalitlarni, hisobni tiklash materialini, API tokenlarini yoki yo'naltirilgan autentifikatsiya sarlavhalarini ko'rsatkichlarga qo'ymang.
- Har qanday agent jonli testnet tranzaksiyasini taqdim etishdan oldin muomala rejasi talab qilinadi. rejada tarmoq, vakolat, ko'rsatmalar, to'lov aktivlari, parvozdan oldingi o'qishlar, kutilayotgan natija va qayta urinish xatti-harakatlari nomlanishi kerak.

Taira MCP ish oqimi uchun [ni ko'rish: SORA 3: Taira va Minamoto](/uz/get-started/sora-nexus-dataspaces.md#taira-mcp-for-agents).

## SDK gigiyena {#sdk-hygiene}

- Pin SDK va ikkilamchi versiyalar [ Qo'shiqlilik matrisi](/uz/reference/compatibility-matrix.md) yordamida birgalikda.
- Yaratilgan mijoz kodi, snippetlar va namunalarni yuqori tomonga o'rnatilgan ish maydonini qayta ko'rib chiqish bilan sinxronlashtiring.
- Transaksiyalarni barpo etish kodini yaratish uchun birlik sinovlarini va sizning dasturingiz bog'liq bo'lgan eng kichik o'qish va yozish yo'llari uchun integratsiya sinovlarini qo'shing.
