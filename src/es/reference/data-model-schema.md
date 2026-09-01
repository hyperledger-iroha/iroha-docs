---
translation_locale: es
translation_source: /reference/data-model-schema.md
translation_source_hash: cf27b1f313a695b648ae450564a51120af0e3e39641ed140a187d128b930da97
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Esquema del Modelo de Datos {#data-model-schema}

Consulta el esquema desde el nodo exacto al que apunta tu integración. Torii proporciona el esquema del modelo de datos activo en `GET /v1/schema` cuando esa superficie está habilitada:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

No genere vinculaciones a partir del fragmento de documentación registrado mientras su estado de procedencia esté pendiente. La respuesta del nodo en vivo es autoritaria para el modelo de datos compilado de ese nodo; manténgala fija junto con la compilación del nodo utilizada por su integración.
