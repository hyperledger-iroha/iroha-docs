---
translation_locale: fr
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API Console {#torii-api-console}

Utilisez le live OpenAPI document d'une opération Torii point final pour les itinéraires d'inspection,
envoyer des demandes de test, copier curl commandes et générer le code client.

<ToriiApiConsole />

## Exigences {#requirements}

- Les Torii point final doit exposer `/openapi.json`.
- Test du navigateur nécessite CORS pour permettre l'origine de ce document.
- Le navigateur doit être en mesure d'atteindre directement le point final.
- Génération de code nécessite Node.js, pnpm, et un temps d'exécution Java pour OpenAPI
  Le générateur.

La console est par défaut `https://taira.sora.org`. Développement local habituellement
fonctionne avec `http://127.0.0.1:8080` quand tu cours Torii sur votre machine.

## Essayez ! Taira Tout d'abord {#try-taira-first}

Avant de générer un client, vérifiez que le public OpenAPI le document est accessible
à partir de votre machine:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

Puis collez-le. `https://taira.sora.org/openapi.json` dans la console et essayez un
Route uniquement lisible, telle que `GET /status`, `GET /v1/domains`, ou
`GET /v1/assets/definitions`. Enregistrer les transactions signées et les flux de clé privée pour
une SDK ou CLI client qui charge des secrets de votre environnement d'exécution.

## Clients générés {#generated-clients}

La commande du générateur utilise le même live OpenAPI document que la console
Ce dispositif est utile pour JSON l'opérateur, l'explorateur, les applications et les itinéraires de télémétrie.

Pour les transactions de registre signées, les requêtes signées et Norito- les charges utiles natives,
préférer le fonctionnaire Iroha SDKs. OpenAPI les clients ne rassemblent pas de signatures,
gérer les clés de compte ou encoder Norito Les organes de transaction pour vous.

Pour inspecter chaque générateur supporté par OpenAPI Générateur, démarre:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
