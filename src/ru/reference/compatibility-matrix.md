---
translation_locale: ru
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Матрица совместимости {#compatibility-matrix}

Матрица совместимости показывает перекрестную SDK охват сценариев для текущего
Iroha 3 По умолчанию страница загружает сделанный снимок
из забитых [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha)
пересмотр.

Матрица состоит из:

- **Истории** в первой колонке
- **SDKs** по остальным колонкам
- **Символы статуса** для охваченных, неудачных и отсутствующих данных

Отчеты о результатах, подтвержденных рабочим процессом обновления, должны быть представлены только как охваченные или
Сценарии без доказательств закрепленного пересмотра отображаются как
отсутствующие данные, а не наследуемые результаты от другого пересмотра источника.

<CompatibilityMatrixTable />

::: info
Сборник `VITE_COMPAT_MATRIX_URL` только для обмены сжатого снимка
без этой переменной страница загружается
`src/public/compat-matrix.json`.
:::
