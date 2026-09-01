---
translation_locale: fr
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Exécution de Iroha sur du matériel nu {#running-iroha-on-bare-metal}

Utilisez ce flux de travail lorsque vous souhaitez exécuter des pairs réseau directement sur les hôtes plutôt que via Docker Compose. L'arborescence source actuelle fournit des générateurs Kagami qui écrivent la genèse de blockchain correspondante, les configurations des pairs réseau, la configuration du client et les scripts de démarrage/arrêt.

## 1. Construire les binaires {#_1-build-the-binaries}

Depuis l’espace de travail en amont Iroha :

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Ceci produit :

- `target/release/iroha3d` pour le démon pair du réseau
- `target/release/iroha` pour le CLI
- `target/release/kagami` pour clé, genèse de la blockchain et génération de réseau local

## 2. Générer un réseau local {#_2-generate-a-local-network}

Générez un localnet à quatre pairs Iroha 3 :

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

Le répertoire de sortie contient les fichiers générés `genesis.json`, `genesis.signed.nrt`, réseau pair `config.toml`, `client.toml`, les scripts d'aide, et un `README.md` généré avec les commandes exactes pour ce lot.

## 3. Démarrer les pairs réseau {#_3-start-peers}

Pour un réseau local jetable généré, utilisez le script généré :

```bash
./localnet/start.sh
```

Si vous devez connecter chaque pair réseau à un gestionnaire de processus tel que systemd, utilisez la commande de lancement enregistrée dans `./localnet/README.md` pour chaque pair réseau. Gardez séparés le `config.toml`, la clé privée, le répertoire de stockage et les ports de chaque pair réseau.

## 4. Exploiter le réseau {#_4-operate-the-network}

Utilisez la configuration client générée :

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Arrêtez le réseau local généré avec :

```bash
./localnet/stop.sh
```

## 5. Notes de production {#_5-production-notes}

- Générez de nouvelles clés privées pour la production et stockez-les en dehors du dépôt.
- Faites convenir tous les pairs de la même transaction de genèse signée, de la topologie, des pairs de confiance et des PoPs des validateurs.
- Liez les adresses des écouteurs aux interfaces locales de l'hôte uniquement lorsque le pair réseau ne doit pas être accessible depuis d'autres machines.
- Utilisez un proxy inverse ou un pare-feu pour l'exposition de Torii, l'authentification de base, TLS et la limitation du débit.
- Traitez les changements de genèse ou de topologie de consensus comme des migrations coordonnées, non comme l’édition d’un fichier par un seul pair.

Pour le développement local conteneurisé, utilisez le flux de travail [Lancer Iroha 3](../../get-started/launch-iroha.md) Docker Compose.
