---
translation_locale: fr
translation_source: /guide/tutorials/sample-apps.md
translation_source_hash: 50fac5ad01faf8d09441cba90f29472da04630dbeb3c80111a19f3fb50bb1224
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# Échantillons et Recettes {#samples-and-recipes}

Le dépôt source Iroha contient SDK recettes et ensembles de tests qui suivent la même révision que le nœud.

## JavaScript Recettes {#javascript-recipes}

[`javascript/iroha_js/recipes`](https://github.com/hyperledger-iroha/iroha/tree/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/recipes) contient des exemples ciblés pour le regroupement déterministe des transactions, SORA Nexus transferts d'applications NFT et itération de compte, ISO flux de ponts, et Torii streaming. Chaque recette indique si elle fonctionne hors ligne ou nécessite une connexion en direct Torii API point de terminaison.

## Swift et iOS {#swift-and-ios}

Utilisez `IrohaSwift/Tests/IrohaSwiftTests` pour des exemples vérifiés par rapport au Swift SDK actuel. Consultez [Swift et iOS](/fr/guide/tutorials/swift.md) pour la configuration du package et du pont.

## Android {#android}

Pour les nouveaux travaux Android, utilisez d'abord les modules Kotlin-first `core-jvm`, `client-android` et `kagemusha-wallet-android` décrits dans [Kotlin, Android, et Java](/fr/guide/tutorials/kotlin-java.md). Le Kotlin SDK est le point de départ canonique pour les consommateurs de Android.
