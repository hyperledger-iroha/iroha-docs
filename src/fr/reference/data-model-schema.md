---
translation_locale: fr
translation_source: /reference/data-model-schema.md
translation_source_hash: cf27b1f313a695b648ae450564a51120af0e3e39641ed140a187d128b930da97
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Schéma du modèle de données {#data-model-schema}

Interrogez le schéma à partir du nœud exact ciblé par votre intégration. Torii fournit le schéma du modèle de données actif à `GET /v1/schema` lorsque cette interface est activée :

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

Ne générez pas de liaisons à partir de l'extrait de documentation mis en dépôt tant que son statut de provenance est en attente. La réponse du nœud en direct est autoritaire pour le modèle de données compilé de ce nœud ; gardez-la épinglée avec la version de construction du nœud utilisée par votre intégration.
