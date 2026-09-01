---
translation_locale: fr
translation_source: /cookbook/metadata.md
translation_source_hash: bb486994faabb29fb48609a886862e44e565148be4800ec1244218ef37e2e54b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Métadonnées {#metadata}

## Résultat {#outcome}

Lisez les métadonnées sur Taira, définissez et vérifiez une valeur de métadonnée de compte avec une transaction payant explicitement des frais, puis supprimez à nouveau la valeur. Vous devez garder les métadonnées des objets du grand livre séparées des métadonnées des frais de transaction.

## Prérequis {#prerequisites}

- `curl`, `jq`, Python 3.11 ou ultérieur, et le `iroha` CLI actuel.
- Un financé `taira.client.toml` et `taira.tx-metadata.json` de [Connectez-vous à Taira](./connect-to-taira.md).
- principal d'autorisation sur les métadonnées du compte cible. L'exemple cible le principal d'autorisation configuré lui-même ; un autre compte nécessite une autorisation précise.

## Étapes {#steps}

### 1. Lire les métadonnées sans un signataire cryptographique {#_1-read-metadata-without-a-signer}

Les métadonnées sont une carte vérifiée de `Name` à JSON. Les cartes vides et les sorties filtrées vides sont des résultats valides.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

Utilisez les métadonnées pour de petits champs descriptifs ou d'indexation. Mettez les charges utiles volumineuses hors registre et stockez une valeur de résumé cryptographique, URI, ou une référence SoraFS à la place.

### 2. Dériver le compte cible {#_2-derive-the-target-account}

Lisez uniquement la clé publique à partir de la configuration Taira et convertissez-la en la forme canonique sans domaine I105.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
```

### 3. Définir une valeur JSON {#_3-set-one-json-value}

Le JSON lu depuis l'entrée standard devient la valeur `cookbook_profile` du compte. En revanche, `--metadata ./taira.tx-metadata.json` ajoute des champs de frais au conteneur de données de la transaction. Les deux cartes ont des objectifs et des finalités différents.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

Le CLI cite les frais, signe, soumet et attend par défaut. N'ajoutez pas `--no-wait` lorsque l'opération suivante dépend de cette valeur.

::: warning Limite d'autorisation

Le validateur actif décide qui peut modifier chaque objet. La mise à jour d'un autre compte nécessite normalement `CanModifyAccountMetadata` ; les domaines, les définitions d'actifs, NFTs et les déclencheurs ont leurs propres autorisations de métadonnées spécifiques à la cible. Si Taira n'a pas accordé le principal d'autorisation requis, exécutez les mêmes commandes de compte avec `./localnet/client.toml`, substituez l'ID canonique I105 du principal d'autorisation local généré, et omettez le fichier de métadonnées des frais Taira. Conservez la sélection explicite du payeur de frais local.

:::

### 4. Retirez la clé {#_4-remove-the-key}

Lisez d'abord la valeur engagée, puis soumettez une transaction de suppression distincte.

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

Pour les applications Python, les constructeurs tapés correspondants sont `Instruction.set_account_key_value` et `Instruction.remove_account_key_value` ; soumettez-les avec les métadonnées de transaction et l'assistant d'attente du [Python tutoriel](/fr/guide/tutorials/python.md#shared-setup).

## Vérifier {#verify}

Après la transaction définie, `meta get` doit retourner l'objet avec `version: 1`. Après suppression, une recherche directe ne doit plus renvoyer de valeur :

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

Le compte séparé lu distingue une clé de métadonnées manquante d’une défaillance du réseau ou du compte. Le code de production doit également vérifier la valeur entière JSON après l’avoir définie.

## Dépannage {#troubleshooting}

- L'entrée standard doit contenir une valeur JSON valide. Les chaînes doivent avoir des guillemets JSON ; les objets et les tableaux doivent être bien formés.
- Les clés de métadonnées sont des valeurs `Name` et sont sensibles à la casse après analyse. Maintenez un vocabulaire de clés stable au lieu de créer des clés versionnées pour chaque modification de schéma.
- `--metadata` est des métadonnées de transaction ; il ne définit pas les métadonnées de l’objet du grand livre. Utilisez la sous-commande `meta set` de l’entité pour cela.
- Une soumission réussie suivie d'une lecture ancienne peut être un retard de propagation. Attendez la finalité appliquée et réessayez la requête avant de soumettre à nouveau.
- Un refus d'autorisation identifie l'objet cible et la frontière du principal d'autorisation. Répétez localement ou demandez le jeton exact ; ne déplacez pas les données d'application privées dans un champ de métadonnées public pour éviter le contrôle d'accès.
- Ne stockez jamais de clés privées, d'identifiants personnels bruts, de jetons d'accès ou de documents volumineux dans les métadonnées.

## Source et documents connexes {#source-and-related-docs}

- [Tests d'intégration de requêtes de métadonnées sur le commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs)
- [Python SDK constructeurs de transactions au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [Métadonnées](/fr/blockchain/metadata.md)
- [Choix de stockage des métadonnées et du registre blockchain](/fr/guide/configure/metadata-and-store-assets.md)
- [Référence d'instruction](/fr/reference/instructions.md)
- [Jetons d'autorisation](/fr/reference/permissions.md)
