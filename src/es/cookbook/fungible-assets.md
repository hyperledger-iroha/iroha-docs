---
translation_locale: es
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 29f2bdb390fc93b97f8ed9108634f70e21ba747c8606fb84093d37e9586516c1
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Activos fungibles {#fungible-assets}

## Resultado {#outcome}

Inspeccione las definiciones de activos en vivo Taira y complete un registro, emisión, transferencia, quema y flujo de verificación de saldo en una red local generada. La receta utiliza IDs de definición de activos Base58 canónicas sin prefijo, alias calificados por dominio, IDs de cuenta I105 sin dominio, y el pago explícito de tarifas.

## Requisitos previos {#prerequisites}

- `curl`, `jq`, Python 3.11 o posterior, Node.js 24, y el actual `iroha` CLI.
- Acceso de solo lectura Taira.
- Para la guía de escritura, una red local generada a partir de [Lanzar Iroha](/es/get-started/launch-iroha.md), con `./localnet/client.toml` y Torii en `http://127.0.0.1:8080`.

## Pasos {#steps}

### 1. Inspeccionar las definiciones Taira sin un firmante criptográfico {#_1-inspect-taira-definitions-without-a-signer}

Las definiciones de activos llevan un ID opaco en Base58, un nombre para mostrar, la política de emisión de activos, una escala numérica, un alias opcional, propietario y cantidad total. El balance concreto también incluye la cuenta del titular y un alcance opcional del espacio de datos.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] \
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity] \
    | @tsv'
```

```js [Node.js]
const response = await fetch(
  'https://taira.sora.org/v1/assets/definitions?limit=10',
  { headers: { Accept: 'application/json' } },
)
if (!response.ok) throw new Error(`Taira returned HTTP ${response.status}`)

const { items } = await response.json()
for (const definition of items) {
  console.log({
    id: definition.id,
    name: definition.name,
    mintable: definition.mintable,
    total: definition.total_quantity,
  })
}
```

:::

Ejecute el formulario JavaScript con `node taira-assets.mjs`. Los ID de activos públicos son valores Base58 puros; un valor legible como `cookbook_credit#wonderland.universal` es un alias que se resuelve a uno de esos ID.

### 2. Prepare el principal de autorización local y el destino {#_2-prepare-the-local-authority-and-destination}

Derive el principal de autorización local a partir de la clave pública en la configuración generada y elija otra cuenta registrada como destinatario. No se imprime la clave privada.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
SOURCE_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

DESTINATION_ACCOUNT="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg source "$SOURCE_ACCOUNT" \
      '[.items[].id | select(. != $source)][0]'
)"
```

### 3. Registrar una definición numérica {#_3-register-a-numeric-definition}

Este ID local únicamente es una dirección de definición de activo Base58 válida sin prefijo. El alias proporciona la proyección legible por humanos `domain.dataspace`. La escala `2` permite dos dígitos fraccionarios; omitir `--mint-once` mantiene la política predeterminada `Infinitely`.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'
ASSET_ALIAS='cookbook_credit#wonderland.universal'

iroha --config "$LOCAL_CONFIG" \
  --machine \
  --fee-payer authority \
  ledger asset definition register \
  --id "$ASSET_DEFINITION_ID" \
  --name cookbook_credit \
  --description 'Local cookbook credit' \
  --alias "$ASSET_ALIAS" \
  --scale 2
```

No reutilice ese ID en Taira. El registro en la red pública requiere un ID canónico nuevo, un dominio/alias asignado a su aplicación, financiación de tarifas y el permiso de registro de activos del entorno de ejecución del software.

### 4. emitir, transferir y quemar {#_4-mint-transfer-and-burn}

Todos los comandos de escritura seleccionan explícitamente al principal de autorización como pagador de tarifas. El CLI cotiza la transacción exacta antes de firmar y espera por defecto.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 100.00

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --to "$DESTINATION_ACCOUNT" \
  --quantity 25.50

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 10.00
```

Después de la quema, espere el saldo de origen `64.50`, el saldo de destino `25.50` y la cantidad total `90.00`.

::: warning Límite de permisos

En Taira, adjunta el `taira.tx-metadata.json` derivado del grifo y usa `--fee-payer authority` para cada escritura. El registro y la emisión requieren los permisos del validador activo; la transferencia y la quema requieren el principal de autorización sobre el saldo de origen. Una cuenta financiada por testnet no es automáticamente un emisor.

:::

## Verificar {#verify}

Lea ambos saldos concretos y luego la definición. Estas consultas de estado posterior son el criterio de éxito; un registro de resultado del protocolo de presentación por sí solo no lo es.

```bash
iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$DESTINATION_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

Las afirmaciones de la aplicación deben comparar valores numéricos como decimales de punto fijo, no como valores de punto flotante binario, y deben verificar el ID de definición así como la cuenta.

## Solución de problemas {#troubleshooting}

- Un ID que contiene `#` es un alias o un literal de balance concreto, no un ID de definición de activo canónico. Use el valor Base58 desnudo con `--definition`, o pase un alias vinculado con `--definition-alias`.
- Los errores `Scale` significan que una cantidad tiene más dígitos fraccionarios de los que permite la definición.
- `Mintability` rechazo significa que la política `Once`, `Not` o `Limited(n)` ha sido agotada o se ha denegado su emisión. No reescribas la historia; usa la política devuelta por la consulta de definición.
- El Paso 2 elige deliberadamente una cuenta de destino registrada. Si la admisión de activos es `ExplicitOnly`, proporcione el saldo de destino a través de un autorizado flujo antes de transferir. La guarda de nombre similar CLI no registra una cuenta ni un saldo; en su lugar, aborta en lugar de agregar otra instrucción.
- Una rechazo de tarifa ocurre antes del éxito normal de la instrucción. Seleccione el pagador, use los metadatos del activo de tarifa de la red y verifique su saldo.
- Si la definición local fija ya existe de una ejecución anterior, inicia una nueva red local generada o continúa con su estado existente. Nunca sustituyas una cadena aleatoria malformada por el ID Base58.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Pruebas de integración del ciclo de vida del activo en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust ejemplos de construcción de activos en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [Activos](/es/blockchain/assets.md)
- [Instrucciones](/es/blockchain/instructions.md)
- [Tokens de permiso](/es/reference/permissions.md)
- [JavaScript y TypeScript](/es/guide/tutorials/javascript.md)
