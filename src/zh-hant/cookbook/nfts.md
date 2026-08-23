---
translation_locale: zh-hant
translation_source: /cookbook/nfts.md
translation_source_hash: f34043c1940b556439c23de7decc5e79f198f52eca8517dd8a9a5892d997e211
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

## 結果 {#outcome}

檢查 Taira NFT 記錄,更新,轉移和查詢一個獨特的數據. NFT 在生成的本地網絡上. 工作流程使用一個完全合格的 `name$domain.dataspace` NFT ID 和法典 I105 業主 IDs.

## 預先條件 {#prerequisites}

- `curl`,`jq`, Python 3.11或以後的電流,以及 `iroha` CLI.
- 僅可讀的 Taira 訪問.
- 爲了寫作,一個由 [發射 Iroha](/zh-hant/get-started/launch-iroha.md), 與 `./localnet/client.toml` 和 Torii 在 `http://127.0.0.1:8080`.

## 步驟 {#steps}

### 1. 檢查公衆收藏 Taira {#_1-inspect-the-public-taira-collection}

空白頁面是成功讀取的:這意味着請求頁面中沒有可見的 NFTs.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs 是獨特的記錄,而不是數值平衡.它們有一個 ID,一個擁有者和一個緊的`content`元數據地圖.

### 2. 準備當地所有者 IDs {#_2-prepare-local-owner-ids}

編寫示例使用登錄的 `wonderland.universal`域名. 在不暴露其私鑰的情況下導出配置權威,然後選擇另一個註冊帳戶作爲轉移目的地.

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

`$`分區器屬於 NFT 文本表格. 保持完整的 `wonderland.universal`域和數據空間後.

### 3. 登記 NFT 的初始含量 {#_3-register-the-nft-with-initial-content}

CLI 從標準輸入中讀取最初的 JSON 對象.當前的權威機構成爲所有者.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. 更新內容地圖 {#_4-update-the-content-map}

基數據值爲 JSON.設置一個鍵插入或取代該單項;它不會取代整個 NFT 記錄.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. 轉讓所有權 {#_5-transfer-ownership}

供應既正規 I105 賬戶 IDs. 一個別名必須在被使用之前解決 `--from` 或 `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning 許可範圍

在 Taira, 每個寫作都需要 `--metadata ./taira.tx-metadata.json` 登記,轉移,刪除和元數據更新由活躍的運行時間檢查 (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft`, 和 `CanModifyNftMetadata` 在默認權限表面上) 使用爲您的應用程序分配的一個域名或在 localnet 上保存這個通行.

:::

在合同所有的工作流程中, Kotodama 顯示輸入 NFT 主機調用.以下是通過固定 IVM 文檔測試編譯和執行的精確生命週期設置:

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

兩個固定的 I105 值是上游測試裝置;帶在執行前會記錄目的地.它們不是`CURRENT_OWNER`和`NEW_OWNER`從 CLI 通行道.對於應用程序合同,提供其實際的法規帳戶,然後編譯,測試,部署並通過 [智能合約](./smart-contracts.md)調用它.不要向 Taira 提交未經審查的字節碼,並且記住,執行合同仍然需要運行時間授權.

## 驗證 {#verify}

直接閱讀 NFT,並確認其所有者改變了,而其內容仍然附上:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

如果 CLI 將記錄包裹在輸出包裝中,請一次檢查 JSON 並將該聲明應用於包含的 NFT 對象. 權威變量爲 `id`, `owned_by`和 `content`.

## 解決問題 {#troubleshooting}

- `name$domain`可以默認地在某些解析器中使用通用數據空間,但書籍和應用程序 IDs 應使用明確的 `name$domain.dataspace`表格.
- 拒絕重複登記同一個 NFT ID. 使用新 localnet 或選擇穩定新的 ID 來進行單獨的記錄.
- 在標準輸入時,輸入元數據必須是有效的 JSON.沒有引用 JSON 的鏈不是元數據值.
- 一個由現有所有者以外的賬戶簽署的轉讓需要準確的許可;改變 `--from`不會改變簽署者的身份.
- 轉移後,原始客戶端可能不再被允許突變或取消 NFT 註冊. 使用新所有者的簽名器或授權的控制者.
- Taira 可以返回空白的 NFT 收藏.不要將`items: []`作爲證明 NFT 指令不可使用的證據

## 來源及相關文件 {#source-and-related-docs}

- [NFT 集成測試在固定的承諾](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/nft.rs)
- [Kotodama NFT 在固定提交時進行主機調用測試](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [確切的 Kotodama NFT 生命週期固定在定提交](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/zh-hant/blockchain/nfts.md)
- [超值數據](/zh-hant/blockchain/metadata.md)
- [指示](/zh-hant/blockchain/instructions.md)
- [許可證代幣](/zh-hant/reference/permissions.md)
