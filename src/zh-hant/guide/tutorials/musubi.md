---
translation_locale: zh-hant
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 621d1795fd1c3cc62462a9a91af68fe684c0ff5293f5e77801420dc8318bac38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# Musubi Kotodama 包裝 {#musubi-kotodama-packages}

Musubi 是 Kotodama 源包的首次釋出包管理器.它解決了一個精確的鏈上依賴圖表,驗證 SoraFS 來源檔案,編譯和測試選定的工作空間,構建規範的 CAR 檔案,並透過 Iroha 釋出不可變的版本.

使用 Musubi 當需要:

- 釋出可重複使用的 Kotodama 函式庫
- 在 `Musubi.lock` 中刻出一個準確的過渡圖
- 從最終完成的 SoraFS 檔案承諾中重建依賴來源
- 構建和測試一個包裝或多包裝工作空間
- 透過連鎖登錄檔檢查,釋出,抽取,維護或名包

## 包裝名稱 {#package-names}

標準的包裝選擇器使用:

```text
namespace/package
```

準確釋出識別符號新增一個版本:

```text
namespace/package@version
```

沒有領導者 `@` 名稱空間是資料空間根,例如 `universal` 或一個域名合格的資料空間,如 `dex.universal`. 總賬將結構名稱空間繫結到一個穩定的家庭資料空間,然後才能索賠包.

## 清單和鎖檔案 {#manifest-and-lockfile}

一個包裝使用封閉的第一版本 `Musubi.toml`方案.清單必須宣告`manifest-version = 1`, Kotodama 版 `"1"`和 IVM ABI 版本 `1`;沒有替代清單或 ABI 模式.

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

依賴性可以使用精確版本,關心或傾斜要求,像 `1.*`這樣的野生卡和逗號分離比較組,如 `>=1.0.0,<2.0.0`.依賴度表鍵是母本地進口別名;`package`始終是規範登錄檔選擇器.

`Musubi.lock`將圖表繫結到精確的創世來源 `NetworkId` 和一個最終的註冊錄影.它記錄了選定的工作空間根和不可變的釋放節點,包括髮布,原始碼,介面,檔案, ABI 以及精確的依賴邊緣承諾.當解決圖所要求時,允許並行版本.

## 配置 Taira SoraFS 取 {#configure-taira-sorafs-fetching}

Taira 是此工作流的公開測試網路.從一個 Taira 客戶端配置開始,包含已註冊連結和當前固定的創世來源網路身份,然後在下面新增供應商特定的認證搜尋鍵.一個 Taira 重置可以改變`NetworkId`;從簽署的部署配置檔案中更新它,而不是從穩定的鏈中推斷它 UUID.帳戶簽名材料和供應商操作員金鑰必須保留在僅所有者執行階段檔案中.

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

提供商目錄提供提供商身份和廣告端點.從選擇的提供商獲得匹配操作員授權.執行階段使用該鍵請求有限流令牌;令牌既不是 CLI 引數也不是鎖檔案內容.

請勿將 Taira 驗證器的 pin URL 用作 `url`。簽入的驗證器已停用內嵌 SoraFS 儲存。其 `https://taira-validator-{1,2,3,4}.sora.org` 端點接受 pin 註冊，而 archive 讀取則使用所選且已獲準 provider 的 HTTPS origin。

## 地方工作流程 {#local-workflow}

從上游 Iroha 工作空間根,建立或輸入包目錄並透過Cargo執行 Musubi:

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

`fetch`解決了最終的登錄檔圖,允許時更新`Musubi.lock`,並從認證的 SoraFS 地點填寫不可變的本地快取. `check`, `build`, `test`和 `package`在自己的工作之前執行相同的圖形和快取檢查.

使用 `--locked` 拒絕任何鎖檔案更改.只使用`--offline` 當登錄檔索引和所有需要的檔案都已經快取時. `--frozen` 結合了這兩個限制.離線快取失敗; Musubi 永遠不會寫一個未解決的鎖檔案.

依賴源透過重寫符合條件的呼叫,如 `math::add()`與確定性內部 Kotodama 名稱進行連線.對未出口函式的依賴呼叫被拒絕.進口庫暴露了函式;本地 `[[contract]]`和 `[[test]]`目標仍然是明確的包目標.

## 快取驗證和修復 {#cache-verification-and-repair}

