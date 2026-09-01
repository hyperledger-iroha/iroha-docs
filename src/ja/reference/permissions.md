---
translation_locale: ja
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# 許可トークン {#permission-tokens}

このページには、現在の Iroha 実行データモデルで公開されているデフォルトの権限トークンタイプが一覧表示されています。ロールと権限に関する概念ガイドについては、[権限](/ja/blockchain/permissions.md) を参照してください。

権限チェックは、アクティブなソフトウェアランタイム検証器によって強制されます。以下のトークンタイプ名は標準的なポリシーの範囲を示していますが、ネットワークは実行者をアップグレードすることでソフトウェアランタイム検証をカスタマイズできます。

## デフォルトトークン {#default-tokens}

|許可トークン|カテゴリー|操作|
| --- | --- | --- |
| `CanManagePeers` |ネットワークピア|ネットワークピアを登録、登録解除、またはその他の方法で管理します。|
| `CanManageLaneRelayEmergency` |ネットワークピア|緊急レーンリレー制御を管理する。|
| `CanRegisterDomain` |ドメイン|ドメインを登録する。|
| `CanUnregisterDomain` |ドメイン|ドメインの登録を解除する。|
| `CanModifyDomainMetadata` |ドメイン|ドメインのメタデータを変更する。|
| `CanRegisterAccount` |アカウント|アカウントを登録する。|
| `CanUnregisterAccount` |アカウント|アカウントを登録解除する。|
| `CanModifyAccountMetadata` |アカウント|アカウントのメタデータを変更する。|
| `CanUnregisterAssetDefinition` |資産の定義|アセット定義の登録を解除する。|
| `CanModifyAssetDefinitionMetadata` |資産の定義|アセット定義のメタデータを変更する。|
| `CanMintAssetWithDefinition` |資産|特定の定義のために資産を発行する。|
| `CanBurnAssetWithDefinition` |資産|特定の定義のために資産を破壊する。|
| `CanTransferAssetWithDefinition` |資産|特定の定義のために資産を移転する。|
| `CanMintAsset` |資産|特定の資産残高を発行する。|
| `CanBurnAsset` |資産|特定の資産残高を破壊する。|
| `CanTransferAsset` |資産|特定の資産残高を移動する。|
| `CanRegisterNft` | NFT |NFT を登録する。|
| `CanUnregisterNft` | NFT |NFT の登録を解除する。|
| `CanTransferNft` | NFT |NFT を転送する。|
| `CanModifyNftMetadata` | NFT |NFT のメタデータを変更します。|
| `CanSetParameters` |パラメータ|オンチェーンの設定パラメータを設定します。|
| `CanManageRoles` |役割|役割を登録、登録解除、付与、または取り消します。|
| `CanRegisterTrigger` |トリガー|トリガーを登録する。|
| `CanExecuteTrigger` |トリガー|トリガーを実行する。|
| `CanUnregisterTrigger` |トリガー|トリガーの登録を解除する。|
| `CanModifyTrigger` |トリガー|トリガーの設定を変更する。|
| `CanModifyTriggerMetadata` |トリガー|トリガーのメタデータを変更する。|
| `CanUpgradeExecutor` |執行者|ソフトウェアのランタイム実行環境をアップグレードする。|
| `CanRegisterSmartContractCode` |スマートコントラクト|スマートコントラクトコードを登録する。|
| `CanUseFeeSponsor` | Nexus |指定されたスポンサーアカウントに Nexus の料金を請求する。|

## 所有権 {#ownership}

オーナーに敏感な権限トークンは、現在のデータモデルで使用される標準的なオブジェクトIDを参照する必要があります。たとえば、アカウント権限は標準的なドメインなしのアカウントIDを参照し、ドメイン権限は`domain.dataspace`ドメインIDを参照します。および資産権限は、正規の資産定義または資産IDを指します。

取引が承認エラーで失敗した場合、両方の側を確認してください：

- トランザクションに署名しているアカウントは、期待される正規のアカウントです
- 許可トークンまたは役割は、指示で使用された正確なオブジェクトIDに対して付与されました
