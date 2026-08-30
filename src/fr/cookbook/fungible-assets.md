---
translation_locale: fr
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 669b5a1c12e9ab6ffb64e149148993e7b924feb29c6fa4db883a2065f58ecd7e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les actifs fonciers {#fungible-assets}

## Le résultat {#outcome}

Inspectez en direct Taira les définitions d'actifs et complétez un flux de registre, de monnaie, de transfert, de combustion et de vérification du solde sur un réseau local généré. la recette utilise une définition d'actif Base58 non préfixe canonique IDs, des aliases qualifiés pour le domaine, un compte sans domaine I105 IDs et un paiement explicite de frais.

## Conditions préalables {#prerequisites}

- `curl`, `jq`, Python 3.11 ou plus tard, Node.js 24 et le courant `iroha` CLI.
- Accès en lecture seulement Taira.
- Pour l'écriture, un réseau local généré à partir de [Launch Iroha](/fr/get-started/launch-iroha.md), avec `./localnet/client.toml` et Torii sur `http://127.0.0.1:8080`.

## Les étapes {#steps}

### 1. Inspecter les définitions Taira sans signataire {#_1-inspect-taira-definitions-without-a-signer}

Les définitions d'actifs comportent une base opaque 58 ID, le nom de l'affichage, la politique de mintabilité, l'échelle numérique, les alias optionnels, le propriétaire et la quantité totale.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] \
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity] \
    | @tsv'
```

```js [Node.js]
const response = await fetch(
  'https://taira.sora.org/v1/assets/definitions?limit=10',
  { headers: { Accept: 'application/json' } },
)
if (!response.ok) throw new Error(`Taira returned HTTP ${response.status}`)

const { items } = await response.json()
for (const definition of items) {
  console.log({
    id: definition.id,
    name: definition.name,
    mintable: definition.mintable,
    total: definition.total_quantity,
  })
}
```

:::

Exécutez le formulaire JavaScript avec `node taira-assets.mjs`. L'actif public IDs est constitué de valeurs Base58 nues; une valeur lisible telle que `cookbook_credit#wonderland.universal` est un alias qui résulte d'une de ces valeurs IDs.

### 2. Préparer l'autorité locale et la destination {#_2-prepare-the-local-authority-and-destination}

Dériver l'autorité locale à partir de la clé publique dans la configuration générée et choisir un autre compte enregistré comme le destinataire.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
SOURCE_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

DESTINATION_ACCOUNT="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg source "$SOURCE_ACCOUNT" \
      '[.items[].id | select(. != $source)][0]'
)"
```

### 3. Enregistrer une définition numérique {#_3-register-a-numeric-definition}

Ce n'est que local. ID est une adresse de définition d'actif Base58 valide et non préfichée. `domain.dataspace` la projection, l'échelle `2` permet deux chiffres fractionnels; omettre `--mint-once` conserve le défaut `Infinitely` La politique.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'
ASSET_ALIAS='cookbook_credit#wonderland.universal'

iroha --config "$LOCAL_CONFIG" \
  --machine \
  --fee-payer authority \
  ledger asset definition register \
  --id "$ASSET_DEFINITION_ID" \
  --name cookbook_credit \
  --description 'Local cookbook credit' \
  --alias "$ASSET_ALIAS" \
  --scale 2
```

Ne réutilisez pas ID sur Taira. L'enregistrement dans le réseau public nécessite un nouveau canonique ID, un domaine/alias attribué à votre demande, le financement des frais et l'autorisation d'enregistrements d'actifs de la période de validité.

### 4. La menthe, le transfert et la combustion. {#_4-mint-transfer-and-burn}

Toutes les commandes d'écriture sélectionnent explicitement l'autorité comme payeur de frais. CLI Cite la transaction précise avant de signer et attend par défaut.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 100.00

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --to "$DESTINATION_ACCOUNT" \
  --quantity 25.50

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 10.00
```

Après la combustion, attendez-vous à ce que le solde source `64.50`, le solde de destination `25.50` et la quantité totale `90.00` soient conservés.

::: warning Limites d'autorisation

Sur Taira, joindre le `taira.tx-metadata.json` dérivé du robinet et utiliser `--fee-payer authority` pour chaque écriture. L'enregistrement et la mouture nécessitent les autorisations du validateur actif; le transfert et la combustion exigent l'autorité sur le solde source. Un compte financé par robinet n'est pas automatiquement un émetteur.

:::

## Vérifiez {#verify}

Lisez les deux équilibres concrets et ensuite la définition. Ces demandes post-étatiques sont le critère de réussite; un reçu de soumission en soi ne l'est pas.

```bash
iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$DESTINATION_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

Les affirmations d'application devraient comparer les valeurs numériques en tant que décimales de point fixe, et non des valeurs binaires de point flottant, et vérifier la définition ID ainsi que le compte.

## Résolution des problèmes {#troubleshooting}

- Une ID contenant `#` est un alias ou un équilibre de béton littéral, et non une définition canonique d'actif ID. Utilisez la valeur Base58 nue avec `--definition`, ou passez un alias lié avec `--definition-alias`.
- Les erreurs `Scale` signifient qu'une quantité a plus de chiffres fractionnés que le permet la définition.
- `Mintability` refusé signifie que la politique `Once`, `Not` ou `Limited(n)` a épuisé ou interdit la couture. Ne réécrivez pas l'historique; utilisez la politique renvoyée par la requête de définition.
- L'étape 2 choisit délibérément un compte de destination enregistré.Si l'admission d'actifs est `ExplicitOnly`, prévoir le solde de destination par une autorisation Le gardien du même nom CLI n'enregistre pas de compte ou de solde; il abandonne plutôt que d'ajouter une autre instruction.
- Un rejet des frais se produit avant le succès normal de l'instruction. Sélectionnez le payeur, utilisez les métadonnées des actifs des frais du réseau et vérifiez son solde.
- Si la définition locale fixe existe déjà depuis une exécution précédente, lancez un localnet nouvellement généré ou continuez avec son état existant. Ne remplacez jamais une chaîne aléatoire malformée par la Base58 ID.

## Sources et documents connexes {#source-and-related-docs}

- [Tests d'intégration du cycle de vie des actifs à l'impôt fixé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust Exemples de construction d'actifs à l'obligation fixée](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [Les actifs ](/fr/blockchain/assets.md)
- [Instructions ](/fr/blockchain/instructions.md)
- [Les jetons d'autorisation ](/fr/reference/permissions.md)
- [JavaScript et TypeScript](/fr/guide/tutorials/javascript.md)
