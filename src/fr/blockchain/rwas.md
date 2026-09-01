---
translation_locale: fr
translation_source: /blockchain/rwas.md
translation_source_hash: 8d64a9a17c93f60306c279e8656e6edde8ce5dd024e742218bfb9572b7438bb0
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Actifs du monde réel {#real-world-assets}

Les actifs du monde réel (RWAs) modélisent des actifs hors chaîne dont la propriété ou le contrôle est suivi sur chaîne. Dans Iroha, un RWA est un lot de registre blockchain enregistré avec un identifiant généré, un compte propriétaire, une quantité, des métadonnées commerciales, la provenance et des contrôles de cycle de vie optionnels.

RWAs sont différents des soldes d'actifs numériques :

- un actif numérique est un solde fongible détenu par un compte
- un NFT est un enregistrement unique en chaîne avec un seul propriétaire
- un RWA est un lot qui peut contenir des métadonnées commerciales, la quantité, les réservations, les blocages, l'état de rachat, la provenance et la politique de contrôle

Utilisez RWAs lorsque le grand livre de la blockchain doit représenter un lot spécifique hors chaîne plutôt que seulement un solde fongible.

## RWA Lot {#rwa-lot}

Un lot RWA contient :

- `id` : l'identifiant canonique généré RWA, affiché comme `<hash>$<domain>`
- `owned_by` : le compte qui possède actuellement le lot
- `quantity` : la quantité restante représentée par le lot
- `spec` : spécification de quantité, telle que l'échelle décimale
- `primary_reference` : le principal enregistrement de résultat de protocole hors chaîne, certificat, facture ou référence de registre
- `status` : texte de statut commercial optionnel
- `metadata` : champs compacts JSON utilisés pour le contexte commercial et l'indexation
- `parents` : lots source utilisés pour dériver ce lot
- `controls` : comptes de contrôleur, rôles de contrôleur et opérations de contrôleur activées
- `is_frozen` et `held_quantity` : état du cycle de vie appliqué par l'environnement d'exécution logiciel

Gardez la charge utile sur la chaîne compacte. Stockez les grands documents juridiques, rapports d'inspection et lots d'audit en dehors de WSV, puis mettez une valeur de digest cryptographique, URI, chemin SoraFS ou référence de manifeste technique dans les métadonnées RWA.

## Identifiants {#identifiers}

`RegisterRwa` n'accepte pas un `id` choisi par l'appelant, et il n'accepte pas un champ `owner`. Le principal d'autorisation de transaction devient le compte `owned_by` initial, et l'exécution du logiciel génère le `RwaId` dans le domaine cible.

La forme textuelle d'un ID RWA est :

```text
<generated-hash>$<domain>
```

Par exemple :

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

Les applications doivent stocker leur identifiant commercial dans `primary_reference` ou `metadata`, puis découvrir le `RwaId` généré à partir de `RwaEvent::Created`, `FindRwas`, `/v1/rwas`, ou du chemin de l'explorateur défini après la validation de la transaction.

## Cycle de vie {#lifecycle}

Les flux de travail RWA courants incluent :

|Opération|Comportement mis en œuvre|
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `RegisterRwa`                              |Créer un lot avec ID généré dans un domaine ; le principal d'autorisation de transaction devient `owned_by`.|
| `TransferRwa`                              |Déplacer la quantité vers un autre compte. Un transfert complet peut changer `owned_by`. Un transfert partiel crée un lot enfant séparé avec un ID généré.|
| `HoldRwa`                                  |Réserver la quantité. Nécessite un contrôleur configuré et `hold_enabled`.|
| `ReleaseRwa`                               |Supprimer la quantité retenue. Nécessite un contrôleur configuré et `hold_enabled`.|
| `FreezeRwa`                                |Bloquer les opérations ordinaires du propriétaire. Nécessite un contrôleur configuré et `freeze_enabled`.|
| `UnfreezeRwa`                              |Réactiver les opérations ordinaires du propriétaire. Nécessite un contrôleur configuré et `freeze_enabled`.|
| `RedeemRwa`                                |Soustraire définitivement la quantité de la circulation. Le propriétaire ou un contrôleur peut la soumettre lorsque `redeem_enabled` est vrai.|
| `MergeRwas`                                |Combinez les quantités des lots parentaux ayant le même domaine et la même spécification en un lot enfant généré.|
| `ForceTransferRwa`                         |Déplacer la quantité à travers un flux de contrôleur. Nécessite un contrôleur configuré et `force_transfer_enabled`.|
| `SetRwaControls`                           |Remplacer la politique de contrôle des lots. Nécessite le propriétaire ou un contrôleur.|
| `SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` |Mettre à jour les métadonnées du lot. Nécessite le propriétaire ou un contrôleur ; les lots gelés nécessitent un contrôleur.|

Il n'y a pas d'instruction `UnregisterRwa` dans le code actuel. mettre hors service un lot hors chaîne avec `RedeemRwa` lorsque la quantité représentée est livrée, consommée, réglée ou autrement retirée de la circulation.

## Métadonnées et Contrôles {#metadata-and-controls}

Utilisez les métadonnées pour des faits compacts qui aident les applications à identifier et vérifier le lot :

- classe d'actifs, émetteur, dépositaire ou référence de registre
- entrepôt, coffre, ISIN, facture ou identifiants de certificat
- hachages cryptographiques de contenu pour les attestations et les documents juridiques
- SoraFS chemins ou références de manifeste technique pour des ensembles de preuves plus importants
- maturité, juridiction ou étiquettes de conformité utilisées par des services hors chaîne

Le `RwaControlPolicy` implémenté possède ces champs :

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

Les comptes et rôles de contrôleur ne peuvent effectuer que les opérations activées par les indicateurs booléens correspondants. La charge utile de contrôle actuelle contient les identités des contrôleurs et les indicateurs d'opération. Les listes d'autorisation de transfert et les règles imbriquées `transfers` sont en dehors de cette charge utile.

## Requêtes, Événements, et APIs {#queries-events-and-apis}

Utiliser [`FindRwas`](/fr/reference/queries.md#assets-nfts-and-rwas) répertorier RWA beaucoup. Les applications qui ont besoin de mises à jour en temps réel peuvent s'abonner à [`Rwa` événements de données](/fr/blockchain/filters.md#data-event-filters) pour créé, propriétaire-modifié, scindé, fusionné, racheté, gelé, dégelé, événements de retenue, libération, transfert de force, changement de contrôle et métadonnées.

Torii expose des itinéraires de l'état de la chaîne tels que `/v1/rwas` et `/v1/rwas/query`, plus explorer des itinéraires tels que `/v1/explorer/rwas` et `/v1/explorer/rwas/{rwa_id}` lorsque cette famille de routes est activée. Les clients générés devraient préférer le direct [`/openapi.json`](/fr/reference/torii-endpoints.md#common-endpoints) document pour la forme exacte de la réponse exposée par un nœud.

### Essayez-le sur Taira {#try-it-on-taira}

Vérifiez si le public Taira a actuellement des lots RWA enregistrés :

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

Listez les itinéraires RWA exposés par le document en direct Taira OpenAPI :

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

Une sortie `items` vide est attendue lorsqu'aucun lot public n'a encore été enregistré. L'enregistrement, le transfert, la mise en attente, le gel et le rachat sont des transactions signées.

## Essayez-le {#try-it}

Les exemples ci-dessous utilisent les surfaces Python SDK de [Configuration partagée](/fr/guide/tutorials/python.md#shared-setup). Remplacez les identifiants de compte, les clés privées et les identifiants de lots générés par des valeurs provenant de votre propre réseau avant de soumettre une transaction.

### Découvrez les itinéraires RWA API {#discover-rwa-api-routes}

Cet exemple en lecture seule demande à un nœud Torii actif quelles routes RWA destinées aux applications sont activées :

```python
from iroha_python import create_torii_client

client = create_torii_client("https://taira.sora.org")
openapi = client.request_json("GET", "/openapi.json", expected_status=(200,))

rwa_paths = sorted(
    path for path in openapi.get("paths", {}) if path.startswith("/v1/rwas")
)

for path in rwa_paths:
    print(path)
```

Si la liste est vide, le nœud peut quand même prendre en charge les instructions et les requêtes RWA via d'autres Torii APIs, mais il n'expose pas la famille de routes optionnelle JSON.

### Enregistrer un enregistrement de résultat de protocole d'entrepôt {#register-a-warehouse-receipt}

Utilisez un brouillon lorsqu'une action commerciale doit devenir une transaction signée. Le numéro d'enregistrement du résultat du protocole commercial va dans `primary_reference`; l'identifiant du grand livre de la blockchain est généré après l'engagement de la transaction.

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

Après la validation de la transaction, listez les ID générés RWA. Les routes de l'état de la chaîne exposent les ID canoniques ; utilisez les événements ou les routes détaillées de l'explorateur lorsque vous devez faire correspondre un ID avec `primary_reference` ou des métadonnées :

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Les nœuds activés pour l'explorateur peuvent également renvoyer des projections plus riches :

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### Transfert avec une retenue temporaire {#transfer-with-a-temporary-hold}

Utilisez l'ID RWA généré renvoyé par la chaîne. Cet exemple suppose que `alice` est le propriétaire et est également configuré comme contrôleur avec `hold_enabled`.

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

Soumettre `ReleaseRwa` après que le processus hors chaîne réussit :

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Ajouter des contrôles et des métadonnées d'audit {#add-controls-and-audit-metadata}

Les contrôles et les métadonnées sont séparés. Utilisez les contrôles pour la politique du contrôleur, et les métadonnées pour les faits que les applications ou les auditeurs doivent afficher :

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

### Échanger ou mettre hors service la quantité {#redeem-or-retire-quantity}

Soumettez `RedeemRwa` après que l'actif hors chaîne représenté est livré, consommé, mis hors service ou autrement retiré de la circulation. Cela soustrait définitivement la quantité soumise du lot. Le lot doit avoir `redeem_enabled`. Le signataire cryptographique doit être le propriétaire ou un contrôleur.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Geler pendant l'examen de conformité {#freeze-during-compliance-review}

Soumettez `FreezeRwa` lorsqu'une révision hors chaîne doit bloquer les opérations ordinaires du propriétaire. Le signataire cryptographique doit être un contrôleur. Le lot doit avoir `freeze_enabled`.

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

Soumettre `UnfreezeRwa` après que l'examen est passé :

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

### Facture à recevoir {#invoice-receivable}

Représentez une facture comme un lot RWA en stockant le numéro de facture dans `primary_reference` et les métadonnées. Après l'enregistrement, utilisez l'ID généré pour le transfert et le remboursement.

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

Lorsque la créance est financée ou payée, utilisez l'ID de lot de facture généré :

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

Échangez le montant représenté après le règlement hors chaîne :

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Retrait de crédits carbone {#carbon-credit-retirement}

Soumettez `RedeemRwa` pour retirer les crédits carbone revendiqués de la circulation. Stockez le certificat hors chaîne ou la preuve d'enregistrement dans les métadonnées :

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

### Fusionner deux lots {#merge-two-lots}

Fusionnez les lots lorsque deux positions hors chaîne sont consolidées. Les parents doivent appartenir au même domaine et utiliser la même spécification de quantité. L’environnement d’exécution génère l’identifiant du lot enfant.

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

Pour l'exemple complet de transaction Python, voir [Actifs du monde réel](/fr/guide/tutorials/python.md#real-world-assets).

## Documents liés {#related-docs}

- [Actifs](/fr/blockchain/assets.md)
- [Métadonnées](/fr/blockchain/metadata.md)
- [Iroha Opérations d'instruction](/fr/blockchain/instructions.md)
- [Requêtes](/fr/reference/queries.md#assets-nfts-and-rwas)
- [Torii API points de terminaison](/fr/reference/torii-endpoints.md#app-and-sora-route-families)
