---
translation_locale: mn
translation_source: /reference/queries.md
translation_source_hash: 88dba1142d7b6a452a5f56d56640ceef47a52ca28e296d6d0ee5992b9005c3bb
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Асуултууд {#queries}

Iroha нь блокчэйн бүртгэлийн төлөвийг өөрчлөлтгүйгээр унших асуултуудыг гүйцэтгэдэг. Одоогийн өгөгдлийн загвар нь хоёр өргөн асуултын хэлбэрийг ил гаргаж байна:

- нэг объект эсвэл нэг утга буцаадаг ганц асуулт
- куертитаас урсгал эсвэл цуглуулгыг буцаадаг, мөн асуулгын төрөл үүнийг дэмждэг бол шүүх, эрэмбэлэх, проекц хийх, хуудсанд хуваах зэрэгтэй хослуулж болох давталтын асуултууд

Асуулгын өгөгдлийн савыг гараар бүтээхийн оронд SDK төрөлтэй баригч буюу CLI-г ашиглаарай. Доорх нэрс нь `iroha_data_model::query`-оор ил гаргасан одоогийн асуулгын төрлүүд юм.

## програм хангамжийн гүйцэтгэх орчин ба тохиргоо {#runtime-and-configuration}

|Асуулт|Зорилго|
| --- | --- |
| `FindAbiVersion` |Гүйцэтгэгч ABI хувилбарыг буцаа.|
| `FindExecutorDataModel` |Гүйцэтгэгчийн өгөгдлийн загварын тайлбарыг буцаа.|
| `FindParameters` |Гинжит сүлжээнд гүйцэтгэгчийн тохиргооны параметрүүдийг буцаана.|

## Данс болон Зөвшөөрлүүд {#accounts-and-permissions}

|Асуулт|Зорилго|
| --- | --- |
| `FindAccountById` |Нэг протокол-стандарт дансны ID-р нэг дансыг олоорой.|
| `FindAccountByAlias` |Дансны хаяг нэрийг дансанд холбох.|
| `FindAccounts` |Бүртгэлтэй дансуудыг жагсаа.|
| `FindAccountIds` |Бүртгэлтэй дансны ID-үүдийг жагсаана уу.|
| `FindAccountsWithAsset` |Өгөгдсөн хөрөнгийн тодорхойлолттой дансуудыг жагсаана уу.|
| `FindAliasesByAccountId` |Дансанд холбогдсон нэрийн орлуулагчуудыг жагсаа.|
| `FindAccountRecoveryPolicyByAlias` |Нэрийн хаягт сэргээх бодлогыг олж мэдээрэй.|
| `FindAccountRecoveryRequestByAlias` |Нэрийн хаягт сэргээх хүсэлтийг олоорой.|
| `FindRoles` |Үүргүүдийг жагсаах.|
| `FindRoleIds` |Үүргийн ID-үүдийг жагсаах.|
| `FindRolesByAccountId` |Дансанд олгосон үүргүүдийг жагсаах.|
| `FindPermissionsByAccountId` |Дансанд олгосон эрхийн жагсаалтыг харуулаарай.|

## Домайн ба сүлжээний хөршүүд {#domains-and-peers}

|Асуулт|Зорилго|
| --- | --- |
| `FindDomainById` | `DomainId` -аар нэг домайн олно уу.|
| `FindDomains` |Бүртгэлтэй домэйнуудыг жагсаах.|
| `FindDomainsByAccountId` |Нэг дансанд харъяалагддаг домэйнуудыг жагсаана уу.|
| `FindDomainEndorsements` |Домэйн баталгаажуулалтын бүртгэлийг жагсаах.|
| `FindDomainEndorsementPolicy` |Салбарын дэмжих бодлогыг буцаана уу.|
| `FindDomainCommittee` |Салбарын хороо руу буцаах.|
| `FindPeers` |Блокчэйн бүртгэлд мэдэгдсэн найдвартай сүлжээний хамтрагчдын жагсаалтыг гарга.|

## Активууд, NFTs, ба RWAs {#assets-nfts-and-rwas}

|Асуулт|Зорилго|
| --- | --- |
| `FindAssets` |Хөрөнгийн үлдэгдлийг жагсаах.|
| `FindAssetsDefinitions` |Хөрөнгийн тодорхойлолтыг жагсаах.|
| `FindAssetsByAccountId` |Дансанд хадгалагдаж буй хөрөнгийг жагсаа.|
| `FindAssetById` | `AssetId` дугаараар нэг хөрөнгийн үлдэгдлийг олно уу.|
| `FindAssetDefinitionById` |ID-аар нэг хөрөнгийн тодорхойлолтыг олно уу.|
| `FindNfts` |Жагсаалт NFTs.|
| `FindNftsByAccountId` |Нэг аккаунт эзэмшдэг NFTs жагсаалт.|
| `FindRwas` |Бүртгэгдсэн бодит хөрөнгийн багцыг жагсаа.|

## Эскроу ба Баталгаажуулалтын Баримт {#escrow-and-proof-records}

Эскроу асуултууд нь [үндэсний хөрөнгийн итгэмжлэл ISIs](/mn/blockchain/escrow.md)-аар бүтээгдсэн бүртгэлүүдийг шалгадаг бөгөөд үүнд зах зээлийн эскроу, ерөнхий хөрөнгийн түгжээ, нэргүй эскроу бүртгэлүүд орно.

|Асуулт|Зорилго|
| --- | --- |
| `FindAssetEscrows` |Хөрөнгийн итгэмжлэлийн бүртгэлийг жагсаах.|
| `FindAssetEscrowById` |Нэг хөрөнгийн эскроуг ID-ээр олно уу.|
| `FindAssetEscrowsBySeller` |Борлуулагчийн даатгуулсан хөрөнгийг жагсаах.|
| `FindAssetEscrowsByBuyer` |Худалдан авагчаар хөрөнгийн хадгаламжийг жагсаах.|
| `FindAssetEscrowsByStatus` |Хөрөнгө зуучлалын процессын статусын дагуу жагсаах.|
| `FindAnonymousAssetEscrows` |Нэргүй хөрөнгийн эскроу бүртгэлүүдийг жагсаах.|
| `FindAnonymousAssetEscrowById` |Нэгэн нэргүй хөрөнгийн эскроуг ID-ээр олно уу.|
| `FindAnonymousAssetEscrowsBySeller` |Нэргүй хадгаламжийн дансыг борлуулагчийн дагуу жагсаах.|
| `FindAnonymousAssetEscrowsByBuyer` |Худалдан авагчаар нэргүй эскроугаа жагсаа.|
| `FindAnonymousAssetEscrowsByStatus` |Нэргүй хадгаламжийн дансуудыг статусын дагуу жагсаана уу.|
| `FindProofRecordById` |Нэг баримтын бичлэгийг ID-аар олно уу.|
| `FindProofRecords` |Баримт нотлох бичгүүдийг жагсаа.|
| `FindProofRecordsByBackend` |Нотолгооны арын процессын нотолгооны бүртгэлийг жагсаана уу.|
| `FindProofRecordsByStatus` |Баримт бичгийн бүртгэлийг төлөвөөр жагсаана уу.|

## Nexus, Мэдээллийн бэлэн байдал, ба Сав баглаа боодлууд {#nexus-data-availability-and-packages}

|Асуулт|Зорилго|
| --- | --- |
| `FindRepoAgreements` |Дансанд хадгалагдсан агуулахын гэрээнүүдийг жагсаа.|
| `FindTwitterBindingByHash` |Криптографийн хэшээр Twitter-ийг холбохыг шийднэ үү.|
| `FindDaPinIntentByTicket` |Тасалбарын дагуу өгөгдөл бэлэн байх төлөвийн зоригоо ол.|
| `FindDaPinIntentByManifest` |Техникийн томьёоны лавлагаагаар пин зорилгыг олно уу.|
| `FindDaPinIntentByAlias` |Дэвсгэрийн зорилыг нэрийн хаягаар ол.|
| `FindDaPinIntentByLaneEpochSequence` |Гүйцэтгэх зам, үе ба дарааллаар пин зорилгыг ол.|
| `FindLaneRelayEnvelopeByRef` |Баталгаажсан эстафетийн өгөгдлийн агуулахыг олно уу.|
| `FindSorafsProviderOwner` |SoraFS үйлчилгээ үзүүлэгчийн эзэмшигчийг шийдвэрлэ.|
| `FindDataspaceNameOwnerById` |Өгөгдөл сангийн нэрийн эзэмшигчийг шийдээрэй.|
| `FindMusubiExactPackageV1` |Нэг тодорхой багцын бүртгэл ба түүний одоогийн шинэчлэлтүүдийг уншина уу.|
| `FindMusubiExactReleaseV1` |Нэг яг тодорхой нийтлэлийн агшныг уншина уу.|
| `FindMusubiProviderBundleAttestationV1` |Нэг үйлчилгээ үзүүлэгчийн архивын багц баталгааны мэдэгдлийг уншина уу.|
| `FindMusubiResolverIndexV1` |Төгс болсон шийдвэрлагчийн индексийг хуудсаар дамжуулах.|
| `FindMusubiVersionsV1` |Нэг багцад зориулсан хуудасны эцсийн хувилбарууд.|
| `FindMusubiMaintainersV1` |Хуудас хүлээн зөвшөөрөгдсөн удирдагчид болон хүлээгдэж буй урилгуудыг харуулна.|
| `FindMusubiArchiveLocationsV1` |Нэг архивын SoraFS байршлуудыг хуудас баталгаажуулсан.|
| `FindMusubiArchiveRetentionV1` |Хуудасны архив хадгалах тэмдэглэлүүд.|
| `FindMusubiAliasV1` |Дэлхийн алиасын одоогийн чиглэл ба засварыг уншина уу.|
| `FindMusubiAliasHistoryV1` |Дэлхийн алиасын өөрчлөгддөггүй дахин чиглүүлэх түүхийг хуудсанд үзэх.|
| `FindMusubiOrderedPrefixV1` |Нэг дараалсан бүтэц бүхий өмнөд хуудасны багцууд.|

## Триггерүүд, Гэрээнүүд, Гүйлгээ ба Блокууд {#triggers-contracts-transactions-and-blocks}

|Асуулт|Зорилго|
| --- | --- |
| `FindActiveTriggerIds` |Идэвхтэй триггерийн ID-үүдийг жагсаана уу.|
| `FindTriggers` |Шалгуур үзүүлэгчдийг жагсаах.|
| `FindTriggerById` |Нэг триггерыг ID-аар олох.|
| `FindContractManifestByCodeHash` |Кодын криптографийн хэшээр ухаалаг гэрээний техникийн гарын авлагыг олоорой.|
| `FindTransactions` |Төгсгөл болсон гүйлгээг жагсаах.|
| `FindBlocks` |Блокуудыг жагсаа.|
| `FindBlockHeaders` |Блокын гарчгуудыг жагсаана уу.|

## Шүүлтүүр ба Хуудаслах {#filtering-and-pagination}

Давтагдах боломжтой асуулгууд нь нөхцөл шалгагч ба сонгогч дэмжлэгийг илрүүлэх боломжтой. Асуулгын гаралттай нийцэхийн тулд SDK-аас асуулга тусгай төрөлтэй шүүлтүүрийг ашиглана уу. Том үр дүнгийн багцуудын хувьд бүх мөрийг нэг дор татаж авахын оронд курсор ба хязгаар зэрэг асуулгын параметрүүдийг ашиглаарай.
