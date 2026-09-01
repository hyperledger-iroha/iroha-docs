---
translation_locale: fr
translation_source: /guide/tutorials/python.md
translation_source_hash: d0ecbade221ceba455730e80c6e12db930c65a4cbcf9e643c1c2d4cba47b0940
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Python {#python}

Le Python SDK dans l'espace de travail en amont est `iroha-python`. La première version Iroha 3 cible les surfaces Torii et Norito actuelles. Épinglez la version du paquet ou la révision source utilisée par votre intégration afin que le SDK et le nœud restent sur la même révision du format de sérialisation.

Les exemples de lecture anonymes ci-dessous ciblent le public Taira à `https://taira.sora.org`. Un itinéraire peut être en lecture seule et nécessiter malgré tout une signature de compte canonique ou une signature d'opérateur de réseau exact ; ces exemples sont marqués séparément. Les exemples de mutation sont des modèles de transaction et nécessitent un véritable principal d'autorisation Taira, une clé privée, une intention de paiement de frais typée, suffisamment de XOR sur le réseau de test, et l'authentification requise par la route cible avant qu'ils ne puissent être soumis.

Utilisez les exemples dans cet ordre :

|Stage|Faire campagne contre le public Taira ?|Ce dont vous avez besoin|
| --------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
|Appels lus anonymes|Oui| Python package plus accès au réseau|
|Lectures authentifiées par compte ou opérateur|Seulement avec votre identité reconnue|Le `NetworkId` exact de Taira et la clé de compte ou d'opérateur correspondante|
|Constructeurs de signatures et d'instructions locales|Aucun appel réseau jusqu'à `submit()`|Extension native et votre matériel de clé|
|Transactions et appels de service modifiants|Seulement avec votre propre compte financé|Compte d’autorité, clé privée, `NetworkId` exact de Taira, intention de frais typée, solde de l’actif de frais et jetons de route|
|Connecter les codecs de trame, la crypto et les assistants GPU|Local uniquement|Extension native ; les assistants GPU ont également besoin d’un backend capable de CUDA|

## Installer {#install}

Le nom des métadonnées du paquet est `iroha-python`. Ne supposez pas qu'une installation non fixée de PyPI corresponde au réseau en direct Taira. Installez une copie fonctionnelle sous forme de wheel ou de code source qui a été construite à partir de la même révision en amont que celle ciblée par votre intégration :

```bash
python -m pip install /path/to/iroha_python-*.whl
```

Si votre projet utilise directement l’espace de travail source, installez les dépendances Python et compilez l’extension native avant d’exécuter les exemples qui emploient `Instruction`, `TransactionDraft`, la signature, la cryptographie, les assistants natifs de SoraFS ou du GPU, ou encore les codecs de trames Connect. Utilisez la commande de compilation indiquée dans le fichier source `python/iroha_python/README.md`, puis vérifiez que les exportations natives se chargent :

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

Si `create_torii_client` s'importe mais que `Instruction` ou `generate_ed25519_keypair` échoue, le paquet pur Python est disponible mais l'extension native ne l'est pas.

## Démarrage rapide {#quickstart}

Commencez avec des points de terminaison publics en lecture seule Taira API :

```python
from iroha_python import (
    create_torii_client,
)

client = create_torii_client("https://taira.sora.org")

# Public reads do not need an authority or private key.
status = client.request_json("GET", "/status", expected_status=(200,))
accounts = client.list_accounts_typed(limit=5)

print(status["build"]["version"])
for account in accounts.items:
    print(account.id)
```

## Configuration partagée {#shared-setup}

Utilisez cette configuration pour les modèles mutables. Remplacez chaque espace réservé par un principal d'autorisation Taira, une clé privée, un jeton et des identifiants d'actifs/comptes de votre déploiement avant de soumettre.

`authority` est le compte qui signe la transaction et `private_key` doit correspondre. Les transactions sont liées au `NetworkId` dérivé du genèse exact de Taira ; la chaîne UUID est une étiquette de déploiement, pas une identité de transaction. Les frais utilisent un type de paiement spécifié et un devis en direct exact, indépendamment des métadonnées de l'application. Les espaces réservés pour le compte et la clé ci-dessous sont intentionnellement invalides afin qu'ils ne soient pas soumis par accident.

Le littéral ci-dessous est l'identité génésique Taira actuellement épinglée de la blockchain. Une réinitialisation du testnet peut la modifier, donc actualisez-la à partir du profil de déploiement signé et ne l'inférez jamais à partir de la chaîne UUID.

```python
from iroha_python import (
    Ed25519KeyPair,
    Instruction,
    LocalSigningContext,
    NetworkId,
    ToriiClient,
    ToriiCanonicalRequestAuth,
    TransactionConfig,
    TransactionDraft,
    authority_fee_payment,
)

TORII_URL = "https://taira.sora.org"
TAIRA_NETWORK_ID = NetworkId.parse(
    "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"
)
AUTH_TOKEN = None

# Replace these placeholders with the real signing keys for your accounts.
alice_pair = Ed25519KeyPair.from_private_key(bytes.fromhex("<alice-private-key-hex>"))
bob_pair = Ed25519KeyPair.from_private_key(bytes.fromhex("<bob-private-key-hex>"))

# The authority string must identify the same account as the private key.
alice = "<alice-account-id>"
bob = "<bob-account-id>"

canonical_auth = ToriiCanonicalRequestAuth(
    network_id=TAIRA_NETWORK_ID.literal,
    account_id=alice,
    signer=alice_pair.sign,
)

ROSE_DEFINITION = "rose#wonderland"
ROSE_ASSET = "<rose-asset-id>"
BADGE_NFT = "badge$wonderland"

APP_METADATA = {"source": "python-docs"}
# Torii replaces the empty maxima with an exact, validated live fee quote before
# anything is signed. The payer remains the transaction authority.
BASE_FEE_PAYMENT = authority_fee_payment(charge_limits=[])

client = ToriiClient(
    TORII_URL,
    local_signing_context=LocalSigningContext(TAIRA_NETWORK_ID),
    canonical_request_auth=canonical_auth,
    auth_token=AUTH_TOKEN,
)


def submit(*instructions):
    draft = TransactionDraft(
        TransactionConfig(
            network_id=TAIRA_NETWORK_ID,
            authority=alice,
            fee_payment=BASE_FEE_PAYMENT,
            metadata=APP_METADATA,
        )
    )
    draft.extend_instructions(instructions)

    # Freeze one payload, obtain its exact fee limits, and sign that same payload.
    envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
    status = client.submit_transaction_envelope_and_wait(envelope)
    return envelope, fee_quote, status
```

`Instruction.*` appelle uniquement des charges utiles d’instruction de construction. `submit()` est le point où SDK obtient l’estimation en direct du prix des frais, signe la charge utile exacte cotée, l’envoie à Torii et attend un statut.

## Frais et coût d'exécution des transactions {#fees-and-gas}

Les écritures nécessitent un `FeePaymentIntent` typé et un solde d'actifs de frais financé. Sur Taira, le service de financement du testnet public finance le testnet XOR. Le Python SDK envoie le montant fixe non signé charge utile à Torii pour une estimation exacte du prix des frais, valide que le devis n'a pas remplacé le payeur ou la charge utile, et signe l'intention cotée. Ne mettez pas la sélection des frais dans les métadonnées de la transaction.

L'assistant `submit()` ci-dessus commence avec une intention payée par l'autorité dont les limites de charge sont volontairement vides. `quote_and_sign()` les remplit à partir du devis en direct avant la signature :

```python
draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=authority_fee_payment(charge_limits=[]),
        metadata={"source": "python-fee-example"},
    )
)
draft.add_instruction(
    Instruction.set_account_key_value(
        alice,
        "python_fee_example",
        "ready",
    )
)
envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
status = client.submit_transaction_envelope_and_wait(envelope)

for limit in fee_quote["intent"]["value"]["charge_limits"]:
    print(limit["asset_definition_id"], limit["max_amount"])
```

Avant d'envoyer des écritures, assurez-vous que le compte principal d'autorisation possède suffisamment de l'actif de frais. Le service exact de financement du testnet et l'ID de l'actif dépendent du réseau ; voici la forme Taira :

```python
FEE_ASSET_DEFINITION = "6TEAJqbb8oEPmLncoNiMRbLEK6tw"
# The faucet returns the concrete account asset ID to check here.
FEE_ASSET_ID = "<fee-asset-id-from-faucet-response>"

# Fail before submitting if the signer cannot pay gas.
fee_assets = client.list_account_assets_typed(
    alice,
    limit=10,
    asset_id=FEE_ASSET_ID,
)
if not fee_assets.items:
    raise RuntimeError("fund the authority account with the Taira fee asset first")
```

Le service de financement du testnet renvoie le `asset_id` concret à utiliser pour la vérification du solde. Vérifiez que le devis en direct facture `FEE_ASSET_DEFINITION` ; la transaction ne sélectionne pas cet actif via les métadonnées.

Les métadonnées de l'application sont facultatives et n'ont aucune sémantique de frais :

```python
APP_METADATA = {"source": "python-docs"}

draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=BASE_FEE_PAYMENT,
        metadata=APP_METADATA,
    )
)
```

Si vous omettez l'intention de frais, acceptez un devis pour un actif inattendu, modifiez la charge utile après avoir fait un devis ou signez avec un compte non financé, la transaction ne doit pas être soumise.

## Anonyme Taira Lit {#anonymous-taira-reads}

Ces appels utilisent des routes Taira dont la limite de catalogue permet des lectures anonymes :

```python
client = create_torii_client("https://taira.sora.org")

# Use raw requests for endpoints that do not need a typed wrapper.
status = client.request_json("GET", "/status", expected_status=(200,))
parameters = client.request_json("GET", "/v1/parameters", expected_status=(200,))

# Typed helpers parse pagination and records into dataclasses.
accounts = client.list_accounts_typed(limit=1)
domains = client.list_domains_typed(limit=1)
definitions = client.list_asset_definitions_typed(limit=1)

# These calls inspect live node subsystems without mutating state.
time_now = client.get_time_now()

print(status["build"]["version"])
print(parameters["sumeragi"]["block_cadence_ms"])
print(accounts.total, domains.total, definitions.total)
print(time_now.now_ms)
```

`/v1/time/status` et chaque `/v1/sumeragi/*` vue de données ponctuelle de l'opérateur nécessitent une signature exacte de l'opérateur réseau même s'ils ne modifient pas l'état. Utilisez `request_json("GET", "/status")` pour le nœud anonyme charge utile de statut et la configuration de l'opérateur ci-dessous pour le consensus ou le diagnostic de l'horloge locale du nœud. Le statut de la session de connexion est une route de protocole distincte et nécessite le jeton de gestion de cette session.

## Constructeurs d'instructions {#instruction-builders}

Le SDK expose des constructeurs typés pour les familles d'instructions les plus courantes et une trappe de sortie JSON pour les variantes qui ne sont pas encore des méthodes Python de première classe. Les extraits suivants sont des modèles de transactions mutantes et n'ont pas été soumis au Taira public sans un compte signataire.

Préférez les assistants typés lorsqu'ils existent : ils normalisent les valeurs Python et échouent rapidement en cas de formes invalides. Utilisez `Instruction.from_json` uniquement lorsque vous avez besoin d'une variante d'instruction qui ne dispose pas encore d'un assistant Python.

|Famille d'instructions| Python surface|
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|S'inscrire| `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger` ; `register_domain` est réservé aux outils de genèse/bootstrap|
|Se désinscrire| `unregister_trigger` ; utilisez `Instruction.from_json` pour d'autres variantes|
|Créer/Brûler| `mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions`                                                                                          |
|Transfert| `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa`                                                              |
|Métadonnées et contrôles| `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value`                                                                        |
| RWA cycle de vie| `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa`|
| ExecuteTrigger | `execute_trigger` |
|Extensions de dépôt/règlement| `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp`                                                                                                      |
|Verrouillages d'actifs natifs| `open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, plus les aides clients `*_and_wait`|
|Accorder/Révoquer, SetParameter, Journal, Personnalisé, Mettre à jour, et des variantes moins courantes d'enregistrement/désenregistrement| `Instruction.from_json` ou `TransactionBuilder.add_instruction_json` avec canonique `InstructionBox` JSON |

Pour les paiements conditionnels de type escrow, voir [Compte séquestre d'actif natif](/fr/blockchain/escrow.md#python-asset-locks). Python expose actuellement des aides de première classe pour les verrous d'actifs génériques ; les aides pour les places de marché et les escrow anonymes ne sont pas encore des méthodes de première classe Python.

### Configurer les domaines, puis enregistrer les comptes et les actifs {#set-up-domains-then-register-accounts-and-assets}

La création de domaine ordinaire passe par le planificateur d'alias déclaratif, de sorte que le bail SNS, les capacités du propriétaire, la protection du devis et l'état du domaine sont vérifiés ensemble. Créez une intention `AliasSetupPlanRequestV1` sans secret avec votre SDK ou service d'intégration, puis utilisez `iroha app alias setup plan` et `iroha app alias setup apply`. Ne soumettez pas `Instruction.register_domain` depuis une transaction d'application ; ce générateur reste pour les outils de génération/bootstrap.

Après que le plan de configuration du domaine est validé, enregistrez les objets appartenant au domaine. Sur un réseau partagé tel que Taira, utilisez un domaine et un espace de noms de compte qui vous sont attribués.

```python
# The domain and its SNS lease already exist before this transaction.
submit(
    Instruction.register_account(alice, {"display_name": "Alice"}),
    Instruction.register_account(bob, {"display_name": "Bob"}),
    Instruction.register_asset_definition_numeric(
        ROSE_DEFINITION,
        owner=alice,
        scale=2,
        mintable="Infinitely",
        confidential_policy="TransparentOnly",
        metadata={"symbol": "ROS"},
    ),
)
```

`mintable` accepte les valeurs `Infinitely`, `Once`, `Not` ou `Limited(n)` acceptées par le modèle de données. Omettez `scale` pour un actif numérique non contraint.

### émission, brûler et transférer des actifs {#mint-burn-and-transfer-assets}

Ces appels utilisent un ID d'actif existant. Enregistrez d'abord la définition de l'actif, puis construisez l'ID d'actif concret pour le compte qui possède l'actif.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### Transférer la propriété {#transfer-ownership}

Les transferts de propriété changent la personne qui contrôle le domaine, la définition de l'actif ou NFT. Utilisez le propriétaire actuel comme principal d'autorisation de la transaction.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### Définir et Supprimer les Métadonnées {#set-and-remove-metadata}

Les valeurs des métadonnées doivent être sérialisables JSON. Lorsque vous utilisez `TransactionDraft`, le principal d'autorisation dans `TransactionConfig` devient le compte cible par défaut.

```python
# Values are encoded as JSON metadata under the target account.
submit(
    Instruction.set_account_key_value(
        alice,
        "profile",
        {"display_name": "Alice", "tier": "operator"},
    )
)

# Removing the key deletes the metadata entry from the account.
submit(Instruction.remove_account_key_value(alice, "profile"))
```

L'assistant de projet de haut niveau cible par défaut le principal d'autorisation de transaction :

```python
draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=BASE_FEE_PAYMENT,
        metadata=APP_METADATA,
    )
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### Actifs du monde réel {#real-world-assets}

Les assistants RWA utilisent des charges utiles sérialisables en JSON pour les métadonnées propres aux actifs, la provenance et la politique du contrôleur. `register_rwa` n’accepte ni `id` ni `owner` : l’environnement d’exécution génère le `RwaId`, et l’autorité de la transaction devient le propriétaire initial.

```python
draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=BASE_FEE_PAYMENT,
        metadata=APP_METADATA,
    )
)

