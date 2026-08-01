---
translation_locale: fr
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Travailler avec les binaires Iroha {#working-with-iroha-binaries}

Le flux de travail de l'opérateur Iroha 3 tourne autour de trois bases binaires principales:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) pour l'exécution d'un daemon partagé
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) pour le CLI et les commandes de l'opérateur
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) pour les clés, l'origine, les réseaux locaux et les profils

## Construisez à partir de la source {#build-from-source}

À partir de la racine d'espace de travail en amont:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Les options binaires de libération sont ensuite disponibles en `target/release/`.

Pour inspecter la surface de commande:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Exécuté directement depuis le référentiel {#run-directly-from-the-repository}

Si vous ne souhaitez pas installer quoi que ce soit à l'échelle mondiale, utilisez `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker L'image {#docker-image}

L'espace de travail en amont utilise `kagami localnet` et `kagami docker` à générer Docker Compose Les fichiers correspondant au code de sortie. `hyperledger/iroha:dev` l'image peut être utilisée avec ces fichiers générés.

Remplissez le CLI dans un conteneur:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Exécuter Kagami dans un conteneur:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Pour le démarrage par les pairs, générez un localnet et composez d'abord le fichier:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## Quelle option binaire dois- je utiliser ? {#which-binary-should-i-use}

- Utilisez `irohad` lorsque vous démarrez ou exploitez des pairs.
- Utilisez `iroha` lorsque vous avez besoin de consulter le registre, de soumettre des transactions ou d'inspecter les points finaux de l'opérateur.
- Utilisez `kagami` lorsque vous avez besoin de clés, de manifestes de génèse, de paquets de profils ou d'actifs localnet.
