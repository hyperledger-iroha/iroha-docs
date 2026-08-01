---
translation_locale: ja
translation_source: /cookbook/metadata.md
translation_source_hash: 07b065b28eca44939a92b40a81a47b57178de4539abb0daf51913969e34eced7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# メタデータ {#metadata}

## 成果 {#outcome}

Taira のメタデータを読み,取引料を明示的に支払ったトランザクションでアカウントのメタデータの値を設定して確認し,またその値を削除します. レジャーオブジェクトのメタデータはトランザクション料のメタデータから分離されます.

## 必須条件 {#prerequisites}

- `curl`,`jq`, Python 3.11またはそれ以降,および電流 `iroha` CLI.
- 資金調達 `taira.client.toml` そして `taira.tx-metadata.json` から [接続する Taira](./connect-to-taira.md).
- ターゲットアカウントのメタデータに対する権限.例は設定された当局自身を対象としているが,別のアカウントには正確な許可が必要です.

## ステップ {#steps}

### 1. 署名者なしでメタデータを読む {#_1-read-metadata-without-a-signer}

メタデータは `Name` から JSON までのチェックされた地図です. 空きマップと空のフィルタアウトプットは有効な結果です.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

小規模な記述またはインデックスフィールドのメタデータを使用します.大きな役に立たない負荷を本簿から外して,代わりに URI または SoraFS 参照を保存します.

### 2. 目標口座を抽出する {#_2-derive-the-target-account}

Taira コンフィギュアから公開鍵のみを読み,正規ドメインのない I105 フォームに変換します.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
```

### 3. 一つの JSON 値を設定する {#_3-set-one-json-value}

標準入力から読み取られた JSON は,アカウントの `cookbook_profile` 値になります.対照的に,`--metadata ./taira.tx-metadata.json` は取引包に料金のフィールドを添付します.この2つの地図には異なる目標と目的があります.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

CLI は,手数料を引用し,署名し,提出し,デフォルトで待機します.次の操作がこの値に依存するときに `--no-wait` を追加しないでください.

::: warning 許可制限

アクティブバリダーターは,各オブジェクトを誰に変異させられるかを決定する.別のアカウントを更新するには通常 `CanModifyAccountMetadata` が必要です.ドメイン,資産定義, NFTs,トリガーには独自のターゲット特定メタデータ権限があります.Taira が要求される権限を与えていない場合は,同じアカウントコマンドを `./localnet/client.toml` で実行し,生成されたローカルネット当局のカノニカル I105 ID を置き換えて,Taira 料金メタデータファイルを省略する.明示的なローカル料金支払者選択を保持します.

:::

### 4 鍵を外す {#_4-remove-the-key}

まず約束された値を読み,それから別々の移除取引を提出する.

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

について Python 対応型ビルダーは, `Instruction.set_account_key_value` そして `Instruction.remove_account_key_value`; 取引メタデータと待機助手を [Python チュートリアル](/ja/guide/tutorials/python.md#shared-setup).

## 確認する {#verify}

設定されたトランザクションの後, `meta get` は `version: 1` とオブジェクトを返さなければならない.削除後,直接検索はもはや値を返さない:

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

独立したアカウントの読み方は,欠落したメタデータキーとネットワークまたはアカウント故障を区別します.生成コードは,設定後,全体的な JSON 値を確認する必要があります.

## 問題を解く {#troubleshooting}

- 標準入力には,1 つの有効な JSON 値が含まれなければならない.文字列は JSON の引用が必要であり,オブジェクトと配列は良好に形成されている必要があります.
- メタデータキーは `Name` 値であり,解析後にケースに敏感である.すべてのスケーマ変更のためにバージョン式キーを作成する代わりに安定したキー語彙を維持します.
- `--metadata`はトランザクションメタデータであり,レジャー・オブジェクトメタデータを設定していない.後者の場合,エンティティの `meta set`サブコマンドを使用する.
- 順調な送信後,古い読み込みが続ければ,伝播遅延になり得る.適用終了まで待って,再提出する前にクエリを再び試してみてください.
- 許可拒否は対象オブジェクトと権限の境界を識別します.現地でリハーサルするか,正確なトークンを要求する;アクセス制御を避けるために,プライベートアプリケーションデータを公開メタデータフィールドに移動しないでください.
- 密钥,個人識別子,アクセストークン,または大きな文書をメタデータに保存しないでください.

## ソースおよび関連文書 {#source-and-related-docs}

- [固定された commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/queries/metadata.rs)でメタデータクエリ統合テスト
- [Python SDK の取引構築者は,固定されたコミット](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/python/iroha_python/README.md)
- [メタデータ](/ja/blockchain/metadata.md)
- [メタデータおよびレジャーストレージの選択肢](/ja/guide/configure/metadata-and-store-assets.md)
- [指示参照](/ja/reference/instructions.md)
- [許可トークン](/ja/reference/permissions.md)
