---
translation_locale: uz
translation_source: /cookbook/index.md
translation_source_hash: cdcfb3549506a65a7dbd1c37672893956a0252153a4075c82333804674aa07b6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 Ilovalar uchun dasturiy ta'minot {#iroha-3-application-cookbook}

qarshi qurish Iroha 3 kichik, tekshirish mumkin bo'lgan retseptlar bilan Taira testnet va saqlash Minamoto har bir retseptda ommaviy o'qiladigan yoki bo'lmaydiganligi qayd etiladi. Oddiy moliyalashtirilgan hisobda yozish yoki ruxsatnomalar bilan bog'liq operatsiya. Buyruqlar joriy foydalanish I105 hisob IDs, aniq to'lov tanlash, va xulq-atvor tekshirib Iroha qo'llab-quvvatlash [`bc7114ed1c7f265a156d2100ff09e851cc95702c`](https://github.com/hyperledger-iroha/iroha/tree/bc7114ed1c7f265a156d2100ff09e851cc95702c).

[ bilan boshlang Taira](./connect-to-taira.md)ga ulanish. Bu buyruq satridagi retseptlar tomonidan qayta ishlatiladigan mijoz konfiguratsiyasi va to'lov metadatalarini yaratadi. Ushbu hujjatdan hech qachon to'lov aktivini ID nusxa olmang: uni joriy Taira faucet javobidan olish.

## Foydalanish darajasi {#access-levels}

- Umumiy  imzolovchi yoki tarmoq ruxsatnomasi talab qilinmaydi.
- Yozib olish uchun tayyor  moliyalashtirilgan Taira sinov hisobvarag'idan, aniq to'lov to'lovchisi va kran tomonidan qaytarilgan joriy to'lov aktividan foydalaning.
- Ruxsat talab qilinadi  Taira nomlangan ishga tushirish vaqti ruxsatnoma yoki boshqariladigan nomlar maydonini berishi kerak. Bu grant mavjud bo'lmagan taqdirda hosil qilingan mahalliy tarmoqdan foydalaning; lokal muvaffaqiyat Taira hokimiyatini bermaydi.

Minamoto nomiga hech qanday pishirish kitob retseptini yubormaydi.

## Boshlang va yuboring {#start-and-submit}

|Resepti |Taira kirish |Siz nima bilan yakunlaysiz ?|
| --------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| [Taira](./connect-to-taira.md) raqamiga ulanish|Yozishga tayyor |Moliyalashtirilgan I105 imzochi, jonli to'lov aktivlari va qo'llaniladigan kanar bitimlari |
| [Transaksiyalarni taqdim etish va tekshirish ](./submit-and-verify-transactions.md) |Yozishga tayyor |Ko'rsatilgan tranzaksiya, terminal quvurlari natijasi va saqlangan rasmga ega |

## Ledger holati {#ledger-state}

|Resepti |Taira kirish |Siz nima bilan yakunlaysiz ?|
| ------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| [Hisobotlar va aliaslar](./accounts-and-aliases.md) |Ruxsat talab etiladi |I105 hisobidan tashqari , inson tomonidan oʻqilishi mumkin boʻlgan hal qilinadigan aliaslar |
| [O'yinli aktivlar](./fungible-assets.md) |Ruxsat talab etiladi |Ro'yxatdan o'tgan ma'lumot, hisoblangan balans va tasdiqlangan transfer |
| [NFTs](./nfts.md) |Ruxsat talab etiladi |Ro'yxatga olingan NFT, o'tkazilgan mulkdorlik va davlatdan keyingi so'rov |
| [Metadatalar](./metadata.md) |Oʻz obyektlari uchun yozishga tayyor; boshqacha ruxsat talab qilinadi |Metadatalarni yozish va aniq oʻqish bilan kuzatish|
| [Query ledger holati](./query-ledger-state.md) |Davlat uchun jamoatchilik |Sahifalashtirilgan va filtrlangan natijalar yozishsiz |

## Kirish va avtomatlashtirish {#access-and-automation}

|Resepti |Taira kirish |Siz nima bilan yakunlaysiz ?|
| --------------------------------------------------- | ------------------- | -------------------------------------------------------------- |
| [Ruxsatlar va vazifalar ](./permissions-and-roles.md) |Ruxsat talab etiladi |Koʻp marta ishlatilishi mumkin boʻlgan rolda toʻplangan aniq ruxsat |
| [Stream hodisalari](./stream-events.md) |Jamoat |Uzib qoʻyilganidan soʻng birlashtiruvchi SSE isteʼmolchisi |
| [Triggerlar](./triggers.md) |Ruxsat talab etiladi |Qo'shimcha qo'ng'iroqni qo'zg'atish, o'tkazib yuborish va yakunlash hodisalari.|
| [Multisig](./multisig.md) |Yozishga tayyor |O ' lchashli ko ' psig ' hisob raqami va quorum bilan tasdiqlangan taklif |

## Ilovalar usuli {#application-patterns}

|Resepti |Taira kirish |Siz nima bilan yakunlaysiz ?|
| --------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [Aqlli shartnomalar](./smart-contracts.md) |Ruxsat talab etiladi |Tekshirilgan Kotodama bayt kodi, ishga tushirish artefaktlari va shartnomaviy chaqiruvi |
| [Bog'lamani ulash](./wallet-connect.md) |Connect qoʻllanilganda yozish uchun tayyor |Valyuta bilan tasdiqlangan aktivlar oʻtkazilishi va kelishilgan bitimlar hashini |
| [Asosiy depozit](./native-escrow.md) |Asset egalari uchun yozishga tayyor; nizolarni hal etish uchun ruxsat talab etiladi |Soʻragan oxirgi holatiga ega mahalliy qulf yoki bozordagi depozit |

## Tekshirilgan namuna yuzalari {#verified-example-surfaces}

Quyidagi belgilar har bir retseptda ishlatilishi mumkin bo'lgan namunalarni tasvirlaydi, ammo ushbu xususiyatga ega bo'lgan har bir SDK emas.

|Resepti |HTTP / curl |CLI |Rust |JavaScript |Python |Kotodama |
| --------------------- | :---------: | :-: | :--: | :--------: | :----: | :------: |
|Taira raqamiga ulanish |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Taqdim qilish va tasdiqlash |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Hisobotlar va aliaslar |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Oʻzgaruvchan aktivlar |      ✓      |  ✓  |  —   |     ✓      |   —    |    —     |
|NFTs |      ✓      |  ✓  |  —   |     —      |   —    |    ✓     |
|Metadotlar |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Soʻrovlar daftarining holati |      ✓      |  ✓  |  ✓   |     ✓      |   —    |    —     |
|Ruxsatlar va vazifalar |      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Oʻtkazilgan hodisalar |      ✓      |  —  |  —   |     ✓      |   —    |    —     |
|Ishtirokchilar |      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Multisig |      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Aqlli shartnomalar |      —      |  ✓  |  —   |     —      |   —    |    ✓     |
|Wallet ulanish |      ✓      |  —  |  ✓   |     ✓      |   —    |    —     |
|Asosiy depozit |      —      |  —  |  ✓   |     ✓      |   ✓    |    ✓     |

Har bir retsept ishlab chiqarish me'mori, operatsiyalari, SDK va API yo'l-yo'riqlariga bog'liq. Receptning o'zi bitta muvaffaqiyatli yo'lni ko'rsatadi. Bundan tashqari, natijani isbotlash uchun zarur bo'lgan tekshiruvlar ham o'z ichiga oladi.
