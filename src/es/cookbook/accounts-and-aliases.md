---
translation_locale: es
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 6d36784afef0ef10113cabc995ddfb45fd8d382d7c32c553d77cf03ba5c1f65f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Cuentas y Alias {#accounts-and-aliases}

## Resultado {#outcome}

Trabaje de manera segura con identificadores de cuenta canónicos sin dominio I105 y alias legibles por humanos vinculados por separado, como `treasury@payments.universal`. Inspeccionará cuentas Taira, derivará su propio identificador canónico y resolverá alias sin confundir el contexto de enrutamiento con la identidad.

## Requisitos previos {#prerequisites}

- `curl`, `jq`, Python 3.11 o posterior, y el actual `iroha` CLI.
- Un `taira.client.toml` de [Conectar a Taira](./connect-to-taira.md) al inspeccionar tu propia cuenta.
- Una cuenta aprovisionada a través del servicio de financiación de la red de prueba Taira o la ruta de incorporación gobernada de la red antes de esperar que una lectura específica de la cuenta tenga éxito.

## Pasos {#steps}

### 1. Inspeccionar las cuentas canónicas en Taira {#_1-inspect-canonical-accounts-on-taira}

La lista de cuentas públicas siempre devuelve IDs canónicos I105. Un alias principal es opcional y se informa por separado.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

Un ID de `.id` es válido para campos de cuenta estrictos. No le agregue un dominio. Un alias de `.primary_alias` es una clave de búsqueda visible para el usuario, no otra identidad canónica.

### 2. Derive y normaliza tu ID Taira I105 {#_2-derive-and-normalize-your-taira-i105-id}

Lea solo la clave pública desde la configuración local. La misma clave pública se codifica de manera diferente para diferentes perfiles de red pública, así que seleccione `taira` explícitamente.

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

El valor normalizado debe ser idéntico a `TAIRA_ACCOUNT_ID`. La configuración `[account].domain` en el archivo TOML puede ser `wonderland.universal`, pero ese valor afecta únicamente el enrutamiento y el contexto de alias.

### 3. Lea la cuenta y sus activos {#_3-read-the-account-and-its-assets}

Después de que se provisiona la cuenta, consúltala directamente y lista una página de activos limitados. URL-codifica el valor I105 antes de usarlo en una ruta.

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

### 4. Buscar alias vinculados a la cuenta {#_4-look-up-aliases-bound-to-the-account}

El resolvedor inverso acepta un ID de cuenta canónica exacto. Las filas del espacio de datos público se pueden leer sin encabezados de firma de solicitud; los espacios de datos restringidos requieren una solicitud firmada autorizada.

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

`total: 0` es válido: una cuenta no necesita un alias. Cuando existe un enlace, resuelve su alias completo exacto y compara el ID de cuenta devuelto:

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

::: warning Límite de permisos

El servicio de financiación de testnet Taira puede aprovisionar su cuenta reclamante, pero eso no otorga autorización general para el registro de cuentas o la gestión de alias. Registrar otra cuenta requiere `CanRegisterAccount` bajo el validador activo. Los alias de cuenta normalmente también requieren un contrato de arrendamiento SNS activo y los permisos de alias apropiados. Use el planificador de incorporación/alias gobernado, o practique el registro contra la red local generada.

:::

En una red local, una vez que un paso seguro de aprovisionamiento de firmantes ha exportado un nuevo `NEW_ACCOUNT_ID` canónico, la superficie de registro es:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

Genere y almacene la clave privada correspondiente fuera de la documentación o del repositorio de la aplicación. Registrar una identificación cuya clave de controlador fue descartada crea una cuenta inutilizable.

## Verificar {#verify}

Demuestra que la clave pública de configuración, la codificación I105 y la vinculación de alias convergen en un único ID de cuenta canónico:

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

Almacenar IDs de cuenta canónicos. Usar IDs canónicos para firmas, permisos e instrucciones de transacción. Resolver un alias en el límite de la aplicación. Conservar el ID de cuenta canónico utilizado para la operación.

## Solución de problemas {#troubleshooting}

- Un error de análisis o de prefijo generalmente significa que una dirección fue codificada para un perfil de red diferente. Normalice con `--profile taira` y rechace las discrepancias.
- Una cuenta `404` después de un servicio de financiación de testnet `202` puede tener un retraso de propagación. Consulte la cuenta o el activo financiado antes de enviar una escritura.
- `total: 0` del resolvedor inverso significa que no hay un alias visible vinculado; no es un error de búsqueda de cuenta.
- `401` o `403` desde una ruta alias indica un espacio de datos restringido o permisos insuficientes de resolución exacta. No use la búsqueda de prefijos amplia como recurso alternativo.
- Un valor `name@domain.dataspace` legible no se acepta en todas partes donde se requiere un ID I105 canónico. Resuélvelo primero.
- Si el registro de la cuenta local tiene éxito pero Taira lo rechaza, la diferencia es la autorización. Obtenga `CanRegisterAccount`; no cambie el ID de la cuenta para eludir la validación.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Implementación de la dirección de cuenta canónica en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)
- [Pruebas de cuenta y alias Torii en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [Cuentas](/es/blockchain/accounts.md)
- [Alias de modelos de datos](/es/blockchain/data-model.md#aliases)
- [Convenciones de nombres](/es/reference/naming.md)
- [Tokens de permiso](/es/reference/permissions.md)
