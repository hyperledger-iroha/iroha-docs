---
translation_locale: es
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 669b5a1c12e9ab6ffb64e149148993e7b924feb29c6fa4db883a2065f58ecd7e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Activos fúngicos {#fungible-assets}

## El resultado {#outcome}

Inspeccionar en vivo las definiciones de activos Taira y completar un flujo de registro, moneda, transferencia, quema y verificación del saldo en una red local generada. la receta utiliza una definición de activo base58 canónica sin prefijos IDs, alias calificados para dominios, cuenta sin dominio I105 IDs y pago explícito de cuotas.

## Los requisitos previos {#prerequisites}

- `curl`, `jq`, Python 3.11 o más tarde, Node.js 24 y la corriente `iroha` CLI.
- Acceso de sólo lectura Taira.
- Para el proceso de escritura, se genera una red local desde [Lanzamiento Iroha](/es/get-started/launch-iroha.md), con `./localnet/client.toml` y Torii en `http://127.0.0.1:8080`.

## Los pasos {#steps}

### 1. Inspectar las definiciones Taira sin firmante. {#_1-inspect-taira-definitions-without-a-signer}

Las definiciones de activos tienen una Base58 opaca ID, nombre de visualización, Política de capacidad, escala numérica, alias opcionales, propietario y cantidad total. El saldo concreto incluye también su cuenta del titular y el alcance opcional del espacio de datos.

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

Ejecutar el formulario JavaScript con `node taira-assets.mjs`. Los activos públicos IDs son valores de Base58 desnudos; un valor legible como `cookbook_credit#wonderland.universal` es un alias que se resuelve a uno de esos IDs.

### 2. Preparar a la autoridad local y al destino {#_2-prepare-the-local-authority-and-destination}

Derivar la autoridad local de la clave pública en la configuración generada y elegir otra cuenta registrada como destinatario. No se imprime llave privada.

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

Este local-solo ID es una dirección válida sin prefijo de la definición de activos Base58. El alias proporciona la proyección humana legible `domain.dataspace`. La escala `2` permite dos dígitos fraccionarios; omitir `--mint-once` mantiene la política predeterminada `Infinitely`.

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

No vuelva a utilizar ID en Taira. El registro de la red pública requiere un nuevo canónico ID, un dominio/alias asignado a su solicitud, financiación de tarifas y el permiso de registro de activos del tiempo de ejecución.

### 4. La menta, el traslado y la quema {#_4-mint-transfer-and-burn}

Todos los comandos de escritura seleccionan explícitamente a la autoridad como pagador de honorarios. CLI cita la transacción exacta antes de firmar y espera por defecto.

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

Después de la quema, espere el saldo de la fuente `64.50`, el balance de destino `25.50` y la cantidad total `90.00`.

::: warning Límites de los permisos

En Taira, adjunta el `taira.tx-metadata.json` derivado del grifo y usa `--fee-payer authority` para cada escritura. El registro y la acuñación requieren los permisos del validador activo; la transferencia y quemadura requieren autoridad sobre el saldo de origen. Una cuenta financiada por un grifo no es automáticamente un emisor.

:::

## Verificar {#verify}

Lea tanto los equilibrios concretos como la definición. Estas consultas posteriores al estado son el criterio de éxito; un recibo de presentación por sí mismo no lo es.

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

Las afirmaciones de aplicación deben comparar los valores numéricos como decimales de punto fijo, no como valores binarios de puntos flotantes, y deben verificar la definición ID así como la cuenta.

## Solución de problemas {#troubleshooting}

- Un ID que contiene `#` es un alias o balance de concreto literal, no una definición canónica del activo ID. Utilice el valor Base58 desnudo con `--definition`, o pase un alias vinculado con `--definition-alias`.
- Los errores `Scale` significan que una cantidad tiene más dígitos fraccionarios de los que permite la definición.
- Rechazo `Mintability` significa que la política de `Once`, `Not` o `Limited(n)` ha agotado o prohibido la acuñación. No reescriba el historial; use la política devuelta por la consulta de definición.
- El paso 2 elige deliberadamente una cuenta de destino registrada.Si la admisión de activos es `ExplicitOnly`, provee el saldo de destino a través de un flujo antes de la transferencia. El guardia con el mismo nombre CLI no registra una cuenta ni un saldo; aborta en lugar de añadir otra instrucción.
- El rechazo de la tarifa ocurre antes del éxito normal de la instrucción. Seleccione el pagador, utilice los metadatos del activo de la tarifa de la red y verifique su saldo.
- Si la definición local fija ya existe desde una ejecución anterior, inicie una red local recién generada o continúe con su estado existente. Nunca sustituya a una cadena aleatoria malformada por la Base58 ID.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Pruebas de integración del ciclo de vida del activo en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust ejemplos de la construcción de activos en el compromiso fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [Activos ](/es/blockchain/assets.md)
- [Las instrucciones ](/es/blockchain/instructions.md)
- [Los tokens de autorización ](/es/reference/permissions.md)
- [JavaScript y TypeScript ](/es/guide/tutorials/javascript.md)
