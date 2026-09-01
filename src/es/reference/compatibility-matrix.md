---
translation_locale: es
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Matriz de compatibilidad {#compatibility-matrix}

La matriz de compatibilidad muestra cruzada SDK cobertura del escenario para el actual Iroha 3 documentos configurados. Por defecto, la página carga la vista de datos puntual incluida generada a partir de la fijada [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha) revisión.

La matriz consiste en:

- Historias en la primera columna
- SDKs a través de las columnas restantes
- Símbolos de estado para datos cubiertos, fallidos y faltantes

Solo los resultados verificados por el flujo de trabajo de actualización se informan como cubiertos o fallidos. Los escenarios sin evidencia para la revisión fijada se muestran como datos faltantes en lugar de heredar resultados de otra revisión de origen.

<CompatibilityMatrixTable />

::: info
Configure `VITE_COMPAT_MATRIX_URL` solo para sobrescribir la vista de datos puntual incluida con un backend en vivo compatible. Sin esa variable, la página carga `src/public/compat-matrix.json`.
:::
