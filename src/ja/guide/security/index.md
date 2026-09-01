---
translation_locale: ja
translation_source: /guide/security/index.md
translation_source_hash: ec7fc2f950b007f52d837473ad7021565923e537df1d18b86055fb483cda375c
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# セキュリティ {#security}

機密データや価値を扱うシステムと同様に、Iroha の展開を安全に確保してください。署名鍵、ネットワークアクセス、ノードの操作、監視、およびインシデント対応を保護してください。ブロックチェーン台帳は、これらの管理が不要になることを意味するものではありません。

### ナビゲーション {#navigation}

このセクションでは、Iroha ネットワークのセキュリティに関するさまざまな側面について学ぶことができます。詳しく学ぶには、次のトピックのいずれかを選んでください。

- [セキュリティの原則](./security-principles)：

データを保護し、侵害リスクを減らすための基本原則。

- [仮想プライベートネットワーク](./vpn.md):

プライベートまたはコンソーシアム環境で、ピアツーピア、Torii、およびオペレーターアクセスを制限するために VPN を使用する方法。

- [作戦上の安全](./operational-security.md):

アクセス、監視、インシデント対応、およびオペレーターのワークステーションに関する日々の管理。

- [不正監視](./fraud-monitoring.md):

ブロックチェーン台帳のイベント、クエリ、権限、および運用信号を使用して、疑わしい活動を検出し、対応証拠を保全する方法。

- [パスワードのセキュリティ](./password-security.md):

パスワードのエントロピー、強力なパスワードの構築、および一般的な失敗モード。

- [公開鍵暗号](./public-key-cryptography.md)：

公開鍵暗号、署名、認証された通信。

  - [暗号鍵の生成](./generating-cryptographic-keys.md)：

    `kagami`でサポートされている暗号化キーを生成します。

  - [暗号鍵の保存](./storing-cryptographic-keys.md):

展開に適した多層の管理を使用して暗号鍵を保存する。
