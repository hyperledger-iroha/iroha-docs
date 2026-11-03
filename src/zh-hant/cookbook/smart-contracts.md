---
translation_locale: zh-hant
translation_source: /cookbook/smart-contracts.md
translation_source_hash: ca6fd12e33df43b73a72dd6327133115aa44256cf579387c11bf0693797bf96e
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# 建立和部署智慧合同 {#build-and-deploy-a-smart-contract}

## 結果 {#outcome}

檢查並編譯 Kotodama V1 合約，在本機執行其公開的檢視函式，使用明確選擇、由授權主體支付的費用部署已驗證的 IVM 構件，並透過 Torii 讀取已部署的檢視函式。

## 預先條件 {#prerequisites}

- 簽出到提交 `c8c872461e92f04325c350cdd952f4276e96f9dc` 的 Iroha 原始碼、Rust 和 Cargo。
- 目前的 `iroha` CLI 和 `musubi`（在原始碼工作副本中以 `cargo run -p musubi --` 執行），以及透過[連線到 Taira](./connect-to-taira.md)取得的已注資 Taira 使用者端。
- `IROHA_CONFIG` 中必須使用絕對路徑。Musubi 的網路繫結會儲存對此使用者端檔案的參照，並以該檔案中的帳戶金鑰簽署部署。
- 別名權限。執行器要求針對確切的合約別名或其上層範圍持有 `CanManageAccountAlias`：對於 `name::domain.dataspace` 是所屬域名，對於 `name::dataspace` 則是資料空間。已註冊帳戶不需要另外的程式碼註冊許可權，而受保護的命名空間還需要經過網路的治理流程。範例使用 `cookbook_tuple::universal`；在 Taira 上，請將其替換為您擁有的域名中的別名，或在創世設定已授予該別名範圍的產生式本地網路上部署。

```bash
IROHA_SOURCE=/absolute/path/to/iroha
IROHA_CONFIG=/absolute/path/to/taira.client.toml
test -f "$IROHA_CONFIG"
```

## 步驟 {#steps}

### 1.已知良好的 Kotodama V1 合同複製 {#_1-copy-a-known-good-kotodama-v1-contract}

工作在的內部 Iroha 檢查和複製編譯器的反覆返回樣本,所以源和工具鏈保持在相同的提交.

```bash
cd "$IROHA_SOURCE"
mkdir -p ./contracts ./build
cp ./crates/kotodama_lang/src/samples/tuple_return_demo.ko \
  ./contracts/tuple_return_demo.ko
```

完整的原始碼很短：一個私有輔助 `fn`，以及一個明確允許所有呼叫者的公開唯讀 `view fn`：

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

Kotodama 針對 Iroha 虛擬機器及其當前的 ABI.它不是一個 WASM 或 EVM 源語言.

### 2. 檢查,建造和驗證構件 {#_2-check-build-and-verify-the-artifact}

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

第一個構建釋出了構件和驗證的輔助記錄.第二個執行在只讀 `--verify` 模式下,如果任何現有輸出不完全匹配當前源頭,則失敗.將`.to`檔案及其清單視為一本複習的構建輸出.

### 3. 在本地執行位元組碼 {#_3-run-the-bytecode-locally}

`compute` 是一個公開的唯讀 `view fn`。使用 `debug-view` 執行它；它會在本機針對可選的測試資料執行已編譯的位元組碼，而不提交交易或支付交易費用。

```bash
iroha --config "$IROHA_CONFIG" --machine contract debug-view \
  --code-file ./build/tuple_return_demo.to \
  --entrypoint compute \
  > ./build/local-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/local-view.json
```

Kotodama 整數被呈現為 JSON 字串,因此解碼的tuple是 `["3", "5"]`.

### 4. 使用 Musubi 部署已驗證的構件 {#_4-deploy-the-verified-artifact-with-musubi}

