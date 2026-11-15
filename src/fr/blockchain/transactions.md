---
translation_locale: fr
translation_source: /blockchain/transactions.md
translation_source_hash: d9227effcdb4d54ac76f6288ba213de20f2574e1585e13b96a5202c44b69f3be
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Transactions {#transactions}

Une transaction est une requête signée pour exécuter un travail sur la blockchain. La charge exécutable peut être une séquence ordonnée de [instructions](./instructions.md), un appel de contrat, du bytecode IVM, ou une exécution prouvée IVM. Voir [Contrats intelligents](./smart-contracts.md) pour le modèle d'exécution des contrats actuel.

Les transactions effectuent des travaux modifiant l'état ou exécutables. L'inspection en lecture seule utilise des requêtes signées ou des points de terminaison publics en lecture API et ne crée pas de transaction.

Une transaction admise dans un bloc confirmé est stockée avec son résultat d'exécution, y compris un rejet d'exécution. Les requêtes rejetées avant l'admission dans le bloc, telles qu'un conteneur de données invalide ou une transaction refusée par la file d'attente, ne sont pas stockées dans un bloc.

Pour le déplacement d'actifs préservant la confidentialité, voir [Transactions anonymes](./anonymous-transactions.md). Les transactions anonymes utilisent des notes d'actifs protégées, des engagements, des nullificateurs et des preuves à divulgation nulle de connaissance au lieu de modifications de solde de compte à compte publiques.

Pour des preuves sur les effets d'exécution transparents sélectionnés, voir [FastPQ](./fastpq.md). FastPQ consomme les témoins d'exécution après l'exécution normale des transactions et construit des lots de preuves déterministes pour les transitions d'état prises en charge.

## Essayez-le sur Taira {#try-it-on-taira}

Utilisez les itinéraires de l'explorateur pour inspecter les blocs publics récents Taira et les statuts des transactions sans compte de signature :

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Pour suivre une transaction que votre application a soumise précédemment, copiez le `hash` de la liste et inspectez le détail du parcours dans l'explorateur :

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Cette opération reste en lecture seule. La soumission d'une transaction exige une enveloppe Norito signée, les bons identifiants de chaîne et de réseau, un payeur de frais explicite et un compte Taira alimenté par le faucet.

Pour les exemples soumis à des frais sur Taira, alimentez le compte signataire avec la procédure de faucet décrite dans [Obtenir des XOR de test sur Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), puis vérifiez le solde de l'actif utilisé pour les frais :

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Si une route du faucet renvoie `502`, attendez et réessayez avant de déboguer la transaction elle-même.

Sélectionnez ensuite le payeur des frais lors de la soumission de la transaction. Avec `--fee-payer authority`, le compte signataire paie, et la CLI calcule les frais exacts dans l'actif de frais de Taira avant la signature :

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "faucet-funded taira transaction"
```

## Transactions hors ligne {#offline-transactions}

Iroha a deux flux de travail de transaction hors ligne :

- La signature hors ligne crée une transaction signée normale tandis que le dispositif de signature est déconnecté. La transaction n'est pas traitée tant qu'un client en ligne ne soumet pas le conteneur de données signé à Torii, elle nécessite donc toujours l'ID de chaîne correct, le principal d'autorisation, les permissions, les frais, et durée de vie de la transaction.
- **Le paiement en espèces hors ligne Kagemusha** charge de la valeur dans un portefeuille inscrit et protégé par du matériel lorsqu'il est en ligne, permet des paiements entre deux portefeuilles tous deux hors ligne, puis décharge la valeur restante vers un compte du registre lorsque le portefeuille est de nouveau en ligne.

Torii expose une seule route Kagemusha de modification, `POST /v1/kagemusha/enrollment`. Elle accepte des trames d'inscription `application/x-norito` authentifiées par le compte et renvoie des réponses privées qui ne doivent pas être mises en cache. Les routes de lecture SDK signées par le compte sous `/v1/kagemusha/{scheme}/wallets/{wallet}/` renvoient les reçus Load et les preuves de finalité ; elles ne figurent pas dans `/openapi.json`. La partie du cycle de vie gérée par le registre utilise des transactions signées ordinaires contenant une instruction `KagemushaWalletLedgerV1` :

| Action | Objectif |
| --- | --- |
| `Activate` | Activer un portefeuille inscrit ; la vérification native de l'amorçage est obligatoire |
| `IssueLoad` | Débiter le payeur et enregistrer atomiquement le prochain Load du portefeuille |
| `Unload` | Payer une demande Unload complète à son compte lié, au plus une fois |
| `ClaimFee` | Payer une demande de frais complète à son bénéficiaire fixe |
| `Abandon` | Abandonner une inscription inutilisée |

Le flux typique est :

1. Inscrivez le portefeuille via `/v1/kagemusha/enrollment` à l'aide d'un portefeuille typé Swift ou Android, puis activez-le.
2. Soumettez une transaction `IssueLoad`. L'exécution vérifie le numéro d'ordre attendu du prochain Load et l'identifiant de requête non nul ; une nouvelle tentative périmée ou modifiée échoue donc. Si la réponse est perdue, consultez le reçu du Load initial au lieu de signer un autre Load.
3. Échangez et vérifiez les paiements localement entre les portefeuilles hors ligne, et enregistrez durablement l'état du portefeuille avant d'accuser réception de chaque transfert.
4. Lorsque le portefeuille est de nouveau en ligne, soumettez sa demande Unload et attendez la finalité.

Kagemusha n'est pas encore qualifié pour une version publiée : la qualification monétaire sur le réseau réel ainsi que l'enregistrement des téléphones, l'activation et le paiement sur des appareils physiques restent en suspens.

Le registre blockchain ne peut pas observer un transfert hors ligne conflictuel tant que l'état de la note ne revient pas à travers le cycle de vie en ligne. La politique du portefeuille et de l'opérateur doit donc appliquer des limites de valeur, des dates d'expiration, des émetteurs acceptés, un stockage local durable et des fenêtres de réconciliation.

Voici un exemple de création d'une nouvelle transaction avec l'instruction `Grant`. Dans cette transaction, Mouse accorde à Alice le rôle spécifié (`role_id`). Vérifiez [l'exemple complet](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
// `network_id` is the target network's `NetworkId`; the fee intent is bound
// into the signature (use the intent returned by a fee quote).
let grant_role_tx = TransactionBuilder::new(
    network_id,
    mouse_id,
    FeePaymentIntent::authority(Vec::new(), None),
)
.with_instructions([grant_role])
.sign(&mouse_private_key);
```
