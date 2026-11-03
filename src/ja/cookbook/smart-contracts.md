---
translation_locale: ja
translation_source: /cookbook/smart-contracts.md
translation_source_hash: ca6fd12e33df43b73a72dd6327133115aa44256cf579387c11bf0693797bf96e
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# スマートコントラクトを構築してデプロイする {#build-and-deploy-a-smart-contract}

## 結果 {#outcome}

Kotodama V1 契約をチェックしてコンパイルし、その公開ビューをローカルで実行し、明示的に選択した認可主体払いの手数料で検証済みの IVM 成果物をデプロイし、デプロイされたビューを Torii 経由で読み取ります。

## 前提条件 {#prerequisites}

- プロトコルの最終段階 `c8c872461e92f04325c350cdd952f4276e96f9dc`、Rust、および Cargo における Iroha ソースコード作業コピー。
- 現在の `iroha` CLI と `musubi`（チェックアウト内で `cargo run -p musubi --` として実行）に加えて、[Taira に接続する](./connect-to-taira.md) からの資金提供された Taira クライアント。
- `IROHA_CONFIG` 内の絶対パス。Musubi のネットワークバインディングはこのクライアントファイルへの参照を保存し、そのアカウントキーでデプロイメントに署名します。
- エイリアスの認可権限。実行者は、正確なコントラクトエイリアスまたはその親スコープに対する `CanManageAccountAlias` を要求します。親スコープとは、`name::domain.dataspace` の場合は所有ドメイン、`name::dataspace` の場合はデータスペースです。登録済みアカウントには別途コード登録権限は不要ですが、保護された名前空間ではネットワークのガバナンスワークフローも必要です。例では `cookbook_tuple::universal` を使用しています。Taira では、これを自分が所有するドメイン内のエイリアスに置き換えるか、ジェネシスでそのエイリアススコープを付与する生成されたローカルネットワーク上でデプロイしてください。

```bash
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
test -f "$IROHA_CONFIG"
```

## ステップ {#steps}

### 1. 動作確認済みの Kotodama V1 契約をコピーする {#_1-copy-a-known-good-kotodama-v1-contract}

固定された Iroha チェックアウト内で作業し、コンパイラのタプル返却サンプルをコピーして、ソースとツールチェーンが同じプロトコルの完了状態に保たれるようにしてください。

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

完全なソースは小さく、プライベートなヘルパー `fn` と、すべての呼び出し元を明示的に許可する公開読み取り専用の `view fn` 1 つで構成されています:

```kotodama
seiyaku TupleReturnDemo {
    fn pair(int a, int b) -> (int, int) {
        let t = (a, b);
        return t;
    }

    view fn compute() authorize(anyone) -> (int, int) {
        let p = pair(a: 3, b: 5);
        return (p.0, p.1);
    }
}
```

Kotodama は Iroha 仮想マシンとその現在の ABI を対象としています。これは WASM または EVM のソース言語ではありません。

### 2. アーティファクトをチェック、ビルド、検証する {#_2-check-build-and-verify-the-artifact}

```bash
cargo run -p kotodama_toolchain --bin koto -- \
  check ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  ./contracts/tuple_return_demo.ko

cargo run -p kotodama_toolchain --bin koto -- \
  build \
  --out ./build/tuple_return_demo.to \
  --manifest-out ./build/tuple_return_demo.manifest.json \
  --verify \
  ./contracts/tuple_return_demo.ko
```

最初のビルドでは、成果物と認証済みの付随ファイルを生成します。2 回目のビルドは読み取り専用の `--verify` モードで実行され、既存の出力が現在のソースと完全に一致しない場合は失敗します。`.to` ファイルとそのマニフェストは、レビュー済みの 1 つのビルド出力として扱ってください。

### 3. バイトコードをローカルで実行する {#_3-run-the-bytecode-locally}

`compute` は公開されている読み取り専用の `view fn` です。`debug-view` を使って実行してください。これはトランザクションを送信したり支払ったりすることなく、コンパイル済みのバイトコードを任意のテスト用フィクスチャに対してローカルで実行します。

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-view \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-view.json
```

Kotodama 整数は JSON 文字列として表されるので、デコードされたタプルは `["3", "5"]` です。

### 4. Musubi で検証済みの成果物をデプロイする {#_4-deploy-the-verified-artifact-with-musubi}

`iroha contract` はコントラクトの検査、ビューの実行、デバッグを行いますが、デプロイは行わないため、Taira へのデプロイは Musubi を通じて実行します。そのデプロイサービスはバイトコードのチャンクをアップロードし、検証済みのマニフェストを登録し、1つの`CommitContractDeployment`操作を提出します。すべてのトランザクションの手数料見積もりを行い、選択された支払者、スポンサーのリビジョン、またはトランザクション実行コストの上限を変更する見積もりを拒否し、ロックされたパッケージビルドがコードと ABI のハッシュを再現した後にのみ、事前ビルド済みの成果物をデプロイします。Kagami で管理されたローカルネットワークでは、代わりに `kagami contract deploy` が `--alias cookbook_tuple::universal --json` を指定して `./build/tuple_return_demo.to` をデプロイします。その結果記録は `.receipt` の下にあり、`kagami context show` は `IROHA_CONFIG` として使用するクライアント設定を出力します。

```bash
cat > ./contracts/Musubi.toml <<'TOML'
manifest-version = 1

[package]
namespace = "local"
name = "cookbook-tuple"
version = "0.1.0"
edition = "1"
abi-version = 1

