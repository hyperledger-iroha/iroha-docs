---
translation_locale: es
translation_source: /cookbook/metadata.md
translation_source_hash: 238595124cd0a1b71900020d650fb208f844e051d2db4427801fe6405ff591c8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Metadatos {#metadata}

## El resultado {#outcome}

Leer metadatos en Taira, fijar y verificar el valor de los metadatos de una cuenta con una transacción de pago explícito, y eliminar el valor nuevamente. Mantendrá los metadatos de objetos del libro mayor separados de los metadados de las tarifas de transacción.

## Los requisitos previos {#prerequisites}

- `curl`, `jq`, Python 3.11 o más tarde, y la corriente `iroha` CLI.
- Un `taira.client.toml` y un `taira.tx-metadata.json` financiados desde [Conectar con Taira](./connect-to-taira.md).
- Autoridad sobre los metadatos de la cuenta objetivo. El ejemplo está dirigido a la propia autoridad configurada; otra cuenta requiere un permiso exacto.

## Los pasos {#steps}

### 1. Leer metadatos sin firmante. {#_1-read-metadata-without-a-signer}

Los metadatos son un mapa comprobado `Name` a JSON. mapas vacíos y salida filtrada vacía son resultados válidos.

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

Utilice metadatos para pequeños campos de descripción o indexación. Coloque las grandes cargas útiles fuera del libro y guarde un digesto, URI, o SoraFS referencia en su lugar

### 2. Derivar la cuenta objetivo {#_2-derive-the-target-account}

Sólo puede leer la clave pública de la configuración Taira y convertirla en el formulario canónico sin dominio I105.

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

### 3. Establezca un valor de JSON {#_3-set-one-json-value}

El JSON leído a partir de la entrada estándar se convierte en el valor `cookbook_profile` de la cuenta. Por el contrario, `--metadata ./taira.tx-metadata.json` adjunta campos de tarifas al sobre de transacción.

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

El CLI cita la tasa, firma, presenta y espera por defecto. No agregue `--no-wait` cuando la próxima operación dependa de este valor.

::: warning Límites de los permisos

El validador activo decide quién puede mutar cada objeto. Actualizar otra cuenta normalmente requiere `CanModifyAccountMetadata`; dominios, definiciones de activos, NFTs, y los activadores tienen sus propios permisos de metadatos específicos del objetivo. Si Taira no ha otorgado la autoridad requerida, ejecute los mismos comandos de cuenta con `./localnet/client.toml`, sustituya el canónico de la autoridad localnet generada I105 ID, y omita el archivo de metadatos de cuotas Taira.

:::

### 4. Retira la llave. {#_4-remove-the-key}

En primer lugar, lea el valor comprometido y luego envíe una transacción de remoción separada.

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

Para las aplicaciones Python, los constructores de tipografía correspondientes son `Instruction.set_account_key_value` y `Instruction.remove_account_key_value`; envíelos con los metadatos de la transacción y el asistente de espera del tutorial [Python ](/es/guide/tutorials/python.md#shared-setup).

## Verificar {#verify}

Después de la transacción establecida, `meta get` debe devolver el objeto con `version: 1`. Tras su eliminación, una búsqueda directa ya no debe devolver un valor:

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

La lectura de la cuenta separada distingue una clave de metadatos faltante de una falla de red o cuenta. El código de producción también debe verificar todo el valor JSON después de establecerlo.

## Solución de problemas {#troubleshooting}

- La entrada estándar debe contener un valor válido JSON. Las cadenas deben tener citas JSON; los objetos y matrices deben estar bien formados.
- Las claves de metadatos son valores `Name` y son sensibles al caso después del análisis. Mantenga un vocabulario de clave estable en lugar de crear claves versionadas para cada cambio de esquema.
- `--metadata` Se trata de metadatos de transacciones; no establece metadatos del objeto de un libro mayor. `meta set` el subcomandante de este último.
- Una presentación exitosa seguida de una vieja lectura puede ser un retraso en la propagación. Espera a la finalidad aplicada y vuelve a intentar la consulta antes de volver a enviar.
- Un rechazo de permisos identifica el objeto objetivo y la frontera de autoridad. Reanudar localmente o solicitar el token exacto; no mover los datos privados de la aplicación a un campo de metadatos públicos para evitar el control de acceso.
- Nunca almacenes claves privadas, identificadores personales en bruto, fichas de acceso o documentos grandes en metadatos.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Pruebas de integración de la consulta de metadatos en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs)
- [Python SDK los constructores de transacciones en el compromiso fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [Metadatos ](/es/blockchain/metadata.md)
- [Metadatos y opciones de almacenamiento del libro mayor](/es/guide/configure/metadata-and-store-assets.md)
- [Referencia de las instrucciones ](/es/reference/instructions.md)
- [Los tokens de autorización ](/es/reference/permissions.md)
