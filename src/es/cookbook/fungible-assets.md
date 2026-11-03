---
translation_locale: es
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 3287a6bbaf06ec92ebbe9ac33a8294d4e1d232bc01fd6a5da13ddd166c620965
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Activos fungibles {#fungible-assets}

## Resultado {#outcome}

Inspeccione las definiciones de activos en vivo de Taira y complete un flujo de emisión, transferencia, quema y verificación de saldo en una red local generada. La receta utiliza IDs de definición de activos Base58 canónicos sin prefijo, IDs de cuenta I105 sin dominio y el pago explícito de tarifas.

## Requisitos previos {#prerequisites}

- `curl`, `jq`, Python 3.11 o posterior, Node.js 24, y los CLIs actuales `iroha` y `kagami`.
- Acceso de solo lectura Taira.
- Para la guía de escritura, una red local creada con `kagami localnet generate --peers 4 --out-dir ./localnet` como en [Lanzar Iroha](/es/get-started/launch-iroha.md), añadiendo `--asset-definition-id 66owaQmAQMuHxPzxUN3bqZ6FJfDa`. Esta red proporciona `./localnet/client.toml` y Torii en `http://127.0.0.1:8080`.

## Pasos {#steps}

### 1. Inspeccionar las definiciones Taira sin un firmante criptográfico {#_1-inspect-taira-definitions-without-a-signer}

Las definiciones de activos llevan un ID opaco en Base58, un nombre para mostrar, la política de emisión de activos, una escala numérica, un alias opcional, propietario, un dominio o espacio de datos propietario opcional, la política de saldo y la cantidad total. El saldo concreto también incluye la cuenta del titular y un alcance opcional del espacio de datos.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[]
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity]
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

Derive el principal de autorización local a partir de la clave pública en la configuración generada; luego cree un par de claves para una cuenta destinataria nueva y regístrela. No se imprime ninguna clave privada.

```bash
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

kagami keys --out-dir ./cookbook-recipient
DESTINATION_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert \
    "$(cat ./cookbook-recipient/public.key)"
)"
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  account register --id "$DESTINATION_ACCOUNT"
```

### 3. Usar una definición numérica propiedad del cliente {#_3-use-a-client-owned-numeric-definition}

Fuera del génesis, una definición se registra bajo un `--domain` propietario que pertenece al firmante, y el cliente de una red local generada no posee ninguno. La red local generada con `--asset-definition-id` ya contiene esta definición: el génesis la registró con una escala sin restricciones, hizo al cliente su propietario y emitió 1.000.000.000 unidades al cliente.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

No reutilice ese ID en Taira. El registro en la red pública requiere un ID canónico nuevo, un dominio propietario que pertenezca a su cuenta (pasado a `ledger asset definition register` como `--domain`), una concesión de `CanManageAssetDefinitionAlias` para cualquier alias y financiación de tarifas.

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

Después de la quema, espere el saldo de origen `1000000064.50`, el saldo de destino `25.50` y la cantidad total `1000000090.00`.

::: warning Límite de permisos

En Taira, use `--fee-payer authority` para cada escritura; el CLI cotiza la tarifa exacta, en el activo de tarifa de Taira, antes de firmar. El registro requiere ser propietario del `--domain` de la definición, y un alias también necesita `CanManageAssetDefinitionAlias`. La emisión requiere ser propietario de la definición o tener `CanMintAssetWithDefinition` o `CanMintAssetToAccount`; la transferencia y la quema requieren autoridad sobre el saldo de origen. Una cuenta financiada por el servicio de financiación de testnet no es automáticamente un emisor.

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
- El Paso 2 registra explícitamente la cuenta de destino, por lo que la transferencia también funciona cuando la admisión de cuentas es `ExplicitOnly`. La guarda CLI de nombre similar no registra una cuenta ni un saldo; aborta en lugar de agregar otra instrucción.
- Un rechazo de tarifa ocurre antes del éxito normal de la instrucción. Seleccione el pagador, compruebe el activo de tarifa y el máximo en la cotización de tarifa del CLI, y verifique ese saldo.
- Una nueva ejecución en la misma red local parte de los saldos anteriores, y `kagami keys` rechaza un `./cookbook-recipient` existente. Inicie una nueva red local generada y elimine ese directorio, o compare los cambios de saldo en lugar de los valores absolutos. Nunca use una cadena aleatoria malformada en lugar del ID Base58.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Pruebas de integración del ciclo de vida del activo en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/asset.rs)
- [Rust ejemplos de construcción de activos en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/examples/tutorial.rs)
- [Activos](/es/blockchain/assets.md)
- [Instrucciones](/es/blockchain/instructions.md)
- [Tokens de permiso](/es/reference/permissions.md)
- [JavaScript y TypeScript](/es/guide/tutorials/javascript.md)
