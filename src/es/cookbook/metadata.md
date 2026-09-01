---
translation_locale: es
translation_source: /cookbook/metadata.md
translation_source_hash: bb486994faabb29fb48609a886862e44e565148be4800ec1244218ef37e2e54b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Metadatos {#metadata}

## Resultado {#outcome}

Lea los metadatos en Taira, establezca y verifique un valor de metadatos de cuenta con una transacción que pague explícitamente la tarifa, y vuelva a eliminar el valor. Mantendrá los metadatos del objeto del libro mayor separados de los metadatos de la tarifa de transacción.

## Requisitos previos {#prerequisites}

- `curl`, `jq`, Python 3.11 o posterior, y el `iroha` CLI actual.
- Un financiado `taira.client.toml` y `taira.tx-metadata.json` de [Conectar a Taira](./connect-to-taira.md).
- principal de autorización sobre los metadatos de la cuenta objetivo. El ejemplo apunta al propio principal de autorización configurado; otra cuenta requiere un permiso exacto.

## Pasos {#steps}

### 1. Leer metadatos sin un firmante criptográfico {#_1-read-metadata-without-a-signer}

Los metadatos son un mapa verificado de `Name` a JSON. Los mapas vacíos y la salida filtrada vacía son resultados válidos.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

Utilice metadatos para campos descriptivos o de indexación pequeños. Coloque cargas útiles grandes fuera del libro mayor y almacene un valor de resumen criptográfico, URI, o una referencia SoraFS en su lugar.

### 2. Derivar la cuenta objetivo {#_2-derive-the-target-account}

Lea solo la clave pública de la configuración de Taira y conviértala a la forma canónica I105 sin dominio.

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
```

### 3. Establecer un valor JSON {#_3-set-one-json-value}

El JSON leído desde la entrada estándar se convierte en el valor `cookbook_profile` de la cuenta. Por el contrario, `--metadata ./taira.tx-metadata.json` adjunta campos de tarifa al contenedor de datos de la transacción. Los dos mapas tienen objetivos y propósitos diferentes.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

El CLI cotiza la tarifa, firma, envía y espera por defecto. No agregue `--no-wait` cuando la siguiente operación dependa de este valor.

::: warning Límite de permisos

El validador activo decide quién puede modificar cada objeto. Actualizar otra cuenta normalmente requiere `CanModifyAccountMetadata`; los dominios, definiciones de activos, NFTs y los disparadores tienen sus propios permisos de metadatos específicos del objetivo. Si Taira no ha concedido el principal de autorización requerido, ejecute los mismos comandos de cuenta con `./localnet/client.toml`, sustituya el ID canónico I105 del principal de autorización de red local generado y omita el archivo de metadatos de tarifa Taira. Mantenga la selección explícita del pagador de tarifas local.

:::

### 4. Retire la llave {#_4-remove-the-key}

Primero lee el valor comprometido, luego envía una transacción de eliminación por separado.

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

Para las aplicaciones Python, los constructores tipados correspondientes son `Instruction.set_account_key_value` y `Instruction.remove_account_key_value`; preséntelos con los metadatos de la transacción y el asistente de espera de [tutorial de Python](/es/guide/tutorials/python.md#shared-setup).

## Verificar {#verify}

Después de la transacción establecida, `meta get` debe devolver el objeto con `version: 1`. Después de la eliminación, una búsqueda directa ya no debe devolver un valor:

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

La lectura de la cuenta separada distingue una clave de metadatos faltante de una falla de red o de cuenta. El código de producción también debería verificar todo el valor JSON después de configurarlo.

## Solución de problemas {#troubleshooting}

- La entrada estándar debe contener un valor válido JSON. Las cadenas necesitan comillas JSON; los objetos y arreglos deben estar bien formados.
- Las claves de metadatos son valores `Name` y distinguen entre mayúsculas y minúsculas después del análisis. Mantenga un vocabulario de claves estable en lugar de crear claves con versiones para cada cambio de esquema.
- `--metadata` es metadatos de transacción; no establece metadatos de objetos del libro mayor. Use el subcomando `meta set` de la entidad para esto último.
- Una presentación exitosa seguida de una lectura antigua puede ser un retraso de propagación. Espere la finalización aplicada y vuelva a intentar la consulta antes de volver a enviar.
- Un rechazo de permiso identifica el objeto objetivo y el límite del principal de autorización. Ensaye localmente o solicite el token exacto; no mueva datos de aplicaciones privadas a un campo de metadatos público para evitar el control de acceso.
- Nunca almacene claves privadas, identificadores personales sin procesar, tokens de acceso o documentos grandes en los metadatos.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Pruebas de integración de consultas de metadatos en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs)
- [Python SDK constructores de transacciones en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [Metadatos](/es/blockchain/metadata.md)
- [Opciones de almacenamiento de metadatos y libro mayor en blockchain](/es/guide/configure/metadata-and-store-assets.md)
- [Referencia de instrucción](/es/reference/instructions.md)
- [Tokens de permiso](/es/reference/permissions.md)
