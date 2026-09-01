---
translation_locale: fr
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Rechargement à chaud Iroha dans un conteneur Docker {#hot-reload-iroha-in-a-docker-container}

Utilisez le rechargement à chaud uniquement pour le débogage local. Pour le développement local normal, préférez reconstruire l'image ou redémarrer la pile générée Docker Compose à partir d'un nouveau bundle Kagami.

## Remplacer le pair réseau binaire {#replace-the-peer-binary}

Construisez un binaire démon compatible Linux à partir de l’espace de travail en amont :

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

Copiez-le dans un conteneur pair de réseau en cours d'exécution, puis redémarrez ce conteneur :

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

Utilisez `docker ps` pour confirmer le nom du conteneur. Dans la pile générée, les conteneurs pair du réseau sont définis par `./docker-compose.yml`.

## Recommencer la genèse de la blockchain dans un réseau jetable {#recommit-genesis-in-a-disposable-network}

Un pair de réseau ne valide le bloc de genèse de la blockchain que lorsque son stockage est vide. Pour un réseau Docker jetable, arrêtez la pile, supprimez l'état généré, régénérez ou remplacez le paquet de genèse de la blockchain signé, puis redémarrez :

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

Ne remplacez pas le genesis de la blockchain sur un réseau dont l'état doit être préservé.

## Utiliser une configuration personnalisée {#use-custom-configuration}

La configuration actuelle du pair est au format TOML. Montez ou copiez les fichiers générés `config.toml`, `genesis.signed.nrt` et les fichiers de clés associés aux emplacements du conteneur attendus par l’image, puis redémarrez le pair. Gardez les fichiers générés ensemble : mélanger des fichiers issus de différentes exécutions de Kagami peut provoquer des échecs de désérialisation ou de consensus.
