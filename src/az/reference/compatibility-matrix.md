---
translation_locale: az
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Müvafiqlik matrisi {#compatibility-matrix}

Müvafiqlik matrisində mövcud Iroha 3 sənədlər dəstinin çapraz SDK ssenari örtüyü göstərilir. Varsayılan olaraq səhifə sabitləşdirilmiş [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha) yenidənqurmadan əldə edilmiş birləşmiş sürətnaməni yükləyir.

Matrix aşağıdakılardan ibarətdir:

- Birinci sütundakı hekayələr
- SDKs qalan sütunlarda
- Gizli, uğursuz və itkin olan məlumatlar üçün status simvolları

Yeniləmə iş axını ilə təsdiqlənən yalnız nəticələr əhatə olunmuş və ya uğursuz olduğu bildirilir. Qapalı yenidənqurma üçün sübut olmayan ssenarilər başqa bir mənbə yenidənqurmasının nəticələrini irs etmək əvəzinə itirilmiş məlumat kimi göstərilmişdir.

<CompatibilityMatrixTable />

::: info
`VITE_COMPAT_MATRIX_URL` yalnız uyğun canlı backend ilə birləşdirilmiş sürət görüntüsünü əvəz etmək üçün təyin edin. Bu dəyişən olmadan səhifə yüklənir `src/public/compat-matrix.json`.
:::
