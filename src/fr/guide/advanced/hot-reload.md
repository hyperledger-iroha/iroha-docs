---
translation_locale: fr
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 6edc0185196ab8e77ef8552723e05bf37cca1a088da86e2a43d441d58e779c11
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
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

La configuration actuelle du pair est au format TOML. Kagami écrit un `peerN.toml` par validateur avec `genesis.signed.nrt`, `genesis.public_key` et `genesis.expected_hash` ; le fichier Compose produit par `kagami docker` les monte dans le conteneur. Régénérez-le au lieu de copier les fichiers à la main, puis redémarrez le pair. Gardez les fichiers générés ensemble : mélanger des fichiers issus de différentes exécutions de Kagami peut provoquer des échecs de désérialisation ou de consensus.
