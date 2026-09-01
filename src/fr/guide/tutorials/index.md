---
translation_locale: fr
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# SDK Tutoriels {#sdk-tutorials}

Ces pages résument les points d'entrée client Iroha 3 expédiés depuis l'espace de travail principal, y compris les noms de paquet canoniques, les chemins d'installation et les points de départ minimaux.

## Ordre recommandé {#recommended-order}

1. [Installer Iroha 3](/fr/get-started/install-iroha.md)
2. [Lancer Iroha 3](/fr/get-started/launch-iroha.md)
3. Choisissez un SDK :
   - [Rust](/fr/guide/tutorials/rust.md)
   - [Python](/fr/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/fr/guide/tutorials/javascript.md)
   - [Kotlin, Android, et Java](/fr/guide/tutorials/kotlin-java.md)
   - [Swift et iOS](/fr/guide/tutorials/swift.md)
4. Consultez le [applications d'exemple](/fr/guide/tutorials/sample-apps.md) lorsque vous souhaitez une référence complète de l'application client.
5. Utilisez [Intégrer Kaigi](/fr/guide/tutorials/kaigi.md) pour ajouter à votre application des réunions audio/vidéo adossées à un portefeuille.
6. Utilisez [Musubi colis](/fr/guide/tutorials/musubi.md) lorsque vous avez besoin de bibliothèques sources réutilisables Kotodama avec des dépendances du registre en chaîne fixées.

## Échantillons {#samples}

L'espace de travail en amont contient JavaScript recettes et Swift/projets d'exemples iOS. Pour Android, commencez avec les modules Kotlin SDK et leurs tests.

- [Aperçu des applications d'exemple](/fr/guide/tutorials/sample-apps.md)
- [Intégrer Kaigi dans une application JavaScript](/fr/guide/tutorials/kaigi.md)

## Source de vérité {#source-of-truth}

Toutes les pages SDK ici sont dérivées de l’espace de travail en amont actuel :

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (miroir Java de la surface Android du premier Kotlin)
- `IrohaSwift`
- `crates/musubi`

En cas de doute, préférez les README et les métadonnées du paquet dans ces répertoires ; elles décrivent la révision de la source que vous êtes en train de construire.
