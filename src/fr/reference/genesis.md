---
translation_locale: fr
translation_source: /reference/genesis.md
translation_source_hash: dda17468f39573a1fcf43474351bd01c4fea38e8b603fd4d8b21780b273c8649
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# référence de la genèse de la blockchain {#genesis-reference}

Dans le flux de travail actuel Iroha 3, un manifeste technique `genesis.json` décrit les premières transactions et paramètres qui seront appliqués lorsque le réseau démarrera.

L'artefact signé distribué aux pairs du réseau est un fichier `.nrt` encodé en Norito produit par `kagami genesis sign`.

## Champs principaux {#main-fields}

Un manifeste technique de genèse de blockchain peut définir :

- `chain` pour l'identifiant de chaîne
- `chain_discriminant` pour le préfixe réseau I105 utilisé pour encoder les littéraux de compte dans le manifeste
- `executor` pour un chemin de bytecode de mise à niveau facultatif de l'exécuteur
- `ivm_dir` pour IVM bibliothèques utilisées par les déclencheurs et les mises à niveau
- `consensus_mode` pour le mode initial annoncé par le manifeste technique
- `wire_protocol_version` pour la version du protocole de transmission du consensus de la première version
- `consensus_fingerprint` pour l'empreinte typée facultative des paramètres de consensus, que les manifestes JSON indiquent explicitement
- `transactions` pour les mises à jour des paramètres ordonnés, les instructions, les déclencheurs et la topologie
- `sumeragi_context` pour les paramètres signés du contexte de hauteur de Sumeragi
- `crypto_admission_policy` pour les algorithmes exacts de signature et de contrôleur admis par la chaîne, énumérés dans `allowed_algorithms`

Dans `transactions`, les entrées de topologie associent les identifiants des pairs du réseau et PoPs ensemble :

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Générer un manifeste technique {#generate-a-manifest}

Utilisez Kagami pour générer un modèle. Répétez `--allowed-signing` pour chaque algorithme admis, dans l'ordre canonique croissant ; Kagami n'ajoute pas les algorithmes omis :

```bash
cargo run -p iroha_kagami -- genesis generate \
  --chain-id <CHAIN_ID> \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 \
  --allowed-signing bls_normal > genesis.json
```

Pour l'espace de données public SORA Nexus, `npos` est le mode de consensus attendu. Les autres déploiements Iroha 3 peuvent utiliser le mode permissionné ou NPoS selon le profil cible.

## Signer le manifeste technique {#sign-the-manifest}

Après avoir édité et validé le JSON, signez-le dans un bloc `.nrt` déployable :

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt \
  --expected-hash-out genesis.expected_hash
```

`kagami genesis sign` dérive la paire de clés de la genèse à partir de la clé privée contenue dans un fichier régulier à lien unique détenu par le propriétaire pour produire le bloc signé déployable. Passez `--expected-public-key` pour exiger qu'elle corresponde à la clé publique de genèse publiée. Le fichier doit contenir un seul multihash de clé privée canonique suivi d'un retour à la ligne ; Kagami rejette les liens symboliques et les modes autres que `0600`. Les clés privées brutes ne sont pas acceptées sur la ligne de commande. Le résultat est le fichier auquel les pairs du réseau doivent se référer depuis leur configuration.

## Configurer `iroha3d` {#configure-iroha3d}

Indiquez au démon le bloc de genèse signé et le fichier fixant son empreinte attendue. `kagami genesis sign --expected-hash-out` écrit ce fichier, que le nœud exige au premier démarrage comme aux redémarrages :

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
expected_hash_file = "genesis.expected_hash"
```

## Outils connexes {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet generate`
- `cargo xtask kagami-profiles`

Pour la mise en œuvre du générateur et les détails des commandes, voir le [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami/README.md).
