---
translation_locale: fr
translation_source: /guide/tutorials/sample-apps.md
translation_source_hash: af3e0b8698f877c035ccd3bb71926cea14d1029fc2eb73e23756d57357935f0e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Des échantillons et des recettes {#samples-and-recipes}

Les Iroha le référentiel source contient SDK recettes et suites de test qui suivent le
la même révision que le nœud.

## JavaScript Les recettes {#javascript-recipes}

[`javascript/iroha_js/recipes`](https://github.com/hyperledger-iroha/iroha/tree/main/javascript/iroha_js/recipes)
contient des exemples ciblés pour le partage de transactions déterministiques, Nexus app
les transferts, NFT et l'itération des comptes, ISO les débits de pont et Torii Le streaming.
Chaque recette documenté si elle fonctionne hors ligne ou a besoin d'un live Torii point de fin.

## Swift et iOS {#swift-and-ios}

Utilisation `IrohaSwift/Tests/IrohaSwiftTests` pour les exemples vérifiés par rapport au courant
Swift SDK. Vous voyez ? [Swift et iOS](/fr/guide/tutorials/swift.md) pour le colis et le pont
La mise en place.

## Android {#android}

Pour les nouveaux Android le travail, utilisez Kotlin- Tout d'abord `core-jvm`, `client-android`, et
`offline-wallet-android` modules décrits dans
[Kotlin, Android, et Java](/fr/guide/tutorials/kotlin-java.md). Les Kotlin SDK est
le point de départ canonique pour Android les consommateurs.
