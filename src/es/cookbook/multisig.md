---
translation_locale: es
translation_source: /cookbook/multisig.md
translation_source_hash: 9654923faf6c84dfd21a428ebe3c53dbd074b8e3274c12c8aa41bf31884686f7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Multisig ponderado {#weighted-multisig}

## El resultado {#outcome}

Registrar una cuenta multisig ponderada de tres miembros en Taira, proponer una instrucción de metadatos, aprobarla con suficiente peso como para cumplir un quórum y verificar la ejecución desde el estado de la cuenta multisig.

## Los requisitos previos {#prerequisites}

- Tres canónicos I105 firmante IDs en el `SIGNER_A`, `SIGNER_B`, y `SIGNER_C`.
- Configuraciones financiadas Taira para los firmantes A y C. El proponente y cada homologador pagan por su propia transacción.
- `taira.tx-metadata.json` construido a partir de la respuesta del grifo actual, nunca a partir de un activo de cuota copiada ID.
- En el caso A Rust proyecto de cliente fijado en el mismo Iroha Revisión de la fuente como Taira En las fases posteriores de propuesta y aprobación se utilizan los siguientes métodos: CLI.
- La función multisig del ejecutor actual está habilitada. El registro está disponible para las cuentas ordinarias en el tiempo de ejecución predeterminado Iroha 3, aunque la política y la admisión de tarifas Taira todavía se aplican; use localnet si la implementación pública lo niega.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Los pasos {#steps}

### 1. Registrar una política ponderada {#_1-register-a-weighted-policy}

El signo C tiene peso 2; A y B tienen peso 1 cada uno. Un quórum de 3 por lo tanto requiere C más o bien A o B. Derivar la cuenta canónica de esa política exacta antes del registro, luego pasar el mismo valor a `MultisigRegister::with_account`:

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

Guardar el valor impreso para los pasos CLI:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

En el cometido fijado, el comando de registro CLI imprime su semilla temporal antes de que el tiempo de ejecución lo recomiende. No vuelva a utilizar esa semilla como controlador. No hay llave privada del controlador: la autoridad multisig proviene sólo de propuestas aprobadas.

### 2. Construir una instrucción sin presentarla {#_2-build-one-instruction-without-submitting-it}

El switch global `-o` serializa una matriz de instrucciones a la salida estándar. No presenta una transacción y por lo tanto no gasta ninguna tarifa.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Proponer como firmante A. {#_3-propose-as-signer-a}

El proponente contribuye automáticamente con su propio peso. Captura el hash exacto de instrucciones impreso por el CLI; las aprobaciones se vinculan a ese hash

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

Enumerar la propuesta pendiente con un selector finito explícito:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. Aprobar como firmante C {#_4-approve-as-signer-c}

El peso de A 1 más el peso de C 2 alcanza el quórum 3 y ejecuta la instrucción propuesta como la cuenta multisig.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

El cliente Rust puede continuar con la misma cuenta derivada de la póliza y las dos instrucciones del ciclo de vida utilizadas anteriormente:

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

Leer el post-estado y confirmar que la propuesta ya no está pendiente:

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

El valor de metadatos debe ser `"approved"`, el hash de instrucción capturado ya no debe aparecer como pendiente, y el controlador inspeccionado debe mostrar los pesos `1, 1, 2` con quorum `3`.

## Solución de problemas {#troubleshooting}

- `signatory is not part of multisig` significa que el cliente que propone o aprueba no corresponde a uno de los I105 IDs registrados en la póliza.
- Se puede rechazar una aprobación final cuando la cuenta multisig carece de permiso para ejecutar las instrucciones propuestas. Dar autoridad a la cuenta multisig, no sólo a sus firmas individuales, luego dejar que un firmante restante vuelva a intentar.
- Una propuesta pendiente faltante puede significar que ya se alcanzó el quórum, que TTL expiró o que se utilizó el selector hash/cuenta de instrucciones equivocado.
- Las aprobaciones duplicadas no añaden peso; cada signatario registrado contribuye con su peso configurado como máximo una vez.
- Se prohíbe firmar directamente una transacción normal como controlador. Utilice siempre `MultisigPropose` y `MultisigApprove`.
- Si los comandos posteriores no pueden encontrar la cuenta impresa durante el registro CLI, usted capturó la semilla temporal. Derivar la cuenta canónica de la política ordenada y registrarse con ese valor como se muestra anteriormente.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Pruebas de integración multisig en el commit fijado ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)
- [Modelo de datos multisig en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs)
- [Implementación multisig de CLI en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Las transacciones ](/es/blockchain/transactions.md)
- [Permisos y funciones ](./permissions-and-roles.md)
