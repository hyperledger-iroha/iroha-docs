---
translation_locale: fr
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# La référence à la Genèse {#genesis-reference}

Dans le courant Iroha 3 flux de travail, une `genesis.json` le manifeste décrit la première
les transactions et paramètres qui seront appliqués au démarrage du réseau.

L'artefact signé distribué à des pairs est un Norito- codé `.nrt` fichier
produit par `kagami genesis sign`.

## Principaux champs {#main-fields}

Un manifeste génétique peut définir:

- `chain` pour l'identifiant de la chaîne
- `executor` pour un parcours de mise à niveau par code octal optionnel
- `ivm_dir` pour IVM bibliothèques utilisées par les déclencheurs et les mises à niveau
- `consensus_mode` pour le mode initial annoncé dans le manifeste
- `transactions` pour les mises à jour de paramètres, instructions, déclencheurs et topologie ordonnées
- `crypto` pour la première photo cryptographique

À l'intérieur `transactions`, Les entrées de topologie sont des identifiants par paires et PoPs ensemble:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Générer un manifeste {#generate-a-manifest}

Utilisation Kagami pour générer un modèle:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Pour le public SORA Nexus espace de données, `npos` est le mode de consensus attendu.
Autres Iroha 3 les déploiements peuvent utiliser des permis ou des NPoS selon l'objectif
le profil.

## Signez le manifeste {#sign-the-manifest}

Après avoir édité et validé le JSON, signer dans un déployable `.nrt` bloc:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` lisent la clé publique de génèse du manifeste et utilise
la clé privée fournie, le grain et l'algorithme pour produire la signature déployable
Le résultat est le fichier que les pairs devraient se référer à partir de leur configuration.

## Configuration `irohad` {#configure-irohad}

Pointez le démon sur le bloc de génèse signé:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Outils connexes {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Pour les détails de la mise en œuvre du générateur et des commandes, voir le
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md).