# Register the lot in a domain. Store business identifiers in primary_reference
# or metadata, then query the generated RWA ID after the transaction commits.
draft.register_rwa(
    {
        "domain": "commodities.universal",
        "quantity": "100",
        "spec": {"scale": 0},
        "primary_reference": "warehouse-receipt-001",
        "status": "active",
        "metadata": {
            "commodity": "copper",
            "warehouse": "DXB-01",
        },
        "parents": [],
        "controls": {
            "controller_accounts": [alice],
            "controller_roles": [],
            "freeze_enabled": True,
            "hold_enabled": True,
            "force_transfer_enabled": True,
            "redeem_enabled": True,
        },
    }
)
```

Après la validation de la transaction d'inscription, utilisez `FindRwas`, `/v1/rwas`, un événement RWA ou le chemin de l'explorateur configuré pour découvrir l'ID généré :

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Les opérations suivantes utilisent l'ID `hash$domain` généré :

```python
registered_rwa_id = (
    "0123456789abcdef0123456789abcdef"
    "0123456789abcdef0123456789abcdef$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(
        network_id=TAIRA_NETWORK_ID,
        authority=alice,
        fee_payment=BASE_FEE_PAYMENT,
        metadata=APP_METADATA,
    )
)

# Transfer, hold, release, freeze, and redeem model the lot lifecycle.
draft.transfer_rwa(
    registered_rwa_id,
    quantity="10",
    destination=bob,
)
draft.hold_rwa(registered_rwa_id, quantity="5")
draft.release_rwa(registered_rwa_id, quantity="5")
draft.freeze_rwa(registered_rwa_id)
draft.unfreeze_rwa(registered_rwa_id)
draft.redeem_rwa(registered_rwa_id, quantity="1")

