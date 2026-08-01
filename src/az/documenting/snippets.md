---
translation_locale: az
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Şifrə snippets {#code-snippets}

İstehsal olunan bölmələr onları istehsal edən Iroha yenidənqurmadan kod, konfiqurasiya və sxemlərlə bağlı nümunələri saxlayır.

## Təmizləyici Iroha artefaktlar {#refreshing-iroha-artifacts}

Iroha-dən alınan parçalar adi sayt quruluşlarında şəbəkə girişinin və ya qardaş anbarın tələb olunmaması üçün yoxlanılır. Onları açıq şəkildə yeniləyin:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

Qeydiyyatdan keçmişlər. [`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts) iş axını təmiz mənbəyə qarşı verilişini təsdiq edir `provenance/iroha.json`, bərpa edir `/src/snippets` və Torii OpenAPI sürətli şəkil və yeniləmələr SHA-256 hashlər. Məzmun və mənşəli dəyişiklikləri birlikdə baxın. Normal asılılıq quraşdırılması və VitePress Buildlər dəyişdirilə bilən bir şöbənin alınmadan qeyd olunmuş faylları istehlak edir.

## Snippets də daxil olmaqla {#including-snippets}

Yaradılmış və ya yerli mənbəyi daxil etmək üçün [VitePress kod-snippet sintaksını ](https://vitepress.dev/guide/markdown#import-code-snippets) istifadə edin:

```md
<<< @/snippets/client.template.toml
```

Adlı bir kod bölgəsinin adının əlavə edilməsi ilə daxil edilə bilər:

```md
<<< @/example_code/lorem.rs#ipsum
```

Əli yazılmış nümunələri kiçik saxlayın. İctimai interfeyslər, konfigurasiya şablonları, yaradılan sxemlər və əmr çıxışı üçün yenilənmiş mənbə əşyalarına üstünlük verin .
