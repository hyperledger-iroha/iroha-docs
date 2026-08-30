---
translation_locale: fr
translation_source: /guide/tutorials/sample-apps.md
translation_source_hash: 71258f4da9afcd94afce2fc2a53ce43540d8f67054ea789f0b2d105daba26006
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Des échantillons et des recettes {#samples-and-recipes}

Le répertoire source Iroha contient des recettes et des ensembles de tests SDK qui suivent la même révision que le nœud.

## JavaScript Des recettes {#javascript-recipes}

[`javascript/iroha_js/recipes`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/recipes) contient des exemples ciblés pour les lots de transactions déterministes, Nexus les transferts d'applications, NFT et l'itération des comptes, ISO les flux de pont, et Torii Chaque recette documentaire qu'il fonctionne hors ligne ou a besoin d'un live Torii point de fin.

## Swift et iOS {#swift-and-ios}

Utilisez `IrohaSwift/Tests/IrohaSwiftTests` pour les exemples vérifiés par rapport au courant Swift SDK. Voir [Swift et iOS ](/fr/guide/tutorials/swift.md) pour la configuration de l'emballage et du pont.

## Android {#android}

Pour de nouveaux travaux Android utilisez les modules Kotlin-first `core-jvm`, `client-android` et `offline-wallet-android` décrits dans [Kotlin, Android et Java](/fr/guide/tutorials/kotlin-java.md). Le Kotlin SDK est le point de départ canonique pour Android consommateurs.
