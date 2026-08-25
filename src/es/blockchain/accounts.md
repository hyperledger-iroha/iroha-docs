---
translation_locale: es
translation_source: /blockchain/accounts.md
translation_source_hash: 015a85d81c44b7ef7f13cdafb2ed8e493ef512b94dc500939655c70285eac3bd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Cuentas {#accounts}

Una cuenta es una autoridad que puede firmar transacciones y el estado del libro mayor propio. En el modelo de datos actual Iroha 3, `AccountId` es canónico y no tiene dominio: se deriva del controlador de la cuenta y se codifica canónicamente como [I105](/es/reference/i105.md). El contexto de dominio y espacio de datos legibles por el hombre pertenece a vínculos separados de alias de cuenta.

## La estructura {#structure}

Un `Account` registrado contiene:

- `id`: el canónico `AccountId`
- `metadata`: metadatos de cuentas arbitrarios
- `label`: un alias estable opcional
- `uaid`: cuenta universal opcional ID utilizada por los flujos Nexus
- `opaque_ids`: Identificadores opacos vinculados a la cuenta de UAID

La carga útil de la transacción utilizada para crear una cuenta es `NewAccount`. Lleva los mismos campos de identidad, metadatos, etiqueta, UAID y opaco ID utilizados por la cuenta registrada.

`uaid` complementa el canónico `AccountId`; No lo reemplaza. Nexus Los servicios necesitan un usuario o una organización estable para gestionar los espacios de datos, la inscripción que preserva la privacidad. El tiempo de ejecución mantiene un uno a uno UAID- el índice de contabilidad, requiere que se adjunten identificadores opacos a través de un UAID, y rechaza los identificadores opacos duplicados o en colisión. [FHE y UAID](/es/blockchain/sora-nexus-services.md#fhe-and-uaid) para el Nexus flujo de la capa de servicio.

## Controladores de cuentas {#account-controllers}

El controlador define cómo la cuenta autoriza acciones. El flujo de cliente predeterminado utiliza un par de teclas Ed25519, pero el modelo de datos también admite controladores más ricos como los controladores de políticas multisignaturales.

La configuración del cliente almacena la autoridad de firma por separado de la configuración de pares:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

Veamos . [configuración del cliente](/es/guide/configure/client-configuration.md) y [generación clave](/es/guide/security/generating-cryptographic-keys.md) para los formatos clave actuales.

## Pruébalo en Taira {#try-it-on-taira}

Enumera algunas cuentas canónicas IDs de la red de pruebas pública Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

Para inspeccionar los activos de la cuenta, copiar una cuenta ID desde la primera llamada y URL- lo codifica antes de ponerlo en el camino. Python snippet hace eso para la primera cuenta incluida en la lista:

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

Estas son lecturas públicas. La creación o actualización de una cuenta es una transacción firmada y requiere la configuración Taira financiada por grifo descrita en [Conectar a SORA Nexus Dataspaces](/es/get-started/sora-nexus-dataspaces.md) .

## Registro y permisos {#registration-and-permissions}

Las cuentas se registran y no se registran con las instrucciones genéricas [`Register` y `Unregister`](/es/blockchain/instructions.md#un-register). El validador de tiempo de ejecución activo decide quién puede crear cuentas y qué fichas o roles de permiso se requieren.

Después del registro, una cuenta puede:

- firmar las transacciones
- poseer activos
- dominios propios
- reciben papeles y tokens de permiso
- almacenamiento de metadatos
- Participar en los flujos de alias, rekey, recuperación y identidad Nexus, cuando estas características estén activadas

## Resolución de problemas con la identidad {#troubleshooting-identity-issues}

Si una transacción es rechazada de forma inesperada, compruebe si:

- La clave pública del cliente coincide con la clave privada utilizada para firmar.
- la cuenta se registró en génesis o mediante una transacción comprometida
- La autoridad tiene los permisos requeridos por la instrucción.
- Los campos de cuentas estrictas utilizan la cuenta canónica I105 ID, mientras que los nombres legibles se resuelven a través de un alias activo de contabilidad vinculativo

Véase también:

- [Las autorizaciones ](/es/blockchain/permissions.md)
- [Metadatos ](/es/blockchain/metadata.md)
- [Configuración del cliente ](/es/guide/configure/client-configuration.md)
- [Espacios de datos SORA Nexus](/es/get-started/sora-nexus-dataspaces.md)
