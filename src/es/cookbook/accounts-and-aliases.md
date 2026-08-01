---
translation_locale: es
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 23b3ddbdadb0d177b2b12de60e0947a94ecdb20fa6ee1b3a2c6b83e5c91ba2f3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Cuentas y alias {#accounts-and-aliases}

## El resultado {#outcome}

Trabajar de forma segura con canonical sin dominio I105 cuentas IDs y alias legibles por el hombre vinculados separadamente, tales como: `treasury@payments.universal`. Usted inspeccionará Taira las cuentas, derivar su propio canónico ID, y resolver los alias sin confundir el contexto de enrutamiento con la identidad.

## Los requisitos previos {#prerequisites}

- `curl`, `jq`, Python 3.11 o más tarde, y la corriente `iroha` CLI.
- Una `taira.client.toml` de [Conectar a Taira](./connect-to-taira.md) al inspeccionar su propia cuenta.
- Una cuenta proporcionada a través del grifo Taira o de la ruta de incorporación regulada de la red antes de esperar que una lectura específica de la cuenta tenga éxito.

## Los pasos {#steps}

### 1. Inspeccionar las cuentas canónicas de Taira {#_1-inspect-canonical-accounts-on-taira}

En la lista de cuentas públicas siempre se devuelve el canonico I105 IDs. El alias primario es opcional y se informa por separado.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

Un ID de `.id` es válido para campos estrictos de cuentas. No añadir un dominio a él. Un alias de `.primary_alias` es una clave de búsqueda orientada al usuario, no otra identidad canónica.

### 2. Derivar y normalizar su Taira I105 ID {#_2-derive-and-normalize-your-taira-i105-id}

La misma clave pública está codificada de manera diferente para diferentes perfiles de redes públicas, así que seleccione `taira` explícitamente.

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

printf '%s\n' "$TAIRA_ACCOUNT_ID" \
  | iroha tools address normalize --profile taira
```

El valor normalizado debe ser idéntico a `TAIRA_ACCOUNT_ID`. La configuración de `[account].domain` en el archivo TOML puede ser `wonderland.universal`, pero ese valor afecta solo al contexto de enrutamiento y alias.

### 3. Leer la cuenta y sus activos {#_3-read-the-account-and-its-assets}

Después de que se proporciona la cuenta, consulte directamente y enumere una página de activos limitados. URL-encode el valor I105 antes de utilizarlo en un camino.

```bash
iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

ENCODED_ACCOUNT_ID="$(
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' \
    "$TAIRA_ACCOUNT_ID"
)"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/accounts/$ENCODED_ACCOUNT_ID/assets?limit=10" \
  | jq '{total, items}'
```

### 4. Busque alias vinculados a la cuenta. {#_4-look-up-aliases-bound-to-the-account}

El resolver inverso acepta una cuenta canónica exacta ID. Las filas del espacio de datos público se pueden leer sin encabezados de firma de solicitud; los espacios de datos restringidos requieren una solicitud firmada autorizada.

```bash
jq -nc --arg account_id "$TAIRA_ACCOUNT_ID" \
  '{account_id: $account_id}' > alias-by-account.json

curl -fsS -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-binary @alias-by-account.json \
  https://taira.sora.org/v1/aliases/by-account \
  | tee alias-bindings.json \
  | jq '{account_id, total, items}'
```

`total: 0` es válido: una cuenta no necesita un alias. Cuando exista un alias vinculante, resuelva su alias exacto y comparar la cuenta devuelta ID:

```bash
ALIAS_WAS_RESOLVED=false
if TAIRA_ALIAS="$(jq -er '.items[0].alias' alias-bindings.json)"; then
  jq -nc --arg alias "$TAIRA_ALIAS" \
    '{alias: $alias}' > alias-resolve.json

  curl -fsS -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    --data-binary @alias-resolve.json \
    https://taira.sora.org/v1/aliases/resolve \
    | tee alias-resolution.json \
    | jq '{alias, account_id, source}'
  ALIAS_WAS_RESOLVED=true
else
  printf '%s\n' 'No visible alias is bound to this account.'
fi
```

::: warning Límites de los permisos

El Consejo Taira la empresa puede proveer su cuenta del solicitante, pero eso no otorga a los Autoridad de registro de cuentas o autoridad de gestión de alias. `CanRegisterAccount` Los alias de las cuentas normalmente requieren también un SNS el contrato de arrendamiento y los permisos de alias apropiados. o ensayar el registro con respecto a la red local generada.

:::

En una red local, una vez que un paso seguro de suministro de firmas haya exportado una nueva canónica `NEW_ACCOUNT_ID`, la superficie de registro es:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

Generar y almacenar la clave privada correspondiente fuera del repositorio de documentación o aplicaciones. Registrar un ID cuya clave controladora fue desechada crea una cuenta inutilizable.

## Verificar {#verify}

Demostrar que la clave pública de configuración, el código I105 y los alias de unión convergen en una cuenta canónica ID:

```bash
NORMALIZED_ACCOUNT_ID="$(
  printf '%s\n' "$TAIRA_ACCOUNT_ID" \
    | iroha tools address normalize --profile taira
)"
test "$NORMALIZED_ACCOUNT_ID" = "$TAIRA_ACCOUNT_ID"

if test "${ALIAS_WAS_RESOLVED:-false}" = true; then
  test "$(jq -r '.account_id' alias-resolution.json)" = "$TAIRA_ACCOUNT_ID"
fi
```

Guarde la cuenta canónica IDs. Utilice la IDs canónica para firmas, permisos e instrucciones de transacción. Resolva un alias en el límite de la aplicación. Mantenga la cuenta canonica ID utilizada para la operación.

## Solución de problemas {#troubleshooting}

- Un error de análisis o prefijo generalmente significa que una dirección fue codificada para un perfil de red diferente. Normaliza con `--profile taira` y rechaza las discrepancias.
- Una cuenta `404` después de un grifo `202` puede ser un retraso en la propagación. Revisar la cuenta o el activo financiado antes de enviar una nota.
- `total: 0` desde el resolver inverso significa que no hay alias visible vinculado; no se trata de una falla en la búsqueda de cuenta.
- `401` o `403` de una ruta alias indica un espacio de datos restringido o un permiso de resolución exacta insuficiente. No utilice la búsqueda de prefijos amplios como retroceso.
- Un valor legible `name@domain.dataspace` no es aceptado en todos los lugares donde se requiere un canónico I105 ID.
- Si el registro local de la cuenta tiene éxito pero Taira lo rechaza, la diferencia es la autorización. Obtenga `CanRegisterAccount`; no cambie la cuenta ID para evitar la validación.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Implementación de la dirección de cuenta canónica en el compromiso fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/account/address.rs)
- [Pruebas de cuenta y alias Torii en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [Cuentas ](/es/blockchain/accounts.md)
- [Los alias del modelo de datos](/es/blockchain/data-model.md#aliases)
- [Convenciones de nombramiento](/es/reference/naming.md)
- [Los tokens de autorización ](/es/reference/permissions.md)
