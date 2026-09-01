---
translation_locale: az
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Adlandırma Qaydaları {#naming-conventions}

Hesabları, domenləri və ya aktivləri adlandırarkən, Iroha -də istifadə olunan aşağıdakı qaydaları nəzərə almalısınız:

1. Xüsusi növ konstruksiyalar üçün istifadə olunan bir sıra ayrıcılar mövcuddur:

   - `@` hesab ləqəbləri və məhdudlaşdırılmış hesab/ictimai açar formaları üçün ayrılıb
   - `#` aktiv təyini ləqəbləri və aktiv balansı literaları üçün ayrılıb
   - `::` müqavilə ləqəbləri üçün ayrılıb
   - `.` domen və məlumat sahəsi təsdiqi üçün ayrılmışdır
   - `$` tetik-şöbəli mətn formalari üçün ayrılmışdır
   - `%` təsdiqçi-əsaslı mətn formaları üçün ayrılmışdır

2. Bir adın ala biləcəyi maksimum simvol sayı (UTF-8 simvollar daxil olmaqla) iki amil ilə məhdudlaşdırılır: `[0, u32::MAX]` və hazırda ayrılmış stack sahəsi.

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
