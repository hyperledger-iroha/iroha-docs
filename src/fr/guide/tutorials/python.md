---
translation_locale: fr
translation_source: /guide/tutorials/python.md
translation_source_hash: a87e8db2b77fa4952689276ae538e65b3b51070749dd0938a9e18d3a6a3dc5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Python {#python}

Les Python SDK dans l'espace de travail en amont est `iroha-python`. La première Iroha 3
les objectifs de libération du courant Torii et Norito les surfaces.
ou la révision de la source utilisée par votre intégration afin que le SDK et le nœud reste sur
la même révision en format électronique.

Les exemples ci-dessous à lire uniquement ont été comparés au public. Taira à
`https://taira.sora.org`. Les modèles de transaction sont des exemples mutants: ils
nécessiter une réelle Taira autorité, clé privée, métadonnées de gaz et tout opérateur
les jetons requis par la route cible avant leur soumission.

Utilisez les exemples dans cet ordre:

| Étapes | Retour contre le public Taira? | Ce dont vous avez besoin |
| --- | --- | --- |
| Appels clients uniquement lisibles | Oui , c' est vrai . | Python package plus accès au réseau |
| Constructeurs locaux de signatures et d'instructions | Aucun appel de réseau jusqu'à `submit()` | L'extension native et votre matériau clé |
| Transactions de mutation et appels au service | Seulement avec votre propre compte financé | Compte de l'autorité, clé privée, chaîne ID, les métadonnées des frais, le solde des actifs des frais et les jetons de route |
| Connectez des codecs de cadre, crypto et GPU les aides | Seuls locaux | Extension native; GPU les aides ont également besoin d'un CUDA- un arrière-plan capable |

## Installation {#install}

Le nom des métadonnées du paquet est `iroha-python`. Ne supposez pas un non-apposé PyPI
l'installation correspond à la live Taira Installez une roue ou un guichet de source qui
a été construit à partir de la même révision en amont vos objectifs d'intégration:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

Si votre projet consomme directement l'espace de travail en amont, Python
les dépendances et construire l'extension native avant d'exécuter des exemples qui utilisent
`Instruction`, `TransactionDraft`, signatures, cryptographie, SoraFS les aides autochtones, GPU
connectez les codecs d'image. Utilisez la commande construire à partir du flux en amont
`python/iroha_python/README.md`, puis vérifier que les exportations nationales sont chargées:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

Si `create_torii_client` les importations, mais `Instruction` ou
`generate_ed25519_keypair` les échecs, le pur Python Le paquet est disponible, mais le
L'extension native ne l'est pas.

## Début rapide {#quickstart}

Commencez par le public, uniquement pour la lecture. Taira points de fin:

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

Utilisez cette configuration pour les modèles mutants.
Taira autorité, clé privée, jeton et actif/compte IDs depuis votre déploiement
avant de soumettre.

`authority` est le compte qui signe la transaction. `private_key` doit correspondre
ce compte, `CHAIN_ID` doit correspondre au réseau cible, et `TX_METADATA` doit être
les champs de redevances attendus par le réseau.
sont intentionnellement invalides, de sorte qu'elles ne sont pas soumises par accident.

```python
from iroha_python import (
    Ed25519KeyPair,
    Instruction,
    TransactionConfig,
    TransactionDraft,
    create_torii_client,
)

TORII_URL = "https://taira.sora.org"
CHAIN_ID = "fc56984b-2be7-431d-840e-21514d1883f0"
AUTH_TOKEN = None

# Replace these placeholders with the real signing keys for your accounts.
alice_pair = Ed25519KeyPair.from_private_key(bytes.fromhex("<alice-private-key-hex>"))
bob_pair = Ed25519KeyPair.from_private_key(bytes.fromhex("<bob-private-key-hex>"))

# The authority string must identify the same account as the private key.
alice = "<alice-account-id>"
bob = "<bob-account-id>"

ROSE_DEFINITION = "rose#wonderland"
ROSE_ASSET = "<rose-asset-id>"
BADGE_NFT = "badge$wonderland"

TX_METADATA = {
    # Public Taira fee asset. Use the configured XOR asset on your network.
    "gas_asset_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
}

client = create_torii_client(TORII_URL, auth_token=AUTH_TOKEN)


def submit(*instructions):
    # This is the network boundary: build, sign, submit, and wait for status.
    return client.build_and_submit_transaction(
        chain_id=CHAIN_ID,
        authority=alice,
        private_key=alice_pair.private_key,
        instructions=list(instructions),
        metadata=TX_METADATA,
        wait=True,
    )
```

`Instruction.*` Il n'y a que des charges utiles à construire. `submit()` est le
point où le SDK signe la transaction, l'envoie à Torii, et attend une
Le statut.

## Tarifs et gaz {#fees-and-gas}

Les transactions de rédaction nécessitent des métadonnées sur les frais et un solde d'actifs financés. Taira,
l'actif de frais est financé par le robinet public et les métadonnées des transactions doivent être
inclure `gas_asset_id`. À l'intérieur Minamoto, les frais sont payés en réel XOR et l'actif
ID vient de la configuration de ce réseau.

Les métadonnées des frais sont attribuées à la transaction et non aux instructions individuelles.
`submit()` aide au-dessus des attaches `TX_METADATA` à chaque transaction qu'il crée:

```python
TX_METADATA = {
    # Taira expects the fee asset definition in transaction metadata.
    "gas_asset_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
}

envelope, status = client.build_and_submit_transaction(
    chain_id=CHAIN_ID,
    authority=alice,
    private_key=alice_pair.private_key,
    # Fee metadata is attached to the transaction, not the instruction.
    instructions=[
        Instruction.set_account_key_value(
            alice,
            "python_fee_example",
            "ready",
        )
    ],
    metadata=TX_METADATA,
    wait=True,
)
```

Avant d'envoyer des lettres, assurez-vous que le compte de l'autorité possède suffisamment de frais
Le robinet et l'actif exacts ID sont spécifiques au réseau; c'est le Taira
forme:

```python
FEE_ASSET_DEFINITION = "6TEAJqbb8oEPmLncoNiMRbLEK6tw"
# The faucet returns the concrete account asset ID to check here.
FEE_ASSET_ID = "<fee-asset-id-from-faucet-response>"
TX_METADATA = {"gas_asset_id": FEE_ASSET_DEFINITION}

# Fail before submitting if the signer cannot pay gas.
fee_assets = client.list_account_assets_typed(
    alice,
    limit=10,
    asset_id=FEE_ASSET_ID,
)
if not fee_assets.items:
    raise RuntimeError("fund the authority account with the Taira fee asset first")
```

Le robinet retourne le béton `asset_id` Les résultats de l'enquête ont été
`gas_asset_id` champ de métadonnées utilise la définition d'actif des frais ID.

Garder les métadonnées des demandes séparées des métadonnées de frais en fusionnant les cartographies
lorsque vous effectuez une transaction:

```python
APP_METADATA = {"source": "python-docs"}
# Merge app metadata with required fee metadata before building the draft.
metadata = {**TX_METADATA, **APP_METADATA}

draft = TransactionDraft(
    TransactionConfig(
        chain_id=CHAIN_ID,
        authority=alice,
        metadata=metadata,
    )
)
```

Si vous omettez les métadonnées des frais, utilisez le mauvais actif des frais ou signez avec un non-financé
compte, un réseau réel devrait rejeter la transaction même si l'instruction
la charge utile est autrement valable.

## Taira- Les appels à lecture seule vérifiés {#taira-checked-read-only-calls}

Ces appels sont revenus avec succès contre le public Taira:

```python
client = create_torii_client("https://taira.sora.org")

# Use raw requests for endpoints that do not need a typed wrapper.
status = client.request_json("GET", "/status", expected_status=(200,))
parameters = client.request_json("GET", "/v1/parameters", expected_status=(200,))

# Typed helpers parse pagination and records into dataclasses.
accounts = client.list_accounts_typed(limit=1)
domains = client.list_domains_typed(limit=1)
definitions = client.query_asset_definitions_typed(limit=1)

# These calls inspect live node subsystems without mutating state.
time_now = client.get_time_now_typed()
time_status = client.get_time_status_typed()
sumeragi = client.get_sumeragi_status_typed()
connect = client.get_connect_status_typed()

print(status["build"]["version"])
print(parameters["sumeragi"]["block_time_ms"])
print(accounts.total, domains.total, definitions.total)
print(time_now.now_ms, len(time_status.samples), sumeragi.leader_index)
print(connect.enabled, connect.sessions_active)
```

Routes telles que `/v1/status`, l'inventaire public des pairs, Sumeragi RBC prélèvement d'échantillons, noeud
les instantanés d'administration et l'administration du registre de l'application Connect n'étaient pas publiques
est disponible le Taira l' utilisation `request_json("GET", "/status")` pour
la charge utile du statut de nœud public sur Taira.

## Les constructeurs d'instructions {#instruction-builders}

Les SDK Il y a aussi des méthodes d'apprentissage et de rédaction.
JSON échapper à la trappe pour les variantes qui ne sont pas de première classe Python Les méthodes encore.
Les extraits suivants sont des modèles de transaction mutants et n' ont pas été
présenté au public Taira sans compte de signature.

Ils préfèrent les aides de type lorsqu'elles existent: elles se normalisent Python valeurs et défaillance
les formes invalides. `Instruction.from_json` uniquement lorsque vous avez besoin d'un
une variante d'instruction qui n'a pas un Python Je ne suis pas encore au courant.

| Famille d'instructions | Python surfaces |
| --- | --- |
| Registre | `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` est réservé aux outils génèse/bootstrap |
| Déconnexion de l'inscription | `unregister_trigger`; utilisation `Instruction.from_json` pour les autres variantes |
| La menthe ou le bois | `mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions` |
| Transfert | `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
| Les métadonnées et les contrôles | `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
| RWA cycle de vie | `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa` |
| ExecuteTrigger | `execute_trigger` |
| Extensions de répartition et d'établissement | `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
| Fermetures d'actifs natifs | `open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, plus le client `*_and_wait` les aides |
| Grant/Revocation, SetParameter, Variantes de journaux, personnalisés, mises à niveau et moins courantes en matière de registre/non-enregistrement | `Instruction.from_json` ou `TransactionBuilder.add_instruction_json` avec canonique `InstructionBox` JSON |

Pour les paiements conditionnels à titre de garantie, voir
[Réservation des actifs natifs](/fr/blockchain/escrow.md#python-asset-locks). Python
exposant actuellement des aides de première classe pour les verrouillages d'actifs génériques;
Les assistants anonymes ne sont pas de première classe. Python Les méthodes encore.

### Créer des domaines, puis enregistrer des comptes et des actifs {#set-up-domains-then-register-accounts-and-assets}

La création de domaine ordinaire passe par le planificateur d'alias déclaratif SNS
Le contrat de location, les capacités du propriétaire, la protection des devis et l'état du domaine sont vérifiés ensemble.
Créez un livre sans secrets `AliasSetupPlanRequestV1` l'intention avec votre SDK ou
service d'embarquement, puis utiliser `iroha app alias setup plan` et
`iroha app alias setup apply`. Ne soumettez pas `Instruction.register_domain`
à partir d'une transaction d'application; ce constructeur reste pour génèse/bootstrap
outillage.

Une fois que le plan de configuration du domaine s'est engagé, inscrivez les objets appartenant au domaine.
réseau tel que Taira, Utilisez un domaine et un espace de noms de compte qui vous sont attribués.

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

`mintable` accepte `Infinitely`, `Once`, `Not`, ou `Limited(n)` valeurs acceptées
par le modèle de données. `scale` pour un actif numérique sans contrainte.

### La menthe, le feu et les biens transférés {#mint-burn-and-transfer-assets}

Ces appels utilisent un actif existant ID. Enregistrer d'abord la définition de l'actif, puis
construire l'actif en béton ID pour le compte qui détient l'actif.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### Propriété de transfert {#transfer-ownership}

Les transferts de propriété changent qui contrôle le domaine, la définition des actifs ou NFT.
Utilisez le propriétaire actuel comme autorité de transaction.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### Configurer et supprimer les métadonnées {#set-and-remove-metadata}

Les valeurs des métadonnées doivent être JSON Lorsque vous utilisez `TransactionDraft`, le
autorité dans `TransactionConfig` devient le compte cible par défaut.

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

Le projet d'aide de haut niveau vise par défaut l'autorité chargée des opérations:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### Les actifs du monde réel {#real-world-assets}

RWA les aides utilisent JSON- des charges utiles sérialisables pour les métadonnées spécifiques à l'actif,
l'origine et la politique du contrôleur. `register_rwa` n'accepte pas une `id` ou
`owner`: la durée de fonctionnement génère le `RwaId`, et l'autorité de transaction
devient le propriétaire initial.

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
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

Après l'engagement de la transaction d'enregistrement, utiliser `FindRwas`, `/v1/rwas`, une RWA
l'événement, ou le parcours d'explorateur mis en place pour découvrir les ID:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Les opérations ultérieures utilisent les `hash$domain` ID:

```python
registered_rwa_id = (
    "0123456789abcdef0123456789abcdef"
    "0123456789abcdef0123456789abcdef$commodities.universal"
)

draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
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

Les transferts complets peuvent changer `owned_by` sur le lot existant.
Les fusions créent des lots d'enfants générés.

### Les déclencheurs {#triggers}

Utilisez les aides d' enregistrement de déclencheur lorsque l' exécutable est une autre instruction
séquence:

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

Torii dévoile également REST aides à l'inventaire des déclencheurs:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

Les appels d'inventaire des déclencheurs ne sont lus que pour vérifier les enregistrements de déclenchement.
L'exécution, les modifications répétitives et le non-enregistrement sont des opérations mutantes.

### Instructions sur le dépôt et le règlement {#repo-and-settlement-instructions}

Les aides au référencement et à l'établissement bilatéral ajoutent des instructions spécifiques aux domaines
variantes sans fabrication manuelle Norito charges utiles:

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
    chain_id=CHAIN_ID,
    authority=alice,
    # Keep repo and settlement examples bounded by a short TTL.
    ttl_ms=120_000,
    metadata=TX_METADATA,
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
draft.repo_unwind(
    agreement_id="daily_repo",
    initiator=alice,
    counterparty=bob,
    cash_leg=cash,
    collateral_leg=collateral,
    settlement_timestamp_ms=1_704_086_400_000,
)

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

envelope = draft.sign_with_keypair(alice_pair)
client.submit_transaction_envelope_and_wait(envelope)
```

### JSON Escape Hatch {#json-escape-hatch}

Lorsque un Python aide n'est pas encore disponible, fournissez un modèle de données canonique
`InstructionBox` JSON dans `Instruction.from_json` ou directement dans
`TransactionBuilder.add_instruction_json`. C' est la voie recommandée pour
`Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, partage/rôle NFT
les variantes non déclenchantes de non-enregistrement jusqu'à ce que ces aides soient
écrit.

```python
from iroha_python import Instruction, TransactionBuilder

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

# Use TransactionBuilder when you need lower-level control than TransactionDraft.
builder = TransactionBuilder(CHAIN_ID, alice)
builder.set_metadata(TX_METADATA)
builder.add_instruction_json(instruction_box_json)
envelope = builder.sign(alice_pair.private_key)
client.submit_transaction_envelope_and_wait(envelope)
```

Pour les instructions générées ou opaques, aller-retour à travers JSON avant le stockage
les appareils:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## Flux de travail des transactions {#transaction-workflows}

Utilisation `TransactionDraft` pour les applications qui construisent plusieurs instructions avant
Un projet vous permet de conserver des paramètres au niveau des transactions tels que `ttl_ms`,
`nonce`, et les métadonnées en un seul endroit, puis signez une fois:

```python
config = TransactionConfig(
    chain_id=CHAIN_ID,
    authority=alice,
    # TTL and nonce are transaction-level properties shared by all instructions.
    ttl_ms=120_000,
    nonce=1,
    metadata={**TX_METADATA, "source": "python-docs"},
)

draft = TransactionDraft(config)
# Draft methods append instructions but do not submit anything yet. Domain
# setup is a separate alias-planner flow and has already committed here.
draft.register_account(bob, metadata={"role": "user"})
draft.register_asset_definition_numeric(
    ROSE_DEFINITION,
    owner=alice,
    scale=2,
    mintable="Infinitely",
)
draft.mint_asset_numeric(ROSE_ASSET, "100")
draft.transfer_asset_numeric(ROSE_ASSET, "25", destination=bob)

# Signing freezes the draft into an envelope ready for Torii.
envelope = draft.sign_with_keypair(alice_pair)
receipt = client.submit_transaction_envelope(envelope)
status = client.wait_for_transaction_status(envelope.hash_hex(), timeout=30)
print(receipt, status)
```

Exporter un manifeste déterministique pour examen, vérification ou remise de portefeuille:

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

Appliquer une preuve de confidentialité avant la signature lorsque la voie cible l'exige:

```python
# Attach the proof before signing so it is covered by the transaction hash.
draft.add_lane_privacy_merkle_proof(
    commitment_id=7,
    leaf=bytes.fromhex("aa" * 32),
    leaf_index=3,
    audit_path=[bytes.fromhex("bb" * 32), None, bytes.fromhex("cc" * 32)],
    proof_backend="halo2/ipa",
    proof_bytes=b"...proof bytes...",
    verifying_key_bytes=b"...verifying key bytes...",
)
envelope = draft.sign_with_keypair(alice_pair)
```

## Les questions {#queries}

Les assistants de requête typés renvoient des classes de données au lieu de brute JSON Les dictionnaires.
sont la façon la plus facile de commencer parce que le SDK parses pagination et commun
champs d'enregistrement pour vous

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.query_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Utilisez les aides à la demande génériques lorsque Torii point final n'a pas encore un type
enveloppe:

```python
# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))
metrics = client.get_metrics(as_text=True)
```

Les assistants à l'inventaire des comptes ont besoin d'un identifiant de compte accepté par le SDK Je suis là .
- Utilisez le canonique. I105 compte IDs ou des pseudonymes en chaîne; si un bloc
l'explorateur ou le point final brut renvoie un ID que le SDK rejet, résoudre à un
compte canonique ID avant d'appeler ces aides:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## Les événements {#events}

Décodage des aides de diffusion JSON Les charges utiles par défaut. `with_metadata=True`
lorsque vous avez besoin de SSE Nom de l'événement, identifiant, indice de réessayer et charge utile brute.
avec `EventCursor` pour persister le dernier identifiant d'événement. Ces exemples attendent en direct
les événements, alors courez-les contre un nœud où le flux d'événements correspondant est
activé et actif.

```python
from iroha_python import DataEventFilter, EventCursor

# Narrow the stream to proof events with the expected backend and proof hash.
proof_filter = DataEventFilter.proof(
    backend="halo2/ipa",
    proof_hash_hex="deadbeef" * 8,
)

# Persist the latest SSE id so a reconnect can resume from the same point.
cursor = EventCursor()
for event in client.stream_events(
    filter=proof_filter,
    cursor=cursor,
    resume=True,
    with_metadata=True,
):
    print(event.id, event.event, event.data)
    break

for event in client.stream_trigger_events(trigger_id="hourly_reward", resume=True):
    print(event)
    break

for tx_event in client.stream_pipeline_transactions(status="Queued"):
    print(tx_event)
    break
```

## Les clés et les adresses {#keys-and-addresses}

Les SDK expose les assistants de signature locaux pour chaque algorithme de signature compilé
Ces aides n'appellent Taira, mais ils exigent
l'extension native:

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

Utilisation `supported_crypto_algorithms()` Pour voir ce que votre roue soutient.
les aides génériques utilisent des étiquettes d'algorithmes canoniques et travaillent pour Ed25519,
secp256k1, ML-DSA, GOST, BLS, et SM2 lorsque ces algorithmes sont compilés dans:

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

### Chinois SM La cryptographie {#chinese-sm-cryptography}

Les Python SDK exposant les deux génériques SM2 les aides et SM2- une commodité spécifique
les aides. Utilisez l'annonce de capacité du nœud pour choisir le SM2 la distinction
identifiant attendu par le réseau cible:

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

capabilities = client.get_node_capabilities_typed()
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

`crypto.sm.enabled` vous indique si le nœud accepte SM- les algorithmes familiaux dans
La même annonce inclut la SM politique de hachage et accélération
Le statut de l'établissement est utile pour décider si SM2- les flux spécifiques:

```python
capabilities = client.get_node_capabilities_typed()

# `enabled` is the submit-time policy flag, not just local SDK support.
if capabilities.crypto and capabilities.crypto.sm.enabled:
    sm = capabilities.crypto.sm
    print(sm.default_hash)
    print(sm.allowed_signing)
    print(sm.acceleration.policy)
else:
    print("SM crypto is not enabled by this node")
```

Le public Taira exposé le SM l'annonce de capacité pendant la vérification, mais SM signature
Les algorithmes de signature annoncés étaient `ed25519`,
`secp256k1`, et `bls_normal`, alors ne vous soumettez pas SM2- les transactions signées à cette date
déploiement à moins que la charge utile des capacités ne change.

### GOST et clés post-quantiques {#gost-and-post-quantum-keys}

Utilisez la crypto générique API pour GOST R 34.10-2012 ensemble de paramètres et ML-DSA
(`ml-dsa`) signatures post-quantum. Le même objet de paire de clés tient la signature,
la vérification et l'exportation de multihash:

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

Porte GOST et des flux post-quantum sur les algorithmes de signature annoncés du nœud.
Utilisez la charge utile des capacités brutes pour les noms d'algorithmes compatibles avec l'avenir:

```python
capabilities = client.request_json(
    "GET",
    "/v1/node/capabilities",
    expected_status=(200,),
)
crypto = capabilities.get("crypto", {})
sm = crypto.get("sm", {})
# Nodes advertise the signing algorithms they will accept for transactions.
allowed = set(sm.get("allowed_signing", []))

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
supports_sm2 = "sm2" in allowed and bool(sm.get("enabled", False))

print(supports_gost, supports_post_quantum, supports_sm2)
```

Si un nœud ne publie pas l'algorithme dont vous avez besoin, utilisez la clé uniquement pour local
Ne soumettez pas de transactions signées avec cet algorithme à
Ce n'est pas le cas. Taira le chèque, GOST et ML-DSA étaient disponibles en tant que SDK
les crypto-assistants en amont Python La bibliothèque, mais n'ont pas été annoncées par le
le nœud de signature des transactions.

## Création de clients à la connaissance des paramètres {#config-aware-client-creation}

Utilisation `resolve_torii_client_config` lorsque votre application lit les paramètres de nœud
à partir d'un fichier, mais nécessitant toujours des suppressions spécifiques à l'environnement ou aux essais:

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

## La préparation de Kagemusha {#kagemusha-readiness}

Les Python SDK peut consulter le courant JSON route de préparation à travers son générique
Torii aide à la demande:

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

Python n'expose pas les constructeurs d'archives de remplissage ou de rachat typés Kagemusha.
Utilisez un type Swift ou JVM portefeuille pour construire le canonique V4 les archives, puis
les soumettre et les enquêter par l'intermédiaire d'une Kagemusha soutenue Torii client.

## Les abonnements {#subscriptions}

Les assistants d'abonnement modifient les appels de service hérités du partagé Torii
client utilisé par `iroha_python.ToriiClient`. Utilisation IDs et des actifs existant sur le
réseau que vous ciblez.

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

# The provider signs plan creation.
client.create_subscription_plan(
    authority=alice,
    private_key=alice_pair.private_key_hex,
    plan_id="compute#wonderland",
    plan=usage_plan,
)

# The subscriber signs subscription creation.
client.create_subscription(
    authority=bob,
    private_key=bob_pair.private_key_hex,
    subscription_id="sub-001",
    plan_id="compute#wonderland",
)

# Usage is recorded by the provider and then charged on demand.
client.record_subscription_usage(
    "sub-001",
    authority=alice,
    private_key=alice_pair.private_key_hex,
    unit_key="compute_ms",
    delta="3600000",
)
client.charge_subscription_now(
    "sub-001",
    authority=alice,
    private_key=alice_pair.private_key_hex,
)
```

## Connectez {#connect}

Construire et analyser Connexion URIs, et lire le statut public Connect exposé par
Taira:

```python
from iroha_python.connect import ConnectUri, build_connect_uri, parse_connect_uri

# Connect URIs are what an app hands to a wallet to start a session.
uri = build_connect_uri(
    ConnectUri(
        sid="base64url-session-id",
        chain_id=CHAIN_ID,
        node="taira.sora.org",
    )
)
parsed = parse_connect_uri(uri)
# Status tells you whether the node currently exposes Connect.
status = client.get_connect_status_typed()

assert parsed.chain_id == CHAIN_ID
print(status.enabled, status.sessions_active)
```

Les codecs de cadre, la dérivation des clés de session et la création de sessions nécessitent le codec natif
Extension et itinéraire de session Connect activé:

```python
from iroha_python import (
    ConnectControlClose,
    ConnectControlOpen,
    ConnectDirection,
    ConnectFrame,
    ConnectPermissions,
    decode_connect_frame,
    encode_connect_frame,
    generate_connect_keypair,
)

# The app keypair is separate from the account key used for transactions.
connect_pair = generate_connect_keypair()
info = client.create_connect_session_info(
    {"role": "app", "sid": connect_pair.public_key.hex()}
)
print(info.app_uri, info.wallet_token, info.expires_at)

# Control frames negotiate permissions before encrypted messages are sent.
frame = ConnectFrame(
    sid=bytes.fromhex("01" * 32),
    direction=ConnectDirection.APP_TO_WALLET,
    sequence=1,
    control=ConnectControlOpen(
        app_public_key=connect_pair.public_key,
        chain_id=CHAIN_ID,
        permissions=ConnectPermissions(methods=["SIGN_REQUEST_TX"], events=[]),
    ),
)
payload = encode_connect_frame(frame)
assert decode_connect_frame(payload) == frame

# Closing the control channel is explicit and carries a reason code.
client.send_connect_control_frame(
    "base64url-session-id",
    ConnectControlClose(role="App", code=4100, reason="finished", retryable=False),
)
```

Encrivez les messages post-approbation avec une session d' état:

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

## Gouvernance, temps d'exécution et surfaces d'administration {#governance-runtime-and-admin-surfaces}

Ces appels en lecture seulement ont été retournés avec succès contre le public Taira:

```python
client = create_torii_client("https://taira.sora.org")

# Governance reads return either current settings or typed not-found wrappers.
protected = client.get_protected_namespaces()
referendum = client.get_governance_referendum_typed("ref-1")
tally = client.get_governance_tally_typed("ref-1")
locks = client.get_governance_locks_typed("ref-1")
unlock_stats = client.get_governance_unlock_stats_typed()

print(protected, referendum.found)
print(tally.approve, list(locks.locks), unlock_stats.expired_locks_now)

# Runtime reads expose the active ABI and any pending upgrade records.
abi = client.get_runtime_abi_active_typed()
abi_hash = client.get_runtime_abi_hash_typed()
runtime_metrics = client.get_runtime_metrics_typed()
upgrades = client.list_runtime_upgrades_typed()
capabilities = client.get_node_capabilities_typed()

print(abi, abi_hash, runtime_metrics)
print(upgrades.total, capabilities.abi_version)
```

Les aides à la mise à niveau de l'exécution acceptent la forme du manifeste utilisée par la mise à jour de l' exécution
API. Ce sont des actions d'opérateur, alors utilisez-les uniquement contre un nœud où votre
compte et jeton sont autorisés:

```python
admin = create_torii_client(
    TORII_URL,
    auth_token="admin-token",
api_token="torii-token",
)

# Propose creates the upgrade instructions; activation/cancel are operator actions.
upgrade = admin.propose_runtime_upgrade(
    {
        "name": "Refresh runtime provenance",
        "description": "Schedules a no-ABI-change runtime rollout.",
        "abi_version": 1,
        "abi_hash": "00" * 32,
        "added_syscalls": [],
        "added_pointer_types": [],
        "start_height": 1_500_000,
        "end_height": 1_500_256,
    }
)
print(upgrade["tx_instructions"])

admin.activate_runtime_upgrade("deadbeef" * 4)
admin.cancel_runtime_upgrade("feedface" * 4)
```

## Statut, consensus et télémétrie réseau {#status-consensus-and-network-telemetry}

```python
# `/status` is the public node snapshot endpoint on Taira.
status = client.request_json("GET", "/status", expected_status=(200,))
print(status["blocks"], status["txs_approved"])

# Sumeragi and time endpoints expose consensus and clock diagnostics.
sumeragi = client.get_sumeragi_status_typed()
print(sumeragi.highest_qc.height, sumeragi.tx_queue.saturated)

time_now = client.get_time_now_typed()
time_status = client.get_time_status_typed()
for sample in time_status.samples:
    print(sample.peer, sample.last_offset_ms, sample.last_rtt_ms)
print(time_now.now_ms)
```

## SoraFS, UAID, et Kaigi Les aides {#sorafs-uaid-and-kaigi-helpers}

Ces aides sont disponibles lorsque le nœud cible expose les
Nexus/SORA Les résultats de l'enquête ont été publiés dans le cadre d'une enquête. Taira le mois de mai
avoir activé la route sans données pour le manifeste de l'échantillon; ou UAID.

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

# Kaigi health summarizes relay availability when the route is enabled.
health = client.get_kaigi_relays_health_typed()
print(health.healthy_total, health.failovers_total)
```

## Norito RPC et GPU Les aides {#norito-rpc-and-gpu-helpers}

Utilisation `NoritoRpcClient` quand vous avez déjà Norito octets et besoin d'appeler un
à deux Torii L'exemple nécessite une enveloppe signée d'un précédent
modèle de transaction:

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call("/v1/transaction", envelope.signed_transaction_versioned)
    print(len(response_bytes))
```

CUDA les aides reviennent `None` lorsque le backend n'est pas disponible, les applications
peut revenir à des implémentations scalaires:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## Couverture actuelle {#current-coverage}

Les Python SDK inclut déjà des aides pour:

- Torii flux de soumission, d'état, de requête et d'administration
- constructeurs d'instructions de type pour le commun ISI et des extensions spécifiques au domaine
- les projets de transaction, les manifestes, la signature et l'enveloppe de transaction signée
  flux de travail
- événements de streaming, filtres et curseurs réalisables
- accès à la préparation de Kagemusha générique et Torii les assistants d'abonnement; typé
  Les constructeurs de recharges et de rachat ne sont pas exposés
- l'adresse du compte, les aides à la signature de tous les algorithmes, les allers-retours multihash, SM2,
  GOST, ML-DSA, BLS, et la manipulation confidentielle des clés
- Connectez URIs, sessions, cadres, aides de cryptage et administrateur du registre
- la gouvernance, l'amélioration du temps d'exécution, Sumeragi, l'administrateur de nœud, SoraFS, UAID, et Kaigi
  enveloppes de points d'extrémité où le nœud expose ces caractéristiques

## Références en amont {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

Ces dossiers sont la source de la vérité pour le Python surfaces dans le pincé
révision de l'espace de travail.
