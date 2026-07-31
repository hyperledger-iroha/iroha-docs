---
translation_locale: ka
translation_source: /reference/queries.md
translation_source_hash: 22e8a75acd72d066e3516ba46a0afe075d2d02790154458aec00a5d8bb861838
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# კითხვები {#queries}

Iroha შეკითხვები კითხულობს მთავარ გრაფის მდგომარეობას, მისი მუტაციის გარეშე. მიმდინარე მონაცემთა მოდელი გამოხატავს ორი ფართო შეკითხვის ფორმებს:

- ცალკეული გამოკითხვები, რომლებიც უბრუნებენ ერთ ობიექტს ან ერთ ღირებულებას
- iterable queries, რომელიც ბრუნდება ნაკადი ან კოლექცია და შეიძლება გაერთიანდეს ფილტრირება, sorteering, პროექტირება, და pagination სადაც მოთხოვნის ტიპი მხარს უჭერს მას

გამოიყენეთ SDK ტიპირებული კონსტრუქტორები ან CLI, იმის ნაცვლად, რომ შექმნათ შეკითხვის კონვერტები ხელით. ქვემოთ მოცემული სახელები არის მიმდინარე შეკითხვების ტიპები, რომლებიც გამოქვეყნებულია `iroha_data_model::query`.

## გაშვების დრო და კონფიგურაცია {#runtime-and-configuration}

|კითხვა |მიზანი |
| --- | --- |
|`FindAbiVersion` |დააბრუნეთ ABI ვერსია. |
|`FindExecutorDataModel` |დააბრუნეთ აღმასრულებელი მონაცემთა მოდელი აღწერა. |
|`FindParameters` |Return on-chain აღმასრულებელი კონფიგურაციის პარამეტრები. |

## ანგარიშები და ნებართვები {#accounts-and-permissions}

|კითხვა |მიზანი |
| --- | --- |
|`FindAccountById` |იპოვეთ ერთი ანგარიში კანონიკური ანგარიშის მიხედვით ID. |
|`FindAccountByAlias` |ვ ოპაგთმ ოფაჲ ჱა ვ ოჲეაპაჲ.|
|`FindAccounts` |აღწერეთ რეგისტრირებული ანგარიშები. |
|`FindAccountIds` |რეგისტრირებული ანგარიში IDs. |
|`FindAccountsWithAsset` |ჩამოთვალეთ ანგარიშები, რომლებსაც აქვთ მოცემული აქტივების განსაზღვრა. |
|`FindAliasesByAccountId` |შეაწერეთ ანალოგიური საიდუმლოები ანგარიშზე. |
|`FindAccountRecoveryPolicyByAlias` |ნაპაგთნარა პჲლსიკა ჱა ვჟრთნა. |
|`FindAccountRecoveryRequestByAlias` |ნაპაგთნარა თალაკა ჱა ოპვჟრთნა. |
|`FindRoles` |როლების სია. |
|`FindRoleIds` |სიაში როლი IDs. |
|`FindRolesByAccountId` |ანგარიშისათვის მინიჭებული როლების ჩამონათვალი |
|`FindPermissionsByAccountId` |ჩამოთვალეთ ანგარიშზე მინიჭებული ნებართვები. |

## დომენები და თანატოლები {#domains-and-peers}

|კითხვა |მიზანი |
| --- | --- |
|`FindDomainById` |მოძებნეთ ერთი დომენი `DomainId`. |
|`FindDomains` |რეგისტრირებული დომენების ჩამონათვალი. |
|`FindDomainsByAccountId` |ჩამოთვალეთ დომენები, რომლებიც ეკუთვნის ანგარიშს. |
|`FindDomainEndorsements` |დომენის დამტკიცების ჩანაწერები. |
|`FindDomainEndorsementPolicy` |ჲბყპნა პჲლიკა ჱა დომეინთა ოჲვრთნა. |
|`FindDomainCommittee` |ოჲეჲბყპნა დომენთჟა. |
|`FindPeers` |სცენარში ცნობილ სანდო თანატოლებს. |

## აქტივები, NFTs და RWAs {#assets-nfts-and-rwas}

|კითხვა |მიზანი |
| --- | --- |
|`FindAssets` |დასახელება აქტივების სალანსები. |
|`FindAssetsDefinitions` |განსაზღვრული აქტივების ჩამონათვალი. |
|`FindAssetsByAccountId` |ანგარიშზე არსებული აქტივების ჩამონათვალი. |
|`FindAssetById` |მოძებნეთ ერთი აქტივის ბალანსი `AssetId`. |
|`FindAssetDefinitionById` |იპოვეთ ერთი აქტივის განსაზღვრა ID. |
|`FindNfts` |სია NFTs. |
|`FindNftsByAccountId` |სია NFTs, რომელიც ანგარიშის საკუთრებაშია. |
|`FindRwas` |ნუსხა დარეგისტრირებული რეალური სამყაროს აქტივების ნაკვეთები. |

## საფინანსო და მტკიცებულების დოკუმენტები {#escrow-and-proof-records}

საფინანსო ანაზღაურების გამოკითხვები შეამოწმებს [ბინადური აქტივების დაფარვის მიერ შექმნილ ჩანაწერებს ISIs](/ka/blockchain/escrow.md), მათ შორის ბაზრის დაფარვას, ზოგადი აქტივების საკეტებს და ანონიმურ დაფარვებთან დაკავშირებულ ჩანაწერს.

