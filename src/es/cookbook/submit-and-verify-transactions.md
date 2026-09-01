---
translation_locale: es
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 98e5c7e9db1ba8468cfd5409409b0e8d02251311dc85492f7b71675e983dc4fd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Enviar y Verificar Transacciones {#submit-and-verify-transactions}

## Resultado {#outcome}

Preflight una transacción Taira, acepte una estimación exacta del precio de la tarifa, fírmele y envíela, espere la finalización aplicada y verifique la transacción comprometida mediante hash criptográfico.

## Requisitos previos {#prerequisites}

- Un `taira.client.toml`, `taira.tx-metadata.json` y `TAIRA_ACCOUNT_ID` financiado producido por [Conectar a Taira](./connect-to-taira.md).
- El actual `iroha` CLI y `jq`.
- Un firmador criptográfico desechable Taira. No reutilice su clave ni estos comandos de escritura en Minamoto.

## Pasos {#steps}

### 1. Verifique previamente el endpoint API, el principal de autorización y el saldo de tarifas {#_1-preflight-the-endpoint-authority-and-fee-balance}

Lea primero la vista de datos de punto en el tiempo de la cola, luego demuestre que el saldo de tarifas del principal de autorización es visible. Lea el ID de definición de activo Base58 de los metadatos generados por la receta de conexión.

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

Deténgase si la cuenta o el saldo de la tarifa está ausente. Una instrucción válida no puede pasar la admisión de la tarifa cuando su principal de autorización no puede pagar.

### 2. Cotizar, firmar y enviar una vez {#_2-quote-sign-and-submit-once}

El CLI envía la carga útil exacta sin firmar para una estimación del precio de la tarifa, vincula la intención de pago aceptada en la transacción, firma y envía. El modo JSON devuelve juntos el hash criptográfico de la transacción, la transacción firmada y la cotización aceptada.

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

No use `--no-wait` en esta receta. El comando espera una confirmación antes de escribir un registro de resultado de protocolo exitoso.

### 3. Esperar el estado de procesamiento final del terminal {#_3-wait-for-terminal-pipeline-state}

Utilice el asistente de estado tecleado en lugar de inferir el éxito a partir de la aceptación de HTTP o la admisión en la cola. Con `--wait`, el alcance de enrutamiento seguro se selecciona automáticamente y el objetivo predeterminado es la finalidad aplicada.

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

`Rejected` y `Expired` son fallos terminales, no estados de éxito que se puedan reintentar. Registre su motivo antes de cambiar o reconstruir la transacción.

### 4. Lea la transacción almacenada {#_4-read-the-stored-transaction}

El estado del flujo de procesamiento responde si el procesamiento ha terminado. Una consulta de transacción verifica que la transacción admitida esté almacenada bajo el mismo hash criptográfico.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

El explorador es una segunda superficie de observación de solo lectura. Puede retrasarse brevemente respecto a la finalización de la canalización.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Para una instrucción que cambia el estado, termina con una consulta del objeto que fue mutado. Las recetas [Metadatos](./metadata.md), [Activos fungibles](./fungible-assets.md) y [NFTs](./nfts.md) incluyen esas lecturas posteriores al estado.

## Verificar {#verify}

Verifique que los tres registros coincidan en el mismo hash criptográfico y que el explorador ya no informe un estado pendiente:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

Mantenga el registro del resultado del protocolo de envío y el estado final como evidencia de prueba. Contienen material de transacción pública, no la clave de firma.

## Solución de problemas {#troubleshooting}

- HTTP `202` o un estado en cola solo prueba la admisión. Continúe consultando el estado especificado hasta que sea Aplicado, Rechazado, Expirado o hasta que se alcance el tiempo de espera límite.
- Si el envío caduca después de devolver un hash criptográfico, consulte ese hash criptográfico antes de crear otra transacción. El reenvío ciego crea una nueva carga útil cotizada y firmada.
- Se puede rechazar una estimación de precio de tarifa antes de firmar. Verifique `--fee-payer authority`, `gas_asset_id`, el saldo del principal de la autorización y el ID de la cadena de la red.
- `Rejected` generalmente indica validación de instrucciones, permisos, tarifas o estado obsoleto. Es evidencia comprometida de una ejecución fallida y no debe reclasificarse como un reintento de transporte.
- Un explorador `404` inmediatamente después de Aplicado puede estar experimentando retraso en la indexación. Vuelva a intentar la lectura; no vuelva a enviar la transacción.
- Si una instrucción privilegiada funciona en una red local generada pero Taira la rechaza, obtenga el permiso exacto Taira o la asignación de espacio de nombres gobernado. El resultado local no otorga principal de autorización de red pública.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Envío de transacciones e implementación de cotización de tarifas en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Implementación de confirmación de transacciones y pruebas en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [Transacciones](/es/blockchain/transactions.md)
- [CLI guía](/es/get-started/operate-iroha-via-cli.md)
- [Torii API puntos finales](/es/reference/torii-endpoints.md)
