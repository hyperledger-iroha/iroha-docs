---
translation_locale: es
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 40fe8b19344d8eff66b178dc8576e2e049fef50bd3212fbddc5c0d5f7f37fa03
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Permisos y Roles {#permissions-and-roles}

## Resultado {#outcome}

Crea un rol que otorgue a una cuenta permiso para actualizar los metadatos en una cuenta específica, asígnalo a un delegado, demuestra la escritura delegada y muestra las instrucciones Rust correspondientes con su tipado.

## Requisitos previos {#prerequisites}

- Un cliente Taira financiado de [Conectar a Taira](./connect-to-taira.md).
- `TARGET_ACCOUNT` y `DELEGATE_ACCOUNT` configurados con los IDs de cuenta canónicos I105.
- La cuenta que firma debe tener `CanManageRoles` y debe poder delegar el permiso con alcance: es la propia `TARGET_ACCOUNT` o ya tiene `CanModifyAccountMetadata` para esa cuenta. En Taira esta es una operación administrativa restringida por permisos. El cliente de una red local generada no tiene `CanManageRoles`, por lo que la receta necesita una red cuyo génesis lo conceda.

```bash
CONFIG=./taira.client.toml
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

Utilice una segunda configuración de cliente para el delegado al probar la escritura:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## Pasos {#steps}

### 1. Registrar un rol vacío {#_1-register-an-empty-role}

Cada comando CLI que cambia el estado nombra explícitamente al pagador de la tarifa. El CLI cotiza la tarifa exacta, en el activo de tarifa de Taira, antes de firmar.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  ledger role register --id "$ROLE_ID"
```

### 2. Agrega un permiso limitado a la cuenta de destino {#_2-add-a-permission-scoped-to-the-target-account}

Los tokens de permiso son objetos tipados JSON. Mantenga la cuenta dentro de `payload` como un ID I105; un alias no es válido en este campo estricto.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Asignar el rol al delegado {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

Los roles y sus permisos no expiran. Revóquelos explícitamente cuando el acceso ya no sea necesario.

### 4. Ejercer el permiso delegado {#_4-exercise-the-delegated-permission}

Utilice el firmante criptográfico y el saldo de tarifas del delegado para la escritura. Los valores JSON se leen desde la entrada estándar.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

El mismo modelo está disponible para los clientes Rust. Aquí `client` es un `iroha::blocking::Client` que firma como `registrar_account`, que se convierte en el propietario inicial del rol tal como ocurre en el flujo CLI. Las tres variables de cuenta ya son valores `AccountId` analizados:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};
use iroha_executor_data_model::permission::account::CanModifyAccountMetadata;

let role_id: RoleId = "cookbook_metadata_editors".parse()?;
let role = Role::new(role_id.clone(), registrar_account).add_permission(
    CanModifyAccountMetadata {
        account: target_account.clone(),
    },
);

client.submit_all::<InstructionBox>(
    [
        Register::role(role).into(),
        Grant::account_role(role_id, delegate_account).into(),
    ],
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## Verificar {#verify}

Lea los permisos efectivos del delegado, que incluyen las concesiones de roles, y luego lea el valor exacto escrito por el delegado:

```bash
iroha --config "$CONFIG" --machine account permission list \
  --id "$DELEGATE_ACCOUNT" --all \
  | jq -e --arg account "$TARGET_ACCOUNT" \
    '.items | any(.name == "CanModifyAccountMetadata"
      and .payload.account == $account)'

iroha --config "$CONFIG" account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

Los permisos efectivos del delegado deben contener `CanModifyAccountMetadata` con alcance en `TARGET_ACCOUNT`, y la lectura de metadatos debe devolver `"delegated"`. Torii rechaza los listados de roles mediante consultas firmadas, por lo que el listado de permisos efectivos sirve como comprobación de la asignación.

## Solución de problemas {#troubleshooting}

- `Not permitted` al registrar, editar o asignar el rol significa que el firmante criptográfico carece de la autoridad de Taira requerida. No reemplace el token con alcance por uno global; solicite la concesión exacta.
- Un error de análisis de carga útil generalmente significa que `account` se colocó al lado de `payload`, se proporcionó un alias en lugar de un ID de I105, o el valor de JSON fue citado dos veces.
- Un rechazo de tarifa corresponde al firmante criptográfico que envía ese paso. Financie al administrador y al delegado de forma independiente en el activo de tarifa indicado por cada cotización de tarifa.
- Una concesión de rol exitosa no anula el alcance codificado en sus tokens. Este rol solo puede modificar la cuenta nombrada en la carga útil de permisos.
- Para limpiar, ejecute `account role revoke`, luego `ledger role permission revoke` y finalmente `ledger role unregister`; cada uno es una escritura separada y debe incluir `--fee-payer authority`.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Pruebas de integración de roles en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/roles.rs)
- [Pruebas de integración de permisos en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/permissions.rs)
- [Modelo de datos de permisos incorporado en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/permission.rs)
- [Permisos y roles](/es/blockchain/permissions.md)
- [Referencia de token de permiso](/es/reference/permissions.md)
- [Metadatos](./metadata.md)
