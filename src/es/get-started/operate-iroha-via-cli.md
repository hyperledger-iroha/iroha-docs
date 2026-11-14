---
translation_locale: es
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 5fb7abd4e152ece715a8337e8ef8e75330f634d2a1b26e0c5bd8308f1f3793a9
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Operar Iroha 3 a través de CLI {#operate-iroha-3-via-cli}

El binario `iroha` es el cliente de línea de comandos de Iroha 3. Utilícelo para consultar el estado del libro mayor, enviar transacciones e inspeccionar los puntos de acceso del operador.

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

- `account` para lecturas y modificaciones de cuentas
- `explorer` para consultar los datos del explorador con filtros compartidos y paginación
- `tx` para consultar el estado de las transacciones y usar sus herramientas auxiliares
- `ledger` para lecturas y escrituras en el libro mayor
- `trigger` para lecturas, escrituras y ejecución de disparadores
- `ops` para diagnóstico del operador
- `app` para los ayudantes de la aplicación API
- `contract` para llamadas a contratos, vistas y depuración local; despliegue con `kagami contract deploy` o `musubi deploy`
- `tools` para diagnósticos y utilidades de desarrollo
- `dataspace` para planificar, aplicar e inspeccionar una definición de espacio de datos
- `taira` para diagnósticos de Taira y alta de cuentas
- `offline` para codificadores fuera de línea, informes y diagnósticos
- `soracloud` para herramientas auxiliares de la plataforma de aplicaciones Soracloud
- `sccp` para lecturas, transferencias y pruebas del SORA Cross-Chain Protocol

Todo comando que envíe una transacción necesita un pagador de comisiones explícito, como `--fee-payer authority`; la CLI calcula e indica la comisión exacta antes de firmar.

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

Cree `taira.client.toml` solo cuando esté listo para probar comandos firmados. Consulte [Conectar a los espacios de datos de SORA Nexus](/es/get-started/sora-nexus-dataspaces.md) para seguir el flujo de configuración, obtención de fondos de prueba y comprobación básica. No ejecute comandos de escritura en Taira hasta que la cuenta tenga fondos del activo de comisiones suministrados por el servicio de fondos de prueba.

Para cualquier ejemplo de la CLI de Taira que pague comisiones, proporcione fondos al firmante mediante el flujo preparado de [Obtener XOR de testnet en Taira](/es/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) y, después, consulte el saldo:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Si una ruta del servicio de fondos de prueba devuelve `502`, espere y vuelva a intentarlo. Se trata de un problema de disponibilidad de la testnet pública, no de una señal para regenerar las claves de la cuenta.

Una vez que el saldo sea visible, envíe operaciones de escritura con `--fee-payer authority`. La CLI indica la comisión exacta, expresada en el activo de comisiones de Taira, antes de firmar:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "hello from faucet-funded taira"
```

## 4. Comandos básicos del libro mayor de blockchain {#_4-basic-ledger-commands}

Enumera todos los dominios:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

La creación de dominios ordinaria utiliza el planificador de alias declarativo; el comando `ledger domain` no tiene subcomando `register`. Prepara una intención `AliasSetupPlanRequestV1` sin secretos para `docs.universal` con tu SDK o servicio de incorporación, luego plánala y aplícala:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

La intención fija el ID del espacio de datos, la cuenta canónica del propietario, el plazo del arrendamiento y la condición de protección de la cotización actual. El planificador verifica el estado en vivo y devuelve el plan atómico exacto de `EnsureAlias` que se debe enviar. No copie manualmente valores de protección de otra red.

Envía una transacción ping simple:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority tx ping --msg "hello from iroha"
```

Lea un bloque reciente o suscríbase a los eventos de bloque:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Comandos del Operador {#_5-operator-commands}

Los comandos de operador de consenso requieren una clave de ejecución incluida en la lista de permitidos. Manténgala fuera de `client.toml` y proporcione la ruta absoluta del archivo, accesible solo al propietario:

```bash
: "${OPERATOR_KEY_FILE:=$PWD/secrets/operator.key}"

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

Carriles de consenso confirmados en el estado y estado de las instancias de este nodo:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi lanes
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
- [Puntos de acceso de Torii](/es/reference/torii-endpoints.md)
- [Trabajando con binarios Iroha](/es/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)

Para imprimir una captura completa de la ayuda en Markdown desde la copia del código fuente, ejecute:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > iroha-cli-help.md
```
