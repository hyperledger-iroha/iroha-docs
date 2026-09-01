---
translation_locale: az
translation_source: /documenting/snippets.md
translation_source_hash: 48d6670f100c7c6368fa03f163c9ff9e0322d36e51c22f89562b23b0e2ee2a2f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Kod Parçaları {#code-snippets}

Yaradılmış parçalar nümunələri onları hazırlayan Iroha təkmilləşdirməsindən olan kod, konfiqurasiya və sxemlərə bağlı saxlayır.

## Iroha Artefaktları Yeniləyir {#refreshing-iroha-artifacts}

Iroha-dən törədilmiş parçalar daxil edilir ki, adi sayt quruluşları şəbəkə bağlantısı və ya qardaş depo tələb etməsin. Onları açıq şəkildə yeniləyin:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

Qeydiyyatdan keçmiş `etc/refresh-iroha.ts` iş axını təmiz mənbə yoxlamasını `provenance/iroha.json` ilə yoxlayır, `/src/snippets` və Torii OpenAPI məqam-vaxt məlumat baxışını yenidən yaradır, və yeniləyir SHA-256 kriptoqrafik xeşləri. Məzmunu və mənşə dəyişikliklərini birlikdə nəzərdən keçirin. Normal asılılıq quraşdırılması və VitePress kompilyasiyalar dəyişdirilə bilən bir şaxəni götürmədən daxil edilmiş fayllardan istifadə edir.

## Parçaları daxil etmək {#including-snippets}

[VitePress kod-parçacığının sintaksisi](https://vitepress.dev/guide/markdown#import-code-snippets) istifadə edərək yaradılmış və ya yerli mənbəni daxil edin:

```md
<<< @/snippets/client.template.toml
```

Adlandırılmış kod bölgəsi onun bölgə adını əlavə etməklə daxil edilə bilər:

```md
<<< @/example_code/lorem.rs#ipsum
```

Əl ilə yazılmış nümunələri kiçik saxlayın. İctimai interfeyslər, konfiqurasiya şablonları, yaradılmış sxemlər və əmr çıxışı üçün yenilənmiş mənbə nümunələrinə üstünlük verin.
