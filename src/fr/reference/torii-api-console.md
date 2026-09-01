---
translation_locale: fr
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: bing-translator-llm

aside: false
---

# Outil interactif pour l’API Torii {#torii-api-console}

Utilisez le document OpenAPI en direct d'un point de terminaison Torii API en cours d'exécution pour inspecter les routes, envoyer des requêtes de test, copier les commandes curl et générer du code client.

<ToriiApiConsole />

## Exigences {#requirements}

- Le point de terminaison Torii API doit exposer `/openapi.json`.
- Les tests de navigateur nécessitent CORS pour autoriser cette origine de documents.
- Le navigateur doit être capable d'atteindre directement le point de terminaison API.
- La génération de code nécessite Node.js, pnpm et un environnement d'exécution Java pour OpenAPI Generator.

La console est par défaut sur `https://taira.sora.org`. Le développement local fonctionne généralement avec `http://127.0.0.1:8080` lorsque vous exécutez Torii sur votre machine.

## Essayez Taira d'abord {#try-taira-first}

Avant de générer un client, vérifiez que le document public OpenAPI est accessible depuis votre machine :

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

Ensuite, collez `https://taira.sora.org/openapi.json` dans la console et essayez une route en lecture seule telle que `GET /status`, `GET /v1/domains` ou `GET /v1/assets/definitions`. Réservez les flux de transaction signée et de clé privée pour un client SDK ou CLI qui charge les secrets à partir de votre environnement d'exécution logiciel.

## Clients générés {#generated-clients}

La commande du générateur utilise le même document en direct OpenAPI que celui que la console charge. Cela est utile pour les itinéraires d'opérateur, d'explorateur, d'application et de télémétrie JSON.

Pour les transactions du grand livre blockchain signées, les requêtes signées et les charges utiles natives Norito, privilégiez l'Iroha officiel SDKs. Les clients OpenAPI n'assemblent pas les signatures, ne gèrent pas les clés de compte et n'encodent pas les corps de transaction Norito pour vous.

Pour inspecter chaque générateur pris en charge par le générateur OpenAPI, exécutez :

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