# RWA metadata and controls are separate from account metadata.
draft.set_rwa_key_value(registered_rwa_id, "auditor", "alice")
draft.remove_rwa_key_value(registered_rwa_id, "auditor")
draft.set_rwa_controls(
    registered_rwa_id,
    {
        "controller_accounts": [alice],
        "controller_roles": [],
        "freeze_enabled": True,
        "hold_enabled": True,
        "force_transfer_enabled": True,
        "redeem_enabled": True,
    },
)

# Merge consumes quantities from parent lots with the same domain and spec. The
# child lot gets a generated ID.
draft.merge_rwas(
    {
        "parents": [
            {"rwa": registered_rwa_id, "quantity": "40"},
            {
                "rwa": "fedcba9876543210fedcba9876543210"
                "fedcba9876543210fedcba9876543210$commodities.universal",
                "quantity": "60",
            },
        ],
        "primary_reference": "warehouse-receipt-003",
        "status": "merged",
        "metadata": {"merge_reason": "same custodian and quality grade"},
    }
)

# Force transfer requires a configured controller and force_transfer_enabled.
draft.force_transfer_rwa(
    registered_rwa_id,
    quantity="1",
    destination=bob,
)
```

Les transferts complets peuvent modifier `owned_by` sur le lot existant. Les transferts partiels et les fusions créent des lots enfants générés.

### Déclencheurs {#triggers}

Utilisez les assistants d’enregistrement de déclencheur lorsque l’exécutable est une autre séquence d’instructions :

```python
# The trigger executable is just another instruction payload.
reward = Instruction.mint_asset_numeric(ROSE_ASSET, "1")

# Time triggers run on a schedule once registered.
register_hourly = Instruction.register_time_trigger(
    "hourly_reward",
    alice,
    [reward],
    start_ms=1_800_000_000_000,
    period_ms=3_600_000,
    repeats=24,
    metadata={"purpose": "docs"},
)
submit(register_hourly)

# Precommit triggers run during the transaction pipeline.
register_precommit = Instruction.register_precommit_trigger(
    "precommit_reward",
    alice,
    [reward],
    repeats=10,
    metadata={"purpose": "pipeline test"},
)
submit(register_precommit)

# Trigger execution and repetition changes are also transactions.
submit(Instruction.execute_trigger("hourly_reward", args={"reason": "manual"}))
submit(Instruction.mint_trigger_repetitions("hourly_reward", 5))
submit(Instruction.burn_trigger_repetitions("hourly_reward", 1))
submit(Instruction.unregister_trigger("hourly_reward"))
```

Torii expose également les aides REST pour l'inventaire des déclencheurs :

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

Les appels d'inventaire de déclencheurs lisent ou inspectent uniquement les enregistrements de déclencheurs. L'enregistrement, l'exécution, les modifications de répétition et la désinscription sont des opérations de mutation.

### Instructions de dépôt et de règlement {#repo-and-settlement-instructions}

Les aides de dépôt et de règlement bilatéral ajoutent des variantes d'instructions spécifiques au domaine sans créer manuellement des charges utiles Norito :

```python
from iroha_python import (
    RepoCashLeg,
    RepoCollateralLeg,
    RepoGovernance,
    SettlementAtomicity,
    SettlementExecutionOrder,
    SettlementLeg,
    SettlementPlan,
)

