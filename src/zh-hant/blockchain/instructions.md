---
translation_locale: zh-hant
translation_source: /blockchain/instructions.md
translation_source_hash: ade5ba2b693de7e798490be0947099d0306d9565b88550e201dccd181810fb18
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Iroha 特殊指令 {#iroha-special-instructions}

當我們談到 [如何 Iroha 運營](/zh-hant/blockchain/iroha-explained), 我們說 Iroha 特殊指示是改變世界狀態的唯一方法.我們有什麼特殊指令呢?在本教程中,你已經看到了幾條指令: `Register<Account>` 和 `Mint<Numeric>`.

以下是 Iroha 特殊指示的完整列表:

|指示|描述|
| --------------------------------------------------------- | ------------------------------------------------ |
| [登記/退出登記](#un-register) |給一個 ID 在區塊鏈上的新實體. |
| [Mint/Burn](#mint-burn)|鑄造/銷毀數字資產或觸發重複. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |更新區塊鏈物件的後設資料.|
| [SetParameter](#setparameter) |設定連結寬度引數.|
| [Grant/Revoke](#grant-revoke) |給予或刪除許可權和角色.|
| [轉移](#transfer)|轉移所有權或資產價值.|
| [本地託管和資產鎖定](#native-escrow-and-asset-locks) |鎖定數字資產在協議監護.|
| [原子私密結算](#atomic-private-settlement) | 管理機密 pool 與原子套件。 |
| [ExecuteTrigger](#executetrigger) |執行觸發器.|
| [Log/Custom/Upgrade](#other-instructions) |記錄,延長或升級執行階段行為.|

讓我們從 Iroha 特殊指令的總結開始;每個指令可以呼叫哪些物件,以及每一個物件可用的指令.

## 總結 {#summary}

對於每一個指令,有一個可以執行該指令的物件列表.例如,轉移變數涵蓋可擁有賬本物件和數值資產,而縮則涵蓋數值資金和觸發重複.

一些指令要求指定目的地.例如,如果你轉移資產,你總是需要指定你將資產轉移到哪個帳戶上.另一方面,當你註冊某件事情時,你只需要註冊的物件.

|指示|物體|目的地|
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |普通域名,資料空間號和帳戶號設定|                      |
| [登記/退出登記](#un-register) |帳戶,資產定義, NFTs,角色,觸發因素,對等節點;域名移除 |                      |
| [Mint/Burn](#mint-burn)|數字資產,觸發重複|帳戶或觸發器|
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |具有 [後設資料](./metadata.md)的物件:域名,帳戶,資產定義, NFTs, RWAs,觸發器|                      |
| [SetParameter](#setparameter) |連鎖引數|                      |
| [Grant/Revoke](#grant-revoke) | [角色,許可證程式碼](/zh-hant/blockchain/permissions.md) |帳戶或角色|
| [轉移](#transfer)|域名,資產定義,數值資產, NFTs|帳戶|
| [本地託管和資產鎖定](#native-escrow-and-asset-locks) |數字資產保證券,資產鎖定,匿名的保證券承諾 |購物者,目的地或爭端分歧|
| [原子私密結算](#atomic-private-settlement) | 繫結精確路由的機密 pool、政策輪替、已完成套件及中止標記 | |
| [ExecuteTrigger](#executetrigger) |觸發器|                      |
| [Log/Custom/Upgrade](#other-instructions) |記錄,執行者特定的有效載荷,執行器升級 |                      |

還有另一種方法來看 ISI,從他們觸及的賬本物件方面:

|目標|指示|
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|帳戶|登記/撤銷帳戶,收到資產,更新帳戶後設資料,授予/撤銷許可和角色 |
|域名|確保域名設定,取消域名註冊,轉移域名所有權,更新域名後設資料.|
|資產定義|登記/退出登記的定義,轉移所有權,更新後設資料|
|資產|鑄造/銷毀數量,轉移數量 |
|抵押金|開放,接受,標記傳送的支付,釋放,取消,糾紛,解決,撤銷或過期原生保管記錄.|
|NFT|登記/撤銷登記 NFTs,轉讓所有權,更新後設資料 |
|RWA|登記批次,轉移數量,保留/釋放,結/解凍,收購,合併,更新後設資料和控制|
|觸發器|註冊/取消註冊,鑄造/銷毀觸發重複,執行觸發器,更新觸發器後設資料 |
|世界|註冊/取消註冊對等節點和角色,設定引數,升級執行者 |

## CLI 舉例 {#cli-examples}

本頁範例假設您從上游 Iroha 工作區執行命令，並以預設的本機使用者端設定為目標：

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

如果已安裝 `iroha` 二進位檔，請改用 `iroha --config ./defaults/client.toml`。請將下列預留位置替換為您網路中的值：

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

當針對公眾時 Taira 測試網,使用一個 Taira 在執行支付費用的例子之前,儲存水龍頭助手從 [獲取測試網 XOR 在 Taira](/zh-hant/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) 作為 `taira_faucet_claim.py`, 然後索賠測試網 XOR 在水龍頭上:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

在頭資產可見之後,新增所需的gas資產後設資料來記錄交易:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` 是首個版本中建立網域及其 SNS 租約的普通路徑。它以宣告方式繫結確切的資料空間、擁有者、租期和報價保護，然後以原子方式建立或修復所有必要狀態。請使用經過驗證的 `POST /v1/aliases/setup/plan` 端點或對應的 CLI 工作流程：

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

意圖和計劃是無秘密的,但應用步驟標誌並提交一個普通的交易與配置帳戶. 一個計劃被繫結到其鏈,授權主體,現實狀態和截止日期;永遠不要再在另一個網路上使用它.

## (無) 登記 {#un-register}

註冊和退出註冊是向在區塊鏈上新實體傳送 ID 的指令.

所有可註冊的專案同時是 `Registrable` 和 `Identifiable`，但不是所有 `Identifiable` 專案都是 `Registrable`。大多數專案可直接註冊，但在某些情況下，區塊鏈中的表示包含多得多的資料。出於安全性與效能考量，我們對這類資料結構使用 builder（例如 `NewAccount`），而對等節點註冊另有專用的持有證明指令。一般而言，任何可註冊的專案也都可以取消註冊，但這不是絕對規則。

您可以註冊帳戶、資產定義、NFTs、對等節點、角色和觸發器。Domain 設定使用 `EnsureAlias`；原始 `Register::Domain` payload 保留給 genesis/bootstrap。對等節點註冊使用 `RegisterPeerWithPop`，其中包含對等節點金鑰的持有證明。請參閱[命名慣例](/zh-hant/reference/naming.md)，瞭解實體名稱的限制。

RWA 批次是透過專門的 `RegisterRwa`指令建立的.當前程式碼不顯示`UnregisterRwa`指令;使用 `RedeemRwa`登出所表示的數量.

::: info

請注意，根據您如何在 `genesis.json` 中設定[創世區塊](/zh-hant/guide/configure/genesis.md)（尤其是是否包含許可權權杖的註冊），註冊帳戶的流程可能大不相同。一般而言，可總結如下：

- 在公共區塊鏈中,任何人都應該能夠註冊帳戶.
- 在私人區塊鏈中,可以有一個單獨的帳戶註冊過程.在典型的私人區塊中,即沒有任何單獨的帳戶註冊程序的區塊鏈裡,你需要一個帳戶才能註冊另一個帳戶.

我們討論這些差異的細節, [比較私人和公共區塊鏈](/zh-hant/guide/configure/modes.md).

:::

::: info

目前,註冊對等節點是唯一的方式來新增在網路中非原始可靠對等節點的對等節點.

:::

使用特定語言的指南註冊區塊鏈物件:

|語言|指南|
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI|使用 [Iroha CLI](/zh-hant/get-started/operate-iroha-via-cli.md)設定域名和註冊帳戶和資產. |
|Rust|使用[Rust 教程](/zh-hant/guide/tutorials/rust.md). |
|Kotlin/Java |使用[Kotlin/Java](/zh-hant/guide/tutorials/kotlin-java.md). |
|Python|使用[Python 教程](/zh-hant/guide/tutorials/python.md). |
|JavaScript/TypeScript |使用[JavaScript/TypeScript](/zh-hant/guide/tutorials/javascript.md). |

規劃和應用普通域設定,然後在不再需要時取消域名註冊:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain unregister --id docs.universal
```

登記和登出帳戶:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

註冊和退出註冊資產定義:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition register \
  --id "$ASSET_DEF" \
  --name docs_token \
  --alias docs_token#docs.universal \
  --scale 0

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition unregister --id "$ASSET_DEF"
```

登記和登出 NFTs. NFT 登記從標準輸入中讀取其內容 JSON:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

登記和退出登記的角色:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

註冊和取消註冊的觸發器.觸發器註冊需要編譯 IVM 位元組碼或序列指令列表.本示例使用 CLI 構建一個 `Log` 指令,並將其輸入到觸發器登記中:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml -o \
  ledger transaction ping --log-level INFO --msg "hourly cleanup" |
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger register --id hourly_cleanup \
  --instructions-stdin \
  --filter time \
  --time-start 5m \
  --time-period-ms 3600000

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger unregister --id hourly_cleanup
```

註冊和退出註冊的對等節點. 如果您尚未擁有 BLS 金鑰,則將 PoP 和 `kagami` 發明:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./peer-key
PEER_KEY=$(tr -d '\n' < ./peer-key/public.key)
PEER_POP=$(tr -d '\n' < ./peer-key/pop.hex)

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## 鑄造/銷毀 {#mint-burn}

鑄造和銷毀可以指數值資產,並且具有有限的重複數量.某些資產可被宣佈為不可鑄造,這意味著它們在註冊後只能鑄造一次.

資產註冊到一個特定的帳戶,通常是該帳戶首次註冊資產的.資產數量是非負的,所以你永遠不能擁有 `$-1.0`的資產或燒燬負數量並獲得錢.

使用一個特定語言的指南來造區塊鏈資產:

- [CLI](/zh-hant/get-started/operate-iroha-via-cli.md)
- [Rust](/zh-hant/guide/tutorials/rust.md)
- [Kotlin/Java](/zh-hant/guide/tutorials/kotlin-java.md)
- [Python](/zh-hant/guide/tutorials/python.md)
- [JavaScript/TypeScript](/zh-hant/guide/tutorials/javascript.md)

以下是銷毀資產的例子:

- [CLI](/zh-hant/get-started/operate-iroha-via-cli.md)
- [Rust](/zh-hant/guide/tutorials/rust.md)

鑄鑄造和銷毀數值資產:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset mint \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 100

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset burn \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 10
```

鑄鑄造和銷毀觸發器重複:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## 轉移 {#transfer}

轉移將所有權或價值在帳戶之間移動.通用轉讓變體涵蓋域名,資產定義,數值資產和 NFTs. RWA 數量流動使用`TransferRwa`和 `ForceTransferRwa`指令所描述的 [現實世界資產](/zh-hant/blockchain/rwas.md).

為了做到這一點,必須提供 [資產轉移的許可](/zh-hant/reference/permissions.md). 舉例說明如何轉移資產 [CLI](/zh-hant/get-started/operate-iroha-via-cli.md) 或 [Rust](/zh-hant/guide/tutorials/rust.md).

轉移數值資產:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

轉讓域名,資產定義和 NFT 所有權:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## 產業保險和資產鎖 {#native-escrow-and-asset-locks}

本地保證指令將數字資產鎖定在賬本管理的協議保管中.它們用於市場式結算,通用資產鎖和匿名遮蔽的保證流動.

市場託管使用 `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, 和 `ResolveEscrowDispute`. 一般資產鎖的使用 `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, 和 `ExpireAssetLock`. 匿名託管反映了市場的生命週期 `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, 和 `ResolveAnonymousEscrowDispute`.

這些 ISIs 目前沒有一流的 CLI 命令.使用型別 SDK 構建器或序列化指令有效載荷,並參見 [原生資產抵押](/zh-hant/blockchain/escrow.md)為生命週期詳細資訊,許可權,查詢,事件和 Rust 示例.

## 原子私密結算 {#atomic-private-settlement}

受治理的原子私密結算指令與透明的 Native AMX 相互獨立。`ActivatePrivateSettlementPoolV1` 根據經刪減的治理投影與規範來源承諾，為精確路由建立一個機密 `pool`。`FinalizeAtomicPrivateSettlementV1` 以原子方式套用由所有參與委員會認證的完整套件。`AbortAtomicPrivateSettlementV1` 僅釋出經發起方授權的公開終止標記。

只有隱私治理可以執行 `RotatePrivateSettlementPoolPolicyV1`。此指令要求與目前治理摘要完全相符；它保留路由、`pool`、資產繫結承諾、狀態前緣、重放集合及已完成收據，將公開修訂版加一，並使用較新的稽核者金鑰 epoch。輪替在指令納入的高度生效，同一路由與 `pool` 的收據不得在該高度完成。公開修訂版譜系使輪替前完成的收據在重啟後仍然有效，且完全相同的重放具有冪等性。啟用時仍在處理的舊政策套件會在變更狀態前以 fail-closed 方式失敗。營運者必須保留舊解密金鑰，或在銷毀金鑰前，以治理程式重新包裝膠囊並驗證結果。

此路徑預設停用，尚未透過正式環境資格驗證。設定、許可權、稽核、復原與釋出要求請參閱[執行跨資料空間原子私密結算](/get-started/atomic-private-settlement)。

## 授予/撤銷 {#grant-revoke}

授權和撤銷指示用於帳戶 [許可證和角色](permissions.md).

`Grant`用於永久授予使用者單個許可證或一組許可權 ("角色").僅透過`Revoke`指令才能刪除所授予的角色和許可權.因此,這些指令應謹慎使用.

授予和撤銷一個帳戶的角色:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

授予和撤銷許可權代幣.允許命令從標準輸入中讀取一個許可權物件:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

授予或撤銷角色的許可權:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

這些指令更新物件 [後設資料](/zh-hant/blockchain/metadata.md).使用 `SetKeyValue`來插入或取代一個後設資料輸入,並用 `RemoveKeyValue`刪除一個.

在 `set` 命令中,從標準輸入中讀取 JSON 的值:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

同樣的模式可用於帳戶,資產定義, NFTs, RWAs,以及觸發因素:

```bash
printf '{"display_name":"Alice"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account meta set --id "$ALICE" --key profile

printf '{"issuer":"docs"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition meta set --id "$ASSET_DEF" --key issuer

printf '{"color":"blue"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft meta set --id 'badge$docs.universal' --key traits

printf '{"owner":"ops"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger meta set --id hourly_cleanup --key owner
```

## `SetParameter` {#setparameter}

`SetParameter`改變了主動資料模型和執行者所暴露的整個鏈引數.

在標準輸入時透過單個引數 JSON 物件設定引數:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

該指令用於執行 [觸發](./triggers.md).

CLI 可以直接記錄觸發器,並訂閱觸發執行事件.它不提供輸入`execute trigger`命令,因此要提交一個 手動 `ExecuteTrigger` 指令,用 SDK 或執行工具生成序列式 `InstructionBox`,並透過 `ledger transaction stdin` 傳輸結果的 JSON 陣列:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## 其他指令 {#other-instructions}

Iroha 還揭示了執行階段和執行器整合的較低階別指示:

- `Log`:在執行過程中發出日誌輸入
- `CustomInstruction`:運輸執行者特定的 JSON 有效載荷
- `Upgrade`:啟用執行器升級

提交一個 `Log` 指令與助手:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

提交一個定製執行器指令作為序列式 `InstructionBox`.有效載荷形狀是執行器特定的,所以使用匹配的 SDK 或執行器工具生成該指令:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

升級執行器從編譯的 IVM 位元組碼檔案中:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
