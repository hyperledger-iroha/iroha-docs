---
translation_locale: ru
translation_source: /reference/queries.md
translation_source_hash: 88dba1142d7b6a452a5f56d56640ceef47a52ca28e296d6d0ee5992b9005c3bb
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Вопросы {#queries}

Iroha запросы читают состояние бухгалтерского учета, не изменяя его. В текущей модели данных выявлены две широкие формы запроса:

- singular queries, которые возвращают один объект или одно значение
- повторяемые запросы, которые возвращают поток или коллекцию и могут быть объединены с фильтрацией, сортировкой, проекцией и pagination, где тип запроса поддерживает его.

Используйте SDK типовые конструкторы или CLI вместо того, чтобы создавать конверты запросов вручную. Ниже приведены названия текущих типов запросов, выявленных `iroha_data_model::query`.

## Время работы и конфигурация {#runtime-and-configuration}

|Вопрос |Цель .|
| --- | --- |
|`FindAbiVersion` |Вернуть версию исполнителя ABI. |
|`FindExecutorDataModel` |Вернуть описание модели данных исполнителя. |
|`FindParameters` |Возвращение параметров конфигурации исполнителя на цепочке. |

## Счета и разрешения {#accounts-and-permissions}

|Вопрос |Цель .|
| --- | --- |
|`FindAccountById` |Найти один счет по каноническому счету ID. |
|`FindAccountByAlias` |Устранить счёт под псевдонимом. |
|`FindAccounts` |Список зарегистрированных счетов. |
|`FindAccountIds` |Список зарегистрированного счета IDs. |
|`FindAccountsWithAsset` |Перечислить счета, содержащие определение активов. |
|`FindAliasesByAccountId` |Перечисли псевдонимы, связанные с аккаунтом. |
|`FindAccountRecoveryPolicyByAlias` |Найди политику восстановления для псевдонима. |
|`FindAccountRecoveryRequestByAlias` |Найти запрос на восстановление под псевдонимом. |
|`FindRoles` |Список ролей. |
|`FindRoleIds` |Список роли IDs. |
|`FindRolesByAccountId` |Перечислить функции, предоставленные счету.|
|`FindPermissionsByAccountId` |Перечислить разрешения, предоставленные счету. |

## Домены и сверстники {#domains-and-peers}

|Вопрос |Цель .|
| --- | --- |
|`FindDomainById` |Найти один домен по `DomainId`. |
|`FindDomains` |Список зарегистрированных доменов. |
|`FindDomainsByAccountId` |Перечислить домены, принадлежащие учетной записи |
|`FindDomainEndorsements` |Перечислите записи о одобрении доменов. |
|`FindDomainEndorsementPolicy` |Возвращайте политику одобрения домена.|
|`FindDomainCommittee` |Верните комитет по домену. |
|`FindPeers` |Перечисли доверительных сверстников, которые известны в книге. |

## Активы, NFTs, и RWAs {#assets-nfts-and-rwas}

|Вопрос |Цель .|
| --- | --- |
|`FindAssets` |Список балансов активов. |
|`FindAssetsDefinitions` |Список определений активов. |
|`FindAssetsByAccountId` |Перечень активов, находящихся на счете. |
|`FindAssetById` |Найти один баланс активов до `AssetId`. |
|`FindAssetDefinitionById` |Найти одно определение активов до ID. |
|`FindNfts` |Список NFTs. |
|`FindNftsByAccountId` |Список NFTs принадлежащий счету. |
|`FindRwas` |Список зарегистрированных реальных активов. |

## Сберегательные и доказательственные документы {#escrow-and-proof-records}

Запросы по опеке проверяют записи, созданные [native asset escrow ISIs](/ru/blockchain/escrow.md), в том числе рыночные опеки, общие блокировки активов и анонимные записи о опеки.

|Вопрос |Цель .|
| --- | --- |
|`FindAssetEscrows` |Перечислите записи о депозитах активов. |
|`FindAssetEscrowById` |Найти один депозит на активы до ID. |
|`FindAssetEscrowsBySeller` |Перечислить депозиты активов по продавцам. |
|`FindAssetEscrowsByBuyer` |Перечислить депозитные активы по покупателю. |
|`FindAssetEscrowsByStatus` |Перечислить депозиты активов по состоянию. |
|`FindAnonymousAssetEscrows` |Перечислить анонимные записи по хранению активов. |
|`FindAnonymousAssetEscrowById` |Найдите одного анонимного поручителя активов до ID. |
|`FindAnonymousAssetEscrowsBySeller` |Перечислить анонимные депозиты по продавцам. |
|`FindAnonymousAssetEscrowsByBuyer` |Перечислить анонимные депозиты по покупателю. |
|`FindAnonymousAssetEscrowsByStatus` |Перечислить анонимные депозиты по состоянию. |
|`FindProofRecordById` |Найти один свидетельский запись на ID. |
|`FindProofRecords` |Список доказательств. |
|`FindProofRecordsByBackend` |Перечислить записи доказательства для подтверждения обратной версии. |
|`FindProofRecordsByStatus` |Перечислите документы по состоянию. |

## Nexus, доступность данных и пакеты {#nexus-data-availability-and-packages}

|Вопрос |Цель .|
| --- | --- |
|`FindRepoAgreements` |Перечислить депозитарные соглашения, хранящиеся в цепочке. |
|`FindTwitterBindingByHash` |Разрешить связывание в Твиттере хэшиком. |
|`FindDaPinIntentByTicket` |Найти адрес доступности данных по билету. |
|`FindDaPinIntentByManifest` |Найти намерение кнопки с помощью указания. |
|`FindDaPinIntentByAlias` |Найди намерение пинка под псевдонимом.|
|`FindDaPinIntentByLaneEpochSequence` |Найти намерение пинка по полосе, эпохе и последовательности. |
|`FindLaneRelayEnvelopeByRef` |Найдите проверенный конверт. |
|`FindSorafsProviderOwner` |Решение о владельце поставщика SoraFS. |
|`FindDataspaceNameOwnerById` |Разрешить владельца имен пространства данных. |
|`FindMusubiExactPackageV1` |Прочитайте один точный пакет и его текущие пересмотры. |
|`FindMusubiExactReleaseV1` |Прочитайте один точный снимок. |
|`FindMusubiProviderBundleAttestationV1` |Прочитайте свидетельство об архиве одного поставщика. |
|`FindMusubiResolverIndexV1` |Сделайте страницу с окончательным индексом решений. |
|`FindMusubiVersionsV1` |Оконченные версии страницы для одного пакета. |
|`FindMusubiMaintainersV1` |Страница приняла обслуживающих работников и приглашения. |
|`FindMusubiArchiveLocationsV1` |Страница завершила SoraFS местоположения для одного архива. |
|`FindMusubiArchiveRetentionV1` |Страница архивных записей. |
|`FindMusubiAliasV1` |Прочитайте текущую цель и пересмотр глобального псевдонима. |
|`FindMusubiAliasHistoryV1` |Укажите неизменную историю ретаргета глобального псевдонима. |
|`FindMusubiOrderedPrefixV1` |Пакеты страниц под одним упорядоченным структурным префиксом. |

## Триггеры, контракты, транзакции и блоки {#triggers-contracts-transactions-and-blocks}

|Вопрос |Цель .|
| --- | --- |
|`FindActiveTriggerIds` |Перечисли активный триггер IDs. |
|`FindTriggers` |Список триггеров. |
|`FindTriggerById` |Найдите один триггер на ID. |
|`FindContractManifestByCodeHash` |Найти манифест смарт-контракта с помощью хэша кода.|
|`FindTransactions` |Перечень обязательных сделок. |
|`FindBlocks` |Список блоков.|
|`FindBlockHeaders` |Список заголовков блоков. |

## Фильтрация и страницы {#filtering-and-pagination}

Итерабельные запросы могут выявить поддержку предиката и селектора. Используйте фильтры с типом, специфические для запроса, из SDK, чтобы вход фильтра соответствовал выходному типу запроса. Для больших наборов результатов используйте параметры запроса, такие как курсор и ограничение, вместо того, чтобы одновременно забирать каждый ряд.