|კითხვა |მიზანი |
| --- | --- |
|`FindAssetEscrows` |დაწერთ აქტივების საფინანსო ანგარიშები. |
|`FindAssetEscrowById` |მოძებნეთ ერთი აქტივი ID. |
|`FindAssetEscrowsBySeller` |ჩამოთვალეთ აქტივების დაფარვა გამყიდველის მიხედვით. |
|`FindAssetEscrowsByBuyer` |მყიდველის მიერ დაფარული აქტივების ჩამონათვალი. |
|`FindAssetEscrowsByStatus` |ჩამოთვალეთ აქტივების აღრიცხვა სტატუსის მიხედვით. |
|`FindAnonymousAssetEscrows` |ნაოპაგთ ანონიმური ქონების საფინანსო ანგარიშები. |
|`FindAnonymousAssetEscrowById` |იპოვნეთ ერთი ანონიმური აქტივის საფარდებელი ID. |
|`FindAnonymousAssetEscrowsBySeller` |დაწვრილებით ანონიმური საფარდოები გამყიდველის მიხედვით. |
|`FindAnonymousAssetEscrowsByBuyer` |დაწერთ ანონიმურ საფარდებს მყიდველის მიხედვით. |
|`FindAnonymousAssetEscrowsByStatus` |დასახელება ანონიმური სალაროების სტატუსის მიხედვით. |
|`FindProofRecordById` |იპოვეთ ერთი მტკიცებულება ID. |
|`FindProofRecords` |ნაოპაგთ დოკუმენტები. |
|`FindProofRecordsByBackend` |ჩამოთვალეთ მტკიცებულების ჩანაწერები მტკიცებულებების უკანასკნელი |
|`FindProofRecordsByStatus` |ჩამოთვალეთ მტკიცებულებების ჩანაწერები სტატუსის მიხედვით. |

## Nexus, მონაცემთა ხელმისაწვდომობა და პაკეტები {#nexus-data-availability-and-packages}

|კითხვა |მიზანი |
| --- | --- |
|`FindRepoAgreements` |ჩამოთვალეთ ქსელზე შენახული რეპოზიტორების ხელშეკრულებები. |
|`FindTwitterBindingByHash` |ტვიტერის ბინდირების გადაჭრა ჰეშით. |
|`FindDaPinIntentByTicket` |ეძიეთ მონაცემთა ხელმისაწვდომობის პინი ბილეთის მიხედვით. |
|`FindDaPinIntentByManifest` |იპოვნეთ pin განზრახვა მანიფესტ რეფერენცია. |
|`FindDaPinIntentByAlias` |ნაპაგრაჟა ეა ჟვ ოპვკაგაქ.|
|`FindDaPinIntentByLaneEpochSequence` |იპოვნეთ კვანძის განზრახვა ზოლი, ეპოქა და თანმიმდევრულობა. |
|`FindLaneRelayEnvelopeByRef` |ნაოპაგთ ოჲჟლვევნა ოპვრთნარაჲ. |
|`FindSorafsProviderOwner` |SoraFS მომწოდებლის მფლობელის განსაზღვრა. |
|`FindDataspaceNameOwnerById` |აღმოფხვრა მონაცემთა სივრცის სახელების მფლობელი. |
|`FindMusubiReleaseByRef` |იპოვეთ Musubi განთავისუფლება რეფერენციით. |
|`FindMusubiPackageVersions` |ჩამოთვლილი ვერსიები Musubi პაკეტისათვის. |
|`FindMusubiPackageReleases` |Musubi პაკეტის ჩამონათვალის გამოშვებები. |
|`FindMusubiShortAliasByName` |გადაწყვიტეთ Musubi მოკლე alias. |

## ტრიგერები, ხელშეკრულებები, ოპერაციები და ბლოკები {#triggers-contracts-transactions-and-blocks}

|კითხვა |მიზანი |
| --- | --- |
|`FindActiveTriggerIds` |ჩამოთვალეთ აქტიური გამომწვევი IDs. |
|`FindTriggers` |სია მაშველებს. |
|`FindTriggerById` |იპოვნეთ ერთი გამშვებიანი ID. |
|`FindContractManifestByCodeHash` |იპოვნეთ ჭკვიანი ხელშეკრულების მანიფესტ კოდი ჰაშით. |
|`FindTransactions` |განკუთვნილი ოპერაციების ჩამონათვალი. |
|`FindBlocks` |ბლოკების ჩამონათვალი.|
|`FindBlockHeaders` |ბლოგის სათაურების ჩამონათვალი.|

## ფილტრირება და გვერდების გაფორმება {#filtering-and-pagination}

Iterable შეკითხვები შეიძლება გამოავლინოს პრედიკატისა და სელექტორის მხარდაჭერა. გამოიყენეთ შეკითხვის სპეციფიკური ტიპირებული ფილტრები SDK ისე, რომ ფილტრის შესავალი შეესაბამება შეკითხვის საგამოშვო ტიპს. დიდი შედეგების ნაკრებისთვის, გამოიყენეთ შეტყობინების პარამეტრები, როგორიცაა კურსორი და ლიმიტი ნაცვლად თითოეული რიგის ერთდროულად მოპოვების.
