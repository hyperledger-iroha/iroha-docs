---
translation_locale: fr
translation_source: /blockchain/rwas.md
translation_source_hash: 80593515d6919a6b6cb282ddcd4903ce000b56b264f350a42a6ed792f9cbef73
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les actifs du monde réel {#real-world-assets}

Les actifs réels (RWAs) modèle d'actifs hors chaîne dont la propriété ou le contrôle
Il est détecté sur la chaîne. Iroha, une RWA est un lot de registre enregistré avec une
l'identifiant généré, un compte de propriétaire, une quantité, des métadonnées commerciales;
la provenance et les contrôles facultatifs du cycle de vie.

RWAs sont différentes des soldes d'actifs numériques:

- un actif numérique est un solde fungible détenu par un compte
- une NFT est un enregistrement unique en chaîne avec un seul propriétaire
- une RWA est un lot qui peut contenir des métadonnées d'affaires, quantité, détient,
  gel, état de rachat, provenance et politique du contrôleur

Utilisation RWAs lorsque le registre doit représenter un lot spécifique hors chaîne
au lieu d'un équilibre fungible.

## RWA Lot {#rwa-lot}

Une RWA le lot contient:

- `id`: le canonique généré RWA identifiant, affiché comme
  `<hash>$<domain>`
- `owned_by`: le compte qui détient actuellement le lot
- `quantity`: la quantité restante représentée par le lot
- `spec`: spécification de quantité, telle que l'échelle décimale
- `primary_reference`: le principal reçu, certificat, facture hors chaîne ou
  référence au registre
- `status`: texte de l'état d'entreprise facultatif
- `metadata`: compacte JSON champs utilisés pour le contexte commercial et l'indexation
- `parents`: lot source utilisé pour dériver ce lot
- `controls`: les comptes du contrôleur, les rôles du contrôleur et le contrôleur activé
  opérations
- `is_frozen` et `held_quantity`: état du cycle de vie appliqué par la durée d'exécution

Gardez la charge utile sur chaîne compacte.
les rapports et les paquets d'audit en dehors des WSV, puis mets une digestion, URI, SoraFS
chemin ou référence manifeste dans RWA les métadonnées.

## Identifiants {#identifiers}

`RegisterRwa` n'accepte pas un appelant choisi `id`, et il n'accepte pas
une `owner` Le champ: l'autorité de la transaction devient le premier `owned_by`
compte, et le temps d'exécution génère `RwaId` dans le domaine cible.

La forme textuelle d'une RWA ID est:

```text
<generated-hash>$<domain>
```

Par exemple:

```text
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef$commodities.universal
```

Les demandes doivent conserver leur identifiant d'entreprise dans `primary_reference`
ou `metadata`, puis découvrez les générées `RwaId` à partir
`RwaEvent::Created`, `FindRwas`, `/v1/rwas`, ou l'ensemble de la route des explorateurs
après l'engagement de la transaction.

## Cycle de vie {#lifecycle}

Le plus commun RWA les flux de travail comprennent:

| L'opération                                  | Comportement mis en œuvre                                                                                                       |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `RegisterRwa`                              | Créez une génération de...ID lot dans un domaine; l'autorité de transaction devient `owned_by`.                                       |
| `TransferRwa`                              | Transférer la quantité à un autre compte. `owned_by`; Un transfert partiel crée un lot d'enfants généré. |
| `HoldRwa`                                  | Quantité de réserve. nécessite un contrôleur configuré et `hold_enabled`.                                                     |
| `ReleaseRwa`                               | Retirez la quantité retenue. `hold_enabled`.                                                 |
| `FreezeRwa`                                | Bloquer les opérations du propriétaire ordinaire. `freeze_enabled`.                                    |
| `UnfreezeRwa`                              | Réactiver les opérations ordinaires du propriétaire. `freeze_enabled`.                                |
| `RedeemRwa`                                | Il est nécessaire que le propriétaire ou un contrôleur `redeem_enabled`.                                                  |
| `MergeRwas`                                | Combinez les quantités provenant des lots parents avec le même domaine et la spécification en un lot enfant généré.                              |
| `ForceTransferRwa`                         | Mettre la quantité à travers un flux de contrôle. `force_transfer_enabled`.                    |
| `SetRwaControls`                           | Remplacez la politique de contrôle du lot.                                                        |
| `SetKeyValue<Rwa>` / `RemoveKeyValue<Rwa>` | Mettre à jour les métadonnées du lot. Requiert le propriétaire ou un contrôleur; les lots gelés nécessitent un contrôleur.                                 |

Il n'y a pas `UnregisterRwa` l'instruction dans le code actuel.
lot hors chaîne avec `RedeemRwa` lors de la livraison de la quantité représentée,
consommé, installé ou retiré de la circulation.

## Metadata et contrôles {#metadata-and-controls}

Utiliser des métadonnées pour des faits compacts qui aident les applications à identifier et vérifier
le lot:

- référence de catégorie d'actif, émetteur, dépositaire ou registre
- entrepôt, coffre-fort ISIN, facture ou identifiants de certificat
- hashes de contenu pour les attestations et documents juridiques
- SoraFS les chemins ou références manifestes pour des paquets de preuves plus vastes
- les étiquettes de maturité, de compétence ou de conformité utilisées par des services hors chaîne

Les mesures mises en œuvre `RwaControlPolicy` a les champs suivants:

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

Les comptes et les rôles du contrôleur sont autorisés à être effectués uniquement par le contrôleur
les opérations activées par le drapeau booléen correspondant.
la charge utile n'est pas une politique de transfert de liste d'autorisation et ne contient pas de filet
`transfers` Les règles.

## Questions, événements et APIs {#queries-events-and-apis}

Utilisation [`FindRwas`](/fr/reference/queries.md#assets-nfts-and-rwas) à répertorier
enregistré RWA Les applications qui ont besoin de mises à jour en direct peuvent s'abonner à
[`Rwa` événements de données](/fr/blockchain/filters.md#data-event-filters) pour les créés,
changés de propriétaire, divisés, fusionnés, rachetés, congelés, décongelés, détenus, libérés,
des événements de transfert de force, de changement de contrôle et de métadonnées.

Torii exposent des itinéraires en état de chaîne tels que `/v1/rwas` et `/v1/rwas/query`,
Plus des itinéraires d'explorateurs tels que `/v1/explorer/rwas` et
`/v1/explorer/rwas/{rwa_id}` lorsque cette famille de routes est activée.
Les clients devraient préférer le live
[`/openapi`](/fr/reference/torii-endpoints.md#common-endpoints) document pour
la forme exacte de réponse exposée par un nœud.

### Essayez-le . Taira {#try-it-on-taira}

Vérifiez si elle est publique Taira a actuellement enregistré RWA Les lots:

```bash
curl -fsS 'https://taira.sora.org/v1/rwas?limit=5' \
  | jq '{total, rwa_ids: [.items[].id]}'
```

Liste des RWA les itinéraires exposés par le live Taira OpenAPI document:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/rwas") or startswith("/v1/explorer/rwas"))'
```

Vacu `items` la production est attendue lorsqu'aucun lot public n'a encore été enregistré.
L'enregistrement, le transfert, la conservation, le gel et le rachat sont des transactions signées.

## Essayez ! {#try-it}

Les exemples ci-dessous utilisent les Python SDK surfaces de
[Configuration partagée](/fr/guide/tutorials/python.md#shared-setup). Remplacez le
compte IDs, clés privées et lots générés IDs avec des valeurs propres
réseau avant de soumettre une transaction.

### Découvrez RWA API Route {#discover-rwa-api-routes}

Cet exemple à lire seulement demande une course Torii nœud qui fait face à l'application RWA
les routes sont activées:

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

Si la liste est vide, le nœud peut encore prendre en charge RWA les instructions et
des demandes par d'autres moyens Torii APIs, Mais il n'expose pas le facteur facultatif JSON
la famille de route.

### Inscrivez un reçu d'entrepôt {#register-a-warehouse-receipt}

Utilisez un projet lorsqu'une action commerciale doit devenir une transaction signée.
Le numéro de la facture d'affaires entre `primary_reference`; le registre ID est
générés après les engagements de l'opération.

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

Après l'engagement de la transaction, liste générée RWA IDs. Routes de l'État en chaîne
exposer le canonique IDs; utiliser des événements ou des itinéraires d'explorateur lorsque vous
besoin de correspondre à un ID retour à `primary_reference` ou métadonnées:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Les nœuds activés par l'explorateur peuvent également retourner des projections plus riches:

```python
page = client.list_explorer_rwas_typed(domain="commodities.universal")

for lot in page.items:
    print(lot.id, lot.primary_reference, lot.owned_by, lot.quantity)
```

### Un transfert avec une retenue temporaire {#transfer-with-a-temporary-hold}

Utilisez le généré RWA ID Ce modèle suppose que
`alice` est le propriétaire et est également configuré comme contrôleur avec
`hold_enabled`.

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

Libérer la tenue lorsque le processus hors chaîne est terminé:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.release_rwa(warehouse_lot_id, quantity="5")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Ajouter des métadonnées de contrôle et d'audit {#add-controls-and-audit-metadata}

Les contrôles et les métadonnées sont séparés.
les métadonnées pour les faits que les demandes ou les auditeurs doivent afficher:

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

Quantité de rachat lorsque l'actif hors chaîne représenté a été livré,
Le lot doit avoir été déposé dans le cadre d'une procédure de répartition.
`redeem_enabled`, et le signataire doit être propriétaire ou contrôleur.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
draft.redeem_rwa(warehouse_lot_id, quantity="1")

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Le congé pendant l'examen de la conformité {#freeze-during-compliance-review}

Il y a beaucoup de congélation quand une revue hors chaîne doit bloquer les opérations des propriétaires ordinaires.
Le signataire doit être un contrôleur et le lot doit avoir `freeze_enabled`.

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

Défrichez-le lorsque l'examen est passé:

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

Une facture est représentée comme une RWA lot en conservant le numéro de facture dans
`primary_reference` Après l'enregistrement, utilisez les ID
pour le transfert et le rachat.

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

Lorsque la créance est financée ou payée, utilisez le lot de facture généré ID:

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

Rédemption du montant représenté après règlement hors chaîne:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=bob, metadata=TX_METADATA)
)
draft.redeem_rwa(invoice_lot_id, quantity="50000")

envelope = draft.sign_with_keypair(bob_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### Retraite du crédit carbone {#carbon-credit-retirement}

Utilisez le remboursement pour retirer des crédits après leur réclamation.
indique le certificat ou la preuve de registre hors chaîne:

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

### Deux lots sont fusionnés {#merge-two-lots}

La fusion des lots lorsque deux positions hors chaîne sont consolidées.
être dans le même domaine et utiliser la même spécification de quantité.
le lot d'enfants ID.

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

Pour la pleine Python exemple de transaction, voir
[Les actifs du monde réel](/fr/guide/tutorials/python.md#real-world-assets).

## Documents connexes {#related-docs}

- [Les actifs](/fr/blockchain/assets.md)
- [Les métadonnées](/fr/blockchain/metadata.md)
- [Iroha Instructions spéciales](/fr/blockchain/instructions.md)
- [Les questions](/fr/reference/queries.md#assets-nfts-and-rwas)
- [Torii points de fin](/fr/reference/torii-endpoints.md#app-and-sora-route-families)
