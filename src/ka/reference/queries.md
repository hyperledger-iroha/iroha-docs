---
translation_locale: ka
translation_source: /reference/queries.md
translation_source_hash: 22e8a75acd72d066e3516ba46a0afe075d2d02790154458aec00a5d8bb861838
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# კითხვები {#queries}

Iroha კითხვები წაიკითხა ლეიჯერის მდგომარეობა, მისი მუტაციის გარეშე. მიმდინარე მონაცემთა მოდელი
გამოყოფს ორი ფართო შეკითხვის ფორმას:

- **ცალკეული კითხვები**, რომელიც უბრუნებს ერთ ობიექტს ან ერთ ღირებულებას
- **განმეორებადი გამოკითხვები**, რომელიც ბრუნავს ნაკადს ან კოლექციას და შეიძლება გაერთიანდეს
  საფილტრაციო, სორტირების, პროექციის და გვერდების გათვალისწინებით, სადაც გამოკითხვის ტიპი
  მხარს უჭერს

გამოყენება SDK ტიპირებული მშენებლები ან CLI იმის ნაცვლად, რომ შეკითხვების კონვერტების შექმნა
ქვემოთ მოცემული სახელები არის მიმდინარე შეკითხვების ტიპები, რომლებიც გამოქვეყნებულია
`iroha_data_model::query`.

## გაშვების დრო და კონფიგურაცია {#runtime-and-configuration}

| კითხვები | მიზანი |
| --- | --- |
| `FindAbiVersion` | დააბრუნეთ დამსჯელი. ABI ვერსია. |
| `FindExecutorDataModel` | დააბრუნეთ აღმასრულებელი მონაცემების მოდელი. |
| `FindParameters` | დაბრუნება ჯაჭვზე აღმასრულებელი კონფიგურაციის პარამეტრები. |

## ანგარიშები და ნებართვები {#accounts-and-permissions}

| კითხვები | მიზანი |
| --- | --- |
| `FindAccountById` | იპოვეთ ერთი ანგარიში კანონიკური ანგარიშის მიხედვით ID. |
| `FindAccountByAlias` | ჟჲბჲპთნწ კაპიტალს, აჱ კაპიტალი. |
| `FindAccounts` | დარეგისტრირებული ანგარიშები. |
| `FindAccountIds` | რეგისტრირებული ანგარიში IDs. |
| `FindAccountsWithAsset` | ჩამოთვალეთ ანგარიშები, რომელშიც მოცემული აქტივის განსაზღვრაა. |
| `FindAliasesByAccountId` | დააკავა ბმული. |
| `FindAccountRecoveryPolicyByAlias` | ნაპაგვ პჲლთჟკა ჱა ოპვრთნარა. |
| `FindAccountRecoveryRequestByAlias` | ნაპაგვ ეა ჟვ ოპაგთმ ჟჲდრა ჱა ნვდჲ. |
| `FindRoles` | როლების ჩამონათვალი. |
| `FindRoleIds` | სია როლი IDs. |
| `FindRolesByAccountId` | ანგარიშზე მინიჭებული როლების ჩამონათვალი. |
| `FindPermissionsByAccountId` | ჩამოთვალეთ ანგარიშზე მინიჭებული ნებართვები. |

## დომენები და თანატოლები {#domains-and-peers}

| კითხვები | მიზანი |
| --- | --- |
| `FindDomainById` | მოძებნეთ ერთი დომენი `DomainId`. |
| `FindDomains` | დარეგისტრირებული დომენები. |
| `FindDomainsByAccountId` | ჩამოთვალეთ დომენები, რომლებიც ანგარიშის საკუთრებაშია. |
| `FindDomainEndorsements` | დომენის დამტკიცების ჩანაწერები ჩამოთვალეთ. |
| `FindDomainEndorsementPolicy` | ჲბყპნა პჲლთკა ჱა დომეინარა. |
| `FindDomainCommittee` | ჲბჲმნა ჟლვევარა ნა დომენთ. |
| `FindPeers` | დასახელება საიმედო თანატოლები, რომლებიც ცნობილია წიგნში. |

## ქონება, NFTs, და RWAs {#assets-nfts-and-rwas}

| კითხვები | მიზანი |
| --- | --- |
| `FindAssets` | შეაწერეთ აქტივების სალანსები. |
| `FindAssetsDefinitions` | ჩამოთვალეთ აქტივების განსაზღვრები. |
| `FindAssetsByAccountId` | ანგარიშზე არსებული აქტივების ჩამონათვალი. |
| `FindAssetById` | მოძებნეთ ერთი აქტივის ბალანსი `AssetId`. |
| `FindAssetDefinitionById` | მოძებნეთ ერთი აქტივის განსაზღვრა ID. |
| `FindNfts` | სია NFTs. |
| `FindNftsByAccountId` | სია NFTs ანგარიშის მფლობელი. |
| `FindRwas` | სია რეგისტრირებული რეალური სამყაროს აქტივების ნაკვეთები. |

## დაფარვის და დასამტკიცებელი დოკუმენტები {#escrow-and-proof-records}

Escrow შეკითხვები შემოწმება ჩანაწერები შექმნილია
[ნაციონალური აქტივების საფინანსო დაფარვა ISIs](/ka/blockchain/escrow.md), მათ შორის ბაზარზე
საფინანსო დავალებები, გენერული აქტივების ჩაკეტვა და ანონიმური ანგარიშები.

