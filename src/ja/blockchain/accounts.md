---
translation_locale: ja
translation_source: /blockchain/accounts.md
translation_source_hash: adc98cbf1fcadae4415d03dcc262eb03f8c95b429527e403d230934ae2f3243c
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# アカウント {#accounts}

アカウントは、トランザクションに署名し、台帳上の状態を所有できる権限主体です。現在の Iroha 3 のデータモデルでは、`AccountId` はドメインを含まない正規の識別子です。アカウントのコントローラーから導出され、[I105](/ja/reference/i105.md) の正規形式で符号化されます。人が読めるドメインやデータスペースの文脈は、別個のアカウントエイリアスのバインディングに保持されます。

## 構造 {#structure}

登録された`Account`には以下が含まれます:

- `id`：標準的な`AccountId`
- `metadata`：任意のアカウントメタデータ
- `label`：オプションの安定したエイリアス
- `uaid`: SORA Nexus のフローで使う任意の Universal Account ID
- `opaque_ids`：アカウントの UAID に紐付けられた不透明な識別子

アカウント作成に使用されるトランザクションペイロードは`NewAccount`です。これは、登録されたアカウントで使用されるのと同じ識別子、メタデータ、ラベル、UAID、および不透明IDフィールドを含んでいます。

`uaid` は正規の `AccountId` を補完するものであり、置き換えるものではありません。SORA Nexus サービスで、データスペースをまたぐ安定したユーザーや組織の識別子、プライバシーを保護した登録、サービスの権限検索が必要な場合に使います。実行環境は UAID とアカウントを1対1で対応付ける索引を維持し、不透明な識別子の関連付けには UAID を必須とし、重複または衝突する不透明な識別子を拒否します。SORA Nexus のサービス層のフローについては、[FHE と UAID](/ja/blockchain/sora-nexus-services.md#fhe-and-uaid)を参照してください。

## アカウントコントローラー {#account-controllers}

コントローラーはアカウントがどのようにアクションを認証するかを定義します。デフォルトのクライアントフローはEd25519キー・ペアを使用しますが、データモデルはマルチシグネチャポリシーコントローラーのようなより高度なコントローラーもサポートしています。

クライアント構成は、ネットワークピア構成とは別に署名認可主体を保存します:

```toml
[account]
profile = "taira"
public_key = "ed0120..."
private_key_file = "/absolute/path/to/private.key"
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

これらは公開の読み取り操作です。アカウントの作成や更新は署名済みトランザクションで行い、[SORA Nexus データスペースへの接続](/ja/get-started/sora-nexus-dataspaces.md)に記載された、フォーセットから資金供給を受けた Taira の環境が必要です。

## 登録と許可 {#registration-and-permissions}

アカウントはジェネリックで登録および登録解除されます [`Register` そして `Unregister`](/ja/blockchain/instructions.md#un-register) 指示。アクティブなソフトウェア実行時バリデータが誰ができるかを決定します アカウントを作成し、どの権限トークンまたはロールが必要かを確認します。

登録後、アカウントは次のことができます：

- トランザクションに署名する
- 資産を保有する
- 自分のドメイン
- ロールと権限トークンを受け取る
- メタデータを保存する
- 対応する機能が有効な場合に、エイリアス、鍵更新、復旧、SORA Nexus の識別情報に関するフローに参加する

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
- [SORA Nexus のデータスペース](/ja/get-started/sora-nexus-dataspaces.md)
