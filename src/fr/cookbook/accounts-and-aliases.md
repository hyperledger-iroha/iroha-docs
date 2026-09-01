---
translation_locale: fr
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 6d36784afef0ef10113cabc995ddfb45fd8d382d7c32c553d77cf03ba5c1f65f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Comptes et alias {#accounts-and-aliases}

## Résultat {#outcome}

Travaillez en toute sécurité avec des identifiants de compte canoniques sans domaine I105 et des alias lisibles par l'homme liés séparément tels que `treasury@payments.universal`. Vous examinerez les comptes Taira, deriverez votre propre identifiant canonique et résoudrez les alias sans confondre le contexte de routage avec l'identité.

## Prérequis {#prerequisites}

- `curl`, `jq`, Python 3.11 ou ultérieur, et le `iroha` CLI actuel.
- Un `taira.client.toml` de [Connectez-vous à Taira](./connect-to-taira.md) lors de l'inspection de votre propre compte.
- Un compte fourni via le service de financement du testnet Taira ou le parcours d'intégration gouverné du réseau avant de s'attendre à ce qu'une lecture spécifique au compte réussisse.

## Étapes {#steps}

### 1. Inspecter les comptes canoniques sur Taira {#_1-inspect-canonical-accounts-on-taira}

La liste des comptes publics renvoie toujours des identifiants canoniques I105. Un alias principal est facultatif et est signalé séparément.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

Un identifiant de `.id` est valide pour les champs de compte stricts. N'y ajoutez pas de domaine. Un alias de `.primary_alias` est une clé de recherche visible par l'utilisateur, pas une autre identité canonique.

### 2. Dérivez et normalisez votre ID Taira I105 {#_2-derive-and-normalize-your-taira-i105-id}

Lire uniquement la clé publique à partir de la configuration locale. La même clé publique est codée différemment pour différents profils de réseau public, donc sélectionnez `taira` explicitement.

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

La valeur normalisée devrait être identique à `TAIRA_ACCOUNT_ID`. Le paramètre `[account].domain` dans le fichier TOML peut être `wonderland.universal`, mais cette valeur affecte uniquement le routage et le contexte des alias.

### 3. Lisez le compte et ses actifs {#_3-read-the-account-and-its-assets}

Une fois que le compte est provisionné, interrogez-le directement et listez une page d'actifs bornée. URL-encoder la valeur I105 avant de l'utiliser dans un chemin.

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

### 4. Rechercher les alias liés au compte {#_4-look-up-aliases-bound-to-the-account}

Le résolveur inverse accepte un identifiant de compte canonique exact. Les lignes d'un espace de données public peuvent être lues sans en-têtes de signature de requête ; les espaces de données restreints nécessitent une requête signée autorisée.

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

`total: 0` est valide : un compte n'a pas besoin d'un alias. Lorsqu'un lien existe, résolvez son alias entièrement qualifié exact et comparez l'ID de compte retourné :

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

::: warning Limite d'autorisation

Le service de financement du testnet Taira peut approvisionner son compte de demandeur, mais cela ne confère pas le droit général d’inscription de compte ou de gestion des alias. L’enregistrement d’un autre compte nécessite `CanRegisterAccount` sous le validateur actif. Les alias de compte nécessitent normalement également un bail SNS actif et les autorisations d'alias appropriées. Utilisez le planificateur d'intégration/alias réglementé, ou exercez-vous à l'enregistrement sur le réseau local généré.

:::

Sur un réseau local, une fois qu'une étape de provisionnement de signataire sécurisé a exporté un nouveau `NEW_ACCOUNT_ID` canonique, la surface d'enregistrement est :

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

Générez et stockez la clé privée correspondante en dehors de la documentation ou du dépôt de l'application. L'enregistrement d'un ID dont la clé de contrôle a été supprimée crée un compte inutilisable.

## Vérifier {#verify}

Prouvez que la clé publique de configuration, le codage I105 et la liaison d'alias convergent tous vers un identifiant de compte canonique :

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

Stockez les identifiants de compte canoniques. Utilisez les identifiants canoniques pour les signatures, les autorisations et les instructions de transaction. Résolvez un alias à la frontière de l'application. Conservez l'identifiant de compte canonique utilisé pour l'opération.

## Dépannage {#troubleshooting}

- Une erreur d'analyse ou de préfixe signifie généralement qu'une adresse a été encodée pour un profil réseau différent. Normalisez avec `--profile taira` et rejetez les incompatibilités.
- Un compte `404` après un service de financement de testnet `202` peut subir un délai de propagation. Vérifiez le compte ou l'actif financé avant d'envoyer une écriture.
- `total: 0` du résolveur inverse signifie qu'aucun alias visible n'est lié ; ce n'est pas un échec de recherche de compte.
- `401` ou `403` provenant d'un chemin d'alias indique un espace de données restreint ou une permission de résolution exacte insuffisante. Ne pas utiliser une recherche de préfixe large comme solution de repli.
- Une valeur `name@domain.dataspace` lisible n'est pas acceptée partout où un ID canonique I105 est requis. Résolvez-le d'abord.
- Si l'enregistrement du compte local réussit mais que Taira le rejette, la différence réside dans l'autorisation. Obtenez `CanRegisterAccount` ; ne changez pas l'ID du compte pour contourner la validation.

## Source et documents connexes {#source-and-related-docs}

- [Implémentation de l'adresse de compte canonique au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)
- [Tests de compte et d'alias Torii sur le commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [Comptes](/fr/blockchain/accounts.md)
- [Alias de modèle de données](/fr/blockchain/data-model.md#aliases)
- [Conventions de nommage](/fr/reference/naming.md)
- [Jetons d'autorisation](/fr/reference/permissions.md)
