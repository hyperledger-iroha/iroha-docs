---
translation_locale: zh-hant
translation_source: /cookbook/nfts.md
translation_source_hash: db99dab483d4e2fb3fd84be84f6e4ef9f8373f0c16eb2f34952f1232c4587561
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

## 結果 {#outcome}

檢查 Taira NFT 記錄,更新,轉移和查詢一個獨特的資料. NFT 在生成的本地網路上. 工作流程使用一個完全合格的 `name$domain.dataspace` NFT ID 和規範 I105 業主 IDs.

## 預先條件 {#prerequisites}

- `curl`,`jq`, Python 3.11或以後的電流,以及 `iroha` CLI.
- 僅可讀的 Taira 訪問.
- 對於寫入操作,一個由 [啟動 Iroha](/zh-hant/get-started/launch-iroha.md), 與 `./localnet/client.toml` 和 Torii 在 `http://127.0.0.1:8080`.

## 步驟 {#steps}

### 1. 檢查公眾收藏 Taira {#_1-inspect-the-public-taira-collection}

空白頁面是成功讀取的:這意味著請求頁面中沒有可見的 NFTs.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs 是唯一記錄，而不是數值餘額。它們有一個 ID、一個所有者和一個精簡的 `content` 後設資料映射。

### 2. 準備當地所有者 IDs {#_2-prepare-local-owner-ids}

編寫示例使用登入的 `wonderland.universal`域名. 在不暴露其私鑰的情況下匯出配置授權主體,然後選擇另一個註冊帳戶作為轉移目的地.

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

`$`分割槽器屬於 NFT 文字形式. 保持完整的 `wonderland.universal`域和資料空間後.

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

在 Taira, 每次寫入都需要 `--metadata ./taira.tx-metadata.json` 登記,轉移,刪除和後設資料更新由活躍的執行階段檢查 (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft`, 和 `CanModifyNftMetadata` 在預設許可權表面上) 使用為您的應用程式分配的一個域名或在 localnet 上儲存這個通行.

:::

在合同所有的工作流程中, Kotodama 顯示輸入 NFT 主機呼叫.以下是透過固定 IVM 文件測試編譯和執行的精確生命週期測試資料:

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

如果 CLI 將記錄封裝在輸出包裝中,請一次檢查 JSON 並將該宣告應用於包含的 NFT 物件. 權威變數為 `id`, `owned_by`和 `content`.

## 解決問題 {#troubleshooting}

- `name$domain`可以預設地在某些解析器中使用通用資料空間,但書籍和應用程式 IDs 應使用明確的 `name$domain.dataspace`形式.
- 拒絕重複登記同一個 NFT ID. 使用新 localnet 或選擇穩定新的 ID 來進行單獨的記錄.
- 在標準輸入時,輸入後設資料必須是有效的 JSON.沒有引用 JSON 的鏈不是後設資料值.
- 一個由現有所有者以外的帳戶簽署的轉讓需要準確的許可;改變 `--from`不會改變簽署者的身份.
- 轉移後,原始客戶端可能不再被允許突變或取消 NFT 註冊. 使用新所有者的簽名器或授權的控制者.
- Taira 可以返回空白的 NFT 收藏.不要將`items: []`作為證明 NFT 指令不可使用的證明

## 來源及相關檔案 {#source-and-related-docs}

- [NFT 整合測試在固定的提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT 在固定提交時進行主機呼叫測試](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [確切的 Kotodama NFT 生命週期測試資料在定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/zh-hant/blockchain/nfts.md)
- [超值資料](/zh-hant/blockchain/metadata.md)
- [指示](/zh-hant/blockchain/instructions.md)
- [許可證代幣](/zh-hant/reference/permissions.md)
