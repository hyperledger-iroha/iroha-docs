---
translation_locale: zh-hant
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

Iroha NFT 是一個具有一個所有者的獨特賬本對象. 使用 NFTs 當記錄需要自己的身份,元數據,生命週期事件和所有權轉移語義時,但不需要數字平衡時.

與數值 [資產](/zh-hant/blockchain/assets.md)不同,一個 NFT 沒有精度,可選性或每賬戶的數量. NFT 存在爲一個註冊對象,所有權直接追蹤該對象.

## 結構 {#structure}

已註冊的 `Nft` 包含:

- `id`:一個 `NftId`
- `content`:描述 NFT 的元數據
- `owned_by`:持有 NFT 的賬戶

`content`字段是`Metadata`地圖.保持緊:存儲描述字段,穩定引用,哈希, URIs 或 SoraFS 路徑在那裏.存儲大型文件,媒體或高率的應用狀態離鏈,並只在 NFT 上保存可驗證的參考.

## 在 Taira 試看. {#try-it-on-taira}

檢查公開 Taira 測試網是否目前擁有 NFT 記錄:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

查看節點暴露的 NFT 路線的現場 OpenAPI 文檔:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

虛空的 `items`陣列是公共測試網上的有效響應.這意味着當前頁面中沒有 NFTs,而不是說 NFT 指令不可用.

## NFT IDs {#nft-ids}

`NftId`使用以下文本表格:

```text
name$domain
name$domain.dataspace
```

例如, `badge$docs.universal` 在 `docs.universal` 域中識別`badge` NFT.如果遺漏數據空間,當前的解析器使用`universal` 數據空間,因此 `badge$docs` 解決爲`badge$docs.universal`.

使用 NFT IDs 的穩定名稱. ID 是指令,查詢,權限,事件過器和應用參考所使用的對象身份.

## 生命週期 {#lifecycle}

NFT 生命週期運營使用 Iroha 特殊指示:

- [`Register`](/zh-hant/blockchain/instructions.md#un-register)創建 NFT 的初始 `content`.
- [`Unregister`](/zh-hant/blockchain/instructions.md#un-register)刪除了 NFT.
- [`Transfer`](/zh-hant/blockchain/instructions.md#transfer)`owned_by`的變化
- [`SetKeyValue`和 `RemoveKeyValue`](/zh-hant/blockchain/instructions.md#setkeyvalue-removekeyvalue)更新的 NFT 元數據.

## 在本地試看 {#try-it-locally}

這些例子假設您已經啓動了本地網絡,並從 [CLI 指南](/zh-hant/get-started/operate-iroha-via-cli.md)生成的客戶端配置:

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

生成的本地網絡已經設置了 `wonderland.universal` 和其 SNS 要使用不同的域名,首先用聲明符創建一個域名 `app alias setup plan` 和 `app alias setup apply` 工作流程 [域名](/zh-hant/blockchain/domains.md#registration).

註冊一個 NFT.註冊從標準輸入中讀取初始內容 JSON:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

直接檢查 NFT,然後列出所有 NFTs,包含全部條目:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

添加一個元數據鍵,然後再次讀取 NFT:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

刪除元數據密鑰:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

選擇地轉移 NFT.使用`ledger nft get`來讀取當前所有者從 `owned_by`,並使用`ledger account list all`找到目的地賬戶 ID.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

通過後刪除例 NFT. 如果您將其轉移,則要麼將它轉移回來,要麼提交與當前所有者帳戶配置的非註冊命令.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## 問題和事件 {#queries-and-events}

使用[`FindNfts`](/zh-hant/reference/queries.md#assets-nfts-and-rwas)列出 NFTs 和[`FindNftsByAccountId`](/zh-hant/reference/queries.md#assets-nfts-and-rwas)列出由賬戶所有的 NFTs.

NFT 註冊,刪除,傳輸和元數據更新發出 NFT 數據事件. 訂閱本書變更或構建反應 NFT 生命週期事件時使用`Nft`數據事件過器.

## 許可證 {#permissions}

默認授權表面包括 NFT 特定的代幣:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

通過活躍的運行時間驗證器執行許可檢查,因此一個網絡可通過升級執行器來定製授權. [許可證代碼](/zh-hant/reference/permissions.md) 對於當前默認代幣列表.

## 選擇 NFTs {#choosing-nfts}

使用 NFT 用於特殊性和所有權的記錄:

- 證書,章,許可證和證明
- 成員身份或訪問記錄
- 身份相關或賬戶所有的申請記錄
- 鏈外媒體,文檔或公佈的引用

使用數值資產用於可存餘額,並且使用簡單的 [元數據](/zh-hant/blockchain/metadata.md),當數據只是現有賬本對象的一種緊屬性.

此外,請參見:

- [資產](/zh-hant/blockchain/assets.md)
- [超值數據](/zh-hant/blockchain/metadata.md)
- [指示](/zh-hant/blockchain/instructions.md)
- [查詢](/zh-hant/blockchain/queries.md)
