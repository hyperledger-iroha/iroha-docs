---
translation_locale: fr
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

Les Rust La mise en œuvre se déroule dans l'espace de travail principal et reste la plus directe
façon de travailler avec le Iroha 3 base de code.

## Ce que vous obtenez {#what-you-get}

Le référentiel en amont expose actuellement:

- le `iroha` Rust caisse de clients
- le `iroha` CLI comme client de référence le plus complet
- modèles de données partagés, cryptographie et Norito les boîtes utilisées par le SDK couche

## Point de départ recommandé {#recommended-starting-point}

Pour l'état actuel du projet, commencez par la référence CLI et le
espace de travail lui-même:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Exécuter le client de référence avec la configuration client par défaut enregistrée:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Essayez ! Taira Lecture uniquement {#try-taira-read-only}

De la même zone de travail, essayez le public Taira assistant de diagnostic:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Pour les contrôles au niveau du parcours, utiliser Torii Je suis là . JSON API directement:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Après avoir créé `taira.client.toml`, le même binary peut exécuter canary signé
commandes contre Taira. Gardez ces tests séparés des tests unitaires ordinaires parce que
Ils nécessitent un compte financé par les robinets et la disponibilité du réseau de test en direct.

## En utilisant le Rust La caisse du client {#using-the-rust-client-crate}

- Je vous en prie . Iroha Révision Git utilisée par votre réseau:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Si vous avez besoin des exemples les plus complets de Rust les surfaces sont utilisées dans
pratique, inspection:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Pour les flux de travail sur les dépôts gérés par le registre, voir
[Réservation des actifs natifs](/fr/blockchain/escrow.md#rust-sdk). Les Rust modèle de données
a actuellement la couverture de type la plus complète pour les dépôts sur le marché, générique
les verrouillages d'actifs, les garanties anonymes, les requêtes et les événements.

Vous pouvez régénérer un local CLI une prise de vue rapide avec:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Notes {#notes}

- Les CLI Il existe actuellement une meilleure couverture que les dossiers de caisse autonome.
- Pour les flux de type opérateur, le CLI La documentation est la source la plus récente.
