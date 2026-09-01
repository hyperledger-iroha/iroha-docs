---
translation_locale: ja
translation_source: /cookbook/nfts.md
translation_source_hash: db99dab483d4e2fb3fd84be84f6e4ef9f8373f0c16eb2f34952f1232c4587561
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# NFTs {#nfts}

## 結果 {#outcome}

生成されたローカルネットワーク上で Taira NFT の状態を検査し、その後、ユニークな NFT を登録、更新、転送、照会します。このワークフローでは、完全修飾された`name$domain.dataspace` NFT IDと標準的な I105 所有者IDを使用します。

## 前提条件 {#prerequisites}

- `curl`、`jq`、Python 3.11以降、および現在の `iroha` CLI。
- 読み取り専用 Taira アクセス。
- 書き込みの場合、[Iroha を起動](/ja/get-started/launch-iroha.md) から生成されたローカルネットワークで、`http://127.0.0.1:8080` 上の `./localnet/client.toml` と Torii があります。

## ステップ {#steps}

### 1. 公開 Taira のコレクションを確認する {#_1-inspect-the-public-taira-collection}

空のページは正常に読み取られたことを意味します：要求されたページには表示可能な NFTs が存在しないことを意味します。

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs は一意のレコードであり、数値残高ではありません。それらには ID、1 人の所有者、そしてコンパクトな `content` メタデータマップがあります。

### 2. ローカル所有者IDを準備する {#_2-prepare-local-owner-ids}

書き込みの例では、チェックインされた `wonderland.universal` ドメインを使用します。プライベートキーを公開せずに設定された認証プリンシパルを導出し、次に別の登録済みアカウントを転送先として選択します。

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
NFT_ID='cookbook_badge$wonderland.universal'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
CURRENT_OWNER="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

NEW_OWNER="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg owner "$CURRENT_OWNER" \
      '[.items[].id | select(. != $owner)][0]'
)"
```

`$` セパレーターは NFT テキスト形式に属します。`wonderland.universal` ドメインおよびデータスペースのサフィックスを完全に保持してください。

### 3. 初期内容で NFT を登録する {#_3-register-the-nft-with-initial-content}

その CLI 最初の文字を読む JSON 標準入力からオブジェクト。現在の認証主体が所有者になります。

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. コンテンツマップを更新する {#_4-update-the-content-map}

メタデータの値は JSON です。キーを設定すると、その1つのエントリが挿入または置き換えられます。これにより、NFT 全体のレコードが置き換えられるわけではありません。

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. 所有権を移転する {#_5-transfer-ownership}

両方の標準的な I105 アカウントIDを提供してください。エイリアスは、`--from`または`--to`として使用される前に解決される必要があります。

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning 許可境界

Taira では、すべての書き込みには`--metadata ./taira.tx-metadata.json`と明示的な手数料支払者も必要です。登録、転送、削除、およびメタデータの更新は、アクティブなソフトウェアによってチェックされます。ランタイム（デフォルトのパーミッションサーフェスにある `CanRegisterNft`、`CanTransferNft`、`CanUnregisterNft`、および `CanModifyNftMetadata`）。アプリケーションに割り当てられたドメインを使用するか、このウォークスルーをローカルネットに保持してください。

:::

契約所有のワークフローの場合、Kotodama は型付きの NFT ホスト関数呼び出しを公開します。以下は、ピン留めされた IVM ドキュメントテストによってコンパイルされ、実行された正確なライフサイクルテストアーティファクトです：

```kotodama
seiyaku NftFlow {
    kotoage fn nft_issue_and_transfer() authorize("NftAuthority") {
        let owner = AccountId::parse(
            "sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV",
        );
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft, owner);
        let to = AccountId::parse(
            "sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76",
        );
        ledger::nft::transfer(
            source: owner,
            nft: nft,
            destination: to,
        );
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft);
    }
}
```

2つの固定された I105 値は上流のテストアーティファクトです。テストランナーは実行前に宛先を登録します。それらは CLI ウォークスルーの`CURRENT_OWNER`および`NEW_OWNER`ではありません。アプリケーション契約の場合、その実際の標準アカウントを提供し、次に [スマートコントラクト](./smart-contracts.md) を通じてコンパイル、テスト、デプロイ、および呼び出しを行ってください。未審査のバイトコードを Taira に提出しないでください。また、契約の実行は依然としてソフトウェアの実行時認可を通過することを忘れないでください。

## 確認する {#verify}

NFT を直接読み取り、その内容が保持されたまま所有者が変更されたことを確認します:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

もし CLI がレコードを出力データコンテナにラップする場合、JSON を一度確認し、含まれている NFT オブジェクトにアサーションを適用します。権威ある不変条件は`id`、`owned_by`、および`content`です。

## トラブルシューティング {#troubleshooting}

- `name$domain` は一部のパーサでデフォルトでユニバーサルデータスペースに設定できますが、クックブックやアプリケーションのIDは明示的な `name$domain.dataspace` 形式を使用する必要があります。
- 同じ NFT ID の再登録は拒否されます。新しいローカルネットを使用するか、別のレコード用に安定した新しい ID を選択してください。
- メタデータ入力は標準入力で有効でなければなりません JSON。引用なしのシェル文字列はメタデータ値ではありません JSON。
- 現在の所有者以外のアカウントによって署名された譲渡には、正確な許可が必要です。`--from`を変更しても暗号署名者は変わりません。
- 譲渡後、元のクライアントはもはや NFT を変更したり登録解除したりすることができない場合があります。新しい所有者の暗号署名者または認可されたコントローラーを使用してください。
- Taira は空の NFT コレクションを返すことがあります。`items: []` を NFT の指示が利用できない証拠として扱わないでください。

## ソースと関連ドキュメント {#source-and-related-docs}

- [NFT ピン留めされたソースコードのリビジョンでの統合テスト](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT ピン留めされたソースコードのリビジョンでのホスト技術的呼び出しテスト](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [固定されたソースコードのリビジョンでの正確な Kotodama NFT ライフサイクルテストアーティファクト](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/ja/blockchain/nfts.md)
- [メタデータ](/ja/blockchain/metadata.md)
- [指示](/ja/blockchain/instructions.md)
- [許可トークン](/ja/reference/permissions.md)
