---
translation_locale: zh-hant
translation_source: /blockchain/instructions.md
translation_source_hash: adc3eff9758dd73e9114e78eaa18ddf6271db3bc4042611e1ed6ed1aac226246
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 特殊指令 {#iroha-special-instructions}

當我們談到 [如何 Iroha 運營](/zh-hant/blockchain/iroha-explained), 我們說 Iroha 特殊指示是改變世界狀態的唯一方法.我們有什麼特殊指令呢?在本教程中,你已經看到了幾條指令: `Register<Account>` 和 `Mint<Numeric>`.

以下是 Iroha 特殊指示的完整列表:

|指示|描述|
| --------------------------------------------------------- | ------------------------------------------------ |
| [登記/退出登記](#un-register) |給一個 ID 在區塊鏈上的新實體. |
| [硬幣/燃燒](#mint-burn)|硬幣/燃燒數字資產或觸發重複. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |更新區塊鏈對象的元數據.|
| [SetParameter](#setparameter) |設置鏈接寬度參數.|
| [資助/撤銷](#grant-revoke) |給予或刪除權限和角色.|
| [轉移](#transfer)|轉移所有權或資產價值.|
| [本地保證金和資產鎖定](#native-escrow-and-asset-locks) |鎖定數字資產在協議監護.|
| [ExecuteTrigger](#executetrigger) |執行觸發器.|
| [記錄/定製/升級](#other-instructions) |記錄,延長或升級運行時間行爲.|

讓我們從 Iroha 特殊指令的總結開始;每個指令可以調用哪些對象,以及每一個對象可用的指令.

## 總結 {#summary}

對於每一個指令,有一個可以運行該指令的對象列表.例如,轉移變量涵蓋可擁有賬本對象和數值資產,而縮則涵蓋數值資金和觸發重複.

一些指令要求指定目的地.例如,如果你轉移資產,你總是需要指定你將資產轉移到哪個賬戶上.另一方面,當你註冊某件事情時,你只需要註冊的對象.

|指示|物體|目的地|
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |常規域名,數據空間號和帳戶號設置|                      |
| [登記/退出登記](#un-register) |賬戶,資產定義, NFTs,角色,觸發因素,同行;域名移除 |                      |
| [硬幣/燃燒](#mint-burn)|數字資產,觸發重複|賬戶或觸發器|
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |具有 [元數據](./metadata.md)的對象:域名,賬戶,資產定義, NFTs, RWAs,觸發器|                      |
| [SetParameter](#setparameter) |連鎖參數|                      |
| [資助/撤銷](#grant-revoke) | [角色,許可證代碼](/zh-hant/blockchain/permissions.md) |賬戶或角色|
| [轉移](#transfer)|域名,資產定義,數值資產, NFTs|賬戶|
| [本地保證金和資產鎖定](#native-escrow-and-asset-locks) |數字資產保證券,資產鎖定,匿名的保證券承諾 |購物者,目的地或爭端分歧|
| [ExecuteTrigger](#executetrigger) |觸發器|                      |
| [記錄/定製/升級](#other-instructions) |記錄,執行者特定的有效載荷,執行器升級 |                      |

還有另一種方法來看 ISI,從他們觸及的賬本對象方面:

|目標|指示|
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|賬戶|登記/撤銷賬戶,收到資產,更新賬戶元數據,授予/撤銷許可和角色 |
|域名|確保域名設置,取消域名註冊,轉移域名所有權,更新域名元數據.|
|資產定義|登記/退出登記的定義,轉移所有權,更新元數據|
|資產|硬幣/燒傷數量,轉移數量 |
|抵押金|開放,接受,標記發送的支付,釋放,取消,糾紛,解決,撤銷或過期原生保管記錄.|
|NFT|登記/撤銷登記 NFTs,轉讓所有權,更新元數據 |
|RWA|登記批量,轉移數量,保留/釋放,結/解凍,收購,合併,更新元數據和控制|
|觸發器|註冊/取消註冊,硬幣/燃燒觸發重複,執行觸發器,更新觸發器元數據 |
|世界|註冊/取消註冊同行和角色,設置參數,升級執行者 |

## CLI 舉例 {#cli-examples}

本頁面的例子假設您正在從上游 Iroha 工作空間運行命令,而不是默認本地客戶端配置:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

如果您安裝了`iroha`二進制,請使用 `iroha --config ./defaults/client.toml` 相反.

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

當針對公衆時 Taira 測試網,使用一個 Taira 在運行支付費用的例子之前,保存水龍頭助手從 [獲取測試網 XOR 在 Taira](/zh-hant/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) 作爲 `taira_faucet_claim.py`, 然後索賠測試網 XOR 在水龍頭上:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

在頭資產可見之後,添加所需的氣體資產元數據來記錄交易:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias`是創建域名和其 SNS 租的普通首次發佈路徑.它聲明地綁定了確切的數據空間,所有者,租 使用驗證的 `POST /v1/aliases/setup/plan` 終端點或匹配的 CLI 工作流程:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

意圖和計劃是無祕密的,但應用步驟標誌並提交一個普通的交易與配置帳戶. 一個計劃被綁定到其鏈,權威,現實狀態和截止日期;永遠不要再在另一個網絡上使用它.

## (無) 登記 {#un-register}

註冊和退出註冊是向在區塊鏈上新實體發送 ID 的指令.

所有可以註冊的東西都是`Registrable`和`Identifiable`,但不是所有是 `Identifiable`的東西都是 `Registrable`.大多數東西都直接註冊,由於安全性和性能原因,我們使用構建器用於此類數據結構 (例如 `NewAccount`),同行註冊有一個專門的證明所有權說明.

你可以註冊賬戶,資產定義, NFTs, 域名設置使用: `EnsureAlias`; 原料 `Register::Domain` 用於創始/啓動帶.同行註冊使用 `RegisterPeerWithPop`, 檢查我們的密鑰. [命名會議](/zh-hant/reference/naming.md) 瞭解對實體名稱的限制.

RWA 批量是通過專門的 `RegisterRwa`指令創建的.當前代碼不顯示`UnregisterRwa`指令;使用 `RedeemRwa`退休表示數量.

::: info

請注意,根據您如何設置 [基因區塊](/zh-hant/guide/configure/genesis.md)在 `genesis.json`中 (具體來說,是否包括註冊許可證代幣),註冊帳戶的過程可能非常不同.

- 在公共區塊鏈中,任何人都應該能夠註冊帳戶.
- 在私人區塊鏈中,可以有一個單獨的賬戶註冊過程.在典型的私人區塊中,即沒有任何單獨的帳戶註冊進程的區塊鏈裏,你需要一個帳戶才能註冊另一個賬戶.

我們討論這些差異的細節, [比較私人和公共區塊鏈](/zh-hant/guide/configure/modes.md).

:::

::: info

目前,註冊同行是唯一的方式來添加在網絡中非原始可靠同行的同行.

:::

使用特定語言的指南註冊區塊鏈對象:

|語言|指南|
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI|使用 [Iroha CLI](/zh-hant/get-started/operate-iroha-via-cli.md)設置域名和註冊賬戶和資產. |
|Rust|使用[Rust 教程](/zh-hant/guide/tutorials/rust.md). |
|Kotlin/Java |使用[Kotlin/Java教程](/zh-hant/guide/tutorials/kotlin-java.md). |
|Python|使用[Python 教程](/zh-hant/guide/tutorials/python.md). |
|JavaScript/TypeScript |使用[JavaScript/TypeScript 教程 ](/zh-hant/guide/tutorials/javascript.md). |

規劃和應用普通域設置,然後在不再需要時取消域名註冊:

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

登記和註銷賬戶:

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

登記和註銷 NFTs. NFT 登記從標準輸入中讀取其內容 JSON:

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

註冊和取消註冊的觸發器.觸發器註冊需要編譯 IVM 字節碼或串行指令列表.本示例使用 CLI 構建一個 `Log` 指令,並將其輸入到觸發器登記中:

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

註冊和退出註冊的同行. 如果您尚未擁有 BLS 密鑰,則將 PoP 和 `kagami` 發明:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## 薄荷/燃燒 {#mint-burn}

造和燃燒可以指數值資產,並且具有有限的重複數量.某些資產可被宣佈爲不可造,這意味着它們在註冊後只能一次造.

資產註冊到一個特定的賬戶,通常是該帳戶首次註冊資產的.資產數量是非負的,所以你永遠不能擁有 `$-1.0`的資產或燒燬負數量並獲得錢.

使用一個特定語言的指南來造區塊鏈資產:

- [CLI](/zh-hant/get-started/operate-iroha-via-cli.md)
- [Rust](/zh-hant/guide/tutorials/rust.md)
- [Kotlin/Java](/zh-hant/guide/tutorials/kotlin-java.md)
- [Python](/zh-hant/guide/tutorials/python.md)
- [JavaScript/TypeScript](/zh-hant/guide/tutorials/javascript.md)

以下是燃燒資產的例子:

- [CLI](/zh-hant/get-started/operate-iroha-via-cli.md)
- [Rust](/zh-hant/guide/tutorials/rust.md)

硬幣和燃燒數值資產:

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

薄荷和燒傷觸發器重複:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## 轉移 {#transfer}

轉移將所有權或價值在賬戶之間移動.通用轉讓變體涵蓋域名,資產定義,數值資產和 NFTs. RWA 數量流動使用`TransferRwa`和 `ForceTransferRwa`指令所描述的 [Real-World Assets](/zh-hant/blockchain/rwas.md).

爲了做到這一點,必須提供 [資產轉移的許可](/zh-hant/reference/permissions.md). 舉例說明如何轉移資產 [CLI](/zh-hant/get-started/operate-iroha-via-cli.md) 或 [Rust](/zh-hant/guide/tutorials/rust.md).

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

本地保證指令將數字資產鎖定在賬本管理的協議保管中.它們用於市場式結算,通用資產鎖和匿名屏蔽的保證流動.

市場保證金使用 `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, 和 `ResolveEscrowDispute`. 一般資產鎖的使用 `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, 和 `ExpireAssetLock`. 匿名保證人反映了市場的生命週期 `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, 和 `ResolveAnonymousEscrowDispute`.

這些 ISIs 目前沒有一流的 CLI 命令.使用類型 SDK 構建器或序列化指令有效載荷,並參見 [原生資產抵押](/zh-hant/blockchain/escrow.md)爲生命週期詳細信息,權限,查詢,事件和 Rust 示例.

## 資助/撤銷 {#grant-revoke}

授權和撤銷指示用於賬戶 [許可證和角色](permissions.md).

`Grant`用於永久授予用戶單個許可證或一組權限 ("角色").僅通過`Revoke`指令才能刪除所授予的角色和權限.因此,這些指令應謹慎使用.

授予和撤銷一個賬戶的角色:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

授予和撤銷權限代幣.允許命令從標準輸入中讀取一個權限對象:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

授予或撤銷角色的權限:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

這些指令更新對象 [元數據](/zh-hant/blockchain/metadata.md).使用 `SetKeyValue`來插入或取代一個元數據輸入,並用 `RemoveKeyValue`刪除一個.

在 `set` 命令中,從標準輸入中讀取 JSON 的值:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

同樣的模式可用於賬戶,資產定義, NFTs, RWAs,以及觸發因素:

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

`SetParameter`改變了主動數據模型和執行者所暴露的整個鏈參數.

在標準輸入時通過單個參數 JSON 對象設置參數:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

該指令用於執行 [觸發](./triggers.md).

CLI 可以直接記錄觸發器,並訂閱觸發執行事件.它不提供輸入`execute trigger`命令,因此要提交一個 手動 `ExecuteTrigger` 指令,用 SDK 或執行工具生成串行式 `InstructionBox`,並通過 `ledger transaction stdin` 傳輸結果的 JSON 陣列:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## 其他指令 {#other-instructions}

Iroha 還揭示了運行時間和執行器集成的較低級別指示:

- `Log`:在執行過程中發出日誌輸入
- `CustomInstruction`:運輸執行者特定的 JSON 有效載荷
- `Upgrade`:激活執行器升級

提交一個 `Log` 指令與助手:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

提交一個定製執行器指令作爲串行式 `InstructionBox`.有效載荷形狀是執行器特定的,所以使用匹配的 SDK 或執行器工具生成該指令:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

升級執行器從編譯的 IVM 字節碼文件中:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
