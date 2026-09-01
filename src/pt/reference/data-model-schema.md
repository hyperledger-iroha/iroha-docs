---
translation_locale: pt
translation_source: /reference/data-model-schema.md
translation_source_hash: cf27b1f313a695b648ae450564a51120af0e3e39641ed140a187d128b930da97
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Esquema do Modelo de Dados {#data-model-schema}

Consulte o esquema a partir do nó exato que seu sistema de integração almeja. Torii fornece o esquema do modelo de dados ativo em `GET /v1/schema` quando essa interface está habilitada:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

Não gere vínculos pelo trecho de documentação registrado enquanto o status de procedência estiver pendente. A resposta do nó ativo é a fonte de verdade do modelo de dados compilado desse nó; fixe-a junto à compilação do nó usada pela integração.
