---
translation_locale: uz
translation_source: /blockchain/nfts.md
translation_source_hash: 335eacd30c5964659baeeae8ac937805f1d4d786dd42a36e5164bbe75ef7e360
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

O ' zbekiston Respublikasi Iroha NFT - bu bitta egasiga ega bo'lgan noyob kitob ob'ekti. NFTs yozuv o'z shaxsga, metadatalarga, hayot davri hodisalariga va egalik uzatish semantikasiga muhtoj bo'lganda, lekin raqamli muvozanatga muhtoj emas.

Raqamga oʻxshamaydi . [aktiv](/uz/blockchain/assets.md), bir NFT to'g'rilik, mintaqaviylik yoki hisob-kitob miqdori yo'q. NFT bitta ro'yxatdan o'tgan obyekt sifatida mavjud bo'lib, mulkdorlik to'g'ridan-to'g'ri ushbu obyektda kuzatilmoqda.

## Tashkilot {#structure}

Ro'yxatga olingan `Nft` tarkibida quyidagilar mavjud:

- `id`: bir `NftId`
- `content`: NFT faylini tavsiflovchi metadatalar
- `owned_by`: NFT hisobvarag'iga ega bo'lgan hisobvaraq

O ' zbekiston Respublikasining `content` maydoni a `Metadata` Xaritani kompak saqlang: deskriptiv maydonlarni saqlash, barqaror ma'lumotlar, hashlar, URIs, yoki SoraFS katta hujjatlar, ommaviy axborot vositalari yoki yuqori churn ilovalar davlat ketidan tashqarida saqlash va faqat tekshirib ko'rish mumkin bo'lgan ma'lumotlarni NFT.

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

Boʻsh joy `items` to'plam - bu ommaviy test tarmog'ida haqiqiy javob. NFTs joriy sahifada emas, NFT yo'l-yo'riqlar mavjud emas.

## NFT IDs {#nft-ids}

`NftId` ushbu matn shaklini qo'lladi:

```text
name$domain
name$domain.dataspace
```

Masalan, `badge$docs.universal` ta'riflaydi `badge` NFT bilan `docs.universal` Agar ma'lumotlar maydonasi chiqarib tashlangan bo'lsa, joriy tahlilchi ushbu `universal` ma'lumotlar maydoni, shuning uchun `badge$docs` qaror qiladi: `badge$docs.universal`.

Ishlab chiqarilgan nomlar NFT IDs. O ' zbekiston Respublikasining ID ko'rsatmalar, so'rovlar, ruxsatnomalar, hodisa filtrlari va dastur ma'lumotlari tomonidan ishlatiladigan ob'ekt identifikatsiyasi.

## Hayot davri {#lifecycle}

NFT hayot davri operatsiyalari foydalanish Iroha Maxsus ko'rsatmalar:

- [`Register`](/uz/blockchain/instructions.md#un-register) yaratadi NFT dastlabki `content`.
- [`Unregister`](/uz/blockchain/instructions.md#un-register) NFT belgisini olib tashlaydi.
- [`Transfer`](/uz/blockchain/instructions.md#transfer) o'zgarishlar `owned_by`.
- [`SetKeyValue` va `RemoveKeyValue`](/uz/blockchain/instructions.md#setkeyvalue-removekeyvalue) yangilanish NFT Metadatalar.

## Mahalliy hududda sinab koʻring {#try-it-locally}

Ushbu misollarga ko'ra, siz mahalliy tarmoqni ishga tushirdingiz va [CLI qo'llanma](/uz/get-started/operate-iroha-via-cli.md)dan klient konfiguratsiyasi hosil bo'lgan:

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

Yaratilgan lokal tarmoq allaqachon oʻrnatilgan `wonderland.universal` va uning SNS Boshqa domendan foydalanish uchun uni birinchi navbatda deklarativ `app alias setup plan` va `app alias setup apply` ish oqimi [Domenlar](/uz/blockchain/domains.md#registration).

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

Oʻz navbatida, NFT. Foydalanish `ledger nft get` joriy egasini o'qish uchun `owned_by`, va foydalanish `ledger account list all` yo'nalishdagi hisobni topish ID.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

Agar siz NFT ni o'tkazgan bo'lsangiz, ushbu buyruqni joriy egasining hisobini sozlash yoki avval NFT ni qaytadan o'tkazish orqali bajaring.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## Savollar va voqealar {#queries-and-events}

Foydalanish [`FindNfts`](/uz/reference/queries.md#assets-nfts-and-rwas) ro'yxatga olish NFTs va [`FindNftsByAccountId`](/uz/reference/queries.md#assets-nfts-and-rwas) ro'yxatga olish NFTs hisob raqamiga ega bo'lgan.

NFT ro'yxatdan o'tish, o'chirish, uzatish va metadatalarni yangilash NFT ma'lumotlar hodisalari. `Nft` ma'lumotlar hodisasi filterini ko'rsatkichlar daftarida o'zgarishlarga aloqador bo'lganda yoki NFT hayoti davridagi hodisalar.

## Ruxsatlar {#permissions}

Bo'yicha ruxsat berish yuzi NFT uchun maxsus tokenlarni o'z ichiga oladi:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

Ruxsatlarni tekshirish faol ishga tushirish vaqtini tasdiqlovchi tomonidan amalga oshiriladi, shuning uchun tarmoq ijrochini yangilab ruxsatni moslashi mumkin. [Ruxsat belgisi](/uz/reference/permissions.md) joriy andoza tokenlar ro'yxati uchun.

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
