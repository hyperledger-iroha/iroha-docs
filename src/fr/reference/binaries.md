---
translation_locale: fr
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Travailler avec Iroha Binerie {#working-with-iroha-binaries}

Les Iroha 3 le flux de travail de l'opérateur tourne autour de trois binaires primaires:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) pour avoir dirigé un daemon de peer
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) pour CLI et commandes de l'opérateur
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) pour les clés, la génèse, les réseaux locaux et les profils

## Construisez à partir de la source {#build-from-source}

De la racine de l'espace de travail en amont:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Les binaires de libération sont alors disponibles en `target/release/`.

Pour inspecter la surface de commande:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Exécuter directement depuis le référentiel {#run-directly-from-the-repository}

Si vous ne voulez pas installer quelque chose dans le monde entier, utilisez `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Image {#docker-image}

L'espace de travail en amont utilise `kagami localnet` et `kagami docker` à générer
Docker Compose Les fichiers correspondant au code de sortie. `hyperledger/iroha:dev`
l'image peut être utilisée avec ces fichiers générés.

Réglez le CLI dans un conteneur:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Courir Kagami dans un conteneur:

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

- Utilisation `irohad` lorsque vous commencez ou exploitez des pairs.
- Utilisation `iroha` lorsque vous avez besoin de consulter le registre, de soumettre des transactions ou d'inspecter les points finaux de l'opérateur.
- Utilisation `kagami` lorsque vous avez besoin de clés, de manifestes génétiques, de paquets de profils ou d'actifs localnet.
