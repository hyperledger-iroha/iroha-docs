---
translation_locale: ja
translation_source: /guide/security/index.md
translation_source_hash: ec7fc2f950b007f52d837473ad7021565923e537df1d18b86055fb483cda375c
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# セキュリティ {#security}

Iroha の部署を,敏感なデータと値を処理するあらゆるシステムのようにセキュアにする.サインキー,ネットワークアクセス,ノード操作,モニタリング,インシデント応答を保護する.レジーはこれらの制御の必要性を排除しません.

### 航行 {#navigation}

このセクションでは Iroha ネットワークのセキュリティに関する様々な側面について学びます.詳細を学ぶために,以下のテーマの一つを選択してください.

- [安全原則](./security-principles):

データの保護と侵害リスクを減らすための基本原則.

- [仮想プライベートネットワーク](./vpn.md):

VPN を利用してピアツーパー, Torii,および個人またはコンソーシアム部署におけるオペレーターのアクセスを制限する方法.

- [運用安全](./operational-security.md):

アクセス,モニタリング,インシデント対応,オペレーターワークステーションの日常制御.

- [詐欺監視](./fraud-monitoring.md):

疑いのある活動を検知し,応答証拠を保存するために レジ事件,クエリ,許可,および運用信号を使用する方法

- [パスワードセキュリティ](./password-security.md):

パスワードエントロピー 強力なパスワード構造 そして一般的な失敗モード

- [公開鍵暗号化](./public-key-cryptography.md):

公钥暗号化 署名 そして認証通信

  - [暗号鍵を生成する](./generating-cryptographic-keys.md):

`kagami`でサポートされた暗号鍵を生成する.

  - [暗号鍵の保存](./storing-cryptographic-keys.md):

配備に適した層制御を使用して暗号鍵を保管する.
