---
translation_locale: fr
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: bing-translator-llm
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

Ceci est toujours en lecture seule. Soumettre une transaction nécessite un conteneur de données Norito signé, un ID de chaîne correct, des métadonnées de frais, et un compte Taira financé sur le testnet.

Pour les exemples payants sur Taira, enregistrez l’outil de [Obtention de XOR de test sur Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) sous `taira_faucet_claim.py`, puis financez d’abord le signataire via le distributeur public :

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Si le puzzle du service de financement du testnet ou la route de réclamation renvoie `502`, attendez et réessayez avant de déboguer la transaction elle-même.

Puis joignez les métadonnées de l'actif de frais Taira lors de la soumission de la transaction :

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## Transactions hors ligne {#offline-transactions}

Iroha a deux flux de travail de transaction hors ligne :

- La signature hors ligne crée une transaction signée normale tandis que le dispositif de signature est déconnecté. La transaction n'est pas traitée tant qu'un client en ligne ne soumet pas le conteneur de données signé à Torii, elle nécessite donc toujours l'ID de chaîne correct, le principal d'autorisation, les permissions, les frais, et durée de vie de la transaction.
- Kagemusha recharge en espèces hors ligne un portefeuille pendant qu'il est en ligne, prend en charge les transferts de portefeuille à portefeuille initiés par le destinataire lorsque les deux portefeuilles sont hors ligne, et encaisse l'état de note résultant lorsque le destinataire se reconnecte en ligne.

Torii expose le cycle de vie complet de Kagemusha sous `/v1/offline/*` :

|Méthode et point de terminaison API|But|
| --- | --- |
| `GET /v1/offline/readiness` |Évaluer la préparation de Kagemusha pour un `asset_definition_id`|
| `POST /v1/offline/receiver-lineage` |Résoudre la lignée d'enregistrement actif portant preuve pour une demande de récepteur signée|
| `POST /v1/offline/top-up` |Soumettre une opération de recharge en ligne-vers-hors ligne signée|
| `POST /v1/offline/redeem` |Soumettre une opération de rachat hors ligne signée|
| `GET /v1/offline/operations/{operation_id}` |Lisez le statut canonique d'un rechargement ou d'un rachat|

Vérifiez la préparation de l'actif avant de construire une opération hors ligne :

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

La préparation lie le portefeuille au pont actif ABI 21 et au jeu d’artefacts authentifié V4. Les demandes de lignée, de recharge et de remboursement utilisent des archives typées `application/x-norito`. Recharge et retour de remboursement `202 Accepted` avec un en-tête `Location` pointant vers la ressource de l'opération ; l'ID d'opération non nul intégré fournit la clé d'idempotence.

Le flux typique est :

1. Vérifiez la préparation et arrêtez-vous si `ready` est faux ou si un blocage s'applique.
2. Utilisez un portefeuille tapé Swift ou JVM pour créer l'archive de rechargement canonique, soumettez-la, et conservez à la fois l'état de la note d'entrée et l'ID de l'opération jusqu'à ce que l'opération atteigne un état final sur la chaîne.
3. Résoudre la lignée d'enregistrement du récepteur lorsque nécessaire, construire et vérifier chaque remise entre pairs du réseau localement, et conserver l'état chiffré de la note avant d'accuser réception du transfert.
4. Lorsque le destinataire est en ligne, construisez l'archive de rachat canonique, soumettez-la, et interrogez sa ressource opérationnelle jusqu'à la finalité.

Le registre blockchain ne peut pas observer un transfert hors ligne conflictuel tant que l'état de la note ne revient pas à travers le cycle de vie en ligne. La politique du portefeuille et de l'opérateur doit donc appliquer des limites de valeur, des dates d'expiration, des émetteurs acceptés, un stockage local durable et des fenêtres de réconciliation.

Voici un exemple de création d'une nouvelle transaction avec l'instruction `Grant`. Dans cette transaction, Mouse accorde à Alice le rôle spécifié (`role_id`). Vérifiez [l'exemple complet](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
