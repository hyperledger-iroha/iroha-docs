---
translation_locale: zh-hant
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 4a76626522ecb9fe32e98e9c1e4552223cf820d40d0de16690dc589b0f40c901
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama 包裝 {#musubi-kotodama-packages}

Musubi 是 Kotodama 源包的首次發佈包管理器.它解決了一個精確的鏈上依賴圖表,驗證 SoraFS 來源檔案,編譯和測試選定的工作空間,構建正規的 CAR 檔案,並通過 Iroha 發佈不可變的版本.

使用 Musubi 當需要:

- 發佈可重複使用的 Kotodama 函數庫
- 在 `Musubi.lock` 中刻出一個準確的過渡圖
- 從最終完成的 SoraFS 檔案承諾中重建依賴來源
- 構建和測試一個包裝或多包裝工作空間
- 通過連鎖註冊表檢查,發佈,抽取,維護或名包

## 包裝名稱 {#package-names}

標準的包裝選擇器使用:

```text
namespace/package
```

準確發佈標識符添加一個版本:

```text
namespace/package@version
```

沒有領導者 `@` 名稱空間是數據空間根,例如 `universal` 或一個域名合格的數據空間,如 `dex.universal`. 總賬將結構名稱空間綁定到一個穩定的家庭數據空間,然後才能索賠包.

## 宣言和鎖文件 {#manifest-and-lockfile}

一個包裝使用封閉的第一版本 `Musubi.toml`方案.表格必須聲明`manifest-version = 1`, Kotodama 版 `"1"`和 IVM ABI 版本 `1`;沒有替代表格或 ABI 模式.

```toml
manifest-version = 1

[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"
edition = "1"
abi-version = 1

[lib]
source-dir = "src"
exports = ["quote"]

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"
```

依賴性可以使用精確版本,關心或傾斜要求,像 `1.*`這樣的野生卡和逗號分離比較組,如 `>=1.0.0,<2.0.0`.依賴度表鍵是母本地進口姓氏;`package`始終是正規註冊表選擇器.

`Musubi.lock`將圖表綁定到精確的基因來源 `NetworkId` 和一個最終的註冊錄像.它記錄了選定的工作空間根和不可變的釋放節點,包括髮布,源代碼,界面,檔案, ABI 以及精確的依賴邊緣承諾.當解決圖所要求時,允許並行版本.

## 配置 Taira SoraFS 取 {#configure-taira-sorafs-fetching}

Taira 是此工作流的公開測試網絡.從一個 Taira 客戶端配置開始,以鏈接和網絡身份進行檢查,然後在下面添加供應商特定的認證搜索綁定.帳戶簽名材料和供應商運營商密鑰必須保留在唯一的運行時間文件中.

```toml
torii_url = "https://taira.sora.org/"
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"

[musubi.fetch]
network_id = "hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94"
client_id = "musubi-taira"
request_timeout_ms = 30000

[[musubi.fetch.provider_gateways]]
provider_id = "REPLACE_WITH_ADMITTED_PROVIDER_ID_HEX"
url = "REPLACE_WITH_ADVERTISED_PROVIDER_HTTPS_ORIGIN"
operator_public_key = "REPLACE_WITH_PROVIDER_AUTHORIZED_OPERATOR_PUBLIC_KEY"
operator_private_key_file = "./secrets/taira-sorafs-provider.key"
```

在公共測試網根中發現 Taira 的受理供應商:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'
```

提供商目錄提供提供商身份和廣告終端點.從選擇的提供商獲得匹配操作員授權.運行時間使用該鍵請求有限流令牌;令牌既不是 CLI 參數也不是鎖文件內容.

勿使用 Taira 驗證器針 URL 作爲 `url`. 已註冊的驗證器嵌入了 SoraFS 它們的存儲設備已被禁用. `https://taira-validator-{1,2,3,4}.sora.org` 終端點接受PIN註冊,而存檔閱讀使用已選定的被允許提供商的文件 HTTPS 的起源.

## 地方工作流程 {#local-workflow}

從上游 Iroha 工作空間根,創建或輸入包目錄並通過Cargo運行 Musubi:

```bash
mkdir -p examples/swap-core
cd examples/swap-core

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  init . --namespace dex.universal --name swap-core --export quote

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  add std.universal/math --version '^1.0.0' --rename math

cargo run --manifest-path ../../Cargo.toml -p musubi -- fetch --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- check --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- build --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- test --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- package --config client.toml
```

`fetch`解決了最終的註冊表圖,允許時更新`Musubi.lock`,並從認證的 SoraFS 地點填寫不可變的本地緩存. `check`, `build`, `test`和 `package`在自己的工作之前執行相同的圖形和緩存檢查.

使用 `--locked` 拒絕任何鎖文件更改.只使用`--offline` 當註冊表索引和所有需要的檔案都已經緩存時. `--frozen` 結合了這兩個限制.離線緩存失敗; Musubi 永遠不會寫一個未解決的鎖文件.

依賴源通過重寫符合條件的呼叫,如 `math::add()`與確定性內部 Kotodama 名稱進行連接.對未出口函數的依賴呼叫被拒絕.進口庫暴露了函數;本地 `[[contract]]`和 `[[test]]`目標仍然是明確的包目標.

## 緩存驗證和修復 {#cache-verification-and-repair}

公共緩存命令運行在不可變的註冊表提交檔案:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair`隔離腐敗了值得信賴的後代,並在最終供應商證據允許時重新編寫準確的檔案. Musubi 拒絕了活不空的剪切突變.使用`--dry-run`檢查被歸類的候選人.

## 包裝和出版 {#packaging-and-publishing}

在編寫檔案之前檢查清潔的正文件集,然後構建法典包:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` 寫作 `target/package/<namespace>-<name>-<version>.car`. 其他 CAR 結合了法典包裝表,語義釋放表,精確驗證鎖,源樹,界面消化,以及 SoraFS 沒有單獨的文件. `pack`, `--car-out`, `--sorafs-manifest-out`, 或 `--source-plan-out` 在第一個版本中的命令 CLI.

發佈是一個簽署的,可重啓的網絡工作流程.所選的 `client.toml`必須包含生成`[musubi.publication]`綁定以及帳戶和 Taira 網絡配置. 包裝準確一個工作空間成員:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

使用 `--detach` 恢復操作日誌和種子入口邊界是持久的.繼續使用 `publish --resume <operation-id> --config client.toml` 進行持久的操作.較窄的路徑只重建`--recover <operation-id>`沒有出版物 `--dry-run`或通用公衆上傳後退;在本地前飛行中運行`package --list`和 `package`

## 登記問題和生命週期 {#registry-queries-and-lifecycle}

搜索和檢查使用相同的 Taira 客戶端配置的最終註冊表:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  search swap --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  info dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  versions dex.universal/swap-core --config client.toml
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  alias resolve swap --config client.toml
```

揚金排除了從新分辨率中不可改變的釋放,而現有的精確鎖仍然可複製.先閱讀當前的揚金修改,然後提交比較和設置突變:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

使用 `unyank` 與相同的包裝,版本和新閱讀修訂來逆轉該狀態. 包裝所有權和維護角色控制發佈,,元數據,和檔案位置權限. 全球別名有自己的價格註冊,重定位歷史,和比較和設置修訂;它們不是包裝所有權的快捷方式.

## Iroha 表面 {#iroha-surfaces}

Musubi 使用了首次發佈的 V1 說明和查詢:

|表面| 用途                                                        |
| -------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1`|綁定一個名字空間與其穩定的家庭數據空間.|
|`RegisterMusubiArchiveV1`|註冊不可變的身份認證源檔案承諾. |
|`AddMusubiArchiveLocationV1`|添加或更新已證明的 SoraFS 檔案位置. |
|`PublishMusubiReleaseV1`|要求或更新一個包,併發佈一個不可變的版本. |
|`SetMusubiReleaseYankV1`|進行比較並設置精確釋放的拉動狀態.|
|`InviteMusubiPackageMaintainerV1`|啓動明確的包裝角色邀請流. |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |登記或重定位一個全球化名. |
|`AssertMusubiReleaseDigestV1`|確立一個不變的釋放消化.|
|`FindMusubiExactPackageV1`|閱讀一個精確的包裝及其修訂.|
|`FindMusubiExactReleaseV1`|閱讀一個準確的釋放快照.|
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |解決或列出已完成的釋放候選人.|
|`FindMusubiArchiveLocationsV1`|閱讀提供商支持的最終檔案位置. |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |閱讀當前的名目標或其不可變的歷史.|

Torii 顯示下面的應用程序路線家族 `/v1/musubi/`. MCP 工具使用電流 `iroha.musubi.queries.` 和 `iroha.musubi.instructions.*` 他們的名字. [Torii 終點](/zh-hant/reference/torii-endpoints.md) 和 [查詢參考](/zh-hant/reference/queries.md) 爲更廣泛的 API 在地圖上.
