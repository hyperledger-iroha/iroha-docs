---
translation_locale: es
translation_source: /cookbook/triggers.md
translation_source_hash: 5267fb9bb232d52d9df4bedee414d745ccc30dd52cbc30993df3c5b975a0bc38
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Desencadenantes {#triggers}

## Resultado {#outcome}

Registra un activador por llamada finita en Taira, ejecútalo una vez, espera la finalidad aplicada y confirma su finalización exitosa a partir del historial de bloques comprometidos.

## Requisitos previos {#prerequisites}

- Un firmante criptográfico financiado, `taira.client.toml`, `taira.tx-metadata.json` y `TAIRA_ACCOUNT_ID` de [Conectar a Taira](./connect-to-taira.md).
- Taira permiso para registrar un disparador para `TAIRA_ACCOUNT_ID` y ejecutar el disparador resultante. Los tokens relevantes son `CanRegisterTrigger` con alcance de `authority` y `CanExecuteTrigger` con alcance de `trigger`.
- Si esas subvenciones no están disponibles, use una red local generada y su cliente administrador. El principal de autorización del desencadenador también necesita todos los permisos requeridos por las instrucciones que el desencadenador ejecutará.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
TRIGGER_ID=cookbook_by_call_log
test -n "$TAIRA_ACCOUNT_ID"
```

## Pasos {#steps}

### 1. Registrar un disparador respaldado por instrucción {#_1-register-an-instruction-backed-trigger}

`--instructions-stdin` acepta un arreglo JSON de instrucciones. Una instrucción `Log` mantiene este ejemplo enfocado en la autorización de activación en lugar de los permisos de un segundo objeto del libro mayor blockchain.

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

El disparador puede ejecutarse como máximo tres veces. Su principal de autorización declarado, no el llamador que resulta ejecutarlo, autoriza las instrucciones dentro de la acción.

### 2. Inspeccione la declaración antes de la ejecución {#_2-inspect-the-declaration-before-execution}

```bash
iroha --config "$CONFIG" ledger trigger get --id "$TRIGGER_ID"
iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Confirme el principal de autorización I105, el filtro de ejecución, las repeticiones restantes y la única instrucción `Log` antes de gastar otra tarifa.

### 3. Ejecuta y espera a que se completen ambas capas {#_3-execute-and-wait-for-both-layers}

La transacción de ejecución y la acción del desencadenador tienen evidencia distinta. `--wait` espera la finalización de la transacción aplicada; `--trace` también informa diagnósticos de finalización del tiempo de ejecución del software.

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

Rust los clientes construyen las mismas dos instrucciones tipadas. Aquí `authority` es un `AccountId` y `client` firma como esa cuenta:

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

Escanea el historial de bloques comprometidos para la finalización e inspecciona el recuento de repeticiones decrementado:

```bash
iroha --config "$CONFIG" ledger trigger completed list \
  --id "$TRIGGER_ID" \
  --outcome success \
  --limit 5

iroha --config "$CONFIG" ledger trigger inspect "$TRIGGER_ID"
```

Al menos una finalización debe informar éxito. El desencadenador debe permanecer activo con dos ejecuciones restantes. Una presentación exitosa sin una finalización exitosa del desencadenador no es una verificación suficiente.

## Solución de problemas {#troubleshooting}

- Registro rechazado por no estar permitido significa que el firmante criptográfico carece de `CanRegisterTrigger` para el principal de autorización declarado. La ejecución requiere el token `CanExecuteTrigger` con alcance separado.
- Una transacción puede llegar a Aplicada mientras la acción del desencadenador informa un fallo. Lea el resultado de la finalización y el error; luego verifique los permisos del principal de autorización del desencadenador para cada instrucción incorporada.
- `trigger not found` puede significar que la transacción de registro fue rechazada o que se utilizó una configuración diferente de Torii/cadena para la ejecución.
- Cuando las repeticiones lleguen a cero, emitir más repeticiones es otra escritura privilegiada. No cambie silenciosamente esta receta a un disparador indefinido.
- Para la limpieza, `ledger trigger unregister --id "$TRIGGER_ID"` requiere `CanUnregisterTrigger` para ese disparador más la selección explícita de tarifa.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Pruebas de integración de activación bajo demanda en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/triggers/by_call_trigger.rs)
- [Pruebas de integración de eventos y disparadores en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/events_and_triggers.rs)
- [Activar la ejecución de la instrucción en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_core/src/smartcontracts/isi/triggers/mod.rs)
- [Desencadenantes](/es/blockchain/triggers.md)
- [Ejemplos de desencadenantes](/es/blockchain/trigger-examples.md)
- [Eventos](./stream-events.md)
