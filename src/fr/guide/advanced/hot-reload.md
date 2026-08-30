---
translation_locale: fr
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rechargement à chaud Iroha dans un récipient Docker {#hot-reload-iroha-in-a-docker-container}

Utilisez le chargement à chaud uniquement pour le débogage local. Pour un développement local normal, préférez reconstruire l'image ou redémarrer la pile Docker Compose générée à partir d'un paquet Kagami frais.

## Remplacez le binaire des pairs {#replace-the-peer-binary}

Construire un binaire de daemon compatible avec Linux à partir de l'espace de travail en amont:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

Copier dans un conteneur en cours d'exécution, puis redémarrer ce conteneur:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

Utilisez `docker ps` pour confirmer le nom du conteneur. Dans la pile générée, les conteneurs de pair sont définis par `./docker-compose.yml`.

## Retournez Genèse dans un réseau jetable {#recommit-genesis-in-a-disposable-network}

Un homologue ne commet la génèse que lorsque son stockage est vide. Pour un réseau jetable Docker, arrêtez la pile, retirez l'état généré, régénérez ou remplacez le paquet de génèse signé. et recommencer à nouveau:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

Ne remplacez pas la génésie sur un réseau dont l'état doit être préservé.

## Utilisez une configuration personnalisée {#use-custom-configuration}

La configuration de pair actuelle est TOML. Lier ou copier les fichiers clés générés `config.toml`, `genesis.signed.nrt` et connexes dans les chemins du conteneur attendus par l'image, puis redémarrer le pair. Gardez les fichiers générés ensemble; le mélange de fichiers provenant d'expériences différentes Kagami peut entraîner une déséralisation ou des échecs de consensus.
