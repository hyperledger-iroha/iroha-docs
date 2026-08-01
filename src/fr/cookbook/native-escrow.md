---
translation_locale: fr
translation_source: /cookbook/native-escrow.md
translation_source_hash: 0185b6a341ee90ed6cd52fb9f510549b20592468abe6627d3efa639c3b67d1fd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Réservation des actifs natifs {#native-asset-escrow}

## Le résultat {#outcome}

Choisissez entre une garantie de marché et un verrouillage d'actif lié à la destination, exécutez le cycle de vie typé en cours avec Rust ou Python, attachez chaque tentative de verrouillaage au montant restant que vous avez réellement observé et compilez la surface de garantie native Kotodama à partir de JavaScript.

## Conditions préalables {#prerequisites}

- Une définition numérique d'actif et un ouvreur/vendeur qui possède une quantité suffisante.
- Clients à clé unique I105 financés pour chaque partie qui soumet une étape. Utilisez une intention `fee_payment` payée par l'autorité en direct dont l'actif de redevance correspond à la réponse du robinet Taira actuel; n'incorporez pas un actif ID dans la documentation.
- Le courant Rust ou Python SDK à partir Iroha commettre `bc7114ed1c7f265a156d2100ff09e851cc95702c`.
- Pour le JavaScript l'exemple du compilateur, Node.js 24 plus une maison construite localement `@iroha/iroha-js` l'emballage et son origine `iroha_js_host`; suivre le [JavaScript SDK configuration de la construction source](/fr/guide/tutorials/javascript.md#build-from-source). Les constructions de navigateur doivent fournir `compilerUrl` au lieu de charger l'hôte.
- Taira doit admettre les instructions de transfert d'actifs et d'escroquerie. Les propriétaires d'actif peuvent utiliser le cycle de vie ordinaire lorsque leur politique en matière d'actions le permet; la résolution d'un différend nécessite l'autorisation globale `CanResolveEscrowDispute`. Utilisez un réseau local généré lorsque l'autorité publique nécessaire est absente.

Les modèles de marché sont le vendeur, l'acheteur, les paiements hors chaîne et la libération. Les serrures génériques désignent une destination et optionnellement une libération distincte autorité; ils soutiennent le retrait partiel, l'annulation et l'expiration.

## Les étapes {#steps}

### 1. Remplissez une caution sur le marché avec Rust {#_1-complete-a-marketplace-escrow-with-rust}

Cette fonction reçoit réellement typé IDs et clients. Il ouvre 40 unités, permet à l'acheteur d'accepter et de marquer le paiement hors chaîne, puis permet au vendeur de libérer la garde. Chaque soumission nomme le payeur des frais d'autorité par `FeePaymentIntent`.

```rust
use eyre::{Result, ensure};
use iroha::{
    client::Client,
    data_model::{
        isi::escrow::{
            AcceptAssetEscrow, MarkEscrowPaymentSent, OpenAssetEscrow,
            ReleaseAssetEscrow,
        },
        prelude::*,
        transaction::FeePaymentIntent,
    },
};
use iroha_crypto::Hash;

fn complete_marketplace_escrow(
    seller: &Client,
    buyer: &Client,
    escrow_id: EscrowId,
    asset_definition: AssetDefinitionId,
) -> Result<AssetEscrowRecord> {
    let fee = FeePaymentIntent::authority(Vec::new(), None);

    seller.submit_blocking(
        OpenAssetEscrow::with_evidence_hashes(
            escrow_id,
            asset_definition,
            Quantity::from(40_u64),
            vec![Hash::new("cookbook-fiat-invoice")],
        ),
        fee.clone(),
    )?;
    buyer.submit_blocking(AcceptAssetEscrow::new(escrow_id), fee.clone())?;
    buyer.submit_blocking(MarkEscrowPaymentSent::new(escrow_id), fee.clone())?;
    seller.submit_blocking(ReleaseAssetEscrow::new(escrow_id), fee)?;

    let record = seller.query_single(FindAssetEscrowById::new(escrow_id))?;
    ensure!(record.status == AssetEscrowStatus::Released);
    Ok(record)
}
```

Le compte de détention est géré par un grand livre.L'octroi d'un jeton normal de transfert d'actifs ne rend pas la détention active exploitable en dehors du cycle de vie des garanties.

### 2. ouvrir et dessiner partiellement une serrure générique avec Python {#_2-open-and-partially-draw-a-generic-lock-with-python}

L'autorité de délivrance interroge le dossier natif signé avant de le retirer. Le passage exact `remaining_amount` fournit une synchronisation optimiste: une demande parallèle périmée est rejetée au lieu d'acquérir la garde deux fois.

```python
import secrets
import time
from decimal import Decimal


def escrow_status(record):
    status = record["status"]
    if isinstance(status, dict):
        return status.get("status", status.get("kind"))
    return str(status)


def open_and_draw_lock(
    *,
    client,
    chain_id,
    opener,
    opener_private_key,
    release_authority,
    release_private_key,
    destination,
    asset_definition_id,
    fee_payment,
):
    escrow_id = f"cookbook_lock_{secrets.token_hex(12)}"

    client.open_asset_lock_and_wait(
        chain_id=chain_id,
        authority=opener,
        private_key=opener_private_key,
        fee_payment=fee_payment,
        escrow_id=escrow_id,
        asset_definition_id=asset_definition_id,
        destination=destination,
        amount="10",
        release_authority=release_authority,
        expires_at_ms=int(time.time() * 1000) + 3_600_000,
        wait=True,
    )

    before = client.get_asset_escrow(
        escrow_id=escrow_id,
        authority=release_authority,
        private_key=release_private_key,
    )
    client.drawdown_asset_lock_and_wait(
        chain_id=chain_id,
        authority=release_authority,
        private_key=release_private_key,
        fee_payment=fee_payment,
        escrow_id=escrow_id,
        amount="4",
        expected_remaining_amount=before["remaining_amount"],
        wait=True,
    )
    after = client.get_asset_escrow(
        escrow_id=escrow_id,
        authority=release_authority,
        private_key=release_private_key,
    )

    assert escrow_status(before) == "Locked"
    assert Decimal(str(before["remaining_amount"])) == Decimal("10")
    assert escrow_status(after) == "Locked"
    assert Decimal(str(after["remaining_amount"])) == Decimal("6")
    return escrow_id, after
```

Le Python SDK peut effectuer une requête automatique lorsque le `expected_remaining_amount` est omis, mais en passant la valeur observée, la condition économique signée devient visible dans le code d'application.

Pour les flux de verrouillage Rust, les constructeurs de courant exigent également la quantité observée:

```rust
let before = opener.query_single(FindAssetEscrowById::new(lock_id))?;
release_authority.submit_blocking(
    DrawdownAssetLock::new(
        lock_id,
        Quantity::from(4_u64),
        before.remaining_amount,
    ),
    FeePaymentIntent::authority(Vec::new(), None),
)?;

let current = opener.query_single(FindAssetEscrowById::new(lock_id))?;
opener.submit_blocking(
    CancelAssetLock::new(lock_id, current.remaining_amount),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

`DrawdownAssetLock::new` prend trois valeurs; `CancelAssetLock::new` prend deux. L'exclusion du montant restant attendu décrit une forme d'appel plus ancienne et dangereuse.

### 3. Compiler la surface de dépôt Kotodama à partir de JavaScript {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript n'a pas besoin d'inventer des instructions natives non typiées. Le compilateur actuel expose le cahier des charges intégré au Kotodama; déploiement et appels suivent ensuite [Construire et déployer un contrat intelligent](./smart-contracts.md).

Enregistrez ceci sous la forme `native_escrow.ko`:

```kotodama
seiyaku NativeEscrowAitai {
    error enum EscrowError {
        NonPositiveAmount = 1,
    }

    kotoage fn open_offer(
        Name offer,
        AssetDefinitionId asset_definition,
        quantity amount
    ) authorize("Admin") {
        require(amount > 0, EscrowError::NonPositiveAmount);
        ledger::escrow::open_offer(
            offer: offer,
            asset_definition: asset_definition,
            amount: amount,
        );
    }
}
```

Conserver le texte suivant sous `compile-native-escrow.mjs` et l'utiliser pour compiler cette source exacte à partir de Node.js:

```js
import { readFile } from 'node:fs/promises'
import { compileKotodamaProgram } from '@iroha/iroha-js/kotodama-compiler'

const source = await readFile('./native_escrow.ko', 'utf8')

const result = await compileKotodamaProgram(source, {
  sourceName: 'native_escrow.ko',
})
if (!result.ok) {
  throw new Error(JSON.stringify(result.diagnostics, null, 2))
}
console.log({
  codeHashHex: result.output.codeHashHex,
  entrypoints: result.output.manifest.entrypoints.map(({ name }) => name),
})
```

L'exécuter à partir de l'environnement d'emballage basé sur la source décrit dans les conditions préalables:

```bash
node ./compile-native-escrow.mjs
```

## Vérifiez {#verify}

Pour l'escrow sur le marché, la requête `FindAssetEscrowById` et les détentions d'actifs des deux parties après libération. L'enregistrement doit être `Released`, nommer l'acheteur acceptant et ne pas montrer de garde restante. Pour la serrure Python ci-dessus, conservez le retourné ID et répétez la requête signée:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

Demandez également la détention d'actifs de la destination et confirmez qu'elle a augmenté de quatre unités. Un reçu de transaction sans enregistrement d'escrow et post-état de destination est une vérification incomplète.

## Résolution des problèmes {#troubleshooting}

- `Not permitted` l'ouverture signifie habituellement que l'autorité ne peut pas transférer l'actif sélectionné en détention. La résolution des litiges a un système mondial distinct `CanResolveEscrowDispute` La porte.
- Le refus `expected remaining amount` est un conflit optimiste-concurrence. Requérir le dossier, décider si l'autre retrait/annulation était prévu et signer une nouvelle instruction seulement si la nouvelle condition est acceptable.
- Seule l'autorité de libération configurée peut dessiner un verrou de confiance. Le destinataire ne peut pas le relâcher simplement parce qu'il recevra les fonds.
- La libération sur le marché n'est valable qu'après l'acceptation et l'envoi du paiement; l'annulation est limitée aux premiers états de cycle de vie.
- L'expiration utilise un temps de registre autorisé. Ne traitez pas d'un délai local à l'horloge murale comme une preuve que `ExpireAssetLock` passera.
- Un défaut de redevance appartient à la partie qui soumet cette étape du cycle de vie: acheteur, vendeur/ouvreur de fonds et autorisation de libération indépendamment sur Taira.

## Sources et documents connexes {#source-and-related-docs}

- [Modèle d'instruction en escrow native à l'obligation fixée](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/isi/escrow.rs)
- [Tests d'intégration en escrow native à l'engagement fixé](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/native_escrow.rs)
- [Python méthodes de fidélisation du client à l'obligation fixée](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama échantillon d'escrow natif à l'impôt fixé](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [Réserve des actifs natifs ](/fr/blockchain/escrow.md)
- [Les actifs fonciers](./fungible-assets.md)
- [Autorisations et rôles ](./permissions-and-roles.md)
