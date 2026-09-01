---
translation_locale: az
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Uyğunluq Matrisi {#compatibility-matrix}

Uyğunluq matrisi qarşılıqlı göstərir-SDK mövcud üçün ssenari əhatəsi Iroha 3 sənədlər dəsti. Varsayılan olaraq, səhifə, möhkəmləndirilmişdən yaradılan paketlənmiş mövqe-vaxt məlumat görünüşünü yükləyir [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha) təkrar baxış.

Matris aşağıdakılardan ibarətdir:

- Birinci sütundakı hekayələr
- SDKs qalan sütunlar boyunca
- Qapalı, uğursuz və itkin məlumatlar üçün vəziyyət simvolları

Yalnız təzələmə iş prosesi ilə təsdiqlənmiş nəticələr əhatə olunan və ya uğursuz kimi hesabat edilir. Pinslənmiş versiya üçün sübutu olmayan ssenarilər digər mənbə versiyasından nəticələri miras qoymaq əvəzinə məlumat çatışmazlığı kimi göstərilir.

<CompatibilityMatrixTable />

::: info
`VITE_COMPAT_MATRIX_URL` dəyişənini yalnız uyğun canlı backend ilə birləşdirilmiş vaxt nöqtəsi məlumat görünüşünü üstələmək üçün təyin edin. Bu dəyişən olmadan səhifə `src/public/compat-matrix.json` yüklənir.
:::
