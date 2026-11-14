---
translation_locale: es
translation_source: /reference/permissions.md
translation_source_hash: aedb5b658cde78dc7b169877c315cfb2ed860257dedb5b3b0bcfff8cc4f472a1
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Tokens de Permiso {#permission-tokens}

Esta página enumera los tipos de token de permisos predeterminados expuestos por el modelo de datos del ejecutor actual Iroha. Para la guía conceptual sobre roles y permisos, consulte [Permisos](/es/blockchain/permissions.md).

Las comprobaciones de permisos son aplicadas por el validador de tiempo de ejecución de software activo. Los nombres de tipos de tokens a continuación describen la superficie de política estándar, pero una red puede personalizar la validación de tiempo de ejecución de software al actualizar el ejecutor.

## Tokens predeterminados {#default-tokens}

|Token de permiso|Categoría|Operación|
| --- | --- | --- |
| `CanManagePeers` |par de red|Registrar, cancelar el registro o gestionar de otra manera los pares de red.|
| `CanRegisterDomain` |Dominio|Registrar un dominio.|
| `CanUnregisterDomain` |Dominio|Cancelar el registro de un dominio.|
| `CanModifyDomainMetadata` |Dominio|Modificar los metadatos del dominio.|
| `CanRegisterAccount` |Cuenta|Registrar una cuenta.|
| `CanUnregisterAccount` |Cuenta|Cancelar la suscripción de una cuenta.|
| `CanModifyAccountMetadata` |Cuenta|Modificar los metadatos de la cuenta.|
| `CanUnregisterAssetDefinition` |Definición de activo|Cancelar el registro de una definición de activo.|
| `CanModifyAssetDefinitionMetadata` |Definición de activo|Modificar los metadatos de la definición de activos.|
| `CanMintAssetWithDefinition` |Activo|emitir activos para una definición específica.|
| `CanBurnAssetWithDefinition` |Activo| Quemar activos para una definición específica. |
| `CanTransferAssetWithDefinition` |Activo|Transferir activos para una definición específica.|
| `CanMintAssetToAccount` |Activo|emitir un saldo de activo específico.|
| `CanBurnAsset` |Activo| Quemar un saldo de un activo específico. |
| `CanTransferAsset` |Activo|Transferir un saldo de activo específico.|
| `CanRegisterNft` | NFT |Registrar un NFT.|
| `CanUnregisterNft` | NFT |Darse de baja de un NFT.|
| `CanTransferNft` | NFT |Transferir un NFT.|
| `CanModifyNftMetadata` | NFT |Modificar los metadatos de NFT.|
| `CanSetParameters` |Parámetros|Establecer parámetros de configuración en la cadena.|
| `CanManageRoles` |Roles|Registrar, anular el registro, otorgar o revocar roles.|
| `CanRegisterTrigger` |Disparador|Registrar un desencadenador.|
| `CanExecuteTrigger` |Disparador|Ejecutar un desencadenador.|
| `CanUnregisterTrigger` |Disparador|Anular el registro de un disparador.|
| `CanModifyTrigger` |Disparador|Modificar la configuración del disparador.|
| `CanModifyTriggerMetadata` |Disparador|Modificar los metadatos del activador.|
| `CanUpgradeExecutor` |ejecutora|Actualice el ejecutor de tiempo de ejecución del software.|
| `CanManageSmartContractCode` |Contrato inteligente|Eliminar artefactos de código no referenciados y delegar puntos de entrada de contratos. Las cuentas registradas pueden crear artefactos verificados sin él.|
| `CanManageFeeSponsorProgram` | SORA Nexus | Administrar programas pertenecientes a la cuenta exacta del patrocinador. |
| `CanEnrollFeeSponsorProgram` | SORA Nexus | Gestionar los beneficiarios de un programa de patrocinio concreto. |

## Propiedad {#ownership}

Los tokens de permisos sensibles al propietario deben hacer referencia a los ID de objetos canónicos utilizados por el modelo de datos actual. Por ejemplo, los permisos de cuenta se refieren a los ID de cuenta sin dominio canónicos, los permisos de dominio se refieren a los ID de dominio `domain.dataspace`, y los permisos de los activos se refieren a la definición canónica del activo o a los IDs de los activos.

Cuando una transacción falla con un error de autorización, verifique ambos lados:

- la cuenta que firma la transacción es la cuenta canónica esperada
- el token de permiso o rol fue concedido para el ID de objeto exacto utilizado en la instrucción