config = TransactionConfig(
    network_id=TAIRA_NETWORK_ID,
    authority=alice,
    fee_payment=BASE_FEE_PAYMENT,
    # Keep repo and settlement examples bounded by a short TTL.
    ttl_ms=120_000,
    metadata=APP_METADATA,
)
draft = TransactionDraft(config)

# Each repo leg describes one side of the financing agreement.
cash = RepoCashLeg(asset_definition_id="usd#wonderland", quantity="1000")
collateral = RepoCollateralLeg(
    asset_definition_id="bond#wonderland",
    quantity="1050",
    metadata={"isin": "ABC123"},
)
governance = RepoGovernance(haircut_bps=1500, margin_frequency_secs=86_400)

# Domain-specific draft methods append the corresponding instructions.
draft.repo_initiate(
    agreement_id="daily_repo",
    initiator=alice,
    counterparty=bob,
    cash_leg=cash,
    collateral_leg=collateral,
    rate_bps=250,
    maturity_timestamp_ms=1_704_000_000_000,
    governance=governance,
)
draft.repo_margin_call("daily_repo")
# Unwind uses the immutable counterparties, legs, and maturity stored on-chain.
draft.repo_unwind("daily_repo")

# DVP/PVP settlement plans encode ordering and atomicity for both legs.
delivery = SettlementLeg(
    asset_definition_id="bond#wonderland",
    quantity="10",
    from_account=alice,
    to_account=bob,
    metadata={"isin": "ABC123"},
)
payment = SettlementLeg(
    asset_definition_id="usd#wonderland",
    quantity="1000",
    from_account=bob,
    to_account=alice,
)
plan = SettlementPlan(
    order=SettlementExecutionOrder.PAYMENT_THEN_DELIVERY,
    atomicity=SettlementAtomicity.ALL_OR_NOTHING,
)

draft.settlement_dvp(
    settlement_id="trade_dvp",
    delivery_leg=delivery,
    payment_leg=payment,
    plan=plan,
    metadata={"desk": "rates"},
)
draft.settlement_pvp(
    settlement_id="trade_pvp",
    primary_leg=payment,
    counter_leg=delivery,
)

envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
client.submit_transaction_envelope_and_wait(envelope)
```

### JSON Trappe de secours {#json-escape-hatch}

Lorsqu'un assistant Python n'est pas disponible, alimentez le modèle de données canonique `InstructionBox` JSON dans `Instruction.from_json`. C'est le chemin recommandé pour `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, enregistrement pair/rôle/NFT, et variantes de désenregistrement non déclencheuses jusqu'à ce que ces assistants soient tapés.

```python
from iroha_python import Instruction

# Copy this payload from Rust/CLI tooling or from a pinned data-model schema.
instruction_box_json = """
{
  "<InstructionVariant>": {
    "...": "..."
  }
}
"""

instruction = Instruction.from_json(instruction_box_json)
submit(instruction)
```

Maintenez le chemin de brouillon tapé à la frontière de la transaction : cela préserve exactement le `NetworkId`, l'intention de paiement des frais et l'invariant de devis avant signature. L'utilisation directe de `TransactionBuilder` nécessite les mêmes valeurs plus une validation explicite d'un devis en cours, donc ce n'est pas un raccourci pour le code de l'application.

Pour les instructions générées ou opaques, effectuez un aller-retour via JSON avant de stocker les artefacts de test :

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## Flux de travail des transactions {#transaction-workflows}

Utilisez `TransactionDraft` pour les applications qui créent plusieurs instructions avant de signer. Un brouillon vous permet de conserver les paramètres au niveau de la transaction tels que `ttl_ms`, `nonce`, et les métadonnées au même endroit, puis de signer une seule fois :

```python
config = TransactionConfig(
    network_id=TAIRA_NETWORK_ID,
    authority=alice,
    fee_payment=BASE_FEE_PAYMENT,
    # TTL and nonce are transaction-level properties shared by all instructions.
    ttl_ms=120_000,
    nonce=1,
    metadata=APP_METADATA,
)

draft = TransactionDraft(config)
# Draft methods append instructions but do not submit anything yet. Domain
# setup is a separate alias-planner flow and has already committed here.
draft.register_account(bob, metadata={"role": "user"})
draft.register_asset_definition(
    ROSE_DEFINITION,
    owning_domain=None,
    balance_scope_policy="Global",
    name="Rose",
    scale=2,
    mintable="Infinitely",
)
draft.mint_asset_quantity(ROSE_ASSET, "100")
draft.transfer_asset_quantity(ROSE_ASSET, "25", bob)

# Quoting freezes the draft, validates exact fee limits, and signs that payload.
envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
receipt = client.submit_transaction_envelope(envelope)
status = client.wait_for_transaction_status(envelope.hash_hex(), timeout=30)
print(receipt, status)
```

Exporter un manifeste technique déterministe pour examen, audit ou transfert de portefeuille :

```python
import json
from pathlib import Path

# Manifests are review artifacts; they are not submitted by themselves.
manifest = draft.to_manifest_dict(include_creation_time=True)
print(json.dumps(manifest, indent=2))

Path("transaction_manifest.json").write_text(
    draft.to_manifest_json(indent=2, include_creation_time=True),
    encoding="utf-8",
)
```

Joignez une preuve de confidentialité de la voie avant de signer lorsque la voie cible l’exige :

```python
# Attach the proof before signing so it is covered by the transaction hash.
draft.add_lane_privacy_merkle_proof(
    commitment_id=7,
    leaf=bytes.fromhex("aa" * 32),
    leaf_index=3,
    audit_path=[bytes.fromhex("bb" * 32), bytes.fromhex("cc" * 32)],
    proof_backend="halo2/ipa",
    proof_bytes=b"...proof bytes...",
    verifying_key_name="lane_privacy_vk",
)
envelope, fee_quote = draft.quote_and_sign(client, alice_pair.private_key)
```

## Requêtes {#queries}

Les assistants de requête typés renvoient des dataclasses au lieu de dictionnaires bruts JSON. Ils sont le moyen le plus simple de commencer car le SDK analyse la pagination et les champs d'enregistrement courants pour vous :

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.list_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Utilisez les assistants de requête génériques lorsqu'un point de terminaison Torii API n'a pas encore d'adaptateur logiciel typé :

