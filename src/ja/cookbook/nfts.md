---
translation_locale: ja
translation_source: /cookbook/nfts.md
translation_source_hash: 5eb6a349b815afbac9717f7b44c499adc78b1280625388656015ff4b133b9085
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

## 成果 {#outcome}

検査 Taira NFT 記録し,更新し,転送し,検索する NFT ローカルネットワークで生成される. ワークフローは完全に資格のある `name$domain.dataspace` NFT ID そして聖典 I105 持ち主 IDs.

## 必須条件 {#prerequisites}

- `curl`,`jq`, Python 3.11またはそれ以降,および電流 `iroha` CLI.
- Taira 読み込みのみアクセス
- 作成されたローカルネットワークから [打ち上げ Iroha](/ja/get-started/launch-iroha.md), と `./localnet/client.toml` そして Torii について `http://127.0.0.1:8080`.

## ステップ {#steps}

### 1. 公衆のコレクション Taira を検査する {#_1-inspect-the-public-taira-collection}

空のページは,読み上げに成功する:それは要求されたページには目に見える NFTs が存在しないことを意味します.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs は,数値のバランスではなく,ユニークな記録である.それらは ID,1人の所有者,およびコンパクトな `content` メタデータマップを持っています.

### 2. 地元の所有者を準備する IDs {#_2-prepare-local-owner-ids}

書き込み例では,チェックインされた `wonderland.universal` ドメインを使用します.個人鍵を公開せずに設定した権限を誘導し,転送目的地として別の登録アカウントを選択してください.

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

`$`分離器は, NFT テキストフォームに属します.完全な `wonderland.universal` ドメインとデータスペースのサフィックスを保持してください.

### 3. 初期内容を持つ NFT を登録する {#_3-register-the-nft-with-initial-content}

CLI は標準入力から最初の JSON オブジェクトを読み取ります.現在の当局は所有者になります.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. 内容地図を更新する {#_4-update-the-content-map}

メタデータ値は JSON. 鍵を挿入するか,その1つの入力に置き換える.それは全 NFT レコードを置き換えることはありません.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. 譲渡所有権 {#_5-transfer-ownership}

供給は両立する I105 口座 IDs. 仮名は,使用前に解決する必要があります. `--from` または `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning 許可制限

オン Taira, すべての書き込みも必要 `--metadata ./taira.tx-metadata.json` 登録,転送,削除,およびメタデータ更新は,アクティブランタイムによって確認されます (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft`, そして `CanModifyNftMetadata` アプリケーションに割り当てられたドメインを使用するか,ローカルネットでこのウォークアウトを保持します.

:::

契約所有のワークフローの場合, Kotodama は NFT ホスト通話を入力した状態に示します. 以下は,ピンされた IVM ドキュメンテーションテストによって作成され実行される正確なライフサイクル固定値です:

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

固定された2つの値 I105 は,上流試験装置であり,ハネスは実行前に目的地を記録する.それらは `CURRENT_OWNER` と `NEW_OWNER` でなく, CLI の通路からである.アプリケーション契約については,実際のカノニカルアカウントを提供し,その後 [スマートコントラクト](./smart-contracts.md)を通じてコンパイル・テスト・デプロイ・および呼び出ししてください.未レビューバイトコードを Taira に提出しないでください.そして,契約の実行はまだランタイム認証を通過することを忘れないでください

## 確認する {#verify}

NFT を直接読んで,その内容が付属している間に所有者が変更されたことを確認してください.

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

CLI が記録を出力封筒に包装する場合は,一度 JSON を検査し,その主張を含まれている NFT オブジェクトに適用します.権威のあるインバリアントは `id`, `owned_by`,および `content`.

## 問題を解く {#troubleshooting}

- `name$domain`は,一部のパーサーの汎用データスペースにデフォルトで設定できますが,クックブックとアプリケーション IDs は明示的な `name$domain.dataspace` 形式を使用する必要があります.
- 同じ NFT ID の繰り返し登録は拒否されます.新しいローカルネットを使用するか,別々の記録のために安定した新しい ID を選択してください.
- メタデータ入力は標準入力で有効である JSON 必要があります. JSON を引用しないシェル文字列はメタデータ値ではありません.
- 現在の所有者以外のアカウントが署名した転送には,正確な許可が必要です. `--from` を変更することは,署名者を変更しません.
- 移転後,元のクライアントは NFT を変異したり登録解除したりすることは許されない.新しい所有者の署名者または権限のあるコントローラーを使用します.
- Taira 無駄に返せる NFT コレクション 治療しないでください `items: []` 証拠として NFT 指示は出ない

## ソースおよび関連文書 {#source-and-related-docs}

- [NFT 固定されたコミットで統合試験](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT 固定されたコミットでホスト呼び出しテスト](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [固定されたコミット](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)で正確な Kotodama NFT ライフサイクル固定
- [NFTs](/ja/blockchain/nfts.md)
- [メタデータ](/ja/blockchain/metadata.md)
- [指示](/ja/blockchain/instructions.md)
- [許可トークン](/ja/reference/permissions.md)