| კითხვები | მიზანი |
| --- | --- |
| `FindAssetEscrows` | ჟრანთმჲპვნარაჲ გპვმვ ჱა მფაწრა. |
| `FindAssetEscrowById` | იპოვნეთ ერთი აქტივის საფინანსო ფასი ID. |
| `FindAssetEscrowsBySeller` | ჩამოთვალეთ აქტივების დაფარვა გამყიდველის მიხედვით. |
| `FindAssetEscrowsByBuyer` | ჩამოთვალეთ აქტივები მყიდველის მიერ დაფარული. |
| `FindAssetEscrowsByStatus` | ჩამოთვალეთ აქტივების საფინანსო ანგარიშები სტატუსის მიხედვით. |
| `FindAnonymousAssetEscrows` | ნაოპაგთ ანონიმური ქონების საფინანსო ანგარიშები. |
| `FindAnonymousAssetEscrowById` | იპოვნეთ ერთი ანონიმური აქტივის საფარდებელი ID. |
| `FindAnonymousAssetEscrowsBySeller` | ანონიმური საფარდების ჩამონათვალი გამყიდველის მიხედვით. |
| `FindAnonymousAssetEscrowsByBuyer` | ანონიმური საფარდების ჩამონათვალი მყიდველის მიხედვით. |
| `FindAnonymousAssetEscrowsByStatus` | ანონიმური საფარდების ჩამონათვალი სტატუსის მიხედვით. |
| `FindProofRecordById` | მოძებნეთ ერთი მტკიცებულების ჩანაწერი ID. |
| `FindProofRecords` | ნაოპაგთ დოკუმენტები. |
| `FindProofRecordsByBackend` | დაწვრილებით აღწერეთ მტკიცებულების მონაცემები. |
| `FindProofRecordsByStatus` | შეაწერეთ მტკიცებულების ჩანაწერები სტატუსის მიხედვით. |

## Nexus, მონაცემების ხელმისაწვდომობა და პაკეტები {#nexus-data-availability-and-packages}

| კითხვები | მიზანი |
| --- | --- |
| `FindRepoAgreements` | ჩამოთვალეთ ქსელზე შენახული სათავსო შეთანხმებები. |
| `FindTwitterBindingByHash` | გადაწყვიტეთ Twitter-ის ბინდირება ჰეშით. |
| `FindDaPinIntentByTicket` | ნაპაგთნარა ჟაჟრაჲ ჱა ეჲბპჲჟრგჲრწნთრვ პინ. |
| `FindDaPinIntentByManifest` | ნაპაგთნარა ნეტგაჲ ჱა მფაეთრწნთკა. |
| `FindDaPinIntentByAlias` | ნაპაგთ ჟრაჟკა ჱა ოფა. |
| `FindDaPinIntentByLaneEpochSequence` | ნაპაგწრა ჟრანთ, ეპოქა და რგოლა. |
| `FindLaneRelayEnvelopeByRef` | ნაპაგთნარა ჟრანთწრაჟკა გჟთფკჲ. |
| `FindSorafsProviderOwner` | გადაწყვიტეთ მფლობელის SoraFS მომწოდებელი. |
| `FindDataspaceNameOwnerById` | გადაწყვიტეთ მონაცემთა სივრცის სახელების მფლობელი. |
| `FindMusubiReleaseByRef` | იპოვეთ Musubi რეფერენციით გათავისუფლება. |
| `FindMusubiPackageVersions` | ჩამონათვალი ვერსიები Musubi პაკეტი. |
| `FindMusubiPackageReleases` | სიაზე გამოშვება Musubi პაკეტი. |
| `FindMusubiShortAliasByName` | გადაწყვიტეთ a Musubi მოკლე საიდუმლოები. |

## გაჩერებები, ხელშეკრულებები, ტრანზაქციები და ბლოკები {#triggers-contracts-transactions-and-blocks}

| კითხვები | მიზანი |
| --- | --- |
| `FindActiveTriggerIds` | აქტიური გამშვები ჩამონათვალი IDs. |
| `FindTriggers` | რგოლა ჟრანთჟკა. |
| `FindTriggerById` | პოვნეთ ერთი გამშვები ID. |
| `FindContractManifestByCodeHash` | ნაპაგეთ ჟრანთფაჟჲ გპვმვ ჱა კჲდ-ჰაჟ. |
| `FindTransactions` | დადებული ოპერაციების ჩამონათვალი. |
| `FindBlocks` | ბჲქრთნარა. |
| `FindBlockHeaders` | ბლოგის სათაურების ჩამოთვლა. |

## ფილტრირება და გვერდების გაფორმება {#filtering-and-pagination}

Iterable შეკითხვები შეიძლება გამოავლინოს predicate და სელექტორის მხარდაჭერა. გამოიყენეთ შეკითხვის სპეციფიკური
დასახელებული ფილტრები SDK ასე რომ ფილტრის შეღება ემთხვევა გამოშვების ტიპს.
დიდი შედეგების კომპლექტებისთვის, გამოიყენეთ შეკითხვის პარამეტრები, როგორიცაა კურსორი და ლიმიტი
ყველა რიგის ერთდროულად მოპოვება.
