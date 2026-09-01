---
translation_locale: uz
translation_source: /cookbook/nfts.md
translation_source_hash: db99dab483d4e2fb3fd84be84f6e4ef9f8373f0c16eb2f34952f1232c4587561
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# NFTs {#nfts}

## Natija {#outcome}

Taira’dagi NFT holatini tekshiring, so‘ng yaratilgan mahalliy tarmoqda noyob NFT ni ro‘yxatdan o‘tkazing, yangilang, boshqa egaga o‘tkazing va so‘rang. Ish jarayoni to‘liq aniqlangan `name$domain.dataspace` NFT identifikatori va kanonik I105 egasi identifikatorlaridan foydalanadi.

## Oldindan shartlar {#prerequisites}

- `curl`, `jq`, Python 3.11 yoki yangiroq versiyasi va joriy `iroha` CLI.
- Taira’ga faqat o‘qish huquqi bilan kirish.
- Yozish amallari uchun [Iroha’ni ishga tushirish](/uz/get-started/launch-iroha.md) bo‘yicha yaratilgan mahalliy tarmoq, `./localnet/client.toml` va `http://127.0.0.1:8080` manzilidagi Torii.

## Qadamlar {#steps}

### 1. Ochiq Taira to‘plamini tekshirish {#_1-inspect-the-public-taira-collection}

Bo‘sh sahifa muvaffaqiyatli o‘qilganini bildiradi: so‘ralgan sahifada ko‘rinadigan NFTs yo‘q.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs raqamli qoldiqlar emas, noyob yozuvlardir. Ularning identifikatori, bitta egasi va ixcham `content` metama’lumotlari xaritasi bor.

### 2. Mahalliy egalar identifikatorlarini tayyorlash {#_2-prepare-local-owner-ids}

Yozish misolida repozitoriyga kiritilgan `wonderland.universal` domeni ishlatiladi. Maxfiy kalitni oshkor qilmasdan sozlangan vakolat hisobini hosil qiling, so‘ng boshqa ro‘yxatdan o‘tgan hisobni o‘tkazish manzili sifatida tanlang.

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

`$` ajratgichi NFT ning matn shakliga tegishli. To‘liq `wonderland.universal` domeni va ma’lumotlar makoni qo‘shimchasini saqlang.

### 3. NFT ni dastlabki mazmun bilan ro‘yxatdan o‘tkazish {#_3-register-the-nft-with-initial-content}

CLI dastlabki JSON obyektini standart kirishdan o‘qiydi. Joriy vakolat hisobi egaga aylanadi.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. Mazmun xaritasini yangilash {#_4-update-the-content-map}

Metama’lumot qiymatlari JSON formatida bo‘ladi. Kalitni o‘rnatish faqat shu yozuvni kiritadi yoki almashtiradi; butun NFT yozuvini almashtirmaydi.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. Egalikni o‘tkazish {#_5-transfer-ownership}

Ikkala kanonik I105 hisob identifikatorini ham bering. Taxallus `--from` yoki `--to` sifatida ishlatilishidan oldin yechilishi kerak.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning Ruxsat chegarasi

Taira’da har bir yozish amali `--metadata ./taira.tx-metadata.json` va aniq to‘lovchini ham talab qiladi. Ro‘yxatdan o‘tkazish, o‘tkazish, olib tashlash va metama’lumot yangilanishlarini faol bajarish muhiti tekshiradi (standart ruxsatlar sathida `CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` va `CanModifyNftMetadata`). Ilovangizga tayinlangan domendan foydalaning yoki bu qo‘llanmani mahalliy tarmoqda bajaring.

:::

Shartnoma egaligidagi ish jarayonlari uchun Kotodama turlangan NFT xost chaqiruvlarini taqdim etadi. Quyida mahkamlangan IVM hujjat sinovi kompilyatsiya qiladigan va bajaradigan aynan o‘sha hayotiy sikl namunasi keltirilgan:

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

Ikki o‘zgarmas I105 qiymati yuqori oqim sinov namunalaridir; sinov muhiti bajarishdan oldin manzil hisobini ro‘yxatdan o‘tkazadi. Ular CLI qo‘llanmasidagi `CURRENT_OWNER` va `NEW_OWNER` emas. Ilova shartnomasi uchun uning haqiqiy kanonik hisoblarini bering, so‘ng uni [Aqlli shartnomalar](./smart-contracts.md) bo‘yicha kompilyatsiya qiling, sinang, joylashtiring va chaqiring. Tekshirilmagan baytkodni Taira’ga yubormang; shartnoma bajarilishi baribir bajarish muhiti vakolat tekshiruvidan o‘tishini unutmang.

## Tekshirish {#verify}

NFT ni bevosita o‘qing va egasi o‘zgargani, mazmuni esa unga biriktirilgan holda qolgani haqida tasdiq oling:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

CLI yozuvni chiqish konvertiga o‘rasa, JSON ni bir marta ko‘zdan kechiring va tekshiruvni konvert ichidagi NFT obyektiga qo‘llang. Ishonchli invariantlar: `id`, `owned_by` va `content`.

## Muammolarni bartaraf etish {#troubleshooting}

- Ayrim tahlil qiluvchilar `name$domain` ni standart holda universal ma’lumotlar makoniga bog‘lashi mumkin, ammo retsept va ilova identifikatorlari aniq `name$domain.dataspace` shaklidan foydalanishi kerak.
- Bir NFT identifikatorini takroran ro‘yxatdan o‘tkazish rad etiladi. Alohida yozuv uchun yangi mahalliy tarmoq yarating yoki barqaror yangi identifikator tanlang.
- Standart kirishdagi metama’lumot haqiqiy JSON bo‘lishi kerak. JSON tirnoqlarisiz qobiq satri metama’lumot qiymati emas.
- Joriy egadan boshqa hisob imzolagan o‘tkazish uchun aniq ruxsat kerak; `--from` ni o‘zgartirish imzolovchini o‘zgartirmaydi.
- O‘tkazishdan keyin dastlabki mijoz NFT ni o‘zgartirish yoki ro‘yxatdan chiqarish vakolatiga ega bo‘lmasligi mumkin. Yangi egasining imzolovchisi yoki vakolatli boshqaruvchidan foydalaning.
- Taira bo‘sh NFT to‘plamini qaytarishi mumkin. `items: []` ni NFT ko‘rsatmalari mavjud emasligining isboti deb qabul qilmang.

## Manba va tegishli hujjatlar {#source-and-related-docs}

- [Mahkamlangan commitdagi NFT integratsiya sinovlari](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Mahkamlangan commitdagi Kotodama NFT xost chaqiruvi sinovlari](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Mahkamlangan commitdagi aniq Kotodama NFT hayotiy sikl namunasi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/uz/blockchain/nfts.md)
- [Metama’lumot](/uz/blockchain/metadata.md)
- [Ko‘rsatmalar](/uz/blockchain/instructions.md)
- [Ruxsat tokenlari](/uz/reference/permissions.md)
