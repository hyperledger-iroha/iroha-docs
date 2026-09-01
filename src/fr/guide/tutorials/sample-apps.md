---
translation_locale: fr
translation_source: /guide/tutorials/sample-apps.md
translation_source_hash: 4979ab2c52eba4040d7f003f3da73dbc333fa7e047b0259816d0d34f97377749
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Échantillons et Recettes {#samples-and-recipes}

Le dépôt source Iroha contient SDK recettes et ensembles de tests qui suivent la même révision que le nœud.

## JavaScript Recettes {#javascript-recipes}

[`javascript/iroha_js/recipes`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes) contient des exemples ciblés pour le regroupement déterministe des transactions, Nexus transferts d'applications NFT et itération de compte, ISO flux de ponts, et Torii streaming. Chaque recette indique si elle fonctionne hors ligne ou nécessite une connexion en direct Torii API point de terminaison.

## Swift et iOS {#swift-and-ios}

Utilisez `IrohaSwift/Tests/IrohaSwiftTests` pour des exemples vérifiés par rapport au Swift SDK actuel. Consultez [Swift et iOS](/fr/guide/tutorials/swift.md) pour la configuration du package et du pont.

## Android {#android}

Pour les nouveaux travaux Android, utilisez d'abord les modules Kotlin-first `core-jvm`, `client-android` et `offline-wallet-android` décrits dans [Kotlin, Android, et Java](/fr/guide/tutorials/kotlin-java.md). Le Kotlin SDK est le point de départ canonique pour les consommateurs de Android.
