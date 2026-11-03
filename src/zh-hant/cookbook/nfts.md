---
translation_locale: zh-hant
translation_source: /cookbook/nfts.md
translation_source_hash: b60c542052eac6a916350c4aaa779c9f46d248be64ecea9c9bda679a4d56dff3
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# NFTs {#nfts}

## 結果 {#outcome}

檢查 Taira NFT 記錄,更新,轉移和查詢一個獨特的資料. NFT 在生成的本地網路上. 工作流程使用一個完全合格的 `name$domain.dataspace` NFT ID 和規範 I105 業主 IDs.

## 預先條件 {#prerequisites}

- `curl`,`jq`, Python 3.11或以後的電流,以及 `iroha` CLI.
- 僅可讀的 Taira 訪問.
- 對於寫入操作，需要一個按照 [啟動 Iroha](/zh-hant/get-started/launch-iroha.md) 的做法以 `kagami localnet generate --peers 4 --out-dir ./localnet` 生成的本地網路，其中包含 `./localnet/client.toml` 和位於 `http://127.0.0.1:8080` 的 Torii，另外還需要一個由其簽署者擁有的 NFT 域名（見步驟 2）。

## 步驟 {#steps}

### 1. 檢查公眾收藏 Taira {#_1-inspect-the-public-taira-collection}

空白頁面是成功讀取的:這意味著請求頁面中沒有可見的 NFTs.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5&include_total=true' \
  | jq '{total, nfts: [.items[] | {id, owned_by, metadata}]}'
```

NFTs 是唯一記錄，而不是數值餘額。它們有一個 ID、一個所有者和一個精簡的內容映射；Torii 集合資料列會將其作為 `metadata` 返回，而 `ledger nft get` 會將其作為 `content` 返回。

### 2. 準備當地所有者 IDs {#_2-prepare-local-owner-ids}

寫入範例需要一個由簽署帳戶擁有的域名，或針對該域名的 `CanRegisterNft` 授權。生成的本地網路不會為其客戶端註冊任何應用程式域名，而直接註冊域名的操作僅保留給創世，因此請將 `NFT_DOMAIN` 設為您的簽署者所控制的 `name.dataspace` 域名。在不暴露私鑰的情況下推導出已設定的授權主體，然後選擇另一個已註冊帳戶作為轉移目的地。

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

`$` 分隔符屬於 NFT 的文字形式。在 ID 中保留完整的 `name.dataspace` 域名。

### 3. 登記 NFT 的初始含量 {#_3-register-the-nft-with-initial-content}

CLI 從標準輸入中讀取最初的 JSON 物件.當前的授權主體機構成為所有者.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. 更新內容映射 {#_4-update-the-content-map}

後設資料值是 JSON。設定一個鍵會插入或取代該項目，而不會取代整個 NFT 記錄。

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. 轉讓所有權 {#_5-transfer-ownership}

供應既規範 I105 帳戶 IDs. 一個別名必須在被使用之前解決 `--from` 或 `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning 許可範圍

在 Taira 上，每次寫入都使用 `--fee-payer authority`；CLI 會在簽署前給出以 Taira 費用資產計價的確切費用報價。註冊、轉移、移除和後設資料更新由目前生效的執行環境檢查（預設許可權介面中的 `CanRegisterNft`、`CanTransferNft`、`CanUnregisterNft` 和 `CanModifyNftMetadata`）。請使用您的帳戶擁有的域名，或您的帳戶持有這些授權的域名。

:::

在合同所有的工作流程中, Kotodama 顯示輸入 NFT 主機呼叫.以下是透過固定 IVM 文件測試編譯和執行的精確生命週期測試資料:

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

兩個固定的 I105 值是上游專案的測試資料；測試框架會在執行前註冊目的帳戶。它們並非 CLI 操作指南中的 `CURRENT_OWNER` 和 `NEW_OWNER`。對於應用程式合約，請提供其實際的規範帳戶，然後透過[智慧型合約](./smart-contracts.md)編譯、測試、部署並呼叫。請勿向 Taira 提交未經審查的位元組碼；合約執行仍須通過執行階段授權。

## 驗證 {#verify}

直接閱讀 NFT,並確認其所有者改變了,而其內容仍然附上:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

CLI 會直接列印 NFT 記錄本身。可作為依據的不變量是 `id`、`owned_by` 和 `content`。

## 解決問題 {#troubleshooting}

- `name$domain`可以預設地在某些解析器中使用通用資料空間,但書籍和應用程式 IDs 應使用明確的 `name$domain.dataspace`形式.
- 拒絕重複登記同一個 NFT ID. 使用新 localnet 或選擇穩定新的 ID 來進行單獨的記錄.
- 在標準輸入時,輸入後設資料必須是有效的 JSON.沒有引用 JSON 的鏈不是後設資料值.
- 由目前所有者以外的帳戶簽署的轉移，需要擁有該 NFT 的域名或具備確切的 `CanTransferNft` 授權；更改 `--from` 不會改變簽署者。
- 轉移只會變更 `owned_by`。後設資料更新和取消註冊仍由域名所有者，或持有該 NFT 的 `CanModifyNftMetadata` 或 `CanUnregisterNft` 的帳戶負責；新所有者可以再將其轉移出去。
- Taira 可以返回空白的 NFT 收藏.不要將`items: []`作為證明 NFT 指令不可使用的證明

## 來源及相關檔案 {#source-and-related-docs}

- [NFT 整合測試在固定的提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/nft.rs)
- [Kotodama NFT 在固定提交時進行主機呼叫測試](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [確切的 Kotodama NFT 生命週期測試資料在定提交](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/docs/examples/12_nft_flow.ko)
- [固定提交中的 Kotodama 文件範例測試](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_documentation_examples.rs)
- [NFTs](/zh-hant/blockchain/nfts.md)
- [超值資料](/zh-hant/blockchain/metadata.md)
- [指示](/zh-hant/blockchain/instructions.md)
- [許可證代幣](/zh-hant/reference/permissions.md)
