---
translation_locale: es
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: e07cc42a3fd5579db312bfbfbb8010f473062edebe0141eb9bb8c2a0e7faa4da
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Enviar y verificar las transacciones {#submit-and-verify-transactions}

## El resultado {#outcome}

Previo a una transacción Taira, acepte una cotización exacta de la tarifa, firme y envíela, espere finalidad aplicada y verifique la transacción comprometida por hash.

## Los requisitos previos {#prerequisites}

- Un `taira.client.toml`, `taira.tx-metadata.json` y `TAIRA_ACCOUNT_ID` financiados producidos por [Conect con Taira](./connect-to-taira.md).
- La corriente `iroha` CLI y `jq`.
- Una firma Taira desechable. No vuelva a utilizar su llave o estos comandos de escritura en Minamoto.

## Los pasos {#steps}

### 1. Prefire el punto final, la autoridad y el balance de las tarifas {#_1-preflight-the-endpoint-authority-and-fee-balance}

Lea primero la instantánea de cola, y luego demuestre que el saldo de las tarifas de la autoridad es visible. ID de los metadatos generados por la receta de conexión.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.gas_asset_id' taira.tx-metadata.json)"

iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Una instrucción válida no puede pasar la admisión de las tarifas cuando su autoridad no puede pagar.

### 2. Citar, firmar y enviar una vez {#_2-quote-sign-and-submit-once}

El Consejo CLI Envía la carga útil exacta sin firmar para una cotización de honorarios, vincula la intención de pago aceptada a la transacción, firma y envía. JSON el modo devuelve el hash de la transacción, la transacción firmada y la cotización aceptada juntos.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

No use `--no-wait` en esta receta. El comando espera la confirmación antes de escribir un recibo exitoso.

### 3. Esperar el estado del oleoducto terminal {#_3-wait-for-terminal-pipeline-state}

Utilice el ayudante de estado tipado en lugar de deducir el éxito de la aceptación HTTP o la admisión en cola. con `--wait`, se selecciona automáticamente el alcance de enrutamiento seguro y el objetivo predeterminado es finalidad aplicada.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000 \
  > taira-final-status.json

jq . taira-final-status.json
```

`Rejected` y `Expired` son fallos terminales, no estados de éxito recuperables. Registrar su razón antes de cambiar o reconstruir la transacción.

### 4. Leer la transacción almacenada {#_4-read-the-stored-transaction}

El estado de la tubería responde si el procesamiento ha terminado. Una consulta de transacción verifica que la transacción admitida se almacena bajo el mismo hash.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

El explorador es una segunda superficie de observación, sólo para lectura. Puede retrasarse brevemente en la finalidad del oleoducto.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Para una instrucción de cambio de estado, termine con una consulta del objeto que fue mutado. El [Metadatos](./metadata.md), [Activos funcionales](./fungible-assets.md), y [NFTs](./nfts.md) Las recetas incluyen las lecturas de posestatal.

## Verificar {#verify}

Compruebe que los tres registros coinciden en el mismo hash y que el explorador ya no informe un estado pendiente:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

Mantenga el recibo de la presentación y su estado final como prueba, que contienen material de transacción pública y no la clave de firma.

## Solución de problemas {#troubleshooting}

- HTTP `202` o un estado en cola sólo demuestra la admisión. Continúe sondeando el estado tipado hasta que se aplique, rechace, expire o el tiempo límite.
- Si el tiempo de envío termina después de devolver un hash, consulta ese hash antes de construir otra transacción. La reenvío ciego crea una nueva carga útil citada y firmada.
- Se puede rechazar una cotización de tarifa antes de firmarla. Compruebe `--fee-payer authority`, `gas_asset_id`, el saldo de la autoridad y la cadena de red ID.
- `Rejected` generalmente indica validación de instrucciones, permisos, tarifas o estado obsoleto. Es evidencia comprometida de una ejecución fallida y no debe reclasificarse como un nuevo intento de transporte.
- Un explorador `404` inmediatamente después de Applied puede estar indexando retraso. Intentar de nuevo la lectura; no vuelva a enviar la transacción.
- Si una instrucción privilegiada funciona en una red local generada, pero Taira la rechaza, obtener el permiso exacto Taira o la asignación del espacio de nombres regulado. El resultado local no concede autoridad a las redes públicas.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Presentación de transacciones y ejecución de la cuota de honorarios en el compromiso fijado ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [Pruebas de confirmación de transacciones en el commit fijado ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha/tests/tx_confirmation.rs)
- [Las transacciones ](/es/blockchain/transactions.md)
- [Guía CLI](/es/get-started/operate-iroha-via-cli.md)
- [Puntos finales Torii](/es/reference/torii-endpoints.md)
