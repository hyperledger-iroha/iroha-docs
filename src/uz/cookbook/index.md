---
translation_locale: uz
translation_source: /cookbook/index.md
translation_source_hash: 58f5247ece30d3755c38d4d24ae4553a35e0d0437476092d568a1be5c8a2ed28
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 ilovalari uchun amaliy qo‘llanma {#iroha-3-application-cookbook}

Iroha 3 bilan ishlashni Taira sinov tarmog‘idan boshlanadigan, tekshirish mumkin bo‘lgan ixcham retseptlar orqali o‘rganing; Minamoto asosiy tarmog‘ida esa faqat o‘qish amallarini bajaring. Har bir retsept amal ochiq o‘qish, moliyalashtirilgan hisobning odatiy yozuvi yoki ruxsat talab qiladigan operatsiya ekanini ko‘rsatadi. Buyruqlar joriy I105 hisob IDs, aniq to‘lov tanlovi va Iroha-ning [`0010c5a70039eac101a4846499ba9ceaf43eb65c`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c) commitida tekshirilgan xatti-harakatdan foydalanadi.

Avval [Taira-ga ulanish](./connect-to-taira.md) retseptini bajaring. U buyruq qatori retseptlari qayta ishlatadigan mijoz sozlamasi va to‘lov metama’lumotini yaratadi. To‘lov aktivi ID-sini bu hujjatdan hech qachon ko‘chirmang: uni Taira kranining joriy javobidan oling.

## Kirish darajalari {#access-levels}

- **Ochiq** — imzolovchi yoki tarmoq ruxsati talab qilinmaydi.
- **Yozishga tayyor** — moliyalashtirilgan Taira sinov hisobi, aniq to‘lovchi va kran qaytargan joriy to‘lov aktivini ishlating.
- **Ruxsat talab qilinadi** — Taira nomlangan bajarish muhiti ruxsatini yoki boshqariladigan nomlar makonini berishi kerak. Bunday ruxsat bo‘lmasa, yaratilgan mahalliy tarmoqdan foydalaning; mahalliy muvaffaqiyat Taira-da vakolat bermaydi.

Amaliy qo‘llanmadagi hech bir retsept Minamoto-ga yozuv yubormaydi.

## Boshlash va yuborish {#start-and-submit}

| Retsept | Taira kirishi | Yakuniy natija |
| --- | --- | --- |
| [Taira-ga ulanish](./connect-to-taira.md) | Yozishga tayyor | Moliyalashtirilgan I105 imzolovchi, joriy to‘lov aktivi va qo‘llangan nazorat tranzaksiyasi |
| [Tranzaksiyalarni yuborish va tekshirish](./submit-and-verify-transactions.md) | Yozishga tayyor | Narxi hisoblangan tranzaksiya, konveyerning yakuniy natijasi va saqlangan kvitansiya |

## Reyestr holati {#ledger-state}

| Retsept | Taira kirishi | Yakuniy natija |
| --- | --- | --- |
| [Hisoblar va taxalluslar](./accounts-and-aliases.md) | Ruxsat talab qilinadi | I105 hisobi va yechiladigan, odam o‘qiy oladigan taxallus |
| [O‘zaro almashtiriladigan aktivlar](./fungible-assets.md) | Ruxsat talab qilinadi | Ro‘yxatdan o‘tgan ta’rif, chiqarilgan qoldiq va tekshirilgan o‘tkazma |
| [NFTs](./nfts.md) | Ruxsat talab qilinadi | Ro‘yxatdan o‘tgan NFT, o‘tkazilgan egalik va amaldan keyingi so‘rov |
| [Metama’lumot](./metadata.md) | Egasi bo‘lgan obyektlar uchun yozishga tayyor; aks holda ruxsat talab qilinadi | Metama’lumot yozuvi va undan keyingi aniq o‘qish |
| [Reyestr holatini so‘rash](./query-ledger-state.md) | Ochiq holat uchun ochiq | Yozuvsiz sahifalangan va filtrlangan natijalar |

## Kirish va avtomatlashtirish {#access-and-automation}

| Retsept | Taira kirishi | Yakuniy natija |
| --- | --- | --- |
| [Ruxsatlar va rollar](./permissions-and-roles.md) | Ruxsat talab qilinadi | Qayta ishlatiladigan rolda jamlangan, doirasi cheklangan ruxsat |
| [Hodisalarni oqimda olish](./stream-events.md) | Ochiq | Uzilishdan keyin qayta ulanib, holatni muvofiqlashtiradigan SSE iste’molchisi |
| [Qo‘zg‘atuvchilar](./triggers.md) | Ruxsat talab qilinadi | Chaqiruv bo‘yicha qo‘zg‘atuvchi, ijro kvitansiyasi va yakunlanish hodisasi |
| [Ko‘p imzo](./multisig.md) | Yozishga tayyor | Og‘irlikli ko‘p imzoli hisob va kvorum tasdiqlagan taklif |

## Ilova andozalari {#application-patterns}

| Retsept | Taira kirishi | Yakuniy natija |
| --- | --- | --- |
| [Aqlli shartnomalar](./smart-contracts.md) | Ruxsat talab qilinadi | Tekshirilgan Kotodama baytkodi, joylashtirish artefaktlari va shartnoma chaqiruvi |
| [Wallet Connect](./wallet-connect.md) | Connect yoqilganida yozishga tayyor | Hamyon tasdiqlagan aktiv o‘tkazmasi va muvofiqlashtirilgan tranzaksiya xeshi |
| [Mahalliy eskrou](./native-escrow.md) | Aktiv egalari uchun yozishga tayyor; nizoni hal qilish ruxsat talab qiladi | Yakuniy holati so‘ralgan mahalliy qulf yoki bozor eskrousi |

## Tekshirilgan misol interfeyslari {#verified-example-surfaces}

Quyidagi belgilar imkoniyatga kira oladigan har bir SDK-ni emas, tegishli retseptdagi ishga tushiriladigan misollarni ko‘rsatadi.

| Retsept | HTTP / curl | CLI | Rust | JavaScript | Python | Kotodama |
| --- | :---: | :---: | :---: | :---: | :---: | :---: |
| Taira-ga ulanish | ✓ | ✓ | — | — | — | — |
| Yuborish va tekshirish | ✓ | ✓ | — | — | — | — |
| Hisoblar va taxalluslar | ✓ | ✓ | — | — | — | — |
| O‘zaro almashtiriladigan aktivlar | ✓ | ✓ | — | ✓ | — | — |
| NFTs | ✓ | ✓ | — | — | — | ✓ |
| Metama’lumot | ✓ | ✓ | — | — | — | — |
| Reyestr holatini so‘rash | ✓ | ✓ | ✓ | ✓ | — | — |
| Ruxsatlar va rollar | — | ✓ | ✓ | — | — | — |
| Hodisalarni oqimda olish | ✓ | — | — | ✓ | — | — |
| Qo‘zg‘atuvchilar | — | ✓ | ✓ | — | — | — |
| Ko‘p imzo | — | ✓ | ✓ | — | — | — |
| Aqlli shartnomalar | — | ✓ | — | — | — | ✓ |
| Wallet Connect | ✓ | — | ✓ | ✓ | — | — |
| Mahalliy eskrou | — | — | ✓ | ✓ | ✓ | ✓ |

Har bir retsept ishlab chiqarish arxitekturasi, operatsiyalar, SDK va API yo‘riqnomalariga havola qiladi. Retseptning o‘zi bitta muvaffaqiyatli yo‘lni hamda natijani isbotlash uchun zarur tekshiruvlarni ko‘rsatadi.
