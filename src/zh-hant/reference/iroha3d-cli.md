---
translation_locale: zh-hant
translation_source: /reference/iroha3d-cli.md
translation_source_hash: 846370e45fe0e0d605016d6722b1d50c39981f954c7d9040b87fc385eb12ac68
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# `iroha3d` CLI {#iroha3d-cli}

`iroha3d`是標準的 Iroha 3 對等節點守護程式.Cargo 軟體套件名稱為 `irohad`,所以從源支付中呼叫二進位制:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

對於公眾 Taira 測試網,釋放圖片使用`iroha3d_taira`. 它接受相同的 CLI. 此外,它還執行了規範的 Taira 鏈,驗證器組,儲存設定和執行時簽名金鑰. 驗證一個 Taira 配置,不開啟執行階段憑證如下:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

請使用操作員完成具體設定的標準 Taira 設定檔；儲存庫中的範本仍含有部署預留值。針對 Taira 進行測試時，不要替換成通用的 SORA Nexus 或生產環境的 SoraFS 設定。

## `--config` {#arg-config}

- 型別:檔案路徑
- 姓名: `-c`

進入 [對等節點配置的路徑](/zh-hant/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- 型別:檔案路徑

選擇性創世表 JSON 用於共識驗證.

## `--check-config` {#arg-check-config}

驗證已解決的配置和可用的創世材料,然後無需繫結網路插座退出.

## `--json` {#arg-json}

- **類型：** 開關選項
- **需要：** `--check-config`

將此編譯版本與設定的相容性值輸出為單一 Norito JSON 物件，取代 `Ready` 或 `Pending` 文字列。

## `--check-storage` {#arg-check-storage}

- **類型：** 開關選項
- **不可同時使用：** `--check-config`

以此編譯版本的解碼器，唯讀檢查已停止節點的 Kura 儲存與最新快照，將結果輸出為單一 Norito JSON 物件，並在失敗時以非零代碼結束。此檢查會取得 Kura 儲存根鎖，因此會拒絕正在執行的節點持有的儲存。它不會修改儲存，也不會開啟僅供執行時使用的機密。

## `--check-replay` {#arg-check-replay}

- **類型：** 開關選項
- **不可同時使用：** `--check-config`、`--check-storage`

使用此編譯版本重播已停止節點的儲存副本，並將結果輸出為單一 Norito JSON 物件。命令會將區塊複製到暫存目錄，在該處還原最新快照或重新執行簽署的創世資料，再重新執行所有後續區塊。若區塊無法重現其已認證結果，或缺少必要的區塊主體，命令會以非零代碼結束；它不會寫入原儲存，也不會開啟僅供執行時使用的機密。

## `--require-genesis-inrou-deployment-authority` {#arg-require-genesis-inrou-deployment-authority}

- **類型：** 帳戶 ID
- **需要：** `--check-config`

在離線驗證期間，要求此已註冊帳戶在執行確切的簽署創世資料後，仍保有 SoraCloud 部署權限。

## `--sumeragi-assert-fresh-key` {#arg-sumeragi-assert-fresh-key}

- **類型：** 開關選項

僅在這次開機時聲明：節點的共識金鑰從未為此鏈簽署。Sumeragi 為每把金鑰保留安全記錄；若記錄不存在，在能證明該記錄並未遺失之前，它不會簽署任何內容。此選項只能在新金鑰第一次開機時傳入一次，資料遺失後絕不可使用。

## `--trace-config` {#arg-trace-config}

- 型別:旗
- 環境: `TRACE_CONFIG`

在配置層被讀取和解析時,啟用追蹤日誌.

## `--config-blake3` {#arg-config-blake3}

- 型別:64位的六位數摘要 BLAKE3
- 要求: `--config`

要求配置檔案位元組匹配所提供的摘要. 一個完整性繫結的檔案必須是平坦的;它不能包含 `extends`.

## `--terminal-colors` {#arg-terminal-colors}

- 型別:布林式,透過 `--terminal-colors=true`或 `--terminal-colors=false`
- 預設:終端能力檢測
- 環境: `TERMINAL_COLORS`

控制 ANSI 顏色輸出.

## `--language` {#arg-language}

- 型別:串

覆寫守護程式訊息所使用的系統語言。

## `--sora` {#arg-sora}

- 型別:旗
- 環境: `IROHA_SORA_PROFILE`

啟用 SoraFS、SoraNet 交握與多通道共識所用的 SORA Nexus 設定檔。Taira 啟動器每次都會帶上此選項。

## FastPQ 覆蓋範圍 {#fastpq-overrides}

`--fastpq-execution-mode <MODE>`和 `--fastpq-poseidon-mode <MODE>`只接受`cpu`或 `gpu`.其餘的選項取消了遠端測量標籤:

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

例如:

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## 產生的幫助 {#generated-help}

上述選項摘要依據固定 Iroha 提交版本中的 `iroha3d` 引數定義。若要檢視您目前原始碼工作副本的確切說明，請執行：

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
