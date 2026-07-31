---
translation_locale: uz
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Anjumanlarning nomi {#naming-conventions}

Hisobvaraqlar, domenlar yoki aktivlarni nomlashda siz Iroha da ishlatiladigan quyidagi konvensiyalarni yodda tutishingiz kerak:

1. Konstruksiyalarning muayyan turlari uchun foydalaniladigan bir qator ajratgichlar mavjud:

   - `@` hisobning aliaslari va ko'rsatkichli hisob / ommaviy kalit shakllari uchun ajratilgan
   - `#` aktivlarni belgilash aliaslari va aktivlar balansini yozish uchun mo'ljallangan
   - `::` kontraktli aliaslar uchun mo'ljallangan
   - `.` domenlar va ma'lumotlar maydonlari uchun ajratilgan
   - `$` trigger-scoped matn shakllari uchun qo'yiladi
   - `%` tasdiqlovchilarga ko'rsatilgan matn shakllari uchun qo'yiladi

2. UTF-8 belgilarini o'z ichiga olgan harflarning maksimal soni ikkita omil bilan cheklanadi: `[0, u32::MAX]` va hozirda ajratilgan to'plam maydoni.

## Taira bilan sinab ko'ring. {#try-it-on-taira}

Umumiy aktiv aliasini uning kanonik aktiv ta'rifiga kiritish ID:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

Buni aktivni belgilash ro'yxati bilan taqqoslang:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

`#` belgisi aktiv aliasini domen kontekstidan ajratib qo'yadi. Agar siz qasddan aktiv aliasi yoki aktiv balansini literal yozmagan bo'lsangiz, uni oddiy nomlardan saqlang.
