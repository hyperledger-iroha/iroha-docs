---
translation_locale: fr
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Console Torii API {#torii-api-console}

Utilisez le document OpenAPI en direct depuis un point d'exécution Torii pour inspecter les itinéraires, envoyer des demandes de test, copier les commandes curl et générer du code client.

<ToriiApiConsole />

## Les exigences {#requirements}

- Le point final Torii doit exposer `/openapi.json`.
- Le test du navigateur nécessite CORS pour permettre l'origine de ce document.
- Le navigateur doit être en mesure d'atteindre directement le point final.
- La génération de code nécessite Node.js, pnpm, et un temps d'exécution Java pour le générateur OpenAPI.

La console est par défaut `https://taira.sora.org`. Le développement local fonctionne généralement avec `http://127.0.0.1:8080` lorsque vous exécutez Torii sur votre machine.

## Essayez d'abord Taira {#try-taira-first}

Avant de générer un client, vérifiez que le document public OpenAPI est accessible à partir de votre machine:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

Ensuite, collez `https://taira.sora.org/openapi.json` dans la console et essayez un itinéraire à lecture seule tel que `GET /status`, `GET /v1/domains` ou `GET /v1/assets/definitions`. Enregistrez les transactions signées et les flux de clés privées pour un client SDK ou CLI qui charge des secrets de votre environnement d'exécution.

## Clients générés {#generated-clients}

La commande du générateur utilise le même live OpenAPI le document qui est chargé par la console. JSON l'opérateur, l'explorateur, les applications et les itinéraires de télémétrie.

Pour les transactions de registre signées, les requêtes signées et les charges utiles natives Norito, préférer le Iroha officiel SDKs. Les clients OpenAPI ne rassemblent pas de signatures, ne gèrent pas de clés de compte ni n'encodent pour vous les entités de transaction Norito.

Pour inspecter tous les générateurs pris en charge par le générateur OpenAPI, exécuter:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
