---
translation_locale: zh-hant
translation_source: /reference/iroha3d-cli.md
translation_source_hash: bf4a63b05a149f0c935190b63cdb838b0a0265e99baedfc9b5bf00a9e621b108
translation_status: machine-validated
translation_engine: nllb-200-ct2
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

運營商必須在使用前呈現規範的 Taira 配置檔案. 已註冊的模板有示例設定. 操作員必須取代每一個示例設定. 在與 Taira 進行測試時,不要使用通用 Nexus 或生產 SoraFS 設定.

## `--config` {#arg-config}

- 型別:檔案路徑
- 姓名: `-c`

進入 [對等節點配置的路徑](/zh-hant/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- 型別:檔案路徑

選擇性創世表 JSON 用於共識驗證.

## `--check-config` {#arg-check-config}

驗證已解決的配置和可用的創世材料,然後無需繫結網路插座退出.

## 卡蓋穆沙資格章 {#kagemusha-qualification-seals}

這些檔案路徑選項需要 `--check-config` 並在寫定章之前完成完整的Kagemusha資格:

- `--write-kagemusha-catalog-qualification-seal <PATH>` 符合目錄的要求.
- `--write-kagemusha-validator-qualification-seal <PATH>`使本地驗證者符合配置簽署的促銷預訂條件.

兩種密封選項相互衝突.

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

啟用Sora Nexus 配置檔案. 該配置檔案設定 SoraFS,SoraNet 握手,以及多行道共識. 總是用這個旗呼叫 Taira 啟動器

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

上面的選項摘要已根據目前的 `iroha3d` 引數定義進行驗證。簽入儲存庫的已產生說明快照在其來源狀態仍待確認時不會呈現。若要檢視與目前原始碼簽出完全一致的說明，請執行：

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
