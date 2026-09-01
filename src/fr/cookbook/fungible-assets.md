---
translation_locale: fr
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 29f2bdb390fc93b97f8ed9108634f70e21ba747c8606fb84093d37e9586516c1
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Actifs fongibles {#fungible-assets}

## Résultat {#outcome}

Inspecter les définitions d'actifs en direct Taira et compléter un registre, émettre, transférer, brûler et vérifier le solde sur un réseau local généré. La procédure utilise des identifiants de définition d'actif Base58 canoniques sans préfixe, des alias qualifiés par domaine, des identifiants de compte I105 sans domaine, et paiement explicite des frais.

## Prérequis {#prerequisites}

- `curl`, `jq`, Python 3.11 ou plus récent, Node.js 24, et le/la `iroha` CLI actuel(le).
- Accès en lecture seule Taira.
- Pour le walkthrough d'écriture, un réseau local généré à partir de [Lancer Iroha](/fr/get-started/launch-iroha.md), avec `./localnet/client.toml` et Torii sur `http://127.0.0.1:8080`.

## Étapes {#steps}

### 1. Inspecter les définitions Taira sans un signataire cryptographique {#_1-inspect-taira-definitions-without-a-signer}

Les définitions d'actifs comportent un identifiant Base58 opaque, un nom d'affichage, une politique d'émission d'actifs, une échelle numérique, un alias facultatif, un propriétaire et une quantité totale. Le solde concret inclut également son compte titulaire et une portée de dataspace optionnelle.

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

Exécutez le formulaire JavaScript avec `node taira-assets.mjs`. Les identifiants d'actifs publics sont de simples valeurs Base58 ; une valeur lisible telle que `cookbook_credit#wonderland.universal` est un alias qui se résout en l'un de ces identifiants.

### 2. Préparer le principal d'autorisation local et la destination {#_2-prepare-the-local-authority-and-destination}

Dérivez le principal d'autorisation local à partir de la clé publique dans la configuration générée et choisissez un autre compte enregistré comme destinataire. Aucune clé privée n'est imprimée.

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

Cet ID local uniquement est une adresse de définition d'actif Base58 valide sans préfixe. L'alias fournit la projection lisible par l'homme `domain.dataspace`. L'échelle `2` permet deux chiffres fractionnaires ; omettre `--mint-once` conserve la politique par défaut `Infinitely`.

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

Ne réutilisez pas cet ID sur Taira. L’enregistrement sur le réseau public nécessite un nouvel ID canonique, un domaine ou alias attribué à votre application, le financement des frais et l’autorisation d’enregistrer des actifs dans l’environnement d’exécution.

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

Après la combustion, attendez-vous à un solde source `64.50`, un solde de destination `25.50` et une quantité totale `90.00`.

::: warning Limite d'autorisation

Sur Taira, attachez le `taira.tx-metadata.json` dérivé du robinet et utilisez `--fee-payer authority` pour chaque écriture. L'enregistrement et l'émission nécessitent les autorisations du validateur actif ; le transfert et la destruction nécessitent le principal d'autorisation sur le solde source. Un compte financé par le testnet n'est pas automatiquement un émetteur.

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
- L'étape 2 choisit délibérément un compte de destination enregistré. Si l'admission d'actifs est `ExplicitOnly`, approvisionnez le solde de destination via un autorisé écouler avant de transférer. Le gardien au nom similaire CLI n'enregistre pas de compte ni de solde ; il interrompt au lieu d'ajouter une autre instruction.
- Un rejet de frais se produit avant le succès normal de l'instruction. Sélectionnez le payeur, utilisez les métadonnées de l'actif de frais du réseau et vérifiez son solde.
- Si la définition locale fixe existe déjà à partir d'une exécution précédente, lancez un nouveau localnet généré ou continuez avec son état existant. Ne remplacez jamais un ID Base58 par une chaîne aléatoire mal formée.

## Source et documents connexes {#source-and-related-docs}

- [Tests d'intégration du cycle de vie des actifs au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust exemples de construction d'actifs à la validation épinglée](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [Actifs](/fr/blockchain/assets.md)
- [Instructions](/fr/blockchain/instructions.md)
- [Jetons d'autorisation](/fr/reference/permissions.md)
- [JavaScript et TypeScript](/fr/guide/tutorials/javascript.md)
