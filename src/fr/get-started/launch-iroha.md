---
translation_locale: fr
translation_source: /get-started/launch-iroha.md
translation_source_hash: 63eed8f987d33a487bb6329266eacbc09d10bb429027413997957579e31e80b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Le lancement Iroha 3 {#launch-iroha-3}

Cette page passe par le flux local actuel du réseau pour Iroha 3 en utilisant les actifs d'espace de travail par défaut du référentiel en amont.

## 1. Générer un réseau local multi-pairs {#_1-generate-a-local-multi-peer-network}

Générer un localnet à quatre pairs à partir du code Kagami actuel:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Le répertoire de sortie contient des configurations partagées correspondantes, `genesis.json`, `genesis.signed.nrt`, `client.toml` et des scripts d'aide.

Pour un test de fumée locale, démarrer directement les pairs générés:

```bash
./localnet/start.sh
```

Pour une exécution en conteneur, générez Composer à partir du même répertoire localnet:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./docker-compose.yml \
  --force

docker compose -f ./docker-compose.yml up
```

La pile générée par défaut expose:

- les ports P2P à `1337` par rapport aux ports `1340`
- Les ports Torii et HTTP de `8080` à `8083`
- une configuration de client prête à l'emploi au `./localnet/client.toml`

## 2. Vérifiez que le réseau est activé {#_2-verify-that-the-network-is-up}

Vérifiez le point d'extrémité de l'état sur la première paire:

```bash
curl http://127.0.0.1:8080/status
```

Les contrôles de santé par défaut utilisent également:

```bash
curl http://127.0.0.1:8080/status/blocks
```

Vous pouvez immédiatement indiquer le CLI à la configuration du client groupé:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Le profil Nexus {#_3-nexus-profile}

Le référentiel envoie également un profil de configuration axé sur SORA Nexus sous `defaults/nexus/`.

Pour l'exécution d'une comparaison native avec le profil Nexus:

```bash
./target/release/iroha3d --sora --config ./defaults/nexus/config.toml
```

Utilisation `defaults/nexus/client.toml` pour CLI l'accès à ce profil.

## 4. Arrêtez le réseau local {#_4-stop-the-local-network}

Pour un localnet généré natif:

```bash
./localnet/stop.sh
```

Pour la pile de composition générée:

```bash
docker compose -f ./docker-compose.yml down
```

Une fois le réseau exécuté, continuez par [Operer Iroha 3 via CLI](/fr/get-started/operate-iroha-via-cli.md).
