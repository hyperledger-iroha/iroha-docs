---
translation_locale: fr
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: google-translate
---

# Genèse {#genesis}

Genesis définit l'état initial de la chaîne.La source modifiable est un JSON manifeste,
et un Iroha 3 le nœud consomme un signé Norito fichier de transactions.

::: details Manifeste de genèse par défaut

<<< @/snippets/genesis.json

:::

## Fichiers {#files}

Le référentiel en amont expédie un manifeste par défaut à `defaults/genesis.json`.
Kagami-les réseaux générés écrivent leur propre manifeste et leur transaction signée dans
le répertoire de sortie :

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Le généré `README.md` dans ce répertoire enregistre les fichiers exacts et lance
commandes pour le profil sélectionné.

## Configuration homologue {#peer-configuration}

Les pairs soulignent la transaction Genesis signée dans le `[genesis]` section de
`config.toml`:

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Tous les pairs du réseau doivent être d'accord sur la transaction Genesis signée et sur le
clé publique de genèse.

## Signature de Genèse {#signing-genesis}

Si vous modifiez un manifeste manuellement, validez-le et signez-le avant de démarrer les pairs :

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` doit être un mode détenu par le propriétaire-`0600`, lien unique
fichier normal contenant un multihash canonique de clé privée et un final
nouvelle ligne. Kagami rejette les liens symboliques et n'accepte jamais une genèse brute et privée
clé sur la ligne de commande.

Pour NPoS ou Nexus profils, incluent la topologie et BLS Preuves de possession
requis par le profil généré. Kagami `localnet`, `wizard`, et profil
les commandes de génération gèrent ces détails automatiquement.

## Réengager Genesis {#recommitting-genesis}

Un homologue n'engage la genèse que lorsque son stockage est vide.Pour tester une nouvelle genèse dans
un localnet jetable, arrêter les pairs, supprimer leur répertoire d'état généré,
et repartir de la nouvelle genèse signée.Ne remplacez pas Genesis sur un
réseau à moins que chaque validateur coordonne la même migration.
