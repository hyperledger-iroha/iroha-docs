---
translation_locale: ja
translation_source: /reference/queries.md
translation_source_hash: 88dba1142d7b6a452a5f56d56640ceef47a52ca28e296d6d0ee5992b9005c3bb
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# クエリ {#queries}

Iroha は、ブロックチェーンの台帳状態を変更せずに読み取るクエリです。現在のデータモデルでは、2つの大まかなクエリ形態が公開されています。

- 1つのオブジェクトまたは1つの値を返す単一のクエリ
- イテラブルなクエリは、ストリームやコレクションを返し、クエリの種類がサポートする場合に、フィルタリング、並べ替え、投影、ページングと組み合わせることができます

クエリデータコンテナを手動で構築するのではなく、SDK 型のビルダーまたは CLI を使用してください。以下の名前は、`iroha_data_model::query`によって現在公開されているクエリタイプです。

## ソフトウェアのランタイムと構成 {#runtime-and-configuration}

|クエリ|目的|
| --- | --- |
| `FindAbiVersion` |実行者 ABI のバージョンを返してください。|
| `FindExecutorDataModel` |実行者データモデルの説明を返してください。|
| `FindParameters` |チェーン上の実行者構成パラメータを返します。|

## アカウントと権限 {#accounts-and-permissions}

|クエリ|目的|
| --- | --- |
| `FindAccountById` |正式なアカウントIDで1つのアカウントを見つける。|
| `FindAccountByAlias` |アカウントの別名をアカウントに解決する。|
| `FindAccounts` |登録されたアカウントを一覧表示する。|
| `FindAccountIds` |登録されているアカウントIDを一覧表示してください。|
| `FindAccountsWithAsset` |指定された資産定義を保有しているアカウントを一覧表示します。|
| `FindAliasesByAccountId` |アカウントに紐付けられた別名を一覧表示します。|
| `FindAccountRecoveryPolicyByAlias` |エイリアスの回復ポリシーを探してください。|
| `FindAccountRecoveryRequestByAlias` |エイリアスの回復リクエストを探してください。|
| `FindRoles` |役割をリストする。|
| `FindRoleIds` |役割IDを一覧表示する。|
| `FindRolesByAccountId` |アカウントに付与された役割を一覧表示します。|
| `FindPermissionsByAccountId` |アカウントに付与された権限を一覧表示します。|

## ドメインとネットワークピア {#domains-and-peers}

|クエリ|目的|
| --- | --- |
| `FindDomainById` |`DomainId`で1つのドメインを探してください。|
| `FindDomains` |登録されたドメインを一覧表示します。|
| `FindDomainsByAccountId` |アカウントが所有するドメインを一覧表示する。|
| `FindDomainEndorsements` |ドメイン承認記録を一覧表示します。|
| `FindDomainEndorsementPolicy` |ドメイン承認ポリシーを返してください。|
| `FindDomainCommittee` |ドメイン委員会を返却する。|
| `FindPeers` |ブロックチェーン台帳で知られている信頼できるネットワークピアを一覧表示します。|

## 資産、NFTs、および RWAs {#assets-nfts-and-rwas}

|クエリ|目的|
| --- | --- |
| `FindAssets` |資産残高を一覧表示します。|
| `FindAssetsDefinitions` |資産定義の一覧を表示します。|
| `FindAssetsByAccountId` |アカウントが保有する資産を一覧表示する。|
| `FindAssetById` |`AssetId`によって1つの資産残高を見つける。|
| `FindAssetDefinitionById` |IDで資産の定義を1つ見つける。|
| `FindNfts` |リスト NFTs。|
| `FindNftsByAccountId` |アカウントが所有するリスト NFTs。|
| `FindRwas` |登録された実物資産ロットを一覧表示します。|

## エスクローおよび証明記録 {#escrow-and-proof-records}

エスクローの照会は、マーケットプレイスのエスクロー、一般的な資産ロック、匿名エスクロー記録を含む、[ネイティブ資産エスクロー ISIs](/ja/blockchain/escrow.md) によって作成された記録を調査します。

