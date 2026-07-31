---
translation_locale: mn
translation_source: /reference/queries.md
translation_source_hash: 22e8a75acd72d066e3516ba46a0afe075d2d02790154458aec00a5d8bb861838
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Судалгаа {#queries}

Iroha Одоогийн мэдээллийн загвар нь
хоёр өргөн асуултын хэлбэрийг илрүүлнэ:

- **нэгдсэн асуултууд**, нэг объект эсвэл нэг үнэ цэнэ нь буцаадаг
- **эргэлтийн асуултууд**, Энэ нь урсгал эсвэл цуглуулгыг буцааж, нэгтгэж болно
  Хэрэглэлийн хэлбэрээр тавих, ангилах, проекцируулж, хуудасчлахад ашигладаг
  дэмжиж байна

Хэрэглээ SDK тоног төхөөрөмж CLI хайлтын хуудас бүтээхийн оронд
Дараах нэрүүд нь одоогийн хайлтын төрөл
`iroha_data_model::query`.

## Хөгжлийн цаг хугацаа, зохион байгуулалт {#runtime-and-configuration}

| Судалгаа | Зорилго |
| --- | --- |
| `FindAbiVersion` | Тэмцүүлэгчг буцааж өг ABI Үргэлж. |
| `FindExecutorDataModel` | Хөдөлмөрийн гүйцэтгэгч мэдээллийн загварын тодорхойлолтыг буцааж өгөөч. |
| `FindParameters` | Захиргааны гүйцэтгэгчний конфигурацийн параметрүүдийг буцааж өгөх. |

## Нягтлан бодох бүртгэл, зөвшөөрөл {#accounts-and-permissions}

| Судалгаа | Зорилго |
| --- | --- |
| `FindAccountById` | Канонгийн нэг өгүүллийг олох ID. |
| `FindAccountByAlias` | Хэтгэлээ шийднэ. |
| `FindAccounts` | Та бүртгэлтэй дансны жагсаалтыг хий. |
| `FindAccountIds` | Тодруулсан бүртгэл IDs. |
| `FindAccountsWithAsset` | Тухайн хөрөнгийн тодорхойлолтыг хадгалах бүртгэл. |
| `FindAliasesByAccountId` | Хэтгэлэгт холбогдсон нууц үсэг жагсаалт. |
| `FindAccountRecoveryPolicyByAlias` | Үндсэн нэртэй хүний нөхөн сэргээлтийн бодлогыг олох. |
| `FindAccountRecoveryRequestByAlias` | Үүнээс сэргээх хүсэлт эзэмших. |
| `FindRoles` | Тодруулгын үүрэг. |
| `FindRoleIds` | жагсаалтын үүрэг IDs. |
| `FindRolesByAccountId` | Хэтгэлэгт олгогдсон үүргийг жагсаалт. |
| `FindPermissionsByAccountId` | Хэтгэлэгт олгогдсон зөвшөөрлийг жагсаалт. |

## Доменүүд, өрсөлдөгчид {#domains-and-peers}

| Судалгаа | Зорилго |
| --- | --- |
| `FindDomainById` | Нэг доменийг олох `DomainId`. |
| `FindDomains` | бүртгэгдсэн доменийг жагсаал. |
| `FindDomainsByAccountId` | Хэтгэлийн эзэмшлийн доменийг жагсаалт. |
| `FindDomainEndorsements` | Доменийн хувилбарыг баталгаажуулах бүртгэл. |
| `FindDomainEndorsementPolicy` | Доменийн зөвшөөрлийн бодлогыг буцааж өгөөч. |
| `FindDomainCommittee` | Доменийн хороог буцааж өгөөч. |
| `FindPeers` | Тодруулбал, номын сангаас мэдэх итгэмжлэгдсэн үеийнхнийг жагсаарай. |

## Ашигт малтмал, NFTs, болон RWAs {#assets-nfts-and-rwas}

| Судалгаа | Зорилго |
| --- | --- |
| `FindAssets` | Ашигт малтмалын үлдэгдэл жагсаалт. |
| `FindAssetsDefinitions` | Ашигт малтмалын тодорхойлолтыг жагсаал. |
| `FindAssetsByAccountId` | Санхүүжилтээс хамаарах хөрөнгийг жагсаалт. |
| `FindAssetById` | Нэг хөрөнгийн тэнцвэрийг `AssetId`. |
| `FindAssetDefinitionById` | Ашигт малтмалын тодорхойлолт ID. |
| `FindNfts` | Тус жагсаалт NFTs. |
| `FindNftsByAccountId` | Тус жагсаалт NFTs Эдгээрийн өмчит. |
| `FindRwas` | Тодруулбал, бодит хөрөнгийг бүртгэж байна. |

## Хөдөлмөрийн санхүүжилт {#escrow-and-proof-records}

Хөрөнгө оруулалтын захиалгын асуултууд нь
[гаралтай хөрөнгийн хадгаламж ISIs](/mn/blockchain/escrow.md), зах зээлийн газар
Хөрөнгийн санхүүжилт, нийтлэг хөрөнгийн замбараагүй бүртгэл.

| Судалгаа | Зорилго |
| --- | --- |
| `FindAssetEscrows` | Ашигт малтмалын хадгаламж бичгийг жагсаарай. |
| `FindAssetEscrowById` | Нэг хөрөнгийн хяналтын төлбөр олох ID. |
| `FindAssetEscrowsBySeller` | Худалцуулагчдын бүртгэлтэй хөрөнгийн санхүүжилт. |
| `FindAssetEscrowsByBuyer` | Худалдан авагчдын хөрөнгө санхүүжүүлнэ. |
| `FindAssetEscrowsByStatus` | Ашигт малтмалын хадгаламжны жагсаалт. |
| `FindAnonymousAssetEscrows` | Ашигт малтмалын санхүүжилтийн нууц бичгийг жагсаарай. |
| `FindAnonymousAssetEscrowById` | Нэг нэргүй хөрөнгийн хяналтын төлөөлөгчийг олох ID. |
| `FindAnonymousAssetEscrowsBySeller` | Худалцуулагч бүртгэлтэй нууцлагуудыг жагсаал. |
| `FindAnonymousAssetEscrowsByBuyer` | Худалдан авагчдаа нэргүй захиалгыг жагсаарай. |
| `FindAnonymousAssetEscrowsByStatus` | Аноним бус халамжлагчдыг статусын дагуу жагсаарай. |
| `FindProofRecordById` | Нэг баталгааны баримтыг олох ID. |
| `FindProofRecords` | Дашрамдсан баримтыг жагсаарай. |
| `FindProofRecordsByBackend` | Дашрамдсан хяналтын хэсгүүдийн жагсаалт. |
| `FindProofRecordsByStatus` | Дашрамдсан баримтыг статусын дагуу жагсаарай. |

## Nexus, Мэдээллийн хүртээмж, багц {#nexus-data-availability-and-packages}

| Судалгаа | Зорилго |
| --- | --- |
| `FindRepoAgreements` | Захиргааны зах зээлд хадгалуулсан хадгаламжийн гэрээг жагсаалт. |
| `FindTwitterBindingByHash` | Twitter-ийн холболт хэшигээр шийднэ. |
| `FindDaPinIntentByTicket` | Мэдээллийн нөөцтэй нэгийг тавитын дагуу олох. |
| `FindDaPinIntentByManifest` | Дашрамд дурдлахад нэгийг олох хэрэгтэй. |
| `FindDaPinIntentByAlias` | Нөхөр тэмдэгтээр нэгийг олох. |
| `FindDaPinIntentByLaneEpochSequence` | Замын, цаг үеийн болон дараалалт дуудлагаг олох. |
| `FindLaneRelayEnvelopeByRef` | Замын дугаарын хяналт шалгалтын хуудас хайж үзээрэй. |
| `FindSorafsProviderOwner` | Хөдөлмөрийн хэрэгслийн эзэн SoraFS нийлүүлэгч. |
| `FindDataspaceNameOwnerById` | Мэдээллийн орон тооны нэр эзэмшигчг шийднэ. |
| `FindMusubiReleaseByRef` | Хэлэлцүүлэг Musubi Урьдчилгаагаар гаргах. |
| `FindMusubiPackageVersions` | A-ийн жагсаалтын хувилбар Musubi багц. |
| `FindMusubiPackageReleases` | Нүүр хуудас Musubi багц. |
| `FindMusubiShortAliasByName` | A-г шийдвэрлэх Musubi Хурд нэртэй. |

## Тэгжер, гэрээ, гүйлгээ, блок {#triggers-contracts-transactions-and-blocks}

| Судалгаа | Зорилго |
| --- | --- |
| `FindActiveTriggerIds` | Ажилтай тугвагч жагсаалт IDs. |
| `FindTriggers` | Тодруулбал. |
| `FindTriggerById` | Нэг галт тэрэг олох ID. |
| `FindContractManifestByCodeHash` | Ухаалаг гэрээний манфист код хэшээр олох. |
| `FindTransactions` | Зохиогдох гүйлгээний жагсаалт. |
| `FindBlocks` | Тодрууллын блок. |
| `FindBlockHeaders` | Блокийн толгойг жагсаарай. |

## Хэвтрүүлэг болон хуудас бичлэг {#filtering-and-pagination}

Үргэлждэг асуултууд нь predicate болон selector дэмжлэгийг илрүүлж болно.
Уул уурхайн SDK тул фильтрний өгөгдэл асуултын өгөгдлийн төрөлтэй тохиож байна.
Томоохон үр дүнгийн багцын хувьд орчим нь курсор, хязгаар гэх мэт хайлтын параметр ашиглах
Нэг дор бүх шугамыг авна.