```python
from urllib.request import Request, urlopen

# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))

# Prometheus exposition is served at `/metrics` when telemetry is `extended`
# or `full`; it is text, not a `/v1` JSON resource.
request = Request(f"{TORII_URL}/metrics", headers={"Accept": "text/plain"})
with urlopen(request, timeout=5) as response:
    metrics = response.read().decode("utf-8")
```

Les assistants d'inventaire de compte nécessitent un identifiant de compte accepté par le normaliseur de SDK. Utilisez les identifiants de compte I105 canoniques ou les alias on-chain ; si un explorateur de blocs ou un endpoint brut API renvoie un ID que SDK rejette, résolvez-le en un ID de compte canonique avant d'appeler ces helpers :

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## Événements {#events}

Les assistants de streaming décodent par défaut les charges utiles JSON. Passez `with_metadata=True` lorsque vous avez besoin du nom d'événement SSE, de l'identifiant, de l'indication de nouvelle tentative et de la charge utile brute. Le flux canonique `/v1/events/sse` est en direct uniquement : il n'émet aucun identifiant de lecture et ne conserve aucun journal de lecture, donc ces assistants n'exposent aucun curseur ni argument de reprise. Une reconnexion démarre un nouvel abonnement et peut comporter un intervalle ; utilisez `/v1/blocks/stream` à partir d'une hauteur connue lorsque l'historique complet du registre de la blockchain est requis. Ces exemples attendent des événements en direct, donc exécutez-les sur un nœud où le flux est activé et actif.

```python
from iroha_python import DataEventFilter, SseStreamError

# Narrow the stream to proof events with the expected backend and proof hash.
proof_filter = DataEventFilter.proof(
    backend="halo2/ipa",
    proof_hash_hex="deadbeef" * 8,
)

try:
    for event in client.stream_events(filter=proof_filter, with_metadata=True):
        print(event.id, event.event, event.data)
        break
except SseStreamError as error:
    print(error.code, error.dropped_messages, error.replay_available)

for event in client.stream_trigger_events(trigger_id="hourly_reward"):
    print(event)
    break

for tx_event in client.stream_pipeline_transactions(status="Queued"):
    print(tx_event)
    break
```

## Clés et adresses {#keys-and-addresses}

Le SDK expose des assistants de signature locaux pour chaque algorithme de signature compilé dans l'extension native. Ces assistants n'appellent pas Taira, mais ils nécessitent l'extension native :

```python
from iroha_python import (
    ED25519_ALGORITHM,
    derive_confidential_keyset_from_hex,
    derive_keypair_from_seed,
    hash_blake2b_32,
    verify,
)
from iroha_python.address import AccountAddress

# Key derivation and signing are local; no network call is made here.
ed_pair = derive_keypair_from_seed(b"alice", ED25519_ALGORITHM)
signature = ed_pair.sign(b"payload")
assert verify(ED25519_ALGORITHM, ed_pair.public_key, b"payload", signature)

# Canonical AccountId/I105 identity is derived only from the controller key.
# This constructor currently requires `domain`; canonical identity ignores it
# and AccountAddress.from_account emits a domainless address.
address = AccountAddress.from_account(domain="wonderland", public_key=ed_pair.public_key)
print(address.canonical_hex())
print(address.to_i105(0x02F1))

# Confidential key helpers derive local viewing/spending material.
confidential = derive_confidential_keyset_from_hex("01" * 32)
print(confidential.as_hex())
print(hash_blake2b_32(b"payload").hex())
```

Utilisez `supported_crypto_algorithms()` pour voir ce que votre roue prend en charge. Les aides génériques utilisent des étiquettes d'algorithmes canoniques et fonctionnent pour Ed25519, secp256k1, ML-DSA, GOST, BLS et SM2 lorsque ces algorithmes sont compilés :

```python
from iroha_python import (
    CryptoKeyPair,
    derive_keypair_from_seed,
    load_keypair,
    parse_private_key_multihash,
    parse_public_key_multihash,
    private_key_multihash,
    public_key_multihash,
    sign,
    supported_crypto_algorithms,
    verify,
)

message = b"iroha multi-algorithm signing"

# Iterate the algorithms compiled into the installed native extension.
for algorithm in supported_crypto_algorithms():
    keypair = derive_keypair_from_seed(f"docs:{algorithm}".encode(), algorithm)
    signature = keypair.sign(message)

    # Both the object method and the generic helper verify the same signature.
    assert keypair.verify(message, signature)
    assert verify(algorithm, keypair.public_key, message, signature)

    # Loading a private key should reconstruct the same public key.
    loaded = load_keypair(keypair.private_key, algorithm)
    assert loaded.public_key == keypair.public_key
    assert sign(algorithm, loaded.private_key, message) != b""

    # Prefixed multihashes carry the algorithm label with the key bytes.
    public_multihash = public_key_multihash(
        algorithm,
        keypair.public_key,
        prefixed=True,
    )
    private_multihash = private_key_multihash(
        algorithm,
        keypair.private_key,
        prefixed=True,
    )

    public_algorithm, public_key = parse_public_key_multihash(public_multihash)
    private_algorithm, private_key = parse_private_key_multihash(private_multihash)
    restored = CryptoKeyPair.from_private_key_multihash(private_multihash)

    # Round-trip checks catch mismatched algorithm labels or key encodings.
    assert public_algorithm == algorithm
    assert public_key == keypair.public_key
    assert private_algorithm == algorithm
    assert private_key == keypair.private_key
    assert restored == keypair
```

### Cryptographie chinoise SM {#chinese-sm-cryptography}

Le Python SDK expose à la fois des assistants génériques SM2 et des assistants de commodité spécifiques à SM2. Utilisez la publicité de capacité du nœud pour choisir l'identifiant distinctif SM2 attendu par le réseau cible :

```python
from iroha_python import (
    SM2_ALGORITHM,
    SM2_DEFAULT_DISTINGUISHED_ID,
    derive_keypair_from_seed,
    derive_sm2_keypair_from_seed,
    sign,
    sign_sm2,
    verify,
    verify_sm2,
)

capabilities = client.get_node_capabilities_typed(canonical_auth=canonical_auth)
sm = capabilities.crypto.sm if capabilities.crypto else None
# Use the node's default SM2 distinguishing ID when the node advertises one.
distid = sm.sm2_distid_default if sm else SM2_DEFAULT_DISTINGUISHED_ID

# The SM2-specific helper accepts the distinguishing ID explicitly.
pair = derive_sm2_keypair_from_seed(bytes.fromhex("11" * 32), distid=distid)
message = b"iroha-sm2-example"
signature = pair.sign(message)

assert pair.verify(message, signature)
assert verify_sm2(pair.public_key, message, signature, distid=distid)
assert sign_sm2(pair.private_key, message, distid=distid) != b""

# The generic API works when you only need the canonical `sm2` label.
generic_pair = derive_keypair_from_seed(bytes.fromhex("22" * 32), SM2_ALGORITHM)
generic_signature = sign(SM2_ALGORITHM, generic_pair.private_key, message)
assert verify(SM2_ALGORITHM, generic_pair.public_key, message, generic_signature)

print(pair.public_key_sec1_hex)
print(pair.public_key_multihash)
```

