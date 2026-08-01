---
translation_locale: uz
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# NFTs {#nfts}

Iroha NFT - bu bitta egasiga ega bo'lgan noyob kitob ob'ekti. NFTs dan foydalansangiz, ro'yxatga o'z shaxsiyati, metadatalar, hayot davri voqealari va mulkchilikni o'tkazish semantikasi kerak bo'lsa, lekin raqamli muvozanatga muhtoj emassiz.

Raqamga oʻxshamaydi . [aktiv](/uz/blockchain/assets.md), bir NFT to'g'rilik, mintaqaviylik yoki hisob-kitob miqdori yo'q. NFT bitta ro'yxatdan o'tgan obyekt sifatida mavjud bo'lib, mulkdorlik to'g'ridan-to'g'ri ushbu obyektda kuzatilmoqda.

## Tashkilot {#structure}

Ro'yxatga olingan `Nft` tarkibida quyidagilar mavjud:

- `id`: bir `NftId`
- `content`: NFT faylini tavsiflovchi metadatalar
- `owned_by`: NFT hisobvarag'iga ega bo'lgan hisobvaraq

`content` maydoni `Metadata` xaritasi hisoblanadi. Uni kompak saqlang: deskriptiv maydonlarni, barqaror ma'lumotlarni, hashlarni, URIs yoki SoraFS yo'llarini saqlash. Yirik hujjatlarni, ommaviy axborot vositalarini yoki yuqori churnli ilovalar holatini zanjirdan tashlab qo'ying va faqat tekshirish mumkin bo'lgan ma'lumotni NFT da saqlang.

## Taira bilan sinab ko'ring. {#try-it-on-taira}

Umumiy Taira testnetda hozirda NFT yozuvlari mavjudmi yoki yo'qmi tekshiring:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

NFT nod tomonidan aniqlangan yo'nalishlar uchun jonli OpenAPI hujjatini tekshirish:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

Bo'sh `items` massivi ommaviy testnet uchun haqiqiy javobdir. Bu joriy sahifada NFTs yo'qligini anglatadi, NFT ko'rsatmalari mavjud emasligini emas.

## NFT IDs {#nft-ids}

`NftId` ushbu matn shaklini qo'lladi:

```text
name$domain
name$domain.dataspace
```

Masalan, `badge$docs.universal` ta'riflaydi `badge` NFT bilan `docs.universal` Agar ma'lumotlar maydonasi chiqarib tashlangan bo'lsa, joriy tahlilchi ushbu `universal` ma'lumotlar maydoni, shuning uchun `badge$docs` qaror qiladi: `badge$docs.universal`.

NFT IDs uchun barqaror nomlardan foydalaning. ID - bu ko'rsatmalar, so'rovlar, ruxsatnomalar, hodisa filtrlari va dastur ma'lumotlari tomonidan ishlatiladigan ob'ekt identifikatsiyasi.

## Hayot davri {#lifecycle}

NFT hayot davri operatsiyalari foydalanish Iroha Maxsus ko'rsatmalar:

- [`Register`](/uz/blockchain/instructions.md#un-register) boshlang'ich `content` bilan NFT ni yaratadi.
- [`Unregister`](/uz/blockchain/instructions.md#un-register) NFT belgisini olib tashlaydi.
- [`Transfer`](/uz/blockchain/instructions.md#transfer) o'zgarishlar `owned_by`.
- [`SetKeyValue` va `RemoveKeyValue`](/uz/blockchain/instructions.md#setkeyvalue-removekeyvalue) NFT metadatalarini yangilash.

## Mahalliy hududda sinab koʻring {#try-it-locally}

Ushbu misollarga ko'ra, siz mahalliy tarmoqni ishga tushirdingiz va [CLI qo'llanma](/uz/get-started/operate-iroha-via-cli.md)dan klient konfiguratsiyasi hosil bo'lgan:

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

Yaratilgan lokalnet allaqachon `wonderland.universal` va uning SNS ijara shartnomasini o'rnatadi. Boshqa domendan foydalanish uchun uni birinchi navbatda `app alias setup plan` va `app alias setup apply` ish oqimi bilan yaratish [Domains](/uz/blockchain/domains.md#registration).

NFT raqami ro'yxatdan o'tkazilsin. Ro'yxatga olish dastlabki tarkibni JSON standart kirishdan o'qiydi:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

NFT to'g'ridan-to'g'ri tekshirib ko'ring, so'ngra barcha NFTs to'liq yozuvlar bilan ro'yxatdan o'qing:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

Metadata kalitini qo'shing va NFT ni yana o'qing:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

Metadata kalitini olib tashlash:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

NFT ni ko'chirish uchun `ledger nft get` dan foydalanib, hozirgi egasini `owned_by`dan o'qish va `ledger account list all` dan foydalanib maqsadli hisob qaydnomani ID topish.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

NFT namunasini o'chirishdan keyin olib tashlang. Agar siz uni o'tkazgan bo'lsangiz, uni qaytarib yuboring yoki hozirgi egasining hisob raqami konfiguratsiyasi bilan ro'yxatdan chiqarmaslik buyruqini taqdim eting.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## Savollar va voqealar {#queries-and-events}

[`FindNfts`](/uz/reference/queries.md#assets-nfts-and-rwas) dan foydalanib, hisob qaydnomasiga ega bo'lgan NFTs va [`FindNftsByAccountId`](/uz/reference/queries.md#assets-nfts-and-rwas)dan foydalanib, NFTs ni ro'yxatga oling.

NFT ro'yxatdan o'tish, olib tashlash, uzatish va metadata yangilanishlari NFT ma'lumotlar hodisalarini chiqaradi. `Nft` ma'lumotlar hodisasi filtridan foydalanib, katta kitobga o'zgarishlar kiritishda yoki NFT hayotiy davrida sodir bo'ladigan voqealarga munosabatda bo'lgan triggerlarni qurishda foydalaning.

## Ruxsatlar {#permissions}

Bo'yicha ruxsat berish yuzi NFT uchun maxsus tokenlarni o'z ichiga oladi:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

Ruxsatlarni tekshirish faol ishga tushirish vaqtini tasdiqlovchi tomonidan amalga oshiriladi, shuning uchun tarmoq ijrochisini yangilab ruxsatnomalarni moslash mumkin. [Ruxsat belgisi](/uz/reference/permissions.md) joriy andoza tokenlar ro'yxati uchun.

## NFTs tanlang {#choosing-nfts}

Maxsuslik va egalik ahamiyati bo'lgan yozuvlar uchun NFT dan foydalaning:

- sertifikatlar, belgilar, litsenziyalar va guvohnomalar
- a'zolik yoki kirish yozuvlari
- Kimlik bilan bog'liq yoki hisob-kitobga tegishli arizalar ro'yxati
- zaryaddan tashqaridagi ommaviy axborot vositalariga, hujjatlar yoki manifestlarga murojaat qilish;

Fungible saldolar uchun raqamli aktivdan foydalaning va ma'lumotlar mavjud katta qog'oz obyektining faqat kompakt atributi bo'lganda oddiy [ metadatalardan](/uz/blockchain/metadata.md) foydalaning.

Shuningdek qarang:

- [Aktivlar](/uz/blockchain/assets.md)
- [Metadatalar](/uz/blockchain/metadata.md)
- [Ko'rsatmalar](/uz/blockchain/instructions.md)
- [So'rovlar](/uz/blockchain/queries.md)
