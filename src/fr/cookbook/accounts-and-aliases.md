---
translation_locale: fr
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 23b3ddbdadb0d177b2b12de60e0947a94ecdb20fa6ee1b3a2c6b83e5c91ba2f3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les comptes et les aliases {#accounts-and-aliases}

## Le résultat {#outcome}

Travaillez en toute sécurité avec des canoniques sans domaine I105 compte IDs et des pseudonymes lisibles par l'homme liés séparément, tels que `treasury@payments.universal`. Vous allez inspecter Taira compte, déduire votre propre canonique ID, et résoudre les pseudonymes sans confondre le contexte de routage avec l'identité.

## Conditions préalables {#prerequisites}

- `curl`, `jq`, Python 3.11 ou ultérieur, et le courant `iroha` CLI.
- Un `taira.client.toml` de [Connectez-vous à Taira](./connect-to-taira.md) lors de l'inspection de votre propre compte.
- Un compte fourni via le robinet Taira ou la voie d'intégration régie du réseau avant de s'attendre à ce qu'une lecture spécifique au compte réussisse.

## Les étapes {#steps}

### 1. Inspecter les comptes canoniques de Taira {#_1-inspect-canonical-accounts-on-taira}

La liste des comptes publics renvoie toujours le nom canonique I105 IDs. Un pseudonyme primaire est facultatif et est déclaré séparément.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

Un ID de `.id` est valable pour les champs de compte stricts. N'y ajoutez pas un domaine. Un alias de `.primary_alias` est une clé de recherche destinée à l'utilisateur, et non une autre identité canonique.

### 2. Dériver et normaliser votre Taira I105 ID {#_2-derive-and-normalize-your-taira-i105-id}

Lisez uniquement la clé publique de la configuration locale. La même clé publique est codée différemment pour différents profils de réseau public, donc sélectionnez explicitement `taira`.

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

printf '%s\n' "$TAIRA_ACCOUNT_ID" \
  | iroha tools address normalize --profile taira
```

La valeur normalisée doit être identique à `TAIRA_ACCOUNT_ID`. Le paramètre `[account].domain` dans le fichier TOML peut être `wonderland.universal`, mais cette valeur n'affecte que le contexte de routage et d'alias.

### 3. Lisez le compte et ses actifs {#_3-read-the-account-and-its-assets}

Une fois le compte fourni, consultez-le directement et énumérez une page d'actif délimitée. URL -Codez la valeur I105 avant de l'utiliser dans un chemin.

```bash
iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

ENCODED_ACCOUNT_ID="$(
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' \
    "$TAIRA_ACCOUNT_ID"
)"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/accounts/$ENCODED_ACCOUNT_ID/assets?limit=10" \
  | jq '{total, items}'
```

### 4. Recherchez les pseudonymes liés au compte {#_4-look-up-aliases-bound-to-the-account}

Le résolveur inverse accepte un compte canonique exact ID. Les lignes du espace de données public peuvent être lues sans en-tête de signature requise; les espaces de données restreints nécessitent une demande signée autorisée.

```bash
jq -nc --arg account_id "$TAIRA_ACCOUNT_ID" \
  '{account_id: $account_id}' > alias-by-account.json

curl -fsS -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-binary @alias-by-account.json \
  https://taira.sora.org/v1/aliases/by-account \
  | tee alias-bindings.json \
  | jq '{account_id, total, items}'
```

`total: 0` est valable: un compte n'a pas besoin d'un alias. Lorsqu'il existe une liaison, résoudre son alias exact pleinement qualifié et comparer le compte retourné ID:

```bash
ALIAS_WAS_RESOLVED=false
if TAIRA_ALIAS="$(jq -er '.items[0].alias' alias-bindings.json)"; then
  jq -nc --arg alias "$TAIRA_ALIAS" \
    '{alias: $alias}' > alias-resolve.json

  curl -fsS -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    --data-binary @alias-resolve.json \
    https://taira.sora.org/v1/aliases/resolve \
    | tee alias-resolution.json \
    | jq '{alias, account_id, source}'
  ALIAS_WAS_RESOLVED=true
else
  printf '%s\n' 'No visible alias is bound to this account.'
fi
```

::: warning Limites d'autorisation

Les États membres Taira le faucet peut fournir son compte de demandeur, mais cela n'accorde pas la garantie générale l'autorité d'enregistrement du compte ou de gestion du pseudonyme. `CanRegisterAccount` Les pseudonymes de compte exigent généralement également un actif SNS le bail et les autorisations d'alias appropriées. Utilisez le planificateur d'intégration/alias réglementé, ou de répétition d'enregistrement contre le réseau local généré.

:::

Sur un réseau local, une fois qu'une étape sécurisée d'approvisionnement en signataires a exporté un nouveau canonique `NEW_ACCOUNT_ID`, la surface d'enregistrement est:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

Générer et stocker la clé privée correspondante en dehors du référentiel de documentation ou d'application.L'enregistrement d'un ID dont la clé contrôleur a été jetée crée un compte inutilisable.

## Vérifiez {#verify}

Prouver que la clé publique de configuration, le codage I105 et les alias liant convergent tous sur un seul compte canonique ID:

```bash
NORMALIZED_ACCOUNT_ID="$(
  printf '%s\n' "$TAIRA_ACCOUNT_ID" \
    | iroha tools address normalize --profile taira
)"
test "$NORMALIZED_ACCOUNT_ID" = "$TAIRA_ACCOUNT_ID"

if test "${ALIAS_WAS_RESOLVED:-false}" = true; then
  test "$(jq -r '.account_id' alias-resolution.json)" = "$TAIRA_ACCOUNT_ID"
fi
```

Conservez le compte canonique IDs. Utilisez le IDs pour les signatures, les autorisations et les instructions de transaction. Résolvez un alias à la limite de l'application. Retenez le compte canonic ID utilisé pour l'opération.

## Résolution des problèmes {#troubleshooting}

- Une erreur d'analyse ou de préfixe signifie habituellement qu'une adresse a été codée pour un profil réseau différent. `--profile taira` et rejeter les déséquilibres.
- Un compte `404` après un robinet `202` peut être un retard de propagation. Renseignez-vous sur le compte ou l'actif financé avant d'envoyer une lettre.
- `total: 0` du résolveur inversé signifie qu'aucun alias visible n'est lié; il ne s'agit pas d'une erreur de recherche de compte.
- `401` ou `403` à partir d'une route alias indique un espace de données restreint ou une autorisation de résolution exacte insuffisante.
- Une valeur lisible `name@domain.dataspace` n'est pas acceptée partout où une canonique I105 ID est requise.
- Si l'enregistrement de compte local réussit mais que Taira le rejette, la différence est l'autorisation. Obtenez `CanRegisterAccount`; ne modifiez pas le compte ID pour contourner la validation.

## Sources et documents connexes {#source-and-related-docs}

- [Implémentation de l'adresse du compte canonique dans le commit fixé](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/account/address.rs)
- [Tests de compte et d'alias Torii à l'obligation fixée](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [Comptes ](/fr/blockchain/accounts.md)
- [Nom du modèle de données](/fr/blockchain/data-model.md#aliases)
- [Conventions portant sur le nom](/fr/reference/naming.md)
- [Les jetons d'autorisation ](/fr/reference/permissions.md)
