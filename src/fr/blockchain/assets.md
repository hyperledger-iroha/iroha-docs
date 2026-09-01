---
translation_locale: fr
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Actifs {#assets}

Un actif Iroha est un solde numérique détenu par un compte. Chaque solde concret pointe vers un `AssetDefinition`, et la définition décrit comment cet actif peut être nommé, émis, affiché et réparti.

## Définition de l'actif {#asset-definition}

Un `AssetDefinition` contient :

- `id` : l'adresse de définition d'actif canonique
- `name` : un nom d'affichage lisible par un humain
- `description` : description lisible par l'humain facultative
- `alias` : alias optionnel sous la forme `<name>#<domain>.<dataspace>` ou `<name>#<dataspace>`
- `spec` : précision numérique et contraintes pour les soldes
- `mintable` : la politique d'émission d'actifs
- `logo` : facultatif `SoraFS` URI
- `metadata` : métadonnées clé-valeur arbitraires
- `balance_scope_policy` : si les soldes sont globaux ou limités à l'espace de données
- `owned_by` : le compte qui a enregistré ou possède la définition
- `total_quantity` : quantité totale émise
- `confidential_policy` : politique pour les opérations sur les actifs protégés

Les identifiants de définition d'actif sont des adresses opaques canoniques. Lorsqu'une définition est construite à partir d'un domaine et d'un nom, Iroha peut conserver cette projection domaine/nom pour UX et les requêtes, mais la forme textuelle canonique est l'adresse générée.

## Solde des actifs {#asset-balance}

Un `Asset` contient :

- `id` : un `AssetId`, qui combine la définition de l'actif, le compte du détenteur et l'éventuel périmètre du solde de l'actif
- `value` : un solde `Numeric`

Le compte détenteur est canonique et sans domaine. La définition de l'actif peut être projetée sous un domaine qualifié par espace de données, par exemple `payments.universal`.

## Politique d'émission d'actifs {#mintability}

Les définitions d'actifs prennent en charge ces modes de politique d'émission d'actifs :

|Mode|Sens|
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` |Offre élastique. L'actif peut être émis et détruit de manière répétée.|
| `Once`       |Jeton à offre fixe. Il peut être émis une seule fois puis brûlé.|
| `Not`        |Jeton à offre fixe qui peut être brûlé mais pas réémis.|
| `Limited(n)` |La politique permet l'émission de nouvelles unités d'actifs dans un nombre limité d'opérations supplémentaires.|

Utilisez `Infinitely` pour les actifs élastiques normaux et `Once` ou `Limited(n)` pour les actifs à offre fixe ou à offre limitée. N'utilisez pas `Not` comme politique initiale à moins que l'offre de l'actif ne soit déjà établie.

## Portée du solde des actifs {#balance-scope}

Le `balance_scope_policy` contrôle la façon dont les soldes sont répartis :

- `Global` : une partition de solde par compte et définition d'actif
- `DataspaceRestricted` : les soldes sont répartis par contexte d'espace de données

Les soldes restreints à un espace de données sont utiles lorsque la même définition d'actif est utilisée dans plusieurs espaces de données Nexus, mais que les soldes doivent rester isolés.

## Essayez-le sur Taira {#try-it-on-taira}

Ces appels en lecture seule montrent les définitions des actifs réels sur le testnet public Taira :

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Trouvez la définition actuelle de l'actif de frais Taira XOR :

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

Recherchez des définitions qui contiennent des métadonnées :

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

Les trois exemples sont des lectures. Pour émettre, brûler ou transférer des actifs sur Taira, utilisez un compte financé par le réseau de test et le flux sécurisé dans [Connecter aux espaces de données SORA Nexus](/fr/get-started/sora-nexus-dataspaces.md).

Pour voir un actif Taira servant à payer les frais, enregistrez l’outil de [Obtention de XOR de test sur Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) sous `taira_faucet_claim.py`, demandez d’abord des fonds au distributeur et utilisez l’actif reçu pour payer le gas de la transaction :

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

Puis incluez `--metadata ./taira.tx-metadata.json` dans les commandes `ledger asset mint`, `ledger asset burn` et `ledger asset transfer`.

## Instructions {#instructions}

Les actifs peuvent être enregistrés, émis, brûlés et transférés avec les opérations d'instruction Iroha :

- [`Register` et `Unregister`](/fr/blockchain/instructions.md#un-register)
- [`Mint` et `Burn`](/fr/blockchain/instructions.md#mint-burn)
- [`Transfer`](/fr/blockchain/instructions.md#transfer)
- [`SetKeyValue` et `RemoveKeyValue`](/fr/blockchain/instructions.md#setkeyvalue-removekeyvalue)

Voir aussi :

- [Guide de la CLI](/fr/get-started/operate-iroha-via-cli.md)
- [Rust tutoriel](/fr/guide/tutorials/rust.md)
- [Python tutoriel](/fr/guide/tutorials/python.md)
- [JavaScript/TypeScript tutoriel](/fr/guide/tutorials/javascript.md)
- [Modèle de données](/fr/blockchain/data-model.md)
- [NFTs](/fr/blockchain/nfts.md)