|クエリ|目的|
| --- | --- |
| `FindAssetEscrows` |資産エスクロー記録を一覧表示します。|
| `FindAssetEscrowById` |IDで1つの資産エスクローを見つける。|
| `FindAssetEscrowsBySeller` |売り手ごとに資産エスクローを一覧表示する。|
| `FindAssetEscrowsByBuyer` |買い手ごとに資産エスクローを一覧表示する。|
| `FindAssetEscrowsByStatus` |ステータス別に資産エスクローを一覧表示する。|
| `FindAnonymousAssetEscrows` |匿名資産エスクロー記録を一覧表示する。|
| `FindAnonymousAssetEscrowById` |IDで1つの匿名資産エスクローを探す。|
| `FindAnonymousAssetEscrowsBySeller` |売り手ごとに匿名エスクローをリストする。|
| `FindAnonymousAssetEscrowsByBuyer` |購入者ごとに匿名のエスクローをリストする。|
| `FindAnonymousAssetEscrowsByStatus` |ステータス別に匿名エスクローを一覧表示します。|
| `FindProofRecordById` |IDで1つの証明記録を見つける。|
| `FindProofRecords` |証明記録を一覧表示します。|
| `FindProofRecordsByBackend` |プルーフバックエンドのプルーフ記録を一覧表示する。|
| `FindProofRecordsByStatus` |ステータスごとに証明書の記録を一覧表示します。|

## Nexus、データの利用可能性、及びパッケージ {#nexus-data-availability-and-packages}

|クエリ|目的|
| --- | --- |
| `FindRepoAgreements` |チェーン上に保存されているリポジトリ契約を一覧表示します。|
| `FindTwitterBindingByHash` |暗号ハッシュによってTwitterの連携を解決する。|
| `FindDaPinIntentByTicket` |チケットでデータ利用可能ピンの意図を見つける。|
| `FindDaPinIntentByManifest` |技術マニフェストの参照によってピンの意図を検索する。|
| `FindDaPinIntentByAlias` |エイリアスでピン意図を見つける。|
| `FindDaPinIntentByLaneEpochSequence` |実行レーン、エポック、およびシーケンスによってピンの意図を見つけます。|
| `FindLaneRelayEnvelopeByRef` |認証済みのレーンリレー用データコンテナを見つけてください。|
| `FindSorafsProviderOwner` |SoraFS プロバイダーの所有者を特定する。|
| `FindDataspaceNameOwnerById` |データスペース名の所有者を解決する。|
| `FindMusubiExactPackageV1` |1つの正確なパッケージ記録とその現在の改訂版を読み取ります。|
| `FindMusubiExactReleaseV1` |正確なリリーススナップショットを1つ読み取ります。|
| `FindMusubiProviderBundleAttestationV1` |あるプロバイダのアーカイブバンドル証明を読む。|
| `FindMusubiResolverIndexV1` |最終化されたリゾルバーインデックスのページ。|
| `FindMusubiVersionsV1` |1つのパッケージの最終版ページ。|
| `FindMusubiMaintainersV1` |ページは承認されたメンテナーと保留中の招待を表示します。|
| `FindMusubiArchiveLocationsV1` |1つのアーカイブのために SoraFS の場所でページが確定されました。|
| `FindMusubiArchiveRetentionV1` |ページアーカイブ保持記録。|
| `FindMusubiAliasV1` |グローバルエイリアスの現在のターゲットとリビジョンを読み取ります。|
| `FindMusubiAliasHistoryV1` |グローバルエイリアスの不変の再ターゲット履歴をページングする。|
| `FindMusubiOrderedPrefixV1` |1つの順序付けられた構造プレフィックスの下でページをパッケージ化します。|

## トリガー、契約、トランザクション、およびブロック {#triggers-contracts-transactions-and-blocks}

|クエリ|目的|
| --- | --- |
| `FindActiveTriggerIds` |アクティブなトリガーIDを一覧表示します。|
| `FindTriggers` |トリガーをリストする。|
| `FindTriggerById` |IDでトリガーを1つ見つける。|
| `FindContractManifestByCodeHash` |コードの暗号ハッシュによってスマートコントラクトの技術マニフェストを見つける。|
| `FindTransactions` |確定した取引を一覧表示します。|
| `FindBlocks` |ブロックを一覧表示します。|
| `FindBlockHeaders` |ブロックヘッダーを一覧表示する。|

## フィルタリングとページネーション {#filtering-and-pagination}

反復可能なクエリは、述語およびセレクタのサポートを公開することができます。SDK からクエリ固有の型付きフィルタを使用して、フィルタ入力がクエリ出力の型に一致するようにしてください。大きな結果セットの場合は、すべての行を一度に取得するのではなく、カーソルや制限などのクエリパラメータを使用してください。
