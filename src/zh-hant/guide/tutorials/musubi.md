---
translation_locale: zh-hant
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama 包裝 {#musubi-kotodama-packages}

Musubi 是包裝經理 Kotodama 提供源包.
該網站提供一個像Cargo這樣的工作流程, Kotodama 功能
保持包裹的身份, SORA 及其他 Iroha 而不是名稱空間
提供全球首次來源名稱表.

使用 Musubi 當您需要:

- 發表可重複使用 Kotodama 源圖書館
- 顯示出源依赖性 `Musubi.lock`
- 從驗證的依賴來源重建 SoraFS 檔案承諾
- 聯繫一個包名空間到相同的dapp合同姓氏
  名字空間
- 透過連鎖登記簿檢查,發表,拉克或假名包

## 包裝名稱 {#package-names}

使用可尼克式包裝識別碼:

```text
namespace/package
```

精確的釋放參考使用:

```text
namespace/package@version
```

沒有領導者 `@` 在一個名稱空間之前. `@` 隔離器保留
在版本后音中.

這個名稱區段與使用的后音相匹配 Kotodama 公司合同
姓名:

| 包裝識別碼                | 相關的合同形狀 |
| ------------------------- | ---------------------------- |
| `universal/math`          | `router::universal`          |
| `dex.universal/swap-core` | `router::dex.universal`      |

這裡的名字空間 `<dataspace>` 或是 `<domain>.<dataspace>` 該類型.
包裝有Dapp連結, Musubi 檢查所有相關的合同名稱
使用與包裝相同的命名空間后音.

## 顯示 {#manifest}

包裝從 `Musubi.toml`:

```toml
[package]
namespace = "dex.universal"
name = "swap-core"
version = "0.1.0"

[dependencies.math]
package = "std.universal/math"
version = "^1.0.0"

[exports]
functions = ["quote"]

[dapp]
namespace = "dex.universal"
contracts = ["router::dex.universal"]
```

依賴者可能使用正確的版本,
要求,野生卡等 `1.*`, 或是比较列表,
`>=1.0.0,<2.0.0`.

`Musubi.lock` 記錄從連鎖中選擇的過渡圖表
每個鎖定結節都儲存了其可行的套件參考資料,
要求, SoraFS 顯示資料,源檔案哈希,字節數量,檔案
數量,出口函数,決定性來源檔案計劃,
短名稱在進入
鎖檔案.

## 地方工作流程 {#local-workflow}

來自上流的 Iroha 工作空間根,執行 Musubi 通過貨物:

```bash
cargo run -p musubi -- init --namespace dex.universal --name swap-core --dapp
cargo run -p musubi -- add std.universal/math --version '^1.0.0' --alias math
cargo run -p musubi -- install --config client.toml
cargo run -p musubi -- build src/lib.ko --manifest-out target/lib.contract.json
cargo run -p musubi -- pack \
  --car-out source.car \
  --sorafs-manifest-out manifest.norito \
  --source-plan-out source-plan.norito
```

使用 `install --offline` 寫出未解決的鎖檔,
沒有查詢一個結. `install --locked` 在 CI 必須
拒絕使用舊鎖檔.

`build` 透過重寫呼叫, 將存儲的依賴源連結
`math::add()` 決定性的內部 Kotodama 函數名稱. 它拒絕
要求使用未經依賴的功能. Musubi v1 圖書館
只有功能:包含國家聲明的依賴源,
引發器, kotoba 積木,常數或其他非函数的合同項目
他們被拒絕.

## 尋找資料來源 {#fetching-source-archives}

Musubi 在解決或稍後的情況下,
透過預存器的子命令:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

直接接收門口使用一個或多個 SoraFS 門口供應商的規格:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

提供商用載荷檔案和門口供應商是互相排斥的
如果沒有多個封鎖的包裹,
提供入口方式 `package=<dependency-alias>`,
`package=<namespace/package@version>`, `package=<namespace/package>`, 或是
`manifest=<64-hex SoraFS manifest digest>`.

門口 `base-url` 及其他 `privacy-url` 必須使用值 `https://` 預設的情況.
在本地測試門可使用 `http://localhost`, `http://127.0.0.1`, 或是
`http://[::1]` 只有使用 `--gateway-allow-insecure-localhost`. 流量
代碼是運行時間的認證, `Musubi.lock`.

## 出版社 {#publishing}

`pack` 計算了決定性 BLAKE3-256 源檔案哈希加上
根源字节和檔案數量. `--car-out`, `--sorafs-manifest-out`, 或是
`--source-plan-out` 這也建立了決定性理論. SoraFS
CAR 實用載荷, SoraFS 顯示,以及 Musubi 源檔案圖案
源檔案組

在發布之前使用乾式跑步:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

沒有 `--dry-run`, `publish` 在下列中輸入預設文物
`.musubi/dist/<namespace>/<name>/<version>/`, 選擇性上傳
顯示和有效載荷 Torii 沒有任何問題 SoraFS 存储的端點
`--upload`, 記錄產生的數據 SoraFS ,並提交
`PublishMusubiRelease` 透過設定的 Iroha 這位客戶.

公開的公告必須包括:

- 沒有空的法典源檔案
- 決定性來源檔案計劃
- 至少出口的一個 Kotodama 功能
- 沒有選擇被拉取的釋放
- 如果存在,且其合同姓名與包裹相匹配的dapp連結
  名字空間

## 註冊問題和生命周期 {#registry-queries-and-lifecycle}

搜尋和檢查註冊:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

金隱藏了新解析度的釋放,
可複製:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi 避免全球名字地使用 `namespace/package` 這項政策
在名稱空間中發表必須由
使用相同的所有權或授權模式, Kotodama
選定全球短名稱與包裝分別.
所有權: `SetMusubiShortAlias` 要求: `CanSetMusubiShortAlias`
必須有至少一個活跃的
釋放他們.

## Iroha 表面 {#iroha-surfaces}

Musubi 使用第一級 Iroha 指示和查詢:

| 表面                      | 目的                                            |
| ---------------------------- | -------------------------------------------------- |
| `PublishMusubiRelease`       | 發表不可變的包裝版本.              |
| `YankMusubiRelease`          | 標示已釋放的資料被拉走.                |
| `SetMusubiShortAlias`        | 請將全球簡稱連結到包裝識別碼. |
| `AssertMusubiReleaseExists`  | 需要具體的包裝版本.       |
| `FindMusubiReleaseByRef`     | 請按精確的包裝參考.        |
| `FindMusubiPackageVersions`  | 列出包 ID 的版本.                    |
| `FindMusubiPackageReleases`  | 列出包裝識別碼的公開總結.           |
| `SearchMusubiPackages`       | 按名稱空間和文字搜尋包裝總結.    |
| `FindMusubiShortAliasByName` | 解決了一個精選的短名稱.                     |

Torii 顯示了 Musubi HTTP 在下列路線家族 `/v1/musubi/*`.
面向代理人 MCP 這些工具被曝光為 `iroha.musubi.*` 請見這些名稱.
[Torii 目的地](/zh-hant/reference/torii-endpoints.md) 及其他
[查詢參考](/zh-hant/reference/queries.md) 在更廣泛的情況下 API 這裡有地圖.
