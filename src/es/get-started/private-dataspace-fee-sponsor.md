---
translation_locale: es
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 37a2c29dccf3d2abacbbba16869d65b70b93545875a122470601194231c2263b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Tarifas de patrocinador para un espacio de datos privado {#sponsor-fees-for-a-private-dataspace}

El patrocinio de tarifas permite a los usuarios enviar transacciones en un espacio de datos privado sin tener XOR. El usuario aún firma la transacción. Los metadatos de la transacción apuntan a una cuenta patrocinadora, y el entorno de ejecución del software debita el saldo de XOR del patrocinador para la tarifa de la red.

La integración tiene tres partes móviles:

1. el nodo permite el patrocinio de tarifas
2. la cuenta del patrocinador existe y tiene XOR
3. cada usuario tiene `CanUseFeeSponsor` para ese patrocinador

Después de eso, cada transacción de usuario patrocinado solo necesita estos metadatos:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

Esta página muestra dos patrones comunes:

- El usuario gratuito escribe: el patrocinador paga XOR y el usuario no paga nada.
- Tarifas de token local: el usuario paga al patrocinador en un token de la aplicación, y el patrocinador paga a la red en XOR.

Use Taira o primero una red de prueba privada. Un nuevo espacio de datos privado es un cambio de operador y de gobernanza; no se crea mediante la configuración del cliente.

## Valores de ejemplo {#example-values}

Los comandos a continuación usan estos marcadores de posición:

```bash
export DATASPACE="team"
export USER="<USER_ACCOUNT_I105>"
export SPONSOR="<SPONSOR_ACCOUNT_I105>"
export TREASURY="<TREASURY_ACCOUNT_I105>"
export XOR_ASSET="xor#universal"
export BILLING_DOMAIN="billing.team"
export LOCAL_FEE_ASSET="usage#billing.team"
export LOCAL_FEE_ASSET_ID="<LOCAL_FEE_ASSET_DEFINITION_BASE58>"
export USER_ALIAS="alice@team"
export PHONE_POLICY="phone#team"
export EMAIL_POLICY="email#team"
export POLICY_OWNER="<IDENTIFIER_POLICY_OWNER_ACCOUNT_I105>"
```

Use identificadores de cuenta canónicos I105 a menos que su implementación tenga alias de cuenta activos para las mismas cuentas.

## 1. Preparar el espacio de datos {#_1-prepare-the-dataspace}

Comience desde el catálogo del espacio de datos privado y el trabajo de enrutamiento descrito en [Conectar a los Espacios de Datos SORA Nexus](/es/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace). Un fragmento orientado al operador se ve así:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "team-private"
description = "Private team lane"
dataspace = "team"
visibility = "private"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "team"
id = 42
description = "Private team dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "team"
[nexus.routing_policy.rules.matcher]
account_prefix = "team."
description = "Route team domains to the private dataspace"
```

Antes de pasar a las transacciones de usuario, verifica que:

- la vía de ejecución privada aparece en la respuesta del nodo `/status`
- las cuentas de usuario son admitidas por su flujo de incorporación privado
- la cuenta del patrocinador existe
- el activo de tarifa XOR y la cuenta de sumidero de tarifas son válidos en la red

## 2. Registrar activos en el espacio de datos {#_2-register-assets-in-the-dataspace}

Registra las definiciones de activos que los usuarios contendrán dentro del espacio de datos privado antes de integrarlas en la lógica de la aplicación. Para el patrón de tarifa de token local, el tutorial usa `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

Primero configure el dominio y el arrendamiento SNS que posee el espacio de nombres del activo. Cree una intención `AliasSetupPlanRequestV1` sin secretos para `$BILLING_DOMAIN`, incluyendo el ID numérico `team` del espacio de datos, el propietario canónico, el plazo del arrendamiento y el guardia de cotización actual:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

Luego registre la definición del activo. El `--id` canónico es el ID de definición de activo a nivel de red. El alias es lo que los desarrolladores y usuarios finales deberían usar en el código del espacio de datos:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

emitir o transferir el token local a un usuario durante la incorporación:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

Verifique el saldo del usuario:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

Utiliza el mismo patrón para los activos de aplicación en el espacio de datos. Registra una definición de activo por token, asigna un alias de espacio de datos a cada uno, y refiere el alias desde el código SDK en lugar de codificar de forma fija los ID de definición de activo canónicos.

## 3. Registrar alias de usuario {#_3-register-user-aliases}

Las cuentas siguen siendo identificaciones de cuenta canónicas I105. Los nombres visibles para el usuario son alias de cuenta, y los alias deben ser identificadores no sensibles, como `alice@team` o `alice@members.team`. No use números de teléfono o direcciones de correo electrónico como alias. Esos pertenecen al flujo de identificadores privados en la siguiente sección.

La configuración de alias utiliza el mismo planificador declarativo que la configuración del dominio. Haga que el servicio SDK o de incorporación cree una intención `AliasSetupPlanRequestV1` sin secretos cuyo registro de alias de cuenta apunta a `$USER`, selecciona el rol principal, fija el ID numérico del espacio de datos y mantiene el guardián de la cotización de arrendamiento actual. Luego planifícalo y aplícalo como una única transacción atómica:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

Si el usuario no debe pagar XOR, utilice el servicio de incorporación consciente del patrocinador aprobado para construir y enviar la transacción de configuración. No divida la adquisición del arrendamiento y la vinculación del alias en transacciones de aplicación independientes.

Después de que el alias esté vinculado, verifíquelo desde el CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Para la creación de una nueva cuenta, prefiera un servicio de incorporación que construya `NewAccount` con un `uaid` estable y, si es necesario, un `label` inicial. El simple comando `ledger account register --id` solo registra el ID de cuenta canónica.

## 4. Registrar el teléfono y el correo electrónico de forma privada en FHE {#_4-register-phone-and-email-privately-with-fhe}

Utilice números de teléfono y direcciones de correo electrónico como identificadores privados, no como alias públicos. El flujo respaldado por FHE mantiene los identificadores sin procesar fuera de los alias de cuenta, los metadatos de transacciones y el estado mundial:

1. el operador registra un [RAM-LFE/FHE política del programa](/es/blockchain/ram-lfe.md) para el teléfono y el correo electrónico
2. el operador registra políticas de identificador activas como `phone#team` y `email#team`
3. la billetera normaliza el teléfono o correo electrónico localmente
4. la cartera envía el valor cifrado al resolutor
5. el solucionador devuelve un `IdentifierResolutionReceipt`
6. el usuario envía `ClaimIdentifier` con el registro de resultados del protocolo
7. la cadena almacena un identificador opaco y el hash del recibo, no el número de teléfono ni la dirección de correo sin procesar

La configuración de políticas del lado del operador es una tarea SDK o de servicio. Construya y envíe estos pares de instrucciones para cada tipo de identificador:

```text
RegisterRamLfeProgramPolicy(
  program_id = "phone_team",
  owner = "$POLICY_OWNER",
  backend = "bfv-programmed-sha3-256-v1",
  verification_mode = "signed",
  commitment = "<HIDDEN_PROGRAM_POLICY_COMMITMENT>",
  resolver_public_key = "<RESOLVER_PUBLIC_KEY>"
)
ActivateRamLfeProgramPolicy(program_id = "phone_team")

RegisterIdentifierPolicy(
  id = "$PHONE_POLICY",
  owner = "$POLICY_OWNER",
  normalization = "PhoneE164",
  program_id = "phone_team",
  note = "Private phone registration for team dataspace"
)
ActivateIdentifierPolicy(policy_id = "$PHONE_POLICY")
```

Repítelo para el correo electrónico con:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

Durante la incorporación, la cartera o el backend deberían normalizar localmente:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

Después de que se cree el archivo de metadatos del patrocinador en el paso 8, envíe una instrucción de reclamación firmada por el usuario con esos metadatos:

```text
ClaimIdentifier(
  account = "$USER",
  receipt = IdentifierResolutionReceipt {
    payload: {
      policy_id: "$PHONE_POLICY",
      opaque_id: "<OPAQUE_ACCOUNT_ID>",
      uaid: "<USER_UAID>",
      account_id: "$USER",
      ...
    },
    attestation: "<RESOLVER_SIGNATURE_OR_PROOF>"
  }
)
```

El CLI actual no expone comandos tipados para estas instrucciones de identidad. Genere valores `InstructionBox` serializados con el SDK y envíelos a través de `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Mantén estas medidas de seguridad en el servicio de incorporación:

- los alias de cuenta son solo identificadores legibles por humanos
- los valores crudos de teléfono y correo electrónico nunca aparecen en alias, metadatos, registros o cargas útiles de transacciones
- la cuenta tiene un `uaid` antes de que reclame identificadores privados
- protocolo resultado registros enlazar `policy_id`, `opaque_id`, `uaid`, `account_id` y caducidad
- las claves de resolución y los compromisos de programas ocultos están controlados por la gobernanza

## 5. Habilitar el patrocinio en el nodo {#_5-enable-sponsorship-on-the-node}

El nodo y su entorno de ejecución rigen el patrocinio de tarifas. Actívelo en la configuración de tarifas de Nexus:

```toml
[nexus.fees]
fee_asset_id = "xor#universal"
fee_sink_account_id = "<FEE_SINK_ACCOUNT_I105_OR_ALIAS>"
base_fee = "0"
per_byte_fee = "0"
per_instruction_fee = "0.001"
per_gas_unit_fee = "0.00005"
sponsorship_enabled = true
sponsor_max_fee = "0"
```

`fee_asset_id` es el activo de la tarifa de red. Para SORA Nexus esto es XOR. Use el alias activo XOR o el ID de definición de activo canónico XOR expuesto por su red.

`sponsor_max_fee = "0"` significa que no hay un límite por patrocinador por transacción. Para producción, establezca un límite distinto de cero después de conocer el tamaño normal y el perfil de costos de ejecución de transacciones de su espacio de datos.

Reinicie o aplique esta configuración a través de su proceso normal de operador.

## 6. Crear y Financiar al Patrocinador {#_6-create-and-fund-the-sponsor}

Generar un par de claves de patrocinador si es necesario:

```bash
kagami keys --algorithm ed25519 --out-dir ./fee-sponsor-key
```

Convierte la clave pública al formato de cuenta para tu red:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

Registra la cuenta del patrocinador a través de tu flujo de incorporación privado:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

Financie al patrocinador con XOR desde una tesorería, cuenta de reclamación u otra cuenta financiada:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Para los ensayos de Taira, guarda el asistente de servicio de financiación de testnet de [Obtener Testnet XOR en Taira](/es/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) como `taira_faucet_claim.py`, luego financia al patrocinador con el servicio de financiación pública de testnet en lugar de una transferencia del tesoro:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

Verifique el saldo del patrocinador XOR:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. Conceder acceso a un usuario al patrocinador {#_7-grant-a-user-access-to-the-sponsor}

El patrocinador debe otorgar a cada usuario permiso para cobrarle tarifas. La concesión es lo que evita que los usuarios nombren cuentas de patrocinador arbitrarias.

Ejecute esto como la cuenta patrocinadora, o como una cuenta operativa permitida por la política de tiempo de ejecución de su software:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission grant --id "$USER"
```

Para los servicios de incorporación, haga de esto un paso normal de provisión de cuentas y registre:

- cuenta de usuario
- cuenta patrocinadora
- espacio de datos o aplicación
- boleto de aprobación o decisión de gobernanza

Para inspeccionar los permisos de un usuario:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. Adjuntar metadatos del patrocinador {#_8-attach-sponsor-metadata}

Crear un archivo de metadatos reutilizable:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

Cualquier escrito enviado con estos metadatos se cobra al patrocinador:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

Para SDKs, adjunte el mismo objeto de metadatos de transacción a la transacción firmada. El usuario firma la transacción con la clave del usuario. El patrocinador no firma cada transacción del usuario porque la concesión previa `CanUseFeeSponsor` es la autorización.

## Patrón 1: Los usuarios no pagan tarifas {#pattern-1-users-pay-no-fees}

Use esto cuando la aplicación o el operador absorba todas las tarifas de la red.

Lista de verificación del desarrollador:

1. Mantén sin cambios la carga de transacción normal del usuario.
2. Agregue metadatos de la transacción con `fee_sponsor`.
3. Firma como el usuario.
4. Envíe a través de la ruta del espacio de datos privado.

La cuenta de usuario no necesita un saldo de XOR. La cuenta del patrocinador debe mantener suficiente XOR para cubrir las tarifas configuradas de Nexus.

## Patrón 2: Los usuarios pagan con un token local {#pattern-2-users-pay-a-local-token}

Usa esto cuando los usuarios no deben tener XOR, pero el espacio de datos aún quiere una tarifa de aplicación interna, gasto de crédito o token de cuota.

En este patrón, el token local es un pago de aplicación. No es el activo de la tarifa de red. El patrocinador aún paga la tarifa de red en XOR.

Por ejemplo, utiliza un token local en el espacio de datos privado:

```text
usage#billing.team
```

Proporcione fondos a los usuarios con `usage#billing.team` durante la incorporación, la renovación de suscripción o la asignación de cuota. Luego haga que la transacción del usuario sea atómica:

1. transferir tokens locales del usuario al patrocinador
2. realizar la operación de la aplicación solicitada
3. incluir los metadatos `fee_sponsor` para que el patrocinador pague XOR

Una prueba de humo mínima CLI es solo la transferencia de tokens locales patrocinada por XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Para una aplicación real, no envíe el pago con token local como una transacción separada de máximo esfuerzo. Construya una transacción firmada que contenga tanto el pago como la instrucción comercial, o exponga un punto de entrada del contrato que recoja el token local antes de aplicar la operación comercial.

Mantén la política de conversión en tu aplicación o contrato:

- qué operación cuesta cuántas unidades de token locales
- cómo el flujo de tokens local se relaciona con las recargas del patrocinador XOR
- qué pasa cuando el saldo del usuario es demasiado bajo
- qué sucede cuando el saldo del patrocinador XOR es demasiado bajo

::: warning

No uses `gas_asset_id` para el patrón de 'tarifa de token local' a menos que quieras que el patrocinador también sea cargado en ese activo de costo de ejecución de la transacción. En el tiempo de ejecución actual del software, `fee_sponsor` también convierte al patrocinador en el pagador de los débitos de los activos de gas del canal de procesamiento configurados. Para las tarifas de usuario de tokens locales, cobre el token explícitamente con una transferencia o una regla de contrato.

:::

## Depuración de transacciones patrocinadas fallida {#debug-failed-sponsored-transactions}

Las razones comunes de rechazo generalmente señalan un paso de configuración faltante:

|Texto de error|Qué comprobar|
| --- | --- |
| `fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` todavía está `false` en el nodo. |
| `fee sponsor is not authorized` |El usuario no tiene `CanUseFeeSponsor` para este patrocinador.|
| `fee asset ... is missing` |El patrocinador no posee el activo de tarifa configurado XOR.|
| `fee balance ... is insufficient` |Recargar el saldo del patrocinador XOR.|
| `fee exceeds sponsor_max_fee` |Aumente `sponsor_max_fee` o reduzca el tamaño de la transacción/gas.|
| `invalid nexus fee asset id` |Arregla `nexus.fees.fee_asset_id` o el alias del activo XOR.|

Al depurar el patrón 2, verifica ambos saldos:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"

iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

## Operar el Patrocinador {#operate-the-sponsor}

Trate al patrocinador como una cuenta de tesorería:

- mantener claves de patrocinador separadas para testnet, staging y mainnet
- alertar antes de que el saldo del patrocinador XOR alcance el mínimo de admisión
- establecer un límite `sponsor_max_fee` distinto de cero una vez que se caracterice el tráfico
- limitar la frecuencia de escrituras patrocinadas en tu aplicación o puerta de enlace
- revocar `CanUseFeeSponsor` cuando los usuarios abandonen el espacio de datos
- conciliar transacciones de usuario, hashes criptográficos, pagos con token local y débitos del patrocinador XOR

Revocar el patrocinio de un usuario:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission revoke --id "$USER"
```

## Páginas relacionadas {#related-pages}

- [Conectar a los Espacios de Datos SORA Nexus](/es/get-started/sora-nexus-dataspaces.md)
- [Operar Iroha 3 a través de CLI](/es/get-started/operate-iroha-via-cli.md)
- [Activos](/es/blockchain/assets.md)
- [Permisos](/es/blockchain/permissions.md)
- [Tokens de Permiso](/es/reference/permissions.md)
