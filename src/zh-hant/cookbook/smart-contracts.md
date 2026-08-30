---
translation_locale: zh-hant
translation_source: /cookbook/smart-contracts.md
translation_source_hash: 67778f9fc4f2b6fa0288f5921402cf5509515aae678e98b8192e103dfe284db3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 建立和部署智能合同 {#build-and-deploy-a-smart-contract}

## 結果 {#outcome}

檢查和編譯 Kotodama V1 合同,本地執行其公開入口點,部署驗證的 IVM 文物,模擬部署的入口點並以明確報價的機構支付費用提交.

## 預先條件 {#prerequisites}

- 在 Iroha, `0010c5a70039eac101a4846499ba9ceaf43eb65c`,Rust 和 Cargo 的源清算.
- 目前的 `iroha` CLI 加上由 [資助的 Taira 客戶,連接到 Taira](./connect-to-taira.md).
- 在 `IROHA_CONFIG` 和 `IROHA_PRIVATE_KEY_FILE` 中的絕對路徑. 關鍵文件必須是一個擁有者持有的,單鏈接常規文件,具有模式 `0600`;部署輔助器故意沒有內線私鑰參數.
- Taira 運營商批准.合同代碼註冊需要 `CanRegisterSmartContractCode`,受保護的部署可能需要管理屬性和頒佈.如果 Taira 沒有授予該訪問,則在一個生成的本地網絡上執行部署,其起源授權了.

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

## 步驟 {#steps}

### 1.已知良好的 Kotodama V1 合同複製 {#_1-copy-a-known-good-kotodama-v1-contract}

工作在的內部 Iroha 檢查和複製編譯器的反覆返回樣本,所以源和工具鏈保持在相同的提交.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build/deployment
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

完整的來源小,使用當前的 `seiyaku`/`kotoage`語法:

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

Kotodama 針對 Iroha 虛擬機及其當前的 ABI.它不是一個 WASM 或 EVM 源語言.

### 2. 檢查,建造和驗證文物 {#_2-check-build-and-verify-the-artifact}

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

第一個構建發佈了文物和驗證的側車.第二個運行在只讀 `--verify` 模式下,如果任何現有輸出不完全匹配當前源頭,則失敗.將`.to`文件及其表格視爲一本複習的構建輸出.

### 3. 在本地運行字節碼 {#_3-run-the-bytecode-locally}

`compute`是一個公開的 `kotoage`入口點.使用`debug-call`運行,該系統在沒有提交或支付交易的情況下執行與本地固定器件相對.

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-call \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-call.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-call.json
```

Kotodama 整數被呈現爲 JSON 字符串,因此解碼的tuple是 `["3", "5"]`.

### 4. 通過本地助手部署 {#_4-deploy-through-the-native-helper}

助手上傳字節代碼塊,註冊簽署的表格,並提交一個 `CommitContractDeployment`操作.它收費報價每筆交易,拒絕改變選擇付款人或加油綁定的報價.

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

`charge_limits`空格請求不是複製的資產識別符:助手在簽署前接受準確的現場報價.合同調用只通過輸入現場報價接受收費選擇; `gas_asset_id`交易元數據不是首次發佈合同的一部分.

### 5. 模擬並調用部署的入口點 {#_5-simulate-and-call-the-deployed-entrypoint}

模擬在 Torii 上運行公共入口點,沒有提交.下面的調用是交易,因此明確選擇權威費付款人.這兩項命令都綁定了1500000個氣體限制.

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

## 驗證 {#verify}

通過返回的代碼哈希來搜索鏈上的表格,並通過法典地址模擬相同的公開入口點:

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

部署只有當別名解決返回地址時才完成,表格可在相同的代碼哈希下讀取,本地和 Torii 模擬返回 `["3", "5"]`,提交的呼叫達到 `Applied`.

## 解決問題 {#troubleshooting}

- `CanRegisterSmartContractCode`失敗需要一個 Taira 運營商授權或在 localnet上發生/啓動鏈變化.正常賬戶不能自行授予此許可事實後.
- 管理或受保護軌道拒絕意味着部署需要該網絡所要求的準確批准屬性.協調批准者列表;不要創作賬戶 IDs.
- 一個明示或 ABI 不匹配意味着字節碼,明示和節點運行時間沒有描述相同的文物.重建與 `--verify` 固定的提交.
- `fee quote changed ... gas bound` 表示所要求的輸入意圖和現場報價不同意見.重新預期,而不是修改簽署交易.
- 部署輔助器在網絡提交之前拒絕內線鍵,允許鍵文件模式,符號鏈接和複製鏈接的文件.
- 只有視圖輸入點的錯誤意味着 `compute` 通過錯誤的命令家族進行了路由. 這個樣本聲明`kotoage`,所以使用調用模擬或提交.
- 合同調用需要正型氣體限制.第一次發佈的呼叫合約拒絕最高級別的氣體或費用資產元數據.

## 來源及相關文件 {#source-and-related-docs}

- [Kotodama V1 命令的執行在固定提交上](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/src/bin/koto.rs)
- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/tuple_return_demo.ko)的雙重返回源樣本
- [在固定提交中本地部署輔助員](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/bin/ivm_contract_deploy.rs)
- [合同集成測試在固定承諾上](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/contracts.rs)
- [智能合同](/zh-hant/blockchain/smart-contracts.md)
- [CLI 引用](/zh-hant/get-started/operate-iroha-via-cli.md)
