---
translation_locale: ja
translation_source: /blockchain/accounts.md
translation_source_hash: 015a85d81c44b7ef7f13cdafb2ed8e493ef512b94dc500939655c70285eac3bd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 口座 {#accounts}

口座は,トランザクションを署名し,本簿状態を持つ権威である.現在の Iroha 3 データモデルでは, `AccountId` はカノニカルでありドメインなしです:それはアカウント管理者から派生され,カノニック的に [I105](/ja/reference/i105.md) として暗号化されています.人に読めるドメインとデータスペースのコンテキストは,別々のアカウント・アリア結合に属します.

## 構造 {#structure}

登録された `Account` には:

- `id`:法典的な`AccountId`
- `metadata`:任意の口座メタデータ
- `label`:オプションの安定型アライス
- `uaid`:オプションのユニバーサルアカウント ID で使用される Nexus フロー
- `opaque_ids`:口座の UAID に縛られた不透明な識別子

アカウントを作成するために使用されるトランザクションの有用な負荷は `NewAccount`.登録アカウントが使用する同一のアイデンティティ,メタデータ,ラベル, UAID および不透明の ID フィールドを含みます.

`uaid` カノニカルを補完する `AccountId`; 代わるものではなく, Nexus サービスにはデータスペスの間で安定したユーザーまたは組織管理が必要であり,プライバシーを守る登録が必要です.ランタイムは1対1の UAID アカウントインデックスでは,不透明な識別子が UAID, 複製または衝突する不透明な識別子を拒否します. [FHE そして UAID](/ja/blockchain/sora-nexus-services.md#fhe-and-uaid) について Nexus サービス層流.

## 口座管理者 {#account-controllers}

コントローラーは,アカウントがアクションをどのように許可するかを定義します.デフォルトクライアントフローはEd25519キーペアを使用しますが,データモデルはマルチサインポリシーコントローラなどのより豊かなコントローラーもサポートしています.

クライアントコンフィギュレーションは,署名権限をピアコンフィギューレーションから別々に保存します.

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

[クライアント設定](/ja/guide/configure/client-configuration.md)と [キー生成](/ja/guide/security/generating-cryptographic-keys.md)を参照してください.

## Taira で試してみてください {#try-it-on-taira}

公共のテストネット Taira の数々のカノニカルアカウント IDs をリストする.

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

口座資産を検査するには,最初の呼び出しからアカウント ID をコピーし,パスに入れる前に URL にコード化します.この Python スニペットでは,最初に登録されたアカウントに対して同じことをします:

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

口座の作成や更新は署名された取引であり, Taira 設定は, [接続する SORA Nexus データベース](/ja/get-started/sora-nexus-dataspaces.md).

## 登録および許可 {#registration-and-permissions}

アカウントは,通用 [`Register`および `Unregister`](/ja/blockchain/instructions.md#un-register)の指示で登録され,登録されていない.アクティブランタイム検証者は,誰がアカウントを作成できるか,どの許可トークンまたは役割が必要かを決定します.

登録後,アカウントは:

- 取引をサインする
- 保有資産
- 独自の領域
- ロールと許可トークンを受信する
- 貯蔵するメタデータ
- これらの機能が有効である場合,アライス,レイケイ,リリカバリ,および Nexus アイデンティティフローに参加する

## アイデンティティのトラブルシューティング {#troubleshooting-identity-issues}

取引が予期せぬ形で拒否される場合,次のことを確認してください.

- クライアント公開鍵は署名に使用されたプライベート鍵と一致する
- 口座は創世記または約束された取引によって登録されました
- 当局は指示によって要求される許可を有している
- 厳格なアカウントフィールドは,カノニカル I105 アカウント ID を使用し,読み取れる名前は,アクティブのアカウント・アライスバインドで解決されます.

参照:

- [許可](/ja/blockchain/permissions.md)
- [メタデータ](/ja/blockchain/metadata.md)
- [クライアントの設定](/ja/guide/configure/client-configuration.md)
- [SORA Nexus データスペス](/ja/get-started/sora-nexus-dataspaces.md)
