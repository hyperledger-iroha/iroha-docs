---
translation_locale: az
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Konqreslərin adları {#naming-conventions}

Hesabların, domenlərin və ya aktivlərin adlandırılması zamanı Iroha -də istifadə olunan aşağıdakı konvensiyaları nəzərə almaq lazımdır:

1. Müəyyən konstruksiya növləri üçün istifadə olunan bir sıra ayrılan ayırıcılar mövcuddur:

   - `@` Hesab adı və həcmli hesab / ictimai açar formları üçün nəzərdə tutulmuşdur.
   - `#` aktivlərin müəyyənləşdirilməsi əlifbaları və aktiv balansı əlifbası üçün nəzərdə tutulub
   - `::` müqavilə aliasları üçün nəzərdə tutulub.
   - `.` domen və məlumat məkanı ixtisası üçün nəzərdə tutulmuşdur.
   - `$` Təkərlənmiş mətn formaları üçün nəzərdə tutulmuşdur
   - `%` təsdiqləyici ölçülü mətn formaları üçün nəzərdə tutulub.

2. Bir adın ola biləcəyi maksimum hərflərin sayı (o cümlədən UTF-8 hərfləri) iki amil ilə məhdudlaşdırılır: `[0, u32::MAX]` və hazırda təyin olunan yığın yerləri.

## Taira üzərində sınayın. {#try-it-on-taira}

Bir ictimai aktivin aliasını onun kanonik aktiv tərifinə ID daxil etmək:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

Bunu aktivlərin təyinat siyahısı ilə müqayisə edin:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

`#` xarakteri bir aktiv aliasını domen kontekstindən ayırır. Əsas adlardan kənarda saxlayın, əgər siz məqsədyönlü olaraq bir aktiv əlifbasını yazmırsınızsa və ya maliyyə balansı əsl.
