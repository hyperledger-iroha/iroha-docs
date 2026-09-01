---
translation_locale: uz
translation_source: /guide/configure/metadata-and-store-assets.md
translation_source_hash: b538b2cad11d4fd3b2b7d201a20882389049d3e4453f11baa6f854861bda6b51
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Metama'lumotlar va reyestrni saqlash tanlovlari {#metadata-and-ledger-storage-choices}

Iroha 3 ma'lumot modeli istalgan kalit-qiymat ma'lumotlari uchun alohida `Store` aktiv turiga ega emas. Quyidagi saqlash variantlaridan foydalaning.

## Metama'lumot {#metadata}

Reyestr ob'ektiga tegishli kichik JSON maydonlari uchun [metama'lumot](/uz/blockchain/metadata.md) dan foydalaning:

- ko‘rsatish nomlari va yorliqlari
- integratsiya identifikatorlari
- kichik siyosiy bayroqlar
- kriptografik xeshlar, URIs, CIDs yoki SoraFS yo‘llar, ular kattaroq yuklamalarga ishora qiladi

Metama'lumotlar dunyo holatining bir qismi bo'lib, uni egallagan obyekt bilan birga qaytariladi. Kalitlarni barqaror saqlang, qiymatlarni ixcham qiling va ruxsatlarni aniq belgilang. Katta hujjatlar, jurnallar yoki tez-tez o'zgaradigan ilova holatini to'g'ridan-to'g'ri metama'lumotlarda saqlamang.

## Raqamli Aktivlar va NFTs {#numeric-assets-and-nfts}

Holat qiymatga ega bo‘lganda [aktivlar](/uz/blockchain/assets.md) va [NFTs](/uz/blockchain/nfts.md) dan foydalaning:

- fungible balanslar uchun raqamli aktivlar
- NFTs yagona egalikdagi yozuvlar uchun
- [RWAs](/uz/blockchain/rwas.md) va boshqa soha-ga xos obyektlar, faol maʼlumot modeli ularni ko‘rsatganda

Aktivlar va NFTs o‘z IDlariga, hayot davri hodisalariga, uzatish xatti-harakatlariga va ruxsat tekshiruvlariga ega. Ular egalik, noyoblik yoki uzatish tarixi muhim bo‘lganida metadatalardan yaxshiroqdir.

## Zanjirdan tashqari ma'lumot {#off-chain-data}

Katta yoki o‘zgarmaydigan bo‘lmagan ma’lumotlar uchun off-chain saqlashni ishlating. Zanjirda faqat barqaror havolani saqlang, masalan:

- kontent kriptografik xesh
- a URI
- bir SoraFS yo‘l yoki manifest havolasi
- ilova isboti tomonidan ishlatiladigan ixcham kriptografik majburiyat qiymati

Bu WSV ni kichik saqlaydi, shu bilan birga ilovalarga off-chain yuklamasi on-chain manbasi bilan mos kelishini tekshirish imkonini beradi.

## Joy tanlash {#choosing-a-location}

Ushbu oddiy qoidadan foydalaning:

- Agar bu reyestr ob’ektining ixcham atributi bo‘lsa, metadata-dan foydalaning.
- Agar u qiymatga ega yoki uzatilishi mumkin bo'lsa, uni aktiv, NFT yoki domenga oid ob'ekt sifatida modellashtiring.
- Agar u katta, yuqori aylanishli yoki ilova-ga xos bo'lsa, uni WSV tashqarisida saqlang va blokcheynda tasdiqlanishi mumkin bo‘lgan havolani joylashtiring.

Metama'lumot ruxsatnomalari uchun, [Ruxsat tokenlari](/uz/reference/permissions.md) ga qarang.
