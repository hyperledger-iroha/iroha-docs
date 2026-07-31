---
translation_locale: uz
translation_source: /guide/configure/metadata-and-store-assets.md
translation_source_hash: b538b2cad11d4fd3b2b7d201a20882389049d3e4453f11baa6f854861bda6b51
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Metadatalar va Ledgerni saqlash variantlari {#metadata-and-ledger-storage-choices}

Iroha 3 ma'lumotlar modeli har qanday key-value ma'lumotlari uchun alohida `Store` aktiv turiga ega emas. Quyidagi saqlash imkoniyatlaridan foydalaning:

## Metadatalar {#metadata}

[metadatalar ](/uz/blockchain/metadata.md) dan foydalanib, kattalik ob'ektiga tegishli kichik JSON maydonlari uchun:

- nomlar va etiketlarni ko'rsatish
- integratsiya IDs
- kichik siyosat bayroqlari
- URIs, CIDs yoki SoraFS yo'nalishlari katta foydali yuklarga ishora qiladi.

Metadotlar dunyo holatiga kiradi va uni egasi bo'lgan ob'ekt bilan qaytariladi. kalitlarni barqaror saqlang, qiymatlar kompak bo'lsin va ruxsatnomalar aniq bo'lsin. Katta hujjatlarni, jurnallarni yoki yuqori churnli ilova holatini to'g'ridan-to'g'ri metadatalarga saqlash kerak emas.

## Raqamli aktivlar va NFTs {#numeric-assets-and-nfts}

Davlat qiymatga ega bo'lganda [ aktsiyalardan ](/uz/blockchain/assets.md) va [NFTs](/uz/blockchain/nfts.md) foydalanish:

- Fungible saldolar uchun raqamli aktivlar
- NFTs yagona egalikdagi yozuvlar uchun
- [RWAs](/uz/blockchain/rwas.md) va faol ma'lumotlar modeli ularni ochib berganda, boshqa domenga mos bo'lgan obyektlar

Assetlar va NFTs o'zlarining IDs, hayot davri voqealari, o'tkazish xatti-harakati va ruxsatnoma tekshiruvlariga ega. Ular egalik, kamchilik yoki o'tkazish tarixiga taalluqli bo'lganda metadatalardan yaxshiroqdir.

## Xatchoʻpdan tashqari maʼlumotlar {#off-chain-data}

Katta yoki o'zgaruvchan foydali yuklar uchun zanjirdan tashqarida saqlashni ishlating.

- tarkibiy hash
- a URI
- SoraFS yo'nalishi yoki manifest ma'lumotnomasi
- ilova guvohnomasiga ko'ra qo'llaniladigan qat'iy majburiyat

Shunday qilib, WSV kichik bo'lib qoladi va hali ham ilovalar zanjirdan tashqaridagi foydali yukning zanjirdagi ma'lumotga mos kelayotganini tekshirishlariga imkon beradi.

## Joyni tanlash {#choosing-a-location}

Bu qoidaga amal qiling:

- Agar bu kitob ob'ektining kompakt atributidan iborat bo'lsa, metadatalardan foydalaning.
- Agar u qiymatga ega bo'lsa yoki o'tkazilishi mumkin bo'lsa, uni aktiv NFT yoki domen-mahsus ob'ekt sifatida namunalashtiring.
- Agar u katta bo'lsa, ko'p ishlatiladigan yoki maxsus qo'llanilgan bo'lsa WSV tashqarisida saqlash va verifikatsiya qilinishi mumkin bo'lgan ma'lumotnoma zanjirga joylashtirish.

Metadatalarga ruxsatnomalar uchun [Ruxsat belgisi ](/uz/reference/permissions.md) ni ko'ring.
