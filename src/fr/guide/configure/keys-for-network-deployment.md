---
translation_locale: fr
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Clés pour le déploiement du réseau {#keys-for-network-deployment}

Chaque réseau a besoin de matériel clé distinct pour les clients, les pairs du réseau, la signature de la genèse de la blockchain et, pour les profils NPoS ou Nexus, les identités des validateurs BLS.

## Où les clés sont utilisées {#where-keys-are-used}

- Les clés de signature des clients sont stockées dans `client.toml` sous `[account]`.
- Les clés d'identité des pairs du réseau sont stockées dans chaque pair du réseau `config.toml` en tant que `public_key` et `private_key`.
- La découverte des pairs réseau utilise la clé publique de chaque pair réseau dans `trusted_peers`.
- BLS les preuves de possession des validateurs sont stockées dans `trusted_peers_pop` pour les profils NPoS.
- La signature de la genèse utilise le `[genesis].public_key` de la configuration du pair et la clé privée correspondante pour signer le manifeste.

Pour les déploiements locaux ou de test, laissez Kagami générer tous ces fichiers ensemble :

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Pour un réseau ou un profil existant, utilisez le flux guidé :

```bash
cargo run --bin kagami -- wizard
```

## Générer des paires de clés individuelles {#generate-individual-key-pairs}

Utilisez `kagami keys` pour le matériel clé autonome :

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

Pour le matériel de validateur BLS, incluez une preuve de possession :

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

Utilisez `--seed-hex` uniquement avec un secret hexadécimal exact de 32 octets pour des cas de test de développement reproductibles. Pour le déploiement en production, omettez-le afin que Kagami utilise l'aléa du système d'exploitation, puis déplacez l'exportation de clé privée non chiffrée dans la limite de garde approuvée. La commande n'affiche jamais les clés privées.

## Cohérence des pairs du réseau {#peer-consistency}

Tous les validateurs doivent s'accorder sur la même transaction de genèse de la blockchain, la topologie, les clés publiques des pairs du réseau de confiance et le validateur PoPs. Une seule clé de pair du réseau manquante ou non correspondante peut empêcher le réseau de démarrer ou d'atteindre un consensus.

Pour un déploiement tolérant aux fautes byzantines minimal, utilisez au moins quatre pairs réseau. Chaque pair réseau doit avoir sa propre clé privée, mais chaque configuration de pair réseau nécessite le même ensemble de pairs réseau de confiance.

## Comptes clients {#client-accounts}

Le compte client dans `client.toml` doit déjà exister sur la chaîne. Il peut être enregistré par le manifeste technique de la genèse de la blockchain ou par une transaction ultérieure. Évitez d'utiliser l'identité de signature de la genèse de la blockchain comme compte d'application à long terme ; les privilèges de la genèse de la blockchain ne s'appliquent que pendant le tour de genèse de la blockchain, et les clients en production devraient utiliser leurs propres comptes et rôles.
