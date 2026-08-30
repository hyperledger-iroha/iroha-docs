---
translation_locale: fr
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Les clés pour le déploiement du réseau {#keys-for-network-deployment}

Chaque réseau a besoin d'un matériel clé distinct pour les clients, les pairs, la signature de la génèse et, pour les profils NPoS ou Nexus, des identités de validateur BLS.

## Où les clés sont utilisées {#where-keys-are-used}

- Les clés de signature du client sont stockées à `client.toml` sous `[account]`.
- Les clés d'identification des pairs sont stockées dans chaque paire `config.toml` en tant que `public_key` et `private_key`.
- La découverte par les pairs utilise la clé publique de chaque paire dans `trusted_peers`.
- BLS validateur La preuve de possession est stockée dans `trusted_peers_pop` pour les profils de NPOS.
- La signature de la Genèse utilise le `[genesis].public_key` en configuration par les pairs et la clé privée correspondante lors de la signature du manifeste.

Pour les déploiements locaux ou de test, laissez Kagami générer tous ces fichiers ensemble:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Pour un réseau ou un profil existant, utilisez le flux guidé:

```bash
cargo run --bin kagami -- wizard
```

## Générer des paires de clés individuelles {#generate-individual-key-pairs}

Use `kagami keys` for standalone key material:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

For BLS validator material, include a Proof-of-Possession:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

Use `--seed-hex` only with an exact 32-byte hexadecimal secret for reproducible
development fixtures. For production deployment, omit it so Kagami uses
operating-system randomness, then move the unencrypted private-key export into
the approved custody boundary. The command never prints private keys.

## La cohérence entre les pairs {#peer-consistency}

Tous les validateurs doivent se mettre d'accord sur la même transaction génétique, la topologie, les clés publiques de confiance et le validateur PoPs. Une seule clé peer manquante ou mal correspondante peut empêcher le réseau de démarrer ou d'atteindre un consensus.

Pour un déploiement minimal de tolérance aux défauts byzantins, utilisez au moins quatre pairs. Chaque paire doit avoir sa propre clé privée, mais chaque configuration de paires a besoin du même ensemble de pairs fiables.

## Comptes des clients {#client-accounts}

Le compte client dans `client.toml` doit déjà exister sur la chaîne. Il peut être enregistré par le manifeste génèse ou par une transaction ultérieure. Évitez d'utiliser l'identité de signature génèse comme un compte d'application à long terme; Les privilèges de génèse ne s'appliquent qu'au cours du cycle de génèse, et les clients de production doivent utiliser leurs propres comptes et rôles.
