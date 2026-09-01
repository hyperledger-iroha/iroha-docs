---
translation_locale: es
translation_source: /guide/tutorials/python.md
translation_source_hash: d0ecbade221ceba455730e80c6e12db930c65a4cbcf9e643c1c2d4cba47b0940
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Python {#python}

El Python SDK en el espacio de trabajo ascendente es `iroha-python`. La primera versión de Iroha 3 apunta a las superficies actuales Torii y Norito. Fije la versión del paquete o la revisión de la fuente utilizada por su integración para que el SDK y el nodo permanezcan en la misma revisión del formato de serialización.

Los ejemplos de lectura anónima siguientes usan la Taira pública en `https://taira.sora.org`. Una ruta puede ser de solo lectura y, aun así, exigir una firma de cuenta canónica o una firma exacta del operador de la red; esos ejemplos se marcan por separado. Los ejemplos que modifican el estado son plantillas de transacción y requieren una autoridad real de Taira, una clave privada, una intención tipada de pago de tarifa, suficientes XOR de testnet y la autenticación que exija la ruta de destino antes de enviarlos.

Usa los ejemplos en este orden:

|Escenario|¿Correr contra público Taira?|Lo que necesitas|
| --------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
|Llamadas de lectura anónimas|Sí| Python paquete más acceso a la red|
|Lecturas autenticadas por cuenta u operador|Solo con tu identidad admitida|Exacto Taira `NetworkId` y la clave de cuenta u operador correspondiente|
|Constructores locales de señalización e instrucciones|No hay llamada de red hasta `submit()`|Extensión nativa y tu material de clave|
|Transacciones y llamadas de servicio que mutan|Solo con tu propia cuenta financiada|cuenta principal de autorización, clave privada, exacto Taira `NetworkId`, intención de tarifa escrita, saldo de activo de tarifa, y tokens de ruta|
|Conectar códecs de marco, criptografía y ayudantes GPU|Solo local|Extensión nativa; los ayudantes GPU también necesitan un backend capaz de CUDA|

## Instalar {#install}

El nombre de los metadatos del paquete es `iroha-python`. No asuma que una instalación sin fijar PyPI coincide con la red en vivo Taira. Instale una copia funcional en wheel o código fuente que se haya construido a partir de la misma revisión ascendente a la que apunta su integración:

```bash
python -m pip install /path/to/iroha_python-*.whl
```

Si su proyecto usa directamente el espacio de trabajo de origen, instale las dependencias de Python y compile la extensión nativa antes de ejecutar ejemplos que utilicen `Instruction`, `TransactionDraft`, firmas, criptografía, asistentes nativos de SoraFS, asistentes de GPU o códecs de tramas Connect. Use el comando de compilación del archivo `python/iroha_python/README.md` de origen y compruebe después que se carguen las exportaciones nativas:

```bash
cd python/iroha_python
python - <<'PY'
from iroha_python import Instruction, generate_ed25519_keypair

print(Instruction)
print(generate_ed25519_keypair().public_key.hex())
PY
```

Si `create_torii_client` se importa pero `Instruction` o `generate_ed25519_keypair` falla, el paquete puro Python está disponible pero la extensión nativa no lo está.

## Inicio rápido {#quickstart}

Comience con los endpoints públicos de solo lectura Taira API:

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

Use esta configuración para las plantillas mutantes. Sustituya cada marcador de posición con un Taira principal de autorización, clave privada, token y IDs de activos/cuenta de su despliegue antes de enviar.

`authority` es la cuenta que firma la transacción y `private_key` debe coincidir con ella. Las transacciones se enlazan con el `NetworkId` derivado del génesis exacto de Taira; la cadena UUID es una etiqueta de implementación, no una identidad de transacción. Las tarifas utilizan un intento de pago escrito y una cotización en vivo exacta, independientemente de los metadatos de la aplicación. Los marcadores de posición de cuenta y clave a continuación son intencionalmente inválidos para que no se envíen por accidente.

El literal a continuación es la identidad de génesis de blockchain Taira actualmente fijada. Un reinicio de testnet puede cambiarla, así que actualízala desde el perfil de implementación firmado y nunca la infieras de la cadena UUID.

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

`Instruction.*` solo llama a cargas útiles de instrucción de construcción. `submit()` es el punto donde SDK obtiene la estimación del precio de la tarifa en vivo, firma la carga útil exactamente cotizada, la envía a Torii y espera un estado.

## Tarifas y costo de ejecución de transacciones {#fees-and-gas}

Las transacciones de escritura necesitan un `FeePaymentIntent` tipeado y un saldo de activo de tarifa financiado. En Taira, el servicio público de financiación de la red de prueba financia XOR de la red de prueba. El Python SDK envía el fijo sin firmar carga útil a Torii para una estimación exacta del precio de la tarifa, valida que la cotización no haya sustituido al pagador o la carga útil, y firma la intención cotizada. No ponga la selección de tarifas en los metadatos de la transacción.

El asistente `submit()` anterior comienza con una intención pagada por la autoridad cuyos límites de cargo están intencionalmente vacíos. `quote_and_sign()` los completa desde la cotización en vivo antes de firmar:

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

Antes de enviar escrituras, asegúrate de que la cuenta principal de autorización posee suficiente del activo de tarifa. El servicio exacto de financiamiento de testnet y el ID del activo son específicos de la red; esta es la forma Taira:

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

El servicio de financiamiento de la red de prueba devuelve el `asset_id` concreto para usar en la verificación del saldo. Verifique que la cotización en vivo cobre `FEE_ASSET_DEFINITION`; la transacción no selecciona ese activo a través de los metadatos.

Los metadatos de la aplicación son opcionales y no tienen semántica de tarifas:

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

Si omites la intención de la tarifa, aceptas una cotización para un activo inesperado, alteras la carga útil después de cotizar o firmas con una cuenta sin fondos, la transacción no debe ser enviada.

## Anónimo Taira Lee {#anonymous-taira-reads}

Estas llamadas utilizan rutas Taira cuyo límite de catálogo admite lecturas anónimas:

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

`/v1/time/status` y cada vista de datos puntual del operador `/v1/sumeragi/*` requieren una firma exacta del operador de red aunque no muten el estado. Use `request_json("GET", "/status")` para el nodo anónimo carga útil de estado y la configuración del operador a continuación para diagnósticos de consenso o del reloj local del nodo. El estado de la sesión de conexión es una ruta de protocolo separada y requiere el token de gestión de esa sesión.

## Constructores de instrucciones {#instruction-builders}

El SDK expone constructores tipados para las familias de instrucciones más comunes y una salida de escape JSON para variantes que aún no son métodos Python de primera clase. Los siguientes fragmentos son plantillas de transacciones mutantes y no fueron enviados al público Taira sin una cuenta firmante.

Prefiere los auxiliares tipados cuando existan: normalizan los valores Python y fallan rápidamente con formas inválidas. Usa `Instruction.from_json` solo cuando necesites una variante de instrucción que aún no tenga un auxiliar Python.

|Familia de instrucciones| Python superficie|
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|Registrarse| `register_account`, `register_asset_definition_numeric`, `register_rwa`, `register_time_trigger`, `register_precommit_trigger`; `register_domain` está reservado para herramientas de génesis/bootstrap |
|Cancelar registro| `unregister_trigger`; use `Instruction.from_json` para otras variantes|
|Acuñar/Quemar| `mint_asset_numeric`, `burn_asset_numeric`, `mint_trigger_repetitions`, `burn_trigger_repetitions`                                                                                          |
|Transferir| `transfer_asset_numeric`, `transfer_domain`, `transfer_asset_definition`, `transfer_nft`, `transfer_rwa`, `force_transfer_rwa`                                                              |
|Metadatos y controles| `set_account_key_value`, `remove_account_key_value`, `set_rwa_controls`, `set_rwa_key_value`, `remove_rwa_key_value`                                                                        |
| RWA ciclo de vida| `merge_rwas`, `redeem_rwa`, `freeze_rwa`, `unfreeze_rwa`, `hold_rwa`, `release_rwa`|
| ExecuteTrigger | `execute_trigger` |
|Extensiones de repos/compensación| `repo_initiate`, `repo_unwind`, `repo_margin_call`, `settlement_dvp`, `settlement_pvp`                                                                                                      |
|Bloqueos de activos nativos| `open_asset_lock`, `drawdown_asset_lock`, `cancel_asset_lock`, `expire_asset_lock`, más los ayudantes del cliente `*_and_wait`|
|Conceder/Revocar, SetParameter, Registro, Personalizado, Actualizar, y variantes menos comunes de registrar/dar de baja| `Instruction.from_json` o `TransactionBuilder.add_instruction_json` con canónico `InstructionBox` JSON |

Para los pagos condicionales al estilo escrow, consulte [Custodia de Activos Nativos](/es/blockchain/escrow.md#python-asset-locks). Python actualmente expone ayudantes de primera clase para bloqueos de activos genéricos; los ayudantes de mercado y de escrow anónimos aún no son métodos de primera clase Python.

### Configurar dominios, luego registrar cuentas y activos {#set-up-domains-then-register-accounts-and-assets}

La creación de dominios ordinaria pasa por el planificador de alias declarativo, por lo que se verifican juntos el arrendamiento SNS, las capacidades del propietario, la protección de cotización y el estado del dominio. Cree un intent `AliasSetupPlanRequestV1` sin secretos con su SDK o servicio de incorporación, luego use `iroha app alias setup plan` y `iroha app alias setup apply`. No envíe `Instruction.register_domain` desde una transacción de aplicación; ese generador permanece para herramientas de génesis/bootstrap.

Después de que se confirme el plan de configuración del dominio, registre los objetos propiedad del dominio. En una red compartida como Taira, use un dominio y un espacio de nombres de cuenta que le hayan sido asignados.

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

`mintable` acepta valores `Infinitely`, `Once`, `Not` o `Limited(n)` aceptados por el modelo de datos. Omita `scale` para un activo numérico sin restricciones.

### emitir, quemar y transferir activos {#mint-burn-and-transfer-assets}

Estas llamadas utilizan un ID de activo existente. Registre primero la definición del activo y luego construya el ID concreto del activo para la cuenta que posee el activo.

```python
# Increase the account's asset balance.
submit(Instruction.mint_asset_numeric(ROSE_ASSET, "100.00"))

# Move part of the balance to another account.
submit(Instruction.transfer_asset_numeric(ROSE_ASSET, "25.50", bob))

# Decrease the remaining balance.
submit(Instruction.burn_asset_numeric(ROSE_ASSET, "10.00"))
```

### Transferir propiedad {#transfer-ownership}

Las transferencias de propiedad cambian quién controla el dominio, la definición del activo o NFT. Use al propietario actual como el principal de autorización de la transacción.

```python
# The first argument is the current owner; the last is the new owner.
submit(Instruction.transfer_domain(alice, "wonderland", bob))
submit(Instruction.transfer_asset_definition(alice, ROSE_DEFINITION, bob))
submit(Instruction.transfer_nft(alice, BADGE_NFT, bob))
```

### Establecer y eliminar metadatos {#set-and-remove-metadata}

Los valores de metadatos deben ser serializables JSON. Cuando usa `TransactionDraft`, el principal de autorización en `TransactionConfig` se convierte en la cuenta objetivo predeterminada.

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

El asistente de borrador de alto nivel apunta al principal de autorización de transacciones por defecto:

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

### Activos del mundo real {#real-world-assets}

RWA los asistentes usan cargas útiles JSON-serializables para metadatos específicos de activos, procedencia y política de control. `register_rwa` no acepta un `id` ni un `owner`: el tiempo de ejecución del software genera el `RwaId`, y el principal de autorización de la transacción se convierte en el propietario inicial.

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

Después de que la transacción de registro se confirme, use `FindRwas`, `/v1/rwas`, un evento RWA o la ruta del explorador configurada para descubrir el ID generado:

```python
page = client.list_rwas_typed(limit=20, offset=0)

for lot in page.items:
    print(lot.id)
```

Las operaciones posteriores usan el ID generado `hash$domain`:

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

Las transferencias completas pueden cambiar `owned_by` en el lote existente. Las transferencias parciales y las fusiones crean lotes hijos generados.

### Desencadenantes {#triggers}

Use los asistentes de registro de disparadores cuando el ejecutable sea otra secuencia de instrucciones:

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

Torii también expone los ayudantes de REST para activar el inventario:

```python
# Inventory helpers are reads; they do not unregister or execute triggers.
registered = client.list_triggers_typed(limit=20)
for trigger in registered.items:
    print(trigger.id, trigger.authority)

details = client.get_trigger_typed("precommit_reward")
```

Las llamadas de inventario de disparadores solo leen o inspeccionan los registros de disparadores. El registro, la ejecución, los cambios de repetición y la anulación del registro son operaciones de mutación.

### Instrucciones de Repos y Liquidación {#repo-and-settlement-instructions}

Los ayudantes de repositorio y de liquidación bilateral añaden variantes de instrucciones específicas del dominio sin crear manualmente cargas Norito:

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

### JSON Escotilla de escape {#json-escape-hatch}

Cuando un asistente Python no esté disponible, introduzca los JSON del modelo de datos canónico `InstructionBox` en `Instruction.from_json`. Este es el camino recomendado para `Grant`, `Revoke`, `SetParameter`, `Log`, `Custom`, `Upgrade`, registro de pares/roles/NFT, y variantes de baja no activadora hasta que se escriban esos ayudantes.

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

Mantenga la ruta de borrador escrita en el límite de la transacción: esto conserva exactamente `NetworkId`, la intención de pago de la comisión y el invariante de cotización antes de la firma. El uso directo de `TransactionBuilder` requiere los mismos valores más la validación explícita de una cotización activa, por lo que no es un atajo para el código de la aplicación.

Para instrucciones generadas u opacas, haga un viaje de ida y vuelta a través de JSON antes de almacenar los artefactos de prueba:

```python
# Round trips are useful for validating fixtures generated by another tool.
payload = Instruction.mint_asset_numeric(ROSE_ASSET, "1").to_json()
same_instruction = Instruction.from_json(payload)
print(same_instruction.as_dict())
```

## Flujos de trabajo de transacciones {#transaction-workflows}

Use `TransactionDraft` para aplicaciones que construyen múltiples instrucciones antes de firmar. Un borrador te permite mantener configuraciones a nivel de transacción como `ttl_ms`, `nonce` y metadatos en un solo lugar, y luego firmar una vez:

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

Exporte un manifiesto técnico determinista para revisión, auditoría o entrega de cartera:

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

Adjuntar una prueba de privacidad de la vía de ejecución antes de firmar cuando la vía de ejecución objetivo lo requiera:

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

## Consultas {#queries}

Los ayudantes de consultas tipeadas devuelven dataclasses en lugar de diccionarios en bruto JSON. Son la forma más fácil de empezar porque el SDK analiza la paginación y los campos comunes de los registros por ti:

```python
# Typed pages expose `.items` plus pagination metadata such as `.total`.
accounts = client.list_accounts_typed(limit=25, sort="id")
for account in accounts.items:
    print(account.id, account.metadata)

domains = client.list_domains_typed(limit=10)
definitions = client.list_asset_definitions_typed(limit=10)
print(domains.total, definitions.total)
```

Utilice los ayudantes de solicitud genéricos cuando un endpoint Torii API aún no tenga un adaptador de software tipado:

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

Los auxiliares de inventario de cuentas requieren un identificador de cuenta aceptado por el normalizador de SDK. Utilice IDs de cuenta canónicos de I105 o alias en la cadena; si un explorador de bloques o un endpoint sin procesar API devuelve un ID que el SDK rechaza, resuélvelo a un ID de cuenta canónica antes de llamar a estos asistentes:

```python
# These helpers expect a canonical account ID or an alias the SDK can normalize.
assets = client.list_account_assets_typed(alice, limit=10)
transactions = client.query_account_transactions_typed(alice, limit=5)
permissions = client.list_account_permissions_typed(alice, limit=20)

print(len(assets.items), len(transactions.items), len(permissions.items))
```

## Eventos {#events}

Los ayudantes de transmisión decodifican cargas útiles JSON por defecto. Pase `with_metadata=True` cuando necesite el nombre del evento SSE, id, sugerencia de reintento y carga útil sin procesar. La fuente canónica `/v1/events/sse` es solo en vivo: no emite IDs de repetición y no conserva ningún registro de repetición, por lo que estos ayudantes no exponen ningún cursor ni argumento de reanudación. Una reconexión inicia una nueva suscripción y puede tener un intervalo; use `/v1/blocks/stream` desde una altura conocida cuando se requiera el historial completo del libro mayor de la cadena de bloques. Estos ejemplos esperan eventos en vivo, por lo que ejecútelos en un nodo donde la transmisión esté habilitada y activa.

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

## Llaves y Direcciones {#keys-and-addresses}

El SDK expone ayudantes de firma locales para cada algoritmo de firma compilado en la extensión nativa. Estos ayudantes no llaman a Taira, pero sí requieren la extensión nativa:

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

Usa `supported_crypto_algorithms()` para ver qué admite tu rueda. Los ayudantes genéricos usan etiquetas de algoritmo canónicas y funcionan con Ed25519, secp256k1, ML-DSA, GOST, BLS y SM2 cuando esos algoritmos están compilados:

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

### Criptografía china SM {#chinese-sm-cryptography}

El Python SDK expone tanto los ayudantes genéricos SM2 como los ayudantes de conveniencia específicos de SM2. Use el anuncio de capacidad del nodo para elegir el identificador distintivo SM2 esperado por la red de destino:

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

`crypto.sm.enabled` te indica si el nodo acepta algoritmos de la familia SM en su política actual. El mismo anuncio incluye la política de hash criptográfico SM y el estado de aceleración, lo cual es útil al decidir si habilitar flujos específicos de SM2:

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

Trate la carga útil de capacidad autenticada como autorizada para el nodo desplegado. No envíe una transacción firmada con SM2 a menos que `crypto.sm.enabled` sea verdadero y la política de firma anunciada lo permita.

### GOST y Claves Post-Cuánticas {#gost-and-post-quantum-keys}

Utilice el cifrado genérico API para los conjuntos de parámetros GOST R 34.10-2012 y ML-DSA (`ml-dsa`) de firmas post-cuánticas. El mismo objeto de par de claves maneja la firma, la verificación y la exportación de multihash:

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

Puerta GOST y flujos post-cuánticos en la publicidad de capacidades autenticada y tipada del nodo:

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

Si un nodo no anuncia el algoritmo que necesitas, usa la clave solo para flujos de trabajo locales o fuera de línea. No envíes transacciones firmadas con ese algoritmo a ese nodo. Durante la verificación pública Taira, GOST y ML-DSA estaban disponibles como ayudantes de criptografía SDK en la biblioteca Python aguas arriba, pero no fueron anunciados por el nodo para la firma de transacciones.

## Creación de Cliente Consciente de la Configuración {#config-aware-client-creation}

Use `resolve_torii_client_config` cuando su aplicación lee la configuración del nodo desde un archivo pero aún necesita anular configuraciones específicas del entorno o de prueba:

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

El Python SDK puede consultar la ruta de disponibilidad actual de JSON a través de su ayudante de solicitudes genérico Torii:

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

Python no expone constructores de archivos de recarga o redención Kagemusha tipados. Utiliza una billetera Swift o JVM tipada para construir los archivos canónicos V4, luego envíalos y consúltalos a través de un cliente Kagemusha Torii compatible.

## Suscripciones {#subscriptions}

Las lecturas de suscripción y los generadores de borradores se heredan del cliente compartido Torii utilizado por `iroha_python.ToriiClient`. Cada mutación se admite con una firma de cuenta canónica vinculada al cuerpo y devuelve un borrador de transacción no firmado. Torii nunca acepta una clave privada y no envía el borrador por usted.

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

Proporcione cada carga útil exacta y el mensaje de firma a la billetera local de la cuenta correspondiente, verifique la operación solicitada allí, arme la transacción firmada y envíela a través del proceso normal de procesamiento de transacciones. El Python SDK valida que el mensaje de firma sea el hash criptográfico canónico de la carga útil devuelta, pero la billetera sigue siendo responsable de decodificar y aprobar la transacción antes de firmarla.

## Conectar {#connect}

Construye y analiza Connect URIs localmente. Una identidad Connect vincula el SID con el `NetworkId` exacto, la clave pública de la aplicación y el valor de nonce criptográfico:

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

Registra esa vista previa exacta solo cuando el nodo objetivo exponga Connect. La creación de la sesión devuelve cuatro tokens portador específicos según el rol. La ruta de estado por sesión requiere el token de gestión; el estado agregado es una ruta de operador.

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

Cifre los mensajes posteriores a la aprobación con una sesión con estado:

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

## Gobernanza, tiempo de ejecución del software y superficies de administración {#governance-runtime-and-admin-surfaces}

Las lecturas de gobernanza están autenticadas por la cuenta. Usando el principio de autorización y el par de claves de [Configuración compartida](#shared-setup), vincule cada llamada auxiliar al `NetworkId` derivado del génesis exacto de Taira:

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

Cree un cliente separado para lecturas de operadores. Cargue la clave de operador en la lista de permitidos en tiempo de ejecución del software y asígnela al Taira exacto de `NetworkId`; los tokens de portador y `x-api-token` no reemplazan esta firma:

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

Las rutas de actualización en tiempo de ejecución son constructores de instrucciones autenticados por el operador. Una propuesta, activación o cancelación exitosa devuelve `tx_instructions`; no realiza la actualización. Envíe ese paquete a través de la ruta normal de transacción firmada y gobernanza. Los métodos fijados Python `propose_runtime_upgrade`, `activate_runtime_upgrade` y `cancel_runtime_upgrade` actualmente emiten solicitudes simples en lugar de aplicar el `OperatorSigningContext` del cliente, por lo que este tutorial no los presenta como un flujo de operador funcional.

## Estado, Consenso y Telemetría de Red {#status-consensus-and-network-telemetry}

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

## SoraFS, UAID y Kaigi Ayudantes {#sorafs-uaid-and-kaigi-helpers}

Estos ayudantes están disponibles cuando el nodo objetivo expone los endpoints correspondientes Nexus/SORA API. Trate las listas vacías como una respuesta válida: el público Taira puede tener la ruta habilitada sin datos para el manifiesto técnico de muestra o UAID.

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

## Norito RPC y GPU Ayudantes {#norito-rpc-and-gpu-helpers}

Use `NoritoRpcClient` cuando ya tienes Norito bytes y necesitas llamar a un endpoint binario Torii API. El ejemplo requiere un contenedor de datos firmado de una plantilla de transacción anterior:

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

CUDA los ayudantes devuelven `None` cuando el backend no está disponible, para que las aplicaciones puedan recurrir a implementaciones escalares:

```python
from iroha_python import bn254_add_cuda, cuda_available, poseidon2_cuda

# Always probe CUDA availability before calling optional GPU helpers.
if cuda_available():
    print(poseidon2_cuda(1, 2))
    print(bn254_add_cuda((1, 0, 0, 0), (2, 0, 0, 0)))
```

## Cobertura Actual {#current-coverage}

El Python SDK ya incluye asistentes para:

- Torii envíos, estado, consultas y flujos de administración
- constructores de instrucciones tipadas para extensiones comunes ISI y específicas de dominio
- borradores de transacciones, manifiestos técnicos, firma y flujos de trabajo de contenedores de datos de transacciones firmadas
- transmisiones de eventos en vivo y filtros tipeados; las transmisiones de bloques comprometidos proporcionan historial completo
- acceso genérico a preparación de Kagemusha y ayudantes de suscripción Torii; los constructores tipados de recarga y redención no están expuestos
- dirección de cuenta, auxiliares de firma para todos los algoritmos, viajes de ida y vuelta de multihash, SM2, GOST, ML-DSA, BLS, y manejo de claves confidenciales
- Conectar URIs, sesiones, marcos, asistentes de cifrado y administrador del registro
- gobernanza, actualización del tiempo de ejecución del software, Sumeragi, administrador de nodo, SoraFS, UAID y Kaigi API adaptadores de software de punto de conexión donde el nodo expone esas funciones

## Referencias ascendentes {#upstream-references}

- `python/iroha_python/README.md`
- `python/iroha_python/DESIGN.md`
- `python/iroha_python/src/iroha_python`

Esos archivos son la fuente de verdad para la superficie Python en la revisión del espacio de trabajo fijado.
