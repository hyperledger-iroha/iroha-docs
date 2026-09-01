---
translation_locale: fr
translation_source: /guide/tutorials/rust.md
translation_source_hash: 98b0c3a193c6dfe8b266bcc498d7016426cf2f838a7bf7ebfbef145ffdcc7944
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Rust {#rust}

L'implémentation Rust se trouve dans l'espace de travail principal et reste le moyen le plus direct de travailler avec la base de code Iroha 3.

## Ce que vous obtenez {#what-you-get}

Le dépôt en amont expose actuellement :

- le package logiciel client `iroha` Rust
- le `iroha` CLI en tant que client de référence le plus complet
- modèle de données partagé, crypto, et packages logiciels Norito utilisés par la couche SDK

## Point de départ recommandé {#recommended-starting-point}

Pour l'état actuel du projet, commencez par la référence CLI et l'espace de travail lui-même :

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Exécutez le client de référence avec la configuration client par défaut enregistrée :

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Essayer Taira Lecture seule {#try-taira-read-only}

Depuis le même espace de travail, essayez l'assistant de diagnostic public Taira :

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Pour les vérifications au niveau de l'itinéraire, utilisez directement le JSON API de Torii :

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Après avoir créé `taira.client.toml`, le même binaire peut exécuter des commandes canari signées contre Taira. Gardez-les séparés des tests unitaires ordinaires car ils nécessitent un compte financé sur le testnet et la disponibilité du testnet en direct.

## Utilisation du logiciel Client Rust {#using-the-rust-client-crate}

Épingler la révision Git Iroha utilisée par votre réseau :

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Si vous avez besoin des exemples les plus complets sur la façon dont les surfaces Rust sont utilisées en pratique, inspectez :

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Pour les flux de travail d'entiercement gérés par grand livre, voir [Compte séquestre d'actifs natifs](/fr/blockchain/escrow.md#rust-sdk). Le modèle de données Rust possède actuellement la couverture typée la plus complète pour l'entiercement de marché, les verrous d'actifs génériques, l'entiercement anonyme, les requêtes et les événements.

Vous pouvez régénérer une vue de données locale CLI à un instant donné avec :

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Notes {#notes}

- Le CLI offre actuellement une meilleure couverture que les documents du logiciel autonome.
- Pour les flux de type opérateur, la documentation CLI est la source la plus récente.
