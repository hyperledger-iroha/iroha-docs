---
translation_locale: uz
translation_source: /guide/best-practices/data-modeling.md
translation_source_hash: 423f8c17d5d7072d1733ccac2337d70243f6e725f7786e9f2fc7052b0dc7444d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ma'lumotlar modeli {#data-modeling}

Ledger ma'lumotlari mulkdorlik, o'tkazish xatti-harakatlariga asoslangan bo'lishi kerak.
ruxsat chegaralari va so'rovlar namunasi.
auditorlik va deterministik ijro etilishini qo'llab-quvvatlaydigan ifoda.

## Domenlar va hisob raqamlari {#domains-and-accounts}

- Ma'muriy va siyosat chegaralarini ifodalash uchun domenlardan foydalaning.
  domen nomlari stabil, chunki ular hisob va aktiv identifikatorlarida paydo bo'ladi.
- Birgina hisobda aloqasi bo'lmagan mas'uliyatlarni ortiqcha yuklab olishdan qoching.
  foydalanuvchilar, xizmatlar, qo'zg'atuvchilar, operatorlar va to'lov uchun alohida hisobotlar
  sponsorlar.
- Konfiguratsiya va sinovlarda kanonik hisob va domen identifikatorlaridan foydalaning. Iroha
  nomlar kanonik tahlildan so'ng holatga mos keladi.
- Sinov va ishlab chiqarish identifikatsiyalarini nomlar, domenlarda ko'rinadigan darajada ajratib turish
  va konfiguratsiya fayli yo'nalishlari.

Koʻring [Domenlar](/uz/blockchain/domains.md), [Hisobvaraqlar](/uz/blockchain/accounts.md),
va [Nomlashtirish](/uz/reference/naming.md).

## Aktivlar va NFTs {#assets-and-nfts}

- Fungible balanslar va o'tkazilishi mumkin bo'lgan miqdorlar uchun raqamli aktivlardan foydalaning.
- Foydalanish NFTs yoki alohida egalikdagi yozuvlar uchun domenga oid ob'ektlar.
- Qimmatli qog'ozlar bilan bog'liq bo'lgan davlatni faqat metadatalarda kodlashdan qoching. NFTs
  hayot davri hodisalari, o'tkazish semantikasi va ruxsat tekshiruvlarini taqdim etish
  Metadotlar yo'q.
- Aniqlikni, ta'minot siyosatini, emitentning javobgarligini va yoqilg'i/minsani belgilash
  aktivni arizalarga qo'yishdan oldin vakolatli organ.

Koʻring [Aktivlar](/uz/blockchain/assets.md), [NFTs](/uz/blockchain/nfts.md), va
[RWAs](/uz/blockchain/rwas.md).

## Metadatalar {#metadata}

- Katakcha ob'ektlarining kompakt atributlari uchun metadatalardan foydalaning, masalan, etiketlar,
  integratsiya IDs, siyosat bayroqlari, hashlar, URIs, yoki tarkibiy manzilga ega
  ma'lumotlar.
- Metadata kalitlarini barqaror va hujjatli saqlang.
  mijozlar ularga bog'liq bo'lib, migratsiya muammosi yaratadi.
- Katta hujjatlar, loglar, xususiy foydalanuvchi ma'lumotlari yoki yuqori churn saqlanmasin
  Metadatalarda to'g'ridan-to'g'ri qo'llanma holati.
- Metama'lumotlar zanjirdan tashqari ma'lumotlarga ishora qilganda, bunday tekshirish mumkin bo'lgan ma'lumotni saqlash
  tarkibiy hash sifatida, URI, SoraFS yo'nalish, aniq ma'lumot yoki kompakt
  va'da berish.

Koʻring
[Metadata va Ledger saqlash variantlari](/uz/guide/configure/metadata-and-store-assets.md)
va [Metadatalar](/uz/blockchain/metadata.md).

## Model bo'yicha ruxsatnomalar {#permissions-by-model}

- Amalga oshirish bilan bog'liq emas, balki biznes operatsiyalari atrofida dizayn vazifalari
  Xizmat yoki xizmat nomidan atalgan rolni audit qilish osonroq
  keng texnik qobiliyatdan nomlangan rol.
- Oʻlchamiga ruxsat berish toʻgʻriligi
  ish oqimi.
- Qopish, yoqish, tengdoshlarni boshqarish, ijrochi uchun ruxsatnomalar
  o'zgarishlar, qo'zg'atuvchilarni boshqarish va yuqori ta'sirli metadata mutatsiyasi
  ruxsatnomalar.
- Vaqtinchalik uchun aniq bekor qilish va rotatsiya tartib-taomillarini qo'shish
  ruxsatnomalar.

Koʻring [Ruxsatnomalar](/uz/blockchain/permissions.md) va
[Ruxsat toʻgʻriligi](/uz/reference/permissions.md).

## Soʻrov shakli {#query-shape}

- Sizning soʻrovlaringizni qoʻllab-quvvatlaydigan identifikatorlar va metadata kalitlarini tanlang
  ko'pincha talab qilinadi.
- Keng natijalar toʻplamini sahifalashtirish va foydalanuvchi interfeyslaridan qochish
  Oddiy harakatlar uchun cheklanmagan katta daftar bo'ylab skanerlar.
- Ruxsatdan tashqaridagi indekslarni katta ma'lumotlar va hodisalardan qayta tiklash mumkin
  ular kritik qo'llanma xatti-harakatlari uchun ishlatilayotganda.
