---
translation_locale: fr
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# La référence de la Genèse {#genesis-reference}

Dans le flux de travail Iroha 3 actuel, un manifeste `genesis.json` décrit les premières transactions et paramètres qui seront appliqués lorsque le réseau sera démarré.

L'artefact signé distribué à des pairs est un fichier `.nrt` codé Norito produit par `kagami genesis sign`.

## Principaux champs {#main-fields}

Un manifeste génétique peut définir:

- `chain` pour l'identifiant de la chaîne
- `executor` pour une voie de mise à niveau par code octal optionnelle d'exécuteur
- `ivm_dir` pour les bibliothèques IVM utilisées par des déclencheurs et des mises à niveau
- `consensus_mode` pour le mode initial annoncé par le manifeste
- `transactions` pour les mises à jour des paramètres, les instructions, les déclencheurs et la topologie
- `crypto` pour le premier instantané de cryptage

Dans `transactions`, les entrées de topologie associent des identifiants par pairs et PoPs ensemble:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Créer un manifeste {#generate-a-manifest}

Utilisez Kagami pour générer un modèle:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Pour l'espace de données public SORA Nexus, `npos` est le mode consensus attendu. D'autres déploiements Iroha 3 peuvent utiliser permis ou NPoS selon le profil cible.

## Signez le manifeste {#sign-the-manifest}

Après avoir modifié et validé le JSON, signez-le dans un bloc `.nrt` déployable:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` lit la clé publique génèse du manifeste et utilise la clé privée fournie, le grain et l'algorithme pour produire le bloc signé déployable.

## La configuration `irohad` {#configure-irohad}

Pointez le démon sur le bloc de génèse signé:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Les outils connexes {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Pour les détails de la mise en œuvre du générateur et des commandes, voir le [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md).
