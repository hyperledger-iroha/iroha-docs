---
translation_locale: uz
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# NFTs {#nfts}

Iroha NFT si — bitta egaga ega noyob reyestr obyekti. Yozuvga o‘z identifikatori, metama’lumoti, hayot davri hodisalari va egalikni o‘tkazish semantikasi kerak bo‘lib, sonli qoldiq talab qilinmasa, NFTs dan foydalaning.

Sonli [aktivdan](/uz/blockchain/assets.md) farqli ravishda NFT da aniqlik, zarb qilish imkoniyati yoki har hisob bo‘yicha miqdor yo‘q. NFT bitta ro‘yxatdan o‘tgan obyekt sifatida mavjud va egalik bevosita shu obyektda kuzatiladi.

## Tuzilishi {#structure}

Ro‘yxatdan o‘tgan `Nft` quyidagilarni o‘z ichiga oladi:

- `id`: `NftId`;
- `content`: NFT ni tavsiflovchi metama’lumot;
- `owned_by`: NFT ga egalik qiladigan hisob.

`content` maydoni `Metadata` xaritasidir. Uni ixcham saqlang: tavsifiy maydonlar, barqaror havolalar, xeshlar, URIs yoki SoraFS yo‘llarini shu yerga yozing. Katta hujjatlar, media yoki tez-tez o‘zgaradigan ilova holatini zanjirdan tashqarida saqlab, NFT da faqat tekshiriladigan havolani qoldiring.

## Taira da sinab ko‘rish {#try-it-on-taira}

Ochiq Taira sinov tarmog‘ida hozir NFT yozuvlari bor-yo‘qligini tekshiring:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

Tugun taqdim etadigan NFT yo‘nalishlari uchun jonli OpenAPI hujjatini tekshiring:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

Bo‘sh `items` massivi ochiq sinov tarmog‘ida yaroqli javobdir. Bu joriy sahifada NFTs yo‘qligini anglatadi, NFT ko‘rsatmalari mavjud emasligini emas.

## NFT identifikatorlari {#nft-ids}

`NftId` quyidagi matn ko‘rinishidan foydalanadi:

```text
name$domain
name$domain.dataspace
```

Masalan, `badge$docs.universal` qiymati `docs.universal` domenidagi `badge` NFT sini bildiradi. Ma’lumotlar makoni ko‘rsatilmasa, joriy tahlilchi `universal` makonidan foydalanadi; shu sababli `badge$docs` qiymati `badge$docs.universal` ga yechiladi.

NFT identifikatorlari uchun barqaror nomlardan foydalaning. Identifikator — ko‘rsatmalar, so‘rovlar, ruxsatlar, hodisa filtrlari va ilova havolalari ishlatadigan obyekt identifikatsiyasidir.

## Hayot davri {#lifecycle}

NFT hayot davri amallari Iroha maxsus ko‘rsatmalaridan foydalanadi:

- [`Register`](/uz/blockchain/instructions.md#un-register) NFT ni dastlabki `content` bilan yaratadi.
- [`Unregister`](/uz/blockchain/instructions.md#un-register) NFT ni olib tashlaydi.
- [`Transfer`](/uz/blockchain/instructions.md#transfer) `owned_by` ni o‘zgartiradi.
- [`SetKeyValue` va `RemoveKeyValue`](/uz/blockchain/instructions.md#setkeyvalue-removekeyvalue) NFT metama’lumotini yangilaydi.

## Mahalliy sinab ko‘rish {#try-it-locally}

Bu misollarda mahalliy tarmoq ishga tushirilgan va [CLI qo‘llanmasi](/uz/get-started/operate-iroha-via-cli.md) orqali mijoz sozlamasi hosil qilingan deb olinadi:

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

Hosil qilingan mahalliy tarmoq `wonderland.universal` va uning SNS ijarasini allaqachon sozlaydi. Boshqa domendan foydalanish uchun avval uni [Domenlar](/uz/blockchain/domains.md#registration) bo‘limidagi deklarativ `app alias setup plan` va `app alias setup apply` jarayoni bilan yarating.

NFT ni ro‘yxatdan o‘tkazing. Ro‘yxatga olish dastlabki kontent JSON ini standart kirishdan o‘qiydi:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

NFT ni bevosita tekshiring, so‘ng barcha NFTs ni to‘liq yozuvlari bilan sanang:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

Metama’lumot kalitini qo‘shing va NFT-ni yana o‘qing:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

Metama’lumot kalitini olib tashlang:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

Ixtiyoriy ravishda NFT ni o‘tkazing. Joriy egani `owned_by` dan o‘qish uchun `ledger nft get`, maqsad hisob identifikatorini topish uchun `ledger account list all` dan foydalaning.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

Ko‘rsatmalarni bajargach namunaviy NFT ni olib tashlang. Uni o‘tkazgan bo‘lsangiz, avval qaytaring yoki joriy eganing hisob sozlamasi bilan ro‘yxatdan chiqarish buyrug‘ini yuboring.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## So‘rovlar va hodisalar {#queries-and-events}

NFTs ni sanash uchun [`FindNfts`](/uz/reference/queries.md#assets-nfts-and-rwas), muayyan hisobga tegishli NFTs ni sanash uchun [`FindNftsByAccountId`](/uz/reference/queries.md#assets-nfts-and-rwas) dan foydalaning.

NFT-ni ro‘yxatdan o‘tkazish, o‘chirish, o‘tkazish va metama’lumotini yangilash NFT ma’lumotlari hodisalarini chiqaradi. Reyestr o‘zgarishlariga obuna bo‘lishda yoki NFT hayot sikli hodisalariga javob beradigan qo‘zg‘atuvchilarni yaratishda `Nft` ma’lumotlar hodisasi filtridan foydalaning.

## Ruxsatlar {#permissions}

Standart ruxsatlar interfeysi NFT ga xos tokenlarni o‘z ichiga oladi:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

Ruxsat tekshiruvlarini faol bajarish muhiti tekshiruvchisi majburiy qo‘llaydi, shu sabab tarmoq ijrochini yangilab vakolat siyosatini moslashtirishi mumkin. Joriy standart tokenlar ro‘yxati uchun [Ruxsat tokenlari](/uz/reference/permissions.md) bo‘limiga qarang.

## NFTs ni qachon tanlash kerak {#choosing-nfts}

Noyoblik va egalik muhim bo‘lgan yozuvlar uchun NFT dan foydalaning:

- sertifikatlar, belgilar, litsenziyalar va guvohnomalar
- a’zolik yoki kirish yozuvlari;
- identifikatsiyaga bog‘langan yoki hisobga tegishli ilova yozuvlari;
- zanjirdan tashqari media, hujjat yoki manifestlarga havolalar.

O‘zaro almashinadigan qoldiqlar uchun sonli aktivdan foydalaning; ma’lumot mavjud reyestr obyektining faqat ixcham atributi bo‘lsa, oddiy [metama’lumotlardan](/uz/blockchain/metadata.md) foydalaning.

Shuningdek qarang:

- [Aktivlar](/uz/blockchain/assets.md)
- [Metama’lumotlar](/uz/blockchain/metadata.md)
- [Ko'rsatmalar](/uz/blockchain/instructions.md)
- [So'rovlar](/uz/blockchain/queries.md)
