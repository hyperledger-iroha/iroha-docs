---
translation_locale: es
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Las autorizaciones {#permissions}

Las cuentas necesitan tokens de permiso para varias acciones en una cadena de bloques, por ejemplo, para acuñar o quemar activos.

Hay una diferencia entre una cadena de bloques pública y una privada en términos de permisos otorgados a los usuarios. En una cadena de bloques privada, se supone que la mayoría de las cuentas no pueden hacer nada fuera de la autoridad otorgada a ellas a menos que se les conceda explícitamente el permiso pertinente.

Tener un permiso para hacer algo significa que la cuenta tiene el correspondiente `Permission`. Los permisos pueden concederse directamente o a través de un [`Role`](#permission-groups-roles), Los permisos se otorgan con el `Grant` Los permisos y los roles no expiran; `Revoke` la instrucción.

## Tokens de autorización {#permission-tokens}

Las fichas de permiso son objetos tipados definidos por el ejecutor activo. Algunas fichas son globales, como `CanManagePeers`, y otras tienen un alcance específico para un objeto del libro mayor, como una cuenta, activo, definición de activo, dominio, NFT, papel o desencadenante.

Estos son algunos ejemplos de parámetros utilizados para varios tokens de permisos:

- Una ficha que otorga permiso para modificar metadatos de una cuenta específica tiene un campo `account`:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- Un token que conceda permiso para transferir activos para una definición específica de activo tiene un campo `asset_definition`:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- Un token global como `CanManagePeers` no tiene campos:

  ```json
  {}
  ```

### Tokens de autorización preconfigurados {#pre-configured-permission-tokens}

Puede encontrar la lista de fichas de permiso preconfiguradas en el capítulo [Referencia](/es/reference/permissions).

## Grupos de permisos (funciones) {#permission-groups-roles}

Un conjunto de permisos se llama un rol. `Grant` la instrucción y revocada utilizando el `Revoke` la instrucción.

Antes de conceder una función a una cuenta, la función debe registrarse primero.

Los roles son útiles cuando varias cuentas deben recibir el mismo conjunto de permisos. Registrar el papel una vez, otorgar permisos al rol y luego conceder o revocar el papel para las cuentas individuales.

### Registro de un nuevo papel {#register-a-new-role}

Registramos un nuevo papel que, una vez otorgado, permitirá el acceso de otra cuenta a los metadatos [ ](/es/blockchain/metadata.md) en la cuenta de Mouse:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### Asigna un papel {#grant-a-role}

Después de que el papel está registrado, Mouse puede otorgarlo a Alice:

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## Validadores de permisos {#permission-validators}

Los permisos existen para que sólo las cuentas con el token de permiso requerido puedan realizar una acción protegida. El ejecutor predeterminado verifica los permisos durante la ejecución de instrucciones, consultas y expresiones.

La superficie predeterminada del validador se agrupará por área de registro:

- Gestión entre pares
- dominios y cuentas
- activos, NFTs, y garantías
- desencadenantes
- funciones y permisos
- ejecutor/tiempo de ejecución, pruebas, puentes y módulos SORA/Nexus

La lista exacta de tokens está respaldada por la fuente en la referencia [Permission Tokens](/es/reference/permissions.md).

### Validadores de tiempo de ejecución {#runtime-validators}

El ejecutor predeterminado proporciona los validadores de permisos incorporados y las definiciones de tokens, y una red puede cambiar la política mediante la actualización del ejecutor que utiliza.

Los validadores devuelven un veredicto de validación. Un validador puede permitir una operación, negarla con razón o omitirla si la operación está fuera del alcance de ese validador. El juez seleccionado combina esos veredictos para decidir si la instrucción, consulta o expresión pueden continuar.

## Las consultas apoyadas {#supported-queries}

Los tokens de permiso y los roles pueden ser consultados.

Las consultas para los roles:

- [`FindRoles`](/es/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/es/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/es/reference/queries.md#accounts-and-permissions)

Las consultas para los tokens de permiso:

- [`FindPermissionsByAccountId`](/es/reference/queries.md#accounts-and-permissions)
