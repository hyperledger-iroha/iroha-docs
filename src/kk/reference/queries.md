---
translation_locale: kk
translation_source: /reference/queries.md
translation_source_hash: 22e8a75acd72d066e3516ba46a0afe075d2d02790154458aec00a5d8bb861838
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Сұрақтар {#queries}

Iroha сауалдары бухгалтерлік есептің күйін өзгертпестен оқиды. Қазіргі деректер моделі екі кең сұраныс пішіндерін ашады:

- Бір нысанды немесе бір мәнді қайтаратын дара сұраулар
- қайталанатын сұраулар, олар ағынды немесе жинақты қайтарады және оны сұраныс түрі қолдаған жерде сүзгілеумен, сұрыптаумен, проекциямен және парақтандырумен біріктірілуі мүмкін.

Сұраныс конверттерін қолмен жасаудың орнына SDK типті конструкторларды немесе CLI қолданыңыз. Төмендегі атаулар `iroha_data_model::query` анықтаған ағымдағы сұраныс түрлері болып табылады.

## Жүргізу уақыты мен конфигурациясы {#runtime-and-configuration}

|Сұрақтар |Мақсаты |
| --- | --- |
|`FindAbiVersion` |Орындаушы ABI нұсқасын қайтару. |
|`FindExecutorDataModel` |Орындаушының деректер үлгісін қайтару. |
|`FindParameters` |Желідегі орындаушы параметрлерін қайтару. |

## Есепшоттар мен рұқсаттар {#accounts-and-permissions}

|Сұрақтар |Мақсаты |
| --- | --- |
|`FindAccountById` |Қаноникалық есеп бойынша бір шотты табу ID. |
|`FindAccountByAlias` |Тіркелгіге деген атауды шешу. |
|`FindAccounts` |Тіркелген шоттар тізімі. |
|`FindAccountIds` |Тізімделген шот IDs. |
|`FindAccountsWithAsset` |Белгілі бір активтің анықтамасы бар шоттарды тізімдеу. |
|`FindAliasesByAccountId` |Тіркелгіге байланысты атаулы есімдерді тізімдеңіз. |
|`FindAccountRecoveryPolicyByAlias` |Алдыңғы аты-жөні үшін қалпына келтіру саясатын табыңыз. |
|`FindAccountRecoveryRequestByAlias` |Алдыңғы аты-жөні үшін қалпына келтіру сұрауын тап. |
|`FindRoles` |Тізімдегі рөлдер. |
|`FindRoleIds` |Тізімнің рөлі IDs. |
|`FindRolesByAccountId` |Есепшотқа берілген рөлдерді тізімдеу. |
|`FindPermissionsByAccountId` |Тіркелгіге берілген рұқсаттарды тізімдеу. |

## Домендер мен теңгерімдер {#domains-and-peers}

|Сұрақтар |Мақсаты |
| --- | --- |
|`FindDomainById` |`DomainId` арқылы бір доменді табыңыз. |
|`FindDomains` |Тіркелген домендерді тізбеңіз. |
|`FindDomainsByAccountId` |Тіркелгіге ие домендерді тізбеңіз. |
|`FindDomainEndorsements` |Домендерді қолдау туралы деректерді тізімдеңіз. |
|`FindDomainEndorsementPolicy` |Доменді қолдау саясатын қайтарып беріңіз. |
|`FindDomainCommittee` |Домен комитетін қайтарып беріңіз.|
|`FindPeers` |Кітапта белгілі сенімді әріптестерді тізімдеңіз. |

## NFTs және RWAs активтері {#assets-nfts-and-rwas}

|Сұрақтар |Мақсаты |
| --- | --- |
|`FindAssets` |Активтердің баланстарын тізімдеу. |
|`FindAssetsDefinitions` |Активтің анықтамаларын тізімдеу. |
|`FindAssetsByAccountId` |Есепшоттағы активтерді тізімдеу. |
|`FindAssetById` |`AssetId` арқылы бір активтің балансын табу. |
|`FindAssetDefinitionById` |ID арқылы активтің бір анықтамасын табу. |
|`FindNfts` |Тізім NFTs. |
|`FindNftsByAccountId` |Тізім NFTs шот иелігінде. |
|`FindRwas` |Тізімдеген нақты дүниедегі активтер. |

## Кепілдік және дәлелдеме деректері {#escrow-and-proof-records}

ISIs](/kk/blockchain/escrow.md) жергiлiктi активтердiң депозиттерiн, жалпы активтердің құлыптарын және анонимді депозиттердi есепке алуды қоса алғанда, [ жергiлдi активтердегі депозиттерді тексерудi тексеру.

|Сұрақтар |Мақсаты |
| --- | --- |
|`FindAssetEscrows` |Активтердiң депозиттік тiзiмдерiн жаз. |
|`FindAssetEscrowById` |ID бойынша бір активті кепілдендіруді табыңыз. |
|`FindAssetEscrowsBySeller` |Сатушы бойынша активтердің депозиттерін тізбеңіз. |
|`FindAssetEscrowsByBuyer` |Сатып алушы бойынша активтер тізімін. |
|`FindAssetEscrowsByStatus` |Активтердегі депозиттерді жай-күйі бойынша тізіміңіз. |
|`FindAnonymousAssetEscrows` |Анонимді активтердегі депозиттік жазбаларды тізімі. |
|`FindAnonymousAssetEscrowById` |ID арқылы бір анонимді активтерді кепілдендіруді табыңыз. |
|`FindAnonymousAssetEscrowsBySeller` |Сатушы бойынша анонимді кепілдіктерді тізімдеу. |
|`FindAnonymousAssetEscrowsByBuyer` |Сатып алушы бойынша анонимді кепілдіктерді тізімдеу. |
|`FindAnonymousAssetEscrowsByStatus` |Анонимді кепілгерлерді жай-күйі бойынша тізімдеңіз. |
|`FindProofRecordById` |ID арқылы бір дәлелді жазба табыңыз. |
|`FindProofRecords` |Дәлелдемелік жазбаларды тізімі. |
|`FindProofRecordsByBackend` |Дәлелдемесі үшін дәлелді деректерді тізімдеңіз. |
|`FindProofRecordsByStatus` |Дәлелдеу жазбаларын жай-күйі бойынша келтіріңіз. |

## Nexus, Деректердің қолжетімділігі және пакеттері {#nexus-data-availability-and-packages}

|Сұрақтар |Мақсаты |
| --- | --- |
|`FindRepoAgreements` |Желіде сақталған депозитарлық келісімдерді тізбектеңіз. |
|`FindTwitterBindingByHash` |Твиттер байланысын хешпен шешу. |
|`FindDaPinIntentByTicket` |Билет бойынша деректерге қол жетімділік белгісі табыңыз. |
|`FindDaPinIntentByManifest` |Белгілі сілтеме арқылы шынайы мақсатты табыңыз. |
|`FindDaPinIntentByAlias` |Алдыңғы мақаланы табу. |
|`FindDaPinIntentByLaneEpochSequence` |Жол, эпоха және реттілік бойынша шынайы мақсатты табыңыз. |
|`FindLaneRelayEnvelopeByRef` |Сызық-релелік конвертті табу. |
|`FindSorafsProviderOwner` |SoraFS провайдерінің иесін шешу. |
|`FindDataspaceNameOwnerById` |Деректер кеңістігінің атауы иеленушісін шешу. |
|`FindMusubiReleaseByRef` |Musubi анықтамасын анықтаңыз. |
|`FindMusubiPackageVersions` |Musubi пакетінің нұсқаларын тізбеңіз. |
|`FindMusubiPackageReleases` |Musubi топтамасы үшін тізімді шығару. |
|`FindMusubiShortAliasByName` |Musubi қысқа аты-жөнін шешу. |

## Қозғалтқыштар, келісім-шарттар, мәмілелер және блоктар {#triggers-contracts-transactions-and-blocks}

|Сұрақтар |Мақсаты |
| --- | --- |
|`FindActiveTriggerIds` |Белсенді триггерлерді IDs тізімі. |
|`FindTriggers` |Тізімді іске қосу. |
|`FindTriggerById` |ID арқылы бір триггерді табыңыз. |
|`FindContractManifestByCodeHash` |Ақыллы келісімшарт манифестін код-хашпен табыңыз. |
|`FindTransactions` |Келісілген операциялар тізімі. |
|`FindBlocks` |Тізім блоктарын.|
|`FindBlockHeaders` |Блок бастықтарын тізімдеу. |

## Фильтрлеу және параметрлеу {#filtering-and-pagination}

Қайталануы мүмкін сұраулар predicate және селекторды қолдауға мүмкіндік береді. Сұрау салуға арналған SDK түрлендіру сүзгілерін пайдаланыңыз, сондықтан сүзгі кірісі сұраныс шығу түрімен сәйкес келеді. Үлкен нәтиже жиынтықтары үшін әрбір жолды бірден алудың орнына курсор мен шек сияқты сұраныс параметрлерін қолданыңыз.
