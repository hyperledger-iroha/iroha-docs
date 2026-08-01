---
translation_locale: ja
translation_source: /reference/permissions.md
translation_source_hash: f02e76369a5d9c3a9da3ccd4f17d0515932c7af105b9f30a457b70bdf277b3e7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 許可トークン {#permission-tokens}

このページでは,現在の Iroha 実行器データモデルに暴露されているデフォルト許可トークンタイプがリストされています.役割と権限の概念ガイドについては, [Permissions](/ja/blockchain/permissions.md)を参照してください.

許可チェックは,アクティブランタイム検証器によって実行されます.下のトークンタイプ名は標準ポリシー表面を記述しますが,ネットワークは実行プログラムをアップグレードすることでランタイム認証をカスタマイズすることができます.

## デフォルトトークン {#default-tokens}

|許可証|カテゴリー|作戦|
| --- | --- | --- |
|`CanManagePeers`|同級者|登録する,登録しない,または他の方法で同級者を管理する.|
|`CanManageLaneRelayEmergency`|同級者|緊急レーンリレー制御を管理する|
|`CanRegisterDomain`|域名|ドメインを登録する|
|`CanUnregisterDomain`|域名|ドメインの登録を解除します.|
|`CanModifyDomainMetadata`|域名|ドメインメタデータを変更する. |
|`CanRegisterAccount`|口座|口座を登録する|
|`CanUnregisterAccount`|口座|口座の登録を中止する|
|`CanModifyAccountMetadata`|口座|アカウントのメタデータを変更する.|
|`CanUnregisterAssetDefinition`|資産の定義|資産定義の登録を中止する|
|`CanModifyAssetDefinitionMetadata`|資産の定義|資産定義メタデータを変更する. |
|`CanMintAssetWithDefinition`|資産|特定の定義のための硬貨資産.|
|`CanBurnAssetWithDefinition`|資産|特定の定義のために資産を燃やします|
|`CanTransferAssetWithDefinition`|資産|特定の定義のための資産転送. |
|`CanMintAsset`|資産|特定の資産の余分を表す.|
|`CanBurnAsset`|資産|特定の資産の余分を燃やす|
|`CanTransferAsset`|資産|特定の資産の余分を転送する|
|`CanRegisterNft`|NFT|NFT を登録する.|
|`CanUnregisterNft`|NFT|NFT の登録を中止する.|
|`CanTransferNft`|NFT|NFT を転送する.|
|`CanModifyNftMetadata`|NFT|NFT メタデータを修正する. |
|`CanSetParameters`|パラメータ|チェーン上の設定パラメータを設定する.|
|`CanManageRoles`|役割|登録,登録解除,授与,または撤廃の役割.|
|`CanRegisterTrigger`|トリガー|引き金を引く|
|`CanExecuteTrigger`|トリガー|引き金を引く|
|`CanUnregisterTrigger`|トリガー|触発機を解除する|
|`CanModifyTrigger`|トリガー|トイガーの設定を変更する|
|`CanModifyTriggerMetadata`|トリガー|触発メタデータを修正する|
|`CanUpgradeExecutor`|執行者|実行時の実行器をアップグレードする.|
|`CanRegisterSmartContractCode`|スマート契約|スマート契約コードを登録する|
|`CanUseFeeSponsor`|Nexus|指定されたスポンサーアカウントに Nexus 料金を請求する. |

## 所有権 {#ownership}

オーナーに敏感な許可トークンは,現在のデータモデルで使用されているカノニカルオブジェクト IDs に参照する必要があります.例えば,アカウント権限は,カノニラルドメインレスアカウント IDs に言及し,ドメイン権限は, `domain.dataspace` ドメイン IDs に参照します.資産許可は,法定的な資産定義または資産 IDs に言及する.

トランザクションが許可エラーで失敗した場合,両側を確認します.

- トランザクションを署名する口座は,期待されるカノニカルアカウントである.
- 指示で使用された正確なオブジェクト ID に対して許可トークンまたはロールが認められた.
