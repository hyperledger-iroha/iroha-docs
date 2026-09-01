---
translation_locale: es
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 8d6fd7101094ba21cfc2c5fb9a89d2acd7e67f13ff47b9f8c8e01bbbd7bf2836
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Permisos y Roles {#permissions-and-roles}

## Resultado {#outcome}

Crea un rol que otorgue a una cuenta permiso para actualizar los metadatos en una cuenta específica, asígnalo a un delegado, demuestra la escritura delegada y muestra las instrucciones Rust correspondientes con su tipado.

## Requisitos previos {#prerequisites}

- Un cliente financiado Taira y metadatos de tarifas de [Conectar a Taira](./connect-to-taira.md).
- `TARGET_ACCOUNT` y `DELEGATE_ACCOUNT` configurados con los IDs de cuenta canónicos I105.
- La cuenta que firma debe tener permitido gestionar el permiso y los roles objetivo. En Taira esta es una operación administrativa restringida por permisos; obtenga `CanManageRoles` y el principal de autorización necesario para otorgar el permiso con alcance, o ejecute la receta en una red local generada.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
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

Cada comando CLI que cambia el estado nombra explícitamente al pagador de la tarifa. El archivo de metadatos contiene el activo de tarifa Taira actual derivado de la respuesta del servicio de financiamiento de testnet.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. Agrega un permiso limitado a la cuenta de destino {#_2-add-a-permission-scoped-to-the-target-account}

Los tokens de permiso son objetos tipados JSON. Mantenga la cuenta dentro de `payload` como un ID I105; un alias no es válido en este campo estricto.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Asignar el rol al delegado {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
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
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

El mismo modelo está disponible para los clientes Rust. Aquí `client` firma como `registrar_account`, que se convierte en el propietario inicial del rol tal como ocurre en el flujo CLI. Las tres variables de cuenta ya son valores `AccountId` analizados:

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};
use iroha_executor_data_model::permission::account::CanModifyAccountMetadata;

let role_id: RoleId = "cookbook_metadata_editors".parse()?;
let role = Role::new(role_id.clone(), registrar_account).add_permission(
    CanModifyAccountMetadata {
        account: target_account.clone(),
    },
);

client.submit_all_blocking::<InstructionBox>(
    [
        Register::role(role).into(),
        Grant::account_role(role_id, delegate_account).into(),
    ],
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## Verificar {#verify}

Enumere ambos lados de la tarea, luego lea el valor exacto escrito por el delegado:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

La lista de permisos debe contener `CanModifyAccountMetadata` con alcance en `TARGET_ACCOUNT`, la lista de roles del delegado debe contener `ROLE_ID`, y la lectura de metadatos debe devolver `"delegated"`.

## Solución de problemas {#troubleshooting}

- `Not permitted` al registrar, editar o asignar el rol significa que el firmante criptográfico carece del principal de autorización Taira requerido. No reemplace el token con alcance por uno global; solicite la concesión exacta o use localnet.
- Un error de análisis de carga útil generalmente significa que `account` se colocó al lado de `payload`, se proporcionó un alias en lugar de un ID de I105, o el valor de JSON fue citado dos veces.
- Un rechazo de tarifa pertenece al firmante criptográfico que envía ese paso. Financie al administrador y delegue de forma independiente y conserve los metadatos del activo de tarifa derivados del grifo.
- Una concesión de rol exitosa no anula el alcance codificado en sus tokens. Este rol solo puede modificar la cuenta nombrada en la carga útil de permisos.
- Para limpiar, ejecute `ledger account role revoke`, luego `ledger role permission revoke`, y finalmente `ledger role unregister`; cada uno es una escritura separada y debe incluir `--fee-payer authority` y los metadatos de tarifas.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Pruebas de integración de roles en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [Pruebas de integración de permisos en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [Modelo de datos de permisos incorporado en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [Permisos y roles](/es/blockchain/permissions.md)
- [Referencia de token de permiso](/es/reference/permissions.md)
- [Metadatos](./metadata.md)
