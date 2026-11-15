---
translation_locale: hy
translation_source: /reference/queries.md
translation_source_hash: baa9726c7ce7d14b8dd17e77447ef72233ca9ed779367d9a190aa8dde7da41ac
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-supplemental-naming-link+reviewed-delta
---
# Հարցումներ {#queries}

Iroha հարցումները կարդում են գլխավոր գրքի վիճակը ՝ առանց դրա մուտացիայի: Ներկայիս տվյալների մոդելը բացահայտում է երկու լայն հարցման ձեւեր.

- singular հարցումներ, որոնք վերադարձնում են մեկ օբյեկտ կամ մի արժեք
- կրկնվող հարցումները, որոնք վերադարձնում են հոսք կամ հավաքածու եւ կարող են համատեղվել ֆիլտրման, դասակարգման, արտացոլման եւ էջավորման հետ, որտեղ հարցման տեսակն աջակցում է այն

Օգտագործեք SDK տիպված շինարարներ կամ CLI ՝ ձեռքով հարցման փաթեթները կառուցելու փոխարեն: Ստորեւ բերված անունները ներկայիս հարցման տեսակներն են, որոնք բացահայտվել են `iroha_data_model::query`- ի կողմից:

## Գործընթացային ժամկետը եւ կարգավորումը {#runtime-and-configuration}

|Հարցում |Նպատակ |
| --- | --- |
|`FindAbiVersion` |Վերադարձնել կատարող ABI տարբերակը: |
|`FindExecutorDataModel` |Վերադարձ կատարողի տվյալների մոդելի նկարագրությունը: |
|`FindParameters` |Վերադարձ առնել շղթայի վրա կատարողի կարգավորման պարամետրերը: |

## հաշիվներ եւ թույլտվություններ {#accounts-and-permissions}

|Հարցում |Նպատակ |
| --- | --- |
|`FindAccountById` |Գտեք մեկ հաշիվ քանոնիկ հաշիվով ID. |
|`FindAccountByAlias` |Բացահայտեք հաշիվ, որը կոչվում է հաշիվ:|
|`FindAccounts` |Ցուցադրել գրանցված հաշիվները: |
|`FindAccountIds` |Գրանցված հաշիվ IDs. |
|`FindAccountsWithAsset` |Ցուցադրել հաշիվները, որոնք պարունակում են տվյալ ակտիվի սահմանումը: |
|`FindAliasesByAccountId` |Հաշիվի հետ կապված կեղծանունների ցանկ: |
|`FindAccountRecoveryPolicyByAlias` |Գտեք կեղծանունի համար վերականգնման քաղաքականությունը: |
|`FindAccountRecoveryRequestByAlias` |Գտիր ապատեղեկատվության պահանջը: |
|`FindRoles` |Թողարկեք դերերը: |
|`FindRoleIds` |Ցուցակի դերը IDs. |
|`FindRolesByAccountId` |Հաշվի համար տրված դերակատարությունների ցուցակը: |
|`FindPermissionsByAccountId` |Հաշիվի համար տրված թույլտվությունների ցանկը: |

## Դոմեյններ եւ հանգույցներ {#domains-and-peers}

|Հարցում |Նպատակ |
| --- | --- |
|`FindDomainById` |Գտեք մեկ տիրույթ `DomainId`. |
|`FindDomains` |Ցուցադրել գրանցված տիրույթները: |
|`FindDomainsByAccountId` |Ցուցադրել հաշիվի սեփականատերերի տիրույթները: |
|`FindDomainEndorsements` |Դոմեյնների հավատարմագրերի ցանկը: |
|`FindDomainEndorsementPolicy` |Վերադարձ տիրույթի հաստատման քաղաքականությունը: |
|`FindDomainCommittee` |Վերադարձ տիրույթի հանձնաժողովը: |
|`FindPeers` |Հաշվապահական գրքում հայտնի վստահելի հանգույցների ցանկ։ |

## Ակտիվներ, NFTs և RWAs {#assets-nfts-and-rwas}

|Հարցում |Նպատակ |
| --- | --- |
|`FindAssets` |Նշեք ակտիվների հաշվեկշիռները: |
|`FindAssetDefinitions` |Նշեք ակտիվների սահմանումները: |
|`FindAssetsByAccountId` |Հաշվեի կողմից պահվող ակտիվների ցուցակում: |
|`FindAssetById` |Գտեք մեկ ակտիվի մնացորդը `AssetId`: |
|`FindAssetDefinitionById` |Գտեք ID կողմից ակտիվի մեկ սահմանումը: |
|`FindNfts` |Ցուցակ NFTs. |
|`FindNftsByAccountId` |NFTs ցուցակ, որը պատկանում է հաշվին: |
|`FindRwas` |Ցուցակում գրանցված իրական աշխարհի ակտիվների տեղերը: |

## Գանձման եւ ապացույցների փաստաթղթերը {#escrow-and-proof-records}

Էսկրոուի հարցումները ստուգում են [ակտիվների բնիկ էսկրոուի ISIs](/hy/blockchain/escrow.md)-ի կողմից ստեղծված գրառումները, ներառյալ շուկայական էսկրոուները, ակտիվների ընդհանուր արգելափակումները և պայմանական էսկրոուները։

