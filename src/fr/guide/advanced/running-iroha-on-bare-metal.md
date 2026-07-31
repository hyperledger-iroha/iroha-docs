---
translation_locale: fr
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 77780600fa59ba353e2aa79fb339adb6a02f7ac731e04cd0d5f51821ec54e794
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Randonnée Iroha sur le métal nu {#running-iroha-on-bare-metal}

Utilisez ce flux de travail lorsque vous voulez exécuter des pairs directement sur les hôtes au lieu
à travers Docker Compose. L'arbre source actuel fournit Kagami générateurs qui
écrire la génèse correspondante, les configurations de pairs, la configuration du client et les scripts de démarrage/arrêt.

## 1. Construire les binaires {#_1-build-the-binaries}

De l'au-dessus Iroha espace de travail:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Cela produit:

- `target/release/irohad` pour le daimon de la paire
- `target/release/iroha` pour le CLI
- `target/release/kagami` pour la génération de clés, de genèse et de réseaux locaux

## 2. Créer un réseau local {#_2-generate-a-local-network}

Générer un four-peer Iroha 3 réseau local:

```bash
target/release/kagami localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Le répertoire de sortie contient le généré `genesis.json`,
`genesis.signed.nrt`, de même `config.toml` les dossiers, `client.toml`, les scripts auxiliaires,
et un généré `README.md` avec des commandes exactes pour ce paquet.

## 3. Commencez par des pairs {#_3-start-peers}

Pour un localnet jetable généré, utilisez le script généré:

```bash
./localnet/start.sh
```

Si vous avez besoin de brancher chaque paire dans un gestionnaire de processus tel que systemd, utiliser le
commandement de lancement enregistré en `./localnet/README.md` Pour chaque paire.
de l'équipe `config.toml`, clé privée, répertoire de stockage et ports séparés.

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

- Générer de nouvelles clés privées pour la production et les stocker en dehors du
  référentiel.
- Faites en sorte que tous les pairs soient d'accord sur la même transaction de génèse signée, topologie,
  des pairs de confiance et un validateur PoPs.
- Lier les adresses de l'auditeur aux interfaces hôte-locales uniquement lorsque le pair devrait
  n'est pas accessible par d'autres machines.
- Utilisez un proxy inverse ou un pare-feu pour Torii exposition, auth de base, TLS, et taux
  Il est limité.
- Traiter les changements de génèse ou de topologie consensuelle comme des migrations coordonnées, non
  les modifications de fichiers uniques.

Pour le développement local en conteneurs, utilisez les [Lancement Iroha 3](../../get-started/launch-iroha.md)
Docker Compose le flux de travail.
