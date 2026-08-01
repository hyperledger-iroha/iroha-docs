---
translation_locale: fr
translation_source: /blockchain/rwas.md
translation_source_hash: cbdc6d766fb90bea7e68dc67f2c705bb1638340feeb2fca9f2dd43a727ac03e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Actifs du monde réel {#real-world-assets}

Les actifs du monde réel (RWAs) sont des actifs hors chaîne dont la propriété ou le contrôle est suivi sur la chaîne. Dans Iroha, un RWA est un lot de registre enregistré avec un identifiant généré, un compte propriétaire, une quantité, des métadonnées commerciales, l'origine et des contrôles optionnels du cycle de vie.

RWAs sont différentes des soldes d'actifs numériques:

- un actif numérique est un solde fungible détenu par un compte
- un NFT est un enregistrement unique en chaîne avec un seul propriétaire
- un RWA est un lot qui peut contenir des métadonnées d'affaires, quantité, détention, gel, état de rachat, provenance et politique du contrôleur

Utilisez RWAs lorsque le registre doit représenter un lot spécifique hors chaîne au lieu d'un seul solde fungible.

## RWA lot {#rwa-lot}

Un lot de RWA contient:

- `id`: l'identifiant canonique RWA généré, affiché sous le nom de `<hash>$<domain>`
- `owned_by`: le compte qui détient actuellement le lot;
- `quantity`: la quantité restante représentée par le lot;
- `spec`: spécification de quantité, par exemple à l'échelle décimale
- `primary_reference`: le principal reçu, certificat, facture ou référence de registre hors chaîne.
- `status`: texte facultatif sur le statut de l'entreprise
- `metadata`: champs compacts JSON utilisés pour le contexte des affaires et l'indexation
- `parents`: lots de source utilisés pour dériver ce lot
- `controls`: comptes du contrôleur, rôles du contrôleur et opérations du contrôleur activées;
- `is_frozen` et `held_quantity`: état du cycle de vie appliqué par le temps d'exécution

Gardez la charge utile en chaîne compacte. Conservez de grands documents juridiques, rapports d'inspection et paquets d'audit à l'extérieur du WSV, puis placez un digeste, URI, SoraFS chemin ou une référence manifeste dans les métadonnées RWA.

## Indicateurs d'identification {#identifiers}

`RegisterRwa` n'accepte pas un appelant choisi `id`, et il n'accepte pas un `owner` L'autorité de la transaction devient l'autorité initiale `owned_by` compte, et le temps d'exécution génère les `RwaId` dans le domaine cible.

La forme textuelle d'un RWA ID est la suivante:

```text
<generated-hash>$<domain>
```

À titre d'exemple:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

Les demandes doivent stocker leur identifiant d'entreprise dans `primary_reference` ou `metadata`, puis découvrir le `RwaId` généré à partir de `RwaEvent::Created`, `FindRwas`, `/v1/rwas`, ou du trajet de l'explorateur établi après les engagements de la transaction.

## Cycle de vie {#lifecycle}

Les flux de travail communs RWA comprennent:

|Opération |Le comportement mis en œuvre |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
|`RegisterRwa` |Créer un lot généré par ID dans un domaine; l'autorité de transaction devient `owned_by`. |
|`TransferRwa` |Transférer la quantité vers un autre compte. Un transfert complet peut changer `owned_by`. Un transfert partiel crée un lot enfant séparé avec un ID généré. |
|`HoldRwa` |Quantité de réserve: Il faut un contrôleur configuré et `hold_enabled`. |
|`ReleaseRwa` |Supprimer la quantité retenue. Il faut un contrôleur configuré et `hold_enabled`. |
|`FreezeRwa` |Bloquer les opérations du propriétaire ordinaire. Il faut un contrôleur configuré et `freeze_enabled`. |
|`UnfreezeRwa` |Réactiver les opérations de propriétaire ordinaire. Il faut un contrôleur configuré et `freeze_enabled`. |
|`RedeemRwa` |Soustraire définitivement une quantité de la circulation. Le propriétaire ou un contrôleur peut le soumettre lorsque `redeem_enabled` est vrai. |
|`MergeRwas` |Combiner les quantités provenant des lots parents avec le même domaine et spécification en un lot enfant généré. |
|`ForceTransferRwa` |Déplacez la quantité à travers un flux de contrôle. Il faut un contrôleur configuré et `force_transfer_enabled`. |
|`SetRwaControls` |Remplacez la politique de contrôle du lot, demande le propriétaire ou un contrôleur.|
|`SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |Mettre à jour les métadonnées du lot. Requiert le propriétaire ou un contrôleur; les lots gelés nécessitent un contrôleur. |

Il n'y a pas d'instruction `UnregisterRwa` dans le code actuel. Retirer un lot hors chaîne avec `RedeemRwa` lorsque la quantité représentée est livrée, consommée, réglée ou supprimée de toute autre manière de la circulation.

## Les métadonnées et les contrôles {#metadata-and-controls}

Utiliser des métadonnées pour des faits compacts qui aident les applications à identifier et à vérifier le lot:

- référence de catégorie d'actif, émetteur, dépositaire ou registre
- identifiants d'entrepôt, de voûte, ISIN, de facture ou de certificat;
- hashes de contenu pour les attestations et documents juridiques
- SoraFS chemins ou références manifestes pour les paquets d'éléments de preuve plus grands
- les étiquettes de maturité, de compétence ou de conformité utilisées par les services hors chaîne

Le `RwaControlPolicy` mis en œuvre comporte les champs suivants:

```json
{
  "controller_accounts": [],
  "controller_roles": [],
  "freeze_enabled": true,
  "hold_enabled": true,
  "force_transfer_enabled": false,
  "redeem_enabled": true
}
```

Les comptes et rôles du contrôleur ne peuvent effectuer que les opérations activées par les drapeaux booléens correspondants. La charge utile de contrôle actuelle contient des identités du contrôleur et des drapeaux d'exploitation. `transfers` Les règles sont en dehors de cette charge utile.

## Les questions, les événements et APIs {#queries-events-and-apis}

Utilisation [`FindRwas`](/fr/reference/queries.md#assets-nfts-and-rwas) à la liste inscrite RWA Les applications qui ont besoin de mises à jour en direct peuvent s'abonner à [`Rwa` événements de données](/fr/blockchain/filters.md#data-event-filters) pour les produits créés, changés de propriétaire, divisés, fusionnés, rachetés, congelés, non congelés, événements tenus, libérés, transférés par la force, contrôles modifiés et métadonnées.

Torii expose les routes d'état de chaîne telles que `/v1/rwas` et `/v1/rwas/query`, ainsi que les routes exploratrices telles que `/v1/explorer/rwas` et `/v1/explorer/rwas/{rwa_id}` lorsque cette famille de routes est activée. Les clients générés devraient préférer le document en direct [`/openapi`](/fr/reference/torii-endpoints.md#common-endpoints) pour la forme exacte de réponse exposée par un nœud.

### Essayez le sur Taira {#try-it-on-taira}

Vérifiez si le lot public Taira a actuellement été enregistré RWA:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

Liste des itinéraires RWA exposés par le document en direct Taira OpenAPI:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

Une sortie vide `items` est attendue lorsqu'aucun lot public n'est encore enregistré. Les transactions d'enregistrement, de transfert, de détention, de congélation et de rachat sont signées.

## Essayez ! {#try-it}

Les exemples suivants utilisent les Python SDK surfaces de [Configuration partagée](/fr/guide/tutorials/python.md#shared-setup). Remplacez le compte IDs, clés privées, et lot généré IDs avec des valeurs provenant de votre propre réseau avant de soumettre une transaction.

### Découvrez les routes RWA API {#discover-rwa-api-routes}

Cet exemple de lecture uniquement demande à un nœud Torii en cours d'exécution les routes RWA orientées vers l'application qui sont activées:

```python
from iroha_python import create_torii_client

client = create_torii_client("https://taira.sora.org")
openapi = client.request_json("GET", "/openapi", expected_status=(200,))

rwa_paths = sorted(
    path for path in openapi.get("paths", {}) if path.startswith("/v1/rwas")
)

for path in rwa_paths:
    print(path)
```

Si la liste est vide, le nœud peut encore prendre en charge les instructions RWA et les requêtes par l'intermédiaire d'autres Torii APIs, mais il n'expose pas la famille de routes optionnelle JSON.

### Inscrivez un reçu d'entrepôt {#register-a-warehouse-receipt}

Utilisez un projet lorsqu'une action commerciale doit devenir une transaction signée. Le numéro de reçu d'entreprise entre dans `primary_reference`; le registre ID est généré après que l'opération a pris des engagements.

```python
from iroha_python import TransactionConfig, TransactionDraft

config = TransactionConfig(
    chain_id=CHAIN_ID,
    authority=alice,
    metadata={**TX_METADATA, "source": "rwa-docs"},
)

draft = TransactionDraft(config)
draft.register_rwa(
    {
        "domain": "commodities.universal",
        "quantity": "100",
        "spec": {"scale": 0},
        "primary_reference": "warehouse-receipt-001",
        "status": "active",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "inspection_report": "sorafs://reports/copper-001.json",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": True,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Après l'engagement de la transaction, une liste est générée RWA IDs. Les routes d'état de chaîne exposent le canonique IDs; utilisez des routes événements ou explorateurs détaillés lorsque vous devez faire correspondre un ID à `primary_reference` ou aux métadonnées:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Les nœuds activés par l'explorateur peuvent également rendre des projections plus riches:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### Un transfert avec une retenue temporaire {#transfer-with-a-temporary-hold}

Utilisez le généré RWA ID l'exemple suivant suppose que `alice` est le propriétaire et est également configuré comme un contrôleur avec `hold_enabled`.

```python
warehouse_lot_id = (
    "0123456789abcdef0123456789abcdef"
    "0123456789abcdef0123456789abcdef$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.transfer_rwa(warehouse_lot_id, quantity="10", destination=bob)
draft.hold_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

S'il est possible de soumettre `ReleaseRwa` après la réussite du processus hors chaîne:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Ajouter des métadonnées de contrôle et d'audit {#add-controls-and-audit-metadata}

Les contrôles et les métadonnées sont séparés.Utilisez des contrôles pour la politique du contrôleur, et des métadonnées pour les faits que les applications ou les auditeurs doivent afficher:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)

draft.set_rwa_controls(
    warehouse_lot_id,
    {
        "controller_accounts": [alice],
        "controller_roles": [],
        "freeze_enabled": True,
        "hold_enabled": True,
        "force_transfer_enabled": True,
        "redeem_enabled": True,
    },
)
draft.set_rwa_key_value(warehouse_lot_id, "auditor", "alice")
draft.set_rwa_key_value(
    warehouse_lot_id,
    "proof_hash",
    "sha256:2b1c7a4e...",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Quantité de rachat ou de retraite {#redeem-or-retire-quantity}

Envoyer `RedeemRwa` après que l'actif hors chaîne représenté a été livré, consommé, retiré ou supprimé de toute autre manière de la circulation. Cela soustrait définitivement la quantité présentée du lot. Le lot doit avoir `redeem_enabled`.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Le congé pendant l'examen de la conformité {#freeze-during-compliance-review}

Envoyer `FreezeRwa` Lorsqu'une revue hors chaîne doit bloquer les opérations ordinaires du propriétaire, le signataire doit être un contrôleur. `freeze_enabled`.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.freeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {
        "status": "frozen",
        "reason": "custodian inventory check",
        "case_id": "OPS-2026-0042",
    },
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

S'il y a lieu de soumettre `UnfreezeRwa` après le passage du réexamen:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.unfreeze_rwa(warehouse_lot_id)
draft.set_rwa_key_value(
    warehouse_lot_id,
    "review",
    {"status": "cleared", "case_id": "OPS-2026-0042"},
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Les factures à recevoir {#invoice-receivable}

représenter une facture en tant que RWA lot en conservant le numéro de facture dans `primary_reference` Après l'enregistrement, utilisez les ID pour le transfert et le rachat.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.register_rwa(
    {
        "domain": "receivables.universal",
        "quantity": "50000",
        "spec": {"scale": 2},
        "primary_reference": "INV-2026-0007",
        "status": "issued",
        "metadata": {
            "asset_class": "invoice",
            "currency": "USD",
            "debtor": "example-buyer",
            "due_date": "2026-06-30",
            "document_hash": "sha256:4df4c8...",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": False,
            "force_transfer_enabled": False,
            "redeem_enabled": True,
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Lorsque la créance est financée ou payée, utilisez le lot de facture générée ID:

```python
invoice_lot_id = (
    "fedcba9876543210fedcba9876543210"
    "fedcba9876543210fedcba9876543210$receivables.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.transfer_rwa(invoice_lot_id, quantity="50000", destination=bob)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Remboursement du montant représenté après règlement hors chaîne:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Retraite du crédit carbone {#carbon-credit-retirement}

Soumettre `RedeemRwa` pour retirer des crédits de carbone revendiqués de la circulation. Conserver le certificat hors chaîne ou la preuve de registre dans les métadonnées:

```python
carbon_lot_id = (
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa$carbon.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(carbon_lot_id, quantity="250")
draft.set_rwa_key_value(
    carbon_lot_id,
    "retirement_certificate",
    "sorafs://certificates/carbon-credit-2026-001-retired.json",
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Faites fusionner les deux lots {#merge-two-lots}

Combiner des lots lorsque deux positions hors chaîne sont consolidées. Les parents doivent être dans le même domaine et utiliser la même spécification de quantité. Le runtime génère le lot enfant ID.

```python
warehouse_lot_id_2 = (
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.merge_rwas(
    {
        "parents": [
            {"rwa": warehouse_lot_id, "quantity": "40"},
            {"rwa": warehouse_lot_id_2, "quantity": "60"},
        ],
        "primary_reference": "warehouse-receipt-003",
        "status": "merged",
        "metadata": {
            "asset_class": "commodity",
            "commodity": "copper",
            "warehouse": "DXB-01",
            "merge_reason": "same custodian and quality grade",
        },
    }
)

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

Pour l'exemple complet de la transaction Python, voir [Actifs du monde réel](/fr/guide/tutorials/python.md#real-world-assets).

## Documents connexes {#related-docs}

- [Les actifs ](/fr/blockchain/assets.md)
- [Metadonnées ](/fr/blockchain/metadata.md)
- [Iroha Instructions spéciales](/fr/blockchain/instructions.md)
- [Les questions ](/fr/reference/queries.md#assets-nfts-and-rwas)
- [points d'extrémité Torii](/fr/reference/torii-endpoints.md#app-and-sora-route-families)
