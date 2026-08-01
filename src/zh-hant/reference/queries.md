---
translation_locale: zh-hant
translation_source: /reference/queries.md
translation_source_hash: 22e8a75acd72d066e3516ba46a0afe075d2d02790154458aec00a5d8bb861838
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 查詢 {#queries}

Iroha 查詢可讀取分類帳狀態而不加以變更。目前的資料模型公開兩種主要查詢形式：

- **單一查詢**：傳回一個物件或單一值
- **可迭代查詢**：傳回資料流或集合；若查詢型別支援，還可搭配篩選、排序、投影及分頁

請使用 SDK 的強型別建構器或 CLI，不要手動組裝查詢封套。下列名稱是 `iroha_data_model::query` 目前公開的查詢型別。

## 執行階段與組態 {#runtime-and-configuration}

| 查詢 | 用途 |
| --- | --- |
| `FindAbiVersion` | 傳回執行器 ABI 版本。 |
| `FindExecutorDataModel` | 傳回執行器的資料模型描述。 |
| `FindParameters` | 傳回鏈上執行器組態參數。 |

## 帳戶與權限 {#accounts-and-permissions}

| 查詢 | 用途 |
| --- | --- |
| `FindAccountById` | 依規範帳戶 ID（不含網域）尋找單一帳戶。 |
| `FindAccountByAlias` | 將帳戶別名解析為帳戶。 |
| `FindAccounts` | 列出已註冊帳戶。 |
| `FindAccountIds` | 列出已註冊帳戶 IDs。 |
| `FindAccountsWithAsset` | 列出持有指定資產定義之資產的帳戶。 |
| `FindAliasesByAccountId` | 列出綁定至帳戶的別名。 |
| `FindAccountRecoveryPolicyByAlias` | 尋找某別名的復原政策。 |
| `FindAccountRecoveryRequestByAlias` | 尋找某別名的復原請求。 |
| `FindRoles` | 列出角色。 |
| `FindRoleIds` | 列出角色 IDs。 |
| `FindRolesByAccountId` | 列出授予某帳戶的角色。 |
| `FindPermissionsByAccountId` | 列出授予某帳戶的權限。 |

## 網域與對等節點 {#domains-and-peers}

| 查詢 | 用途 |
| --- | --- |
| `FindDomainById` | 依 `DomainId` 尋找單一網域。 |
| `FindDomains` | 列出已註冊網域。 |
| `FindDomainsByAccountId` | 列出某帳戶擁有的網域。 |
| `FindDomainEndorsements` | 列出網域背書記錄。 |
| `FindDomainEndorsementPolicy` | 傳回網域背書政策。 |
| `FindDomainCommittee` | 傳回網域委員會。 |
| `FindPeers` | 列出分類帳已知的可信任對等節點。 |

## 資產、NFTs 與 RWAs {#assets-nfts-and-rwas}

| 查詢 | 用途 |
| --- | --- |
| `FindAssets` | 列出資產餘額。 |
| `FindAssetsDefinitions` | 列出資產定義。 |
| `FindAssetsByAccountId` | 列出某帳戶持有的資產。 |
| `FindAssetById` | 依 `AssetId` 尋找單一資產餘額。 |
| `FindAssetDefinitionById` | 依 ID 尋找單一資產定義。 |
| `FindNfts` | 列出 NFTs。 |
| `FindNftsByAccountId` | 列出某帳戶擁有的 NFTs。 |
| `FindRwas` | 列出已註冊的實體資產批次。 |

## 託管與證明記錄 {#escrow-and-proof-records}

託管查詢會檢查[原生資產託管 ISIs](/zh-hant/blockchain/escrow.md)所建立的記錄，包括市集託管、通用資產鎖定及匿名託管記錄。

| 查詢 | 用途 |
| --- | --- |
| `FindAssetEscrows` | 列出資產託管記錄。 |
| `FindAssetEscrowById` | 依 ID 尋找單一資產託管。 |
| `FindAssetEscrowsBySeller` | 依賣方列出資產託管。 |
| `FindAssetEscrowsByBuyer` | 依買方列出資產託管。 |
| `FindAssetEscrowsByStatus` | 依狀態列出資產託管。 |
| `FindAnonymousAssetEscrows` | 列出匿名資產託管記錄。 |
| `FindAnonymousAssetEscrowById` | 依 ID 尋找單一匿名資產託管。 |
| `FindAnonymousAssetEscrowsBySeller` | 依賣方列出匿名託管。 |
| `FindAnonymousAssetEscrowsByBuyer` | 依買方列出匿名託管。 |
| `FindAnonymousAssetEscrowsByStatus` | 依狀態列出匿名託管。 |
| `FindProofRecordById` | 依 ID 尋找單一證明記錄。 |
| `FindProofRecords` | 列出證明記錄。 |
| `FindProofRecordsByBackend` | 列出某證明後端的證明記錄。 |
| `FindProofRecordsByStatus` | 依狀態列出證明記錄。 |

## Nexus、資料可用性與套件 {#nexus-data-availability-and-packages}

| 查詢 | 用途 |
| --- | --- |
| `FindRepoAgreements` | 列出儲存在鏈上的儲存庫協議。 |
| `FindTwitterBindingByHash` | 依雜湊解析 Twitter 綁定。 |
| `FindDaPinIntentByTicket` | 依票證尋找資料可用性釘選意圖。 |
| `FindDaPinIntentByManifest` | 依資訊清單參照尋找釘選意圖。 |
| `FindDaPinIntentByAlias` | 依別名尋找釘選意圖。 |
| `FindDaPinIntentByLaneEpochSequence` | 依通道、時期及序號尋找釘選意圖。 |
| `FindLaneRelayEnvelopeByRef` | 尋找已驗證的通道轉送封套。 |
| `FindSorafsProviderOwner` | 解析 SoraFS 提供者的擁有者。 |
| `FindDataspaceNameOwnerById` | 解析資料空間名稱的擁有者。 |
| `FindMusubiReleaseByRef` | 依參照尋找 Musubi 發行版本。 |
| `FindMusubiPackageVersions` | 列出 Musubi 套件的版本。 |
| `FindMusubiPackageReleases` | 列出 Musubi 套件的發行版本。 |
| `FindMusubiShortAliasByName` | 解析 Musubi 短別名。 |

## 觸發器、合約、交易與區塊 {#triggers-contracts-transactions-and-blocks}

| 查詢 | 用途 |
| --- | --- |
| `FindActiveTriggerIds` | 列出作用中的觸發器 IDs。 |
| `FindTriggers` | 列出觸發器。 |
| `FindTriggerById` | 依 ID 尋找單一觸發器。 |
| `FindContractManifestByCodeHash` | 依程式碼雜湊尋找智慧合約資訊清單。 |
| `FindTransactions` | 列出已完成共識提交的交易。 |
| `FindBlocks` | 列出區塊。 |
| `FindBlockHeaders` | 列出區塊標頭。 |

## 篩選與分頁 {#filtering-and-pagination}

可迭代查詢可提供述詞與選取器支援。請使用 SDK 中各查詢專用的強型別篩選器，確保篩選輸入符合查詢輸出型別。結果集很大時，請使用游標與上限等查詢參數，不要一次擷取所有資料列。
