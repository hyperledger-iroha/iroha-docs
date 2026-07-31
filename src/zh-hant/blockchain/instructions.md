---
translation_locale: zh-hant
translation_source: /blockchain/instructions.md
translation_source_hash: 3251078b2b2268ff78563c02a0f935c63dc0569f0b6d38071150cbb4b89394d6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 特別指示 {#iroha-special-instructions}

當我們談到 [如何使用 Iroha 經營](/zh-hant/blockchain/iroha-explained), 我們
這就是我說的 Iroha 特別指令是改變世界唯一的方法
請問我們有什麼特殊指令?
這篇教程的語言指南,
指示: `Register<Account>` 及其他 `Mint<Numeric>`.

這裡是完整的列表. Iroha 特別指示:

| 指示時間                                               | 描述                                     |
| --------------------------------------------------------- | ------------------------------------------------ |
| [註冊/退出注冊](#un-register)                       | 給我一個訊息 ID 在網路上建立新的實體.    |
| [薄荷/燃燒](#mint-burn)                                   | 硬幣/燃燒數值或引發重複. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | 更新區塊對象元數據.               |
| [SetParameter](#setparameter)                             | 設定一個連鎖寬度參數.                      |
| [授予/撤銷](#grant-revoke)                             | 提供或移除權限和角色.            |
| [轉移](#transfer)                                     | 轉移所有權或資產價值.               |
| [內存保證和資產鎖](#native-escrow-and-asset-locks) | 鎖定數字資產,     |
| [ExecuteTrigger](#executetrigger)                         | 執行啟動器.                                |
| [登記/定制/升級](#other-instructions)                 | 記錄,延伸或升級運行時間行為.        |

我們要從總結一下: Iroha 特別指令;各項目的
請問各位有哪些指令,
這樣的東西.

## 總結 {#summary}

每個指令都有列表這些指令使用的對象
例如,傳輸變量覆蓋可擁有的帳簿對象
數字資產和數字資产,而採礦覆蓋數字資質和引發器
這樣的重複.

有些指示要求指定目的地.
你將資產轉移,
另一方面,當你記錄某件事時,
您只需要註冊的對象.

| 指示時間                                               | 標籤:                                                                                                 | 目的地          |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias)                               | 通常域名,數據空間-alias和帳戶-alias設定                                                 |                      |
| [註冊/退出注冊](#un-register)                       | 帳戶,資產定義, NFTs, 角色,触發器,同行;域名移除                                |                      |
| [薄荷/燃燒](#mint-burn)                                   | 數值資產,引發重複                                                                     | 帳戶或引發因素 |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | 那些具有 [數據](./metadata.md): 域名,帳戶,資產定義, NFTs, RWAs, 引發器 |                      |
| [SetParameter](#setparameter)                             | 鎖線參數                                                                                        |                      |
| [授予/撤銷](#grant-revoke)                             | [角色,許可令牌](/zh-hant/blockchain/permissions.md)                                                  | 帳戶或角色    |
| [轉移](#transfer)                                     | 域名,資產定義,數值資產, NFTs                                                        | 帳戶             |
| [內存保證和資產鎖](#native-escrow-and-asset-locks) | 數字資產保證,資產鎖定,匿名保證承諾                                    | 購買者,目的地或爭議分歧 |
| [ExecuteTrigger](#executetrigger)                         | 引發器                                                                                                |                      |
| [登記/定制/升級](#other-instructions)                 | 記錄,執行器特定的有效負荷,執行器升級                                                     |                      |

還有另一種觀點. ISI, 在帳簿對象方面
他們會觸摸:

| 目標           | 指示                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| 帳戶          | 註冊/撤銷帳戶,收到資產,更新帳戶元數據,授予/撤回許可及角色    |
| 域名           | 確保域名設定,不註冊域名,轉移域名所有權,更新域名元數據                    |
| 資產的定義 | 註冊/退出注冊的定義,轉移所有權,更新元數據                                         |
| 資產            | 硬幣/燃燒數量,轉移數量                                                        |
| 預約金           | 公開,接受,記錄發送的付款,釋放,取消,爭議,解決,撤銷或截止日期的本地保管紀錄 |
| NFT              | 註冊/取消注冊 NFTs, 轉移所有權,更新元數據                                                |
| RWA              | 記錄批量,轉移數量,保留/釋放,凍結/解凍,換取,合併,更新元數據和控制 |
| 引發器          | 註冊/取消注冊,票/燃燒引擎重複,執行引擎,更新引擎元數據                 |
| 世界            | 註冊/取消注冊同行和角色,設定參數,升級執行器                                    |

## CLI 舉例 {#cli-examples}

這頁的例子假設您正在從上流執行命令
Iroha 工作空間與默認本地客戶端配置:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

如果您安裝了 `iroha` 單元,使用
`iroha --config ./defaults/client.toml` 而是替代位居者.
以下是您的網路值:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

針對公眾的情況 Taira 檢測網,使用一 Taira 客戶端配置.
在執行付費的例子之前,
[獲得測試網 XOR 在 Taira](/zh-hant/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
這樣的 `taira_faucet_claim.py`, 接著要求測試網 XOR 在水龙头上:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

接著將所需的氣體資產附加到
寫交易的元數據:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` 是建立域名的普通首次發行路徑,
他們的國家 SNS 這項法律規定,
還是將所有所需的狀態原子化修復.
使用驗證碼 `POST /v1/aliases/setup/plan` 終點或相匹配
CLI 工作流程:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

沒有任何秘密, 但施加步標示
預算是一個常見的交易.
鎖,權威,現實狀態的和截止日期;
網路的使用.

## (無) 註冊 {#un-register}

註冊和不注冊是使用的指示 ID 在 a
該區塊上的新實體.

任何可以註冊的東西都是 `Registrable` 及其他 `Identifiable`,
但並非所有這些 `Identifiable` 是的 `Registrable`. 大部分都是
在某些情況下,
我們使用了這些數據,
建立這些資料結構 (例如: `NewAccount`),與同行
註冊有專用證明所有權指令.
任何可以註冊的東西也可能是未注冊的,
這是一項嚴格且快速的規則.

您可以註冊帳戶,資產定義, NFTs, 他們的同行,角色,
域名設定使用 `EnsureAlias`; 這種原料 `Register::Domain` 實用負荷
專門用于創始/開啟.
`RegisterPeerWithPop`, 請查看我們的資料,
[命名會議](/zh-hant/reference/naming.md) 了解這些限制
請將單位名稱加上.

RWA 透過專業的 `RegisterRwa` 這項指令,
目前的代碼不顯示 `UnregisterRwa` 指示;使用
`RedeemRwa` 退休代表數量

::: info

請注意,
[基因區塊](/zh-hant/guide/configure/genesis.md) 在 `genesis.json`
(具体而言,您是否包括登記許可證
註冊帳戶的過程可能非常不同.
總統,我們可以這樣總結:

- 在一個 _公眾_ 任何人都可以註冊帳戶.
- 在一個 _專屬_ 該區塊可以提供獨特的註冊流程.
  在一項 _典型的_ 沒有私人區塊,
  任何獨特的帳戶註冊流程,
  註冊另一個帳戶.

我們將這些差異討論得很細節,
[比較私人與公共區塊](/zh-hant/guide/configure/modes.md).

:::

::: info

註冊同行目前是唯一的方式,
在網路上設定的原始可信同行的一部分.

:::

Refer 請您參加一本語言指南,
在區塊中註冊物體的過程:

| 語言              | 導覽                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| CLI                   | 請使用 [Iroha CLI](/zh-hant/get-started/operate-iroha-via-cli.md) 建立域名和註冊帳戶及資產. |
| Rust                  | 請使用 [Rust 學習教程](/zh-hant/guide/tutorials/rust.md).                                                      |
| Kotlin/Java           | 請使用 [Kotlin/Java教程](/zh-hant/guide/tutorials/kotlin-java.md).                                        |
| Python                | 請使用 [Python 學習教程](/zh-hant/guide/tutorials/python.md).                                                  |
| JavaScript/TypeScript | 請使用 [JavaScript/TypeScript 學習教程](/zh-hant/guide/tutorials/javascript.md).                               |

規劃並應用普通域設定,然後在沒有域的情況下取消註冊
需要更長時間:

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

註冊和退出帳戶:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

註冊和不注冊的資產定義:

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

註冊和取消注冊 NFTs. NFT 註冊閱讀其內容 JSON 來自
標準輸入:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

註冊和退出注冊的角色:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

註冊和退出注冊的啟動器.
編輯 IVM 這個例子建立了
其他 `Log` 提供教程, CLI 並將它放入引發器登記中:

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

註冊和取消註冊同行. BLS 關鍵和 PoP 在 `kagami`
如果您尚未使用:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## 薄荷/燃燒 {#mint-burn}

和燃燒可以指數值資產,
有些資產可以被申報為不可拆除,
他們只能在註冊後一次.

預算的時間:
數量是非負的,所以你可以
我從來沒有 `$-1.0` 還是燃燒負金額,

請參考語言指南之一,
在區塊中挖掘資產的過程:

- [CLI](/zh-hant/get-started/operate-iroha-via-cli.md)
- [Rust](/zh-hant/guide/tutorials/rust.md)
- [Kotlin/Java](/zh-hant/guide/tutorials/kotlin-java.md)
- [Python](/zh-hant/guide/tutorials/python.md)
- [JavaScript/TypeScript](/zh-hant/guide/tutorials/javascript.md)

以下是燃燒資產的例子:

- [CLI](/zh-hant/get-started/operate-iroha-via-cli.md)
- [Rust](/zh-hant/guide/tutorials/rust.md)

硬幣和燃燒數值:

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

和燃燒触發器重複:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## 轉移 {#transfer}

轉移所有權或價值在帳戶之間.
變量涵蓋域,資產定義,數值資產, NFTs. RWA
數量移動使用專用 `TransferRwa` 及其他 `ForceTransferRwa`
在下列指令中描述的 [實際財產](/zh-hant/blockchain/rwas.md).

必須提供帳號,
[轉移資產的許可](/zh-hant/reference/permissions.md). 請參考一項
如何轉移資產的例子
[CLI](/zh-hant/get-started/operate-iroha-via-cli.md) 或是
[Rust](/zh-hant/guide/tutorials/rust.md).

轉移數值資產:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

轉移領域,資產定義,以及 NFT 所有權:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## 預約和資產鎖定 {#native-escrow-and-asset-locks}

在本書管理的協議中, 鎖定數值資產的原始保證指令
經營市場模式的清算,
密封鎖,以及匿名的保證金流通.

市場保證使用 `OpenAssetEscrow`, `AcceptAssetEscrow`,
`MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`,
`OpenEscrowDispute`, 及其他 `ResolveEscrowDispute`. 常用資產鎖匙
`OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, 及其他
`ExpireAssetLock`. 匿名保證人反映了市場生命周期,
`OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`,
`MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`,
`CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, 及其他
`ResolveAnonymousEscrowDispute`.

這些 ISIs 目前沒有一等級 CLI 使用打字 SDK
建造者或序列化指令有效載體,
[預借本地資產](/zh-hant/blockchain/escrow.md) 關於生命周期的細節,
授權,查詢,事件,以及 Rust 提供其他例子.

## 授予/撤銷 {#grant-revoke}

授予和撤回指令使用為帳號
[權限和角色](permissions.md).

`Grant` 使用於永久授予使用者單一許可,或
授予的角色和權限只能提供
透過 `Revoke` 這項指令應該
請小心使用.

在帳戶上提供或撤銷角色:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

授予和撤回許可令牌.
從標準輸入的對象:

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

這些指示更新對象 [數據](/zh-hant/blockchain/metadata.md). 使用
`SetKeyValue` 插入或更換一個元數據輸入, `RemoveKeyValue` 必須
取消一個.

數據表 `set` 命令閱讀 JSON 標準輸入值:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

對於帳戶,資產定義都有相同的模式, NFTs, RWAs,
導致:

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

`SetParameter` 改變由活性數據所暴露的連鎖範圍內參數
這種情況下,

通過單個參數來設定參數 JSON 標準上的對象
輸入時間:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

這個指示是執行的 [引發器](./triggers.md).

其他國家 CLI 能記錄引發器,並訂閱引發執行事件
沒有提供打字的 `execute trigger` 這樣的命令,
提交手冊 `ExecuteTrigger` 導覽,生成序列化
`InstructionBox` 具有一個 SDK 或執行工具,並通過結果 JSON
透過列表 `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## 其他指示 {#other-instructions}

Iroha 顯示執行時間和執行器的下層次指示
整合:

- `Log`: 在執行過程中發出日志輸入
- `CustomInstruction`: 執行人特定的運行 JSON 使用量
- `Upgrade`: 啟動執行器升級

提交一項 `Log` 請使用平助手的指令:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

提交一個定制執行器指示 `InstructionBox`. 其他國家
執行器特定,因此使用
匹配 SDK 或執行器工具:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

升級執行器從編輯的 IVM 字符串檔案:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
