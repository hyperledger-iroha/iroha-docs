---
translation_locale: es
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 7ee18275d25837da53f533f5e9205906ccaa71b48afd9b11ffad79b599da7f21
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Permisos y funciones {#permissions-and-roles}

## El resultado {#outcome}

Crear un papel que otorgue permiso a una cuenta para actualizar los metadatos de una cuenta específica, asignarlos a un delegado, probar la escritura delegada y mostrar las instrucciones correspondientes en Rust.

## Los requisitos previos {#prerequisites}

- Un cliente financiado Taira y metadatos de tarifas desde [Conectar a Taira](./connect-to-taira.md).
- `TARGET_ACCOUNT` y `DELEGATE_ACCOUNT` fijados en la cuenta canónica I105 IDs.
- La cuenta de firma debe tener la posibilidad de gestionar los permisos y funciones objetivo. En Taira se trata de una operación administrativa con un límite de autorización. Obtener `CanManageRoles` y la autoridad necesaria para conceder el permiso de alcance, o ejecutar la receta en una red local generada.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

Usar una segunda configuración de cliente para el delegado al probar la escritura:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## Los pasos {#steps}

### 1. Registrar un papel vacío {#_1-register-an-empty-role}

Cada comando de cambio de estado CLI nombra explícitamente al contribuyente. El archivo de metadatos contiene el activo actual Taira derivado de la respuesta del grifo.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. Añadir un permiso de alcance a la cuenta objetivo {#_2-add-a-permission-scoped-to-the-target-account}

Los tokens de permisos se escriben JSON objetos. Mantenga la cuenta dentro de `payload` como un I105 ID; un alias no es válido en este campo estricto.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Asignar el papel al delegado {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

Las funciones y sus subvenciones no expiran, sino que deben revocarse explícitamente cuando el acceso ya no sea necesario.

### 4. ejercer el permiso delegado {#_4-exercise-the-delegated-permission}

Utilice la firma del delegado y el saldo de las tarifas para escribir. Los valores JSON se leen a partir de la entrada estándar.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

El mismo modelo está disponible para los clientes de Rust. Aquí `client` se marca como `registrar_account`, que se convierte en el propietario inicial del papel al igual que lo hace en el flujo CLI. Las tres variables de cuenta ya están analizadas valores `AccountId`:

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

Enumera los dos lados de la tarea, y luego lee el valor exacto escrito por el delegado:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

La lista de permisos debe contener `CanModifyAccountMetadata` con el alcance de `TARGET_ACCOUNT`, la lista de funciones del delegado debe contener`ROLE_ID` y los metadatos leídos deben devolverse `"delegated"`.

## Solución de problemas {#troubleshooting}

- `Not permitted` al registrar, editar o asignar el papel significa que el firmante carece de la autoridad requerida Taira. No sustituya el token con alcance por uno global; solicite la concesión exacta o use localnet.
- Un error de análisis de carga útil por lo general significa que `account` se colocó al lado de `payload`, se suministró un alias en lugar de un I105 ID o el valor JSON se cotizó dos veces.
- Una negativa de la cuota pertenece al firmante que presenta ese paso. Financia al administrador y delega de forma independiente y conserva los metadatos del activo de las cuotas derivadas del grifo.
- Una concesión de rol exitosa no anula el alcance codificado en sus tokens. Este papel solo puede modificar la cuenta nombrada en la carga útil del permiso.
- Para limpiar, ejecuta `ledger account role revoke`, luego `ledger role permission revoke` y finalmente `ledger role unregister`; cada uno es una escritura separada y debe incluir metadatos de tarifas y `--fee-payer authority`.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Pruebas de integración de roles en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [Pruebas de integración de permisos en el commit fijado ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [Modelo de datos de permisos incorporado en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [Permisos y funciones ](/es/blockchain/permissions.md)
- [Referencia a los tokens de autorización ](/es/reference/permissions.md)
- [Metadatos ](./metadata.md)
