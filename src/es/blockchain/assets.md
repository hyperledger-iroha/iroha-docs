---
translation_locale: es
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Activos {#assets}

Un activo Iroha es un saldo numérico mantenido por una cuenta. Cada saldo concreto apunta a un `AssetDefinition`, y la definición describe cómo se puede nombrar, emitir, mostrar y dividir ese activo.

## Definición de activo {#asset-definition}

Un `AssetDefinition` contiene:

- `id`: la dirección de definición del activo canónico
- `name`: un nombre para mostrar legible por humanos
- `description`: descripción opcional legible por humanos
- `alias`: alias opcional en forma `<name>#<domain>.<dataspace>` o `<name>#<dataspace>`
- `spec`: precisión numérica y restricciones para los saldos
- `mintable`: la política de emisión de activos
- `logo`: opcional `SoraFS` URI
- `metadata`: metadatos arbitrarios de clave-valor
- `balance_scope_policy`: si los saldos son globales o restringidos al espacio de datos
- `owned_by`: la cuenta que registró o posee la definición
- `total_quantity`: cantidad total emitida
- `confidential_policy`: política para operaciones con activos protegidos

Los ID de definición de activos son direcciones opacas canónicas. Cuando se construye una definición a partir de un dominio y un nombre, Iroha puede mantener esa proyección de dominio/nombre para UX y consultas, pero la forma de texto canónica es la dirección generada.

## Saldo de activos {#asset-balance}

Un `Asset` contiene:

- `id`: un `AssetId`, que combina la definición del activo, la cuenta del titular y el alcance opcional del saldo del activo
- `value`: un saldo `Numeric`

La cuenta del titular es canónica y sin dominio. La definición del activo puede proyectarse bajo un dominio calificado por espacio de datos, por ejemplo `payments.universal`.

## Política de emisión de activos {#mintability}

Las definiciones de activos admiten estos modos de política de emisión de activos:

|Modo|Significado|
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` |Oferta elástica. El activo puede ser emitido y quemado repetidamente.|
| `Once`       |Token de suministro fijo. Puede emitirse una vez y luego ser quemado.|
| `Not`        |Token de suministro fijo que puede ser quemado pero no puede emitirse nuevamente.|
| `Limited(n)` |La política permite que se emitan nuevas unidades de activos en un número limitado de operaciones adicionales.|

Use `Infinitely` para activos elásticos normales y `Once` o `Limited(n)` para activos de suministro fijo o suministro limitado. No use `Not` como política inicial a menos que el suministro del activo ya esté establecido.

## Alcance del balance de activos {#balance-scope}

El `balance_scope_policy` controla cómo se particionan los saldos:

- `Global`: una partición de saldo por cuenta y definición de activo
- `DataspaceRestricted`: los saldos se dividen por el contexto del espacio de datos

Los saldos restringidos al espacio de datos son útiles cuando la misma definición de activo se utiliza en múltiples espacios de datos Nexus, pero los saldos deben permanecer aislados.

## Pruébalo en Taira {#try-it-on-taira}

Estas llamadas de solo lectura muestran definiciones de activos reales en la red de prueba pública Taira:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Encuentra la definición del activo de tarifa actual Taira XOR:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

Busca definiciones que contengan metadatos:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

Los tres ejemplos son lecturas. Para emitir, quemar o transferir activos en Taira, utiliza una cuenta financiada con testnet y el flujo protegido en [Conectar a los Espacios de Datos SORA Nexus](/es/get-started/sora-nexus-dataspaces.md).

Para ver un activo de Taira usado para pagar tarifas, guarde el auxiliar de [Obtener XOR de prueba en Taira](/es/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) como `taira_faucet_claim.py`, solicite primero fondos al dispensador y use el activo recibido para pagar el gas de la transacción:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

Luego incluye `--metadata ./taira.tx-metadata.json` en los comandos `ledger asset mint`, `ledger asset burn` y `ledger asset transfer`.

## Instrucciones {#instructions}

Los activos pueden ser registrados, emitidos, destruidos y transferidos con operaciones de instrucción Iroha:

- [`Register` y `Unregister`](/es/blockchain/instructions.md#un-register)
- [`Mint` y `Burn`](/es/blockchain/instructions.md#mint-burn)
- [`Transfer`](/es/blockchain/instructions.md#transfer)
- [`SetKeyValue` y `RemoveKeyValue`](/es/blockchain/instructions.md#setkeyvalue-removekeyvalue)

Véase también:

- [CLI guía](/es/get-started/operate-iroha-via-cli.md)
- [Tutorial de Rust](/es/guide/tutorials/rust.md)
- [tutorial de Python](/es/guide/tutorials/python.md)
- [Tutorial de JavaScript/TypeScript](/es/guide/tutorials/javascript.md)
- [Modelo de datos](/es/blockchain/data-model.md)
- [NFTs](/es/blockchain/nfts.md)
