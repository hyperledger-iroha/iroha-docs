---
translation_locale: pt
translation_source: /reference/compatibility-matrix.md
translation_source_hash: 5928eaf7e65023ad1867ca8d125efa61da6d8fe505b91e71b2c2121b183ce06e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Matriz de Compatibilidade {#compatibility-matrix}

A matriz de compatibilidade mostra cruzamento SDK cobertura de cenário para o atual Iroha 3 conjunto de documentos. Por padrão, a página carrega a visualização de dados de ponto no tempo agrupada, gerada a partir do fixado [`hyperledger-iroha/iroha`](https://github.com/hyperledger-iroha/iroha) revisão.

A matriz consiste em:

- Histórias na primeira coluna
- SDKs através das colunas restantes
- Símbolos de status para dados cobertos, falhos e ausentes

Apenas os resultados verificados pelo fluxo de trabalho de atualização são relatados como cobertos ou falhados. Cenários sem evidências para a revisão fixada são mostrados como dados ausentes em vez de herdar resultados de outra revisão de origem.

<CompatibilityMatrixTable />

::: info
Defina `VITE_COMPAT_MATRIX_URL` apenas para substituir a exibição de dados pontuais incluída com um backend ao vivo compatível. Sem essa variável, a página carrega `src/public/compat-matrix.json`.
:::
