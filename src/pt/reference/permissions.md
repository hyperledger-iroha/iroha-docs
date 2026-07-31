---
translation_locale: pt
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Tokens de Permissão {#permission-tokens}

Esta página lista os tipos padrão de tokens de permissão expostos pelo atual modelo de dados do executor Iroha. Para o guia conceitual de funções e permissões, veja [Permissões](/pt/blockchain/permissions.md).

Os nomes do tipo de token abaixo descrevem a superfície padrão da política, mas uma rede pode personalizar a validação do runtime atualizando o executor.

## Tokens padrão {#default-tokens}

|Token de permissão|Categoria |Operação |
| --- | --- | --- |
|`CanManagePeers` |Peer |Registre, desinscreva ou administre outros pares. |
|`CanManageLaneRelayEmergency` |Peer |Gerenciar os controles de relevo de emergência. |
|`CanRegisterDomain` |Domínio .|Registre um domínio. |
|`CanUnregisterDomain` |Domínio .|Desinscrição de um domínio.|
|`CanModifyDomainMetadata` |Domínio .|Modificar os metadados do domínio. |
|`CanRegisterAccount` |Conta |Registre uma conta. |
|`CanUnregisterAccount` |Conta |Desinscreva uma conta. |
|`CanModifyAccountMetadata` |Conta |Modificar os metadados da conta. |
|`CanUnregisterAssetDefinition` |Definição de activos |Não registar uma definição de ativo. |
|`CanModifyAssetDefinitionMetadata` |Definição de activos |Modificar os metadados da definição do ativo. |
|`CanMintAssetWithDefinition` |Ativos |Ativos de moeda para uma definição específica. |
|`CanBurnAssetWithDefinition` |Ativos |Combustão de activos para uma definição específica. |
|`CanTransferAssetWithDefinition` |Ativos |Transferência de activos para uma definição específica. |
|`CanMintAsset` |Ativos |Tenta um saldo específico de activos. |
|`CanBurnAsset` |Ativos |Queimar um saldo específico de ativos.|
|`CanTransferAsset` |Ativos |Transferir um saldo de activos específico. |
|`CanRegisterNft` |NFT |Registrar um NFT. |
|`CanUnregisterNft` |NFT |Desinscrição de um NFT. |
|`CanTransferNft` |NFT |Transferir um NFT. |
|`CanModifyNftMetadata` |NFT |Modificar os metadados de NFT. |
|`CanSetParameters` |Parâmetros |Defina os parâmetros de configuração na cadeia. |
|`CanManageRoles` |Funções |Registro, desregisto, concessão ou revogação de funções. |
|`CanRegisterTrigger` |Trigger |Regista um gatilho.|
|`CanExecuteTrigger` |Trigger |Executa um gatilho.|
|`CanUnregisterTrigger` |Trigger .|Desinscreva um gatilho.|
|`CanModifyTrigger` |Trigger .|Modificar a configuração do gatilho. |
|`CanModifyTriggerMetadata` |Trigger .|Modificar os metadados do gatilho. |
|`CanUpgradeExecutor` |Execução |Avaliar o executor de tempo de execução. |
|`CanRegisterSmartContractCode` |Contrato inteligente .|Registre o código do contrato inteligente. |
|`CanUseFeeSponsor` |Nexus |Imposto de taxas Nexus para uma conta do patrocinador especificada. |

## Propriedade {#ownership}

Os tokens de permissão sensíveis ao proprietário devem referir-se ao objeto canônico IDs usado pelo modelo de dados atual. Por exemplo, as permissões da conta se referem à conta canônica sem domínio IDs, as permisões do domínio se referem ao domínio `domain.dataspace` IDs, e as autorizações de ativos referem-se à definição canônica de ativos ou ativos IDs.

Quando uma transação falha com um erro de autorização, verifique ambos os lados:

- A conta de assinatura da transação é a conta canónica prevista.
- O token ou o papel de autorização foi concedido para o objeto exato ID utilizado na instrução
