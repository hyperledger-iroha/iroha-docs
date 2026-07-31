---
translation_locale: fr
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 17ffd2979e2ff7a0e0c3f5c9f1457a5eb630713bba40fca0246afc0c2f7fd5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les clés du déploiement des réseaux {#keys-for-network-deployment}

Chaque réseau a besoin d'un matériel clé distinct pour les clients, les pairs, la signature de génèse,
et, pour les NPOS ou Nexus les profils, BLS les identités des validateurs.

## Où les clés sont utilisées {#where-keys-are-used}

- Les clés de signature du client sont stockées dans `client.toml` sous `[account]`.
- Les clés d'identité des pairs sont stockées dans chaque paire `config.toml` comme `public_key` et
  `private_key`.
- La découverte par les pairs utilise la clé publique de chaque paire dans `trusted_peers`.
- BLS validateur Les preuves de possession sont stockées dans `trusted_peers_pop` pour les NPOS
  les profils.
- La signature de la Genèse utilise le `[genesis].public_key` dans le config et les
  correspondant à la clé privée lors de la signature du manifeste.

Pour les déploiements locaux ou d'essai, laissez Kagami générer tous ces fichiers ensemble:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Pour un réseau ou un profil existant, utilisez le flux guidé:

```bash
cargo run --bin kagami -- wizard --profile nexus
```

## Générer des paires de clés individuelles {#generate-individual-key-pairs}

Utilisation `kagami keys` pour le matériau clé autonome:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

Pour BLS matériel de validation, comprenant une preuve de possession:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

Utilisation `--seed` uniquement pour les appareils de développement reproductibles.
le déploiement, la génération de nouvelles clés et le stockage des clés privées en dehors du référentiel.

## La cohérence entre les pairs {#peer-consistency}

Tous les validateurs doivent être d'accord sur la même transaction génétique, topologie, confiance
les clés publiques et le validateur PoPs. Une seule clé de pair manquante ou mal correspondante peut
empêcher le démarrage du réseau ou l'obtention d'un consensus.

Pour un déploiement minimal de tolérance à la faute byzantine, utilisez au moins quatre pairs.
La clé privée doit être la même, mais chaque configuration a besoin de la même.
un groupe de pairs de confiance.

## Comptes des clients {#client-accounts}

Le compte du client dans `client.toml` Il doit déjà exister en chaîne.
Les données de l'établissement doivent être enregistrées dans le manuel génésique ou dans une transaction ultérieure.
génèse signer l'identité en tant que compte d'application à long terme; privilèges de génèse
Il est recommandé de ne pas utiliser les produits utilisés dans le cadre d'une opération de génésification.
les comptes et les rôles.
