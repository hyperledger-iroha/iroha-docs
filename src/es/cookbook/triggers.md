---
translation_locale: es
translation_source: /cookbook/triggers.md
translation_source_hash: 93080591f5171c7ce25173eb1ef826d6f5ca661a17797be53e90aedab33ed0c3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Los desencadenantes {#triggers}

## El resultado {#outcome}

Registrar un activador de llamada fija en Taira, ejecutarlo una vez, esperar la finalidad aplicada y confirmar su finalización exitosa a partir del historial de bloques comprometidos.

## Los requisitos previos {#prerequisites}

- Una firma financiada, `taira.client.toml`, `taira.tx-metadata.json` y `TAIRA_ACCOUNT_ID` desde [Conectar con Taira](./connect-to-taira.md).
- Permiso Taira para registrar un gatillo para `TAIRA_ACCOUNT_ID` y ejecutar el gatillo resultante. Las fichas correspondientes se encuentran en `CanRegisterTrigger` con el alcance de `authority` y en `CanExecuteTrigger` con el alcance del `trigger`.
- Si esas subvenciones no están disponibles, utilice una red local generada y su cliente administrador. La autoridad del gatillo también necesita todos los permisos requeridos por las instrucciones que el gatillo ejecutará.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Los pasos {#steps}

### 1. Registrar un gatillo con instrucciones {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` acepta una matriz de instrucciones JSON. Una instrucción `Log` mantiene este ejemplo centrado en la autorización del desencadenante en lugar de los permisos de un segundo objeto de registro.

```bash
printf '%s\n' \
  '[{"Log":{"level":"INFO","message":"cookbook trigger executed"}}]' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger trigger register \
    --id "$TRIGGER_ID" \
    --instructions-stdin \
    --repeats 3 \
    --authority "$TAIRA_ACCOUNT_ID" \
    --filter execute
```

El gatillo puede ejecutarse como máximo tres veces. su autoridad declarada, no el llamador que sucede a ejecutarlo, autoriza las instrucciones dentro de la acción.

### 2. Inspeccionar la declaración antes de su ejecución {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Confirmar la autoridad I105, el filtro de ejecución, las repeticiones restantes y la instrucción única `Log` antes de gastar otra tarifa.

### 3. Ejecutar y esperar las dos capas {#_3-execute-and-wait-for-both-layers}

La transacción de ejecución y la acción desencadenante presentan pruebas distintas. `--wait` espera la finalidad de la transacción aplicada; `--trace` también informa los diagnósticos de terminación del tiempo de ejecución.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger trigger execute \
  --wait \
  --trace \
  --timeout-ms 60000 \
  "$TRIGGER_ID"
```

Los clientes Rust construyen las mismas dos instrucciones de tipografía. Aquí `authority` es un signo `AccountId` y `client` como esa cuenta:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};

let trigger_id: TriggerId = "cookbook_by_call_log".parse()?;
let action = Action::new(
    vec![Log::new(Level::INFO, "cookbook trigger executed".to_owned()).into()],
    Repeats::Exactly(3),
    authority.clone(),
    ExecuteTriggerEventFilter::new()
        .for_trigger(trigger_id.clone())
        .under_authority(authority),
);
let fee = FeePaymentIntent::authority(Vec::new(), None);

client.submit_blocking(Register::trigger(Trigger::new(trigger_id.clone(), action)), fee.clone())?;
client.submit_blocking(ExecuteTrigger::new(trigger_id), fee)?;
```

## Verificar {#verify}

Escanear el historial de bloques comprometidos para la finalización e inspeccionar el recuento de repeticiones decrementadas:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Al menos una terminación debe informar de éxito. El desencadenante debe permanecer activo con dos ejecuciones restantes. Una presentación exitosa sin una finalización exitosa del desencadenador no es suficiente verificación.

## Solución de problemas {#troubleshooting}

- El registro rechazado como no permitido significa que el firmante carece de `CanRegisterTrigger` para la autoridad declarada. La ejecución requiere del token `CanExecuteTrigger` con un alcance separado.
- Una transacción puede llegar a Applied mientras la acción de activación informa fallas. Lea el resultado de finalización y error; luego compruebe los permisos de la autoridad de activación para cada instrucción integrada.
- `trigger not found` puede significar que la transacción de registro fue rechazada o que se utilizó una configuración diferente Torii/cadena para su ejecución.
- Cuando las repeticiones alcanzan el cero, acuñar más repeticiones es otro privilegio de escribir. No cambies en silencio esta receta a un gatillo indefinido.
- Para la limpieza, `ledger trigger unregister --id "$TRIGGER_ID"` requiere `CanUnregisterTrigger` para ese desencadenante más la selección explícita de las tarifas.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Pruebas de integración del gatillo de llamada indirecta en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/triggers/by_call_trigger.rs)
- [Pruebas de integración de eventos y desencadenantes en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/events_and_triggers.rs)
- [Ejecución de la instrucción del gatillo en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [Los desencadenantes ](/es/blockchain/triggers.md)
- [Ejemplos de disparadores ](/es/blockchain/trigger-examples.md)
- [Eventos ](./stream-events.md)
