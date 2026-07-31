---
translation_locale: fr
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Remplacement à chaud Iroha dans une Docker Container {#hot-reload-iroha-in-a-docker-container}

Utilisez la recharge à chaud uniquement pour le débogage local.
reconstruire l'image ou redémarrer la générée Docker Compose une pile de
fraîche Kagami Le paquet.

## Remplacez le binaire par pairs {#replace-the-peer-binary}

Construire un binaire de démons compatible avec Linux à partir de l'espace de travail en amont:

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

Copiez-le dans un conteneur en cours d'exécution, puis redémarrez ce conteneur:

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

Utilisation `docker ps` Pour confirmer le nom du conteneur.
les conteneurs sont définis par: `./localnet/docker-compose.yml`.

## Récupérez Genèse dans un réseau jetable {#recommit-genesis-in-a-disposable-network}

Une génèse ne se produit que lorsque son stockage est vide. Docker
réseau, arrêter la pile, supprimer l'état généré, régénérer ou remplacer le
signé génèse bundle, et recommencer:

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

Ne remplacez pas la génèse sur un réseau dont l'état doit être préservé.

## Utilisez une configuration personnalisée {#use-custom-configuration}

La configuration de pair actuelle est TOML. Mettre en place ou copier le généré
`config.toml`, `genesis.signed.nrt`, et des fichiers clés connexes dans le conteneur
les chemins attendus par l'image, puis redémarrer le pair. Gardez les fichiers générés
ensemble; mélange des fichiers de différents Kagami les courants peuvent produire une déséralisation ou
les échecs du consensus.
