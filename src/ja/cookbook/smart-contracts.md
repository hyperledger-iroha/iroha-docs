---
translation_locale: ja
translation_source: /cookbook/smart-contracts.md
translation_source_hash: f1ea542f7a710830cd32465d141db8452e6418d426500995b9df7c9c4e1fd597
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# スマートコントラクトを構築してデプロイする {#build-and-deploy-a-smart-contract}

## 結果 {#outcome}

チェックしてコンパイルする Kotodama V1 契約、公開エントリーポイントをローカルで実行、検証済みをデプロイ IVM 成果物、デプロイされたエントリポイントをシミュレートし、それを提出する 取引署名アカウントによって支払われる明示的な手数料見積もり。

## 前提条件 {#prerequisites}

- プロトコルの最終段階 `0010c5a70039eac101a4846499ba9ceaf43eb65c`、Rust、および Cargo における Iroha ソースコード作業コピー。
- 現在の `iroha` CLI に加えて、[Taira に接続する](./connect-to-taira.md) からの資金提供された Taira クライアント。
- `IROHA_CONFIG` および `IROHA_PRIVATE_KEY_FILE` の絶対パス。`0600` モードの所有者保有の単一リンク通常ファイルである必要があります。デプロイヘルパーには意図的にインラインの秘密鍵引数はありません。
- Taira オペレーターの承認。契約コードの登録には `CanRegisterSmartContractCode` が必要であり、保護されたデプロイメントではガバナンスの帰属と実行が必要になる場合があります。Taira がそのアクセスを許可していない場合は、その権限を付与するブロックチェーンのジェネシスを持つ生成されたローカルネットワークでデプロイメントを実行してください。

```bash
TORII_URL=https://taira.sora.org
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
IROHA_PRIVATE_KEY_FILE=/absolute/path/to/taira-private-key.txt
test -n "$TAIRA_ACCOUNT_ID"
test -f "$IROHA_PRIVATE_KEY_FILE"

CHAIN_ID="$({
  python3 - "$IROHA_CONFIG" <<'PY'
import sys
import tomllib

with open(sys.argv[1], "rb") as config_file:
    print(tomllib.load(config_file)["chain"])
PY
})"
```

## ステップ {#steps}

### 1. 動作確認済みの Kotodama V1 契約をコピーする {#_1-copy-a-known-good-kotodama-v1-contract}

固定された Iroha チェックアウト内で作業し、コンパイラのタプル返却サンプルをコピーして、ソースとツールチェーンが同じプロトコルの完了状態に保たれるようにしてください。

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