`crypto.sm.enabled` vous indique si le nœud accepte les algorithmes de la famille SM dans sa politique actuelle. La même annonce inclut la politique de hachage cryptographique SM et l’état de l’accélération, ce qui est utile pour décider s’il faut activer les flux spécifiques à SM2 :

```python
capabilities = client.get_node_capabilities_typed(canonical_auth=canonical_auth)

# `enabled` is the submit-time policy flag, not just local SDK support.
if capabilities.crypto and capabilities.crypto.sm.enabled:
    sm = capabilities.crypto.sm
    print(sm.default_hash)
    print(sm.allowed_signing)
    print(sm.acceleration.policy)
else:
    print("SM crypto is not enabled by this node")
```

Traitez la charge utile de capacité authentifiée comme faisant autorité pour le nœud déployé. Ne soumettez pas de transaction signée SM2 sauf si `crypto.sm.enabled` est vrai et si la politique de signature annoncée le permet.

### GOST et clés post-quantiques {#gost-and-post-quantum-keys}

Utilisez la crypto générique API pour les ensembles de paramètres GOST R 34.10-2012 et ML-DSA (`ml-dsa`) de signatures post-quantiques. Le même objet de paire de clés gère la signature, la vérification et l'exportation multihash :

```python
from iroha_python import (
    GOST_3410_2012_256_PARAMSET_A_ALGORITHM,
    GOST_3410_2012_256_PARAMSET_B_ALGORITHM,
    GOST_3410_2012_256_PARAMSET_C_ALGORITHM,
    GOST_3410_2012_512_PARAMSET_A_ALGORITHM,
    GOST_3410_2012_512_PARAMSET_B_ALGORITHM,
    ML_DSA_ALGORITHM,
    derive_keypair_from_seed,
    verify,
)
from iroha_python.address import AccountAddress

CHAIN_DISCRIMINANT = 0x02F1
message = b"iroha gost and post-quantum example"

# Crypto helpers use canonical labels; account addresses use compact aliases.
# Every `domain=` argument below is ignored when the canonical AccountId/I105
# address is encoded.
GOST_ADDRESS_ALIASES = {
    GOST_3410_2012_256_PARAMSET_A_ALGORITHM: "gost-256-a",
    GOST_3410_2012_256_PARAMSET_B_ALGORITHM: "gost-256-b",
    GOST_3410_2012_256_PARAMSET_C_ALGORITHM: "gost-256-c",
    GOST_3410_2012_512_PARAMSET_A_ALGORITHM: "gost-512-a",
    GOST_3410_2012_512_PARAMSET_B_ALGORITHM: "gost-512-b",
}

# Derive and verify one local keypair for every GOST parameter set.
for crypto_algorithm, address_algorithm in GOST_ADDRESS_ALIASES.items():
    keypair = derive_keypair_from_seed(
        f"docs:{crypto_algorithm}".encode(),
        crypto_algorithm,
    )
    signature = keypair.sign(message)

    assert verify(crypto_algorithm, keypair.public_key, message, signature)

    address = AccountAddress.from_account(
        domain="wonderland",
        public_key=keypair.public_key,
        # Account addresses use compact curve aliases for GOST parameter sets.
        algorithm=address_algorithm,
    )
    print(crypto_algorithm)
    print(address.canonical_hex())
    print(address.to_i105(CHAIN_DISCRIMINANT))
    print(keypair.prefixed_public_key_multihash)

# ML-DSA follows the same generic signing and address flow.
mldsa_keypair = derive_keypair_from_seed(b"docs:ml-dsa", ML_DSA_ALGORITHM)
mldsa_signature = mldsa_keypair.sign(message)
assert verify(ML_DSA_ALGORITHM, mldsa_keypair.public_key, message, mldsa_signature)
post_quantum_address = AccountAddress.from_account(
    domain="wonderland",
    public_key=mldsa_keypair.public_key,
    algorithm="ml-dsa",
)
print(post_quantum_address.canonical_hex())
print(post_quantum_address.to_i105(CHAIN_DISCRIMINANT))
print(mldsa_keypair.prefixed_public_key_multihash)
```

Portail GOST et flux post-quantiques sur l'annonce de capacités authentifiée et typée du nœud :

```python
capabilities = client.get_node_capabilities_typed(
    canonical_auth=canonical_auth,
)
sm = capabilities.crypto.sm if capabilities.crypto else None
# Nodes advertise the signing algorithms they will accept for transactions.
allowed = set(sm.allowed_signing if sm else ())

GOST_ALGORITHMS = {
    "gost3410-2012-256-paramset-a",
    "gost3410-2012-256-paramset-b",
    "gost3410-2012-256-paramset-c",
    "gost3410-2012-512-paramset-a",
    "gost3410-2012-512-paramset-b",
}

# Local support is not enough; submit only when the node advertises support.
supports_gost = bool(allowed & GOST_ALGORITHMS)
supports_post_quantum = "ml-dsa" in allowed
supports_sm2 = "sm2" in allowed and bool(sm and sm.enabled)

print(supports_gost, supports_post_quantum, supports_sm2)
```

Si un nœud n'annonce pas l'algorithme dont vous avez besoin, utilisez la clé uniquement pour des flux de travail locaux ou hors ligne. Ne soumettez pas de transactions signées avec cet algorithme à ce nœud. Lors de la vérification publique Taira, GOST et ML-DSA étaient disponibles en tant qu’assistants cryptographiques SDK dans la bibliothèque en amont Python, mais n’étaient pas annoncés par le nœud pour la signature des transactions.

## Création de client consciente de la configuration {#config-aware-client-creation}

Utilisez `resolve_torii_client_config` lorsque votre application lit les paramètres des nœuds à partir d'un fichier mais a encore besoin de substitutions spécifiques à l'environnement ou au test :

```python
import json
from iroha_python import create_torii_client, resolve_torii_client_config

with open("iroha_config.json", "r", encoding="utf-8") as handle:
    raw_config = json.load(handle)

# Override only the fields that vary by environment.
resolved = resolve_torii_client_config(
    config=raw_config,
    overrides={"timeout_ms": 2_000, "max_retries": 5},
)

# Pass the resolved config into the same client constructor used elsewhere.
client = create_torii_client(
    raw_config.get("torii", {}).get("address", TORII_URL),
    resolved_config=resolved,
)
```

## Disponibilité de Kagemusha {#kagemusha-readiness}

