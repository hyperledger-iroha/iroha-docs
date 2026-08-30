---
translation_locale: mn
translation_source: /reference/queries.md
translation_source_hash: 88dba1142d7b6a452a5f56d56640ceef47a52ca28e296d6d0ee5992b9005c3bb
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Судалгаа {#queries}

Iroha асуултууд нь томоохон номын жагсаалтыг өөрчлөхгүйгээр уншдаг. Одоогийн мэдээллийн загвар нь хоёр өргөн асуултын хэлбэрийг илрүүлж байна:

- нэг зүйл эсвэл нэг үнэ цэнийг буцааж буй ганцаарчилсан хайлтууд
- эргэлтийн асуултууд нь урсгал эсвэл цуглуулгаг буцааж, хүсэлт хэлбэрээр дэмжиж байгаагаар филтрлэх, ангилах, проекцируулж, хуудасчлахад нийлүүлж болно.

SDK бичигдсэн бүтээн байгуулагч эсвэл CLI ашиглах оронд хайлтын хуудасыг гардан бүтээх. Доорх нэрүүд нь `iroha_data_model::query` -ийн танилцуулсан одоогийн хайлтын төрөл юм.

## Хөгжлийн цаг хугацаа, зохион байгуулалт {#runtime-and-configuration}

|Судалгаа |Зорилго|
| --- | --- |
|`FindAbiVersion` |ABI гүйцэтгэгч хувилбарыг буцааж өгөөч. |
|`FindExecutorDataModel` |Хөдөлмөрийн гүйцэтгэгч мэдээллийн загварын тодорхойлолтыг буцааж өгнө. |
|`FindParameters` |Захиргааны гүйцэтгэгчний конфигурацийн параметрүүдийг буцааж өгөөч. |

## Санхүүжилт, зөвшөөрөл {#accounts-and-permissions}

|Судалгаа |Зорилго|
| --- | --- |
|`FindAccountById` |ID хэмээх санхүүгийн бүртгэлээс нэг тоо олох. |
|`FindAccountByAlias` |Хэтгэлэгт бүртгэлийн төлөөлөгч. |
|`FindAccounts` |Та бүртгэлтэй дансны жагсаалтыг гарга. |
|`FindAccountIds` |Тодруулсны бүртгэл IDs. |
|`FindAccountsWithAsset` |Тухайн хөрөнгийн тодорхойлолтыг эзэмшдэг санхүүгийн бүртгэл. |
|`FindAliasesByAccountId` |Нягтлан бодох бүртгэлтэй холбогдсон нууц нэрүүдийг жагсаарай. |
|`FindAccountRecoveryPolicyByAlias` |Аймгийн нэртэй хүний нөхөн сэргээлтийн бодлогыг олох. |
|`FindAccountRecoveryRequestByAlias` |Үүнээс сэргээх хүсэлтийг нууц нэрээр оло. |
|`FindRoles` |Зохиоллын жагсаалт. |
|`FindRoleIds` |Тодруулгын үүрэг IDs. |
|`FindRolesByAccountId` |Нягтлан бодох бүртгэлд олгогдсон үүрэг жагсаалт. |
|`FindPermissionsByAccountId` |Нягтлан бодох бүртгэлд олгогдсон зөвшөөрлийг жагсаалт. |

## Доменүүд, өрсөлдөгчид {#domains-and-peers}

|Судалгаа |Зорилго|
| --- | --- |
|`FindDomainById` |`DomainId`ээр нэг доменийг олох. |
|`FindDomains` |бүртгэгдсэн доменийн жагсаалт. |
|`FindDomainsByAccountId` |Нягтлан бодох бүртгэлийн эзэмшлийн доменийг жагсаалт. |
|`FindDomainEndorsements` |Доменийн хувилбарыг баталгаажуулах баримтыг жагсаарай. |
|`FindDomainEndorsementPolicy` |Доменийн зөвшөөрлийн бодлогыг буцааж өгөх. |
|`FindDomainCommittee` |Доменын хороог буцааж өгөөч. |
|`FindPeers` |Номын сангаас мэдэх итгэмжлэгдсэн найз нөхөд жагсаал. |

## NFTs болон RWAs гэсэн хөрөнгийн {#assets-nfts-and-rwas}

|Судалгаа |Зорилго|
| --- | --- |
|`FindAssets` |Ашигт малтмалын үлдэгдэл жагсаалт. |
|`FindAssetsDefinitions` |Ашигт малтмалын тодорхойлолт жагсаалт. |
|`FindAssetsByAccountId` |Ахуйн нэгжийн өмчлөх хөрөнгийг жагсаалт. |
|`FindAssetById` |`AssetId` гэхэд нэг хөрөнгийн үлдэгдэл олох. |
|`FindAssetDefinitionById` |ID дотор нэг хөрөнгийн тодорхойлолтыг олох. |
|`FindNfts` |Тодруул NFTs. |
|`FindNftsByAccountId` |NFTs бүртгэлтэй. |
|`FindRwas` |Байгууллагад бүртгэгдсэн бодит хөрөнгийн жагсаалт. |

## Хөдөлмөрийн санхүүжилт, баталгааны баримт {#escrow-and-proof-records}

[ үндсэн хөрөнгийн хадгаламж ISIs](/mn/blockchain/escrow.md) үүсгэн байгуулсан бүртгэлийг, тэр дундаа зах зээлийн хадгаламжийг, нийтлэг хөрөнгийн хаалтыг, нууцлан тэмдэглэсэн хадгаламжийн бүртгэлийг хяналт шалгаж байна.

|Судалгаа |Зорилго|
| --- | --- |
|`FindAssetEscrows` |Ашигт малтмалын хадгаламжийн бүртгэлийг жагсаарай. |
|`FindAssetEscrowById` |ID гэхэд нэг хөрөнгийн хадгаламж олох хэрэгтэй. |
|`FindAssetEscrowsBySeller` |Худалцаар хадгалах хөрөнгийн жагсаалт. |
|`FindAssetEscrowsByBuyer` |Худалдан авагч бүр хадгаламжлах хөрөнгийг жагсаал. |
|`FindAssetEscrowsByStatus` |Ашигт малтмалын хадгаламжны жагсаалтыг статусын дагуу. |
|`FindAnonymousAssetEscrows` |Ашигт малтмалын нууцлан бүртгэгдсэн баримтуудыг жагсаарай. |
|`FindAnonymousAssetEscrowById` |ID доор нэг нууцаар хадгалах хөрөнгийг олох. |
|`FindAnonymousAssetEscrowsBySeller` |Худалцуулагчаар тодруулсан нууц захиалгыг жагсаарай. |
|`FindAnonymousAssetEscrowsByBuyer` |Худалдан авагчдын бүртгэлтэй нууцлагчийн жагсаалт.|
|`FindAnonymousAssetEscrowsByStatus` |Үндсэн дүрмийн дагуу нэрсгүй хадгаламж олгогчдыг жагсаарай. |
|`FindProofRecordById` |ID гэхэд нэг нотлох баримтыг олох. |
|`FindProofRecords` |Дашрамдсан баримтыг жагсаарай. |
|`FindProofRecordsByBackend` |Дашрамд дурдах хяналтын хэсгийг бүртгүүлэх. |
|`FindProofRecordsByStatus` |Дашрамдсан баримтуудыг статусын дагуу жагсаарай. |

## Nexus, Мэдээний хүртээмж, багц {#nexus-data-availability-and-packages}

|Судалгаа |Зорилго|
| --- | --- |
|`FindRepoAgreements` |Захиргааны зах зээлд хадгалагдсан хадгаламжийн гэрээний жагсаалт. |
|`FindTwitterBindingByHash` |Twitter-ийн холбогдлыг хэшигээр шийднэ. |
|`FindDaPinIntentByTicket` |Мэдээллийн хүртээмжтэй нэрийн зорилтыг тавитын дагуу олох. |
|`FindDaPinIntentByManifest` |Тэмцээний нэгийг илтгэхийн дагуу олох. |
|`FindDaPinIntentByAlias` |Үндсэн нэрээр нэрийн санааг олох.|
|`FindDaPinIntentByLaneEpochSequence` |Тэмцээ, цаг үе, дараалал дагуу нэрийн зорилгыг олох. |
|`FindLaneRelayEnvelopeByRef` |Тэмцээний шилжилтийн баталгаатай хуудас олох.|
|`FindSorafsProviderOwner` |SoraFS үйлчилгээ үзүүлэгчний эзэмшигчээр шийдвэрлэх. |
|`FindDataspaceNameOwnerById` |Мэдээллийн орон тооны нэр эзэмшигчг шийдвэрлэх. |
|`FindMusubiExactPackageV1` |Тухайн цогцолборын баримт бичиг болон түүний одоогийн шинэчлэлтийг уншина уу. |
|`FindMusubiExactReleaseV1` |Тухайн нэг илтгэлийг уншина уу. |
|`FindMusubiProviderBundleAttestationV1` |Нэг үйлчилгээ үзүүлэгчээс архивын баглааны баталгааг уншина уу. |
|`FindMusubiResolverIndexV1` |Оролцогчын эцсийн индекс хуудас. |
|`FindMusubiVersionsV1` |Нэг багцын эцсийн хувилбар . |
|`FindMusubiMaintainersV1` |Сайт нь захиалгыг хүлээн авч, урьж байна. |
|`FindMusubiArchiveLocationsV1` |Нэг архивын SoraFS байршлыг эцэслэн гаргажээ. |
|`FindMusubiArchiveRetentionV1` |Архив хадгалах бүртгэлийн хуудас. |
|`FindMusubiAliasV1` |Дэлхий даяар нэр дэвшигчдийн одоогийн зорилт, шинэчлэл уншина уу. |
|`FindMusubiAliasHistoryV1` |Дэлхий даяар цогцолболт нэртэй шинэчлэлийн түүхийг бичнэ.|
|`FindMusubiOrderedPrefixV1` |Нүүр хуудасны багцыг нэг зохион байгуулалттай префикс дор. |

## Тэгжер, гэрээ, гүйлгээ, блокууд {#triggers-contracts-transactions-and-blocks}

|Судалгаа |Зорилго|
| --- | --- |
|`FindActiveTriggerIds` |Хөдөлмөрийн хөдөлгөөн үүсгэгч IDs жагсаал. |
|`FindTriggers` |Сэтгэгдлийн жагсаалт. |
|`FindTriggerById` |ID гэхэд нэг учрыг олох. |
|`FindContractManifestByCodeHash` |Ухаалаг гэрээний манфист код хэшээр олох. |
|`FindTransactions` |Зохиогдох гүйлгээний жагсаалт. |
|`FindBlocks` |Тодруулгын блок.|
|`FindBlockHeaders` |Блокын толгой жагсаалт. |

## Хэвтрүүлэг болон хуудасчлалт {#filtering-and-pagination}

Үргэлждэг асуултууд нь predicate болон selector дэмжлэгийг илрүүлж болно. SDK -ийн хайлтын онцгой хэлбэртэй филтр ашиглаж, тасалбар өгөгдлийг хайлтын гарааны төрөлтэй нийцүүлнэ. Томоохон үр дүнгийн цувралын хувьд нэг дор бүх шугам авахаас илүү курсор, хязгаар гэх мэт хайлтын параметрүүдийг хэрэглэж байна.