`iroha contract` 可以檢查、檢視和除錯合約，但不會部署合約，因此 Taira 上的部署要透過 Musubi 進行。其部署服務會上傳位元組碼區塊、註冊已驗證的清單，並提交一個 `CommitContractDeployment` 操作。它會為每筆交易取得報價，拒絕任何會改變所選付款人、贊助方修訂版本或 gas 上限的報價，並且只有在鎖定的套件建置重現其程式碼雜湊與 ABI 雜湊之後，才會部署預先建置的構件。在由 Kagami 管理的本地網路上，則改用 `kagami contract deploy` 以 `--alias cookbook_tuple::universal --json` 部署 `./build/tuple_return_demo.to`；其收據位於 `.receipt` 下，而 `kagami context show` 會列印要作為 `IROHA_CONFIG` 使用的使用者端設定。

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

此繫結使用 `--fee-payer authority`；Musubi 會在簽署前給出以 Taira 費用資產計價的確切費用報價。請將傳回的收費資產與目前水龍頭政策公布的資產比較。合約呼叫只透過具型別的即時報價接受費用選擇；`gas_asset_id` 交易 metadata 並非首個版本合約的一部分。

### 5. 讀取已部署的檢視函式 {#_5-read-the-deployed-view}

`contract view` 會在 Torii 上執行唯讀入口點，不需要交易或費用。檢視函式沒有交易形式：Torii 會在其呼叫路由上拒絕檢視選擇器。

```bash
iroha --config "$IROHA_CONFIG" --machine contract view \
  --contract-alias cookbook_tuple::universal \
  --entrypoint compute \
  --gas-limit 1500000 \
  > ./build/deployed-view.json

jq -e '.ok == true and .result == ["3", "5"]' \
  ./build/deployed-view.json
```

## 驗證 {#verify}

解析別名，依 Torii 為已部署檢視函式回報的程式碼雜湊取得鏈上清單，並透過規範地址執行相同的檢視函式：

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

只有當部署收據回報已儲存的構件為已驗證、別名解析為傳回的地址、清單可在相同的程式碼雜湊下讀取，且本機與 Torii 的檢視結果都返回 `["3", "5"]` 時，部署才算完成。

## 解決問題 {#troubleshooting}

- `deployment authority lacks CanManageAccountAlias` 或執行器的 `authority is not permitted to manage contract alias` 表示該帳戶不得繫結該別名。請使用您擁有的域名中的別名，或從該範圍的所有者取得確切的別名授權或其域名或資料空間授權；在本地網路上，則在創世中授予。
- 受保護命名空間的拒絕表示該別名命名空間受治理約束。列出批准者帳戶 ID 並不能作為批准證據；請針對該命名空間使用網路的治理流程（`iroha app gov deploy propose`），或選擇該命名空間以外的別名。
- 清單或 ABI 不相符表示位元組碼、清單和節點執行環境描述的不是同一個構件。請在固定的提交上重新建置，然後使用 `--verify` 再次執行建置。
- `fee quote changed ... gas bound` 表示所要求的輸入意圖和現場報價不同意見.重新預期,而不是修改簽署交易.
- 中斷的部署會將其已簽署的計畫保存在日誌中。請使用 `musubi deploy --resume <JOURNAL>` 復原，而不是簽署新的計畫。
- `is read-only and cannot be invoked as a transaction` 或 `is not a kotoage or lifecycle entrypoint` 表示 `compute` 被送到了呼叫命令。此範例宣告的是 `view fn`，因此請在本機使用 `debug-view`，在 Torii 上使用 `view`。
- 合同呼叫需要正型gas限制.第一次釋出的呼叫合約拒絕最高階別的gas或費用資產後設資料.

## 來源及相關檔案 {#source-and-related-docs}

- [固定提交中的 Kotodama V1 命令實作](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_toolchain/src/bin/koto.rs)
- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/kotodama_lang/src/samples/tuple_return_demo.ko)的雙重返回源樣本
- 固定提交中的 [Musubi 部署命令](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/musubi/src/command_deploy.rs) 與[原生合約部署服務](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_contract_deploy/src/lib.rs)
- [合同整合測試在固定提交上](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/contracts.rs)
- [智慧合同](/zh-hant/blockchain/smart-contracts.md)
- [CLI 引用](/zh-hant/get-started/operate-iroha-via-cli.md)