Le Python SDK peut interroger la route de préparation actuelle de JSON via son assistant de requête générique Torii :

```python
ASSET_DEFINITION_ID = "<canonical_asset_definition_id>"

readiness = client.request_json(
    "GET",
    "/v1/offline/readiness",
    params={"asset_definition_id": ASSET_DEFINITION_ID},
    headers={"Accept": "application/json"},
    expected_status=(200,),
)
print(readiness["ready"])
print(readiness["blockers"])
```

Python n'expose pas de générateurs d'archives de recharge ou de rachat Kagemusha typés. Utilisez un portefeuille typé Swift ou JVM pour construire les archives V4 canoniques, puis soumettez-les et interrogez-les via un client Kagemusha Torii pris en charge.

## Abonnements {#subscriptions}

Les lectures d'abonnement et les générateurs de brouillons sont hérités du client partagé Torii utilisé par `iroha_python.ToriiClient`. Chaque mutation est admise avec une signature de compte canonique liée au corps et renvoie un brouillon de transaction non signé. Torii n'accepte jamais de clé privée et ne soumet pas le brouillon pour vous.

```python
# The plan defines billing cadence, retry policy, and usage pricing.
usage_plan = {
    "provider": alice,
    "billing": {
        "cadence": {
            "kind": "monthly_calendar",
            "detail": {"anchor_day": 1, "anchor_time_ms": 0},
        },
        "bill_for": {"period": "previous_period", "value": None},
        "retry_backoff_ms": 86_400_000,
        "max_failures": 3,
        "grace_ms": 604_800_000,
    },
    "pricing": {
        "kind": "usage",
        "detail": {
            "unit_price": "0.024",
            "unit_key": "compute_ms",
            "asset_definition": "usd#wonderland",
        },
    },
}

# The provider authorizes preparation of a plan-registration draft.
plan_draft = client.create_subscription_plan(
    authority=alice,
    plan_id="compute#wonderland",
    plan=usage_plan,
    canonical_auth=canonical_auth,
)

bob_canonical_auth = ToriiCanonicalRequestAuth(
    network_id=TAIRA_NETWORK_ID.literal,
    account_id=bob,
    signer=bob_pair.sign,
)

# The subscriber authorizes preparation of a subscription-creation draft.
subscription_draft = client.create_subscription(
    authority=bob,
    subscription_id="sub-001",
    plan_id="compute#wonderland",
    canonical_auth=bob_canonical_auth,
)

# Usage and charge-now operations also return unsigned transaction drafts.
usage_draft = client.record_subscription_usage(
    "sub-001",
    authority=alice,
    unit_key="compute_ms",
    delta="3600000",
    canonical_auth=canonical_auth,
)
charge_draft = client.charge_subscription_now(
    "sub-001",
    authority=alice,
    canonical_auth=canonical_auth,
)

for draft in (plan_draft, subscription_draft, usage_draft, charge_draft):
    assert draft.submitted is False
    print(draft.transaction_payload_b64, draft.signing_message_b64)
```

Donnez chaque charge utile exacte et message de signature au portefeuille local du compte correspondant, vérifiez l'opération demandée là-bas, assemblez la transaction signée et soumettez-la via le processus normal de traitement des transactions. Le Python SDK valide que le message à signer est le hachage cryptographique canonique de la charge utile renvoyée, mais le portefeuille reste responsable du décodage et de l'approbation de la transaction avant la signature.

## Connecter {#connect}

Construire et analyser Connect URIs localement. Une identité Connect lie le SID à l'exact `NetworkId`, clé publique de l'application et valeur de nonce cryptographique :

```python
from iroha_python.connect import create_connect_session_preview, parse_connect_uri

# Generate consistent SID, key, nonce, and URI values as one bundle.
preview = create_connect_session_preview(
    network_id=TAIRA_NETWORK_ID,
    node="taira.sora.org",
)
parsed = parse_connect_uri(preview.wallet_uri)

assert parsed.sid == preview.sid_base64url
assert parsed.network_id.literal == TAIRA_NETWORK_ID.literal
assert parsed.app_public_key == preview.app_key_pair.public_key
```

Enregistrez cet aperçu exact uniquement lorsque le nœud cible expose Connect. La création de session renvoie quatre jetons porteurs spécifiques à chaque rôle. La route de statut par session nécessite le jeton de gestion ; le statut agrégé est une route opérateur.

```python
from iroha_python import (
    ConnectControlClose,
    ConnectControlOpen,
    ConnectDirection,
    ConnectFrame,
    ConnectPermissions,
    bootstrap_connect_preview_session,
    decode_connect_frame,
    encode_connect_frame,
)

bootstrap = bootstrap_connect_preview_session(
    client,
    network_id=TAIRA_NETWORK_ID,
    node="taira.sora.org",
)
info = bootstrap.session
tokens = bootstrap.tokens
assert info is not None and tokens is not None

session_status = client.request_json(
    "GET",
    "/v1/connect/status",
    params={"sid": info.sid},
    headers={"Authorization": f"Bearer {tokens.management}"},
    expected_status=(200,),
)
print(info.app_uri, session_status)

# Control frames negotiate permissions before encrypted messages are sent.
frame = ConnectFrame(
    sid=bootstrap.preview.sid_bytes,
    direction=ConnectDirection.APP_TO_WALLET,
    sequence=1,
    control=ConnectControlOpen(
        app_public_key=bootstrap.preview.app_key_pair.public_key,
        network_id=TAIRA_NETWORK_ID,
        permissions=ConnectPermissions(methods=["SIGN_REQUEST_TX"], events=[]),
    ),
)
payload = encode_connect_frame(frame)
assert decode_connect_frame(payload) == frame

# Closing the control channel is explicit and also travels as a frame.
close_frame = ConnectFrame(
    sid=bootstrap.preview.sid_bytes,
    direction=ConnectDirection.APP_TO_WALLET,
    sequence=2,
    control=ConnectControlClose(
        role="App", code=4100, reason="finished", retryable=False
    ),
)
close_payload = encode_connect_frame(close_frame)
```

Chiffrer les messages post-approbation avec une session à état :

```python
from iroha_python import (
    ConnectDirection,
    ConnectSession,
    ConnectSessionKeys,
    ConnectSignRequestRawPayload,
)

# Derive symmetric session keys from both parties' keys and the session ID.
keys = ConnectSessionKeys.derive(
    local_private_key=bytes.fromhex("11" * 32),
    peer_public_key=bytes.fromhex("22" * 32),
    sid=bytes.fromhex("33" * 32),
)
session = ConnectSession(
    sid=bytes.fromhex("33" * 32),
    keys=keys,
)
# Encrypt application payloads after the session is approved.
encrypted = session.encrypt_app_to_wallet(
    ConnectSignRequestRawPayload(domain_tag="SIGN", payload=b"hash")
)
state = session.snapshot_state().to_dict()
print(encrypted.sequence, state)
```

