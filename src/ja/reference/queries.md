---
translation_locale: ja
translation_source: /reference/queries.md
translation_source_hash: 88dba1142d7b6a452a5f56d56640ceef47a52ca28e296d6d0ee5992b9005c3bb
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 質問 {#queries}

Iroha 查询は,レジャー状態を変異せずに読みます.現在のデータモデルでは,2つの幅広い查询形が示されています:

- 1 つのオブジェクトまたは1 つの値を返却する単一のクエリ
- ストリームまたはコレクションを返して,クエリタイプがサポートしているときにフィルタリング,分類,投影,ページ化と組み合わせることができる.

SDK タイプされたビルダーまたは CLI を使用して,手動でクエリエンベルを構築する代わりに使用します.下記の名称は, `iroha_data_model::query` が暴露した現在のクエリタイプです.

## 実行時間と設定 {#runtime-and-configuration}

|疑問です|目的|
| --- | --- |
|`FindAbiVersion`|執行者 ABI バージョンを返します. |
|`FindExecutorDataModel`|実行者データモデル説明を返します. |
|`FindParameters`|チェーン上の実行器の設定パラメータを返します.|

## 口座と許可 {#accounts-and-permissions}

|疑問です|目的|
| --- | --- |
|`FindAccountById`|ID で 1 つのアカウントを見つけます. |
|`FindAccountByAlias`|アカウントの名前とアカウントを解決する. |
|`FindAccounts`|登録された口座をリストする|
|`FindAccountIds`|リスト登録口座 IDs. |
|`FindAccountsWithAsset`|特定の資産定義を持つアカウントをリストする. |
|`FindAliasesByAccountId`|アカウントにリンクされた偽名をリストする|
|`FindAccountRecoveryPolicyByAlias`|仮名の復旧方針を 見つけろ|
|`FindAccountRecoveryRequestByAlias`|偽名で復旧申請を検索する|
|`FindRoles`|リストの役割|
|`FindRoleIds`|リストの役割 IDs.|
|`FindRolesByAccountId`|口座に与えられた役割をリストする.|
|`FindPermissionsByAccountId`|アカウントに与えられた権限をリストする. |

## 域名と同類 {#domains-and-peers}

|疑問です|目的|
| --- | --- |
|`FindDomainById`|`DomainId` で 1 つのドメインを見つけます. |
|`FindDomains`|登録ドメインをリストする.|
|`FindDomainsByAccountId`|アカウントが所有しているドメインをリストする. |
|`FindDomainEndorsements`|ドメインの承認記録をリストする|
|`FindDomainEndorsementPolicy`|ドメインの承認方針を返します|
|`FindDomainCommittee`|域委員会に戻す|
|`FindPeers`|本簿に知られる信頼できる 同僚をリストする|

## NFTs,および RWAs の資産 {#assets-nfts-and-rwas}

|疑問です|目的|
| --- | --- |
|`FindAssets`|資産の余分をリストする|
|`FindAssetsDefinitions`|資産の定義をリストする.|
|`FindAssetsByAccountId`|口座の保有資産をリストする. |
|`FindAssetById`|`AssetId`で1つの資産バランスを探す. |
|`FindAssetDefinitionById`|ID で資産定義を1つ探す. |
|`FindNfts`|リスト NFTs. |
|`FindNftsByAccountId`|口座所有者リスト NFTs. |
|`FindRwas`|登録された実業資産をリストする|

## エスクロー及び証明記録 {#escrow-and-proof-records}

[native asset escrow ISIs](/ja/blockchain/escrow.md)によって作成された記録を調査する.市場escrow,ジェネリックアセットロック,および匿名 escrowレコードを含む.

|疑問です|目的|
| --- | --- |
|`FindAssetEscrows`|資産のエスクロー記録をリストする|
|`FindAssetEscrowById`|ID までに資産のエスクローを1つ探す.|
|`FindAssetEscrowsBySeller`|売り手による資産のキャストをリストする.|
|`FindAssetEscrowsByBuyer`|購入者による資産のキャストをリストする.|
|`FindAssetEscrowsByStatus`|状態によって資産のエスクローをリストする. |
|`FindAnonymousAssetEscrows`|匿名の資産の保管記録をリストする|
|`FindAnonymousAssetEscrowById`|ID で匿名の資産の保証人を見つけます.|
|`FindAnonymousAssetEscrowsBySeller`|売り手によって匿名キャストをリストする.|
|`FindAnonymousAssetEscrowsByBuyer`|購入者によって匿名キャストをリストする.|
|`FindAnonymousAssetEscrowsByStatus`|ステータス別に匿名キャストをリストする.|
|`FindProofRecordById`|ID で 1 つの証拠記録を見つけます. |
|`FindProofRecords`|証拠記録をリストする|
|`FindProofRecordsByBackend`|証拠バックエンドの証明記録をリストする.|
|`FindProofRecordsByStatus`|状況によって証明記録をリストする.|

## Nexus,データ可用性,パッケージ {#nexus-data-availability-and-packages}

|疑問です|目的|
| --- | --- |
|`FindRepoAgreements`|チェーンに保存されたリポジトリ契約をリストする. |
|`FindTwitterBindingByHash`|ハッシュでツイッターリンクを解決する.|
|`FindDaPinIntentByTicket`|チケットでデータ可用性ピンの意図を見つけます.|
|`FindDaPinIntentByManifest`|ピンインの意図を明示参照で探す.|
|`FindDaPinIntentByAlias`|ニックネームでピンの意図を見つけろ|
|`FindDaPinIntentByLaneEpochSequence`|レーン・エポークとシーケンスによってピンの意図を見つけます.|
|`FindLaneRelayEnvelopeByRef`|確認されたレーンリレーの封筒を 見つけろ|
|`FindSorafsProviderOwner`|SoraFS 提供者の所有者を解決する. |
|`FindDataspaceNameOwnerById`|データスペースの名前所有者を解決する. |
|`FindMusubiExactPackageV1`|詳細なパッケージ記録と現在の修正をご覧ください.|
|`FindMusubiExactReleaseV1`|正確なリリース・スナップショットを 読んでください|
|`FindMusubiProviderBundleAttestationV1`|提供者のアーカイブパケット証明書を読む. |
|`FindMusubiResolverIndexV1`|完了したレジューラーインデックスをページに表示します. |
|`FindMusubiVersionsV1`|ページは1つのパッケージの最終バージョンです.|
|`FindMusubiMaintainersV1`|ページはメンテナンスと待機中の招待状を受け入れた.|
|`FindMusubiArchiveLocationsV1`|SoraFS の場所が最終的なページです. |
|`FindMusubiArchiveRetentionV1`|ページのアーカイブ保存記録|
|`FindMusubiAliasV1`|グローバル・アライアスの現在の目標と修正を読む. |
|`FindMusubiAliasHistoryV1`|グローバル・アライアスの 不変なリターゲットの歴史をページに載せます|
|`FindMusubiOrderedPrefixV1`|ページのパッケージは,順序化された構造プレフィックスであります.|

## トリガー,契約,トランザクション,ブロック {#triggers-contracts-transactions-and-blocks}

|疑問です|目的|
| --- | --- |
|`FindActiveTriggerIds`|活性トリガー IDs をリストする.|
|`FindTriggers`|リストのトリガー|
|`FindTriggerById`|ID で 1 つのトリガーを見つける. |
|`FindContractManifestByCodeHash`|コードハッシュで スマートコントラクトの マニフェストを 見つけろ|
|`FindTransactions`|約束された取引のリスト|
|`FindBlocks`|リストブロック|
|`FindBlockHeaders`|ブロックヘッダをリストする|

## フィルタリング と ページ化 {#filtering-and-pagination}

Iterable query は predicate と selector の サポート を 暴露 する こと が でき ます. SDK から クエリ 特定型 の タイプ さ れ た フィルタ を 使い て,フィルター 入力 が クエリ アウトプット タイプ に一致 し て い ます. 大規模 な 結果 セット の ため に,各 行 を 一斉 に 取っ取る の で なく,カーソル や 制限 など の クエリ パラメーター を 使い ます.
