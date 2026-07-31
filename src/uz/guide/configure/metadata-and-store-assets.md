---
translation_locale: uz
translation_source: /guide/configure/metadata-and-store-assets.md
translation_source_hash: b538b2cad11d4fd3b2b7d201a20882389049d3e4453f11baa6f854861bda6b51
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Metadata va Ledger saqlash variantlari {#metadata-and-ledger-storage-choices}

O ' zbekiston Respublikasi Iroha 3 ma'lumotlar modeli alohida emas `Store` O'zboshimchalik bilan
Key-value ma'lumotlari. Quyidagi saqlash variantlaridan foydalaning.

## Metadatalar {#metadata}

Foydalanish [Metadatalar](/uz/blockchain/metadata.md) kichik JSON tegishli bo'lgan maydonlar
katta o'lcham obyektiga:

- nomlar va etiketlarni ko'rsatish
- integratsiya IDs
- kichik siyosat bayroqlari
- hash, URIs, CIDs, yoki SoraFS kattaroq yuklarga qaratilgan yo'nalishlar

Metadotlar dunyo holatiga kiradi va ega bo'lgan ob'ekt bilan qaytariladi
kalitlarni barqaror saqlang, qiymatlar kompakt va ruxsatnomalar aniq.
katta hujjatlar, jurnallar yoki yuqori churn ilova davlatni bevosita
Metadatalar.

## Raqamli aktivlar va NFTs {#numeric-assets-and-nfts}

Foydalanish [aktivlar](/uz/blockchain/assets.md) va [NFTs](/uz/blockchain/nfts.md) qachon
davlat qiymatga ega:

- O'zgaruvchan saldolar uchun raqamli aktivlar
- NFTs yagona egalikdagi hujjatlar uchun
- [RWAs](/uz/blockchain/rwas.md) va boshqa domenga oid ob'ektlar
  faol ma'lumotlar modeli ularni ochib beradi

Aktivlar va NFTs o'zlarining IDs, hayot davri hodisalari, o'tkazish xatti-harakati,
va ruxsatlarni tekshirish. Ular egalik qilishda metadatalardan yaxshiroqdir,
kamchilik yoki o'tkazish tarixi masalalarini.

## Xatchoʻpdan tashqari maʼlumotlar {#off-chain-data}

Katta yoki o'zgaruvchan faydali yuklar uchun zanjirdan tashqari saqlashni ishlating.
zanjir bo'yicha ma'lumotlar, masalan:

- tarkib hash
- a) URI
- a) SoraFS yo'nalish yoki aniq ma'lumot
- ariza tasdiqlovchi hujjat bilan qo'llaniladigan qat'iy majburiyat

Bu esa WSV kichik bo'lib, hali ham arizalarga ushbu hujjatni tasdiqlash imkonini beradi
zanjirdan tashqaridagi foydali yuk zanjirdagi ma'lumotlarga mos keladi.

## Joyni tanlash {#choosing-a-location}

Quyidagi qoidaga amal qiling:

- Agar bu katta o'lchov ob'ektining kompakt atributidan iborat bo'lsa, metadatalardan foydalaning.
- Agar u qiymatga ega bo'lsa yoki o'tkazilishi mumkin bo'lsa, uni aktiv sifatida ko'rsatish; NFT, yoki
  domen-mahsus ob'ekt.
- Agar u katta bo'lsa, ko'p o'tkazib yuborilgan bo'lsa yoki maxsus qo'llanma bo'lsa , uni
  WSV va verifikatsiya qilinadigan ma'lumotni zanjirga qo'yish.

Metadatalarga ruxsatnomalar uchun ko'ring
[Ruxsat toʻgʻriligi](/uz/reference/permissions.md).
