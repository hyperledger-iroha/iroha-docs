---
translation_locale: uz
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Nomlash An'analari {#naming-conventions}

Hisoblar, domenlar yoki aktivlarni nomlayotganda, quyidagi Iroha da ishlatiladigan konventsiyalarni yodda tutishingiz kerak:

1. Ma'lum turdagi tuzilmalar uchun ishlatiladigan bir qator ajratgichlar mavjud:

   - `@` hisob aliaslari va cheklangan hisob/ommaviy kalit shakllari uchun ajratilgan
   - `#` aktiv qiymat ta'rifidagi taxallus va aktiv balans literalari uchun ajratilgan
   - `::` shartnoma laqablari uchun ajratilgan
   - `.` domen va ma’lumotlar makoni malakasiga ajratilgan
   - `$` faqat trigger-doiraviy matn shakllari uchun ajratilgan
   - `%` tekstual shakllar validator doirasiga ajratilgan

2. Ismda bo'lishi mumkin bo'lgan maksimal belgilar soni (UTF-8 belgilarni o'z ichiga olgan holda) ikki omil bilan cheklangan: `[0, u32::MAX]` va hozir ajratilgan stek maydoni.

## Ushbu ish oqimini Taira da ishga tushiring {#try-it-on-taira}

Jamoat aktiv aliasini uning kanonik aktiv taʼrif ID-siga yeching:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

Buni aktiv ta'riflari ro'yxati bilan solishtiring:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

`#` belgisi aktiv aliasini domen kontekstidan ajratadi. Uni oddiy nomlarda ishlatmang, agar siz ataylab aktiv aliasi yoki aktiv balansini yozmayotgan bo‘lsangiz.
