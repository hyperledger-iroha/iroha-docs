---
translation_locale: fr
translation_source: /reference/data-model-schema.md
translation_source_hash: c4f0305c73f9470d1652b70e6787b59de2553a08b6c96603a9369512efbdb1af
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Schéma du modèle de données {#data-model-schema}

Interrogez le schéma à partir du nœud exact ciblé par votre intégration. Torii fournit le schéma du modèle de données actif à `GET /v1/schema` lorsque cette interface est activée :

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

Générez les liaisons à partir de cette réponse plutôt qu’à partir d’une copie publiée pour une autre version compilée. La réponse du nœud en service fait autorité pour son modèle de données compilé ; conservez-la avec la version compilée du nœud utilisée par votre intégration, en fixant leurs versions.
