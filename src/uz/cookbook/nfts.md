---
translation_locale: uz
translation_source: /cookbook/nfts.md
translation_source_hash: b60c542052eac6a916350c4aaa779c9f46d248be64ecea9c9bda679a4d56dff3
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# NFTs {#nfts}

## Natija {#outcome}

Taira’dagi NFT holatini tekshiring, so‘ng yaratilgan mahalliy tarmoqda noyob NFT ni ro‘yxatdan o‘tkazing, yangilang, boshqa egaga o‘tkazing va so‘rang. Ish jarayoni to‘liq aniqlangan `name$domain.dataspace` NFT identifikatori va kanonik I105 egasi identifikatorlaridan foydalanadi.

## Oldindan shartlar {#prerequisites}

- `curl`, `jq`, Python 3.11 yoki yangiroq versiyasi va joriy `iroha` CLI.
- Taira’ga faqat o‘qish huquqi bilan kirish.
- Yozish amallari uchun [Iroha’ni ishga tushirish](/uz/get-started/launch-iroha.md) bo‘yicha `kagami localnet generate --peers 4 --out-dir ./localnet` bilan yaratilgan mahalliy tarmoq, `./localnet/client.toml` va `http://127.0.0.1:8080` manzilidagi Torii, shuningdek imzolovchisi egalik qiladigan NFT domeni (2-bosqichga qarang).

## Qadamlar {#steps}

### 1. Ochiq Taira to‘plamini tekshirish {#_1-inspect-the-public-taira-collection}

Bo‘sh sahifa muvaffaqiyatli o‘qilganini bildiradi: so‘ralgan sahifada ko‘rinadigan NFTs yo‘q.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5&include_total=true' \
  | jq '{total, nfts: [.items[] | {id, owned_by, metadata}]}'
```

NFTs raqamli qoldiqlar emas, noyob yozuvlardir. Ularning identifikatori, bitta egasi va ixcham mazmun xaritasi bor; Torii to‘plam qatorlari bu xaritani `metadata` sifatida, `ledger nft get` esa `content` sifatida qaytaradi.

### 2. Mahalliy egalar identifikatorlarini tayyorlash {#_2-prepare-local-owner-ids}

Yozish misoliga imzolovchi hisob egalik qiladigan domen yoki u uchun berilgan `CanRegisterNft` ruxsati kerak. Yaratilgan mahalliy tarmoq o‘z mijozi uchun hech qanday ilova domenini ro‘yxatdan o‘tkazmaydi, xom domen ro‘yxatdan o‘tkazish esa genezis uchun ajratilgan, shuning uchun `NFT_DOMAIN` ni imzolovchingiz boshqaradigan `name.dataspace` domeniga o‘rnating. Maxfiy kalitni oshkor qilmasdan sozlangan vakolat hisobini hosil qiling, so‘ng boshqa ro‘yxatdan o‘tgan hisobni o‘tkazish manzili sifatida tanlang.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
test -n "$NFT_DOMAIN"
NFT_ID="cookbook_badge\$$NFT_DOMAIN"

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

`$` ajratgichi NFT ning matn shakliga tegishli. Identifikatorda to‘liq `name.dataspace` domenini saqlang.

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

Taira’da har bir yozish amali `--fee-payer authority` dan foydalanadi; CLI imzolashdan oldin Taira to‘lov aktividagi aniq to‘lov narxini oladi. Ro‘yxatdan o‘tkazish, o‘tkazish, olib tashlash va metama’lumot yangilanishlarini faol bajarish muhiti tekshiradi (standart ruxsatlar sathida `CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` va `CanModifyNftMetadata`). Hisobingiz egalik qiladigan domendan yoki hisobingizda shu ruxsatlar bo‘lgan domendan foydalaning.

:::

Shartnoma egaligidagi ish jarayonlari uchun Kotodama turlangan NFT xost chaqiruvlarini taqdim etadi. Quyida mahkamlangan IVM hujjat sinovi kompilyatsiya qiladigan va bajaradigan aynan o‘sha hayotiy sikl namunasi keltirilgan:

```kotodama
// Mint an NFT, transfer it, update metadata, and burn it using typed IDs.
seiyaku NftFlow {
    permission NftAuthority;
    kotoage fn nft_issue_and_transfer() authorize(NftAuthority) {
        let owner = AccountId::parse("sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV");
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft: nft, owner: owner);
        let to = AccountId::parse("sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76");
        ledger::nft::transfer(source: owner, nft: nft, destination: to);
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft: nft);
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

CLI NFT yozuvining o‘zini chiqaradi. Ishonchli invariantlar: `id`, `owned_by` va `content`.

## Muammolarni bartaraf etish {#troubleshooting}

- Ayrim tahlil qiluvchilar `name$domain` ni standart holda universal ma’lumotlar makoniga bog‘lashi mumkin, ammo retsept va ilova identifikatorlari aniq `name$domain.dataspace` shaklidan foydalanishi kerak.
- Bir NFT identifikatorini takroran ro‘yxatdan o‘tkazish rad etiladi. Alohida yozuv uchun yangi mahalliy tarmoq yarating yoki barqaror yangi identifikator tanlang.
- Standart kirishdagi metama’lumot haqiqiy JSON bo‘lishi kerak. JSON tirnoqlarisiz qobiq satri metama’lumot qiymati emas.
- Joriy egadan boshqa hisob imzolagan o‘tkazish uchun NFT domeniga egalik yoki aniq berilgan `CanTransferNft` ruxsati kerak; `--from` ni o‘zgartirish imzolovchini o‘zgartirmaydi.
- O‘tkazish faqat `owned_by` ni o‘zgartiradi. Metama’lumotni yangilash va ro‘yxatdan chiqarish domen egasida yoki shu NFT uchun `CanModifyNftMetadata` yoxud `CanUnregisterNft` ruxsatiga ega hisobda qoladi; yangi ega esa uni keyingi egaga o‘tkaza oladi.
- Taira bo‘sh NFT to‘plamini qaytarishi mumkin. `items: []` ni NFT ko‘rsatmalari mavjud emasligining isboti deb qabul qilmang.

## Manba va tegishli hujjatlar {#source-and-related-docs}

- [Mahkamlangan commitdagi NFT integratsiya sinovlari](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/nft.rs)
- [Mahkamlangan commitdagi Kotodama NFT xost chaqiruvi sinovlari](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Mahkamlangan commitdagi aniq Kotodama NFT hayotiy sikl namunasi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/docs/examples/12_nft_flow.ko)
- [Mahkamlangan commitdagi Kotodama hujjatlari misollari sinovlari](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_documentation_examples.rs)
- [NFTs](/uz/blockchain/nfts.md)
- [Metama’lumot](/uz/blockchain/metadata.md)
- [Ko‘rsatmalar](/uz/blockchain/instructions.md)
- [Ruxsat tokenlari](/uz/reference/permissions.md)
