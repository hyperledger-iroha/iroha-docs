---
translation_locale: fr
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# L'installation Iroha 3 {#install-iroha-3}

Cette page couvre le flux de travail d'installation actuel pour la chaîne d'outils Iroha 3 et les binaires utilisant l'espace de travail en amont `hyperledger-iroha/iroha`.

## 1. Les prérequis {#_1-prerequisites}

Installez-les d'abord:

- [rustup](https://www.rust-lang.org/tools/install), de sorte que la chaîne d'outils fixée `rust-toolchain.toml` (`1.93.1`) est installée automatiquement
- `git`
- optionnellement, Docker et Docker Compose pour le démarrage rapide local multi-peer

## 2. Cloner l'espace de travail {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. Construisez l'espace de travail {#_3-build-the-workspace}

Construisez tout:

```bash
cargo build --workspace
```

Pour une structure plus petite axée sur l'opérateur, compilez uniquement les principaux binaires:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Les binaires résultants sont rédigés à `target/debug/` ou `target/release/`.

## 4. Vérifiez les outils installés {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Les quatre binaires que vous utiliserez habituellement sont:

- `iroha3d` pour un daemon par rapport à l'autre
- `iroha3d_taira` pour le lanceur de validateur canonique Taira
- `iroha` pour CLI l'accès à Torii et les points finaux de l'opérateur
- `kagami` pour les clés, les manifestes de génèse et les profils du localnet

## 5. Localnet optionnel et chemin Docker {#_5-optional-localnet-and-docker-path}

Le flux localnet actuel soutenu par la source est généré par Kagami. Il écrit des configurations de pairs, des artefacts de génèse, des configurations du client, des scripts d'assistance et un fichier Compose optionnel qui correspond au code vérifié:

- `kagami localnet` pour les scripts locaux natifs par rapport à leurs pairs
- `kagami docker` pour le Docker Compose généré à partir d'un répertoire localnet

Continuez avec [Déploiement Iroha 3](/fr/get-started/launch-iroha.md).
