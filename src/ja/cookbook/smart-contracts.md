---
translation_locale: ja
translation_source: /cookbook/smart-contracts.md
translation_source_hash: 4fe9b19fc4d13cfc71d9b9558fe7cdb1d14bd88c2d20f4d23c66313ba3ddd4b6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 賢明 な 契約 を 作っ て 展開 する {#build-and-deploy-a-smart-contract}

## 成果 {#outcome}

Kotodama V1 契約をチェック・コンパイルし,その公開エントリーポイントを現地で実行し,検証された IVM アーテファクトを展開し,導入したエントリーポイントのシミュレーションを行い,当局が明示的に報じた手数料で提出.

## 必須条件 {#prerequisites}

- Iroha のソースチェックアウトは,commit `bc7114ed1c7f265a156d2100ff09e851cc95702c`, Rust,および Cargoで.
- 流れ `iroha` CLI 資金提供された Taira 顧客から [接続する Taira](./connect-to-taira.md).
- 絶対的な経路 `IROHA_CONFIG` そして `IROHA_PRIVATE_KEY_FILE`. キーファイルは,モード付きの単リンクで所有者が持てる通常のファイルである必要があります. `0600`; 部署助手が意図的に 秘密鍵の議論をしていない.
- Taira オペレーターの承認.契約コードの登録は `CanRegisterSmartContractCode` を要求し,保護された展開には管理属性と法令が必要になる. Taira がそのアクセスを許可しなかった場合,生成されたローカルネットワークで展開を実行する.

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

### 1. 既知の良い契約のコピー Kotodama V1 {#_1-copy-a-known-good-kotodama-v1-contract}

固定された Iroha チェックアウトの内側で作業し,コンパイレーターのタップルリターンサンプルをコピーして,ソースとツールのチェーンが同じコミットに留まるようにします

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

完全なソースは小さくて,現在の `seiyaku`/`kotoage` の構文を使用しています.

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

Kotodama 対象となる Iroha 仮想マシンとその現在の ABI. それは WASM または EVM ソース言語

### 2. 遺物 を 確認 し,製造 し,検証 する {#_2-check-build-and-verify-the-artifact}

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

最初のビルドはアーティファクトと認証されたサイドカーを公開します.第2弾は読み込みのみ `--verify` モードで実行され,既存の出力が現在のソースに正確に一致しない場合は失敗します. `.to` ファイルとそのマニフェストをレビューしたビルド出力として処理してください.

### 3. バイトコードを本地で実行する {#_3-run-the-bytecode-locally}

`compute`は公開の `kotoage`エントリーポイントで,取引を提出したり支払ったりせずに地元の固定装置に対して実行する `debug-call` を使用して実行します.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama の整数は, JSON の文字列で表現されるので,解読されたチュープルは `["3", "5"]` である.

### 4. 地元の助手を通じて配備する {#_4-deploy-through-the-native-helper}

助手はバイトコードのブロックをアップロードし,署名したマニフェストを登録し,1つの `CommitContractDeployment` オペレーションを送信します.すべての取引に料金を引用し,選択された支払者またはガスバインドを変更する報奨を拒否します.

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

空き `charge_limits` リクエストはコピーされた資産識別子ではありません.ヘルパーが署名する前に正確なライブオートを受け付けます.返済請求資産を現在の faucet 応答と比較してください.契約通話にレガシー `gas_asset_id` メタデータを添付しないでください.

### 5. 部署されたエントリーポイントをシミュレートし,呼び出す {#_5-simulate-and-call-the-deployed-entrypoint}

シミュレーションは公開エントリーポイントを Torii で提出することなく実行します.次の呼び出しは取引であり,したがって当局料金を支払う者を明示的に選択します.両コマンドは1,500,000のガス制限を拘束しています.

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

アニックネームを解決し,返済コードハッシュでオンチェーンマニフェストを取得し,同じ公開エントリーポイントをカノニカルアドレスでシミュレーションします.

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

配備は,返信されたアドレスに別名が解決され,マニフェストが同じコードハッシュ,ローカルおよび Torii シミュレーション返信 `["3", "5"]` で読み取れる時のみ完了し,送信された呼び出しは `Applied` に達します.

## 問題を解く {#troubleshooting}

- `CanRegisterSmartContractCode`の故障は, Taira オペレーター補助金またはローカルネットでのゲネス/ブートストラップ変更を必要とします.通常のアカウントは,この許可を事実後に自主的に認めることはできません.
- 管理または保護されたレーンの拒否は,部署がそのネットワークが要求する正確な承認属性を必要とすることを意味します.承認者リストを調整します;アカウント IDs を発明しないでください.
- マネスティフまたは ABI の不一致とは,バイトコード,マネスティフ,ノードランタイムが同じアーテファクトを記述しないことを意味します. `--verify` で固定された commit を再構築します.
- `fee quote changed ... gas bound` は,要求された入力した意図とライブオートが一致しないことを意味します. 署名された取引を修正する代わりに再開します.
- 部署ヘルパーは,ネットワークの送信前にインラインキー,許容鍵ファイルモード,シンボルリンク,およびリンクされたファイルを倍増する.
- ビューのみエントリーポイントのエラーは, `compute` が誤ったコマンドファミリーを通過されたことを意味します.このサンプルでは `kotoage` を宣言しますので,呼び出しシミュレーションまたは送信を使用します.
- 契約通話には,正型ガス制限が必要です.最高レベルのレガシーガスや料金の資産メタデータは拒否されます.

## ソースおよび関連文書 {#source-and-related-docs}

- [Kotodama V1 コマンドの実行 固定されたコミット](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/src/bin/koto.rs)
- [固定された commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/kotodama_lang/src/samples/tuple_return_demo.ko) の tuple-return source サンプル
- [固定されたコミットでネイティブデプロイメントヘルパー](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/contracts.rs) 固定されたコミットでの契約統合テスト
- [スマート契約](/ja/blockchain/smart-contracts.md)
- [CLI 参照](/ja/get-started/operate-iroha-via-cli.md)
