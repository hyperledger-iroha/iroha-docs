# Data Model Schema

Query the schema from the exact node your integration targets. Torii serves the
active data-model schema at `GET /v1/schema` when that surface is enabled:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

Do not generate bindings from the checked-in documentation snippet while its
provenance status is pending. The live node response is authoritative for that
node's compiled data model; keep it pinned alongside the node build used by
your integration.
