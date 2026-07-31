---
translation_locale: es
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Tokens de autorización {#permission-tokens}

Esta página enumera los tipos predeterminados de tokens de permisos expuestos por el modelo actual de datos del ejecutor Iroha. Para la guía conceptual de roles y permisos, vea [Permisones](/es/blockchain/permissions.md).

Las verificaciones de permisos son ejecutadas por el validador activo del tiempo de ejecución. Los nombres de los tipos de tokens a continuación describen la superficie de política estándar, pero una red puede personalizar la validación del tiempo de funcionamiento mediante la actualización del ejecutivo.

## Los tokens por defecto {#default-tokens}

|Señales de permiso |Categoría |Operación |
| --- | --- | --- |
|`CanManagePeers` |Peer |Registrarse, no registrarse o administrar de otra manera a los compañeros. |
|`CanManageLaneRelayEmergency` |Peer |Gestionar los controles de emergencia.|
|`CanRegisterDomain` |Dominio |Regístrese un dominio.|
|`CanUnregisterDomain` |Dominio |Desinscribir un dominio.|
|`CanModifyDomainMetadata` |Dominio |Modificar los metadatos del dominio. |
|`CanRegisterAccount` |Cuenta |Registra una cuenta.|
|`CanUnregisterAccount` |Cuenta |Desinscribir una cuenta.|
|`CanModifyAccountMetadata` |Cuenta |Modifique los metadatos de la cuenta. |
|`CanUnregisterAssetDefinition` |Definición de activos |No registrar una definición de activo. |
|`CanModifyAssetDefinitionMetadata` |Definición de activos |Modificar los metadatos de la definición del activo. |
|`CanMintAssetWithDefinition` |Activos |Activos de moneda para una definición específica. |
|`CanBurnAssetWithDefinition` |Activos |Quema activos para una definición específica. |
|`CanTransferAssetWithDefinition` |Activos |Transferencia de activos para una definición específica. |
|`CanMintAsset` |Activos |Tenga un saldo de activos específico. |
|`CanBurnAsset` |Activos |Quema un saldo de activos específico.|
|`CanTransferAsset` |Activos |Transferir un saldo de activos específico. |
|`CanRegisterNft` |NFT |Registrar un NFT. |
|`CanUnregisterNft` |NFT |No registrar un NFT. |
|`CanTransferNft` |NFT |Transferir un NFT. |
|`CanModifyNftMetadata` |NFT |Modifique los metadatos de NFT. |
|`CanSetParameters` |Parámetros |Establezca los parámetros de configuración en la cadena. |
|`CanManageRoles` |Roles |Registro, cancelación, concesión o revocación de funciones. |
|`CanRegisterTrigger` |Trigger .|Registra un gatillo.|
|`CanExecuteTrigger` |Trigger .|Ejecute un gatillo.|
|`CanUnregisterTrigger` |Trigger .|Desregistre el gatillo.|
|`CanModifyTrigger` |Trigger .|Modifique la configuración del gatillo. |
|`CanModifyTriggerMetadata` |Trigger .|Modificar los metadatos del gatillo. |
|`CanUpgradeExecutor` |El ejecutor |Actualizar el ejecutor de tiempo de ejecución.|
|`CanRegisterSmartContractCode` |Contrato inteligente .|Regístrese el código del contrato inteligente.|
|`CanUseFeeSponsor` |Nexus |Cargar tarifas Nexus a una cuenta de patrocinador especificada. |

## Propiedad {#ownership}

Los tokens de permisos sensibles al propietario deben referirse al objeto canónico IDs utilizado por el modelo de datos actual. Por ejemplo, los permisos de cuenta se refieren a la cuenta canónica sin dominio IDs, los permiso de dominio se refieren al dominio `domain.dataspace` IDs; y los permisos de activos se refieren a la definición canónica del activo o el activo IDs.

Cuando una transacción fracasa con un error de autorización, verifique a ambas partes:

- la cuenta que firma la transacción es la cuenta canónica esperada
- se concedió el token o papel de autorización para el objeto exacto ID utilizado en la instrucción.
