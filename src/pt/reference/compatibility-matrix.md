---
translation_locale: pt
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Matriz de compatibilidade {#compatibility-matrix}

A matriz de compatibilidade mostra cobertura de cenário transversal SDK para o conjunto atual de documentos Iroha 3. Por padrão, a página carrega o snapshot em conjunto gerado a partir da revisão fixada [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha).

A matriz é constituída por:

- Histórias na primeira coluna
- SDKs em todas as colunas restantes
- símbolos de status para dados cobertos, falhados e faltantes

Apenas os resultados verificados pelo fluxo de trabalho de atualização são relatados como cobertos ou falhados. Os cenários sem evidências para a revisão fixada são mostrados como dados faltantes em vez de herdar resultados de outra revisão da fonte.

<CompatibilityMatrixTable />

::: info
Definir `VITE_COMPAT_MATRIX_URL` apenas para substituir o snapshot em conjunto com um backend ao vivo compatível. Sem essa variável, a página carrega `src/public/compat-matrix.json`.
:::
