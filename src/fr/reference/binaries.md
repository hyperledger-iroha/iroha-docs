---
translation_locale: fr
translation_source: /reference/binaries.md
translation_source_hash: 5a36877954bec97691e45697680bfbd6e0a7c7695e48a796bc7c9a41d4756644
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Travailler avec les binaires Iroha {#working-with-iroha-binaries}

Le flux de travail de l'opérateur Iroha 3 tourne autour de quatre binaires principaux:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) pour l'exécution d'un daemon partagé
- `iroha3d_taira` pour le lanceur de validateur canonique Taira
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) pour le CLI et les commandes de l'opérateur
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) pour les clés, l'origine, les réseaux locaux et les profils

## Construisez à partir de la source {#build-from-source}

À partir de la racine d'espace de travail en amont:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Les options binaires de libération sont ensuite disponibles en `target/release/`.

Pour inspecter la surface de commande:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## Exécuté directement depuis le référentiel {#run-directly-from-the-repository}

Si vous ne souhaitez pas installer quoi que ce soit à l'échelle mondiale, utilisez `cargo run`:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
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
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## Quelle option binaire dois- je utiliser ? {#which-binary-should-i-use}

- Utilisez `iroha3d` lorsque vous démarrez ou exploitez des pairs en dehors de la version publique du validateur Taira.
- Utilisez `iroha3d_taira --sora` uniquement pour un déploiement de validateur canonique Taira; il impose le profil de la chaîne, du stockage et du signataire en temps d'exécution Taira.
- Utilisez `iroha` lorsque vous avez besoin de consulter le registre, de soumettre des transactions ou d'inspecter les points finaux de l'opérateur.
- Utilisez `kagami` lorsque vous avez besoin de clés, de manifestes de génèse, de paquets de profils ou d'actifs localnet.
