---
translation_locale: fr
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Génération de clés cryptographiques {#generating-cryptographic-keys}

Utilisez `kagami keys` pour générer du matériel clé client, de pair et de validateur pour Iroha 3.

## Utilisation de base {#basic-usage}

À partir du Iroha de la source:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

La sortie JSON est généralement la plus facile à copier en TOML ou à automatiser:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

Le commandement imprime une clé publique et une clé privée. Traiter la clé privée comme un matériau secret; ne pas engager les clés de production générées.

## Algorithmes {#algorithms}

Les algorithmes communs sont les suivants:

- `ed25519` pour les comptes clients, les identités de diffusion et la plupart des réseaux de développement.
- `secp256k1` lorsque vous avez besoin d'une identité de compte secp256k1.
- `bls_normal` pour les clés de consensus du validateur lorsque la configuration permet l'assistance BLS.

Vérifiez les algorithmes exacts pris en charge par votre construction avec:

```bash
cargo run --bin kagami -- keys --help
```

## Les clés du développement déterministe {#deterministic-development-keys}

Pour les appareils reproductibles, passez une graine:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

Les graines sont de la clé privée. Utilisez-les uniquement pour le développement local et les tests.

## BLS Les preuves de possession {#bls-proofs-of-possession}

Les profils de validateurs NPoS et Nexus exigent les clés de validateur BLS et PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

Le JSON inclut le `pop_hex` lorsqu'il est utilisé le `--pop`. Utilisez cette valeur avec la topologie générée ou les entrées du profil requises par le `trusted_peers_pop`.

## Formats de sortie {#output-formats}

Utilisez la sortie par défaut pour l'inspection du terminal, `--json` pour l'automatisation et `--compact` lorsqu'un autre script a besoin de valeurs orientées vers des lignes simples:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

Pour l'aide générée intégralement Kagami:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
