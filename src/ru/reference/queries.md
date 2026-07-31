---
translation_locale: ru
translation_source: /reference/queries.md
translation_source_hash: 22e8a75acd72d066e3516ba46a0afe075d2d02790154458aec00a5d8bb861838
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Вопросы {#queries}

Iroha Вопросы читают состояние книги без ее мутации.
раскрывает две широкие формы запроса:

- **отдельные запросы**, которые возвращают один объект или одно значение
- **повторяемые запросы**, которые возвращают поток или сбор и могут быть объединены
  с фильтрацией, сортировкой, проекцией и pagination, где тип запроса
  поддерживает

Использование SDK Типовые строители или CLI вместо создания запросных конвертов
Ниже приведены названия текущих типов запросов, выявленных
`iroha_data_model::query`.

## Время и конфигурация {#runtime-and-configuration}

| Вопрос | Цель |
| --- | --- |
| `FindAbiVersion` | Верните исполнителя . ABI Версия. |
| `FindExecutorDataModel` | Возвращение описания модели данных исполнителя. |
| `FindParameters` | Возвращение параметров конфигурации исполнителя на цепи. |

## Счета и разрешения {#accounts-and-permissions}

| Вопрос | Цель |
| --- | --- |
| `FindAccountById` | Найти один рассказ по каноническим записям ID. |
| `FindAccountByAlias` | Устранить счёт под псевдонимом счета. |
| `FindAccounts` | Перечисли зарегистрированные счета. |
| `FindAccountIds` | Список зарегистрированного счета IDs. |
| `FindAccountsWithAsset` | Перечислить счета, которые содержат определенное определение активов. |
| `FindAliasesByAccountId` | Перечислить псевдоним, связанный с аккаунтом. |
| `FindAccountRecoveryPolicyByAlias` | Найди политику восстановления под псевдонимом. |
| `FindAccountRecoveryRequestByAlias` | Найди запрос на выздоровление под псевдонимом. |
| `FindRoles` | Список ролей. |
| `FindRoleIds` | Роль списка IDs. |
| `FindRolesByAccountId` | Список ролей, предоставленных счету. |
| `FindPermissionsByAccountId` | Перечислить разрешения, предоставленные счету. |

## Домены и сверстники {#domains-and-peers}

| Вопрос | Цель |
| --- | --- |
| `FindDomainById` | Найти один домен `DomainId`. |
| `FindDomains` | Список зарегистрированных доменов. |
| `FindDomainsByAccountId` | Перечислить домены, принадлежащие учетной записи. |
| `FindDomainEndorsements` | Перечислите записи о одобрении домена. |
| `FindDomainEndorsementPolicy` | Возвращайте политику одобрения домена. |
| `FindDomainCommittee` | Верните комитет по домену. |
| `FindPeers` | Перечислите в книге известных доверенных людей. |

## активы, NFTs, и RWAs {#assets-nfts-and-rwas}

| Вопрос | Цель |
| --- | --- |
| `FindAssets` | Список балансов активов. |
| `FindAssetsDefinitions` | Список определений активов. |
| `FindAssetsByAccountId` | Перечень активов, находящихся в распоряжении счета. |
| `FindAssetById` | Найти один баланс активов `AssetId`. |
| `FindAssetDefinitionById` | Найти определение одного актива ID. |
| `FindNfts` | Список NFTs. |
| `FindNftsByAccountId` | Список NFTs владельцем счета. |
| `FindRwas` | Список зарегистрированных реальных активов. |

## Запись о счетах и доказательствах {#escrow-and-proof-records}

Запросы с эскроем проверяют записи , созданные
[конфиденциальное хранение собственных активов ISIs](/ru/blockchain/escrow.md), включая рынок
сбережения, общие блокировки активов и анонимные записи.

| Вопрос | Цель |
| --- | --- |
| `FindAssetEscrows` | Запиши записи о депозитах активов. |
| `FindAssetEscrowById` | Найдите один депозитный актив ID. |
| `FindAssetEscrowsBySeller` | Перечислить депозиты по продавцу. |
| `FindAssetEscrowsByBuyer` | Список активов, закрепленных по покупателю. |
| `FindAssetEscrowsByStatus` | Перечислить депозиты по состоянию. |
| `FindAnonymousAssetEscrows` | Перечислить анонимные записи по хранению активов. |
| `FindAnonymousAssetEscrowById` | Найди анонимного поручителя активов ID. |
| `FindAnonymousAssetEscrowsBySeller` | Перечислить анонимные депозиты по продавцу. |
| `FindAnonymousAssetEscrowsByBuyer` | Перечислить анонимные депозиты по покупателю. |
| `FindAnonymousAssetEscrowsByStatus` | Перечислить анонимные депозиты по состоянию. |
| `FindProofRecordById` | Найти один запись доказательства ID. |
| `FindProofRecords` | Запишите доказательства. |
| `FindProofRecordsByBackend` | Перечислите записи доказательств для подтверждения обратного конца. |
| `FindProofRecordsByStatus` | Перечислите данные по состоянию. |

## Nexus, Доступность данных и пакеты {#nexus-data-availability-and-packages}

| Вопрос | Цель |
| --- | --- |
| `FindRepoAgreements` | Перечислить договоры хранилища, хранящиеся в цепочке. |
| `FindTwitterBindingByHash` | Разобраться с "Твиттером" hash. |
| `FindDaPinIntentByTicket` | Найти адрес доступности данных по билету. |
| `FindDaPinIntentByManifest` | Найти намерение пинта по проявленной ссылке. |
| `FindDaPinIntentByAlias` | Найди намерение пинка под псевдонимом. |
| `FindDaPinIntentByLaneEpochSequence` | Найдите намерение штифа по полосе, эпохе и последовательности. |
| `FindLaneRelayEnvelopeByRef` | Найди проверенный конверт. |
| `FindSorafsProviderOwner` | Решить владельца SoraFS поставщика. |
| `FindDataspaceNameOwnerById` | Решить владельца имен пространства данных. |
| `FindMusubiReleaseByRef` | Найти Musubi выпуск по ссылке. |
| `FindMusubiPackageVersions` | Перечень версий для Musubi Пакет. |
| `FindMusubiPackageReleases` | Список выпусков для Musubi Пакет. |
| `FindMusubiShortAliasByName` | Решить Musubi короткие псевдонимы. |

## Попытки, контракты, транзакции и блоки {#triggers-contracts-transactions-and-blocks}

| Вопрос | Цель |
| --- | --- |
| `FindActiveTriggerIds` | Перечисли активный триггер IDs. |
| `FindTriggers` | Список триггеров. |
| `FindTriggerById` | Найди один спутник. ID. |
| `FindContractManifestByCodeHash` | Найти манифест смарт-контракта с помощью хэша кода. |
| `FindTransactions` | Перечень обязательных сделок. |
| `FindBlocks` | Список блоков. |
| `FindBlockHeaders` | Список заголовков блоков. |

## Фильтрация и страница {#filtering-and-pagination}

Итерационные запросы могут раскрыть поддержку предиката и селектора.
фильтры из SDK так что вход фильтра совпадает с типом выхода запроса.
Для больших наборов результатов вместо этого используйте параметры запроса, такие как курсор и ограничение
Привлекать каждый ряд сразу.
