---
translation_locale: fr
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 62d6f434e5af4213420c456ee27ebdc260c8b0e9f7a85bc3ba955ee9c79a058d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android et Java {#kotlin-android-and-java}

Le Kotlin SDK est la pile client par défaut pour les applications JVM et Android. Il vit sous `kotlin/` dans le référentiel Iroha et est divisé par plateforme de sorte que le code portable n'acquiert pas de dépendances à Android.

## Les modules {#modules}

|Un objet .|Type |Utilisation |
| --- | --- | --- |
|`org.hyperledger.iroha.sdk:core-jvm` |JAR | Pure Kotlin/JVM Norito, le modèle de données, la cryptographie, les transactions, Torii, et code de protocole |
|`org.hyperledger.iroha.sdk:client-android` |AAR |Android stockage de clés, télémétrie d'appareils et intégrations client soutenues par JNI |
|`org.hyperledger.iroha.sdk:offline-wallet-android` |AAR |Android Transports et intégration de portefeuille hors ligne basés sur `client-android` |

Les objets n'ont pas encore été publiés à Maven Central. Iroha révision de la source:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

Ensuite, sélectionnez uniquement l' artefact dont vous avez besoin pour votre demande:

```kotlin
repositories {
    mavenLocal()
}

dependencies {
    implementation("org.hyperledger.iroha.sdk:core-jvm:0.1.0")
    // Android client features:
    // implementation("org.hyperledger.iroha.sdk:client-android:0.1.0")
    // Android offline-wallet features:
    // implementation("org.hyperledger.iroha.sdk:offline-wallet-android:0.1.0")
}
```

`core-jvm` ne contient pas Android Les dépendances. Android code client et clé de stockage dans `client-android`, et l'utilisation `offline-wallet-android` pour Android- uniquement pour le portefeuille hors ligne et JNI Il y a des courants.

## Kotlin et la compatibilité avec Java {#kotlin-and-java-compatibility}

Le public API est Kotlin- d'abord et fournit l'interop Java où JVM Les changements équivalents sont reflétés dans les messages correspondants `java/` mise en œuvre. Android Les intégrations devraient commencer par les Kotlin Il y a des objets au-dessus.

Tout le monde Kotlin les modules mettent en œuvre JDK 8 API la compatibilité au moment de la compilation avec `-Xjdk-release=8`, même si la chaîne d'outils de construction elle-même utilise JDK 21. Ne pas utiliser JDK 9+ APIs dans SDK le code.

## Construisez et testez {#build-and-test}

Exécuter les tests portables JVM:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Construire les objets Android:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## Couverture actuelle {#current-coverage}

Le Kotlin SDK comprend les éléments suivants:

- Norito chiffrement et décoding
- gestion des comptes canoniques et des adresses d'actifs
- Construction des transactions, signature et enveloppes hors ligne
- Les clients Torii HTTP, WebSocket et SSE
- les modèles multisignatures, abonnements, SoraFS, Nexus et Connect
- Android intégrations de télémétrie du stockage et des dispositifs
- Android hors connexion QR, à proximité et NFC

Voir le [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md) pour les commandes de construction spécifiques au module APIs et exactes.
