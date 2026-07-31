---
translation_locale: zh-hant
translation_source: /reference/queries.md
translation_source_hash: 22e8a75acd72d066e3516ba46a0afe075d2d02790154458aec00a5d8bb861838
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 詢問問題 {#queries}

Iroha 目前的數據模型
顯示了兩個廣泛的查詢形式:

- **單位查詢**, 返回一個對象或一個值
- **可反復查詢**, 還回來流量或收藏量,
  在查詢類型的濾網,分類,投影和頁面化
  支持它

使用 SDK 打字的建築師或 CLI 而不是建立查詢封筒,
下面的名稱是目前被曝光的查詢類型
`iroha_data_model::query`.

## 運行時間和配置 {#runtime-and-configuration}

| 詢問問題 | 目的 |
| --- | --- |
| `FindAbiVersion` | 請將執行人返回 ABI 這種版本. |
| `FindExecutorDataModel` | 返回執行者數據模型描述. |
| `FindParameters` | 返回連鎖執行器配置參數. |

## 帳戶及許可證 {#accounts-and-permissions}

| 詢問問題 | 目的 |
| --- | --- |
| `FindAccountById` | 尋找每個聖經記錄的一個帳號 ID. |
| `FindAccountByAlias` | 解決一個帳戶的密碼. |
| `FindAccounts` | 列出已註冊的帳戶. |
| `FindAccountIds` | 列表已註冊的帳戶 IDs. |
| `FindAccountsWithAsset` | 列出包含特定資產定義的帳戶. |
| `FindAliasesByAccountId` | 列出與帳戶相關的密碼. |
| `FindAccountRecoveryPolicyByAlias` | 找一個假名的恢復政策. |
| `FindAccountRecoveryRequestByAlias` | 找一個名稱的回收要求. |
| `FindRoles` | 列出自己的角色. |
| `FindRoleIds` | 列表的角色 IDs. |
| `FindRolesByAccountId` | 列出一個帳戶所承諾的角色. |
| `FindPermissionsByAccountId` | 列出一個帳戶的授權. |

## 域名和同行 {#domains-and-peers}

| 詢問問題 | 目的 |
| --- | --- |
| `FindDomainById` | 找一個域名 `DomainId`. |
| `FindDomains` | 列出已註冊的域名. |
| `FindDomainsByAccountId` | 列出一個帳戶擁有的域名. |
| `FindDomainEndorsements` | 列出域名授權紀錄. |
| `FindDomainEndorsementPolicy` | 返回域名授權政策. |
| `FindDomainCommittee` | 返回這個領域的委員會. |
| `FindPeers` | 列出在帳簿中所知可信的同行. |

## 資產, NFTs, 及其他 RWAs {#assets-nfts-and-rwas}

| 詢問問題 | 目的 |
| --- | --- |
| `FindAssets` | 列出資產餘額. |
| `FindAssetsDefinitions` | 列出資產定義. |
| `FindAssetsByAccountId` | 列出一個帳戶持有的資產. |
| `FindAssetById` | 找到一個資產平衡 `AssetId`. |
| `FindAssetDefinitionById` | 找一個資產定義 ID. |
| `FindNfts` | 列表 NFTs. |
| `FindNftsByAccountId` | 列表 NFTs 擁有一個帳戶. |
| `FindRwas` | 列出了現實物資的數量. |

## 預約和證書 {#escrow-and-proof-records}

查看由:
[當地資產保證 ISIs](/zh-hant/blockchain/escrow.md), 包括市場
預約,通用資產鎖定和匿名預約紀錄.

| 詢問問題 | 目的 |
| --- | --- |
| `FindAssetEscrows` | 列出資產保證紀錄. |
| `FindAssetEscrowById` | 找一個資產保證人 ID. |
| `FindAssetEscrowsBySeller` | 按賣家列出資產保證. |
| `FindAssetEscrowsByBuyer` | 按購買者所承擔的資產. |
| `FindAssetEscrowsByStatus` | 按狀態列出資產保證. |
| `FindAnonymousAssetEscrows` | 列出匿名的資產保證記錄. |
| `FindAnonymousAssetEscrowById` | 找一個匿名的資產保證人 ID. |
| `FindAnonymousAssetEscrowsBySeller` | 按賣家列出匿名的保證券. |
| `FindAnonymousAssetEscrowsByBuyer` | 按購買者列出匿名保證人. |
| `FindAnonymousAssetEscrowsByStatus` | 按狀態列出匿名保證人. |
| `FindProofRecordById` | 找一個證據紀錄 ID. |
| `FindProofRecords` | 列出證據檔案. |
| `FindProofRecordsByBackend` | 列出證據檔案, |
| `FindProofRecordsByStatus` | 按狀態列出證據紀錄. |

## Nexus, 數據可用性及包裝 {#nexus-data-availability-and-packages}

| 詢問問題 | 目的 |
| --- | --- |
| `FindRepoAgreements` | 在連鎖上存儲的資料庫協議列表. |
| `FindTwitterBindingByHash` | 透過哈希來解決Twitter的連結. |
| `FindDaPinIntentByTicket` | 請按票查找資料可用性筆記本的意圖. |
| `FindDaPinIntentByManifest` | 透過顯示參考, |
| `FindDaPinIntentByAlias` | 找一個名稱的針點. |
| `FindDaPinIntentByLaneEpochSequence` | 按行徑,年代和序列找到針的目的. |
| `FindLaneRelayEnvelopeByRef` | 找一個證實的車道連接封筒. |
| `FindSorafsProviderOwner` | 解決一個所有者的問題 SoraFS 提供商. |
| `FindDataspaceNameOwnerById` | 解決一個資料空間名稱所有者. |
| `FindMusubiReleaseByRef` | 找一個 Musubi 通過參考發放. |
| `FindMusubiPackageVersions` | 列出一個版本 Musubi 包裝. |
| `FindMusubiPackageReleases` | 列表發表的 Musubi 包裝. |
| `FindMusubiShortAliasByName` | 解決一個問題 Musubi 簡稱的姓氏. |

## 引發因素,合同,交易及阻擋 {#triggers-contracts-transactions-and-blocks}

| 詢問問題 | 目的 |
| --- | --- |
| `FindActiveTriggerIds` | 列出活動開關 IDs. |
| `FindTriggers` | 列出這些引發因素. |
| `FindTriggerById` | 找到一個子 ID. |
| `FindContractManifestByCodeHash` | 請用密碼哈希找到智能合同宣言. |
| `FindTransactions` | 預約交易列表. |
| `FindBlocks` | 列表的區塊. |
| `FindBlockHeaders` | 列出區塊標題. |

## 濾網及頁面編輯 {#filtering-and-pagination}

使用查詢特定的訊息.
來自於 SDK 因此,濾網輸入與查詢輸出類型相匹配.
在大型結果集合中,使用查詢參數如導向和限制
這就是我們每一行都拿出來的方法.
