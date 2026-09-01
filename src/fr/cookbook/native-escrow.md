---
translation_locale: fr
translation_source: /cookbook/native-escrow.md
translation_source_hash: 576e03924f19b63681cdfafa641b996672e35a992478fc9eaf5b83f0e7baa6da
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Compte séquestre d'actif natif {#native-asset-escrow}

## Résultat {#outcome}

Choisissez entre un séquestre de marché et un verrouillage d'actif destiné, exécutez le cycle de vie actuel typé avec Rust ou Python, liez chaque tentative de verrouillage au montant restant que vous avez réellement observé, et compilez la surface de séquestre native Kotodama à partir de JavaScript.

## Prérequis {#prerequisites}

- Une définition d'actif numérique et un ouvreur/vendeur qui possède une quantité suffisante.
- Clients financés, à clé unique I105 pour chaque partie qui soumet une étape. Utilisez une intention `fee_payment` payée par une autorité en direct dont l'actif de frais correspond à la réponse actuelle du service de financement du testnet Taira ; n'intégrez pas d'ID d'actif provenant de la documentation.
- Le Rust ou Python actuel SDK du commit `0010c5a70039eac101a4846499ba9ceaf43eb65c` de Iroha.
- Pour l'exemple de compilateur JavaScript, Node.js 24 plus un paquet `@iroha/iroha-js` construit localement et son `iroha_js_host` natif ; suivez le [JavaScript SDK configuration de source-build](/fr/guide/tutorials/javascript.md#build-from-source). Les constructions pour navigateur doivent fournir `compilerUrl` au lieu de charger l'hôte natif.
- Taira doit admettre le transfert d'actifs et les instructions de séquestre. Les propriétaires d'actifs peuvent utiliser le cycle de vie ordinaire lorsque leur politique d'actifs le permet ; résoudre un litige nécessite l'autorisation globale `CanResolveEscrowDispute`. Utilisez un réseau local généré lorsque le principal d'autorisation du réseau public nécessaire est absent.

Les modèles d'entiercement du marché concernent le vendeur, l'acheteur, le paiement hors chaîne et la libération. Les verrous génériques désignent une destination et, éventuellement, un ordre d'autorisation de libération distinct ; ils prennent en charge le tirage partiel, l'annulation et l'expiration.

## Étapes {#steps}

### 1. Complétez un dépôt fiduciaire sur le marché avec Rust {#_1-complete-a-marketplace-escrow-with-rust}

Cette fonction reçoit des identifiants et des clients de type réel. Elle ouvre 40 unités, permet à l'acheteur d'accepter et de marquer le paiement hors chaîne, puis permet au vendeur de libérer la garde. Chaque soumission nomme le payeur des frais principaux d'autorisation via `FeePaymentIntent`.

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

Le compte de garde est géré par grand livre. L'octroi d'un jeton de transfert d'actif normal ne rend pas la garde active susceptible d'être vidée en dehors du cycle de vie de l'entiercement.

### 2. Ouvrir et dessiner partiellement une serrure générique avec Python {#_2-open-and-partially-draw-a-generic-lock-with-python}

Le principal d'autorisation de libération interroge l'enregistrement natif signé avant de procéder au prélèvement. La transmission de ce `remaining_amount` exact offre une concurrence optimiste : une demande parallèle obsolète est rejetée au lieu de débiter la garde deux fois.

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

Le Python SDK peut interroger automatiquement lorsque `expected_remaining_amount` est omis, mais transmettre la valeur observée rend la précondition économique signée visible dans le code de l'application.

Pour les flux de verrouillage Rust, les constructeurs actuels nécessitent également la quantité observée :

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

`DrawdownAssetLock::new` prend trois valeurs ; `CancelAssetLock::new` en prend deux. Omettre le montant restant attendu décrit une forme d'appel plus ancienne et non sécurisée.

### 3. Compiler la surface séquestre Kotodama à partir de JavaScript {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript n'a pas besoin d'inventer des instructions natives non typées. Le compilateur actuel expose les fonctions intégrées de séquestre du registre de la blockchain à Kotodama ; le déploiement et les appels suivent ensuite [Créer et déployer un contrat intelligent](./smart-contracts.md).

Enregistrez ceci sous `native_escrow.ko` :

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

Enregistrez ce qui suit sous `compile-native-escrow.mjs` et utilisez-le pour compiler exactement cette source à partir de Node.js :

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

Exécutez-le depuis l'environnement de paquet construit à partir des sources décrit dans les prérequis :

```bash
node ./compile-native-escrow.mjs
```

## Vérifier {#verify}

Pour le séquestre du marché, interrogez `FindAssetEscrowById` et les avoirs des deux parties après la libération. L'enregistrement doit être `Released`, nommer l'acheteur acceptant, et ne montrer aucune garde restante. Pour le verrou Python ci-dessus, conservez l'ID retourné et répétez la requête signée :

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

Interrogez également la détention d'actifs de la destination et confirmez qu'elle a augmenté de quatre unités. Un enregistrement de résultats du protocole de transaction sans l'enregistrement de séquestre et l'état postérieur de la destination constitue une vérification incomplète.

## Dépannage {#troubleshooting}

- `Not permitted` lors de l'ouverture signifie généralement que le principal d'autorisation ne peut pas transférer l'actif sélectionné en garde. La résolution des litiges dispose d'un portail global distinct `CanResolveEscrowDispute`.
- `expected remaining amount` le rejet est un conflit de concurrence optimiste. Interrogez à nouveau l'enregistrement, décidez si l'autre retrait/annulation était intentionnel, et signez une nouvelle instruction uniquement si le nouvel état est acceptable.
- Seul le principal d'autorisation de libération configuré peut lever un verrou de confiance. La destination ne peut pas le libérer simplement parce qu'elle recevra les fonds.
- La publication sur la place de marché n'est valide qu'après l'acceptation et l'état de paiement envoyé ; l'annulation est limitée aux états précédents du cycle de vie.
- L'expiration utilise le temps du registre blockchain autoritaire. Ne considérez pas un délai du réveil local comme une preuve que `ExpireAssetLock` passera.
- Un échec de paiement appartient à la partie soumettant cette étape du cycle de vie. Acheteur de fonds, vendeur/initié et principal d'autorisation de libération indépendamment sur Taira.

## Source et documents connexes {#source-and-related-docs}

- [Modèle d'instruction de séquestre natif à l'engagement épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)
- [Tests d'intégration de séquestre natif au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [Python méthodes client d'entiercement au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama exemple d'entiercement natif au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [Séquestre d'actifs natifs](/fr/blockchain/escrow.md)
- [Actifs fongibles](./fungible-assets.md)
- [Autorisations et rôles](./permissions-and-roles.md)
