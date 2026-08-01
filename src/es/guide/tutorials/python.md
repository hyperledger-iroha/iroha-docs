---
translation_locale: es
translation_source: /guide/tutorials/python.md
translation_source_hash: a87e8db2b77fa4952689276ae538e65b3b51070749dd0938a9e18d3a6a3dc5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Python {#python}

El Python SDK en el espacio de trabajo ascendente es `iroha-python`. La primera versión Iroha 3 se dirige a las superficies actuales Torii y Norito. Enmarque la versión del paquete o la revisión de fuente utilizada por su integración para que el SDK y el nodo permanezcan en la misma revisión de formato de cable.

Los ejemplos de sólo lectura a continuación fueron comparados con el público Taira en el `https://taira.sora.org`. Los ejemplos de mutación son las plantillas de transacciones: requieren una real Taira autoridad, clave privada, metadatos de gas y cualquier ficha del operador requerida por la ruta objetivo antes de que puedan presentarse.

Utilice los ejemplos en este orden:

|Escenario| Correr contra el público Taira? |Lo que necesitas .|
| --- | --- | --- |
|Las llamadas de clientes sólo para lectura |- Sí , sí .|Python paquete más acceso a la red |
|Los constructores locales de firmas e instrucciones |Ninguna llamada a la red hasta `submit()` |Extensión nativa y su material clave |
|Transformación de transacciones y llamadas de servicio |Sólo con su cuenta financiada .|Cuenta de la autoridad, llave privada, cadena ID, metadatos sobre las tarifas, saldo de activos de las tarifas y tokens de ruta |
|Conecte los codecs de marco, criptografía y GPU ayudantes |Sólo local .|Extensión nativa; los ayudantes de GPU también necesitan un backend capaz de CUDA |

## Instalación {#install}

El nombre de los metadatos del paquete es `iroha-python`. No asuma que una instalación sin fijación PyPI coincida con la red en vivo Taira. Instale una rueda o caja fuente que se construyó a partir de la misma revisión upstream sus objetivos de integración:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

Si su proyecto consume el espacio de trabajo upstream directamente, instale las dependencias Python y construya la extensión nativa antes de ejecutar ejemplos que utilizan `Instruction`, `TransactionDraft`, firma, criptografía, SoraFS asistentes nativos, GPU ayudantes o Códec de marco Connect. Utilice el comando de construcción desde la corriente ascendente `python/iroha_python/README.md`, y luego verifique si la carga de exportaciones nativas:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

En caso de que las importaciones `create_torii_client` pero `Instruction` o `generate_ed25519_keypair` no funcionen, el paquete puro Python está disponible, pero la extensión nativa no.

## Inicio rápido {#quickstart}

Comience con los puntos finales Taira públicos y de lectura exclusiva:

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

## Configuración compartida {#shared-setup}

Utilice esta configuración para las plantillas mutantes. reemplace cada poseedor de lugar con una autoridad Taira, clave privada, token y activo/cuenta IDs de su implementación antes de enviar.

`authority` es la cuenta que firma la transacción. `private_key` debe corresponder a esa cuenta, `CHAIN_ID` debe coincidir con la red de destino y `TX_METADATA` debe incluir los campos de tarifas esperados por la red. Los titulares de lugar a continuación son inválidos intencionadamente, por lo que no se presentan por accidente.

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

`Instruction.*` solo llama a las cargas útiles de instrucciones de construcción. `submit()` es el punto en que el SDK firma la transacción, la envía a Torii y espera un estado.

## Tarifas y gas {#fees-and-gas}

Las transacciones de escritura requieren metadatos de cuotas y un saldo de activos de cuotas financiadas Taira, El activo de las tarifas está financiado por el grifo público y los metadatos de la transacción deben incluir: `gas_asset_id`. En el Minamoto, los honorarios se pagan en reales XOR y el activo ID proviene de la configuración de esa red.

Los metadatos de las tarifas pertenecen a la transacción, no a instrucciones individuales. El ayudante `submit()` anterior adjunta `TX_METADATA` a cada transacción que construye:

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

Antes de enviar escritos, asegúrese de que la cuenta de la autoridad posee suficiente del activo de las tarifas. El grifo exacto y el activo ID son específicos de la red; esta es la forma Taira:

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

El grifo devuelve el concreto . `asset_id` Para el control del saldo. `gas_asset_id` El campo de metadatos utiliza la definición del activo de las tarifas ID.

Mantenga los metadatos de las aplicaciones separados de los metadados de las tarifas mediante la fusión de los mapas cuando se crea una transacción:

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

Si omite metadatos de tarifas, utiliza el activo de tarifas incorrecto o firma con una cuenta no financiada, una red real debería rechazar la transacción incluso si la carga útil de instrucciones es válida.

## Taira - Llamadas de lectura única verificadas {#taira-checked-read-only-calls}

Estas llamadas fueron devueltas con éxito contra el público Taira:

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

Rutas como `/v1/status`, inventario público de pares, muestreo Sumeragi RBC, instantáneas del administrador de nodos y administración del registro de aplicaciones Connect no estaban disponibles públicamente en Taira durante la verificación. Utilice `request_json("GET", "/status")` para la carga útil de estado del nodo público en Taira.

## Los constructores de instrucciones {#instruction-builders}

El SDK expone los constructores de tipografía para las familias de instrucciones más comunes y una escotilla de escape JSON para variantes que aún no son métodos de primera clase Python. Los fragmentos siguientes son plantillas de transacción mutantes y no fueron presentados al público Taira sin una cuenta de firma.

Prefiere los auxiliares de tipografía cuando existen: normalizan los valores Python y fallan temprano en formas inválidas. Utilice `Instruction.from_json` solo cuando necesite una variante de instrucción que aún no tenga un auxiliar Python.

|Familia de instrucciones |Superficie Python |
| --- | --- |
|Registro .| `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` Está reservado para herramientas de genesis/bootstrap |
|No se registran .|`unregister_trigger`; uso de `Instruction.from_json` para otras variantes |
|La menta y el fuego.|`mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions` |
|Traslado | `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa` |
|Metadatos y controles | `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value` |
|RWA ciclo de vida | `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa` |
|ExecuteTrigger |`execute_trigger` |
|Extensiones de los depósitos y asentamientos | `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp` |
|Bloques de activos nativos |`open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, más los ayudantes del cliente `*_and_wait` |
|Subvención/revocación, SetParameter, registro, costumbre, actualización y variantes menos comunes de registro o no registrado |`Instruction.from_json` o `TransactionBuilder.add_instruction_json` con el código canónico `InstructionBox` JSON |

Para los pagos condicionales de tipo escrow, véase [Native Asset Escrow](/es/blockchain/escrow.md#python-asset-locks). Python expone actualmente a auxiliares de primera clase para bloqueos genéricos de activos; el mercado y los auxiliares anónimos de escrow aún no son métodos de primera clase Python.

### Configurar dominios, luego registrar cuentas y activos {#set-up-domains-then-register-accounts-and-assets}

La creación de dominio ordinario pasa a través del planificador de alias declarativo para que el contrato de arrendamiento SNS, las capacidades del propietario, la guardia de cotización y el estado del dominio se comprueben juntos. Cree una intención libre de secretos `AliasSetupPlanRequestV1` con su SDK o servicio de incorporación, luego use `iroha app alias setup plan` y `iroha app alias setup apply`. No envíe `Instruction.register_domain` a partir de una transacción de aplicación; ese constructor permanece para herramientas genesis/bootstrap.

Después de que el plan de configuración de dominio se comprometa, registre los objetos propiedad del dominio. En una red compartida como Taira, use un espacio de nombres de dominio y cuenta asignado a usted.

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

`mintable` acepta `Infinitely`, `Once`, `Not`, o `Limited(n)` Los valores aceptados por el modelo de datos. `scale` para un activo numérico sin restricciones.

### La menta, la quema y los activos de transferencia {#mint-burn-and-transfer-assets}

Estas llamadas utilizan un activo existente ID. Registrar primero la definición de activo, y luego construir el activo concreto ID para la cuenta que posee el activo.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### Transferencia de propiedad {#transfer-ownership}

Las transferencias de propiedad cambian quién controla el dominio, la definición del activo o NFT. Utilice al propietario actual como autoridad de la transacción.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### Configuración y eliminación de metadatos {#set-and-remove-metadata}

Los valores de metadatos deben ser JSON-serializable. Cuando se utiliza `TransactionDraft`, la autoridad en `TransactionConfig` se convierte en la cuenta objetivo predeterminada.

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

El proyecto de ayuda de alto nivel se dirige por defecto a la autoridad encargada de las operaciones:

```python
draft = TransactionDraft(
    TransactionConfig(chain_id=CHAIN_ID, authority=alice, metadata=TX_METADATA)
)
# With a draft, account metadata methods default to the draft authority.
draft.set_account_key_value("nickname", "Queen Alice")
draft.remove_account_key_value("nickname")
```

### Activos en el mundo real {#real-world-assets}

Los ayudantes de RWA utilizan cargas útiles serializables JSON para los metadatos específicos del activo, la procedencia y la política del controlador. `register_rwa` no acepta un `id` o `owner`: el tiempo de ejecución genera el `RwaId`, y la autoridad de transacción se convierte en propietaria inicial.

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

Después de que la transacción de registro se comprometa, utilice `FindRwas`, `/v1/rwas`, un evento RWA o la ruta del explorador establecida para descubrir el ID generado:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Las operaciones posteriores utilizarán el generado `hash$domain` ID:

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

Las transferencias completas pueden cambiar `owned_by` en el lote existente; las transferencias y fusiones parciales crean lotes de hijos generados.

### Los desencadenantes {#triggers}

Utilice los auxiliares de registro del gatillo cuando el ejecutable es otra secuencia de instrucciones:

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

Torii expone también a los auxiliares REST para el inventario de desencadenantes:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

Las llamadas de inventario del gatillo solo leen o inspeccionan los registros del gatillo. El registro, ejecución, cambios de repetición y no registro son operaciones mutantes.

### Instrucciones de depósito y liquidación {#repo-and-settlement-instructions}

Repo y los auxiliares bilaterales de liquidación añaden variantes de instrucción específicas del dominio sin cargas útiles Norito de fabricación manual:

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

### JSON Escape Hatch (casa de escape) {#json-escape-hatch}

Cuando un Python el ayudante no está disponible todavía, alimentación modelo de datos canónico `InstructionBox` JSON en el `Instruction.from_json` o directamente en `TransactionBuilder.add_instruction_json`. Este es el camino recomendado para `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, Peer/role/NFT el registro, y las variantes no desencadenantes de no registrar hasta que se escriban esos auxiliares.

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

Para las instrucciones generadas o opacas, viaje de ida y vuelta a través de JSON antes de almacenar los dispositivos:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## Flujos de trabajo de las transacciones {#transaction-workflows}

Utilizar `TransactionDraft` para aplicaciones que construyen múltiples instrucciones antes de firmar. Un borrador le permite mantener las configuraciones de nivel de transacción como `ttl_ms`, `nonce` y metadatos en un solo lugar, luego firmar una vez:

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

Exportar un manifiesto determinista para la revisión, auditoría o entrega de billetera:

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

Cuando el carril objetivo lo requiera, adjunta una prueba de privacidad del carril antes de firmar:

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

## Las consultas {#queries}

Los auxiliares de consulta tipografizados devuelven clases de datos en lugar de diccionarios JSON crudos. Son la forma más fácil de comenzar porque el SDK analiza la pagination y los campos de registro comunes para usted:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.query_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Utilice los auxiliares de solicitud genéricos cuando un punto final Torii aún no tenga una envoltura tipografada:

```python
# Drop to raw JSON when you need an endpoint before a typed helper exists.
payload = client.request_json("GET", "/v1/parameters", expected_status=(200,))
metrics = client.get_metrics(as_text=True)
```

Los auxiliares de inventario de cuentas requieren un identificador de cuenta aceptado por el SDK Es un normalizador, usa canónico. I105 cuentas IDs o alias en cadena; si un explorador de bloques o un punto final bruto devuelve un ID que el SDK rechaza, resuelva a un relato canónico ID antes de llamar a estos ayudantes:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## Los acontecimientos {#events}

Descifrar los asistentes de transmisión JSON Cargas útiles por defecto. `with_metadata=True` cuando usted necesita el SSE nombre del evento, identificación, sugerencia de nuevo intento y carga útil cruda. `EventCursor` Los ejemplos esperan para eventos en vivo, Así que ejecutarlos contra un nodo donde el flujo de eventos correspondiente está activado y habilitado.

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

## Las llaves y direcciones {#keys-and-addresses}

El SDK expone los asistentes de firma locales para cada algoritmo de firma compilado en la extensión nativa. Estos ayudantes no llaman a Taira, pero sí requieren la extensión nativa:

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

Utilice `supported_crypto_algorithms()` para ver qué soporta su rueda. Los ayudantes genéricos utilizan etiquetas de algoritmos canónicos y trabajan para Ed25519, secp256k1, ML-DSA, GOST, BLS y SM2 cuando esos algoritmos se compilan en:

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

### Cifrado en chino SM {#chinese-sm-cryptography}

El Python SDK expone los auxiliares genéricos de SM2 y los auxiliares de conveniencia específicos de SM2. Utilice el anuncio de capacidad del nodo para seleccionar el identificador distintivo SM2 esperado por la red objetivo:

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

`crypto.sm.enabled` le dice si el nodo acepta los algoritmos de la familia SM en su política actual. El mismo anuncio incluye la política de hash y el estado de aceleración SM, que es útil para decidir si habilitar flujos específicos de SM2:

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

El público Taira expuso el anuncio de la capacidad SM durante la verificación, pero se desactivó la firma SM allí. Sus algoritmos de firma anunciados eran `ed25519`, `secp256k1` y `bls_normal`, por lo tanto, no envíen transacciones firmadas con SM2 a dicho despliegue a menos que cambie la carga útil de la capacidad.

### GOST y claves post-cuánticas {#gost-and-post-quantum-keys}

Utilice la criptografía genérica API para los conjuntos de parámetros GOST R 34.10-2012 y las firmas post-cuánticas ML-DSA (`ml-dsa`) El mismo objeto de pareja de teclas maneja la firma, verificación y exportación multihash:

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

Puerta GOST y flujos post-cuánticos en los algoritmos de firma anunciados del nodo. Utilice la carga útil de capacidad bruta para nombres de algoritmos compatibles con el futuro:

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

Si un nodo no anuncia el algoritmo que necesita, use la clave solo para flujos de trabajo locales o fuera de línea. No envíe transacciones firmadas con ese algoritmo a ese nodo. Durante la verificación pública Taira, GOST y ML-DSA estaban disponibles como ayudantes de criptomonedas SDK en la biblioteca upstream Python, pero no fueron anunciados por el nodo para firmar transacciones.

## Creación de clientes config-Aware {#config-aware-client-creation}

Utilice `resolve_torii_client_config` cuando su aplicación lee la configuración de nodos de un archivo, pero todavía necesita sobrecargas específicas del entorno o las pruebas:

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

## Preparación de Kagemusha {#kagemusha-readiness}

El Python SDK puede consultar la ruta de preparación corriente JSON a través de su auxiliar genérico de solicitud Torii:

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

Python no expone los constructores de archivos Kagemusha tipografados o redemption Swift o JVM la cartera para construir el canónico V4 archivos, luego enviarlos y sondear a través de un Kagemusha apoyado Torii El cliente.

## Las suscripciones {#subscriptions}

Los asistentes de suscripción son llamadas de servicio mutantes heredadas del cliente compartido Torii utilizado por `iroha_python.ToriiClient`. Utilice IDs y los activos que existen en la red a la que se dirige.

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

## Conectar {#connect}

Construir y analizar Connect URIs, y leer el estado público de Conexión expuesto por Taira:

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

Los codecs de marco, la derivación de llaves de sesión y la creación de sesiones requieren una extensión nativa y una ruta de sesión Connect habilitada:

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

Encripta los mensajes de posaprobación con una sesión de estado:

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

## Gobernanza, tiempo de ejecución y superficies de administración {#governance-runtime-and-admin-surfaces}

Estas llamadas de sólo lectura fueron devueltas con éxito contra el público Taira:

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

Los asistentes de actualización del tiempo de ejecución aceptan la forma manifiesta utilizada por la actualización del momento de ejecución API. Son acciones del operador, así que úsanlas solo contra un nodo donde su cuenta y token estén autorizados:

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

## Estado, consenso y telemetría de red {#status-consensus-and-network-telemetry}

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

## SoraFS, UAID y Kaigi Auxiliares {#sorafs-uaid-and-kaigi-helpers}

Estos auxiliares están disponibles cuando el nodo objetivo expone los puntos finales correspondientes Nexus/SORA. Trate las listas vacías como una respuesta válida: el público Taira puede tener la ruta activada sin datos para el manifiesto de muestra o UAID.

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

## Norito RPC y GPU Auxiliares {#norito-rpc-and-gpu-helpers}

Utilice `NoritoRpcClient` cuando ya tenga bytes de Norito y necesite llamar a un punto final binario Torii. El ejemplo requiere un sobre firmado de una plantilla de transacción anterior:

```python
from iroha_python import NoritoRpcClient, NoritoRpcConfig

# Use the binary RPC client for endpoints that expect Norito bytes.
with NoritoRpcClient(NoritoRpcConfig(TORII_URL, timeout=5.0)) as rpc:
    response_bytes = rpc.call("/v1/transaction", envelope.signed_transaction_versioned)
    print(len(response_bytes))
```

Los asistentes CUDA devuelven `None` cuando el backend no está disponible, por lo que las aplicaciones pueden volver a implementar escalarmente:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## Cobertura actual {#current-coverage}

El Python SDK ya incluye asistentes para:

- Torii flujos de presentación, estado, consulta y administración
- constructores de instrucciones tipográficas para extensiones comunes ISI y específicas de dominio.
- proyectos de transacciones, manifiestos, firmas y flujos de trabajo de envase de transacción firmados
- Eventos de streaming, filtros y cursores reiniciables
- accesos genéricos de preparación Kagemusha y asistentes de suscripción Torii; no se exponen los constructores de recarga y rescate tipografizados
- Dirección de cuenta, asistentes para firmar todos los algoritmos, viajes de ida y vuelta con múltiples hashes, SM2, GOST, ML-DSA, BLS y manejo confidencial de llaves.
- Conectar URIs, sesiones, marcos, ayudantes de cifrado y administrador del registro.
- gobernanza, actualización del tiempo de ejecución, Sumeragi, node-admin, SoraFS, UAID y Kaigi envolturas de puntos finales en las que el nodo exponga estas características

## Referencias de aguas arriba {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

Dichos archivos son la fuente de verdad para la superficie Python en la revisión del espacio de trabajo fijado.
