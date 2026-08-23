---
translation_locale: uz
translation_source: /cookbook/nfts.md
translation_source_hash: f34043c1940b556439c23de7decc5e79f198f52eca8517dd8a9a5892d997e211
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

## Natija {#outcome}

Tekshirish Taira NFT davlat, keyin ro'yxatga olish, yangilash, o'tkazish va so'rov NFT ishlab chiqarilgan mahalliy tarmoqda ishlaydi. Ish oqimi to'liq malakali `name$domain.dataspace` NFT ID va kanonik I105 mulkdor IDs.

## Oldindan talablar {#prerequisites}

- `curl`, `jq`, Python 3.11 yoki undan keyin, va joriy `iroha` CLI.
- Faqat o'qish uchun Taira kirish.
- Yozish uchun [dan yaratilgan mahalliy tarmoq Iroha](/uz/get-started/launch-iroha.md)ni ishga tushirish, `./localnet/client.toml` va Torii bilan `http://127.0.0.1:8080`da.

## qadamlar {#steps}

### 1. Umumiy Taira to'plamini tekshirish {#_1-inspect-the-public-taira-collection}

Bo'sh sahifa muvaffaqiyatli o'qiladi: bu talab qilingan sahifada ko'rinmas NFTs mavjud emasligini anglatadi.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs raqamli balanslar emas, balki o'ziga xos yozuvlardir. Ularda ID, bitta egasi va kompakt `content` metadata xaritasi mavjud.

### 2. Mahalliy egani tayyorlang IDs {#_2-prepare-local-owner-ids}

Yozish namunasida `wonderland.universal` domenidan foydalaniladi. Xususiy kalitini oshkor qilmasdan konfiguratsiyalangan hokimiyatni keltiring, so'ngra boshqa ro'yxatdan o'tgan hisob qaydnomasini transfer yo'nalishi sifatida tanlang.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
NFT_ID='cookbook_badge$wonderland.universal'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
CURRENT_OWNER="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

NEW_OWNER="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg owner "$CURRENT_OWNER" \
      '[.items[].id | select(. != $owner)][0]'
)"
```

`$` separator NFT matn shakliga tegishli. To'liq `wonderland.universal` domeni va ma'lumotlar maydonining suffixini saqlang.

### 3. Boshlang'ich tarkib bilan NFT ni ro'yxatga olish {#_3-register-the-nft-with-initial-content}

CLI dastlabki JSON ob'ektini standart kirishdan o'qiydi. Hozirgi hokimiyat egasiga aylanadi.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. Ma'lumotlar xaritasini yangilash {#_4-update-the-content-map}

Metadata qiymatlari JSON. Bir kalitni o'rnatish yoki ushbu bitta yozuvni almashtirish; u butun NFT rekordini almashtirmaydi.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. Mulkni o'tkazish {#_5-transfer-ownership}

Ikkala kanonik I105 hisobini ham taqdim eting IDs. `--from` yoki `--to` sifatida ishlatilishdan oldin aliasni hal qilish kerak.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning Ruxsatlar chegaralari

O ' z vaqtida Taira, har bir yozish ham kerak `--metadata ./taira.tx-metadata.json` ro'yxatdan o'tish, o'tkazish, olib tashlash va metadatalarni yangilashni faol ish vaqti bilan tekshiradi (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft`, va `CanModifyNftMetadata` ilovaga berilgan domendan foydalaning yoki bu nomzodni lokalnetda saqlang.

:::

Shartnomaga ega bo'lgan ish oqimlari uchun Kotodama NFT o'rnatilgan xost qo'ng'iroqlarini oshkor qiladi. Quyidagilar IVM belgilangani bilan tuzilgan va bajarilgan aniq hayot davri moslama:

```kotodama
seiyaku NftFlow {
    kotoage fn nft_issue_and_transfer() authorize("NftAuthority") {
        let owner = AccountId::parse(
            "sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV",
        );
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft, owner);
        let to = AccountId::parse(
            "sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76",
        );
        ledger::nft::transfer(
            source: owner,
            nft: nft,
            destination: to,
        );
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft);
    }
}
```

Ikkalasi toʻgʻri I105 ko'rsatkichlar oqimdan oldingi sinov qurilmalari bo'ladi; harnas o'tkazilishdan oldin belgilangan joyni qayd etadi. Ular `CURRENT_OWNER` va `NEW_OWNER` O ' zbekiston Respublikasi CLI yo'ldan o'tish. Ilova shartnomasi uchun, uning haqiqiy kanonik hisoblarini taqdim etish, so'ngra to'plash, sinov, joylashtirish va uni orqali chaqirish [Aqlli shartnomalar](./smart-contracts.md). Tekshirilmagan bytekodni Taira, va shuni yodda tutingki, shartnoma ijrosi hali ham ishga tushirish muddati ruxsatini o'tkazib yuboradi.

## Tekshirish {#verify}

NFT ni to'g'ridan-to'g'ri o'qib, uning tarkibi ilova qilingan bo'lsa ham egasi o'zgarganligini ta'kidlang:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

Agar CLI yozuvni chiqariladigan zarba bilan o'rab olgan bo'lsa, uni tekshirib ko'ring JSON bir marta va ta'kidlashni tarkibdagi NFT ob'ekt. Avvalgi invariantlar: `id`, `owned_by`, va `content`.

## Muammolarni hal qilish {#troubleshooting}

- `name$domain` ba'zi parserlarda universal ma'lumotlar maydonida andoza bo'lishi mumkin, ammo pishirish kitobi va dastur IDs aniq `name$domain.dataspace` shaklidan foydalanish kerak.
- Xuddi shu shaxsning takrorlangan ro'yxatdan o'tishi NFT ID yangi lokal tarmoqdan foydalaning yoki barqaror yangi ID O'ziga xos yozuv uchun.
- Metadata kiritish JSON standart kirish uchun haqiqiy bo'lishi kerak. JSON ko'rsatilmagan shell seriyali metadata qiymati emas.
- Hozirgi mulkdordan boshqa hisobda imzolangan o'tish uchun aniq ruxsat kerak; `--from` ni o'zgartirish imzochini o'zgartirmaydi.
- O'tkazilgandan so'ng, asl mijozga NFT ni o'zgartirishga yoki ro'yxatdan chiqarishga ruxsat berilmaydi. Yangi egasining imzochini yoki vakolatli muolajaridan foydalaning.
- Taira bo'sh NFT yig'imini qaytarib berishi mumkin. `items: []` ni NFT ko'rsatmalarining mavjud emasligini isbotlash uchun qabul qilmang.

## Manba va u bilan bog'liq hujjatlar {#source-and-related-docs}

- [NFT o'rnatilgan qo'yilganda integratsiya sinovlari](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/nft.rs)
- [Kotodama NFT o'rnatilgan commit-da uy egasi qo'ng'iroqlarini sinovdan o'tkazadi ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [To'g'ri Kotodama NFT hayot tsikli qatlamlari pinning commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/docs/examples/12_nft_flow.ko)da
- [NFTs](/uz/blockchain/nfts.md)
- [Metadatalar](/uz/blockchain/metadata.md)
- [Ko'rsatmalar](/uz/blockchain/instructions.md)
- [Ruxsat kodlari](/uz/reference/permissions.md)