完全なソースは小さく、現在の `seiyaku`/`kotoage` 構文を使用しています:

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    kotoage fn compute() -> (int, int) authorize("Entry") {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama は Iroha 仮想マシンとその現在の ABI を対象としています。これは WASM または EVM のソース言語ではありません。

### 2. アーティファクトをチェック、ビルド、検証する {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p ivm --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p ivm --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

最初のビルドでは、成果物と認証済みの付随ファイルを生成します。2 回目のビルドは読み取り専用の `--verify` モードで実行され、既存の出力が現在のソースと完全に一致しない場合は失敗します。`.to` ファイルとそのマニフェストは、レビュー済みの 1 つのビルド出力として扱ってください。

### 3. バイトコードをローカルで実行する {#_3-run-the-bytecode-locally}

`compute` は公開されている `kotoage` エントリーポイントです。`debug-call` を使って実行してください。これはトランザクションを送信したり支払ったりすることなく、ローカルのテストアーティファクトに対して実行されます。

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama 整数は JSON 文字列として表されるので、デコードされたタプルは `["3", "5"]` です。

### 4. ネイティブヘルパーを通じてデプロイする {#_4-deploy-through-the-native-helper}

ヘルパーはバイトコードのチャンクをアップロードし、署名済みのテクニカルマニフェストを登録し、1つの`CommitContractDeployment`操作を提出します。すべてのトランザクションに手数料見積もりを行い、選択された支払者やトランザクション実行コストの上限を変更する見積もりを拒否します。

```bash
printf '%s\n' \
  '{"payer":"authority","value":{"charge_limits":[],"gas_limit":1500000}}' \
  > ./build/fee-payment.json

cargo run -p iroha_cli --bin ivm_contract_deploy -- \
  --torii-url "$TORII_URL" \
  --chain-id "$CHAIN_ID" \
  --authority "$TAIRA_ACCOUNT_ID" \
  --private-key-file "$IROHA_PRIVATE_KEY_FILE" \
  --code-file ./build/tuple_return_demo.to \
  --contract-alias cookbook_tuple::universal \
  --fee-payment-json ./build/fee-payment.json \
  --out-dir ./build/deployment \
  > ./build/deployment.json

jq '{contract_address, code_hash_hex, final, fee_quotes}' \
  ./build/deployment.json
```

空の `charge_limits` リクエストはコピーされたアセット識別子ではありません：ヘルパーは署名前に正確なライブ見積もりを受け入れます。返されたチャージアセットを現在のテストネット資金サービスのレスポンスと比較してください。契約の呼び出しは、型付きライブ見積もりを通じてのみ手数料の選択を受け付けます。`gas_asset_id` 取引メタデータは、初回リリースの契約の一部ではありません。

### 5. 展開されたエントリーポイントをシミュレートして呼び出す {#_5-simulate-and-call-the-deployed-entrypoint}

シミュレーションは、送信なしで Torii のパブリックエントリーポイントを実行します。次の技術的な呼び出しはトランザクションであり、したがって承認主体の手数料支払者を明示的に選択します。両方のコマンドは、1,500,000のトランザクション実行コスト上限を設定します。

```bash
iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-simulation.json

iroha --config "$IROHA_CONFIG" \
  --machine \
  --fee-payer authority \
  contract call \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  --wait \
  --timeout-ms 60000 \
  > ./build/deployed-call.json

jq -e '.terminal_kind == "Applied"' ./build/deployed-call.json
```

## 確認する {#verify}

エイリアスを解決し、返されたコードの暗号ハッシュによってオンチェーンの技術マニフェストを取得し、正規アドレスによって同じ公開エントリーポイントをシミュレートする:

```bash
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/deployment.json; })"
CONTRACT_ADDRESS="$({ jq -er '.contract_address' ./build/deployment.json; })"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract call \
  --simulate \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-simulation.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-simulation.json
```

デプロイメントは、エイリアスが返されたアドレスに解決され、技術的マニフェストが同じコード暗号ハッシュの下で読み取可能であり、ローカルおよび Torii シミュレーションが`["3", "5"]`を返し、提出された技術的呼び出しが`Applied`に到達したときにのみ完了します。

## トラブルシューティング {#troubleshooting}

- `CanRegisterSmartContractCode` の障害は、Taira オペレーターの権限付与、またはローカルネットでのジェネシス/ブートストラップの変更が必要です。通常のアカウントは、事後に自分自身にこの権限を付与することはできません。
- ガバナンスまたは保護レーンでの拒否は、デプロイメントがそのネットワークで必要とされる正確な承認者の属性を必要とすることを意味します。承認者リストを調整し、アカウントIDを作成しないでください。
- 技術的マニフェストまたは ABI の不一致は、バイトコード、技術的マニフェスト、およびノードソフトウェアのランタイムが同じアーティファクトを説明していないことを意味します。`--verify`を使用して固定されたソースコードのリビジョンで再構築してください。
- `fee quote changed ... gas bound` は、要求されたタイプの意図とライブ見積もりが一致しないことを意味します。署名済みのトランザクションを変更するのではなく、再プレビューを行ってください。
- デプロイヘルパーは、ネットワーク送信前にインラインキー、寛容なキーファイルモード、シンボリックリンク、および複数リンクされたファイルを拒否します。
- 参照専用のエントリポイントエラーは、`compute` が誤ったコマンドファミリーを通ってルーティングされたことを意味します。このサンプルは `kotoage` を宣言しているため、技術的呼び出しのシミュレーションまたは提出を使用してください。
- コントラクト呼び出しには、正の型付き取引実行コスト上限が必要です。最初のリリースの技術的呼び出しコントラクトは、トップレベルの取引実行コストや手数料資産のメタデータを拒否します。

## ソースと関連ドキュメント {#source-and-related-docs}

- [Kotodama V1 ピン留めされたソースコードのリビジョンでのコマンド実装](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [固定されたソースコードのリビジョンでのタプル返却のソースサンプル](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- [固定されたソースコードリビジョンでのネイティブ展開ヘルパー](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [固定されたソースコードのリビジョンでの契約統合テスト](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [スマートコントラクト](/ja/blockchain/smart-contracts.md)
- [CLI 参照](/ja/get-started/operate-iroha-via-cli.md)
