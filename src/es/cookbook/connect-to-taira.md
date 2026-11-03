---
translation_locale: es
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 31555f0c56bddb8892d09af250cef732a2dfdd39564c83de8b344200157751b9
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Conectar a Taira {#connect-to-taira}

## Resultado {#outcome}

Confirme que Taira sea accesible, derive el ID de cuenta canónica I105 a partir de una configuración de cliente local, financie el firmante criptográfico con XOR de la testnet y envíe una transacción canaria con tarifa cotizada. Esta receta nunca envía una escritura a Minamoto.

## Requisitos previos {#prerequisites}

- `curl`, `jq`, Python 3.11 o posterior, y los binarios actuales `iroha` y `kagami`.
- Un `taira.client.toml` creado con la cadena Taira, el `network_id` exacto, el endpoint API, el perfil de cuenta y una clave de testnet dedicada. Siga [Crear una Configuración de Cliente Taira](/es/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) y mantenga el archivo fuera del control de versiones.
- Un directorio de trabajo con permisos de escritura para el diario del servicio de financiación de testnet: `iroha taira account faucet prepare` crea `./taira-faucet` con permisos privados y se niega a reemplazar un directorio existente.

## Pasos {#steps}

### 1. Separar la vitalidad de la disponibilidad {#_1-separate-liveness-from-readiness}

`/livez`, `/health` y `/readyz` son sondas de texto plano; `/status` devuelve JSON. Un nodo en funcionamiento puede legítimamente devolver `503` desde `/readyz` cuando la admisión de consenso u otro subsistema requerido no está disponible.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

Use `/livez` solo para decidir si el proceso responde. Use `/readyz` para la admisión de tráfico. Su `503` es un contenedor de error `service_unavailable` sin detalles del bloqueador, así que ejecute el diagnóstico siguiente antes de tratarlo como una interrupción.

### 2. Ejecutar el diagnóstico público {#_2-run-the-public-diagnostics}

Esta verificación es solo de lectura y no carga la configuración del firmante criptográfico:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

No continúe escribiendo cuando el médico informe un fallo de endpoint duro DNS, TLS, cadena o API. Una cola pública saturada es transitoria; espere y reintente con una política limitada.

### 3. Derivar el ID de cuenta Taira sin imprimir un secreto {#_3-derive-the-taira-account-id-without-printing-a-secret}

Lea solo la clave pública del archivo de configuración, luego codifíquela con el perfil Taira I105. El ID de cuenta no lleva dominio; `[account].profile` solo selecciona su prefijo de red.

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

La política del servicio de financiación de la red de prueba indica la definición actual del activo de tarifa. Mantenga su ID Base58 en lugar de copiar un ID de otra red o de una ejecución anterior. La política son datos de descubrimiento sin firmar, por lo que la automatización debe fijar el emisor, la definición de activo y la cantidad que espera en lugar de confiar en cada respuesta.

```bash
curl -fsS -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/faucet/policy \
  | tee taira-faucet-policy.json

export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` resuelve la prueba de trabajo y guarda la transacción firmada exacta; `submit` la envía una vez y regresa después de que se aplica. Si `submit` informa `Pending` o agota el tiempo de espera, ejecute `taira account faucet resume` con la misma configuración y el mismo diario en lugar de preparar otra reclamación. Luego consulte el saldo durante como máximo un minuto.

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

Use `--fee-payer authority` para cada escritura en Taira. La selección está vinculada a la firma, y el CLI cotiza la tarifa exacta, en el activo de tarifa de Taira, antes de firmar.

## Verificar {#verify}

Envía una instrucción de registro, conserva el registro de resultado del protocolo JSON y espera la finalización aplicada. Omitir `--no-wait` también hace que la presentación inicial espere confirmación; la lectura explícita del estado demuestra el estado final de la canalización de procesamiento.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  tx status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

El comando final solo tiene éxito después de que el estado global exacto informa una finalidad `Applied` resuelta en el estado. Mantenga el hash criptográfico en la evidencia de prueba; nunca almacene la clave privada ni la configuración completa del cliente con él.

## Solución de problemas {#troubleshooting}

- `/livez`, `/health` y `/readyz` devuelven `406` cuando se les solicita solo JSON porque responden en `text/plain`. Envíe los encabezados `Accept` que se muestran arriba.
- `/readyz` puede devolver `503` con un contenedor de error `service_unavailable` incluso mientras `/livez` y `/status` funcionan. Espere a que el nodo esté disponible o ejecute `iroha taira doctor`; regenerar las claves no cambiará la disponibilidad del nodo.
- Un `502` o un tiempo de espera agotado del dispensador durante `submit` deja desconocido el resultado de la reclamación: ejecute `taira account faucet resume` con la misma configuración y el mismo diario en lugar de preparar otra reclamación. Un anclaje de prueba de trabajo obsoleto hace fallar `prepare`; prepare de nuevo en un directorio de diario nuevo.
- Un error de prefijo I105 significa que la clave pública fue codificada con el perfil incorrecto. Vuelva a ejecutar `iroha tools address convert --profile taira`.
- El rechazo de una cotización de tarifa suele indicar que la cuenta con autoridad no tiene fondos o que el `network_id` configurado no es el de Taira. La ausencia de `--fee-payer`, o una clave de tarifa como `gas_asset_id` en `--metadata`, falla localmente antes de la cotización.
- El registro, la emisión o la gestión de espacios de nombres aún pueden ser rechazados después de que este canario tenga éxito. Esas operaciones requieren permisos de tiempo de ejecución de software separados; practíquelas en la red local generada cuando no se haya concedido el acceso a Taira.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Diagnósticos CLI de Taira y fuente canaria](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs) y [comandos del servicio de financiación de testnet](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs) en el commit fijado
- [Selección de tarifa explícita y fuente de envío CLI en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Guía de cuenta Taira y servicio de financiamiento de testnet](/es/get-started/sora-nexus-dataspaces.md)
- [Configuración del cliente](/es/guide/configure/client-configuration.md)
- [Transacciones](/es/blockchain/transactions.md)
