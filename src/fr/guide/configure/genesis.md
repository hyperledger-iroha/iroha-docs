---
translation_locale: fr
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Genèse {#genesis}

Génèse définit l'état de la chaîne initiale. JSON le manifeste,
et une Iroha 3 le nœud consomme une signature Norito fichier de transaction.

::: details Manifeste de génèse par défaut

<<< @/snippets/genesis.json

:::

## Fichiers {#files}

Le référentiel en amont envoie un manifeste par défaut à `defaults/genesis.json`.
Kagami- les réseaux générés écrivent leur propre transaction manifeste et signée dans
le répertoire de sortie:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Les produits générés `README.md` Dans ce répertoire, il enregistre les fichiers exacts et lance
commandes pour le profil sélectionné.

## La configuration par les pairs {#peer-configuration}

Les pairs soulignent la transaction de génèse signée dans le `[genesis]` la section de
`config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Tous les pairs du réseau doivent se mettre d'accord sur la transaction de génèse signée et
clé publique de la Genèse.

## La signature de la Genèse {#signing-genesis}

Si vous modifiez manuellement un manifeste, validez-le et signez-le avant de commencer à travailler avec des pairs:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

Pour les NPOS ou Nexus les profils, y compris la topologie et BLS Les preuves de possession
requis par le profil généré. Kagami `localnet`, `wizard`, et profil
Les commandes de génération gèrent ces détails automatiquement.

## Retour à la Genèse {#recommitting-genesis}

Une génèse ne se produit que lorsque son stockage est vide.
un localnet jetable, arrêter les pairs, supprimer leur répertoire d'état généré,
et commencer par la nouvelle génèse signée. Ne remplacez pas la génèse sur une course
réseau à moins que chaque validateur coordonne la même migration.