## Gouvernance, environnement d'exécution logiciel et surfaces d'administration {#governance-runtime-and-admin-surfaces}

Les lectures de gouvernance sont authentifiées par compte. En utilisant le principal d'autorisation et la paire de clés de [Configuration partagée](#shared-setup), liez chaque appel d'assistance à Taira exactement dérivé du génesis `NetworkId` :

```python
# Governance reads return either current settings or typed not-found wrappers.
protected = client.get_protected_namespaces(canonical_auth=canonical_auth)
referendum = client.get_governance_referendum_typed(
    "ref-1", canonical_auth=canonical_auth
)
tally = client.get_governance_tally_typed("ref-1", canonical_auth=canonical_auth)
locks = client.get_governance_locks_typed("ref-1", canonical_auth=canonical_auth)
unlock_stats = client.get_governance_unlock_stats_typed(
    canonical_auth=canonical_auth
)

print(protected, referendum.found)
print(tally.approve, list(locks.locks), unlock_stats.expired_locks_now)

# Account-authenticated runtime reads use the same canonical request proof.
abi = client.get_runtime_abi_active_typed(canonical_auth=canonical_auth)
# The ABI hash itself is a public read.
abi_hash = client.get_runtime_abi_hash_typed()
runtime_metrics = client.get_runtime_metrics_typed(canonical_auth=canonical_auth)
capabilities = client.get_node_capabilities_typed(canonical_auth=canonical_auth)

print(abi, abi_hash, runtime_metrics)
print(capabilities.abi_version)
```

Créez un client séparé pour les lectures de l'opérateur. Chargez la clé de l'opérateur autorisé lors de l'exécution du logiciel et liez-la au `NetworkId` exact de Taira ; les jetons porteur et `x-api-token` ne remplacent pas cette signature :

```python
import os

from iroha_python import Ed25519KeyPair, NetworkId, OperatorSigningContext

operator_pair = Ed25519KeyPair.from_private_key(
    bytes.fromhex(os.environ["IROHA_OPERATOR_PRIVATE_KEY_HEX"])
)
operator_client = create_torii_client(
    TORII_URL,
    operator_signing_context=OperatorSigningContext(
        TAIRA_NETWORK_ID,
        operator_pair,
    ),
)
```

Les routes de mise à niveau à l'exécution sont des générateurs d'instructions authentifiés par l'opérateur. Une réponse réussie à une proposition, activation ou annulation renvoie `tx_instructions` ; elle n'effectue pas la mise à niveau. Soumettez ce lot via le processus normal de transaction signée et de gouvernance. Les méthodes épinglées Python, `propose_runtime_upgrade`, `activate_runtime_upgrade` et `cancel_runtime_upgrade` émettent actuellement des requêtes simples au lieu d'appliquer le `OperatorSigningContext` du client, donc ce tutoriel ne les présente pas comme un flux opérateur fonctionnel.

## Statut, Consensus et Télémétrie Réseau {#status-consensus-and-network-telemetry}

```python
# `/status` is the public node snapshot endpoint on Taira.
status = client.request_json("GET", "/status", expected_status=(200,))
print(status["blocks"], status["txs_approved"])

# Sumeragi and time-status endpoints use the operator client configured above.
sumeragi = operator_client.get_sumeragi_status_typed()
diagnostics = operator_client.get_sumeragi_diagnostics_typed()
print(sumeragi.last_committed_height, diagnostics.tx_queue_saturated)

time_now = client.get_time_now()
time_status = operator_client.get_time_status()
for sample in time_status.samples:
    print(sample.peer, sample.last_offset_ms, sample.last_rtt_ms)
print(time_now.now_ms)

# Connect aggregate status is operator-authenticated. Individual sessions use
# `/v1/connect/status?sid=...` with their management bearer token instead.
connect_status = operator_client.get_connect_status_typed()
if connect_status is not None:
    print(connect_status.enabled, connect_status.sessions_active)
```

## SoraFS, UAID et Kaigi Aides {#sorafs-uaid-and-kaigi-helpers}

Ces assistants sont disponibles lorsque le nœud cible expose les points de terminaison correspondants Nexus/SORA API. Traitez les listes vides comme une réponse valide : le Taira public peut avoir la route activée sans données pour le manifeste technique d'exemple ou UAID.

```python
# SoraFS status queries are reads scoped by manifest and status.
por_status = client.get_sorafs_por_status(manifest_hex="ab" * 32, status="verified")
print(len(por_status))

# UAID helpers inspect wallet/data-space bindings for one identifier.
uaid = "aabb" * 16
bindings = client.get_uaid_bindings_typed(uaid)
manifests = client.list_space_directory_manifests_typed(
    uaid,
    dataspace=11,
    status="active",
)
print(len(bindings.dataspaces), len(manifests.manifests))

# Kaigi relay health is an operator snapshot, even though it is read-only.
health = operator_client.get_kaigi_relays_health_typed()
print(health.healthy_total, health.failovers_total)
```

## Norito RPC et GPU Aides {#norito-rpc-and-gpu-helpers}

Utilisez `NoritoRpcClient` lorsque vous avez déjà Norito octets et que vous devez appeler un point de terminaison binaire Torii API. L'exemple nécessite un conteneur de données signé à partir d'un modèle de transaction précédent :

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call(
        "/v1/pipeline/transactions",
        envelope.signed_transaction_versioned,
    )
    print(len(response_bytes))
```

CUDA les assistants renvoient `None` lorsque le backend n'est pas disponible, afin que les applications puissent revenir aux implémentations scalaires :

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## Couverture actuelle {#current-coverage}

Le Python SDK inclut déjà des aides pour :

- Torii flux de soumission, de statut, de requête et d'administration
- constructeurs d'instructions typées pour les extensions courantes ISI et spécifiques au domaine
- brouillons de transaction, manifestes techniques, signature et flux de travail des conteneurs de données de transaction signés
- flux d'événements en direct et filtres tapés ; les flux de blocs engagés fournissent un historique complet
- accès générique à la préparation Kagemusha et aides à l'abonnement Torii ; les générateurs de recharge et de rachat typés ne sont pas exposés
- adresse de compte, aides à la signature tous-algorithmes, aller-retour multihash, SM2, GOST, ML-DSA, BLS, et gestion de clé confidentielle
- Connecter URIs, les sessions, les trames, les aides à l'encryption et l'administration du registre
- adaptateurs de points de terminaison pour la gouvernance, les mises à niveau de l’environnement d’exécution, Sumeragi, l’administration du nœud, SoraFS, UAID et Kaigi, lorsque le nœud expose ces fonctions

## Références en amont {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

Ces fichiers sont la source de vérité pour la surface Python dans la révision de l’espace de travail épinglée.
