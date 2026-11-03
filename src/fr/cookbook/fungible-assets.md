---
translation_locale: fr
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 3287a6bbaf06ec92ebbe9ac33a8294d4e1d232bc01fd6a5da13ddd166c620965
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Actifs fongibles {#fungible-assets}

## Résultat {#outcome}

Inspectez les définitions d'actifs en direct de Taira et réalisez un flux d'émission, de transfert, de destruction et de vérification du solde sur un réseau local généré. La procédure utilise des identifiants de définition d'actif Base58 canoniques sans préfixe, des identifiants de compte I105 sans domaine et le paiement explicite des frais.

## Prérequis {#prerequisites}

- `curl`, `jq`, Python 3.11 ou plus récent, Node.js 24, et les CLIs `iroha` et `kagami` actuels.
- Accès en lecture seule Taira.
- Pour le parcours d'écriture, un réseau local créé avec `kagami localnet generate --peers 4 --out-dir ./localnet` comme dans [Lancer Iroha](/fr/get-started/launch-iroha.md), en ajoutant `--asset-definition-id 66owaQmAQMuHxPzxUN3bqZ6FJfDa`. Il fournit `./localnet/client.toml` et Torii sur `http://127.0.0.1:8080`.

## Étapes {#steps}

### 1. Inspecter les définitions Taira sans un signataire cryptographique {#_1-inspect-taira-definitions-without-a-signer}

Les définitions d'actifs comportent un identifiant Base58 opaque, un nom d'affichage, une politique d'émission d'actifs, une échelle numérique, un alias facultatif, un propriétaire, un domaine ou espace de données propriétaire facultatif, une politique de solde et une quantité totale. Le solde concret inclut également son compte titulaire et une portée d'espace de données facultative.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[]
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity]
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

Exécutez le formulaire JavaScript avec `node taira-assets.mjs`. Les identifiants d'actifs publics sont de simples valeurs Base58 ; une valeur lisible telle que `cookbook_credit#wonderland.universal` est un alias qui se résout en l'un de ces identifiants.

### 2. Préparer le principal d'autorisation local et la destination {#_2-prepare-the-local-authority-and-destination}

Dérivez le principal d'autorisation local à partir de la clé publique dans la configuration générée, puis créez une paire de clés pour un nouveau compte destinataire et enregistrez-le. Aucune clé privée n'est imprimée.

```bash
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

kagami keys --out-dir ./cookbook-recipient
DESTINATION_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert \
    "$(cat ./cookbook-recipient/public.key)"
)"
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  account register --id "$DESTINATION_ACCOUNT"
```

### 3. Utiliser une définition numérique détenue par le client {#_3-use-a-client-owned-numeric-definition}

En dehors de la genèse, une définition est enregistrée sous un `--domain` propriétaire que possède le signataire, et le client d'un réseau local généré n'en possède aucun. Le réseau local généré avec `--asset-definition-id` contient déjà cette définition : la genèse l'a enregistrée avec une échelle non contrainte, a fait du client son propriétaire et a émis 1 000 000 000 unités au profit du client.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

Ne réutilisez pas cet ID sur Taira. L’enregistrement sur le réseau public nécessite un nouvel ID canonique, un domaine propriétaire que possède votre compte (transmis à `ledger asset definition register` via `--domain`), un octroi de `CanManageAssetDefinitionAlias` pour tout alias, et le financement des frais.

### 4. émettre, transférer et brûler {#_4-mint-transfer-and-burn}

Toutes les commandes d'écriture sélectionnent explicitement le principal d'autorisation comme payeur de frais. Le CLI cite la transaction exacte avant de signer et attend par défaut.

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

Après la combustion, attendez-vous à un solde source `1000000064.50`, un solde de destination `25.50` et une quantité totale `1000000090.00`.

::: warning Limite d'autorisation

Sur Taira, utilisez `--fee-payer authority` pour chaque écriture ; le CLI établit le devis exact des frais, dans l'actif de frais de Taira, avant de signer. L'enregistrement nécessite de posséder le `--domain` de la définition, et un alias nécessite aussi `CanManageAssetDefinitionAlias`. L'émission nécessite de posséder la définition ou de détenir `CanMintAssetWithDefinition` ou `CanMintAssetToAccount` ; le transfert et la destruction nécessitent l'autorité sur le solde source. Un compte financé par le service de financement du testnet n'est pas automatiquement un émetteur.

:::

## Vérifier {#verify}

Lisez à la fois les bilans concrets puis la définition. Ces requêtes d'état postérieur sont le critère de réussite ; un enregistrement de résultat de protocole de soumission à lui seul ne l'est pas.

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

Les assertions de l'application doivent comparer les valeurs numériques en tant que décimales à virgule fixe, et non en tant que valeurs à virgule flottante binaire, et doivent vérifier l'identifiant de définition ainsi que le compte.

## Dépannage {#troubleshooting}

- Un ID contenant `#` est un alias ou un littéral de solde concret, pas un ID de définition d'actif canonique. Utilisez la valeur Base58 nue avec `--definition`, ou transmettez un alias lié avec `--definition-alias`.
- Les erreurs `Scale` signifient qu'une quantité a plus de chiffres fractionnaires que ce que la définition permet.
- `Mintability` rejet signifie que la politique `Once`, `Not` ou `Limited(n)` a été épuisée ou refusée. Ne réécrivez pas l'historique ; utilisez la politique renvoyée par la requête de définition.
- L'étape 2 enregistre explicitement le compte de destination, de sorte que le transfert fonctionne aussi lorsque l'admission des comptes est `ExplicitOnly`. Le garde-fou CLI au nom similaire n'enregistre ni compte ni solde ; il interrompt l'opération au lieu d'ajouter une autre instruction.
- Un rejet de frais se produit avant le succès normal de l'instruction. Sélectionnez le payeur, contrôlez l'actif de frais et le maximum dans le devis de frais du CLI, et vérifiez ce solde.
- Une nouvelle exécution sur le même réseau local repart des soldes précédents, et `kagami keys` refuse un `./cookbook-recipient` existant. Lancez un nouveau réseau local généré et supprimez ce répertoire, ou comparez les variations de solde plutôt que les valeurs absolues. Ne remplacez jamais un ID Base58 par une chaîne aléatoire mal formée.

## Source et documents connexes {#source-and-related-docs}

- [Tests d'intégration du cycle de vie des actifs au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/asset.rs)
- [Rust exemples de construction d'actifs à la validation épinglée](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/examples/tutorial.rs)
- [Actifs](/fr/blockchain/assets.md)
- [Instructions](/fr/blockchain/instructions.md)
- [Jetons d'autorisation](/fr/reference/permissions.md)
- [JavaScript et TypeScript](/fr/guide/tutorials/javascript.md)
