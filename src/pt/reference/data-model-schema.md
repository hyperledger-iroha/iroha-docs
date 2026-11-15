---
translation_locale: pt
translation_source: /reference/data-model-schema.md
translation_source_hash: c4f0305c73f9470d1652b70e6787b59de2553a08b6c96603a9369512efbdb1af
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Esquema do Modelo de Dados {#data-model-schema}

Consulte o esquema a partir do nó exato que seu sistema de integração almeja. Torii fornece o esquema do modelo de dados ativo em `GET /v1/schema` quando essa interface está habilitada:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

Gere vínculos a partir dessa resposta, em vez de usar uma cópia publicada para outra compilação. A resposta do nó em execução é a fonte de autoridade para o modelo de dados compilado desse nó; mantenha-a fixada junto à compilação do nó usada pela integração.
