---
translation_locale: fr
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK Les tutoriels {#sdk-tutorials}

Ces pages résument les points d'entrée du client Iroha 3 expédiés à partir de l'espace de travail principal, y compris les noms canoniques des paquets, les chemins d'installation et les points de départ minimaux.

## L'ordre recommandé {#recommended-order}

1. [Installation de Iroha 3](/fr/get-started/install-iroha.md)
2. [Le lancement Iroha 3](/fr/get-started/launch-iroha.md)
3. Choisissez un SDK:
   - [Rust](/fr/guide/tutorials/rust.md)
   - [Python](/fr/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/fr/guide/tutorials/javascript.md)
   - [Kotlin, Android et Java](/fr/guide/tutorials/kotlin-java.md)
   - [Swift et iOS](/fr/guide/tutorials/swift.md)
4. Consultez l'échantillon d'applications [ ](/fr/guide/tutorials/sample-apps.md) lorsque vous souhaitez une référence complète de l'application client.
5. Utilisez [Embed Kaigi](/fr/guide/tutorials/kaigi.md) lorsque vous souhaitez ajouter des réunions audio/vidéo prises en charge par votre portefeuille à votre propre application.
6. Utilisez les paquets [Musubi](/fr/guide/tutorials/musubi.md) lorsque vous avez besoin de bibliothèques sources Kotodama réutilisables avec des dépendances de registre en chaîne fichées.

## Des échantillons {#samples}

L'espace de travail en amont contient des recettes JavaScript et des projets d'échantillonnage Swift/iOS. Pour Android, commencez par les modules Kotlin SDK et leurs essais.

- [Exemple d'applications de référence](/fr/guide/tutorials/sample-apps.md)
- [Embed Kaigi dans une application JavaScript ](/fr/guide/tutorials/kaigi.md)

## La source de la vérité {#source-of-truth}

Toutes les pages SDK sont dérivées de l'espace de travail en amont actuel:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (Roupeau Java de la Kotlin- d'abord Android la surface)
- `IrohaSwift`
- `crates/musubi`

En cas de doute, préférer les métadonnées README et le paquet dans ces annuaires; ils décrivent la révision de source que vous construisez.
