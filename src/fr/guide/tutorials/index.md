---
translation_locale: fr
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK Les tutoriels {#sdk-tutorials}

Ces pages résument les Iroha 3 les points d'entrée des clients expédiés depuis le principal
espace de travail, y compris les noms canoniques des paquets, les chemins d'installation et le minimum
points de départ.

## Règlement recommandé {#recommended-order}

1. [Installation Iroha 3](/fr/get-started/install-iroha.md)
2. [Lancement Iroha 3](/fr/get-started/launch-iroha.md)
3. Choisissez une SDK:
   - [Rust](/fr/guide/tutorials/rust.md)
   - [Python](/fr/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/fr/guide/tutorials/javascript.md)
   - [Kotlin, Android, et Java](/fr/guide/tutorials/kotlin-java.md)
   - [Swift et iOS](/fr/guide/tutorials/swift.md)
4. Révision des [échantillons d'applications](/fr/guide/tutorials/sample-apps.md) quand vous voulez une
   une référence complète de la demande client.
5. Utilisation [Embedded Kaigi](/fr/guide/tutorials/kaigi.md) lorsque vous voulez ajouter
   Les réunions audio/vidéo avec support de portefeuille dans votre propre application.
6. Utilisation [Musubi les emballages](/fr/guide/tutorials/musubi.md) lorsque vous avez besoin de réutilisables
   Kotodama bibliothèques sources avec des dépendances de registre en chaîne fichées.

## Des échantillons {#samples}

L'espace de travail en amont contient JavaScript recettes et Swift- l'échantillon iOS
pour les projets Android, commencez par le Kotlin SDK les modules et leurs essais.

- [Vue d'ensemble des applications](/fr/guide/tutorials/sample-apps.md)
- [Embedded Kaigi dans une JavaScript app](/fr/guide/tutorials/kaigi.md)

## La source de la vérité {#source-of-truth}

Tout le monde SDK Les pages ci-dessous sont dérivées de l'espace de travail en amont actuel:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (Roupeau Java du Kotlin- Tout d'abord Android surface)
- `IrohaSwift`
- `crates/musubi`

Si vous avez des doutes, préférer les README et les métadonnées de paquets dans ces annuaires;
Ils décrivent la révision de source que vous construisez.
