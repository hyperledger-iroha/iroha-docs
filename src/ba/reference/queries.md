---
translation_locale: ba
translation_source: /reference/queries.md
translation_source_hash: baa9726c7ce7d14b8dd17e77447ef72233ca9ed779367d9a190aa8dde7da41ac
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-supplemental-naming-link+reviewed-delta
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

## Домендар һәм пирҙар {#domains-and-peers}

|Һорау |Маҡсат |
| --- | --- |
|`FindDomainById` |`DomainId` менән бер домен табығыҙ. |
|`FindDomains` |Теркәлгән домендар исемлеге. |
|`FindDomainsByAccountId` |Иҫәпкә эйә булған домендарҙы исемлеккә килтерегеҙ. |
|`FindDomainEndorsements` |Домендар менән танышыу документтарын яҙығыҙ. |
|`FindDomainEndorsementPolicy` |Доменды раҫлау сәйәсәтен кире ҡайтарығыҙ. |
|`FindDomainCommittee` |Домен комитетын кире ҡайтарығыҙ. |
| `FindPeers` | Реестрға билдәле ышаныслы тиңдәштәрҙе исемлеккә сығарығыҙ. |

## NFTs һәм RWAs активтары {#assets-nfts-and-rwas}

|Һорау |Маҡсат |
| --- | --- |
|`FindAssets` |Активтар балансын исемлекләгеҙ. |
|`FindAssetDefinitions` |Активтарҙың билдәләмәләрен исемлеккә килтерегеҙ. |
|`FindAssetsByAccountId` |Иҫәптә тотолған активтарҙы исемлеккә индер. |
|`FindAssetById` |`AssetId` менән бер актив балансын табығыҙ. |
|`FindAssetDefinitionById` |ID менән бер актив билдәләмәһен табығыҙ. |
|`FindNfts` |Список NFTs. |
|`FindNftsByAccountId` |NFTs исемлеге иҫәбенә эйә. |
|`FindRwas` |Реаль донъя активтары исемлегендә теркәлгән. |

## Варианттар һәм иҫбатлау ҡағыҙҙары {#escrow-and-proof-records}

Эскроу һорауҙары [протоколға индерелгән актив эскроуы ISIs](/ba/blockchain/escrow.md) булдырған яҙмаларҙы тикшерә, шул иҫәптән баҙар эскроуҙарын, дөйөм актив бикләүҙәрен һәм шартлы эскроуҙарҙы.

|Һорау |Маҡсат |
| --- | --- |
|`FindAssetEscrows` |Активтар иҫәбе тураһында яҙ. |
|`FindAssetEscrowById` |ID менән бер активты һаҡлап ҡалыу. |
|`FindAssetEscrowsBySeller` |Һатыусы тарафынан һаҡланған активтарҙы иҫкә алыу. |
|`FindAssetEscrowsByBuyer` |Һатып алыусы тарафынан һаҡланған активтарҙы иҫкә алыу. |
|`FindAssetEscrowsByStatus` |Статусы буйынса активтарҙы иҫкә алыу. |
|`FindProofRecordById` |ID менән бер иҫбатлау яҙмаһын табығыҙ. |
|`FindProofRecords` |Дәлилдәрҙе яҙығыҙ. |
|`FindProofRecordsByBackend` |Дәлилдәр өсөн иҫбатлау яҙмаларын яҙығыҙ. |
|`FindProofRecordsByStatus` |Хәлдәр буйынса иҫбатлау яҙмаларын исемлеккә индер. |

## SORA Nexus, мәғлүмәттәрҙең булыуы һәм пакеттар {#nexus-data-availability-and-packages}

|Һорау |Маҡсат |
| --- | --- |
|`FindRepoAgreements` |Сылбырҙа һаҡланған репо һәм кире репо килешеүҙәрен исемлекләгеҙ. |
|`FindTwitterBindingByHash` |Хеш ярҙамында Twitter бәйләнешен хәл. |
|`FindDaPinIntentByTicket` |Билет буйынса мәғлүмәттәр менән тәьмин итеү маҡсатын табығыҙ. |
|`FindDaPinIntentByManifest` |Мәғлүмәт менән билдәләү маҡсатын табығыҙ. |
|`FindDaPinIntentByAlias` |Исеме буйынса пин-интент тап. |
|`FindDaPinIntentByLaneEpochSequence` |Юлдар, эпохалар һәм эҙемтәләр буйынса билдәләү маҡсатын табығыҙ. |
|`FindSorafsProviderOwner` |SoraFS менән тәьмин итеүсе хужаһын хәл итергә. |
|`FindDataspaceNameOwnerById` |Мәғлүмәт киңлеге псевдонимының әүҙем SNS эйәһен асыҡлау. |
|`FindMusubiExactPackageV1` |Бер төп нөсхә һәм уның хәҙерге үҙгәрештәрен уҡығыҙ.|
|`FindMusubiExactReleaseV1` |Дөрөҫөн генә әйткәндә, бер фотоны уҡығыҙ. |
|`FindMusubiProviderBundleAttestationV1` |Бер провайдерҙың архив-банкет аттестацияһын уҡығыҙ. |
|`FindMusubiResolverIndexV1` |Оҙаҡлатылған хәл итеүсе индексын битегеҙ. |
|`FindMusubiVersionsV1` |Бер пакет өсөн биттәр тамамланған версиялар. |
|`FindMusubiMaintainersV1` |Сайт ҡараусыларҙы һәм саҡырыуҙарҙы ҡабул итә. |
|`FindMusubiArchiveLocationsV1` |Бер архив өсөн SoraFS урындарын тамамлаған биттәр. |
|`FindMusubiArchiveRetentionV1` |Файл архив-һаҡлау яҙмалары. |
|`FindMusubiAliasV1` |Хәҙерге маҡсатты һәм глобаль алфавитты уҡығыҙ. |
|`FindMusubiAliasHistoryV1` |Глобаль алфавиттың үҙгәрешһеҙ ретаргеты тарихын биттәренә яҙығыҙ. |
|`FindMusubiOrderedPrefixV1` |Бер тәртиптәге структура префиксы аҫтында биттәр пакеттары. |

## Трекерҙар, килешеүҙәр, транзакциялар һәм блоктар {#triggers-contracts-transactions-and-blocks}

|Һорау |Маҡсат |
| --- | --- |
|`FindActiveTriggerIds` |Актив ҡуҙғытыусыны исемлеккә индер IDs. |
|`FindTriggers` |Тылсымлы исемлек. |
|`FindTriggerById` |ID менән бер атуарҙы табығыҙ. |
|`FindContractManifestByArtifactId` |Аҡыллы килешеү манифесын уның мәғлүмәт киңлеге артефакты идентификаторы буйынса табығыҙ.|
|`FindTransactions` |Ваҡытлы килешеүҙәр исемлеге |
|`FindBlocks` |Список блоктары. |
|`FindBlockHeaders` |Блок башлыҡтары исемлеген яҙығыҙ. |

## Фильтрлау һәм сәхифәне биҙәү {#filtering-and-pagination}

Итереүсән һорауҙар predicate һәм селектор ярҙамын күрһәтә ала. SDK файлынан һорауға ярашлы типланған фильтрҙарҙы ҡулланығыҙ, шуға күрә фильтр инеше һорауға сығыу тибына тап килә. Ҙур һөҙөмтәләр йыйылмалары өсөн бер үк ваҡытта һәр рәтҙе алыу урынына курсор һәм сик кеүек һорау параметрҙарын ҡулланығыҙ.
