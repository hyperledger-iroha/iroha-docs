---
translation_locale: fr
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Génération de clés cryptographiques {#generating-cryptographic-keys}

Utilisation `kagami keys` pour générer du matériel clé client, de pair et de validateur pour
Iroha 3.

## Utilisation de base {#basic-usage}

Le rapport Iroha paiement à la source:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON la sortie est généralement plus facile à copier en TOML ou l'automatisation:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

Le commandement imprime une clé publique et une clé privée.
la clé comme matériau secret; ne sous-traitez pas les clés de production générées.

## Algorithmes {#algorithms}

Les algorithmes communs sont les suivants:

- `ed25519` pour les comptes clients, identités de streaming et la plupart du développement
  les réseaux.
- `secp256k1` lorsque vous avez besoin d'une identité de compte SECP256K1.
- `bls_normal` pour les clés de consensus du validateur lorsque la construction permet BLS Le soutien.

Vérifiez les algorithmes exacts pris en charge par votre construction avec:

```bash
cargo run --bin kagami -- keys --help
```

## Les clés du développement déterministe {#deterministic-development-keys}

Pour les appareils reproductibles, passez une semence:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

Les graines sont un matériau privé, utilisez-les uniquement pour le développement et les tests locaux.

## BLS Les preuves de possession {#bls-proofs-of-possession}

NPOS et Nexus les profils de validateur sont nécessaires BLS clés de validation et PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

Les JSON inclut `pop_hex` lorsque `--pop` Utilisez cette valeur avec le
la topologie générée ou `trusted_peers_pop` les entrées requises par le profil.

## Formats de sortie {#output-formats}

Utiliser la sortie par défaut pour l'inspection du terminal, `--json` pour l'automatisation, et
`--compact` lorsque d'autres scripts ont besoin de valeurs simples orientées vers des lignes:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

Pour les produits entièrement générés Kagami aide:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
