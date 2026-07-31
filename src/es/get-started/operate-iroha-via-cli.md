---
translation_locale: es
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 9391bab95aa0ee20c7f036cc175f3a6d3a8852e6ea90b09d9ebf1a838973c765
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Operar por Iroha 3 a través de CLI {#operate-iroha-3-via-cli}

El binario `iroha` es el cliente de línea de comandos de Iroha 3. Utilice para consultar el estado del libro mayor, enviar transacciones e inspeccionar los puntos finales del operador.

## 1.Los requisitos previos {#_1-prerequisites}

Empieza una red local primero:

- [Lanzamiento Iroha 3](./launch-iroha.md)

Los ejemplos siguientes asumen la configuración del cliente generada a partir de la red local creada en [Launch Iroha 3](./launch-iroha.md):

```bash
./localnet/client.toml
```

## 2. Configuración básica CLI {#_2-basic-cli-setup}

Muestra la ayuda de primer nivel:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

El CLI está organizado en estos grupos de comandos de alto nivel:

- `account` para los atajos orientados a la cuenta
- `tx` para los asistentes a nivel de transacción
- `ledger` para la lectura y escritura del libro de contabilidad
- `ops` para el diagnóstico del operador
- `app` para los ayudantes de la aplicación API
- `contract` para el despliegue de contratos y las llamadas
- `tools` para servicios de diagnóstico y desarrollo
- `taira` para los flujos de trabajo orientados a Taira y Nexus

El grupo `ledger` también contiene ayudantes de transacciones específicos de dominios, como `ledger transaction`.

Utilice `--output-format text` para la salida legible por el usuario y `--machine` para el modo de automatización estricto.

## 3. Prueba la red de pruebas pública Taira {#_3-try-the-public-taira-testnet}

Puede probar las comprobaciones de sólo lectura Taira antes de ejecutar un peer local o crear un firmante. Estos comandos utilizan rutas públicas Torii JSON y no gastan testnet XOR.

Verificación de la salud Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

Enumerar los dominios públicos en el espacio de datos `universal`:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

Enumera algunas definiciones de activos y su oferta actual:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Si tiene el binario de corriente `iroha`, ejecute la ayuda de diagnóstico Taira:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Crear `taira.client.toml` sólo cuando esté listo para probar los comandos firmados. Ver [Conectar a SORA Nexus Dataspaces](/es/get-started/sora-nexus-dataspaces.md) para la configuración, grifo y flujo canario. No ejecute comandos de escritura contra Taira hasta que la cuenta se financie con el activo de tarifa del grifo.

Por cualquier pago de honorarios Taira CLI por ejemplo, salvar el ayudante del grifo de [Obtenga el Testnet XOR en el Taira](/es/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) como `taira_faucet_claim.py`, luego reclamar la red de prueba XOR Primero:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Si el rompecabezas del grifo o la ruta de reclamo devuelve `502`, espere y vuelva a intentarlo. Es un problema de disponibilidad pública de la red de prueba, no una señal para regenerar las llaves de cuenta.

Después de que el saldo sea visible, adjunta los metadatos del activo de las tarifas a escribir:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Los comandos básicos del Ledger {#_4-basic-ledger-commands}

Enumera todos los dominios:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

La creación de dominios ordinarios utiliza el planificador del alias declarativo; el comando `ledger domain` no tiene subcomando `register`. Prepare una intención libre de secretos `AliasSetupPlanRequestV1` para `docs.universal` con su SDK o servicio de incorporación, luego planea y aplique:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

La intención pines el espacio de datos ID, El planificador verifica el estado en vivo y devuelve el estado atómico exacto. `EnsureAlias` No copies los valores de seguridad de otra red.

Envía una simple transacción de ping:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

Lea un bloque reciente o suscríbete a los eventos de bloqueo:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Los comandos del operador {#_5-operator-commands}

El estado del consenso:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

Instantánea de latencia por fase:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

Disponibilidad, colector, RBC recuento y instantánea de VRF:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

Parámetros de consenso en la cadena:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. ¿A dónde iremos después? {#_6-where-to-go-next}

- [SDK tutoriales](/es/guide/tutorials/)
- [Puntos finales Torii](/es/reference/torii-endpoints.md)
- [Trabajo con binarios Iroha](/es/reference/binaries.md)
- [CLI README ](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

Para regenerar una instantánea completa de la ayuda de Markdown desde la caja fuente, ejecuta:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
