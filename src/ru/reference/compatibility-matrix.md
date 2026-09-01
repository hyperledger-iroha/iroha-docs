---
translation_locale: ru
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Матрица совместимости {#compatibility-matrix}

Матрица совместимости показывает перекрестные SDK покрытие сценариев для текущего Iroha 3 набор документов. По умолчанию страница загружает пакетный снимок данных, сгенерированный из закрепленных [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha) пересмотр.

Матрица состоит из:

- Истории в первом столбце
- SDKs по оставшимся столбцам
- Символы состояния для закрытых, неудачных и отсутствующих данных

Только результаты, проверенные обновленным рабочим процессом, отображаются как покрытые или неудачные. Сценарии без доказательств для закрепленной версии отображаются как отсутствующие данные, а не наследуют результаты из другой исходной версии.

<CompatibilityMatrixTable />

::: info
Установите `VITE_COMPAT_MATRIX_URL` только для замены встроенного снимка данных совместимым рабочим сервером. Без этой переменной страница загружается `src/public/compat-matrix.json`.
:::
