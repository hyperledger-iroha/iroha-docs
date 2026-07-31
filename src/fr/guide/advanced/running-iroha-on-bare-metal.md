---
translation_locale: fr
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 77780600fa59ba353e2aa79fb339adb6a02f7ac731e04cd0d5f51821ec54e794
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# En cours d'exécution Iroha sur métal nu {#running-iroha-on-bare-metal}

Utilisez ce flux de travail lorsque vous voulez exécuter des pairs directement sur les hôtes au lieu de via Docker Compose. L'arbre source actuel fournit Kagami générateurs qui écrivent des génétises correspondantes, configures de pairs, configure du client et scripts de démarrage / arrêt.

## 1. Construire les binaires {#_1-build-the-binaries}

Dans l'espace de travail Iroha en amont:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Ce qui produit:

- `target/release/irohad` pour le daimon par rapport à l'autre
- `target/release/iroha` pour le CLI
- `target/release/kagami` pour la génération de clés, d'origine et de réseaux locaux

## 2. Générer un réseau local {#_2-generate-a-local-network}

Générer un localnet Iroha 3 à quatre pairs:

```bash
target/release/kagami localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Le répertoire de sortie contient les fichiers générés `genesis.json`, `genesis.signed.nrt`, peer `config.toml`, `client.toml`, scripts d'aide et un `README.md` généré avec des commandes exactes pour ce paquet.

## 3. Commencez par des pairs {#_3-start-peers}

Pour un localnet jetable généré, utilisez le script généré:

```bash
./localnet/start.sh
```

Si vous devez brancher chaque pair dans un gestionnaire de processus tel que systemd, utilisez la commande de lancement enregistrée en `./localnet/README.md` pour chaque pair. Gardez séparément le `config.toml`, la clé privée, le répertoire de stockage et les ports de chaque pair.

## 4. Opérer le réseau {#_4-operate-the-network}

Utilisez la configuration du client générée:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Arrêtez le localnet généré avec:

```bash
./localnet/stop.sh
```

## 5. Notes de production {#_5-production-notes}

- Générer de nouvelles clés privées pour la production et les stocker à l'extérieur du dépôt.
- Faites en sorte que tous les pairs soient d'accord sur la même transaction de génèse signée, la topologie, les pairs de confiance et le validateur PoPs.
- Bind l'auditeur s'adresse aux interfaces locales de l'hôte uniquement lorsque le pair ne doit pas être accessible depuis d'autres machines.
- Utilisez un proxy inverse ou un pare-feu pour l'exposition Torii, l'auth de base, TLS et la limitation du taux.
- Traiter les changements apportés à la génèse ou à la topologie du consensus comme des migrations coordonnées, et non comme des modifications de fichiers uniques.

Pour le développement local en container, utilisez le flux de travail [Launch Iroha 3](../../get-started/launch-iroha.md) Docker Compose.
