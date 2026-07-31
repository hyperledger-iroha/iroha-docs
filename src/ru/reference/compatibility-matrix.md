---
translation_locale: ru
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Матрица совместимости {#compatibility-matrix}

Матрица совместимости показывает кросс-SDK охват сценариев для текущего набора документов Iroha 3. По умолчанию страница загружает сброшенный снимок, созданный из прикрепленного пересмотра [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha).

Матрица состоит из:

- Истории в первой колонке
- SDKs в остальных колонках
- Символы статуса для охваченных, неудачных и отсутствующих данных

Сценарии без доказательств закрепленного пересмотра отображаются как отсутствующие данные, а не наследующие результаты из другого пересмотра источника.

<CompatibilityMatrixTable />

::: Информация
Установить `VITE_COMPAT_MATRIX_URL` только для обмены сжатого снимка совместимым живым бэк-эндем. Без этой переменной страница загружается `src/public/compat-matrix.json`.
:::
