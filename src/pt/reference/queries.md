---
translation_locale: pt
translation_source: /reference/queries.md
translation_source_hash: 88dba1142d7b6a452a5f56d56640ceef47a52ca28e296d6d0ee5992b9005c3bb
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Questões {#queries}

As consultas Iroha leem o estado do livro principal sem mutá-lo. O modelo de dados atual expõe duas formas gerais de consulta:

- Questões singulares, que retornam um objeto ou um valor
- consultas iteráveis, que retornam um fluxo ou coleção e podem ser combinadas com filtragem, classificação, projeção e paginação onde o tipo de consulta o suporta

Use constructores de tipo SDK ou o CLI em vez de construir envelopes de consulta à mão. Os nomes abaixo são os tipos atuais de consulta expostos por `iroha_data_model::query`.

## Tempo de execução e configuração {#runtime-and-configuration}

|Perguntas .|Propósito |
| --- | --- |
|`FindAbiVersion` |Devolução da versão executora ABI. |
|`FindExecutorDataModel` |Retorna a descrição do modelo de dados do executor. |
|`FindParameters` |Retorna os parâmetros de configuração do executor na cadeia. |

## Contas e Permissões {#accounts-and-permissions}

|Perguntas .|Propósito |
| --- | --- |
|`FindAccountById` |Encontrar uma conta por conta canônica ID. |
|`FindAccountByAlias` |Resolver uma conta, alias a uma conta. |
|`FindAccounts` |Lista de contas registradas. |
|`FindAccountIds` |Lista da conta registada IDs. |
|`FindAccountsWithAsset` |Lista de contas que possuem uma determinada definição de ativo. |
|`FindAliasesByAccountId` |Lista de pseudônimos ligados a uma conta. |
|`FindAccountRecoveryPolicyByAlias` |Encontre a política de recuperação para um alias. |
|`FindAccountRecoveryRequestByAlias` |Encontrar o pedido de recuperação para um alias. |
|`FindRoles` |Lista de papéis. |
|`FindRoleIds` |Função da lista IDs. |
|`FindRolesByAccountId` |Lista de funções atribuídas a uma conta. |
|`FindPermissionsByAccountId` |Lista de permissões concedidas a uma conta. |

## Domínios e Peers {#domains-and-peers}

|Perguntas .|Propósito |
| --- | --- |
|`FindDomainById` |Encontrar um domínio por `DomainId`. |
|`FindDomains` |Lista de domínios registados. |
|`FindDomainsByAccountId` |Lista de domínios de propriedade de uma conta. |
|`FindDomainEndorsements` |Lista dos registos de endosso do domínio. |
|`FindDomainEndorsementPolicy` |Retorna a política de endosso do domínio. |
|`FindDomainCommittee` |Retorna o comitê de domínio.|
|`FindPeers` |Lista de colegas de confiança conhecidos no livro. |

## Ativos, NFTs e RWAs {#assets-nfts-and-rwas}

|Perguntas .|Propósito |
| --- | --- |
|`FindAssets` |Lista dos saldos de activos. |
|`FindAssetsDefinitions` |Lista das definições de activos. |
|`FindAssetsByAccountId` |Lista dos activos detidos por uma conta. |
|`FindAssetById` |Encontrar um saldo de ativos em `AssetId`. |
|`FindAssetDefinitionById` |Encontrar uma definição de ativo em ID. |
|`FindNfts` |Lista NFTs. |
|`FindNftsByAccountId` |Lista NFTs em posse de uma conta. |
|`FindRwas` |Lista de lotes registados de ativos reais. |

## Registros de depósito e de prova {#escrow-and-proof-records}

As consultas de custódia inspecionam os registos criados pela [contribuição de activos nativos ISIs](/pt/blockchain/escrow.md), incluindo custódia de mercado, bloqueios genéricos de ativos e registos anônimos de custódie.

|Perguntas .|Propósito |
| --- | --- |
|`FindAssetEscrows` |Lista dos registos de custódia. |
|`FindAssetEscrowById` |Encontrar um ativo em garantia até ID. |
|`FindAssetEscrowsBySeller` |Lista dos activos em depósito por vendedor. |
|`FindAssetEscrowsByBuyer` |Lista dos activos em depósito por comprador. |
|`FindAssetEscrowsByStatus` |Lista dos activos em custódia por status. |
|`FindAnonymousAssetEscrows` |Lista os registos anônimos dos activos em custódia.|
|`FindAnonymousAssetEscrowById` |Encontre um escrow de ativos anónimos por ID. |
|`FindAnonymousAssetEscrowsBySeller` |Lista de fiança anônima por vendedor. |
|`FindAnonymousAssetEscrowsByBuyer` |Lista de fiança anônima por comprador. |
|`FindAnonymousAssetEscrowsByStatus` |Lista as fichas anônimas por status. |
|`FindProofRecordById` |Encontrar um registro de prova por ID. |
|`FindProofRecords` |Lista de registos de prova. |
|`FindProofRecordsByBackend` |Lista de registos de prova para um backend de prova. |
|`FindProofRecordsByStatus` |Lista dos registos de prova por status. |

## Nexus, Disponibilidade de dados e pacotes {#nexus-data-availability-and-packages}

|Perguntas .|Propósito |
| --- | --- |
|`FindRepoAgreements` |Lista dos acordos de repositório armazenados em cadeia. |
|`FindTwitterBindingByHash` |Resolver uma ligação do Twitter por hash. |
|`FindDaPinIntentByTicket` |Encontre um PIN de disponibilidade de dados por bilhete. |
|`FindDaPinIntentByManifest` |Encontre a intenção do pin através de referência. |
|`FindDaPinIntentByAlias` |Encontre uma intenção de pin, por alias.|
|`FindDaPinIntentByLaneEpochSequence` |Encontre uma intenção de pinha por faixa, época e sequência. |
|`FindLaneRelayEnvelopeByRef` |Encontre um envelope verificado.|
|`FindSorafsProviderOwner` |Resolver o proprietário de um prestador SoraFS. |
|`FindDataspaceNameOwnerById` |Resolver um proprietário de nome do espaço de dados. |
|`FindMusubiExactPackageV1` |Leia um registro exato do pacote e as suas revisões atuais. |
|`FindMusubiExactReleaseV1` |Leia uma imagem exata. |
|`FindMusubiProviderBundleAttestationV1` |Leia a certificação do conjunto de arquivos de um fornecedor. |
|`FindMusubiResolverIndexV1` |Pague o índice de resolver final. |
|`FindMusubiVersionsV1` |Página versões finalizadas para um pacote. |
|`FindMusubiMaintainersV1` |A página aceitou mantê-los e os convites pendentes. |
|`FindMusubiArchiveLocationsV1` |Página finalizada SoraFS localizações para um arquivo. |
|`FindMusubiArchiveRetentionV1` |Página dos registos de arquivamento. |
|`FindMusubiAliasV1` |Leia a atual meta e revisão de um alias global. |
|`FindMusubiAliasHistoryV1` |Página da história imutável de retargeting de um alias global. |
|`FindMusubiOrderedPrefixV1` |Pacotes de páginas com um prefixo estrutural ordenado. |

## Ativadores, contratos, transações e bloqueios {#triggers-contracts-transactions-and-blocks}

|Perguntas .|Propósito |
| --- | --- |
|`FindActiveTriggerIds` |Lista o gatilho ativo IDs. |
|`FindTriggers` |Lista de gatilhos. |
|`FindTriggerById` |Encontrar um gatilho por ID. |
|`FindContractManifestByCodeHash` |Encontre um manifesto de contrato inteligente por código hash. |
|`FindTransactions` |Lista de transacções comprometidas. |
|`FindBlocks` |Lista de blocos. |
|`FindBlockHeaders` |Lista de cabeçalhos de blocos.|

## Filtragem e Paginação {#filtering-and-pagination}

As consultas iteráveis podem expor o suporte de predicado e selector. Use filtros tipados específicos da consulta do SDK para que a entrada do filtro coincida com o tipo de saída da consulta. Para grandes conjuntos de resultados, use parâmetros de consulta como cursor e limite em vez de buscar todas as linhas de uma só vez.
