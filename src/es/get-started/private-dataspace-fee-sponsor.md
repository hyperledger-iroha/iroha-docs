---
translation_locale: es
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Tarifas de patrocinio para un espacio privado de datos {#sponsor-fees-for-a-private-dataspace}

El patrocinador de tarifas permite a los usuarios enviar transacciones en el espacio de datos privado sin tener XOR. El usuario todavía firma la transacción. Los metadatos de la transacción apuntan a una cuenta del patrocinador, y el tiempo de ejecución adeuda el saldo del patrocinado XOR por la tarifa de red.

La integración consta de tres partes móviles:

1. El nodo permite el patrocinio de honorarios
2. la cuenta de patrocinador existe y tiene XOR
3. cada usuario tiene `CanUseFeeSponsor` para ese patrocinador.

Después de eso, cada transacción patrocinada por el usuario solo necesita estos metadatos:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

Esta página muestra dos patrones comunes:

- Un usuario libre escribe: el patrocinador paga XOR y el usuario no paga nada.
- Tarifas de tokens locales: el usuario paga al patrocinador en un token de aplicación, y el patrocinador paga a la red en XOR.

Utilice Taira o una red de prueba privada primero. Un nuevo espacio de datos privado es un operador y un cambio de gobernanza; no se crea por configuración del cliente.

## Ejemplos de valores {#example-values}

Los siguientes comandos utilizan estos marcadores de lugar:

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

Utilice una cuenta canónica I105 IDs a menos que su despliegue tenga alias de cuenta activa para las mismas cuentas.

## 1. Preparar el espacio de datos {#_1-prepare-the-dataspace}

Comience con el catálogo del espacio de datos privado y el trabajo de enrutamiento descrito en [Conectar a SORA Nexus Dataspaces](/es/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace). Un fragmento orientado al operador se ve así:

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

Antes de pasar a las transacciones del usuario, compruebe que:

- El carril privado aparece en la respuesta `/status` del nodo.
- Las cuentas de usuario son admitidas por su flujo privado de incorporación
- existe la cuenta del patrocinador
- el activo de cuota XOR y la cuenta de depósito de cuotas son válidos en la red

## 2. Registro de activos en el espacio de datos {#_2-register-assets-in-the-dataspace}

Registrar las definiciones de activos que los usuarios tendrán dentro del espacio de datos privado antes de incorporarlas a la lógica de la aplicación. Para el patrón de tarifas de tokens locales, el tutorial utiliza `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

Primero configure el dominio y el contrato de arrendamiento SNS que poseen el espacio de nombres del activo. Crear una intención libre de secretos `AliasSetupPlanRequestV1` para `$BILLING_DOMAIN`, incluyendo el espacio de datos `team` numérico ID, propietario canónico, término del arrendamiento y guardia de cotizaciones corriente:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

Luego registra la definición de activo. La canónica `--id` es la definición de activos a nivel de red ID. El alias es lo que los desarrolladores y usuarios finales deben usar en el código del espacio de datos:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

La moneda o transferir el token local a un usuario durante la incorporación:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

Verifique el equilibrio del usuario:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

Utilice el mismo patrón para los activos de aplicación en el espacio de datos. Registre una definición de activo por token, dé a cada uno un alias de espacio de datos y haga referencia al alias del código SDK en lugar de la definición canónica de activo IDs con codificación dura.

## 3. Registrar los apellidos de usuario {#_3-register-user-aliases}

Las cuentas siguen siendo canónicas I105 cuentas IDs. Los nombres de usuarios son alias de cuentas, y los alias deben ser manuales no sensibles como `alice@team` o `alice@members.team`. No use números de teléfono ni direcciones de correo electrónico como alias.

La configuración de alias utiliza el mismo planificador declarativo que la configuración de dominio. Haga que el SDK o servicio de incorporación cree una intención libre de secretos `AliasSetupPlanRequestV1` cuyos objetivos de entrada de alias de cuenta `$USER`, seleccione el papel principal, pinar el espacio de datos numérico ID y cargue con el guardia de cotización de arrendamiento actual. Luego planifique y aplique como una transacción atómica:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

Si el usuario no debe pagar XOR, utilice el servicio de embarque con conocimiento del patrocinador aprobado para construir y presentar la configuración transacción. No dividir la adquisición de arrendamiento y el alias vinculante en operaciones independientes de solicitud.

Después de que el alias esté vinculado, compruebe desde la CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Para la creación de una nueva cuenta, se prefiere un servicio de incorporación que construye `NewAccount` con un estable `uaid` y, si es necesario, un inicial `label`. El comando simple `ledger account register --id` sólo registra la cuenta canónica ID.

## 4. Registre el teléfono y el correo electrónico en privado con FHE {#_4-register-phone-and-email-privately-with-fhe}

Usar números de teléfono y direcciones de correo electrónico como reclamos de identificadores privados, no alias públicos. El flujo respaldado por FHE mantiene los identificadores crudos fuera de los alias de cuentas, metadatos de transacción y estado mundial:

1. el operador registra una política de programa [RAM-LFE/FHE ](/es/blockchain/ram-lfe.md) para teléfono y correo electrónico
2. el operador registra las políticas de identificación activa como `phone#team` y `email#team`
3. La billetera normaliza el teléfono o correo electrónico localmente.
4. la cartera envía el valor cifrado al resolver
5. el resolver devuelve una `IdentifierResolutionReceipt`
6. El usuario presentará `ClaimIdentifier` junto con el recibo.
7. la cadena almacena un identificador opaco y un hash de recibo, no el valor del teléfono o correo electrónico en bruto

La configuración de las políticas del operador es una tarea de SDK o servicio. Construir y presentar estos pares de instrucciones para cada tipo de identificador:

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

Repita para el correo electrónico con:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

Durante la incorporación, la billetera o el backend deben normalizarse localmente:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

Una vez que se haya creado el archivo de metadatos del patrocinador en la etapa 8, presentará una instrucción de solicitud firmada por el usuario con dichos metadatos:

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

La corriente CLI no expone los comandos tipados para estas instrucciones de identidad. Generar valores serializados `InstructionBox` con el SDK y enviarlos a través de `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Mantenga estos barandillas en el servicio de embarque:

- Los alias de las cuentas son sólo manipulaciones legibles por el hombre.
- Los valores de teléfono y correo electrónico en bruto nunca aparecen en alias, metadatos, registros o cargas útiles de transacciones.
- la cuenta tiene un `uaid` antes de reclamar identificadores privados;
- los recibos se vinculan a `policy_id`, `opaque_id`, `uaid`, `account_id` y expiran
- las claves de resolver y los compromisos ocultos del programa son controlados por la gobernanza

## 5. Habilitar el patrocinio en el nodo {#_5-enable-sponsorship-on-the-node}

El patrocinio de tarifas es una política de nodo/tiempo de ejecución. Habilitarlo en la configuración de tarifa Nexus:

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

`fee_asset_id` es el activo de la cuota de red. SORA Nexus Esto es ... XOR. Utilizar el activo XOR alias o canónicos XOR definición de activo ID Expuesta por su red.

`sponsor_max_fee = "0"` significa que no hay un límite máximo de patrocinador por transacción. Para la producción, establezca un límite no cero después de conocer el tamaño normal y el perfil de gas de sus transacciones del espacio de datos.

Reinicie o despliegue esta configuración a través de su proceso normal del operador.

## 6. Crear y financiar al patrocinador {#_6-create-and-fund-the-sponsor}

Generar un par de llaves de patrocinador si es necesario:

```bash
kagami keys --algorithm ed25519 --json
```

Convertir la clave pública en el formato de cuenta para su red:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

Registrar la cuenta del patrocinador a través de su flujo privado de incorporación:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

Financiar al patrocinador con XOR de una cuenta del tesoro, de crédito u otra cuenta financiada:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Para los ensayos de Taira, guarde el ayudante del grifo desde [Obtenga Testnet XOR en Taira](/es/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) como `taira_faucet_claim.py`, luego financie al patrocinador con el grifo público en lugar de una transferencia del tesoro:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

Compruebe el saldo del patrocinador XOR:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. Dar acceso a un usuario al patrocinador {#_7-grant-a-user-access-to-the-sponsor}

El patrocinador debe conceder a cada usuario el permiso para cobrarle tarifas. La subvención es lo que impide a los usuarios nombrar cuentas de patrocinadores arbitrarias.

ejecuta esto como la cuenta de patrocinador, o como una cuenta operativa permitida por su política de tiempo de ejecución:

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

Para los servicios de embarque, convierta esto en un paso normal para la provisión de cuentas y registra:

- Cuenta de usuario
- cuenta del patrocinador
- espacio de datos o aplicación
- billete de aprobación o decisión de gobernanza

Para inspeccionar las subvenciones de un usuario:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. adjuntar los metadatos del patrocinador {#_8-attach-sponsor-metadata}

Crear un archivo de metadatos reutilizable:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

Cualquier escrito presentado con estos metadatos será cobrado por el patrocinador:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

Para SDKs, adjunta el mismo objeto de metadatos de transacción a la transacción firmada. El usuario firma la transacción con la clave del usuario. El patrocinador no firma todas las transacciones del usuario porque la concesión previa `CanUseFeeSponsor` es la autorización.

## Modelo 1: Los usuarios no pagan ninguna tarifa {#pattern-1-users-pay-no-fees}

Utilizarlo cuando la aplicación o el operador absorban todas las tarifas de red.

Lista de verificación del desarrollador:

1. Mantenga la carga útil de las transacciones normales del usuario sin cambios.
2. Añadir los metadatos de transacción con `fee_sponsor`.
3. Firme como usuario.
4. Envíe a través de la ruta del espacio privado de datos.

La cuenta de usuario no necesita un saldo XOR; la cuenta patrocinadora debe mantener suficiente XOR para cubrir las tarifas configuradas Nexus.

## Modelo 2: Los usuarios pagan un token local {#pattern-2-users-pay-a-local-token}

Utilice esto cuando los usuarios no deben tener XOR, pero el espacio de datos todavía quiere una tarifa interna de la aplicación, gasto de crédito o token de cuota.

En este patrón, el token local es un pago de solicitud. No es el activo de la tarifa de red. El patrocinador todavía paga la tarifa de la red en XOR.

Por ejemplo, utilizar un token local en el espacio de datos privado:

```text
usage#billing.team
```

Los usuarios de fondos con `usage#billing.team` durante la incorporación, la renovación de suscripciones o la asignación de cuotas.

1. Transferencia de tokens locales del usuario al patrocinador
2. ejecutar la operación de aplicación solicitada
3. incluir `fee_sponsor` metadatos para que el patrocinador pague XOR;

Una prueba mínima de humo CLI es solo la transferencia de tokens locales patrocinada por XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Para una aplicación real, no envíe el pago con tokens locales como una transacción separada de mejor esfuerzo. Construya una transacción firmada que contenga tanto el pago como la instrucción comercial, o exponga un punto de entrada del contrato que recolecta el token local antes de aplicar la operación comercial.

Mantenga la política de conversión en su aplicación o contrato:

- ¿Qué operación cuesta cuántas unidades de tokens locales
- cómo los mapas de entrada de tokens locales para patrocinar XOR complementos
- lo que ocurre cuando el equilibrio del usuario es demasiado bajo
- lo que sucede cuando el saldo del patrocinador XOR es demasiado bajo

::: advertencia

No se utilice `gas_asset_id` para el patrón de "compensación local-token" a menos que quieras que el patrocinador sea cobrado en ese activo de gas también. `fee_sponsor` también hace que el patrocinador sea el pagador de los débitos de activos en gasoductos configurados. Para las tarifas de usuario de tokens locales, cobrar el token explícitamente con una regla de transferencia o contrato.

:::

## Debug de las transacciones patrocinadas fallidas {#debug-failed-sponsored-transactions}

Las razones comunes de rechazo suelen indicar que falta un paso de configuración:

|Texto de error |¿ Qué comprobar ?|
| --- | --- |
|`fee sponsorship is disabled` |`nexus.fees.sponsorship_enabled` todavía está `false` en el nodo.|
|`fee sponsor is not authorized` |El usuario no cuenta con `CanUseFeeSponsor` para este patrocinador. |
|`fee asset ... is missing` |El patrocinador no posee el activo de cuota XOR configurado. |
|`fee balance ... is insufficient` | Reponga el de la patrocinadora. XOR el equilibrio. |
|`fee exceeds sponsor_max_fee` |Aumentar `sponsor_max_fee` o reducir el tamaño de la transacción/gas. |
|`invalid nexus fee asset id` |Fijación `nexus.fees.fee_asset_id` o el alias de activo XOR. |

Al depurar el patrón 2, compruebe ambos equilibrios:

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

## Operar con el patrocinador {#operate-the-sponsor}

Trate al patrocinador como una cuenta del Tesoro:

- mantener llaves de patrocinador separadas para la red de prueba, la puesta en escena y la red principal.
- alerta antes de que el saldo del patrocinador XOR alcance el nivel de admisión
- fijar un límite no cero `sponsor_max_fee` una vez que se haya caracterizado el tráfico
- el límite de tarifas patrocinado escribe en su solicitud o puerta de entrada
- Revocar `CanUseFeeSponsor` cuando los usuarios abandonen el espacio de datos
- reconciliar los hashes de las transacciones del usuario, los pagos con tokens locales y los débitos de patrocinadores XOR

Revocar el patrocinio para un usuario:

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

- [Conectar con SORA Nexus Dataspaces](/es/get-started/sora-nexus-dataspaces.md)
- [Operar en Iroha 3 a través de CLI ](/es/get-started/operate-iroha-via-cli.md)
- [Activos ](/es/blockchain/assets.md)
- [Las autorizaciones ](/es/blockchain/permissions.md)
- [Los tokens de autorización ](/es/reference/permissions.md)
