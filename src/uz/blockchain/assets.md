---
translation_locale: uz
translation_source: /blockchain/assets.md
translation_source_hash: 58c9f7657f5714dc4bbb884933a1c947687fcf6c83e471007e6c7885f1dab214
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Aktivlar {#assets}

Oʻzbekiston Respublikasi Iroha aktiv hisobda saqlanadigan raqamli balansdir.
muvozanat punktlari `AssetDefinition`, va ta'rif qanday tasvirlaydi
ushbu aktiv nomlanishi, quriladi, ko'rsatiladi va bo'linadi.

## Assetning ta'rifi {#asset-definition}

Oʻzbekiston Respublikasi `AssetDefinition` tarkibida:

- `id`: kanonik aktivni belgilash manzili
- `name`: inson o'qishi mumkin bo'lgan ekran nomi
- `description`: inson tomonidan o'qilishi mumkin bo'lgan fakultativ tavsif
- `alias`: ko'rsatkichlar `<name>#<domain>.<dataspace>` yoki
  `<name>#<dataspace>` shakli
- `spec`: Saldolar uchun raqamli aniqlik va cheklovlar
- `mintable`: mintaqaviylik siyosati
- `logo`: ko'rsatkich `SoraFS` URI
- `metadata`: O'zboshimchalik bilan kalit qiymatli metadotlar
- `balance_scope_policy`: balanslar global yoki
  ma'lumotlar maydonida cheklangan
- `owned_by`: ma'lumotni ro'yxatdan o'tkazgan yoki unga ega bo'lgan hisob raqami
- `total_quantity`: chiqarilgan umumiy miqdor
- `confidential_policy`: himoyalangan aktivlar operatsiyalari siyosati

Assetning tavsiflanishi IDs Kanonik ko'rinmas manzillar.
domen va nomdan yaratilgan, Iroha o'sha domen / nomni saqlab qolishi mumkin
ko'rsatkichlar UX va so'rovlar, lekin kanonik matn shakli yaratilgan
manzili.

## Assetlar balanslari {#asset-balance}

Oʻzbekiston Respublikasi `Asset` tarkibida:

- `id`: bir `AssetId`, aktivlar ta'rifini, egalik hisobini birlashtiradi;
  va imtiyozli balansning doirasi
- `value`: a) `Numeric` muvozanat

Hisob xodimi kanonik va domensiz.
Masalan, ma'lumotlar maydonida malakali domen bo'yicha loyihalashtirilgan
`payments.universal`.

## O'lchash {#mintability}

Asset ta'riflari ushbu mintaqaviylik rejimlarini qo'llab-quvvatlaydi:

| Modus         | Ma'nosi                                                           |
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` | Elastik ta'minot. Moddiyotni qayta tiklab, yonish mumkin.    |
| `Once`       | U bir marta qurilib, keyin yondirilishi mumkin.        |
| `Not`        | Yolg'izish mumkin bo'lgan, ammo qayta tiklanmaydigan to'liq ta'minot belgisi.       |
| `Limited(n)` | Qisqa miqdordagi qo'shimcha operatsiyalar uchun maydoncha tayyorlashga ruxsat beriladi. |

Foydalanish `Infinitely` normal elastik aktivlar uchun; va `Once` yoki `Limited(n)` uchun
To'liq ta'minlangan yoki cheklangan ta'minlanadigan aktivlar. `Not` dastlabki
siyosat, agar aktivlar ta'minoti allaqachon aniqlanmagan bo'lsa.

## Tovarlar soni {#balance-scope}

O ' zbekiston Respublikasi `balance_scope_policy` balanslarning qanday qilib o'rnatilishini nazorat qiladi:

- `Global`: hisobvaraq va aktivni aniqlash uchun bitta balans ko'chasi
- `DataspaceRestricted`: balanslar ma'lumotlar maydonining kontekstiga qarab bo'linadi

Ma'lumotlar maydonida cheklangan balanslar bir xil aktivni aniqlashda foydali bo'ladi
koʻp qirrali Nexus ma'lumotlar maydonlari, ammo balanslar alohida bo'lishi kerak.

## Uni sinab koʻring . Taira {#try-it-on-taira}

Ushbu faqat oʻqiladigan qoʻngʻiroqlar ommaviy axborot vositalarining haqiqiy aktivlari taʼrifini koʻrsatadi Taira sinov tarmog'i:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Joriylikni toping Taira XOR to'lov aktivlari ta'rifi:

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

Barcha uchta misol o'qiladi. Taira, a-dan foydalanish
kasana mablag' bilan ta'minlangan hisob raqamlari va nazorat qilinadigan oqim
[Bogʻlanish SORA Nexus Ma'lumotlar maydonlari](/uz/get-started/sora-nexus-dataspaces.md).

To ' lov uchun Taira aktiv misoli, kran yordamchisini saqlash
[Testnetni olish XOR to ' g'risida Taira](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
sifatida `taira_faucet_claim.py`, so'ngra avval kran aktivini talab qilib oling va uni
Transaksiya gaz aktivlari:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

Soʻngra `--metadata ./taira.tx-metadata.json` to ' g'risida `ledger asset mint`,
`ledger asset burn`, va `ledger asset transfer` buyruqlar.

## Ko'rsatmalar {#instructions}

Assetlar ro'yxatdan o'tkaziladi, quriladi, yoqiladi va o'tkazilishi mumkin Iroha
Maxsus ko'rsatmalar:

- [`Register` va `Unregister`](/uz/blockchain/instructions.md#un-register)
- [`Mint` va `Burn`](/uz/blockchain/instructions.md#mint-burn)
- [`Transfer`](/uz/blockchain/instructions.md#transfer)
- [`SetKeyValue` va `RemoveKeyValue`](/uz/blockchain/instructions.md#setkeyvalue-removekeyvalue)

Shuningdek qarang:

- [CLI qo'llanma](/uz/get-started/operate-iroha-via-cli.md)
- [Rust qoʻllanma](/uz/guide/tutorials/rust.md)
- [Python qoʻllanma](/uz/guide/tutorials/python.md)
- [JavaScript/TypeScript qoʻllanma](/uz/guide/tutorials/javascript.md)
- [Ma'lumotlar modeli](/uz/blockchain/data-model.md)
- [NFTs](/uz/blockchain/nfts.md)
