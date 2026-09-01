---
translation_locale: fr
translation_source: /get-started/launch-iroha.md
translation_source_hash: 63eed8f987d33a487bb6329266eacbc09d10bb429027413997957579e31e80b4
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Lancer Iroha 3 {#launch-iroha-3}

Cette page explique le flux actuel du réseau local pour Iroha 3 en utilisant les ressources de l’espace de travail par défaut du dépôt en amont.

## 1. Générer un réseau multi-pairs local {#_1-generate-a-local-multi-peer-network}

Générez un réseau local à quatre pairs à partir du code Kagami actuel :

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Le répertoire de sortie contient les configurations de pairs réseau correspondantes, `genesis.json`, `genesis.signed.nrt`, `client.toml`, et des scripts d'assistance.

Pour un test rapide local natif, lancez directement les pairs du réseau générés :

```bash
./localnet/start.sh
```

Pour une exécution conteneurisée, générez Compose à partir du même répertoire localnet :

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./docker-compose.yml \
  --force

docker compose -f ./docker-compose.yml up
```

La pile générée par défaut expose :

- pair réseau P2P ports `1337` à `1340`
- Torii HTTP ports `8080` à `8083`
- une configuration client prête à l'emploi à `./localnet/client.toml`

## 2. Vérifiez que le réseau est opérationnel {#_2-verify-that-the-network-is-up}

Vérifiez le statut de l'endpoint API sur le premier pair réseau :

```bash
curl http://127.0.0.1:8080/status
```

Les contrôles de santé par défaut utilisent également :

```bash
curl http://127.0.0.1:8080/status/blocks
```

Vous pouvez immédiatement pointer le CLI vers la configuration client fournie :

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus Profil {#_3-nexus-profile}

Le dépôt fournit également un profil de configuration orienté SORA Nexus sous `defaults/nexus/`.

Pour exécuter un nœud réseau natif avec le profil Nexus :

```bash
./target/release/iroha3d --sora --config ./defaults/nexus/config.toml
```

Utilisez `defaults/nexus/client.toml` pour un accès CLI à ce profil.

## 4. Arrêter le réseau local {#_4-stop-the-local-network}

Pour un réseau local généré nativement :

```bash
./localnet/stop.sh
```

Pour la pile Compose générée :

```bash
docker compose -f ./docker-compose.yml down
```

Après que le réseau fonctionne, continuez avec [Faire fonctionner Iroha 3 via CLI](/fr/get-started/operate-iroha-via-cli.md).
