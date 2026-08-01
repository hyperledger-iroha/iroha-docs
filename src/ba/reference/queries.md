---
translation_locale: ba
translation_source: /reference/queries.md
translation_source_hash: 22e8a75acd72d066e3516ba46a0afe075d2d02790154458aec00a5d8bb861838
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Һорауҙар {#queries}

Iroha һорауҙар иҫәп-хисап хәлен уҡый, уны үҙгәртмәйенсә. хәҙерге мәғлүмәттәр моделе ике киң һорау формаларын аса:

- бер объектҡа йәки бер ҡиммәткә кире ҡайтарыусы айырым һорауҙар
- ҡабатлана торған һорауҙар, улар ағымды йәки йыйынтыҡты кире ҡайтара һәм фильтрлау, сортировкалау, проекция һәм һылтанма тибы ярҙамында берләштерелә ала.

Һорау конверттарын ҡул менән төҙөү урынына SDK типтағы конструкторҙарҙы йәки CLI ҡулланығыҙ. Түбәндәге исемдәр - `iroha_data_model::query` тарафынан асыҡланған ағымдағы һорау төрҙәре.

## Эшләү ваҡыты һәм конфигурацияһы {#runtime-and-configuration}

|Һорау |Маҡсат |
| --- | --- |
|`FindAbiVersion` |ABI версияһын кире ҡайтарығыҙ. |
|`FindExecutorDataModel` |Ҡабул итеүсе мәғлүмәттәр моделе һүрәтләмәһен кире ҡайтарығыҙ. |
|`FindParameters` |Сылбырлы башҡарыусының конфигурация параметрҙарын кире ҡайтарыу. |

## Иҫәптәр һәм рөхсәттәре {#accounts-and-permissions}

|Һорау |Маҡсат |
| --- | --- |
|`FindAccountById` |ID каноник иҫәп буйынса бер иҫәбен табығыҙ. |
|`FindAccountByAlias` |Бухгалтер иҫәбенә исем ҡушымтаһын хәл итегеҙ. |
|`FindAccounts` |Теркәлгән иҫәптәрҙе яҙығыҙ. |
|`FindAccountIds` |Исемлек теркәлгән иҫәбенә IDs. |
|`FindAccountsWithAsset` |Билдәле актив билдәләмәһе булған иҫәптәрҙе исемлеккә индер. |
|`FindAliasesByAccountId` |Иҫәпкә бәйләнгән исемдәрҙе яҙығыҙ. |
|`FindAccountRecoveryPolicyByAlias` |Исеме өсөн кире ҡайтыу сәйәсәтен табығыҙ. |
|`FindAccountRecoveryRequestByAlias` |Исеме өсөн кире ҡайтарыу тураһындағы һорауҙы табығыҙ. |
|`FindRoles` |Ролдәрҙе исемлеккә килтерегеҙ. |
|`FindRoleIds` |исемлек роле IDs. |
|`FindRolesByAccountId` |Хисапҡа бирелгән ролдәрҙе исемлеккә килтерегеҙ. |
|`FindPermissionsByAccountId` |Хисапҡа бирелгән рөхсәттәре исемлеген яҙығыҙ. |

## Домендар һәм тиҫтерҙәр {#domains-and-peers}

|Һорау |Маҡсат |
| --- | --- |
|`FindDomainById` |`DomainId` менән бер домен табығыҙ. |
|`FindDomains` |Теркәлгән домендар исемлеге. |
|`FindDomainsByAccountId` |Иҫәпкә эйә булған домендарҙы исемлеккә килтерегеҙ. |
|`FindDomainEndorsements` |Домендар менән танышыу документтарын яҙығыҙ. |
|`FindDomainEndorsementPolicy` |Доменды раҫлау сәйәсәтен кире ҡайтарығыҙ. |
|`FindDomainCommittee` |Домен комитетын кире ҡайтарығыҙ. |
|`FindPeers` |Китапта танылған ышаныслы хеҙмәттәштәрегеҙҙе яҙығыҙ. |

## NFTs һәм RWAs активтары {#assets-nfts-and-rwas}

|Һорау |Маҡсат |
| --- | --- |
|`FindAssets` |Активтар балансын исемлекләгеҙ. |
|`FindAssetsDefinitions` |Активтарҙың билдәләмәләрен исемлеккә килтерегеҙ. |
|`FindAssetsByAccountId` |Иҫәптә тотолған активтарҙы исемлеккә индер. |
|`FindAssetById` |`AssetId` менән бер актив балансын табығыҙ. |
|`FindAssetDefinitionById` |ID менән бер актив билдәләмәһен табығыҙ. |
|`FindNfts` |Список NFTs. |
|`FindNftsByAccountId` |NFTs исемлеге иҫәбенә эйә. |
|`FindRwas` |Реаль донъя активтары исемлегендә теркәлгән. |

## Варианттар һәм иҫбатлау ҡағыҙҙары {#escrow-and-proof-records}

Эскроу һорауҙары [ урындағы активтар эскроуы ISIs](/ba/blockchain/escrow.md) тарафынан булдырылған мәғлүмәттәрҙе тикшерә, шул иҫәптән баҙарҙағы депозиттарҙы, дөйөм активтарҙы бикләүҙәрҙе һәм аноним конфиденциаль депозиттар тураһында мәғлүмәтте.

|Һорау |Маҡсат |
| --- | --- |
|`FindAssetEscrows` |Активтар иҫәбе тураһында яҙ. |
|`FindAssetEscrowById` |ID менән бер активты һаҡлап ҡалыу. |
|`FindAssetEscrowsBySeller` |Һатыусы тарафынан һаҡланған активтарҙы иҫкә алыу. |
|`FindAssetEscrowsByBuyer` |Һатып алыусы тарафынан һаҡланған активтарҙы иҫкә алыу. |
|`FindAssetEscrowsByStatus` |Статусы буйынса активтарҙы иҫкә алыу. |
|`FindAnonymousAssetEscrows` |Анноним активтар иҫәбенә теркәлеү. |
|`FindAnonymousAssetEscrowById` |ID менән бер аноним активты һаҡлап ҡалыуҙы табығыҙ. |
|`FindAnonymousAssetEscrowsBySeller` |Һатыусы буйынса аноним һаҡсыларҙы исемлеккә килтерегеҙ. |
|`FindAnonymousAssetEscrowsByBuyer` |Һатып алыусыға ҡарап аноним һаҡсыларҙы исемлеккә индер. |
|`FindAnonymousAssetEscrowsByStatus` |Аноним банкроттарҙы статусына ҡарап исемлеккә индер. |
|`FindProofRecordById` |ID менән бер иҫбатлау яҙмаһын табығыҙ. |
|`FindProofRecords` |Дәлилдәрҙе яҙығыҙ. |
|`FindProofRecordsByBackend` |Дәлилдәр өсөн иҫбатлау яҙмаларын яҙығыҙ. |
|`FindProofRecordsByStatus` |Хәлдәр буйынса иҫбатлау яҙмаларын исемлеккә индер. |

## Nexus, мәғлүмәттәрҙең булыуы һәм пакеттар {#nexus-data-availability-and-packages}

|Һорау |Маҡсат |
| --- | --- |
|`FindRepoAgreements` |Сылбырҙа һаҡланған депозитарлыҡ килешеүҙәрҙе исемлекләгеҙ. |
|`FindTwitterBindingByHash` |Хеш ярҙамында Twitter бәйләнешен хәл. |
|`FindDaPinIntentByTicket` |Билет буйынса мәғлүмәттәр менән тәьмин итеү маҡсатын табығыҙ. |
|`FindDaPinIntentByManifest` |Мәғлүмәт менән билдәләү маҡсатын табығыҙ. |
|`FindDaPinIntentByAlias` |Исеме буйынса пин-интент тап. |
|`FindDaPinIntentByLaneEpochSequence` |Юлдар, эпохалар һәм эҙемтәләр буйынса билдәләү маҡсатын табығыҙ. |
|`FindLaneRelayEnvelopeByRef` |Тикшеренгән юл эстафетаһы табығыҙ. |
|`FindSorafsProviderOwner` |SoraFS менән тәьмин итеүсе хужаһын хәл итергә. |
|`FindDataspaceNameOwnerById` |Мәғлүмәт киңлеге исеме хужаһын хәл итеү. |
|`FindMusubiReleaseByRef` |Һылтанма буйынса Musubi исемлеген табығыҙ. |
|`FindMusubiPackageVersions` |Musubi пакетына версиялар исемлеге. |
|`FindMusubiPackageReleases` |Musubi пакет өсөн исемлек сығарыу. |
|`FindMusubiShortAliasByName` |Musubi ҡыҫҡа исемде хәл итегеҙ. |

## Трекерҙар, килешеүҙәр, транзакциялар һәм блоктар {#triggers-contracts-transactions-and-blocks}

|Һорау |Маҡсат |
| --- | --- |
|`FindActiveTriggerIds` |Актив ҡуҙғытыусыны исемлеккә индер IDs. |
|`FindTriggers` |Тылсымлы исемлек. |
|`FindTriggerById` |ID менән бер атуарҙы табығыҙ. |
|`FindContractManifestByCodeHash` |Аҡыллы килешеү манифестаһын код-хаш менән табығыҙ.|
|`FindTransactions` |Ваҡытлы килешеүҙәр исемлеге |
|`FindBlocks` |Список блоктары. |
|`FindBlockHeaders` |Блок башлыҡтары исемлеген яҙығыҙ. |

## Фильтрлау һәм сәхифәне биҙәү {#filtering-and-pagination}

Итереүсән һорауҙар predicate һәм селектор ярҙамын күрһәтә ала. SDK файлынан һорауға ярашлы типланған фильтрҙарҙы ҡулланығыҙ, шуға күрә фильтр инеше һорауға сығыу тибына тап килә. Ҙур һөҙөмтәләр йыйылмалары өсөн бер үк ваҡытта һәр рәтҙе алыу урынына курсор һәм сик кеүек һорау параметрҙарын ҡулланығыҙ.
