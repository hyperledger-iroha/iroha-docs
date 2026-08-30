---
translation_locale: fr
translation_source: /reference/genesis.md
translation_source_hash: 1312e80d9e662cc3e8cf4d0668ff4bb9e6ce3f74a60bb5287205aeeb5afd5de8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Référence Genèse {#genesis-reference}

Dans le courant Iroha 3 flux de travail, un `genesis.json` manifeste décrit le premier
transactions et paramètres qui seront appliqués au démarrage du réseau.

L'artefact signé distribué aux pairs est un Norito-codé `.nrt` déposer
produit par `kagami genesis sign`.

## Champs principaux {#main-fields}

Un manifeste de genèse peut définir :

- `chain` pour l'identifiant de la chaîne
- `executor` pour un chemin de bytecode de mise à niveau facultative de l'exécuteur
- `ivm_dir` pour IVM bibliothèques utilisées par les déclencheurs et les mises à niveau
- `consensus_mode` pour le mode initial annoncé par le manifeste
- `transactions` pour les mises à jour ordonnées des paramètres, les instructions, les déclencheurs et la topologie
- `crypto` pour l'instantané cryptographique initial

Dans `transactions`, les entrées de topologie associent les identifiants d'homologues et PoPs ensemble:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Générer un manifeste {#generate-a-manifest}

Utiliser Kagami pour générer un modèle :

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Pour le public SORA Nexus espace de données, `npos` est le mode de consensus attendu.
Autre Iroha 3 les déploiements peuvent utiliser des autorisations ou NPoS en fonction de la cible
profil.

## Signez le manifeste {#sign-the-manifest}

Après avoir édité et validé le JSON, connectez-le à un déployable `.nrt` bloc:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` lit la clé publique Genesis à partir du manifeste et utilise
la clé privée à partir d'un fichier régulier à lien unique détenu par le propriétaire pour produire le
bloc signé déployable.Le fichier doit contenir une clé privée canonique
multihash suivi d'une nouvelle ligne ; Kagami rejette les liens symboliques et les modes autres
que `0600`. Les clés privées brutes ne sont pas acceptées sur la ligne de commande.Le résultat
est le fichier que les pairs doivent référencer à partir de leur configuration.

## Configurer `iroha3d` {#configure-iroha3d}

Pointez le démon sur le bloc Genesis signé :

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Outils associés {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Pour l'implémentation du générateur et les détails des commandes, consultez le
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
