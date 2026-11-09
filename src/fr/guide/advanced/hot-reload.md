---
translation_locale: fr
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 8cdae05a133736fe528bf9d7e709af5c704e85e5f7dee09e0aa762f3214efd2d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Rechargement à chaud Iroha dans un conteneur Docker {#hot-reload-iroha-in-a-docker-container}

Réservez le rechargement à chaud au débogage local. Suivez le guide [Lancer Iroha 3](/fr/get-started/launch-iroha.md) pour compiler et lancer quatre validateurs dans Docker avec des binaires issus de la même révision.

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

Utilisez `docker ps` pour repérer le conteneur. Vérifiez le chemin du démon dans votre image avant de le remplacer.

## Recommencer la genèse de la blockchain dans un réseau jetable {#recommit-genesis-in-a-disposable-network}

Un nouveau bloc de genèse nécessite un espace de stockage vide sur chaque pair. Utilisez `python3 poc.py down` et `python3 poc.py up` pour redémarrer le même réseau. Conservez `state/` avec ses quatre volumes Docker.

## Utiliser une configuration personnalisée {#use-custom-configuration}

La configuration actuelle du pair est au format TOML. Montez ou copiez les fichiers générés `config.toml`, `genesis.signed.nrt` et les fichiers de clés associés aux emplacements du conteneur attendus par l’image, puis redémarrez le pair. Gardez les fichiers générés ensemble : mélanger des fichiers issus de différentes exécutions de Kagami peut provoquer des échecs de désérialisation ou de consensus.
