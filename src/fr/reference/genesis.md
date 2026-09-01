---
translation_locale: fr
translation_source: /reference/genesis.md
translation_source_hash: ac6bad693ed382dede0818132b8649fe14726283508da897a32eea417e5bbb28
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# référence de la genèse de la blockchain {#genesis-reference}

Dans le flux de travail actuel Iroha 3, un manifeste technique `genesis.json` décrit les premières transactions et paramètres qui seront appliqués lorsque le réseau démarrera.

L'artefact signé distribué aux pairs du réseau est un fichier `.nrt` encodé en Norito produit par `kagami genesis sign`.

## Champs principaux {#main-fields}

Un manifeste technique de genèse de blockchain peut définir :

- `chain` pour l'identifiant de chaîne
- `executor` pour un chemin de bytecode de mise à niveau facultatif de l'exécuteur
- `ivm_dir` pour IVM bibliothèques utilisées par les déclencheurs et les mises à niveau
- `consensus_mode` pour le mode initial annoncé par le manifeste technique
- `transactions` pour les mises à jour des paramètres ordonnés, les instructions, les déclencheurs et la topologie
- `crypto` pour la vue des données crypto initiale à un instant donné

Dans `transactions`, les entrées de topologie associent les identifiants des pairs du réseau et PoPs ensemble :

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Générer un manifeste technique {#generate-a-manifest}

Utilisez Kagami pour générer un modèle :

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Pour l'espace de données public SORA Nexus, `npos` est le mode de consensus attendu. D'autres déploiements Iroha 3 peuvent utiliser permissionné ou NPoS en fonction du profil cible.

## Signer le manifeste technique {#sign-the-manifest}

Après avoir édité et validé le JSON, signez-le dans un bloc `.nrt` déployable :

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` lit la clé publique du genesis de la blockchain à partir du manifeste technique et utilise la clé privée provenant d’un fichier régulier à lien unique détenu par le propriétaire pour produire le bloc signé déployable. Le fichier doit contenir un seul multihash de clé privée canonique suivi d'un retour à la ligne ; Kagami rejette les liens symboliques et les modes autres que `0600`. Les clés privées brutes ne sont pas acceptées sur la ligne de commande. Le résultat est le fichier auquel les pairs du réseau doivent se référer depuis leur configuration.

## Configurer `iroha3d` {#configure-iroha3d}

Pointez le démon vers le bloc genesis signé de la blockchain :

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

Pour la mise en œuvre du générateur et les détails des commandes, voir le [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
