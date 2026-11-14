---
translation_locale: es
translation_source: /blockchain/accounts.md
translation_source_hash: adc98cbf1fcadae4415d03dcc262eb03f8c95b429527e403d230934ae2f3243c
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Cuentas {#accounts}

Una cuenta es una autoridad que puede firmar transacciones y ser titular de estado del libro mayor. En el modelo de datos actual de Iroha 3, `AccountId` es canónico y no contiene un dominio: se deriva del controlador de la cuenta y se codifica de forma canónica como [I105](/es/reference/i105.md). El contexto de dominio y de espacio de datos legible para las personas pertenece a vinculaciones separadas de alias de cuenta.

## Estructura {#structure}

Un `Account` registrado contiene:

- `id`: el `AccountId` canónico
- `metadata`: metadatos de cuenta arbitrarios
- `label`: un alias estable opcional
- `uaid`: un identificador universal de cuenta opcional que utilizan los flujos de SORA Nexus
- `opaque_ids`: identificadores opacos vinculados a la UAID de la cuenta

La carga útil de la transacción utilizada para crear una cuenta es `NewAccount`. Lleva la misma identidad, metadatos, etiqueta, UAID y campos de ID opaco utilizados por la cuenta registrada.

`uaid` complementa al `AccountId` canónico; no lo sustituye. Utilícelo cuando los servicios de SORA Nexus necesiten un identificador estable de usuario u organización entre espacios de datos, un registro que preserve la privacidad o la consulta de capacidades de servicio. El entorno de ejecución mantiene un índice uno a uno entre UAID y cuentas, exige que los identificadores opacos se adjunten mediante un UAID y rechaza los identificadores opacos duplicados o que colisionen. Consulte [FHE y UAID](/es/blockchain/sora-nexus-services.md#fhe-and-uaid) para conocer el flujo de la capa de servicios de SORA Nexus.

## Controladores de cuentas {#account-controllers}

El controlador define cómo la cuenta autoriza acciones. El flujo predeterminado del cliente utiliza un par de claves Ed25519, pero el modelo de datos también admite controladores más complejos, como los controladores de políticas multigrupo.

La configuración del cliente almacena el principal de autorización de firma por separado de la configuración del par de red:

```toml
[account]
profile = "taira"
public_key = "ed0120..."
private_key_file = "/absolute/path/to/private.key"
```

Consulte [configuración del cliente](/es/guide/configure/client-configuration.md) y [generación de claves](/es/guide/security/generating-cryptographic-keys.md) para los formatos de clave actuales.

## Pruébalo en Taira {#try-it-on-taira}

Enumere algunas ID de cuenta canónicas de la testnet pública Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

Para inspeccionar los activos de la cuenta, copie un ID de cuenta de la primera llamada y codifíquelo con URL antes de colocarlo en la ruta. Este fragmento Python hace eso para la primera cuenta listada:

```bash
python3 - <<'PY'
import json
import urllib.parse
import urllib.request

root = "https://taira.sora.org"
accounts = json.load(urllib.request.urlopen(f"{root}/v1/accounts?limit=1"))["items"]
account_id = accounts[0]["id"]
encoded = urllib.parse.quote(account_id, safe="")
assets = json.load(
    urllib.request.urlopen(f"{root}/v1/accounts/{encoded}/assets?limit=5")
)

print(json.dumps({"account_id": account_id, "assets": assets["items"]}, indent=2))
PY
```

Estas operaciones son lecturas públicas. Crear o actualizar una cuenta es una transacción firmada y requiere la configuración de Taira con fondos obtenidos del servicio de fondos de prueba descrita en [Conectarse a los espacios de datos de SORA Nexus](/es/get-started/sora-nexus-dataspaces.md).

## Registro y permisos {#registration-and-permissions}

Las cuentas se registran y se dan de baja con el genérico [`Register` y `Unregister`](/es/blockchain/instructions.md#un-register) instrucciones. El validador de tiempo de ejecución de software activo decide quién puede crear cuentas y qué tokens de permiso o roles se requieren.

Después del registro, una cuenta puede:

- firmar transacciones
- mantener activos
- propios dominios
- recibir roles y tokens de permiso
- almacenar metadatos
- participar en los flujos de alias, cambio de claves, recuperación e identidad de SORA Nexus cuando esas funciones estén habilitadas

## Solución de problemas de identidad {#troubleshooting-identity-issues}

Si una transacción es rechazada inesperadamente, verifique que:

- la clave pública del cliente coincide con la clave privada utilizada para firmar
- la cuenta fue registrada en el génesis de la blockchain o mediante una transacción comprometida
- el principal de autorización tiene los permisos requeridos por la instrucción
- Los campos de cuenta estrictos usan el ID de cuenta canónico I105, mientras que los nombres legibles se resuelven mediante una vinculación activa de alias de cuenta

Véase también:

- [Permisos](/es/blockchain/permissions.md)
- [Metadatos](/es/blockchain/metadata.md)
- [Configuración del cliente](/es/guide/configure/client-configuration.md)
- [Espacios de datos de SORA Nexus](/es/get-started/sora-nexus-dataspaces.md)
