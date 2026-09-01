---
translation_locale: fr
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Installer Iroha 3 {#install-iroha-3}

Cette page couvre le flux d'installation actuel pour la chaîne d'outils et les binaires Iroha 3 en utilisant l'espace de travail en amont `hyperledger-iroha/iroha`.

## 1. Prérequis {#_1-prerequisites}

Installez ceux-ci en premier :

- [rustup](https://www.rust-lang.org/tools/install), donc la chaîne d'outils `rust-toolchain.toml` épinglée (`1.93.1`) est installée automatiquement
- `git`
- éventuellement, Docker et Docker Compose pour le démarrage rapide d’un réseau local à plusieurs pairs

## 2. Cloner l’espace de travail {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. Construire l'espace de travail {#_3-build-the-workspace}

Construis tout :

```bash
cargo build --workspace
```

Pour une version plus petite axée sur l'opérateur, compilez uniquement les principaux binaires :

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Les binaires résultants sont écrits dans `target/debug/` ou `target/release/`.

## 4. Vérifier les outils installés {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Les quatre fichiers binaires que vous utiliserez habituellement sont :

- `iroha3d` pour un démon pair réseau standard
- `iroha3d_taira` pour le lanceur de validateur canonique Taira
- `iroha` pour accéder par la CLI à Torii et aux points de terminaison de l’opérateur
- `kagami` pour les clés, les manifestes de genèse et les profils de réseau local

## 5. Réseau local optionnel et chemin Docker {#_5-optional-localnet-and-docker-path}

Le flux localnet actuel basé sur une source est généré par Kagami. Il écrit les configurations des pairs du réseau, les artefacts de genèse de la blockchain, la configuration du client, les scripts d'aide et un fichier Compose optionnel qui correspond au code extrait :

- `kagami localnet` pour les scripts des pairs locaux natifs du réseau
- `kagami docker` pour Docker Compose généré à partir d'un répertoire localnet

Continuez avec [Lancer Iroha 3](/fr/get-started/launch-iroha.md).
