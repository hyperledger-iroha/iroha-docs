---
translation_locale: es
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Los dominios {#domains}

Los dominios son nombres de espacios registrados en el `World`. En el modelo de datos actual Iroha 3 un dominio está calificado por su espacio de datos principal, por lo que el identificador canónico es:

```text
domain.dataspace
```

Por ejemplo, `payments.universal` nombra el dominio de `payments` dentro del espacio de datos `universal`.

## La estructura {#structure}

Un `Domain` registrado contiene:

- `id`: el espacio de datos calificado `DomainId`
- `logo`: una opción `SoraFS` URI para un logotipo de dominio
- `metadata`: metadatos arbitrarios sobre el valor clave
- `owned_by`: la cuenta que posee el dominio, normalmente la cuenta que lo registró.

La carga útil de bootstrap utilizada para materializar un dominio es `NewDomain`. Lleva la carga útil `id`, opcional `logo` y inicial `metadata`. El tiempo de ejecución llena `owned_by` de la autoridad.

## Registro {#registration}

La creación de dominios ordinarios utiliza el flujo de configuración del alias declarativo. Esto mantiene el contrato de arrendamiento SNS, las capacidades del propietario, la guardia de cotización y la fila de dominio en una transacción atómica `EnsureAlias`. `Register::Domain` sigue siendo una superficie genesis/bootstrap, y el comando `ledger domain` no tiene subcomando `register`.

Crea una intención `AliasSetupPlanRequestV1` libre de secretos con un SDK o servicio de incorporación, luego haz que el CLI la planifique contra el estado en vivo y envíe ese plan exacto:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

La intención identifica `payments.universal`, su espacio de datos numérico, el propietario canónico I105, el término de adquisición del arrendamiento y la guardia de cotizaciones actuales. El punto final del planificador es `POST /v1/aliases/setup/plan`; su plan devuelto está vinculado a cadena, autoridad, estado y plazo. La eliminación de dominio todavía utiliza [`Unregister`](/es/blockchain/instructions.md#un-register).

La creación o eliminación de un dominio requiere el permiso apropiado de administración del dominio bajo el validador activo de tiempo de ejecución. Los metadatos del dominio se pueden actualizar con [`SetKeyValue` y `RemoveKeyValue`](/es/blockchain/instructions.md#setkeyvalue-removekeyvalue) cuando la autoridad tiene permiso para modificar ese dominio.

## Pruébalo en Taira {#try-it-on-taira}

Enumera los dominios actualmente visibles en la red de pruebas pública Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Mapear el catálogo de carriles públicos hacia atrás a los alias del espacio de datos:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Use el primer comando cuando una aplicación necesita verificar si existe un dominio. Utilice el catálogo de carriles cuando necesite confirmar si un espacio de datos es público, restringido o se queda atrás del carril principal.

La configuración del dominio es una escritura de pago antes de intentarlo Taira, salvo el ayudante del grifo de [Obtenga el Testnet XOR en el Taira](/es/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) como `taira_faucet_claim.py`, financiar al firmante a través del grifo público y adjuntar metadatos de las tarifas:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

Construir la intención de un nombre de dominio único en repetidas pruebas de red, y utilizar la política actual de Taira y el protector de cotizaciones del activo. No reutilizar un plan producido para localnet o Minamoto.

## Relación con otras entidades {#relationship-to-other-entities}

Los dominios agrupan objetos en un libro mayor y proporcionan un espacio de nombres para los datos a escala de dominio. Las definiciones de activos usan identificadores calificados por dominio, y las consultas pueden listar dominios o encontrar objetos a escala de un dominio. Las propias cuentas no tienen dominio en el modelo de datos actual, pero las cuentas pueden poseer dominios y mantener activos cuyas definiciones viven bajo dominios.

Véase también:

- [El mundo](/es/blockchain/world.md)
- [Activos ](/es/blockchain/assets.md)
- [Metadatos ](/es/blockchain/metadata.md)
- [Reglas de denominación](/es/reference/naming.md)
