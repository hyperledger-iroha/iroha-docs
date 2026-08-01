---
translation_locale: zh-hant
translation_source: /guide/tutorials/musubi.md
translation_source_hash: 6b33c687fd1d81d931b932d38908d9a87e9c619e5aca5714d09d892160a6b704
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Musubi Kotodama 包裝 {#musubi-kotodama-packages}

Musubi 是 Kotodama 源包的包管理器. 它爲開發人員提供了類似 Cargo 的工作流程,可以共享可組合的 Kotodama 函數,同時將包裹身份與 SORA 和 Iroha 名字空間聯繫在一起,而不是全球首次出現的名字表.

使用 Musubi 當需要:

- 出版可重複使用的源庫 Kotodama
- 在 `Musubi.lock` 中確定確切的過渡源依賴性
- 從驗證的 SoraFS 檔案承諾中重新構建依賴來源
- 將包名空間連接到同一名區中的dapp合同別名
- 通過連鎖註冊表檢查,發佈,抽取或名包

## 包裝名稱 {#package-names}

可尼克式包裝識別器使用:

```text
namespace/package
```

準確釋放引用使用:

```text
namespace/package@version
```

名稱空間前沒有首頁 `@`. `@`分區爲版本後尾保留.

名稱空間段與 Kotodama dapp合同別名所使用的後相匹配:

|包裝標識|相關合同別名形狀|
| ------------------------- | ---------------------------- |
|`universal/math`|`router::universal`|
|`dex.universal/swap-core`|`router::dex.universal`|

名稱空間要麼具有 `<dataspace>`或`<domain>.<dataspace>`的形式.當一個包裝有dapp鏈接時, Musubi 檢查每個鏈接的合同別名都使用與包裝相同的命名空間後音.

## 顯現 {#manifest}

一個包裝以 `Musubi.toml`開始:

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

依賴性可以使用精確版本,護理要求,點要求,像 `1.*`這樣的野生卡或比較列表,如 `>=1.0.0,<2.0.0`.

`Musubi.lock`將從鏈上登記中記錄選定的過渡圖.每個鎖定節點都存儲了其常規包,所選的要求,SoraFS 表格消化,源檔案哈希,字節計數,文件計數,出口函數,確定性源檔案計劃和依賴姓氏.在進入鎖文件之前解決短名字.

## 地方工作流程 {#local-workflow}

從上游 Iroha 工作空間根,運行 Musubi 通過 Cargo:

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

使用 `install --offline` 來寫一個未解決的鎖文件,不需要查詢節點.在 CI 中使用 `install --locked` 拒絕過時的鎖文件.

`build`通過重寫`math::add()`等調用到確定性內部 Kotodama 函數名稱來將緩存的依賴源鏈接.它拒絕對該依賴未出口的函數的調用.Musubi v1圖書館僅具有功能:包含狀態聲明,觸發器, kotoba 區塊,常量或其他非功能合同項的依賴來源被拒絕.

## 獲取來源檔案 {#fetching-source-archives}

Musubi 可以通過緩存子命令在解決或稍後搜索缺失的依賴源:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --provider-payload math.payload

cargo run -p musubi -- cache import math --source-root ../math
cargo run -p musubi -- cache fetch math --provider-payload math.payload
```

現場網關採集使用一個或多個 SoraFS 網關供應商規格:

```bash
cargo run -p musubi -- install --config client.toml --fetch \
  --gateway-provider 'name=hot-a,provider-id=1111111111111111111111111111111111111111111111111111111111111111,base-url=https://gw.example,stream-token=BASE64,package=math'
```

提供商的有效載荷文件和網關供應商對一個接收操作相互排斥.如果缺少多個鎖定包,請用 `package=<dependency-alias>`,`package=<namespace/package@version>`, `package=<namespace/package>`或 `manifest=<64-hex SoraFS manifest digest>`來查詢每個網關供應商.

門口 `base-url` 和 `privacy-url` 值必須使用 `https://` 默認情況下,本地測試網關可以使用 `http://localhost`, `http://127.0.0.1`, 或 `http://[::1]` 只有 `--gateway-allow-insecure-localhost`. 流通令牌是運行時間憑證,並非寫入 `Musubi.lock`.

## 出版物 {#publishing}

`pack`計算了確定性的 BLAKE3-256 源檔案哈希加上源字節和文件計數.當 `--car-out`, `--sorafs-manifest-out`或 `--source-plan-out`是在提供時,它還從同一源文件集中構建了確定性的 SoraFS CAR 實用載荷, SoraFS 表格和 Musubi 源檔案計劃.

在發佈之前使用乾燥運行:

```bash
cargo run -p musubi -- publish --config client.toml --dry-run
```

沒有 `--dry-run`, `publish` 將默認的文物寫在 `.musubi/dist/<namespace>/<name>/<version>/`, 選擇性上傳表格和有效載荷 Torii 沒有什麼. SoraFS 存儲終端點 `--upload`, 記錄生成的數據 SoraFS 子,並提交 `PublishMusubiRelease` 通過配置的 Iroha 客戶.

發佈的公告必須包括:

- 一個不空的法典源檔案
- 一個確定性源檔案計劃
- 至少一個出口的 Kotodama 函數
- 沒有選擇被拖放的依賴性記錄
- 如果存在,其合同別名與包裝名稱空間相匹配的dapp鏈接

## 登記問題和生命週期 {#registry-queries-and-lifecycle}

搜索和檢查註冊表,使用:

```bash
cargo run -p musubi -- search swap --config client.toml
cargo run -p musubi -- versions dex.universal/swap-core --config client.toml
cargo run -p musubi -- alias resolve swap --config client.toml
```

揚金隱藏了新的分辨率的釋放,但保持現有鎖文件可複製:

```bash
cargo run -p musubi -- yank dex.universal/swap-core@0.1.0 \
  --reason "bad archive" \
  --config client.toml \
  --dry-run
```

Musubi 通過將 `namespace/package` 作爲規範包名來避免全球名稱縮.在一個命名空間中發佈必須由相同的所有權或授權許可模型授權使用該 Kotodama dapp名稱空間.`SetMusubiShortAlias`需要`CanSetMusubiShortAlias`的許可,目標包必須已經有至少一個活躍的發行.

## Iroha 表面 {#iroha-surfaces}

Musubi 使用第一類 Iroha 說明和查詢:

|表面|目的|
| ---------------------------- | -------------------------------------------------- |
|`PublishMusubiRelease`|發佈一個不可變的包裝版本.|
|`YankMusubiRelease`|標記現有釋放爲被拉走的.|
|`SetMusubiShortAlias`|綁定一個全球簡短代號到一個包郵身份證.|
|`AssertMusubiReleaseExists`|需要一個具體的包裝版本才能存在.|
|`FindMusubiReleaseByRef`|根據具體的包裝引用,請收取一個釋放.|
|`FindMusubiPackageVersions`|列出包 ID 的版本. |
|`FindMusubiPackageReleases`|列出一個包郵身份的發佈總結. |
|`SearchMusubiPackages`|按名字空間和文字搜索包總結. |
|`FindMusubiShortAliasByName`|解決一個簡短的姓氏.|

Torii 揭示了 Musubi HTTP 下面的路線家族 `/v1/musubi/`. 面向代理人 MCP 工具被曝光爲 `iroha.musubi.` 其他名字. [Torii 終點](/zh-hant/reference/torii-endpoints.md) 和 [查詢參考](/zh-hant/reference/queries.md) 爲更廣泛的 API 在地圖上.
