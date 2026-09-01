---
translation_locale: ja
translation_source: /blockchain/accounts.md
translation_source_hash: 015a85d81c44b7ef7f13cdafb2ed8e493ef512b94dc500939655c70285eac3bd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# アカウント {#accounts}

アカウントは、トランザクションに署名し、ブロックチェーン台帳の状態を所有できる認可主体です。現在の Iroha 3 データモデルでは、`AccountId`が正規です、そしてドメインレス：これはアカウントコントローラーから派生しており、標準的に[I105](/ja/reference/i105.md)として符号化されます。人間が読み取れるドメインとデータスペースのコンテキストは、別のアカウントエイリアスのバインディングに属します。

## 構造 {#structure}

登録された`Account`には以下が含まれます:

- `id`：標準的な`AccountId`
- `metadata`：任意のアカウントメタデータ
- `label`：オプションの安定したエイリアス
- `uaid`：Nexus フローで使用されるオプションのユニバーサルアカウントID
- `opaque_ids`：アカウントの UAID に紐付けられた不透明な識別子

アカウント作成に使用されるトランザクションペイロードは`NewAccount`です。これは、登録されたアカウントで使用されるのと同じ識別子、メタデータ、ラベル、UAID、および不透明IDフィールドを含んでいます。

`uaid` は標準の `AccountId` を補完します。それを置き換えるものではありません。Nexus サービスでデータスペース間で安定したユーザーまたは組織のハンドルが必要な場合、プライバシー保護された登録、またはサービス機能の検索を行う場合に使用してください。ソフトウェアランタイムは、1対1の UAID-アカウントインデックスを保持し、不透明な識別子を UAID を通じて添付する必要があり、重複または衝突する不透明な識別子を拒否します。[FHE と UAID](/ja/blockchain/sora-nexus-services.md#fhe-and-uaid)で Nexus サービス層のフローを参照してください。

## アカウントコントローラー {#account-controllers}

コントローラーはアカウントがどのようにアクションを認証するかを定義します。デフォルトのクライアントフローはEd25519キー・ペアを使用しますが、データモデルはマルチシグネチャポリシーコントローラーのようなより高度なコントローラーもサポートしています。

クライアント構成は、ネットワークピア構成とは別に署名認可主体を保存します:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

現在のキー形式については、[クライアント設定](/ja/guide/configure/client-configuration.md) および [鍵生成](/ja/guide/security/generating-cryptographic-keys.md) を参照してください。

## Taira でこのワークフローを実行してください {#try-it-on-taira}

パブリック Taira テストネットからいくつかの標準的なアカウントIDをリストしてください:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

アカウントの資産を確認するには、最初の技術的呼び出しからアカウントIDをコピーし、パスに配置する前に URL でエンコードします。この Python スニペットは、最初にリストされたアカウントに対してそれを行います:

```bash
python3 - <<'PY'
import json
import urllib.parse
import urllib.request

root = "https://taira.sora.org"
accounts = json.load(urllib.request.urlopen(f"{root}/v1/accounts?limit=1"))["items"]
account_id = accounts[0]["id"]
encoded = urllib.parse.quote(account_id, safe="")
assets = json.load(
    urllib.request.urlopen(f"{root}/v1/accounts/{encoded}/assets?limit=5")
)

print(json.dumps({"account_id": account_id, "assets": assets["items"]}, indent=2))
PY
```

これらは公開読み取りです。アカウントの作成または更新は署名済みトランザクションであり、[SORA Nexus データスペースに接続](/ja/get-started/sora-nexus-dataspaces.md) に記載されたテストネット資金付きの Taira 設定が必要です。

## 登録と許可 {#registration-and-permissions}

アカウントはジェネリックで登録および登録解除されます [`Register` そして `Unregister`](/ja/blockchain/instructions.md#un-register) 指示。アクティブなソフトウェア実行時バリデータが誰ができるかを決定します アカウントを作成し、どの権限トークンまたはロールが必要かを確認します。

登録後、アカウントは次のことができます：

- トランザクションに署名する
- 資産を保有する
- 自分のドメイン
- ロールと権限トークンを受け取る
- メタデータを保存する
- これらの機能が有効になっている場合、エイリアス、再鍵設定、リカバリー、および Nexus IDフローに参加する

## アイデンティティの問題のトラブルシューティング {#troubleshooting-identity-issues}

取引が予期せず拒否された場合は、以下を確認してください:

- クライアントの公開鍵が署名に使用された秘密鍵と一致する
- そのアカウントはブロックチェーンのジェネシスで登録されたか、完了したトランザクションによって登録された
- 認可主体は命令に必要な権限を持っています
- 厳密なアカウントフィールドは標準の I105 アカウントID を使用し、読みやすい名前はアクティブなアカウントエイリアスのバインディングを通じて解決されます

参照：

- [権限](/ja/blockchain/permissions.md)
- [メタデータ](/ja/blockchain/metadata.md)
- [クライアント設定](/ja/guide/configure/client-configuration.md)
- [SORA Nexus データスペース](/ja/get-started/sora-nexus-dataspaces.md)
