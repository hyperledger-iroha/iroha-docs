---
translation_locale: fr
translation_source: /guide/tutorials/kotlin-java.md
translation_source_hash: 91dfd38597028531ec579eeb97dcd5acbfcdf6d27ba51991ca96a2d40077aaef
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Kotlin, Android, et Java {#kotlin-android-and-java}

Les Kotlin SDK est la pile client par défaut pour JVM et Android les demandes.
Il vit sous `kotlin/` dans le Iroha le référentiel et est divisé par plate-forme
code portable n'acquiert pas Android les dépendances.

## Les modules {#modules}

| Artéfacts | Type | Utilisation |
| --- | --- | --- |
| `org.hyperledger.iroha.sdk:core-jvm` | JAR | Pure Kotlin/JVM Norito, modèles de données, crypto, transaction, Torii, et code de protocole |
| `org.hyperledger.iroha.sdk:client-android` | AAR | Android le stockage des clés, la télémétrie du dispositif et JNI- les intégrations client soutenues |
| `org.hyperledger.iroha.sdk:offline-wallet-android` | AAR | Android Transports et intégrations de portefeuille hors ligne `client-android` |

Les artefacts ne sont pas encore publiés à Maven Central.
localement à partir de l'appliqué Iroha révision de la source:

```bash
cd kotlin
./gradlew publishToMavenLocal
```

Ensuite, sélectionnez uniquement l' artefact dont votre demande a besoin:

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

`core-jvm` ne contient pas Android Les dépendances. Android client et keystore
code dans `client-android`, et utilisation `offline-wallet-android` pour Android- Seulement
portefeuille hors ligne et JNI Il coule.

## Kotlin et compatibilité avec Java {#kotlin-and-java-compatibility}

Le public API est Kotlin- d'abord et fournit une interop Java où JVM les appelants ont besoin
Les modifications équivalentes sont reflétées dans les `java/`
mise en œuvre. Android Les intégrations devraient commencer par Kotlin
Les artefacts ci-dessus.

Tout le monde Kotlin les modules appliquent JDK 8 API compatibilité au moment de la compilation avec
`-Xjdk-release=8`, même si la chaîne d'outils de construction elle-même utilise JDK 21. Ne pas le faire
utilisation JDK 9+ APIs dans SDK le code.

## Construisez et testez {#build-and-test}

Remplissez le portable JVM les essais:

```bash
cd kotlin
./gradlew :core-jvm:test --console=plain
```

Construire le Android les objets:

```bash
./gradlew :client-android:assembleRelease \
  :offline-wallet-android:assembleRelease --quiet
```

## Couverture actuelle {#current-coverage}

Les Kotlin SDK inclut:

- Norito le codage et le décoding
- gestion du compte canonique et des adresses d'actifs
- les enveloppes de construction, de signature et hors ligne des transactions
- Torii HTTP, WebSocket, et SSE clients
- une signature multiple, un abonnement, SoraFS, Nexus, et les modèles Connect
- Android intégrations de télémétrie des dispositifs et du magasin de clés
- Android hors ligne QR, À proximité, et NFC les transports

Voir le [Kotlin SDK README](https://github.com/hyperledger-iroha/iroha/blob/main/kotlin/README.md)
pour les modules spécifiques APIs et des commandes de construction exactes.
