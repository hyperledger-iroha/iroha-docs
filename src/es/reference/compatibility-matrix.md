---
translation_locale: es
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Matriz de compatibilidad {#compatibility-matrix}

La matriz de compatibilidad muestra SDK cobertura de escenarios para el actual Iroha 3 Docs set. De forma predeterminada, la página carga el snapshot en paquete generado a partir de la fijación [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha) Revisión.

La matriz se compone de:

- Las historias en la primera columna
- SDKs a través de las columnas restantes
- Los símbolos de estado para los datos cubiertos, fallidos y ausentes

Solo los resultados verificados por el flujo de trabajo de actualización se informan como cubiertos o fallidos. Los escenarios sin evidencia de la revisión fijada se muestran como datos perdidos en lugar de heredar resultados de otra fuente Revisión.

<CompatibilityMatrixTable />

::: Información
Configurar `VITE_COMPAT_MATRIX_URL` sólo para anotar la instantánea agrupada con un backend en vivo compatible. Sin esa variable, la página se carga `src/public/compat-matrix.json`.
:::
