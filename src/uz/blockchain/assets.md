---
translation_locale: uz
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Aktivlar {#assets}

Iroha aktivi hisobda saqlanadigan sonli qoldiqdir. Har bir aniq qoldiq `AssetDefinition` ga ishora qiladi; ta’rif aktiv qanday nomlanishi, zarb qilinishi, ko‘rsatilishi va bo‘linishini belgilaydi.

## Aktiv ta’rifi {#asset-definition}

`AssetDefinition`da quyidagilar mavjud:

- `id`: kanonik aktiv ta’rifi manzili
- `name`: inson o‘qiy oladigan ko‘rinish nomi
- `description`: inson o‘qiy oladigan tavsif
- `alias`: `<name>#<domain>.<dataspace>` yoki `<name>#<dataspace>` shaklidagi taxallus
- `spec`: raqamli aniqlik va balanslar uchun cheklovlar
- `mintable`: zarb qilish siyosati
- `logo`: ixtiyoriy ravishda `SoraFS` URI
- `metadata`: ixtiyoriy kalit-qiymat metama’lumotlari
- `balance_scope_policy`: balanslar global yoki ma’lumotlar makoni bilan cheklanishini belgilaydi
- `owned_by`: ta’rifni ro‘yxatdan o‘tkazgan yoki unga egalik qiladigan hisob
- `total_quantity`: chiqarilgan umumiy miqdor
- `confidential_policy`: himoya qilingan aktivlar operatsiyalari siyosati

Aktiv ta’rifi identifikatorlari kanonik yashirin manzillardir. Ta’rif domen va nomdan tuzilganda, Iroha UX va so‘rovlar uchun shu domen/nom proyeksiyasini saqlashi mumkin, biroq kanonik matn shakli hosil qilingan manzildir.

## Aktiv qoldig‘i {#asset-balance}

`Asset`da quyidagilar mavjud:

- `id`: aktiv ta’rifi, ega hisobi va ixtiyoriy qoldiq doirasini birlashtiradigan `AssetId`;
- `value`: `Numeric` balans

Ega hisob kanonik va domensiz. Aktiv ta’rifi ma’lumotlar makoni bilan aniqlashtirilgan domen ostida, masalan `payments.universal`, proyeksiya qilinishi mumkin.

## Zarb qilish imkoniyati {#mintability}

Aktiv ta’riflari quyidagi qo‘shimcha chiqarish rejimlarini qo‘llab-quvvatlaydi:

| Rejim | Ma’nosi |
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` | Moslashuvchan taklif. Aktivni qayta-qayta zarb qilish va yoqish mumkin. |
| `Once` | Qat’iy taklif belgisi. Bir marta zarb qilish, keyin yoqish mumkin. |
| `Not` | Yoqish mumkin, ammo qayta chiqarib bo‘lmaydigan qat’iy taklif tokeni. |
|`Limited(n)` |Siyosat cheklangan sonli qoʻshimcha operatsiyalarda yangi aktiv birliklari chiqarilishiga imkon beradi. |

Odatiy moslashuvchan aktivlar uchun `Infinitely`, qat’iy yoki chegaralangan taklifli aktivlar uchun `Once` yoxud `Limited(n)` dan foydalaning. Aktiv taklifi allaqachon yaratilmagan bo‘lsa, `Not` ni boshlang‘ich siyosat sifatida ishlatmang.

## Qoldiq doirasi {#balance-scope}

`balance_scope_policy` balanslar qanday guruhlanishini belgilaydi:

- `Global`: har bir hisob va aktiv ta’rifi jufti uchun bitta qoldiq yo‘li
- `DataspaceRestricted`: balanslar ma’lumotlar makoni konteksti bo‘yicha ajratiladi

Ma’lumotlar makoni bilan cheklangan balanslar ayni aktiv ta’rifi bir nechta Nexus ma’lumotlar makonida ishlatilsa-yu, balanslar ajratilgan holda qolishi kerak bo‘lganda foydali.

## Taira da sinab ko‘rish {#try-it-on-taira}

Bu faqat o‘qish chaqiruvlari ochiq Taira sinov tarmog‘idagi haqiqiy aktiv ta’riflarini ko‘rsatadi:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Joriy Taira XOR haq aktivi ta’rifini toping:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

Metama’lumotga ega ta’riflarni qidiring:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

Uchala misol ham faqat o‘qiydi. Taira da aktiv zarb qilish, yoqish yoki o‘tkazish uchun sinov mablag‘i bilan ta’minlangan hisob va [SORA Nexus ma’lumotlar makonlariga ulanish](/uz/get-started/sora-nexus-dataspaces.md) bo‘limidagi himoyalangan jarayondan foydalaning.

Taira-da haq talab qiladigan aktiv misoli uchun [Taira-da sinov tarmog‘i XOR aktivini olish](/uz/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) bo‘limidagi yordamchini `taira_faucet_claim.py` sifatida saqlang. Avval sinov mablag‘i aktivini oling, keyin uni tranzaksiyaning gaz aktivi sifatida ishlating:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

So‘ng `ledger asset mint`, `ledger asset burn` va `ledger asset transfer` buyruqlariga `--metadata ./taira.tx-metadata.json` ni qo‘shing.

## Ko‘rsatmalar {#instructions}

Aktivlar Iroha maxsus ko‘rsatmalari bilan ro‘yxatdan o‘tkaziladi, chiqariladi, yoqiladi va o‘tkaziladi:

- [`Register` va `Unregister`](/uz/blockchain/instructions.md#un-register)
- [`Mint` va `Burn`](/uz/blockchain/instructions.md#mint-burn)
- [`Transfer`](/uz/blockchain/instructions.md#transfer)
- [`SetKeyValue` va `RemoveKeyValue`](/uz/blockchain/instructions.md#setkeyvalue-removekeyvalue)

Shuningdek qarang:

- [CLI qo‘llanmasi](/uz/get-started/operate-iroha-via-cli.md)
- [Rust qo‘llanmasi](/uz/guide/tutorials/rust.md)
- [Python qo‘llanmasi](/uz/guide/tutorials/python.md)
- [JavaScript/TypeScript qo‘llanmasi](/uz/guide/tutorials/javascript.md)
- [Ma’lumotlar modeli](/uz/blockchain/data-model.md)
- [NFTs](/uz/blockchain/nfts.md)
