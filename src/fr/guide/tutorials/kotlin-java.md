---
translation_locale: fr
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: f2411fec1cc35b1bf7795a7ab5a0eb7a8eb6b60b4799ebf3db47208b902f87e6
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Kotlin, Android, et Java {#kotlin-android-and-java}

La pile client Kotlin SDK est la pile client par défaut pour les applications JVM et Android. Elle se trouve sous `kotlin/` dans le dépôt Iroha et est séparée par plateforme afin que le code portable n'acquière pas de dépendances Android.

## Modules {#modules}

|Artefact|Tapez|Utiliser|
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR | Pure Kotlin/JVM Norito, modèle de données, crypto, transaction, Torii, et code de protocole |
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android keystore, télémétrie de l'appareil et intégrations client soutenues par JNI|
| `org.hyperledger.iroha.sdk:offline-wallet-android` | AAR | Android transports de portefeuille hors ligne et intégration construits sur `client-android` |

Les artefacts ne sont pas encore publiés sur Maven Central. Construisez-les et publiez-les localement à partir de la révision source épinglée Iroha :

```bash
cd kotlin
./gradlew publishToMavenLocal
```

Puis sélectionnez uniquement l'artefact dont votre application a besoin :

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

`core-jvm` ne contient aucune dépendance Android. Conservez le code client et le keystore Android dans `client-android`, et utilisez `offline-wallet-android` pour les flux hors ligne uniquement Android et JNI.

## Kotlin et compatibilité Java {#kotlin-and-java-compatibility}

Le public API est Kotlin-first et fournit l'interopérabilité Java là où les appelants JVM en ont besoin. Les modifications équivalentes sont reproduites dans l'implémentation correspondante `java/`. Les nouvelles intégrations Android devraient commencer par les artefacts Kotlin ci-dessus.

Tous les modules Kotlin appliquent la compatibilité JDK 8 API au moment de la compilation avec `-Xjdk-release=8`, même si la chaîne d’outils de construction utilise elle-même JDK 21. Ne pas utiliser JDK 9+ APIs dans le code SDK.

## Construire et Tester {#build-and-test}

Exécutez les tests portables JVM :

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Construisez les artefacts Android :

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## Couverture actuelle {#current-coverage}

Le Kotlin SDK inclut :

- Norito codage et décodage
- gestion des comptes canoniques et des adresses d'actifs
- construction de transaction, signature et conteneurs de données hors ligne
- Torii HTTP, WebSocket, et SSE clients
- multisignature, abonnement, SoraFS, Nexus, et modèles Connect
- Android intégrations de keystore et de télémétrie de l'appareil
- Android hors ligne QR, à proximité, et NFC transports

Voir le [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/kotlin/README.md) pour les APIs spécifiques au module et les commandes de construction exactes.
