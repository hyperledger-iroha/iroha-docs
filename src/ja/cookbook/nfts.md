---
translation_locale: ja
translation_source: /cookbook/nfts.md
translation_source_hash: b60c542052eac6a916350c4aaa779c9f46d248be64ecea9c9bda679a4d56dff3
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# NFTs {#nfts}

## 結果 {#outcome}

生成されたローカルネットワーク上で Taira NFT の状態を検査し、その後、ユニークな NFT を登録、更新、転送、照会します。このワークフローでは、完全修飾された`name$domain.dataspace` NFT IDと標準的な I105 所有者IDを使用します。

## 前提条件 {#prerequisites}

- `curl`、`jq`、Python 3.11以降、および現在の `iroha` CLI。
- 読み取り専用 Taira アクセス。
- 書き込みには、[Iroha を起動](/ja/get-started/launch-iroha.md) と同じく `kagami localnet generate --peers 4 --out-dir ./localnet` で生成したローカルネットワーク（`./localnet/client.toml` と `http://127.0.0.1:8080` 上の Torii を備えたもの）に加えて、その署名者が所有する NFT ドメイン（ステップ2を参照）が必要です。

## ステップ {#steps}

### 1. 公開 Taira のコレクションを確認する {#_1-inspect-the-public-taira-collection}

空のページは正常に読み取られたことを意味します：要求されたページには表示可能な NFTs が存在しないことを意味します。

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5&include_total=true' \
  | jq '{total, nfts: [.items[] | {id, owned_by, metadata}]}'
```

NFTs は一意のレコードであり、数値残高ではありません。それらには ID、1 人の所有者、そしてコンパクトなコンテンツマップがあります。このマップは、Torii のコレクション行では `metadata` として、`ledger nft get` では `content` として返されます。

### 2. ローカル所有者IDを準備する {#_2-prepare-local-owner-ids}

書き込みの例では、署名アカウントが所有するドメイン、またはそのドメインに対する `CanRegisterNft` の付与が必要です。生成されたローカルネットはクライアント用のアプリケーションドメインを登録せず、ドメインを直接登録できるのはジェネシスだけなので、`NFT_DOMAIN` には署名者が管理する `name.dataspace` ドメインを設定してください。プライベートキーを公開せずに設定された認証プリンシパルを導出し、次に別の登録済みアカウントを転送先として選択します。

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
test -n "$NFT_DOMAIN"
NFT_ID="cookbook_badge\$$NFT_DOMAIN"

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

`$` セパレーターは NFT テキスト形式に属します。ID 内の `name.dataspace` ドメインを完全に保持してください。

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

Taira では、すべての書き込みで `--fee-payer authority` を使用します。CLI は署名前に、Taira の手数料資産で表した正確な手数料の見積もりを提示します。登録、転送、削除、およびメタデータの更新は、アクティブなランタイム（デフォルトのパーミッションサーフェスにある `CanRegisterNft`、`CanTransferNft`、`CanUnregisterNft`、および `CanModifyNftMetadata`）によってチェックされます。自分のアカウントが所有するドメイン、またはこれらの付与を保持しているドメインを使用してください。

:::

契約所有のワークフローの場合、Kotodama は型付きの NFT ホスト関数呼び出しを公開します。以下は、ピン留めされた IVM ドキュメントテストによってコンパイルされ、実行された正確なライフサイクルテストアーティファクトです：

```kotodama
// Mint an NFT, transfer it, update metadata, and burn it using typed IDs.
seiyaku NftFlow {
    permission NftAuthority;
    kotoage fn nft_issue_and_transfer() authorize(NftAuthority) {
        let owner = AccountId::parse("sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV");
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft: nft, owner: owner);
        let to = AccountId::parse("sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76");
        ledger::nft::transfer(source: owner, nft: nft, destination: to);
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft: nft);
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

CLI は NFT レコードそのものを出力します。権威ある不変条件は`id`、`owned_by`、および`content`です。

## トラブルシューティング {#troubleshooting}

- `name$domain` は一部のパーサでデフォルトでユニバーサルデータスペースに設定できますが、クックブックやアプリケーションのIDは明示的な `name$domain.dataspace` 形式を使用する必要があります。
- 同じ NFT ID の再登録は拒否されます。新しいローカルネットを使用するか、別のレコード用に安定した新しい ID を選択してください。
- メタデータ入力は標準入力で有効でなければなりません JSON。引用なしのシェル文字列はメタデータ値ではありません JSON。
- 現在の所有者以外のアカウントによって署名された譲渡には、NFT のドメインの所有権、または正確な `CanTransferNft` の付与が必要です。`--from`を変更しても暗号署名者は変わりません。
- 譲渡で変わるのは `owned_by` だけです。メタデータの更新と登録解除は、引き続きドメインの所有者、またはその NFT に対する `CanModifyNftMetadata` か `CanUnregisterNft` を保持するアカウントが行います。新しい所有者は NFT をさらに譲渡できます。
- Taira は空の NFT コレクションを返すことがあります。`items: []` を NFT の指示が利用できない証拠として扱わないでください。

## ソースと関連ドキュメント {#source-and-related-docs}

- [NFT ピン留めされたソースコードのリビジョンでの統合テスト](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/nft.rs)
- [Kotodama NFT ピン留めされたソースコードのリビジョンでのホスト技術的呼び出しテスト](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [固定されたソースコードのリビジョンでの正確な Kotodama NFT ライフサイクルテストアーティファクト](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/docs/examples/12_nft_flow.ko)
- [固定されたソースコードのリビジョンでの Kotodama ドキュメント例テスト](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_documentation_examples.rs)
- [NFTs](/ja/blockchain/nfts.md)
- [メタデータ](/ja/blockchain/metadata.md)
- [指示](/ja/blockchain/instructions.md)
- [許可トークン](/ja/reference/permissions.md)
