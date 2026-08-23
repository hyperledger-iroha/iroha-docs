---
translation_locale: es
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: a7347a7e8ea055fd5bab9a34b6124ea19ef6f355f9beef9e9488794d9c6e3202
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Conectarse a Taira {#connect-to-taira}

## El resultado {#outcome}

Confirme eso. Taira es alcanzable, derivar el canónico I105 cuentas ID desde una configuración de cliente local, financie al firmante con testnet XOR, Esta receta nunca envía un mensaje a Minamoto.

## Los requisitos previos {#prerequisites}

- En el caso de los sistemas binarios `iroha` y `kagami`, el valor de las unidades binarias `curl`, `jq`, Python 3.11 o posterior.
- En el caso A `taira.client.toml` creado con el Taira cadena, punto final, perfil de cuenta y una llave de red de prueba dedicada. [Crear una Taira Configuración del cliente](/es/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) y mantener el archivo fuera del control de la fuente.
- El `taira_faucet_claim.py` listo para ejecutarse desde [Obtener Testnet XOR en Taira](/es/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), guardado junto a la configuración del cliente.

## Los pasos {#steps}

### 1. Separación entre la vitalidad y la preparación {#_1-separate-liveness-from-readiness}

`/livez` es una sonda de vida útil del proceso en texto plano. `/status`, `/health` y `/readyz` devuelven JSON. Un nodo en marcha puede devolver legítimamente `503` desde las sondas de preparación cuando se bloquea un subsistema requerido.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

Utilizar `/livez` sólo para decidir si el proceso responde. Utilice `/readyz` para la admisión de tráfico e inspeccione sus detalles del bloqueador JSON antes de tratar un `503` como una interrupción.

### 2. Realizar el diagnóstico público {#_2-run-the-public-diagnostics}

Esta verificación es de lectura única y no carga la configuración del firmante:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

No continúe escribiendo cuando el médico informe de una falla dura DNS, TLS, cadena o punto final. Una fila pública saturada es transitorio; espere y vuelva a intentar con una política limitada.

### 3. Derivar la cuenta Taira ID sin imprimir un secreto. {#_3-derive-the-taira-account-id-without-printing-a-secret}

Leer sólo la clave pública de la configuración, luego codificarla con el perfil Taira I105. El valor `[account].domain` proporciona contexto de enrutamiento; no forma parte de la cuenta ID.

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

La salida es una dirección canónica I105 sin dominio. Nombres como `wallet@payments.universal` son alias y deben ser resueltos antes de que se usen en campos estrictos de cuenta.

### 4. Reclamar el activo de cuota corriente Taira {#_4-claim-the-current-taira-fee-asset}

La respuesta del grifo es la fuente de verdad para la definición de activos de honorarios. Mantenga el Base58 ID devuelto en lugar de copiar un ID de otra red o una antigua corriente.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

Encuentra el saldo durante un minuto como máximo. El grifo puede devolver `202 Accepted` antes de que la transacción de financiación sea visible.

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

`gas_asset_id` es metadatos de transacción. La selección explícita `--fee-payer authority` está vinculada a la firma, y el CLI obtiene una cotización exacta antes de firmarla.

## Verificar {#verify}

Enviar una instrucción de registro, guardar el recibo JSON y esperar a la finalidad aplicada. Omitir `--no-wait` también hace que la presentación inicial espere la confirmación; la lectura explícita del estado prueba el estado final de la tubería.

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

El comando final sólo tiene éxito después de que la transacción alcance el estado terminal predeterminado `Applied`. Mantenga el hash en la evidencia de prueba; nunca almacene la clave privada o la configuración completa del cliente con él.

## Solución de problemas {#troubleshooting}

- `/livez` devuelve `406` cuando se le solicite JSON porque ese punto final es `text/plain`. Envía `Accept: text/plain` como se muestra anteriormente.
- `/health` o `/readyz` pueden devolver `503` con un bloqueador legible por máquina incluso mientras `/livez` y `/status` funcionan. Fixar o esperar a ese bloqueador; las teclas regeneradoras no cambiarán la preparación del nodo.
- Un grifo `502`, un tiempo de espera o un anclaje anticuado de prueba de trabajo es un fracaso del servicio público.
- Un error de prefijo I105 significa que la clave pública fue codificada con el perfil equivocado. Reejecutar `iroha tools address convert --profile taira`.
- Por lo general, el rechazo de una cotización de honorarios significa que la autoridad no fue financiada, que los metadatos del activo de honorarios están obsoletos o que no se ha seleccionado ningún pagador explícito de honorarios.
- El registro, la acuñación o el manejo del espacio de nombres todavía se pueden rechazar después de que este canario tenga éxito. Estas operaciones requieren permisos de ejecución separados; enséñalos en la red local generada cuando Taira no se ha concedido el acceso.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Taira CLI diagnóstico y fuente canaria en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/taira.rs)
- [Selección explícita de la tarifa y fuente de presentación CLI en el compromiso fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs).
- [Taira Guía de contabilidad y grifo](/es/get-started/sora-nexus-dataspaces.md)
- [Configuración del cliente ](/es/guide/configure/client-configuration.md)
- [Las transacciones ](/es/blockchain/transactions.md)
