---
translation_locale: es
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: e14be7d9314f26f40f6aa30678fddcfcfea39eda9b98016f1b2f84838203c548
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Conectar a Taira {#connect-to-taira}

## Resultado {#outcome}

Confirme que Taira sea accesible, derive el ID de cuenta canónica I105 a partir de una configuración de cliente local, financie el firmante criptográfico con XOR de la testnet y envíe una transacción canaria con tarifa cotizada. Esta receta nunca envía una escritura a Minamoto.

## Requisitos previos {#prerequisites}

- `curl`, `jq`, Python 3.11 o posterior, y los binarios actuales `iroha` y `kagami`.
- Un `taira.client.toml` creado con la cadena Taira, el endpoint API, el perfil de cuenta y una clave de testnet dedicada. Sigue [Crear una Configuración de Cliente Taira](/es/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) y mantiene el archivo fuera del control de versiones.
- El `taira_faucet_claim.py` listo para usar de [Obtener Testnet XOR en Taira](/es/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), guardado junto a la configuración del cliente.

## Pasos {#steps}

### 1. Separar la vitalidad de la disponibilidad {#_1-separate-liveness-from-readiness}

`/livez` es una sonda de vigencia de proceso de texto plano. `/status`, `/health` y `/readyz` devuelven JSON. Un nodo en funcionamiento puede legítimamente devolver `503` desde las sondas de preparación cuando un subsistema requerido está bloqueado.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

Use `/livez` solo para decidir si el proceso responde. Use `/readyz` para la admisión de tráfico e inspeccione los detalles del bloqueador JSON antes de tratar un `503` como una interrupción.

### 2. Ejecutar el diagnóstico público {#_2-run-the-public-diagnostics}

Esta verificación es solo de lectura y no carga la configuración del firmante criptográfico:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

No continúe escribiendo cuando el médico informe un fallo de endpoint duro DNS, TLS, cadena o API. Una cola pública saturada es transitoria; espere y reintente con una política limitada.

### 3. Derivar el ID de cuenta Taira sin imprimir un secreto {#_3-derive-the-taira-account-id-without-printing-a-secret}

Lea solo la clave pública del archivo de configuración, luego codifíquela con el perfil Taira I105. El valor `[account].domain` suministra el contexto de enrutamiento; no es parte del ID de la cuenta.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"

export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
printf '%s\n' "$TAIRA_ACCOUNT_ID"
```

La salida es una dirección canónica sin dominio I105. Nombres como `wallet@payments.universal` son alias y deben resolverse antes de ser utilizados en campos de cuenta estrictos.

### 4. Reclamar el activo de tarifa actual Taira {#_4-claim-the-current-taira-fee-asset}

La respuesta del servicio de financiación de la red de prueba es la fuente de la verdad para la definición del activo de la tarifa. Mantenga el ID Base58 devuelto en lugar de copiar un ID de otra red o de una ejecución anterior.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

Consulte el saldo durante como máximo un minuto. El servicio de financiación de la red de prueba puede devolver `202 Accepted` antes de que la transacción de financiación sea visible.

```bash
funded=false
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if iroha --config ./taira.client.toml ledger asset get \
    --definition "$TAIRA_FEE_ASSET" \
    --account "$TAIRA_ACCOUNT_ID"; then
    funded=true
    break
  fi
  sleep 5
done
test "$funded" = true
```

`gas_asset_id` es metadatos de la transacción. La selección explícita de `--fee-payer authority` está vinculada a la firma, y CLI obtiene una estimación exacta del precio de la tarifa antes de firmar.

## Verificar {#verify}

Envía una instrucción de registro, conserva el registro de resultado del protocolo JSON y espera la finalización aplicada. Omitir `--no-wait` también hace que la presentación inicial espere confirmación; la lectura explícita del estado demuestra el estado final de la canalización de procesamiento.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

El comando final solo tiene éxito después de que la transacción alcanza el estado terminal predeterminado `Applied`. Mantenga el hash criptográfico en la evidencia de prueba; nunca almacene la clave privada ni la configuración completa del cliente con ella.

## Solución de problemas {#troubleshooting}

- `/livez` devuelve `406` cuando se le solicita JSON porque ese endpoint API está `text/plain`. Envía `Accept: text/plain` como se muestra arriba.
- `/health` o `/readyz` pueden devolver `503` con un bloqueador legible por máquina incluso mientras `/livez` y `/status` funcionan. Corrija o espere ese bloqueador; regenerar las claves no cambiará la disponibilidad del nodo.
- Un error `502` del dispensador, un tiempo de espera o un anclaje de prueba de trabajo obsoleto indican un fallo del servicio público. Obtenga un nuevo desafío y vuelva a intentarlo más tarde.
- Un error de prefijo I105 significa que la clave pública fue codificada con el perfil incorrecto. Vuelva a ejecutar `iroha tools address convert --profile taira`.
- El rechazo de una cotización de tarifa suele indicar que la cuenta con autoridad no tiene fondos, que los metadatos del activo de tarifa están obsoletos o que no se seleccionó un pagador explícito.
- El registro, la emisión o la gestión de espacios de nombres aún pueden ser rechazados después de que este canario tenga éxito. Esas operaciones requieren permisos de tiempo de ejecución de software separados; practíquelas en la red local generada cuando no se haya concedido el acceso a Taira.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Taira CLI diagnósticos y fuente canaria en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)
- [Selección de tarifa explícita y fuente de envío CLI en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Guía de cuenta Taira y servicio de financiamiento de testnet](/es/get-started/sora-nexus-dataspaces.md)
- [Configuración del cliente](/es/guide/configure/client-configuration.md)
- [Transacciones](/es/blockchain/transactions.md)
