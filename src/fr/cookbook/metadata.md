---
translation_locale: fr
translation_source: /cookbook/metadata.md
translation_source_hash: 07b065b28eca44939a92b40a81a47b57178de4539abb0daf51913969e34eced7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les métadonnées {#metadata}

## Le résultat {#outcome}

Lisez les métadonnées sur Taira, définissez et vérifiez la valeur des métadonnées d'un compte avec une transaction explicitement payante de frais, puis retirez à nouveau la valeur.

## Conditions préalables {#prerequisites}

- `curl`, `jq`, Python 3.11 ou ultérieur, et le courant `iroha` CLI.
- Un `taira.client.toml` et un `taira.tx-metadata.json` financés à partir de [Connectez-vous à Taira](./connect-to-taira.md).
- Autorités sur les métadonnées du compte cible. L'exemple vise l'autorité configurée elle-même; un autre compte nécessite une autorisation exacte.

## Les étapes {#steps}

### 1. Lire les métadonnées sans signataire {#_1-read-metadata-without-a-signer}

Les métadonnées sont une carte `Name` à JSON vérifiée.

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

Utilisez les métadonnées pour de petits champs descriptifs ou d'indexation. Mettez des charges utiles importantes hors du registre et stockez une référence URI ou SoraFS.

### 2. Dériver le compte cible {#_2-derive-the-target-account}

Ne lisez que la clé publique de la configuration Taira et convertissez-la en le formulaire canonique sans domaine I105.

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

Les États membres JSON Lire à partir de l'entrée standard devient le compte `cookbook_profile` En revanche, le taux d'imposition de `--metadata ./taira.tx-metadata.json` Les deux cartes ont des objectifs et des buts différents.

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

Le CLI cite la redevance, signe, soumet et attend par défaut. N'ajoutez pas `--no-wait` lorsque la prochaine opération dépend de cette valeur.

::: warning Limites d'autorisation

Le validateur actif décide qui peut muter chaque objet. La mise à jour d'un autre compte nécessite normalement `CanModifyAccountMetadata`; les domaines, les définitions d'actifs, NFTs, et les déclencheurs ont leurs propres autorisations de métadonnées spécifiques aux cibles. Si Taira n'a pas accordé l'autorité requise, exécuter les mêmes commandes de compte avec `./localnet/client.toml`, remplacer le canonique de l'autorité localnet générée I105 ID, et omettre le fichier de métadonnées des frais Taira. Conserver la sélection explicite du payeur local.

:::

### 4. Retirez la clé. {#_4-remove-the-key}

Lisez d'abord la valeur engagée, puis soumettez une transaction de retrait séparée.

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

Pour les applications Python, les constructeurs de type correspondant sont `Instruction.set_account_key_value` et `Instruction.remove_account_key_value`; soumettez-les avec les métadonnées de transaction et l'assistant d'attente du tutoriel [Python ](/fr/guide/tutorials/python.md#shared-setup).

## Vérifiez {#verify}

Après la transaction définie, `meta get` doit renvoyer l'objet avec `version: 1`. Après suppression, une recherche directe ne doit plus renvoyer une valeur:

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

La lecture du compte séparé distingue une clé de métadonnées manquante d'un défaut réseau ou d'un compte. Le code de production doit également vérifier l'ensemble de la valeur JSON après sa définition.

## Résolution des problèmes {#troubleshooting}

- L'entrée standard doit contenir une valeur JSON valide. Les chaînes doivent avoir des citations JSON; les objets et les matrices doivent être bien formés.
- Les clés de métadonnées sont des valeurs `Name` et sont sensibles au cas après l'analyse. Gardez un vocabulaire clé stable au lieu de créer des clés versionnées pour chaque changement de schéma.
- `--metadata` est des métadonnées de transaction; il ne définit pas les métadonnées d'objets du registre. `meta set` le sous-commandant de ce dernier.
- Une soumission réussie suivie d'une vieille lecture peut être un retard de propagation. Attendez la finalisation appliquée et réessayez la requête avant de la soumettre à nouveau.
- Un refus d'autorisation identifie l'objet cible et la limite de l'autorité. Répétez localement ou demandez le jeton exact; ne déplacez pas les données d'application privées dans un champ de métadonnées public pour éviter le contrôle d'accès.
- Ne conservez jamais de clés privées, d'identifiants personnels bruts, de jetons d'accès ou de grands documents dans les métadonnées.

## Sources et documents connexes {#source-and-related-docs}

- [Tests d'intégration des requêtes de métadonnées dans le commit fiché](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/queries/metadata.rs)
- [Python SDK constructeurs d'opérations à l'échéance fixée](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/python/iroha_python/README.md)
- [Metadonnées ](/fr/blockchain/metadata.md)
- [Méta-données et choix de stockage du registre ](/fr/guide/configure/metadata-and-store-assets.md)
- [Référence de l'instruction ](/fr/reference/instructions.md)
- [Les jetons d'autorisation ](/fr/reference/permissions.md)
