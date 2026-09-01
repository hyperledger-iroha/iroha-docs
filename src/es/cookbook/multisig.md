---
translation_locale: es
translation_source: /cookbook/multisig.md
translation_source_hash: e1b57e1c4310dd0db8be8d9f5a15e1d4f693abb90b634772857eb4b1e86e4baf
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Multisig ponderado {#weighted-multisig}

## Resultado {#outcome}

Registre una cuenta multisig ponderada de tres miembros en Taira, proponga una instrucción de metadatos, apruébela con suficiente peso para alcanzar el quórum y verifique la ejecución desde el estado de la cuenta multisig.

## Requisitos previos {#prerequisites}

- Tres identificaciones de firmante canónicas I105 en `SIGNER_A`, `SIGNER_B` y `SIGNER_C`.
- Se financiaron las configuraciones Taira para los firmantes criptográficos A y C. El proponente y cada aprobador pagan por su propia transacción.
- `taira.tx-metadata.json` construido a partir de la respuesta del servicio de financiamiento de la red de pruebas actual, nunca a partir de un ID de activo de tarifa copiado.
- Un proyecto de cliente Rust fijado a la misma revisión de fuente Iroha que Taira para el paso de registro. Los pasos posteriores de propuesta y aprobación utilizan el CLI.
- La función multisig del ejecutor actual está habilitada. El registro está disponible para cuentas ordinarias en el tiempo de ejecución de software predeterminado Iroha 3, aunque la política Taira y la admisión de tarifas aún se aplican; use localnet si el despliegue público lo niega.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Pasos {#steps}

### 1. Registrar una póliza ponderada {#_1-register-a-weighted-policy}

El firmante criptográfico C tiene peso 2; A y B tienen peso 1 cada uno. Un quórum de 3 por lo tanto requiere a C más A o B. Derive la cuenta canónica a partir de esa política exacta antes del registro, luego pase el mismo valor a `MultisigRegister::with_account`:

```rust
use std::{collections::BTreeMap, num::{NonZeroU16, NonZeroU64}};
use iroha::{
    data_model::{
        account::{MultisigMember, MultisigPolicy},
        prelude::*,
        transaction::FeePaymentIntent,
    },
    executor_data_model::isi::multisig::{
        MultisigApprove, MultisigPropose, MultisigRegister, MultisigSpec,
    },
};

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

registrar.submit_blocking::<InstructionBox>(
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

En el commit fijado, el comando de registro CLI imprime su semilla temporal antes de que el tiempo de ejecución del software la vuelve a cifrar. No reutilice esa semilla como el controlador. No existe una clave privada del controlador: el principal de autorización multisig proviene únicamente de propuestas aprobadas.

### 2. Construye una instrucción sin enviarla {#_2-build-one-instruction-without-submitting-it}

El interruptor global `-o` serializa una matriz de instrucciones en la salida estándar. No envía una transacción y, por lo tanto, no gasta ninguna tarifa.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Proponer como firmante criptográfico A {#_3-propose-as-signer-a}

El proponente contribuye automáticamente con su propio peso. Capture el hash criptográfico de la instrucción exacta impreso por el CLI; las aprobaciones se vinculan a ese hash criptográfico.

```bash
PROPOSE_OUTPUT="$({
  iroha --config "$SIGNER_A_CONFIG" \
    --output-format text \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger multisig propose \
    --account "$MULTISIG_ACCOUNT" \
    < multisig-instructions.json
})"
printf '%s\n' "$PROPOSE_OUTPUT"

INSTRUCTIONS_HASH="$({
  printf '%s\n' "$PROPOSE_OUTPUT" |
    sed -n 's/^instructions_hash: //p' |
    head -n 1
})"
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
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

El cliente Rust puede continuar con la misma cuenta derivada de la póliza y las dos instrucciones de ciclo de vida utilizadas arriba:

```rust
let instructions = vec![SetKeyValue::account(
    multisig_account.clone(),
    "cookbook_quorum".parse()?,
    Json::from("approved"),
).into()];
let instructions_hash = HashOf::new(&instructions);
signer_a_client.submit_blocking::<InstructionBox>(
    MultisigPropose::new(multisig_account.clone(), instructions, None).into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
signer_c_client.submit_blocking::<InstructionBox>(
    MultisigApprove::new(multisig_account, instructions_hash).into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## Verificar {#verify}

Lea el estado posterior y confirme que la propuesta ya no está pendiente:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger account meta get \
  --id "$MULTISIG_ACCOUNT" \
  --key cookbook_quorum

iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"

iroha --config "$SIGNER_A_CONFIG" ledger multisig inspect \
  --account "$MULTISIG_ACCOUNT" \
  --json |
  jq .
```

El valor de los metadatos debe ser `"approved"`, el hash criptográfico de la instrucción capturada ya no debe aparecer como pendiente, y el controlador inspeccionado debe mostrar pesos `1, 1, 2` con quórum `3`.

## Solución de problemas {#troubleshooting}

- `signatory is not part of multisig` significa que el cliente que propone o aprueba no corresponde a uno de los ID I105 registrados en la póliza.
- Una aprobación final puede ser rechazada cuando la cuenta multisig carece de permiso para ejecutar las instrucciones propuestas. Conceda el principal de autorización a la cuenta multisig, no únicamente a sus firmantes criptográficos individuales, luego permita que un firmante criptográfico restante lo intente de nuevo.
- Una propuesta pendiente que falta puede significar que ya se alcanzó el quórum, que TTL caducó, o que se utilizó el hash de instrucción o selector de cuenta incorrecto. Consulta el estado posterior antes de proponer de nuevo.
- Las aprobaciones duplicadas no suman peso. Cada firmante registrado contribuye con su peso configurado como máximo una vez.
- Está prohibido firmar directamente una transacción normal como el controlador. Siempre use `MultisigPropose` y `MultisigApprove`.
- Si los comandos posteriores no pueden encontrar la cuenta impresa durante el registro CLI, capturaste la semilla temporal. Deriva la cuenta canónica a partir de la política ordenada y regístrala con ese valor como se muestra arriba.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Pruebas de integración de Multisig en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)
- [Modelo de datos multisig en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI implementación multisig en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Transacciones](/es/blockchain/transactions.md)
- [Permisos y roles](./permissions-and-roles.md)
