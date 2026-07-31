---
translation_locale: fr
translation_source: /get-started/install-iroha.md
translation_source_hash: 49e1a29243151fec1ada2729c315378455a8502811e1ae124e5917a88d59b55d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Installation Iroha 3 {#install-iroha-3}

Cette page couvre le flux de travail d'installation actuel pour les Iroha 3 chaîne d'outils
et des binaires utilisant le courant alternatif `hyperledger-iroha/iroha` espace de travail.

## 1. Les prérequis {#_1-prerequisites}

Installez-les d'abord:

- [rustup](https://www.rust-lang.org/tools/install), alors le collé
  `rust-toolchain.toml` chaîne d'outils (`1.93.1`) est installé automatiquement
- `git`
- optionnellement, Docker et Docker Compose pour le démarrage rapide multi-peer local

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

Pour une structure plus petite axée sur l'opérateur, compilons uniquement les principaux binaires:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Les binaires résultants sont écrits à `target/debug/` ou `target/release/`.

## 4. Vérifiez les outils installés {#_4-verify-the-installed-tools}

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Les trois binaires que vous utiliserez habituellement sont:

- `irohad` pour le daimon de la paire
- `iroha` pour CLI accès à Torii et les points finaux de l'opérateur
- `kagami` pour les clés, les manifestes de génèse et les profils localnet

## 5. le réseau local facultatif et Docker Chemin {#_5-optional-localnet-and-docker-path}

Le flux localnet actuel soutenu par la source est généré par Kagami. Il écrit peer
config, artifacts de la génèse, config client, scripts d'assistance et une option
Composer le fichier correspondant au code de sortie:

- `kagami localnet` pour les scripts locaux natifs
- `kagami docker` pour Docker Compose généré à partir d'un répertoire localnet

Continuez avec [Lancement Iroha 3](/fr/get-started/launch-iroha.md).
