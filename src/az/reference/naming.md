---
translation_locale: az
translation_source: /reference/naming.md
translation_source_hash: 15d095e674edf780c5859abe6f4615d53338e3304e8eedfa494017911204d4b6
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# Adlandırma Qaydaları {#naming-conventions}

Hesabları, domenləri və ya aktivləri adlandırarkən, Iroha -də istifadə olunan aşağıdakı qaydaları nəzərə almalısınız:

1. Xüsusi növ konstruksiyalar üçün istifadə olunan bir sıra ayrıcılar mövcuddur:

   - `@` hesab ləqəbləri və məhdudlaşdırılmış hesab/ictimai açar formaları üçün ayrılıb
   - `#` aktiv təyini ləqəbləri və aktiv balansı literaları üçün ayrılıb
   - `::` müqavilə ləqəbləri üçün ayrılıb
   - `.` domen və məlumat sahəsi təsdiqi üçün ayrılmışdır
   - `$` `name$domain.dataspace` kimi NFT identifikatorları üçün ayrılmışdır

2. Ad boş olmamalı, Unicode NFC formasında olmalı, uzunluğu ən çoxu 255 UTF-8 bayt olmalı və boşluq, idarəetmə və ikiistiqamətli idarəetmə simvollarından azad olmalıdır.

## Bu iş axınını Taira üzərində işə sal {#try-it-on-taira}

İctimai aktiv təxəllüsünü onun tək protokol-standart aktiv tərif ID-sinə çevirin:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

Bunu aktivlərin tərif siyahısı ilə müqayisə edin:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

`#` simvolu aktiv ləqəbini domen kontekstindən ayırır. Onu sadə adlarda istifadə etməyin, əgər qəsdən aktiv ləqəbini və ya aktiv balansını yazmırsınızsa.
