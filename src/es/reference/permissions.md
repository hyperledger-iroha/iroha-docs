---
translation_locale: es
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Tokens de Permiso {#permission-tokens}

Esta página enumera los tipos de token de permisos predeterminados expuestos por el modelo de datos del ejecutor actual Iroha. Para la guía conceptual sobre roles y permisos, consulte [Permisos](/es/blockchain/permissions.md).

Las comprobaciones de permisos son aplicadas por el validador de tiempo de ejecución de software activo. Los nombres de tipos de tokens a continuación describen la superficie de política estándar, pero una red puede personalizar la validación de tiempo de ejecución de software al actualizar el ejecutor.

## Tokens predeterminados {#default-tokens}

|Token de permiso|Categoría|Operación|
| --- | --- | --- |
| `CanManagePeers` |par de red|Registrar, cancelar el registro o gestionar de otra manera los pares de red.|
| `CanManageLaneRelayEmergency` |par de red|Gestionar los controles de relevo de carril de emergencia.|
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
| `CanMintAsset` |Activo|emitir un saldo de activo específico.|
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
| `CanRegisterSmartContractCode` |Contrato inteligente|Registrar código de contrato inteligente.|
| `CanUseFeeSponsor` | Nexus |Cargar Nexus tarifas a una cuenta de patrocinador especificada.|

## Propiedad {#ownership}

Los tokens de permisos sensibles al propietario deben hacer referencia a los ID de objetos canónicos utilizados por el modelo de datos actual. Por ejemplo, los permisos de cuenta se refieren a los ID de cuenta sin dominio canónicos, los permisos de dominio se refieren a los ID de dominio `domain.dataspace`, y los permisos de los activos se refieren a la definición canónica del activo o a los IDs de los activos.

Cuando una transacción falla con un error de autorización, verifique ambos lados:

- la cuenta que firma la transacción es la cuenta canónica esperada
- el token de permiso o rol fue concedido para el ID de objeto exacto utilizado en la instrucción
