---
translation_locale: es
translation_source: /blockchain/domains.md
translation_source_hash: 26e8efe6c728d0f819b12e7d8257777d3d4ea272f42fabf8aec727467146500f
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Dominios {#domains}

Los dominios son espacios de nombres registrados con un nombre en `World`. En el modelo de datos actual de Iroha 3, un dominio está cualificado por el espacio de datos al que pertenece, por lo que su identificador canónico es:

```text
domain.dataspace
```

Por ejemplo, `payments.universal` nombra el dominio `payments` dentro del espacio de datos `universal`.

## Estructura {#structure}

Un `Domain` registrado contiene:

- `id`: el `DomainId` calificado por espacio de datos
- `logo`: un `SoraFS` URI opcional para un logo de dominio
- `metadata`: metadatos arbitrarios de clave-valor
- `owned_by`: la cuenta que posee el dominio, normalmente la cuenta que lo registró

La carga útil de arranque utilizada para materializar un dominio es `NewDomain`. Contiene el `id`, el `logo` opcional y el `metadata` inicial. El tiempo de ejecución del software llena `owned_by` a partir del principal de autorización. Los clientes ordinarios no envían esta carga útil directamente.

## Registro {#registration}

La creación ordinaria de dominios utiliza el flujo de configuración de alias declarativo. Esto mantiene el arrendamiento SNS, las capacidades del propietario, la protección de presupuesto y la fila del dominio en una sola transacción atómica `EnsureAlias`. `Register::Domain` sigue siendo una superficie de génesis/bootstrap, y el comando `ledger domain` no tiene subcomando `register`.

Cree una intención `AliasSetupPlanRequestV1` sin secretos con un SDK o servicio de incorporación, luego haga que el CLI la planifique contra el estado en vivo y envíe ese plan exacto:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

La intención identifica `payments.universal`, su espacio de datos numérico, su propietario canónico en I105, el plazo de adquisición del arrendamiento y la condición que protege la cotización vigente de política y pago. El punto de acceso del planificador es `POST /v1/aliases/setup/plan`; el plan que devuelve queda vinculado a la cadena, la autoridad, el estado y el plazo. La eliminación del dominio sigue utilizando [`Unregister`](/es/blockchain/instructions.md#un-register).

Crear o eliminar un dominio requiere la gestión de dominio apropiada permiso bajo el validador de tiempo de ejecución de software activo. Los metadatos del dominio se pueden actualizar con [`SetKeyValue` y `RemoveKeyValue`](/es/blockchain/instructions.md#setkeyvalue-removekeyvalue) cuando el principal de autorización tiene permiso para modificar ese dominio.

## Pruébalo en Taira {#try-it-on-taira}

Enumere los dominios actualmente visibles en la testnet pública Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Relacione el catálogo público de carriles con los alias de espacios de datos:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Utilice el primer comando cuando una aplicación necesite comprobar si existe un dominio. Utilice el catálogo de carriles para inspeccionar los carriles asociados a un espacio de datos, incluida la visibilidad pública o restringida de cada carril y su estado de sincronización respecto al carril principal.

La configuración de un dominio es una operación de escritura que paga comisiones. Antes de probarla en Taira, asigne fondos al firmante mediante el flujo preparado del servicio de fondos de prueba en [Obtener XOR de testnet en Taira](/es/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) y, después, aplique el plan con un pagador explícito de comisiones. La CLI indica la comisión exacta antes de firmar:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

Construya la intención para un nombre de dominio único en ejecuciones repetidas de testnet, y use la política actual de Taira y la protección de cotización de activos por tarifas. No reutilice un plan producido para localnet o Minamoto.

## Relación con otras entidades {#relationship-to-other-entities}

Los dominios agrupan objetos del libro mayor de la blockchain y proporcionan un espacio de nombres para los datos con alcance de dominio. Las definiciones de activos usan identificadores calificados por dominio, y las consultas pueden listar dominios o encontrar objetos limitados a un dominio. Las cuentas en sí mismas no tienen dominio en el modelo de datos actual, pero las cuentas pueden poseer dominios y tener activos cuyas definiciones existen bajo los dominios.

Véase también:

- [Mundo](/es/blockchain/world.md)
- [Activos](/es/blockchain/assets.md)
- [Metadatos](/es/blockchain/metadata.md)
- [Reglas de nomenclatura](/es/reference/naming.md)
