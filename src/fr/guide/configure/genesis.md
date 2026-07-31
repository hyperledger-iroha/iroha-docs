---
translation_locale: fr
translation_source: /guide/configure/genesis.md
translation_source_hash: d3c04386c8d6e2778e53477e8f717a04247a66714cfed2c25ca84fbfb3871813
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Genèse {#genesis}

Genesis définit l'état de la chaîne initiale. La source éditable est un manifeste JSON, et un nœud Iroha 3 consomme un fichier de transaction Norito signé.

::: details Manifeste de génèse par défaut

<<< @/snippets/genesis.json

:::

## Fichiers {#files}

Le référentiel en amont envoie un manifeste par défaut à `defaults/genesis.json`. Les réseaux générés par Kagami écrivent leur propre manifeste et une transaction signée dans le répertoire de sortie:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Le `README.md` généré dans ce répertoire enregistre les fichiers exacts et les commandes de lancement pour le profil sélectionné.

## La configuration par les pairs {#peer-configuration}

Les pairs soulignent l'opération de génèse signée dans la section `[genesis]` du `config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Tous les pairs du réseau doivent se mettre d'accord sur la transaction de génèse signée et sur la clé publique de la génèse.

## La signature de la Genèse {#signing-genesis}

Si vous modifiez un manifeste manuellement, validez-le et signez-le avant de commencer à travailler avec des pairs:

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key "$GENESIS_PRIVATE_KEY_HEX" \
  --algorithm ed25519 \
  --out-file ./genesis.signed.nrt
```

Pour les NPOS ou Nexus les profils, y compris la topologie et BLS Les preuves de possession requises par le profil généré. Kagami `localnet`, `wizard`, et les commandes de génération de profil gèrent ces détails automatiquement.

## Le rétablissement de la Genèse {#recommitting-genesis}

Pour tester une nouvelle génèse dans un localnet jetable, arrêter les pairs, supprimer leur répertoire d'état généré et commencer à partir de la nouvelle génèse signée. Ne remplacez pas la génèse sur un réseau en cours d'exécution à moins que chaque validateur coordonne la même migration.