|Հարցում |Նպատակ |
| --- | --- |
|`FindAssetEscrows` |Գրանցեք ակտիվների գրառումները: |
|`FindAssetEscrowById` |Գտեք ID մինչեւ մեկ ակտիվի պահապան: |
|`FindAssetEscrowsBySeller` |Հաշվարկեք վաճառողի կողմից ստացված ակտիվները: |
|`FindAssetEscrowsByBuyer` |Գնորդի կողմից գրավված ակտիվների ցուցակը: |
|`FindAssetEscrowsByStatus` |Հաշվարկային ակտիվների ցուցակը ըստ վիճակի: |
|`FindProofRecordById` |Գտեք մեկ ապացույցի արձանագրություն ID: |
|`FindProofRecords` |Ցուցադրեք ապացույցների փաստաթղթերը: |
|`FindProofRecordsByBackend` |Ցուցադրեք ապացույցների փաստաթղթերը ապացույցի հետագա վերջի համար: |
|`FindProofRecordsByStatus` |Թողարկեք ապացույցների փաստաթղթերը ըստ վիճակի: |

## SORA Nexus, Տվյալների մատչելիությունը եւ փաթեթները {#nexus-data-availability-and-packages}

|Հարցում |Նպատակ |
| --- | --- |
|`FindRepoAgreements` |Թվարկեք շղթայում պահվող ռեպո և հակադարձ ռեպո համաձայնագրերը։ |
|`FindTwitterBindingByHash` |Հաշշի միջոցով լուծեք Twitter- ի կապը: |
|`FindDaPinIntentByTicket` |Գտեք տվյալների մատչելիության փոստի մտադրությունը տոմսով: |
|`FindDaPinIntentByManifest` |Գտեք փայտի մտադրությունը բացատրական հղումով:|
|`FindDaPinIntentByAlias` |Գտեք մետաղադրույքի մտադրություն կեղծ անունով:|
|`FindDaPinIntentByLaneEpochSequence` |Գտեք գոտի, ժամանակաշրջանի եւ հաջորդականության համաձայն փաթեթավորման նպատակ: |
|`FindSorafsProviderOwner` |Բացահայտել SoraFS մատակարարի սեփականատիրոջը: |
|`FindDataspaceNameOwnerById` |Որոշել տվյալների տարածքի այլանվան ակտիվ SNS սեփականատիրոջը։ |
|`FindMusubiExactPackageV1` |Կարդացեք մեկ ճշգրիտ փաթեթային արձանագրությունը եւ դրա ներկայիս վերանայմանները: |
|`FindMusubiExactReleaseV1` |Կարդացեք մեկ ճշգրիտ արձանագրություն: |
|`FindMusubiProviderBundleAttestationV1` |Կարդացեք մեկ մատակարարի արխիվային փաթեթավորման վկայականը: |
|`FindMusubiResolverIndexV1` |Հրապարակեք վերջնական լուծման ինդեքսը: |
|`FindMusubiVersionsV1` |էջը վերջնականացված տարբերակներ մեկ փաթեթ. |
|`FindMusubiMaintainersV1` |Էջը ընդունել է պահապանների եւ սպասարկվող հրավիրումների: |
|`FindMusubiArchiveLocationsV1` |Էջը վերջնականացրել է SoraFS վայրերը մեկ արխիվի համար: |
|`FindMusubiArchiveRetentionV1` |Կայքի արխիվային պահեստավորման փաստաթղթերը: |
|`FindMusubiAliasV1` |Կարդացեք գլոբալ alias- ի ներկայիս թիրախը եւ վերանայման մասին: |
|`FindMusubiAliasHistoryV1` |Գլոբալ alias- ի անփոխարինելի վերանայման պատմությունը: |
|`FindMusubiOrderedPrefixV1` |Էջի փաթեթները մեկ կարգավորված կառուցվածքային նախադրյալի ներքո: |

## Գործարկիչներ, պայմանագրեր, գործարքներ եւ բլոկներ {#triggers-contracts-transactions-and-blocks}

|Հարցում |Նպատակ |
| --- | --- |
|`FindActiveTriggerIds` |Բացրեք ակտիվ գործարկիչը IDs. |
|`FindTriggers` |Թողարկիչները. |
|`FindTriggerById` |Գտեք մեկ գործարկիչ մինչեւ ID. |
|`FindContractManifestByArtifactId` |Գտնել խելացի պայմանագրի մանիֆեստն իր տվյալների տարածքի արտեֆակտի ID-ով։ |
|`FindTransactions` |Վավերացված գործարքների ցուցակը: |
|`FindBlocks` |Ցուցակի բլոկներ: |
|`FindBlockHeaders` |Ցուցադրեք բլոկի գլխավորությունները: |

## Ֆիլտրումը եւ էջերը {#filtering-and-pagination}

Iterable հարցումները կարող են բացահայտել predicate եւ ընտրողի աջակցությունը: Օգտագործեք հարցման հատուկ տիպված ֆիլտրեր SDK-ից, որպեսզի ֆիլտրի մուտքը համապատասխանի հարցման արտադրանքի տեսակին: Մեծ արդյունքների հավաքածուների համար օգտագործեք հարցման պարամետրեր, ինչպիսիք են կուրսորն ու սահմանը, փոխարենը միանգամից վերցնելով յուրաքանչյուր շարք:
