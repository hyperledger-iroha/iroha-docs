---
translation_locale: es
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: c070c86b715b36079a7b6a47de2e31144187d7ebc6309f294a346be61a372660
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Operar Iroha 3 a través de CLI {#operate-iroha-3-via-cli}

El binario `iroha` es el cliente de línea de comandos para Iroha 3. Úsalo para consultar el estado del libro mayor de la blockchain, enviar transacciones e inspeccionar los endpoints de operador API.

## 1. Prerrequisitos {#_1-prerequisites}

Primero, inicia una red local:

- [Lanzar Iroha 3](./launch-iroha.md)

Los ejemplos a continuación asumen la configuración del cliente generada a partir de la red local creada en [Lanzar Iroha 3](./launch-iroha.md):

```bash
./localnet/client.toml
```

## 2. Configuración básica CLI {#_2-basic-cli-setup}

Muestra la ayuda de nivel superior:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

El CLI está organizado en estos grupos de comando de nivel superior:

- `account` para accesos directos orientados a cuentas
- `tx` para auxiliares a nivel de transacción
- `ledger` para lecturas y escrituras en el libro mayor
- `ops` para diagnóstico del operador
- `app` para los ayudantes de la aplicación API
- `contract` para el despliegue de contratos y llamadas
- `tools` para diagnósticos y utilidades de desarrollo
- `taira` para flujos de trabajo orientados a Taira y Nexus

El grupo `ledger` también contiene ayudantes de transacciones específicos del dominio, como `ledger transaction`.

Usa `--output-format text` para salida de operador legible por humanos y `--machine` para modo de automatización estricta.

## 3. Prueba la Testnet Pública Taira {#_3-try-the-public-taira-testnet}

Puedes intentar realizar verificaciones de solo lectura Taira antes de ejecutar un nodo local de la red o crear un firmante criptográfico. Estos comandos utilizan rutas públicas Torii JSON y no gastan XOR de la testnet.

Verificar el estado de Taira:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

Enumere los dominios públicos en el espacio de datos `universal`:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

Enumere algunas definiciones de activos y su suministro actual:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Si tienes el binario actual `iroha`, ejecuta el asistente de diagnóstico Taira:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Cree `taira.client.toml` solo cuando esté listo para probar comandos firmados. Consulte [Conectar a los Espacios de Datos SORA Nexus](/es/get-started/sora-nexus-dataspaces.md) para la configuración, el servicio de financiamiento de testnet y el flujo canario. No ejecute comandos de escritura contra Taira hasta que la cuenta esté financiada con el activo de tarifa del servicio de financiamiento de testnet.

Para cualquier ejemplo de Taira CLI que requiera pago, guarde el asistente de servicio de financiación de testnet de [Obtener Testnet XOR en Taira](/es/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) como `taira_faucet_claim.py`, luego reclame primero XOR de testnet:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Si el enigma del servicio de financiación de la red de prueba o la ruta de reclamación devuelve `502`, espere y vuelva a intentarlo. Eso es un problema de disponibilidad pública de la red de prueba, no una señal para regenerar las claves de la cuenta.

Después de que el saldo sea visible, adjunta los metadatos del activo de tarifa a las escrituras:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Comandos básicos del libro mayor de blockchain {#_4-basic-ledger-commands}

Enumera todos los dominios:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

La creación de dominios ordinaria utiliza el planificador de alias declarativo; el comando `ledger domain` no tiene subcomando `register`. Prepara una intención `AliasSetupPlanRequestV1` sin secretos para `docs.universal` con tu SDK o servicio de incorporación, luego plánala y aplícala:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

La intención fija el ID del espacio de datos, la cuenta del propietario canónico, el plazo del arrendamiento y el guardia de cotización actual. El planificador verifica el estado en vivo y devuelve el plan atómico exacto `EnsureAlias` para enviar. No copie a mano los valores del guardia de otra red.

Envía una transacción ping simple:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

Lea un bloque reciente o suscríbase a los eventos de bloque:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Comandos del Operador {#_5-operator-commands}

Los comandos del operador de consenso requieren una clave de tiempo de ejecución de software permitida. Manténgala fuera de `client.toml` y pase el archivo solo para el propietario de forma explícita:

```bash
: "${OPERATOR_KEY_FILE:=./secrets/operator.key}"

cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
```

Diagnósticos no vinculantes de la cola, el canal de procesamiento, la elección y las vías de ejecución:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
```

Certificados de quórum de consenso más alto y bloqueado:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi qc
```

Parámetros de consenso en cadena:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi params
```

## 6. A dónde ir a continuación {#_6-where-to-go-next}

- [SDK tutoriales](/es/guide/tutorials/)
- [Torii API puntos finales](/es/reference/torii-endpoints.md)
- [Trabajando con binarios Iroha](/es/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/README.md)

Para regenerar una instantánea completa de la ayuda en Markdown desde la copia de trabajo del código fuente, ejecute:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