公共快取命令執行在不可變的登錄檔提交檔案:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache verify --all --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache repair --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  cache prune --dry-run --config client.toml
```

`cache repair` 會隔離已損壞的受信任後代，並在最終確定的供應商證據允許時重新擷取完全相同的封存。對即時且非空的變更，修剪會刻意採用失敗關閉策略；請使用 `--dry-run` 檢查已分類的候選項。

## 包裝和出版 {#packaging-and-publishing}

在編寫檔案之前檢查清潔的正檔案集,然後構建規範包:

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --list --locked --config client.toml

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  package --locked --config client.toml
```

`package` 會寫入 `target/package/<namespace>-<name>-<version>.car`。CAR 會繫結規範套件資訊清單、語意化發行資訊清單、精確的驗證鎖、原始碼樹、介面摘要及 SoraFS 封存承諾。首個版本的 CLI 中沒有獨立的 `pack`、`--car-out`、`--sorafs-manifest-out` 或 `--source-plan-out` 命令。

釋出是一個已簽署且可恢復的網路工作流程。所選的 `client.toml` 必須包含所需的 `[musubi.publication]` 繫結，以及帳戶和 Taira 網路組態。僅封裝一個 workspace member：

```bash
cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  publish -p dex.universal/swap-core --locked --config client.toml
```

操作日誌與種子輸入邊界持久化後，使用 `--detach` 返回。使用 `publish --resume <operation-id> --config client.toml` 繼續持久化的操作。範圍較窄的 `--recover <operation-id>` 路徑只會為未受更動的輸入前日誌重建遺失且不可變的 sidecar。發布沒有 `--dry-run` 或通用公開上傳後備路徑；請執行 `package --list` 與 `package` 進行本機預檢。

## 登記查詢和生命週期 {#registry-queries-and-lifecycle}

搜尋和檢查使用相同的 Taira 客戶端配置的最終登錄檔:

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

揚金排除了從新解析度中不可改變的釋放,而現有的精確鎖仍然可複製.先閱讀當前的揚金修改,然後提交比較和設定突變:

```bash
: "${EXPECTED_YANK_REVISION:?set the current non-zero yank revision}"

cargo run --manifest-path ../../Cargo.toml -p musubi -- \
  yank dex.universal/swap-core 0.1.0 \
  --expected-revision="$EXPECTED_YANK_REVISION" \
  --reason="bad archive" \
  --config client.toml
```

使用 `unyank` 與相同的包裝,版本和新閱讀修訂來逆轉該狀態. 包裝所有權和維護角色控制釋出,,後設資料,和檔案位置許可權. 全球別名有自己的價格註冊,重定位歷史,和比較和設定修訂;它們不是包裝所有權的快捷方式.

## Iroha 表面 {#iroha-surfaces}

Musubi 使用了首次釋出的 V1 說明和查詢:

|表面| 用途                                                        |
| ---------------------------------------------------- | -------------------------------------------------------------- |
|`RegisterMusubiNamespaceBindingV1`|繫結一個名字空間與其穩定的家庭資料空間.|
|`RegisterMusubiArchiveV1`|註冊不可變的身份認證源檔案承諾. |
|`AddMusubiArchiveLocationV1`|新增或更新已證明的 SoraFS 檔案位置. |
|`PublishMusubiReleaseV1`|要求或更新一個包,併釋出一個不可變的版本. |
|`SetMusubiReleaseYankV1`|進行比較並設定精確釋放的拉動狀態.|
|`InviteMusubiPackageMaintainerV1`|啟動明確的包裝角色邀請流. |
|`RegisterMusubiAliasV1` / `RetargetMusubiAliasV1` |登記或重定位一個全球化名. |
|`AssertMusubiReleaseDigestV1`|確立一個不變的釋放摘要.|
|`FindMusubiExactPackageV1`|閱讀一個精確的包裝及其修訂.|
|`FindMusubiExactReleaseV1`|閱讀一個準確的釋放快照.|
|`FindMusubiResolverIndexV1` / `FindMusubiVersionsV1` |解決或列出已完成的釋放候選人.|
|`FindMusubiArchiveLocationsV1`|閱讀提供商支援的最終檔案位置. |
|`FindMusubiAliasV1` / `FindMusubiAliasHistoryV1` |閱讀當前的名目標或其不可變的歷史.|

Torii 顯示下面的應用程式路線家族 `/v1/musubi/*`. MCP 工具使用電流 `iroha.musubi.queries.*` 和 `iroha.musubi.instructions.*` 他們的名字. [Torii 端點](/zh-hant/reference/torii-endpoints.md) 和 [查詢參考](/zh-hant/reference/queries.md) 為更廣泛的 API 在地圖上.
