---
translation_locale: es
translation_source: /blockchain/accounts.md
translation_source_hash: 015a85d81c44b7ef7f13cdafb2ed8e493ef512b94dc500939655c70285eac3bd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Cuentas {#accounts}

Una cuenta es un principal de autorización que puede firmar transacciones y poseer el estado del registro de la blockchain. En el modelo de datos actual Iroha 3, `AccountId` es canónico y sin dominio: se deriva del controlador de cuentas y se codifica de manera canónica como [I105](/es/reference/i105.md). El dominio legible por humanos y el contexto del espacio de datos pertenecen a enlaces de alias de cuentas separados.

## Estructura {#structure}

Un `Account` registrado contiene:

- `id`: el `AccountId` canónico
- `metadata`: metadatos de cuenta arbitrarios
- `label`: un alias estable opcional
- `uaid`: un ID de Cuenta Universal opcional usado por los flujos de Nexus
- `opaque_ids`: identificadores opacos vinculados a la UAID de la cuenta

La carga útil de la transacción utilizada para crear una cuenta es `NewAccount`. Lleva la misma identidad, metadatos, etiqueta, UAID y campos de ID opaco utilizados por la cuenta registrada.

`uaid` complementa al `AccountId` canónico; no lo reemplaza. Úselo cuando los servicios Nexus necesiten un identificador estable de usuario u organización en diversos espacios de datos, registro que preserve la privacidad o búsqueda de capacidades del servicio. El tiempo de ejecución del software mantiene un índice uno a uno UAID-a-cuenta, requiere que los identificadores opacos se adjunten a través de un UAID, y rechaza identificadores opacos duplicados o en colisión. Vea [FHE y UAID](/es/blockchain/sora-nexus-services.md#fhe-and-uaid) para el flujo de capa de servicio Nexus.

## Controladores de cuentas {#account-controllers}

El controlador define cómo la cuenta autoriza acciones. El flujo predeterminado del cliente utiliza un par de claves Ed25519, pero el modelo de datos también admite controladores más complejos, como los controladores de políticas multigrupo.

La configuración del cliente almacena el principal de autorización de firma por separado de la configuración del par de red:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
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

Estas son lecturas públicas. Crear o actualizar una cuenta es una transacción firmada y requiere el Taira financiado en la testnet, según lo descrito en [Conectar a los Espacios de Datos SORA Nexus](/es/get-started/sora-nexus-dataspaces.md).

## Registro y permisos {#registration-and-permissions}

Las cuentas se registran y se dan de baja con el genérico [`Register` y `Unregister`](/es/blockchain/instructions.md#un-register) instrucciones. El validador de tiempo de ejecución de software activo decide quién puede crear cuentas y qué tokens de permiso o roles se requieren.

Después del registro, una cuenta puede:

- firmar transacciones
- mantener activos
- propios dominios
- recibir roles y tokens de permiso
- almacenar metadatos
- participar en los flujos de alias, rekey, recuperación e identidad Nexus cuando esas funciones estén habilitadas

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
- [SORA Nexus espacios de datos](/es/get-started/sora-nexus-dataspaces.md)
