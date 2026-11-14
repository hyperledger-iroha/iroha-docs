---
translation_locale: uz
translation_source: /reference/naming.md
translation_source_hash: 15d095e674edf780c5859abe6f4615d53338e3304e8eedfa494017911204d4b6
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# Nomlash An'analari {#naming-conventions}

Hisoblar, domenlar yoki aktivlarni nomlayotganda, quyidagi Iroha da ishlatiladigan konventsiyalarni yodda tutishingiz kerak:

1. Ma'lum turdagi tuzilmalar uchun ishlatiladigan bir qator ajratgichlar mavjud:

   - `@` hisob aliaslari va cheklangan hisob/ommaviy kalit shakllari uchun ajratilgan
   - `#` aktiv qiymat ta'rifidagi taxallus va aktiv balans literalari uchun ajratilgan
   - `::` shartnoma laqablari uchun ajratilgan
   - `.` domen va ma’lumotlar makoni malakasiga ajratilgan
   - `$` `name$domain.dataspace` kabi NFT identifikatorlari uchun ajratilgan

2. Nom bo‘sh bo‘lmasligi, Unicode NFC shaklida bo‘lishi, uzunligi ko‘pi bilan 255 UTF-8 bayt bo‘lishi hamda bo‘shliq, boshqaruv va ikki tomonlama yo‘nalishni boshqarish belgilarini o‘z ichiga olmasligi shart.

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
