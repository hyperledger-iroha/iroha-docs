---
translation_locale: es
translation_source: /blockchain/assets.md
translation_source_hash: 58c9f7657f5714dc4bbb884933a1c947687fcf6c83e471007e6c7885f1dab214
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Activos {#assets}

Un activo Iroha es un saldo numérico mantenido por una cuenta. Cada balance concreto apunta a un `AssetDefinition`, y la definición describe cómo se puede nombrar, acuñar, mostrar y dividir ese activo.

## Definición de los activos {#asset-definition}

Un `AssetDefinition` contiene:

- `id`: la dirección de definición canónica del activo
- `name`: un nombre de pantalla legible por el hombre
- `description`: Descripción facultativa legible por el hombre
- `alias`: alias opcionales en el formulario `<name>#<domain>.<dataspace>` o `<name>#<dataspace>`
- `spec`: precisión numérica y restricciones para los saldos
- `mintable`: la política de minotabilidad
- `logo`: opcional `SoraFS` URI
- `metadata`: metadatos arbitrarios sobre el valor clave
- `balance_scope_policy`: si los saldos son globales o restringidos por el espacio de datos
- `owned_by`: la cuenta que registró o posee la definición
- `total_quantity`: cantidad total emitida
- `confidential_policy`: política para las operaciones de activos protegidos

La definición de activos IDs son direcciones opacas canónicas. Cuando se construye una definición a partir de un dominio y un nombre, Iroha puede mantener esa proyección de dominio/nombre para UX y consultas, pero la forma de texto canónico es la dirección generada. .

## Saldo de los activos {#asset-balance}

Un `Asset` contiene:

- `id`: un `AssetId`, que combina la definición de activo, cuenta del titular y alcance opcional del saldo.
- `value`: un saldo de `Numeric`

La cuenta del titular es canónica y no tiene dominio.La definición de activo puede proyectarse bajo un dominio calificado para el espacio de datos, por ejemplo `payments.universal`.

## Capacidad de conservación {#mintability}

Las definiciones de activos soportan estos modos de mintabilidad:

|El modo |El significado .|
| ------------ | ----------------------------------------------------------------- |
|`Infinitely` |El activo puede ser acuñado y quemado en repetidas ocasiones.|
|`Once` |Se puede acuñar una vez y luego quemar.|
|`Not` |Token de suministro fijo que se puede quemar, pero no volver a acuñar.|
|`Limited(n)` |La acuñación se permite para un número limitado de operaciones adicionales. |

Utilizar `Infinitely` para activos elásticos normales y `Once` o `Limited(n)` para activos de suministro fijo o limitado. No utilice `Not` como política inicial a menos que la oferta de activos ya esté establecida.

## El alcance del equilibrio {#balance-scope}

El `balance_scope_policy` controla la forma en que se cubren los saldos:

- `Global`: un cubo de saldo por cuenta y definición del activo
- `DataspaceRestricted`: los saldos se dividen según el contexto del espacio de datos

Los saldos restringidos por espacio de datos son útiles cuando se utiliza la misma definición de activo en múltiples bases de datos Nexus, pero los saldos deben mantenerse aislados.

## Pruébalo en Taira {#try-it-on-taira}

Estas llamadas de sólo lectura muestran definiciones reales de activos en la red de prueba pública Taira:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Encuentra la definición actual de activo por cuotas Taira XOR:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

Busque definiciones que lleven metadatos:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

Los tres ejemplos son leídos. Para acuñar, quemar o transferir activos en Taira, utilice una cuenta financiada con grifo y el flujo guardado en [Conectar a los Dataspaces SORA Nexus](/es/get-started/sora-nexus-dataspaces.md).

Para un ejemplo de activo Taira que paga una cuota, guarde el ayudante del grifo desde [Obtenga Testnet XOR en Taira](/es/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) como `taira_faucet_claim.py`, luego reclame primero el activo del grifo y utilicelo como activo de gas para la transacción:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

Luego, incluye `--metadata ./taira.tx-metadata.json` en los comandos `ledger asset mint`, `ledger asset burn` y `ledger asset transfer`.

## Instrucciones {#instructions}

Los activos pueden registrarse, acuñarse, quemarse y transferirse con las instrucciones especiales Iroha:

- [`Register` y `Unregister`](/es/blockchain/instructions.md#un-register)
- [`Mint` y `Burn`](/es/blockchain/instructions.md#mint-burn)
- [`Transfer`](/es/blockchain/instructions.md#transfer)
- [`SetKeyValue` y `RemoveKeyValue`](/es/blockchain/instructions.md#setkeyvalue-removekeyvalue)

Véase también:

- [Guía CLI](/es/get-started/operate-iroha-via-cli.md)
- [Rust Tutorial](/es/guide/tutorials/rust.md)
- [Python Tutorial](/es/guide/tutorials/python.md)
- [JavaScript/TypeScript tutorial ](/es/guide/tutorials/javascript.md)
- [Modelo de datos ](/es/blockchain/data-model.md)
- [NFTs](/es/blockchain/nfts.md)
