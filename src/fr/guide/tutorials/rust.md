---
translation_locale: fr
translation_source: /guide/tutorials/rust.md
translation_source_hash: 98b0c3a193c6dfe8b266bcc498d7016426cf2f838a7bf7ebfbef145ffdcc7944
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

L'implémentation Rust se trouve dans l'espace de travail principal et reste le moyen le plus direct de travailler avec la base de code Iroha 3.

## Ce que vous obtenez {#what-you-get}

Le référentiel en amont expose actuellement:

- la caisse du client `iroha` Rust
- Le `iroha` CLI en tant que client de référence le plus complet
- Modèle de données partagé, crypto et boîtes Norito utilisées par la couche SDK

## Point de départ recommandé {#recommended-starting-point}

Pour l'état actuel du projet, commencez par la référence CLI et l'espace de travail lui-même:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Exécutez le client de référence avec la configuration par défaut du client enregistrée:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Essayez Taira En lisant seulement {#try-taira-read-only}

Dans le même espace de travail, essayez l'aide publique Taira aux diagnostics:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Pour les contrôles au niveau de l'itinéraire, utilisez directement JSON de Torii API:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Après avoir créé `taira.client.toml`, le même binaire peut exécuter des commandes canaries signées contre Taira. Gardez ces commandes séparées des tests unitaires ordinaires car elles nécessitent un compte financé par les robinets et une disponibilité en direct du testnet.

## Utilisation de la caisse du client Rust {#using-the-rust-client-crate}

Fixer la révision de Git Iroha utilisée par votre réseau:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Si vous avez besoin des exemples les plus complets de la manière dont les surfaces Rust sont utilisées en pratique, consultez:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Pour les flux de travail d'escrow gérés par le registre, voir [Native Asset Escrow](/fr/blockchain/escrow.md#rust-sdk). Le modèle de données Rust a actuellement la couverture typique la plus complète pour l'escrow du marché, les verrouillages génériques des actifs, l'escroquerie anonyme, les requêtes et les événements.

Vous pouvez régénérer un instantané d'aide local CLI en utilisant:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Notes {#notes}

- Le CLI fournit actuellement une meilleure couverture que les dossiers de caisse autonomes.
- En ce qui concerne les flux de type opérateur, la documentation CLI est la source la plus courante.
