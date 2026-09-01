---
translation_locale: es
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Permisos {#permissions}

Las cuentas necesitan tokens de permiso para varias acciones en una cadena de bloques, por ejemplo, para emitir o quemar activos.

Hay una diferencia entre una blockchain pública y una privada en términos de permisos otorgados a los usuarios. En una blockchain pública, la mayoría de las cuentas tienen el mismo conjunto de permisos. En una blockchain privada, se asume que la mayoría de las cuentas no pueden hacer nada fuera del principio de autorización que se les ha otorgado, a menos que se les conceda explícitamente el permiso relevante.

Tener un permiso para hacer algo significa que la cuenta tiene el correspondiente `Permission`. Los permisos pueden otorgarse directamente o a través de un [`Role`](#permission-groups-roles), que agrupa un conjunto de permisos. Los permisos se conceden con el `Grant` instrucción. Los permisos y roles no caducan; elimínalos con el `Revoke` instrucción.

## Tokens de permiso {#permission-tokens}

Los tokens de permiso son objetos tipados definidos por el ejecutor activo. Algunos tokens son globales, como `CanManagePeers`, y otros están limitados a un objeto específico del libro mayor de la blockchain, como una cuenta, un activo, una definición de activo, un dominio, NFT, un rol o un desencadenador.

Aquí hay algunos ejemplos de parámetros utilizados para varios tokens de permiso:

- Un token que otorga permiso para modificar los metadatos de una cuenta específica contiene un campo `account`:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- Un token que otorga permiso para transferir activos para una definición de activo específica lleva un campo `asset_definition`:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- Un token global como `CanManagePeers` no tiene campos:

  ```json
  {}
  ```

### Tokens de permiso preconfigurados {#pre-configured-permission-tokens}

Puede encontrar la lista de tokens de permiso preconfigurados en el capítulo [Referencia](/es/reference/permissions).

## Grupos de Permisos (Roles) {#permission-groups-roles}

Un conjunto de permisos se llama un rol. De manera similar a los tokens de permisos, los roles pueden ser otorgados usando la instrucción `Grant` y revocados usando la instrucción `Revoke`.

Antes de otorgar un rol a una cuenta, el rol debe ser registrado primero.

Los roles son útiles cuando varias cuentas deben recibir el mismo conjunto de permisos. Registre el rol una vez, otorgue permisos al rol y luego otorgue o revoque el rol para cuentas individuales.

### Registrar un nuevo rol {#register-a-new-role}

Vamos a registrar un nuevo rol que, cuando se otorgue, permitirá a otra cuenta acceder al [metadatos](/es/blockchain/metadata.md) en la cuenta de Mouse:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### Conceder un rol {#grant-a-role}

Después de que se registre el rol, Mouse puede otorgárselo a Alice:

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## Validadores de permisos {#permission-validators}

Los permisos existen para que solo las cuentas con el token de permiso requerido puedan realizar una acción protegida. El ejecutor predeterminado verifica los permisos durante la ejecución de instrucciones, consultas y expresiones.

La superficie de validación predeterminada está agrupada por área del libro mayor de la blockchain:

- gestión de pares de red
- dominios y cuentas
- activos, NFTs, y cuentas de depósito en garantía
- desencadenantes
- roles y permisos
- ejecutor/tiempo de ejecución, pruebas, puentes y módulos SORA/Nexus

La lista exacta de tokens está respaldada por la fuente en el [Referencia de Tokens de Permiso](/es/reference/permissions.md).

### Validadores de tiempo de ejecución de software {#runtime-validators}

Las comprobaciones de permisos son aplicadas por el ejecutor activo. El ejecutor predeterminado proporciona los validadores de permisos integrados y las definiciones de tokens, y una red puede cambiar la política al actualizar el ejecutor que utiliza.

Los validadores devuelven un veredicto de validación. Un validador puede permitir una operación, denegarla con una razón, o saltarla si la operación está fuera del ámbito de ese validador. El juez seleccionado combina esos veredictos para decidir si la instrucción, consulta o expresión puede continuar.

## Consultas compatibles {#supported-queries}

Se pueden consultar los tokens de permiso y los roles.

Consultas para roles:

- [`FindRoles`](/es/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/es/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/es/reference/queries.md#accounts-and-permissions)

Consultas para tokens de permiso:

- [`FindPermissionsByAccountId`](/es/reference/queries.md#accounts-and-permissions)
