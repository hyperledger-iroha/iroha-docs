---
translation_locale: es
translation_source: /reference/data-model-schema.md
translation_source_hash: c4f0305c73f9470d1652b70e6787b59de2553a08b6c96603a9369512efbdb1af
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Esquema del Modelo de Datos {#data-model-schema}

Consulta el esquema desde el nodo exacto al que apunta tu integración. Torii proporciona el esquema del modelo de datos activo en `GET /v1/schema` cuando esa superficie está habilitada:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

Genere los enlaces de lenguaje a partir de esa respuesta, en lugar de usar una copia publicada para otra compilación. La respuesta del nodo en vivo es la fuente de autoridad para el modelo de datos compilado de ese nodo; consérvela fijada junto con la compilación del nodo utilizada por su integración.
