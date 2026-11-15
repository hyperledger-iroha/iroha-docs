---
translation_locale: fr
translation_source: /guide/configure/genesis.md
translation_source_hash: 2a4a43b6ac873cc0c860631e307e52b047ba6a08691bf3e4c5872cc22c81a0bd
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta+reviewed-first-release-source-amendment
---
# genèse de la blockchain {#genesis}

La genèse de la blockchain définit l'état initial de la chaîne. La source modifiable est un manifeste technique JSON, et un nœud Iroha 3 consomme un fichier de transaction signé Norito.

::: details Modèle source de genèse par défaut (defaults/genesis.template.json)

<<< @/snippets/genesis.json

:::

## Fichiers {#files}

Le dépôt amont fournit un modèle source par défaut dans `defaults/genesis.template.json`. Ce modèle est incomplet : il ne peut être validé, signé ou utilisé par un nœud tant que `kagami genesis materialize` ne l'a pas transformé en manifeste. Les réseaux générés par Kagami écrivent leur propre manifeste et leur transaction signée dans le répertoire de sortie :

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

Le `README.md` généré dans ce répertoire enregistre les fichiers exacts et les commandes de lancement pour le profil sélectionné.

## Configuration du pair réseau {#peer-configuration}

Les pairs indiquent la transaction de genèse signée dans la section `[genesis]` de `config.toml` et fixent son empreinte attendue dans un fichier distinct :

```toml
[genesis]
file = "./genesis.signed.nrt"
public_key = "ed0120..."
expected_hash_file = "./genesis.expected_hash"
```

Tous les pairs du réseau doivent s'accorder sur la transaction de genèse signée et la clé publique de genèse. Chaque démarrage, initial ou redémarrage, nécessite l'empreinte attendue : configurez exactement l'un des deux, `expected_hash_file` ou `expected_hash` en ligne. `kagami genesis sign --expected-hash-out` écrit le fichier.

## Signature de la genèse {#signing-genesis}

Si vous modifiez manuellement un manifeste, validez-le et signez-le avant de démarrer les pairs :

```bash
cargo run --bin kagami -- genesis validate ./genesis.json
cargo run --bin kagami -- genesis sign ./genesis.json \
  --private-key-file "$GENESIS_PRIVATE_KEY_FILE" \
  --out-file ./genesis.signed.nrt \
  --expected-hash-out ./genesis.expected_hash
```

`GENESIS_PRIVATE_KEY_FILE` doit être un fichier ordinaire à lien unique, appartenant à l’utilisateur et de mode `0600`, contenant un seul multihash canonique de clé privée suivi d’un saut de ligne. Kagami rejette les liens symboliques et n’accepte jamais de clé privée brute de genèse sur la ligne de commande.

Chaque genèse signée, en mode permissionné ou NPoS, doit inclure une topologie d'exactement `3f + 1` validateurs avec une preuve de possession BLS pour chaque validateur. Les commandes Kagami `localnet generate`, `wizard` et `sora-network generate` gèrent automatiquement ces détails.

## Nouvelle validation de la genèse {#recommitting-genesis}

Un nouveau réseau démarre à partir de sa genèse signée. Pour tester une autre genèse dans un réseau local jetable, arrêtez les pairs, supprimez leur répertoire d’état généré et redémarrez avec la nouvelle genèse signée. Un réseau en fonctionnement ne doit jamais remplacer sa genèse pour effectuer une mise à niveau. Les modifications des définitions du protocole exigent des transitions de sélection régies par la gouvernance et une qualification couvrant les définitions et obligations sélectionnées.
