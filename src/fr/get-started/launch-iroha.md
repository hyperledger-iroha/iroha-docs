---
translation_locale: fr
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Lancement Iroha 3 {#launch-iroha-3}

Cette page passe par le flux actuel de réseau local Iroha 3 en utilisant les
les actifs par défaut de l'espace de travail du référentiel en amont.

## 1. Générer un réseau local multi-pairs {#_1-generate-a-local-multi-peer-network}

Générer un localnet à quatre pairs à partir du courant Kagami code:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Le répertoire de sortie contient des configurations par rapport à des pairs, `genesis.json`,
`genesis.signed.nrt`, `client.toml`, et des scénarios d'aide.

Pour un test de fumée locale, commencez directement les pairs générés:

```bash
./localnet/start.sh
```

Pour une exécution en conteneur, générez Compose à partir du même répertoire localnet:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

La pile générée par défaut expose:

- de même P2P Portes `1337` à `1340`
- Torii HTTP Portes `8080` à `8083`
- une configuration de client prête à l'emploi `./localnet/client.toml`

## 2. Vérifiez que le réseau est activé {#_2-verify-that-the-network-is-up}

Vérifiez le point final de l'état sur la première paire:

```bash
curl http://127.0.0.1:8080/status
```

Les contrôles de santé par défaut utilisent également:

```bash
curl http://127.0.0.1:8080/status/blocks
```

Vous pouvez immédiatement indiquer le CLI dans la configuration du client groupé:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus Le profil {#_3-nexus-profile}

Le référentiel envoie également un SORA Nexus- le profil de configuration orienté
`defaults/nexus/`.

Pour faire fonctionner un paire natif avec le Nexus le profil:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

Utilisation `defaults/nexus/client.toml` pour CLI accès à ce profil.

## 4. Arrêtez le réseau local {#_4-stop-the-local-network}

Pour un localnet généré natif:

```bash
./localnet/stop.sh
```

Pour la pile de composition générée:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

Après l'exécution du réseau, continuez
[Opérer Iroha 3 par le biais CLI](/fr/get-started/operate-iroha-via-cli.md).
