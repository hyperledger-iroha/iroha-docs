---
translation_locale: pt
translation_source: /reference/permissions.md
translation_source_hash: aedb5b658cde78dc7b169877c315cfb2ed860257dedb5b3b0bcfff8cc4f472a1
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Tokens de Permissão {#permission-tokens}

Esta página lista os tipos de token de permissão padrão expostos pelo modelo de dados do executor atual Iroha. Para o guia conceitual sobre funções e permissões, veja [Permissões](/pt/blockchain/permissions.md).

As verificações de permissão são impostas pelo validador de tempo de execução de software ativo. Os nomes dos tipos de token abaixo descrevem a superfície de política padrão, mas uma rede pode personalizar a validação de tempo de execução de software atualizando o executor.

## Tokens Padrão {#default-tokens}

|Token de permissão|Categoria|Operação|
| --- | --- | --- |
| `CanManagePeers` |par de rede|Registrar, cancelar registro ou gerenciar pares de rede de outra forma.|
| `CanRegisterDomain` |Domínio|Registrar um domínio.|
| `CanUnregisterDomain` |Domínio|Cancelar o registro de um domínio.|
| `CanModifyDomainMetadata` |Domínio|Modificar metadados do domínio.|
| `CanRegisterAccount` |Conta|Registrar uma conta.|
| `CanUnregisterAccount` |Conta|Cancelar o registro de uma conta.|
| `CanModifyAccountMetadata` |Conta|Modificar metadados da conta.|
| `CanUnregisterAssetDefinition` |Definição de ativo|Cancelar o registro de uma definição de ativo.|
| `CanModifyAssetDefinitionMetadata` |Definição de ativo|Modificar metadados da definição de ativo.|
| `CanMintAssetWithDefinition` |Ativo|emitir ativos para uma definição específica.|
| `CanBurnAssetWithDefinition` |Ativo|Queimar ativos para uma definição específica.|
| `CanTransferAssetWithDefinition` |Ativo|Transferir ativos para uma definição específica.|
| `CanMintAssetToAccount` |Ativo|emitir um saldo específico de ativo.|
| `CanBurnAsset` |Ativo|Queime um saldo de ativo específico.|
| `CanTransferAsset` |Ativo|Transferir um saldo de ativo específico.|
| `CanRegisterNft` | NFT |Registrar um NFT.|
| `CanUnregisterNft` | NFT |Cancelar o registro de um NFT.|
| `CanTransferNft` | NFT |Transferir um NFT.|
| `CanModifyNftMetadata` | NFT |Modificar os metadados de NFT.|
| `CanSetParameters` |Parâmetros|Defina os parâmetros de configuração on-chain.|
| `CanManageRoles` |Funções|Registrar, cancelar registro, conceder ou revogar funções.|
| `CanRegisterTrigger` |Gatilho|Registrar um gatilho.|
| `CanExecuteTrigger` |Gatilho|Execute um gatilho.|
| `CanUnregisterTrigger` |Gatilho|Cancelar o registro de um gatilho.|
| `CanModifyTrigger` |Gatilho|Modificar configuração do gatilho.|
| `CanModifyTriggerMetadata` |Gatilho|Modificar metadados do gatilho.|
| `CanUpgradeExecutor` |Executor|Atualize o executor de tempo de execução do software.|
| `CanManageSmartContractCode` |Contrato inteligente|Remover artefatos de código não referenciados e delegar pontos de entrada de contratos. Contas registradas podem criar artefatos verificados sem ela.|
| `CanManageFeeSponsorProgram` | SORA Nexus |Administrar programas pertencentes à conta exata do patrocinador.|
| `CanEnrollFeeSponsorProgram` | SORA Nexus |Gerenciar beneficiários de um programa específico de um patrocinador.|

## Propriedade {#ownership}

Os tokens de permissão sensíveis ao proprietário devem fazer referência aos IDs de objetos canônicos usados pelo modelo de dados atual. Por exemplo, as permissões de conta se referem aos IDs de conta canônicos sem domínio, as permissões de domínio se referem aos IDs de domínio `domain.dataspace`. e permissões de ativos referem-se à definição canônica de ativos ou IDs de ativos.

Quando uma transação falha com um erro de autorização, verifique ambos os lados:

- a conta que está assinando a transação é a conta canônica esperada
- o token de permissão ou função foi concedido para o ID de objeto exato usado na instrução
