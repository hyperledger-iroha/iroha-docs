---
translation_locale: fr
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Transactions {#transactions}

Une transaction est une demande signée pour exécuter un travail sur la blockchain. La charge utile exécutable peut être une séquence ordonnée d'instructions [ ](./instructions.md), un appel contractuel, le code octal IVM ou une exécution prouvée IVM . Voir [contrats intelligents](./smart-contracts.md) pour le modèle actuel d'exécution des contrats.

Les transactions effectuent des travaux de changement d'état ou exécutables. L'inspection en lecture seule utilise des requêtes signées ou des terminaux de lecture publics et ne crée pas une transaction.

Une transaction admise dans un bloc engagé est stockée avec son résultat d'exécution, y compris le rejet de l'exécution. Les demandes rejetées avant l'admission du bloc, comme une enveloppe invalide ou une transaction refusée par la file d'attente, ne sont pas stockées dans un bloc.

Pour les mouvements d'actifs qui préservent la vie privée, voir [Transactions anonymes](./anonymous-transactions.md).Les transactions anonymes utilisent des notes d'actif protégées, des engagements, des annulateurs et des preuves de connaissance zéro au lieu des changements de solde compte à compte public.

Pour les preuves de preuve sur des effets d'exécution transparents sélectionnés, voir [FastPQ](./fastpq.md). FastPQ consomme des témoins d'exécutions après l'exécution normale de la transaction et construit des lots de preuve déterministes pour les transitions d'état prises en charge.

## Essayez le sur Taira {#try-it-on-taira}

Utilisez les itinéraires explorateurs pour inspecter les blocs publics récents Taira et les statuts des transactions sans compte de signature:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Pour suivre une transaction que votre application a envoyée plus tôt, copier le `hash` de la liste et inspecter l'itinéraire détaillé de l'explorateur:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Pour soumettre une transaction, il est nécessaire d'avoir signé un enveloppe Norito, une chaîne correcte ID, des métadonnées sur les frais et un compte Taira financé par le robinet.

Pour les exemples payants sur Taira, enregistrer l'aide au robinet à partir de [Obtenir Testnet XOR sur Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) comme `taira_faucet_claim.py`, puis financer le signataire par l'intermédiaire du robinet public:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Si le puzzle du robinet ou la route de réclamation renvoie `502`, attendez et réessayez avant de débogager la transaction elle-même.

Ensuite, joindre les métadonnées de l'actif des frais Taira lors du dépôt de l'opération:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## Transactions hors ligne {#offline-transactions}

Iroha dispose de deux flux de travail de transaction hors ligne:

- La signature hors ligne crée une transaction signée normale pendant que le dispositif de signature est déconnecté. La transaction n'est pas traitée avant qu'un client en ligne ne soumette l'enveloppe signée à Torii, il lui faut donc toujours la chaîne correcte ID, l'autorité, les autorisations, les frais et la durée de vie de la transactions.
- Kagemusha cash hors ligne surplombe un portefeuille alors qu'il est en ligne, prend en charge les remises de portefeuille à portefeuille initiées par le destinataire tandis que les deux portefeuilles sont hors ligne et rachète l'état de la note résultant lorsque le destinataires revient en ligne.

Torii expose l'ensemble du cycle de vie Kagemusha sous `/v1/offline/*`:

|Méthode et point final |Objectif |
| --- | --- |
|`GET /v1/offline/readiness` |Évaluer la préparation des Kagemusha pour un `asset_definition_id` |
|`POST /v1/offline/receiver-lineage` |Résoudre la lignée d' enregistrement active portant preuve pour une demande de réception signée |
|`POST /v1/offline/top-up` |Soumettre une opération de complémentation signée en ligne à hors ligne |
|`POST /v1/offline/redeem` |Soumettre une opération de rachat hors connexion signée |
|`GET /v1/offline/operations/{operation_id}` |Lire le statut canonique d' un complément ou de la rédemption |

Vérifiez la préparation de l'actif avant de construire une opération hors ligne:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

La préparation lie le portefeuille au pont actif . ABI 21 et authentifié V4 La lignée, le complément et les demandes de rachat utilisent typé `application/x-norito` Retour de remboursement `202 Accepted` avec un `Location` en-tête indiquant la ressource d'exploitation; l'opération non zéro intégrée ID fournit la clé de l'idempotence.

Le débit typique est:

1. Renseignez-vous sur la préparation et arrêtez si `ready` est faux ou s'il y a un blocage.
2. Utilisez un portefeuille Swift ou JVM typé pour construire l'archive canonique complémentaire, le soumettre et conserver à la fois l'état de la note d'entrée et l'opération ID jusqu'à ce que l'opération atteigne un état de chaîne final.
3. Résolvez la lignée d'enregistrement du récepteur lorsque cela est nécessaire, construisez et vérifiez chaque transfert par pairs localement, et persistez l'état de la note cryptée avant de reconnaître le transfert.
4. Lorsque le destinataire est en ligne, construisez l'archive canonique de rédemption, soumettez-la et enquêtez sur sa ressource opérationnelle pour finalité.

Le registre ne peut pas observer un transfert hors ligne contradictoire jusqu'à ce que l'état de la note revienne à travers le cycle de vie en ligne. La politique du portefeuille et de l'opérateur devrait donc faire respecter les limites de valeur, l'expiration, les émetteurs acceptés, le stockage local durable; et des fenêtres de réconciliation.

Voici un exemple de création d'une nouvelle transaction avec le `Grant` Dans cette transaction, la souris accorde à Alice le rôle spécifié (`role_id`Vérifiez [l'exemple complet](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
