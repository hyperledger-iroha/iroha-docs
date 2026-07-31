---
translation_locale: uz
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Anjumanlarning nomi {#naming-conventions}

Hisobvaraqlar, domenlar yoki aktivlarni nomlashda esingizda bo'lishi kerak
quyidagi konvensiyalar Iroha:

1. Bir qator alohida ajratgichlar mavjud.
   qurilish turlari:

   - `@` hisobning aliaslari va ko'rsatilgan hisob / ommaviy kalit shakllari uchun ajratilgan
   - `#` aktivlarni belgilash aliaslari va aktivlar balansini yozish uchun ajratilgan
   - `::` kontraktli aliaslar uchun ajratilgan
   - `.` domen va ma'lumotlar maydonining kvalifikatsiyasi uchun ajratilgan
   - `$` trigger-scoped matn shakllari uchun ajratilgan
   - `%` tasdiqlovchilarga ko'ra aniqlangan matn shakllari uchun qo'yiladi

2. Maximum belgilar soni (shu jumladan UTF-8 belgilar) nomni qo ' shib
   ikki omil bilan cheklanadi: `[0, u32::MAX]` va hozirgi
   to'plamga ajratilgan joy.

## Uni sinab koʻring . Taira {#try-it-on-taira}

Davlat aktivining aliasini uning kanonik aktivlari ta'rifiga kiritish ID:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

Buni aktivni aniqlash ro'yxati bilan taqqoslang:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

O ' zbekiston Respublikasi `#` Xarakter aktiv aliasini domen kontekstidan ajratib qo'yadi.
agar siz qasddan aktiv aliasi yoki aktivni yozmayotgan bo'lsangiz
ramziy ma'noda muvozanat.
