---
translation_locale: es
translation_source: /cookbook/multisig.md
translation_source_hash: 7fca7feca0c27d41a14d1c38497c23aa9f1afe37c5ac19cd8e79c487dc35cc5e
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Multisig ponderado {#weighted-multisig}

## Resultado {#outcome}

Registre una cuenta multisig ponderada de tres miembros en Taira, proponga una instrucción de metadatos, apruébela con suficiente peso para alcanzar el quórum y verifique la ejecución desde el estado de la cuenta multisig.

## Requisitos previos {#prerequisites}

- Tres identificaciones de firmante canónicas I105 en `SIGNER_A`, `SIGNER_B` y `SIGNER_C`.
- Se financiaron las configuraciones Taira para los firmantes criptográficos A y C. El proponente y cada aprobador pagan por su propia transacción.
- Las escrituras del CLI usan `--fee-payer authority`; el CLI cotiza la tarifa exacta, en el activo de tarifa de Taira, antes de firmar.
- Un proyecto de cliente Rust que depende de `iroha` y `iroha_model_base`, fijado a la misma revisión de fuente Iroha que Taira, para el paso de registro. Los pasos posteriores de propuesta y aprobación utilizan el CLI.
- La función multisig del ejecutor actual está habilitada. El registro está disponible para cuentas ordinarias en el tiempo de ejecución de software predeterminado Iroha 3, aunque la política Taira y la admisión de tarifas aún se aplican; use localnet si el despliegue público lo niega.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Pasos {#steps}

### 1. Registrar una póliza ponderada {#_1-register-a-weighted-policy}

El firmante criptográfico C tiene peso 2; A y B tienen peso 1 cada uno. Un quórum de 3 por lo tanto requiere a C más A o B. Aquí `registrar` es un `iroha::blocking::Client`, cuyo `submit` espera la finalidad aplicada. Derive la cuenta canónica a partir de esa política exacta antes del registro, luego pase el mismo valor a `MultisigRegister::with_account`:

```rust
use std::{collections::BTreeMap, num::{NonZeroU16, NonZeroU64}};
use iroha::{
    data_model::{
        account::{MultisigMember, MultisigPolicy},
        prelude::*,
        transaction::FeePaymentIntent,
    },
    executor_data_model::isi::multisig::{
        MultisigApprove, MultisigProposalId, MultisigProposalNonce,
        MultisigPropose, MultisigRegister, MultisigSpec,
    },
};
use iroha_model_base::domain::DomainId;

let spec = MultisigSpec::new(
    BTreeMap::from([
        (signer_a.clone(), 1),
        (signer_b.clone(), 1),
        (signer_c.clone(), 2),
    ]),
    NonZeroU16::new(3).unwrap(),
    NonZeroU64::new(3_600_000).unwrap(),
);
let members = spec
    .signatories
    .iter()
    .map(|(account, weight)| {
        let key = account
            .controller()
            .single_signatory()
            .expect("multisig members must be single-key accounts");
        MultisigMember::new(key.clone(), u16::from(*weight))
            .expect("weights are nonzero")
    })
    .collect();
let policy = MultisigPolicy::new(spec.quorum.get(), members)?;
let multisig_account = AccountId::new_multisig(policy);
let register = MultisigRegister::with_account(
    multisig_account.clone(),
    None::<DomainId>,
    spec,
);

registrar.submit::<InstructionBox>(
    register.into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
println!("{}", multisig_account.canonical_i105()?);
```

Guarde el valor impreso para los pasos CLI:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

En el commit fijado, el comando de registro CLI imprime su semilla temporal antes de que el tiempo de ejecución del software le asigne una clave nueva. No reutilice esa semilla como el controlador. No existe una clave privada del controlador: la autoridad multisig proviene únicamente de propuestas aprobadas. Para registrar en su lugar desde el CLI, pase el valor derivado de la política a `ledger multisig register --account`.

### 2. Construye una instrucción sin enviarla {#_2-build-one-instruction-without-submitting-it}

El interruptor global `--emit-instructions` imprime la matriz de instrucciones en la salida estándar en lugar de enviarla, por lo que no gasta ninguna tarifa.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" --emit-instructions \
    account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Proponer como firmante criptográfico A {#_3-propose-as-signer-a}

El proponente contribuye automáticamente con su propio peso. Genere un nonce de propuesta nuevo y consérvelo para cualquier reintento. Capture el ID de la propuesta y el hash criptográfico de la instrucción impresos por el CLI; las aprobaciones se vinculan a ambos.

```bash
PROPOSAL_NONCE="$(openssl rand -hex 32)"
PROPOSE_OUTPUT="$({
  iroha --config "$SIGNER_A_CONFIG" \
    --output-format text \
    --fee-payer authority \
    ledger multisig propose \
    --proposal-nonce "$PROPOSAL_NONCE" \
    --account "$MULTISIG_ACCOUNT" \
    < multisig-instructions.json
})"
printf '%s\n' "$PROPOSE_OUTPUT"

PROPOSAL_ID="$({
  printf '%s\n' "$PROPOSE_OUTPUT" |
    sed -n 's/^proposal_id: //p' |
    head -n 1
})"
INSTRUCTIONS_HASH="$({
  printf '%s\n' "$PROPOSE_OUTPUT" |
    sed -n 's/^instructions_hash: //p' |
    head -n 1
})"
test -n "$PROPOSAL_ID"
test -n "$INSTRUCTIONS_HASH"
```

Enumere la propuesta aún pendiente con un selector finito explícito:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. Aprobar como firmante criptográfico C {#_4-approve-as-signer-c}

El peso 1 de A más el peso 2 de C alcanza el quórum 3 y ejecuta la instrucción propuesta como la cuenta multisig.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --proposal-id "$PROPOSAL_ID" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

El cliente Rust puede continuar con la misma cuenta derivada de la política y las dos instrucciones de ciclo de vida utilizadas arriba. Cada cliente firmante es un `iroha::blocking::Client`; el ID de la propuesta se deriva de la red del cliente, la cuenta multisig y un nonce nuevo:

```rust
let instructions = vec![SetKeyValue::account(
    multisig_account.clone(),
    "cookbook_quorum".parse()?,
    Json::from("approved"),
).into()];
let instructions_hash = HashOf::new(&instructions);
// A fresh nonzero nonce, for example from `openssl rand -hex 32`.
let proposal_nonce: MultisigProposalNonce = "<FRESH_64_HEX_NONCE>".parse()?;
let proposal_id = MultisigProposalId::derive(
    signer_a_client.client().network_id(),
    &multisig_account,
    &proposal_nonce,
);
signer_a_client.submit::<InstructionBox>(
    MultisigPropose::new(
        multisig_account.clone(),
        proposal_nonce,
        instructions,
        None,
    )
    .into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
signer_c_client.submit::<InstructionBox>(
    MultisigApprove::new(multisig_account, proposal_id, instructions_hash)
        .into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## Verificar {#verify}

Lea el estado posterior y confirme que la propuesta ya no está pendiente:

```bash
iroha --config "$SIGNER_A_CONFIG" account meta get \
  --id "$MULTISIG_ACCOUNT" \
  --key cookbook_quorum

iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"

iroha --config "$SIGNER_A_CONFIG" ledger multisig inspect \
  --account "$MULTISIG_ACCOUNT" \
  --json |
  jq .
```

El valor de los metadatos debe ser `"approved"`, el ID de propuesta y el hash criptográfico de la instrucción capturados ya no deben aparecer como pendientes, y el controlador inspeccionado debe mostrar `threshold` `3`, `total_weight` `4` y pesos de miembros 1, 1 y 2; los miembros se enumeran en el orden de sus claves públicas.

## Solución de problemas {#troubleshooting}

- `not qualified to propose multisig` o `not qualified to approve multisig` significa que el cliente que propone o aprueba no corresponde a uno de los ID I105 registrados en la política.
- Una aprobación final puede ser rechazada cuando la cuenta multisig carece de permiso para ejecutar las instrucciones propuestas. Conceda el principal de autorización a la cuenta multisig, no únicamente a sus firmantes criptográficos individuales, luego permita que un firmante criptográfico restante lo intente de nuevo.
- Una propuesta pendiente que falta puede significar que ya se alcanzó el quórum, que el TTL caducó o que se utilizó un ID de propuesta, un hash de instrucción o un selector de cuenta incorrecto. Consulte el estado posterior antes de proponer de nuevo con un nonce nuevo.
- Las aprobaciones duplicadas no suman peso. Cada firmante registrado contribuye con su peso configurado como máximo una vez.
- Está prohibido firmar directamente una transacción normal como el controlador. Siempre use `MultisigPropose` y `MultisigApprove`.
- Si los comandos posteriores no pueden encontrar la cuenta impresa durante el registro CLI, capturaste la semilla temporal. Deriva la cuenta canónica a partir de la política ordenada y regístrala con ese valor como se muestra arriba.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Pruebas de integración de Multisig en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/multisig.rs)
- [Modelo de datos multisig en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/isi.rs)
- [CLI implementación multisig en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Transacciones](/es/blockchain/transactions.md)
- [Permisos y roles](./permissions-and-roles.md)
