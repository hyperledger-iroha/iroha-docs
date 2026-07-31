---
translation_locale: fr
translation_source: /blockchain/transactions.md
translation_source_hash: 6381e93ada6191d15b11f7359e983e5c3dac49e69323b20da09959d5e04331f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Transactions {#transactions}

Une **transaction** est une demande signée pour exécuter des travaux sur la blockchain.
La charge utile exécutable peut être une séquence ordonnée de
[les instructions](./instructions.md), une invitation contractuelle, IVM code octal ou un
prouvé IVM l'exécution. [Contrats intelligents](./smart-contracts.md) pour le courant
modèle d'exécution du contrat.

Les opérations effectuent des travaux de changement d'état ou exécutables.
utilise des requêtes signées ou des terminaux de lecture publics et ne crée pas une transaction.

Une transaction admise dans un bloc engagé est stockée avec son exécution
résultat, y compris un refus d'exécution.
l'admission, comme une enveloppe invalide ou une transaction refusée par la file d'attente;
ne sont pas stockées dans un bloc.

Pour les mouvements d'actifs protégeant la vie privée, voir
[Transactions anonymes](./anonymous-transactions.md). Nom anonyme
les transactions utilisent des notes d'actifs protégées, des engagements, des annulateurs et
des preuves de connaissance zéro au lieu de changements du solde public compte à compte.

Pour des preuves sur certains effets d'exécution transparents, voir
[FastPQ](./fastpq.md). FastPQ consomme des témoins d'exécution après la normale
l'exécution de la transaction et construit des lots de preuve déterministique pour les supportés
les transitions d'État.

## Essayez-le . Taira {#try-it-on-taira}

Utilisez les itinéraires des explorateurs pour inspecter le public récent Taira blocs et transactions
les statuts sans compte de signature:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/blocks?page=1&per_page=3' \
  | jq '{pagination, blocks: [.items[] | {height, hash, transactions_total, transactions_rejected}]}'

curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Pour suivre une transaction que votre application a envoyée plus tôt, copier le `hash` de la
liste et inspection détaillée de la route des explorateurs:

```bash
TX_HASH='<transaction-hash>'

curl -fsS "https://taira.sora.org/v1/explorer/transactions/$TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

La soumission d'une transaction nécessite une signature Norito
enveloppe, chaîne correcte ID, les métadonnées des frais et un robinet financé Taira compte.

Pour les exemples de paiement des frais sur Taira, épargner l'aide au robinet
[Prenez le testnet XOR sur le Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
comme `taira_faucet_claim.py`, puis financer le signataire par le robinet public
Tout d'abord:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Si le puzzle du robinet ou la route de réclamation revient `502`, attendre et essayer à nouveau avant
débogage de la transaction elle-même.

Puis attachez le Taira les métadonnées des actifs de redevances lors du dépôt de la transaction:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "faucet-funded taira transaction"
```

## Transactions hors ligne {#offline-transactions}

Iroha dispose de deux flux de travail de transaction hors ligne:

- **Signature hors ligne** crée une transaction signée normale pendant la signature
  La transaction n'est pas traitée avant qu'une
  le client soumet l'enveloppe signée à Torii, Donc il a encore besoin de la
  chaîne correcte ID, autorité, permissions, frais et durée de vie des transactions.
- **Kagemusha en espèces hors ligne** remplit un portefeuille alors qu'il est en ligne, supporte
  les remises de portefeuille à portefeuille initiées par le destinataire alors que les deux portefeuilles sont
  en ligne, et rachète l'état de la note résultante lorsque le destinataire retourne
  en ligne.

Torii l'ensemble du cycle de vie Kagemusha sous `/v1/offline/*`:

| Méthode et point final | Le but |
| --- | --- |
| `GET /v1/offline/readiness` | Évaluer la préparation de Kagemusha pour un `asset_definition_id` |
| `POST /v1/offline/receiver-lineage` | Résoudre la lignée d'enregistrement active portant preuve pour une demande de réception signée |
| `POST /v1/offline/top-up` | Soumettre une opération de complémentation signée en ligne à hors ligne |
| `POST /v1/offline/redeem` | Soumettre une opération de rachat hors ligne signée |
| `GET /v1/offline/operations/{operation_id}` | Lire l'état canonique d'un complément ou de la rédemption |

Vérifiez la préparation de l'actif avant de construire une opération hors ligne:

```bash
curl -fsS --get https://taira.sora.org/v1/offline/readiness \
  --data-urlencode 'asset_definition_id=<canonical_asset_definition_id>' \
  | jq '{ready, blockers, artifact_set}'
```

La préparation lie le portefeuille au pont actif ABI 21 et authentifié V4
Les lignées, les compléments et les demandes de rachat utilisent
`application/x-norito` Retour à l'archives. `202 Accepted`
avec un `Location` l'en-tête indiquant la ressource d'exploitation;
opération non zéro ID fournit la clé de l'idempotence.

Le débit typique est:

1. Retour à la préparation et arrêt si `ready` est fausse ou tout blocage s'applique.
2. Utilisez un type Swift ou JVM portefeuille pour la construction de l'archivage canonique complémentaire,
   le soumettre et conserver à la fois l'état et le fonctionnement de la note d'entrée ID jusqu'à
   l'opération atteint un état de chaîne final.
3. Résoudre la lignée d'enregistrement du récepteur si nécessaire, construire et
   vérifier chaque partage de données localement, et persister l'état de la note cryptée
   avant de reconnaître le transfert.
4. Quand le destinataire est en ligne, créez l'archive canonique de rédemption,
   Il est nécessaire d'envoyer le document et de vérifier les ressources opérationnelles.

Le registre ne peut pas observer un transfert hors ligne contradictoire jusqu'à ce que l'état note
les retours au cours du cycle de vie en ligne.
les émetteurs acceptés, la valeur locale durable
les fenêtres de stockage et de réconciliation.

Voici un exemple de création d'une nouvelle transaction avec le `Grant`
Dans cette transaction, Mouse accorde à Alice le droit spécifié
rôle (`role_id`Vérifiez
[l'exemple complet](./permissions.md#register-a-new-role).

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```
