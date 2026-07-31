---
translation_locale: uz
translation_source: /blockchain/assets.md
translation_source_hash: 58c9f7657f5714dc4bbb884933a1c947687fcf6c83e471007e6c7885f1dab214
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Moddiy aktivlar {#assets}

Iroha aktiv hisobda saqlanadigan raqamli balansdir. Har bir aniq balans `AssetDefinition` ni ko'rsatadi va ta'rif ushbu aktiv qanday nomlanishi, quriladi, namoyish etiladi va bo'linishi mumkinligini tasvirlaydi.

## Assetning ta'rifi {#asset-definition}

`AssetDefinition`da quyidagilar mavjud:

- `id`: kanonik aktivni belgilash manzili
- `name`: inson o'qishi mumkin bo'lgan ko'rinish nomi
- `description`: inson tomonidan o'qilishi mumkin bo'lgan ko'rsatkich
- `alias`: `<name>#<domain>.<dataspace>` yoki `<name>#<dataspace>` shaklidagi ko'rsatkichlar
- `spec`: raqamli aniqlik va balanslar uchun cheklovlar
- `mintable`: mintaqaviylik siyosati
- `logo`: ixtiyoriy ravishda `SoraFS` URI
- `metadata`: o'zboshimchalik bilan kalit qiymatli metadotlar
- `balance_scope_policy`: balanslar global yoki ma'lumotlar maydonida cheklangan bo'ladimi
- `owned_by`: ma'lumotni ro'yxatdan o'tkazgan yoki unga ega bo'lgan hisob raqamlari
- `total_quantity`: chiqarilgan umumiy miqdor
- `confidential_policy`: himoya qilingan aktivlar operatsiyalari siyosati

Asset ta'rifi IDs kanonik shaffof manzillardir. Ta'rif domen va nomdan qurilganda, Iroha ushbu domen / ism proyeksiyasini UX va so'rovlar uchun saqlashi mumkin, ammo kanonik matn shakli hosil qilingan manzil hisoblanadi.

## Assetlar balanslari {#asset-balance}

`Asset`da quyidagilar mavjud:

- `id`: `AssetId`, u aktivni belgilash, ega hisobini va tanlov bilan ta'minlangan balansni birlashtiradi.
- `value`: `Numeric` balans

Hokimlik hisob raqami kanonik va domensiz. Asset ta'rifini ma'lumotlar maydonida malakali domen ostida ko'rsatilishi mumkin, masalan `payments.universal`.

## O'rnatish mumkinligi {#mintability}

Asset ta'riflari ushbu mintaqaviylik rejimlarini qo'llab-quvvatlaydi:

|Modus |Maʼnosi |
| ------------ | ----------------------------------------------------------------- |
|`Infinitely` |Elastik ta'minot. Moddiyotni qayta tiklab, yonish mumkin. |
|`Once` |To'g'ri ta'minot belgisi. Uni bir marta maydalab, keyin yondirish mumkin. |
|`Not` |O'tkazib yuborilishi mumkin bo'lgan, ammo qayta tiklanmaydigan doimiy ta'minot belgisi. |
|`Limited(n)` |Qo'shimcha operatsiyalar soni cheklangan bo'lishi uchun maydalik qilish mumkin. |

Foydalanish `Infinitely` normal elastik aktivlar uchun; va `Once` yoki `Limited(n)` to'liq ta'minlangan yoki cheklangan ta'minlanadigan aktivlar uchun `Not` dastlabki siyosat sifatida, agar aktivlar ta'minoti allaqachon aniqlanmagan bo'lsa.

## Tovarlar doirasi {#balance-scope}

`balance_scope_policy` balanslarning qanday o'rnatilishini nazorat qiladi:

- `Global`: har bir hisobvaraq va aktivni belgilash bo'yicha bitta balans ko'chasi
- `DataspaceRestricted`: balanslar ma'lumotlar maydonining kontekstlariga ko'ra bo'linadi

Ma'lumotlar maydonida cheklangan balanslar bir xil aktiv ta'rifini ko'p Nexus ma'lumotlar Maydonlarida qo'llashganda foydali bo'ladi, ammo balanslar alohida qolishi kerak.

## Taira bilan sinab ko'ring. {#try-it-on-taira}

Ushbu faqat o'qiladigan qo'ng'iroqlar ommaviy Taira testnetda haqiqiy aktivlarni aniqlashni ko'rsatadi:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Joriy Taira XOR to'lov aktivining ta'rifini toping:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

Metadatalarni oʻz ichiga olgan maʼlumotlarni qidiring:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

Barcha uchta misol o'qiladi. Taira-da aktivlarni qoplash, yoqish yoki o'tkazish uchun kran mablag'lari bilan ta'minlangan hisobdan va [dagi qo'riqlangan oqimdan foydalaning SORA Nexus ma'lumotlar ro'yxatlariga ulanish](/uz/get-started/sora-nexus-dataspaces.md) .

To'lov to'lanadigan Taira aktivning misoli uchun, kran yordamchisini [dan saqlang Testnet XOR ni Taira](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) da `taira_faucet_claim.py` sifatida oling, so'ngra avval kran aktivini talab qilib oling va uni tranzaksiya gaz aktivini sifatida ishlating:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

So'ngra `ledger asset mint`, `ledger asset burn` va `ledger asset transfer` buyruqlarida `--metadata ./taira.tx-metadata.json` kiriting.

## Ko'rsatmalar {#instructions}

Aktivlar Iroha maxsus yo'l-yo'riqlari bilan ro'yxatdan o'tkaziladi, quriladi, yoqiladi va o'tkazilishi mumkin:

- [`Register` va `Unregister`](/uz/blockchain/instructions.md#un-register)
- [`Mint` va `Burn`](/uz/blockchain/instructions.md#mint-burn)
- [`Transfer`](/uz/blockchain/instructions.md#transfer)
- [`SetKeyValue` va `RemoveKeyValue`](/uz/blockchain/instructions.md#setkeyvalue-removekeyvalue)

Shuningdek qarang:

- [CLI qo'llanma](/uz/get-started/operate-iroha-via-cli.md)
- [Rust o'quv usuli](/uz/guide/tutorials/rust.md)
- [Python o'quv usuli](/uz/guide/tutorials/python.md)
- [JavaScript/TypeScript qo'llanma](/uz/guide/tutorials/javascript.md)
- [Ma'lumotlar modeli](/uz/blockchain/data-model.md)
- [NFTs](/uz/blockchain/nfts.md)