[[contract]]
name = "tuple_return_demo"
path = "tuple_return_demo.ko"
TOML

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml check

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml \
  network configure taira \
  --config "$IROHA_CONFIG" \
  --fee-payer authority \
  --contract tuple_return_demo \
  --alias cookbook_tuple::universal

cargo run -p musubi -- --manifest-path ./contracts/Musubi.toml --format json \
  deploy --network taira \
  --contract tuple_return_demo \
  --artifact ./build/tuple_return_demo.to \
  --artifact-manifest ./build/tuple_return_demo.manifest.json \
  > ./build/deployment.json

jq '.data.receipt | {contract_address, code_hash, stored_artifact_matches}' \
  ./build/deployment.json
```

バインディングは `--fee-payer authority` を使用します。Musubi は署名前に、Taira の手数料資産で表した正確な手数料の見積もりを提示します。返されたチャージアセットを、現在のフォーセットポリシーが公開しているものと比較してください。契約の呼び出しは、型付きライブ見積もりを通じてのみ手数料の選択を受け付けます。`gas_asset_id` 取引メタデータは、初回リリースの契約の一部ではありません。

### 5. デプロイされたビューを読み取る {#_5-read-the-deployed-view}

`contract view` は、トランザクションも手数料もなしに Torii 上で読み取り専用のエントリーポイントを実行します。ビューにはトランザクション形式がありません。Torii は呼び出し用ルートでのビューセレクターを拒否します。

```bash
iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-view.json
```

## 確認する {#verify}

エイリアスを解決し、デプロイされたビューについて Torii が報告するコードの暗号ハッシュによってオンチェーンの技術マニフェストを取得し、正規アドレスによって同じビューを実行します:

```bash
CONTRACT_ADDRESS="$({
  jq -er '.data.receipt.contract_address' ./build/deployment.json
})"
CODE_HASH="$({ jq -er '.code_hash_hex' ./build/local-view.json; })"
DEPLOYED_CODE_HASH="$({
  jq -er '.code_hash_hex' ./build/deployed-view.json
})"
test "$DEPLOYED_CODE_HASH" = "$CODE_HASH"

RESOLVED_ADDRESS="$({
  iroha --config "$IROHA_CONFIG" --machine \
    contract alias resolve cookbook_tuple::universal |
    jq -er '.contract_address'
})"
test "$RESOLVED_ADDRESS" = "$CONTRACT_ADDRESS"

iroha --config "$IROHA_CONFIG" contract manifest get \
  --dataspace-id 0 \
  --code-hash "$CODE_HASH" \
  --out ./build/on-chain-manifest.json

iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-address "$CONTRACT_ADDRESS" \
  --entrypoint compute \
  > ./build/address-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/address-view.json
```

デプロイメントは、デプロイの結果記録が保存された成果物を検証済みとして報告し、エイリアスが返されたアドレスに解決され、技術的マニフェストが同じコード暗号ハッシュの下で読み取り可能であり、ローカルおよび Torii のビューが`["3", "5"]`を返したときにのみ完了します。

## トラブルシューティング {#troubleshooting}

- `deployment authority lacks CanManageAccountAlias`、または実行者の `authority is not permitted to manage contract alias` は、そのアカウントがそのエイリアスをバインドできないことを意味します。自分が所有するドメイン内のエイリアスを使用するか、そのスコープの所有者から正確なエイリアスの付与、またはそのドメインやデータスペースの付与を受けてください。ローカルネットでは、ジェネシスで付与してください。
- 保護された名前空間での拒否は、そのエイリアスの名前空間がガバナンスの対象であることを意味します。承認者のアカウントIDを列挙しても承認の証拠にはなりません。その名前空間についてはネットワークのガバナンスワークフロー（`iroha app gov deploy propose`）を使用するか、その外側のエイリアスを選択してください。
- 技術的マニフェストまたは ABI の不一致は、バイトコード、技術的マニフェスト、およびノードソフトウェアのランタイムが同じアーティファクトを説明していないことを意味します。固定されたソースコードのリビジョンで再構築し、その後 `--verify` を付けてビルドを再実行してください。
- `fee quote changed ... gas bound` は、要求されたタイプの意図とライブ見積もりが一致しないことを意味します。署名済みのトランザクションを変更するのではなく、再プレビューを行ってください。
- 中断されたデプロイメントは、署名済みの計画をジャーナルに保持します。新しい計画に署名する代わりに、`musubi deploy --resume <JOURNAL>` で再開してください。
- `is read-only and cannot be invoked as a transaction` または `is not a kotoage or lifecycle entrypoint` は、`compute` が呼び出し用コマンドに送られたことを意味します。このサンプルは `view fn` を宣言しているため、ローカルでは `debug-view`、Torii では `view` を使用してください。
- コントラクト呼び出しには、正の型付き取引実行コスト上限が必要です。最初のリリースの技術的呼び出しコントラクトは、トップレベルの取引実行コストや手数料資産のメタデータを拒否します。

## ソースと関連ドキュメント {#source-and-related-docs}

- [固定されたソースコードのリビジョンでの Kotodama V1 コマンド実装](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_toolchain/src/bin/koto.rs)
- [固定されたソースコードのリビジョンでのタプル返却のソースサンプル](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/tuple_return_demo.ko)
- 固定されたソースコードのリビジョンでの [Musubi のデプロイコマンド](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/musubi/src/command_deploy.rs) と [ネイティブ契約デプロイサービス](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_contract_deploy/src/lib.rs)
- [固定されたソースコードのリビジョンでの契約統合テスト](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/contracts.rs)
- [スマートコントラクト](/ja/blockchain/smart-contracts.md)
- [CLI 参照](/ja/get-started/operate-iroha-via-cli.md)
