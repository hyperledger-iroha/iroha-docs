---
translation_locale: pt
translation_source: /reference/queries.md
translation_source_hash: 88dba1142d7b6a452a5f56d56640ceef47a52ca28e296d6d0ee5992b9005c3bb
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Consultas {#queries}

Iroha consultas leem o estado do livro-razão da blockchain sem modificá-lo. O modelo de dados atual expõe dois formatos amplos de consulta:

- consultas singulares, que retornam um objeto ou um valor
- consultas iteráveis, que retornam um fluxo ou coleção e podem ser combinadas com filtragem, ordenação, projeção e paginação quando o tipo de consulta suporta isso

Use os construtores digitados SDK ou o CLI em vez de construir manualmente contêineres de dados de consulta. Os nomes abaixo são os tipos de consulta atualmente expostos por `iroha_data_model::query`.

## tempo de execução de software e configuração {#runtime-and-configuration}

|Consulta|Propósito|
| --- | --- |
| `FindAbiVersion` |Retorne a versão do executor ABI.|
| `FindExecutorDataModel` |Retorne a descrição do modelo de dados do executor.|
| `FindParameters` |Retorna os parâmetros de configuração do executor na cadeia.|

## Contas e Permissões {#accounts-and-permissions}

|Consulta|Propósito|
| --- | --- |
| `FindAccountById` |Encontre uma conta pelo ID de conta canônico.|
| `FindAccountByAlias` |Resolva um apelido de conta para uma conta.|
| `FindAccounts` |Listar contas registradas.|
| `FindAccountIds` |Liste os IDs de conta registrados.|
| `FindAccountsWithAsset` |Listar contas que possuem uma determinada definição de ativo.|
| `FindAliasesByAccountId` |Listar apelidos vinculados a uma conta.|
| `FindAccountRecoveryPolicyByAlias` |Encontre a política de recuperação para um alias.|
| `FindAccountRecoveryRequestByAlias` |Encontre a solicitação de recuperação para um alias.|
| `FindRoles` |Listar funções.|
| `FindRoleIds` |Listar IDs de função.|
| `FindRolesByAccountId` |Listar funções concedidas a uma conta.|
| `FindPermissionsByAccountId` |Listar permissões concedidas a uma conta.|

## Domínios e pares de rede {#domains-and-peers}

|Consulta|Propósito|
| --- | --- |
| `FindDomainById` |Encontre um domínio por `DomainId`.|
| `FindDomains` |Listar domínios registrados.|
| `FindDomainsByAccountId` |Liste os domínios possuídos por uma conta.|
| `FindDomainEndorsements` |Listar registros de endosso de domínio.|
| `FindDomainEndorsementPolicy` |Retorne a política de endosso do domínio.|
| `FindDomainCommittee` |Retorne o comitê de domínio.|
| `FindPeers` |Liste os pares de rede confiáveis conhecidos pelo livro-razão da blockchain.|

## Ativos, NFTs, e RWAs {#assets-nfts-and-rwas}

|Consulta|Propósito|
| --- | --- |
| `FindAssets` |Listar saldos de ativos.|
| `FindAssetsDefinitions` |Listar definições de ativos.|
| `FindAssetsByAccountId` |Listar os ativos mantidos por uma conta.|
| `FindAssetById` |Encontre um saldo de ativo por `AssetId`.|
| `FindAssetDefinitionById` |Encontre uma definição de ativo pelo ID.|
| `FindNfts` | Lista NFTs. |
| `FindNftsByAccountId` |Lista NFTs pertencente a uma conta.|
| `FindRwas` |Listar lotes de ativos do mundo real registrados.|

## Depósito em garantia e registros de prova {#escrow-and-proof-records}

As consultas de escrow inspecionam os registros criados por [custódia de ativo nativo ISIs](/pt/blockchain/escrow.md), incluindo escrows do mercado, bloqueios genéricos de ativos e registros de escrow anônimos.

|Consulta|Propósito|
| --- | --- |
| `FindAssetEscrows` |Listar registros de caução de ativos.|
| `FindAssetEscrowById` |Encontre um depósito em garantia de ativo por ID.|
| `FindAssetEscrowsBySeller` |Listar cauções de ativos por vendedor.|
| `FindAssetEscrowsByBuyer` |Listar cauções de ativos por comprador.|
| `FindAssetEscrowsByStatus` |Listar cauções de ativos por status.|
| `FindAnonymousAssetEscrows` |Listar registros de custódia de ativos anônimos.|
| `FindAnonymousAssetEscrowById` |Encontre um depósito em garantia de ativo anônimo pelo ID.|
| `FindAnonymousAssetEscrowsBySeller` |Listar cauções anônimas por vendedor.|
| `FindAnonymousAssetEscrowsByBuyer` |Listar cauções anônimas por comprador.|
| `FindAnonymousAssetEscrowsByStatus` |Listar cauções anônimas por status.|
| `FindProofRecordById` |Encontre um registro de prova pelo ID.|
| `FindProofRecords` |Listar registros de prova.|
| `FindProofRecordsByBackend` |Listar registros de prova para um backend de prova.|
| `FindProofRecordsByStatus` |Listar registros de prova por status.|

## Nexus, Disponibilidade de Dados e Pacotes {#nexus-data-availability-and-packages}

|Consulta|Propósito|
| --- | --- |
| `FindRepoAgreements` |Listar acordos de repositório armazenados na blockchain.|
| `FindTwitterBindingByHash` |Resolva uma vinculação do Twitter por hash criptográfico.|
| `FindDaPinIntentByTicket` |Encontrar uma intenção de pino de disponibilidade de dados por ticket.|
| `FindDaPinIntentByManifest` |Encontre uma intenção de pin por referência de manifesto técnico.|
| `FindDaPinIntentByAlias` |Encontrar uma intenção de pin pelo alias.|
| `FindDaPinIntentByLaneEpochSequence` |Encontre uma intenção de pin por pista de execução, época e sequência.|
| `FindLaneRelayEnvelopeByRef` |Encontre um contêiner de dados de revezamento de pista verificado.|
| `FindSorafsProviderOwner` |Resolva o proprietário de um provedor SoraFS.|
| `FindDataspaceNameOwnerById` |Resolve um proprietário de nome de espaço de dados.|
| `FindMusubiExactPackageV1` |Leia um registro exato de pacote e suas revisões atuais.|
| `FindMusubiExactReleaseV1` |Leia um instantâneo exato da versão.|
| `FindMusubiProviderBundleAttestationV1` |Leia a declaração de atestado do pacote de arquivamento de um provedor.|
| `FindMusubiResolverIndexV1` |Pagine o índice definitivo do resolvedor.|
| `FindMusubiVersionsV1` |Versões finalizadas da página para um pacote.|
| `FindMusubiMaintainersV1` |Página aceita mantenedores e convites pendentes.|
| `FindMusubiArchiveLocationsV1` |Página finalizada SoraFS localizações para um arquivo.|
| `FindMusubiArchiveRetentionV1` |Página de registros de retenção de arquivos.|
| `FindMusubiAliasV1` |Leia o alvo atual e a revisão de um alias global.|
| `FindMusubiAliasHistoryV1` |Página o histórico de retargeting imutável de um alias global.|
| `FindMusubiOrderedPrefixV1` |Pacotes de página sob um prefixo estrutural ordenado.|

## Gatilhos, Contratos, Transações e Blocos {#triggers-contracts-transactions-and-blocks}

|Consulta|Propósito|
| --- | --- |
| `FindActiveTriggerIds` |Listar IDs de gatilho ativos.|
| `FindTriggers` |Listar gatilhos.|
| `FindTriggerById` |Encontre um gatilho pelo ID.|
| `FindContractManifestByCodeHash` |Encontre um manifesto técnico de contrato inteligente pelo hash criptográfico do código.|
| `FindTransactions` |Listar transações confirmadas.|
| `FindBlocks` |Listar blocos.|
| `FindBlockHeaders` |Listar cabeçalhos de bloco.|

## Filtragem e Paginação {#filtering-and-pagination}

Consultas iteráveis podem expor suporte a predicados e seletores. Use filtros tipados específicos da consulta do SDK para que a entrada do filtro corresponda ao tipo de saída da consulta. Para conjuntos de resultados grandes, use parâmetros de consulta como cursor e limite em vez de buscar todas as linhas de uma vez.
