---
translation_locale: fr
translation_source: /reference/binaries.md
translation_source_hash: 3d1cddb466092770376bcb150963d5df29a6ebc5cf6e670baa3a5c277082fdab
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Travailler avec les binaires Iroha {#working-with-iroha-binaries}

Le flux de travail de l'opérateur Iroha 3 tourne autour de quatre binaires principaux :

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) pour exécuter un démon de pair de réseau
- `iroha3d_taira` pour le lanceur de validateur canonique Taira
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) pour CLI et commandes de l'opérateur
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) pour les clés, la genèse de la blockchain, les réseaux locaux et les profils

## Construire à partir du code source {#build-from-source}

Depuis la racine de l’espace de travail en amont :

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Les binaires de la version sont ensuite disponibles dans `target/release/`.

Pour inspecter la surface de commande :

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## Exécuter directement depuis le dépôt {#run-directly-from-the-repository}

Si vous ne voulez rien installer globalement, utilisez `cargo run` :

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Image de conteneur Docker {#docker-image}

L'espace de travail en amont utilise `kagami localnet` et `kagami docker` pour générer des fichiers Docker Compose qui correspondent au code extrait. L'image `hyperledger/iroha:dev` peut être utilisée avec ces fichiers générés.

Exécutez le CLI dans un conteneur :

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Exécutez Kagami dans un conteneur :

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Pour le démarrage d'un pair réseau, générez d'abord un réseau local et un fichier Compose :

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## Quel binaire devrais-je utiliser ? {#which-binary-should-i-use}

- Utilisez `iroha3d` lorsque vous démarrez ou faites fonctionner des pairs de réseau en dehors de la version publique du validateur Taira.
- Utilisez `iroha3d_taira --sora` uniquement pour un déploiement de validateur canonique Taira ; il applique la chaîne, le stockage et le profil de signataire d'exécution de Taira.
- Utilisez `iroha` pour consulter le registre distribué, soumettre des transactions ou inspecter les points de terminaison opérateur de l’API.
- Utilisez `kagami` pour les clés, les manifestes de genèse, les ensembles de profils ou les actifs du réseau local.
