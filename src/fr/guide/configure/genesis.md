---
translation_locale: fr
translation_source: /guide/configure/genesis.md
translation_source_hash: a6b8b2b02e0074e6c90d9aa9337af3e2496a02beb2f57f575dc0780014df04b2
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# genèse de la blockchain {#genesis}

La genèse de la blockchain définit l'état initial de la chaîne. La source modifiable est un manifeste technique JSON, et un nœud Iroha 3 consomme un fichier de transaction signé Norito.

::: details Manifeste technique génésique de la blockchain par défaut

<<< @/snippets/genesis.json

:::

## Fichiers {#files}

Le dépôt en amont fournit un manifeste technique par défaut à `defaults/genesis.json`. Les réseaux générés par Kagami écrivent leur propre manifeste technique et leur transaction signée dans le répertoire de sortie :

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Le `README.md` généré dans ce répertoire enregistre les fichiers exacts et les commandes de lancement pour le profil sélectionné.

## Configuration du pair réseau {#peer-configuration}

Les pairs pointent vers la transaction de genèse signée dans la section `[genesis]` de `config.toml` :

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
```

Tous les pairs du réseau doivent utiliser la même transaction de genèse signée et la même clé publique de genèse.

## Signature de la genèse {#signing-genesis}

Si vous modifiez manuellement un manifeste, validez-le et signez-le avant de démarrer les pairs :

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt
```

`GENESIS_PRIVATE_KEY_FILE` doit être un fichier ordinaire à lien unique, appartenant à l’utilisateur et de mode `0600`, contenant un seul multihash canonique de clé privée suivi d’un saut de ligne. Kagami rejette les liens symboliques et n’accepte jamais de clé privée brute de genèse sur la ligne de commande.

Pour les profils NPoS ou Nexus, incluez la topologie et les preuves de possession BLS requises par le profil généré. Kagami `localnet`, `wizard` et les commandes de génération de profil gèrent ces détails automatiquement.

## Nouvelle validation de la genèse {#recommitting-genesis}

Un pair ne valide la genèse que lorsque son stockage est vide. Pour tester une nouvelle genèse dans un réseau local jetable, arrêtez les pairs, supprimez leur répertoire d’état généré et redémarrez avec la nouvelle genèse signée. Ne remplacez pas la genèse d’un réseau actif, sauf si tous les validateurs coordonnent la même migration.
